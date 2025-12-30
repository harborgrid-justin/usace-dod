
import React, { useState, useMemo } from 'react';
import { 
    ArrowLeft, FileText, DollarSign, Send, CheckCircle, Ban, 
    Plus, AlertTriangle, ShieldAlert, TrendingUp, Calendar, Database
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
        <div className="flex flex-col h-full space-y-8 animate-in slide-in-from-right-4">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 border-b border-zinc-200 pb-6 shrink-0">
                <button onClick={onBack} className="p-3 bg-zinc-50 border border-zinc-200 rounded-sm text-zinc-500 hover:text-zinc-900 transition-all shadow-sm">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Order {order.id}</h2>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase ${order.status === 'Complete' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 font-medium">{order.customer} • {order.description}</p>
                </div>
                {integrationMsg && (
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-sm text-xs font-bold border border-indigo-100 flex items-center gap-2 animate-in fade-in shadow-sm">
                        <Database size={14}/> {integrationMsg}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                
                {/* Left Column: Financial Status & Billing Form */}
                <div className="lg:col-span-2 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                    {/* Financial Progress */}
                    <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <TrendingUp size={16} className="text-zinc-400"/> Financial Execution
                        </h3>
                        <div className="mb-8">
                            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                                <span>Billed vs. Authority</span>
                                <span className="text-zinc-900">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full ${progress > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div className="p-4 bg-zinc-50 rounded-sm border border-zinc-100">
                                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Total Order</p>
                                <p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-sm border border-emerald-100">
                                <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest mb-1">Billed</p>
                                <p className="text-xl font-mono font-bold text-emerald-800">{formatCurrency(billedAmount)}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-sm border border-blue-100">
                                <p className="text-[9px] text-blue-700 font-bold uppercase tracking-widest mb-1">Remaining</p>
                                <p className="text-xl font-mono font-bold text-blue-800">{formatCurrency(remainingToBill)}</p>
                            </div>
                        </div>
                    </div>

                    {/* New Bill Form (Inline) */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-md p-8 shadow-inner">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Plus size={16} className="text-zinc-500"/> Generate Billing
                        </h3>
                        <form onSubmit={handleSubmitBill} className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {(['labor', 'material', 'overhead', 'surcharge'] as const).map(field => (
                                    <div key={field}>
                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest capitalize ml-1">{field}</label>
                                        <div className="relative mt-1.5">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                                            <input 
                                                type="number" 
                                                value={costs[field]} 
                                                onChange={e => handleCostChange(field, e.target.value)} 
                                                className="w-full bg-white border border-zinc-200 rounded-sm py-2.5 pl-7 pr-3 text-sm font-mono font-bold text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all shadow-sm" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-3 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-zinc-200 rounded-sm hover:border-zinc-300 transition-all">
                                    <input type="checkbox" checked={isAdvanceBilling} onChange={e => setIsAdvanceBilling(e.target.checked)} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"/>
                                    <span className="text-xs font-bold text-zinc-700">Flag as Advance Billing (Pre-Performance)</span>
                                </label>
                                {isAdvanceBilling && (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-sm border border-amber-100 uppercase tracking-wide">
                                        <ShieldAlert size={12}/> Requires Waiver
                                    </span>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center gap-3 text-xs font-bold text-rose-700 animate-in fade-in">
                                    <AlertTriangle size={16}/> {error}
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-6 border-t border-zinc-200/50">
                                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                                    Total Bill: <span className="font-mono font-bold text-zinc-900 text-base ml-2">{formatCurrency(newBillTotal)}</span>
                                </div>
                                <button type="submit" className="px-6 py-2.5 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                                    <FileText size={14}/> Draft Bill
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Billing History */}
                <div className="bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden h-full">
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Billing History</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                        {billings.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400 flex flex-col items-center gap-3">
                                <FileText size={32} className="opacity-20"/>
                                <p className="text-xs font-bold uppercase tracking-widest">No billings recorded</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100">
                                {billings.map(bill => (
                                    <div key={bill.id} className="p-5 hover:bg-zinc-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-sm">{bill.id}</span>
                                                {bill.isAdvanceBilling && <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 rounded-sm uppercase font-bold border border-amber-100">Adv</span>}
                                            </div>
                                            <span className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(bill.total)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-4">
                                            <span className="flex items-center gap-1.5 font-medium"><Calendar size={12}/> {bill.billingDate}</span>
                                            <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                                                bill.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                                                bill.status === 'Sent' ? 'bg-blue-50 text-blue-600' : 
                                                bill.status === 'Canceled' ? 'bg-rose-50 text-rose-600' : 'bg-zinc-100 text-zinc-500'
                                            }`}>{bill.status}</span>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-zinc-50">
                                            {bill.status === 'Draft' && (
                                                <>
                                                    <button onClick={() => handleSendBill(bill.id, bill.total)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-sm text-[9px] font-bold uppercase hover:bg-blue-500 shadow-sm transition-all">
                                                        <Send size={10}/> Send
                                                    </button>
                                                    <button onClick={() => onUpdateBillStatus(bill.id, 'Canceled')} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-sm text-[9px] font-bold uppercase hover:bg-rose-100 border border-rose-100 transition-all">
                                                        <Ban size={10}/> Void
                                                    </button>
                                                </>
                                            )}
                                            {bill.status === 'Sent' && (
                                                <button onClick={() => onUpdateBillStatus(bill.id, 'Paid')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-sm text-[9px] font-bold uppercase hover:bg-emerald-500 shadow-sm transition-all">
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
