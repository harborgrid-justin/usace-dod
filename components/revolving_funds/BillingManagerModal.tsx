import React, { useState, useMemo } from 'react';
import { X, PlusCircle, AlertTriangle, Send, CheckCircle, Ban, ShieldAlert } from 'lucide-react';
import { DWCFOrder, DWCFBilling, DWCFBillingStatus } from '../../types';
import { formatCurrencyExact } from '../../utils/formatting';
import { evaluateRules } from '../../utils/rulesEngine';
import { MOCK_BUSINESS_RULES } from '../../constants';

interface Props {
  order: DWCFOrder;
  billings: DWCFBilling[];
  onClose: () => void;
  onAddBill: (orderId: string, newBillData: Omit<DWCFBilling, 'id' | 'orderId' | 'status'>) => void;
  onUpdateBillStatus: (billId: string, newStatus: DWCFBillingStatus) => void;
}

const BillingManagerModal: React.FC<Props> = ({ order, billings, onClose, onAddBill, onUpdateBillStatus }) => {
  const [showForm, setShowForm] = useState(false);
  const [costs, setCosts] = useState({ labor: 0, material: 0, overhead: 0, surcharge: 0 });
  const [isAdvanceBilling, setIsAdvanceBilling] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const billedAmount = useMemo(() => 
    billings.filter(b => b.status !== 'Canceled').reduce((sum, b) => sum + b.total, 0), 
    [billings]
  );
  const remainingToBill = order.totalAmount - billedAmount;
  // Use typed reduce to ensure number return type
  const newBillTotal = Object.values(costs).reduce<number>((sum, val) => sum + Number(val), 0);

  const handleCostChange = (field: keyof typeof costs, value: string) => {
    setCosts(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleSubmitBill = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setWarning('');

    // Explicitly cast to number if type inference fails
    if (newBillTotal <= 0) {
      setError('Bill total must be greater than zero.');
      return;
    }
    
    // Rule Check: Advance Billing (DWCF-003)
    const context = { isAdvanceBilling };
    const ruleResults = evaluateRules(MOCK_BUSINESS_RULES.filter(r => r.code === 'DWCF-003'), context);
    const violation = ruleResults.find(r => !r.passed);

    if (violation && !confirm("Warning: Advance Billing detected. This requires OUSD(C) approval per 10 U.S.C. 2208(l). Do you have authorization to proceed?")) {
        return;
    }

    if (newBillTotal > remainingToBill) {
      setError(`Bill total exceeds remaining amount. ${formatCurrencyExact(remainingToBill)}`);
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
    setShowForm(false);
  };
  
  const StatusBadge: React.FC<{ status: DWCFBillingStatus }> = ({ status }) => {
    const classes = {
        'Draft': 'bg-zinc-100 text-zinc-700 border-zinc-200',
        'Sent': 'bg-blue-100 text-blue-800 border-blue-200',
        'Paid': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Canceled': 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${classes[status]}`}>{status}</span>
  }

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between mb-4 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Revenue Billing Manager</h3>
            <p className="text-xs text-zinc-500">{order.customer}: {order.description}</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors"><X size={18} /></button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-xs shrink-0">
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg"><span className="font-medium text-zinc-500">Total Order:</span> <span className="font-mono font-bold float-right">{formatCurrencyExact(order.totalAmount)}</span></div>
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg"><span className="font-medium text-zinc-500">Billed:</span> <span className="font-mono font-bold text-emerald-600 float-right">{formatCurrencyExact(billedAmount)}</span></div>
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg"><span className="font-medium text-zinc-500">Remaining:</span> <span className="font-mono font-bold text-zinc-800 float-right">{formatCurrencyExact(remainingToBill)}</span></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
          {showForm ? (
            <form onSubmit={handleSubmitBill} className="p-4 bg-blue-50/30 border border-blue-100 rounded-lg space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest">New Monthly Bill</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['labor', 'material', 'overhead', 'surcharge'] as const).map(field => (
                  <div key={field}>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest capitalize">{field}</label>
                    <input type="number" value={costs[field]} onChange={e => handleCostChange(field, e.target.value)} className="w-full mt-1 bg-white border border-zinc-200 rounded-lg p-2 text-sm text-zinc-900 focus:outline-none focus:border-blue-400" />
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="advBill" checked={isAdvanceBilling} onChange={e => setIsAdvanceBilling(e.target.checked)} className="rounded border-zinc-300"/>
                  <label htmlFor="advBill" className="text-xs font-bold text-zinc-700">Flag as Advance Billing (Pre-Performance)</label>
              </div>
              {isAdvanceBilling && (
                  <div className="flex items-center gap-2 text-amber-700 text-[10px] bg-amber-50 p-2 rounded border border-amber-100">
                      <ShieldAlert size={12}/> Requires OUSD(C) Waiver (10 USC 2208)
                  </div>
              )}

              <div className="p-3 bg-white/50 border border-zinc-200 rounded-lg flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase">New Bill Total</span>
                <span className="text-sm font-mono font-bold text-blue-600">{formatCurrencyExact(newBillTotal)}</span>
              </div>
              {error && <p className="text-xs text-rose-600 font-medium flex items-center gap-2"><AlertTriangle size={14}/> {error}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800">Save Draft</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 p-3 bg-zinc-50 hover:bg-zinc-100 border border-dashed border-zinc-300 rounded-lg text-xs font-bold text-zinc-600 transition-colors">
              <PlusCircle size={14}/> Create New Bill
            </button>
          )}

          {/* Existing Bills */}
          <div className="space-y-2">
            {billings.map(bill => (
                <div key={bill.id} className="p-3 border border-zinc-100 rounded-lg hover:bg-zinc-50/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-zinc-800">Bill ID: <span className="font-mono">{bill.id}</span></p>
                            <p className="text-[10px] text-zinc-500 font-mono">Date: {bill.billingDate}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {bill.isAdvanceBilling && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">ADVANCE</span>}
                            <span className="text-sm font-mono font-bold">{formatCurrencyExact(bill.total)}</span>
                            <StatusBadge status={bill.status} />
                            {bill.status === 'Draft' && (
                                <div className="flex gap-1">
                                    <button onClick={() => onUpdateBillStatus(bill.id, 'Sent')} className="p-1.5 text-zinc-400 hover:text-blue-600"><Send size={14}/></button>
                                    <button onClick={() => onUpdateBillStatus(bill.id, 'Canceled')} className="p-1.5 text-zinc-400 hover:text-rose-600"><Ban size={14}/></button>
                                </div>
                            )}
                             {bill.status === 'Sent' && (
                                <button onClick={() => onUpdateBillStatus(bill.id, 'Paid')} className="p-1.5 text-zinc-400 hover:text-emerald-600"><CheckCircle size={14}/></button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingManagerModal;