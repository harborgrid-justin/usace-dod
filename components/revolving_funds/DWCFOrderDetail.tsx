
import React, { useState, useMemo } from 'react';
import { 
    ArrowLeft, FileText, DollarSign, Send, CheckCircle, Ban, 
    Plus, AlertTriangle, ShieldAlert, TrendingUp, Calendar, User, Database
} from 'lucide-react';
import { DWCFOrder, DWCFBilling, DWCFBillingStatus, ReimbursableOrder } from '../../types';
import { formatCurrency, formatCurrencyExact } from '../../utils/formatting';
import { MOCK_BUSINESS_RULES } from '../../constants';
import { evaluateRules } from '../../utils/rulesEngine';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';

interface Props {
    order: DWCFOrder;
    billings: DWCFBilling[];
    onBack: () => void;
    onAddBill: (orderId: string, newBillData: Omit<DWCFBilling, 'id' | 'orderId' | 'status'>) => void;
    onUpdateBillStatus: (billId: string, newStatus: DWCFBillingStatus) => void;
}

const DWCFOrderDetail: React.FC<Props> = ({ order, billings, onBack, onAddBill, onUpdateBillStatus }) => {
    const [costs, setCosts] = useState({ labor: 0, material: 0, overhead: 0, surcharge: 0 });
    const [isAdvanceBilling, setIsAdvanceBilling] = useState(false);
    const [error, setError] = useState('');
    const [integrationMsg, setIntegrationMsg] = useState('');
    
    // Derived State
    const billedAmount = useMemo(() => 
        billings.filter(b => b.status !== 'Canceled').reduce((sum, b) => sum + b.total, 0), 
        [billings]
    );
    const remainingToBill = order.totalAmount - billedAmount;
    const progress = (billedAmount / order.totalAmount) * 100;
    
    const newBillTotal = Object.values(costs).reduce<number>((sum, val) => sum + Number(val), 0);

    const handleCostChange = (field: keyof typeof costs, value: string) => {
        setCosts(prev => ({ ...prev, [field]: Number(value) || 0 }));
    };

    const handleSendBill = (billId: string, amount: number) => {
        // Integration #10: Revenue Recognition
        // Mocking ReimbursableOrder structure for the service call based on DWCFOrder
        const reimbursableOrderMock: ReimbursableOrder = {
            id: order.id,
            agreementId: 'DWCF-AGR',
            orderNumber: order.id,
            authority: '10 USC 2208',
            amount: order.totalAmount,
            billingFrequency: 'Monthly'
        };

        const glEntry = IntegrationOrchestrator.generateRevenueRecognition(reimbursableOrderMock, amount);
        
        if (glEntry) {
            setIntegrationMsg(`GL Integration: Revenue of ${formatCurrency(amount)} recognized (Doc: ${glEntry.id}).`);
            console.log('Revenue Recognition:', glEntry);
        }

        onUpdateBillStatus(billId, 'Sent');
    };

    const handleSubmitBill = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIntegrationMsg('');

        if (newBillTotal <= 0) {
            setError('Bill total must be greater than zero.');
            return;
        }
        
        if (newBillTotal > remainingToBill && !isAdvanceBilling) { 
             setError(`Bill total exceeds remaining order balance of ${formatCurrencyExact(remainingToBill)}.`);
             return;
        }

        // Rule Check: Advance Billing (DWCF-003)
        const context = { isAdvanceBilling };
        const ruleResults = evaluateRules(MOCK_BUSINESS_RULES.filter(r => r.code === 'DWCF-003'), context);
        const violation = ruleResults.find(r => !r.passed);

        if (violation && !confirm("Warning: Advance Billing detected. This requires OUSD(C) approval per 10 U.S.C. 2208(l). Do you have authorization to proceed?")) {
            return;
        }

        onAddBill(order.id, {
            billingDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            isAdvanceBilling,
            costs,
            total: newBillTotal,
        });
        setCosts({ labor: 0, material: 0, overhead: 0, surcharge: 0 });
        setIsAdvanceBilling(false);
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-in slide-in-from-right-4">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 border-b border-zinc-200 pb-4">
                <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                        Order {order.id}
                        <span className={`text-xs px-2 py-0.5 rounded border uppercase ${order.status === 'Complete' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                            {order.status}
                        </span>
                    </h2>
                    <p className="text-xs text-zinc-500">{order.customer} • {order.description}</p>
                </div>
                {integrationMsg && (
                    <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2 animate-in fade-in">
                        <Database size={14}/> {integrationMsg}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Financial Status & Billing Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Financial Progress */}
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp size={14} className="text-zinc-400"/> Financial Execution
                        </h3>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="font-medium text-zinc-600">Billed vs. Authority</span>
                                <span className="font-mono font-bold text-zinc-900">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className={`h-full ${progress > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Order</p>
                                <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</p>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <p className="text-[10px] text-emerald-700 font-bold uppercase">Billed</p>
                                <p className="text-lg font-mono font-bold text-emerald-800">{formatCurrency(billedAmount)}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-[10px] text-blue-700 font-bold uppercase">Remaining</p>
                                <p className="text-lg font-mono font-bold text-blue-800">{formatCurrency(remainingToBill)}</p>
                            </div>
                        </div>
                    </div>

                    {/* New Bill Form (Inline) */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Plus size={14} className="text-zinc-400"/> Generate Billing
                        </h3>
                        <form onSubmit={handleSubmitBill} className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(['labor', 'material', 'overhead', 'surcharge'] as const).map(field => (
                                    <div key={field}>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest capitalize">{field}</label>
                                        <div className="relative mt-1">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                                            <input 
                                                type="number" 
                                                value={costs[field]} 
                                                onChange={e => handleCostChange(field, e.target.value)} 
                                                className="w-full bg-white border border-zinc-200 rounded-lg py-2 pl-6 pr-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-2 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={isAdvanceBilling} onChange={e => setIsAdvanceBilling(e.target.checked)} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"/>
                                    <span className="text-xs font-bold text-zinc-700">Advance Billing (Pre-Performance)</span>
                                </label>
                                {isAdvanceBilling && (
                                    <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                                        <ShieldAlert size={10}/> Requires Waiver
                                    </span>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-xs font-bold text-rose-700 animate-in fade-in">
                                    <AlertTriangle size={14}/> {error}
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-zinc-200/50">
                                <div className="text-xs font-medium text-zinc-500">
                                    Total Bill: <span className="font-mono font-bold text-zinc-900 text-sm ml-1">{formatCurrency(newBillTotal)}</span>
                                </div>
                                <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2">
                                    <FileText size={14}/> Draft Bill
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Billing History */}
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Billing History</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                        {billings.length === 0 ? (
                            <div className="p-8 text-center text-zinc-400">
                                <FileText size={32} className="mx-auto mb-2 opacity-20"/>
                                <p className="text-xs">No billings generated yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100">
                                {billings.map(bill => (
                                    <div key={bill.id} className="p-4 hover:bg-zinc-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-zinc-800">{bill.id}</span>
                                                {bill.isAdvanceBilling && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 rounded uppercase font-bold">Adv</span>}
                                            </div>
                                            <span className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(bill.total)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-2">
                                            <span className="flex items-center gap-1"><Calendar size={10}/> {bill.billingDate}</span>
                                            <span className={`font-bold uppercase ${
                                                bill.status === 'Paid' ? 'text-emerald-600' : 
                                                bill.status === 'Sent' ? 'text-blue-600' : 
                                                bill.status === 'Canceled' ? 'text-rose-600' : 'text-zinc-500'
                                            }`}>{bill.status}</span>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            {bill.status === 'Draft' && (
                                                <>
                                                    <button onClick={() => handleSendBill(bill.id, bill.total)} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-[9px] font-bold uppercase hover:bg-blue-100 border border-blue-100">
                                                        <Send size={10}/> Send
                                                    </button>
                                                    <button onClick={() => onUpdateBillStatus(bill.id, 'Canceled')} className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded text-[9px] font-bold uppercase hover:bg-rose-100 border border-rose-100">
                                                        <Ban size={10}/> Void
                                                    </button>
                                                </>
                                            )}
                                            {bill.status === 'Sent' && (
                                                <button onClick={() => onUpdateBillStatus(bill.id, 'Paid')} className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold uppercase hover:bg-emerald-100 border border-emerald-100">
                                                    <CheckCircle size={10}/> Mark Paid
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DWCFOrderDetail;
