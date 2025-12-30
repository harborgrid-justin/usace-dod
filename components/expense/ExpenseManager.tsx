
import React, { useState, useTransition, useMemo } from 'react';
import { Obligation, Expense, ExpenseUserRole } from '../../types';
import { formatCurrency, formatCurrencyExact } from '../../utils/formatting';
import { BookCopy, AlertTriangle, Plus, Send, Check, DollarSign, ArrowRight, ShieldCheck, Database, History, User } from 'lucide-react';
import AuditTrail from './AuditTrail';
import Badge from '../shared/Badge';

interface Props {
    activeUser: ExpenseUserRole;
    obligations: Obligation[];
    expenses: Expense[];
    onNewExpense: (data: Omit<Expense, 'id' | 'status' | 'createdBy' | 'auditLog'>) => void;
    onApprove: (expenseId: string) => void;
    onDisburse: (expenseId: string) => void;
}

const ExpenseManager: React.FC<Props> = ({ activeUser, obligations, expenses, onNewExpense, onApprove, onDisburse }) => {
    const [selectedObligationId, setSelectedObligationId] = useState<string | null>(obligations[0]?.id || null);
    const [formAmount, setFormAmount] = useState<number | ''>('');
    const [formDesc, setFormDesc] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const selectedObligation = useMemo(() => 
        obligations.find(o => o.id === selectedObligationId),
    [obligations, selectedObligationId]);

    const filteredExpenses = useMemo(() => 
        expenses.filter(e => e.obligationId === selectedObligationId),
    [expenses, selectedObligationId]);
    
    const handleCreate = () => {
        setError('');
        if (!selectedObligation || !formAmount || !formDesc) {
            setError('Amount and description are mandatory for audit.');
            return;
        }
        if (Number(formAmount) > selectedObligation.unliquidatedAmount) {
            setError('CRITICAL: Expense exceeds ULO balance. This would trigger an ADA violation.');
            return;
        }
        onNewExpense({
            obligationId: selectedObligation.id,
            amount: Number(formAmount),
            date: new Date().toISOString().split('T')[0],
            description: formDesc,
            source: 'Manual Intake',
        });
        setFormAmount('');
        setFormDesc('');
    };

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 h-full transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2"><Database size={14} className="text-rose-700"/> Active Obligations</h3>
                    <Badge variant="neutral">{obligations.length} Active</Badge>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {obligations.map(obl => (
                        <button 
                            key={obl.id} 
                            onClick={() => startTransition(() => setSelectedObligationId(obl.id))} 
                            className={`w-full text-left p-5 rounded-sm border transition-all ${selectedObligationId === obl.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.02] z-10' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-mono font-bold ${selectedObligationId === obl.id ? 'text-zinc-500' : 'text-zinc-400'}`}>{obl.documentNumber}</span>
                            </div>
                            <p className="font-bold text-sm truncate mb-3">{obl.vendor}</p>
                            <div className={`pt-3 border-t flex justify-between items-end ${selectedObligationId === obl.id ? 'border-zinc-800' : 'border-zinc-50'}`}>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedObligationId === obl.id ? 'text-zinc-500' : 'text-zinc-400'}`}>Unliquidated</span>
                                <span className={`font-mono font-bold text-sm ${selectedObligationId === obl.id ? 'text-emerald-400' : 'text-zinc-900'}`}>{formatCurrency(obl.unliquidatedAmount)}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                            {selectedObligation ? `Expenses Ledger` : 'Workspace Selection'}
                        </h3>
                        {selectedObligation && <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">Ref: {selectedObligation.documentNumber}</p>}
                    </div>
                </div>
                {selectedObligation ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {filteredExpenses.map(exp => (
                            <div key={exp.id} className="p-5 border border-zinc-100 rounded-md hover:border-rose-200 transition-all bg-white shadow-sm flex flex-col group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-sm font-bold text-zinc-800">{exp.description}</p>
                                            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase border ${
                                                exp.status === 'Paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                                exp.status === 'Accrued' ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                                                'bg-amber-50 border-amber-200 text-amber-700'
                                            }`}>{exp.status}</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">{exp.id} • {exp.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(exp.amount)}</p>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">SFFAS Accrued Basis</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-zinc-50 flex justify-between items-center">
                                    <AuditTrail expense={exp} />
                                    <div className="flex gap-2">
                                        {activeUser === 'Approver' && exp.status === 'Pending Approval' && (
                                            <button onClick={() => onApprove(exp.id)} className="px-5 py-2 bg-blue-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg flex items-center gap-2">
                                                <ShieldCheck size={14}/> Approve Accrual
                                            </button>
                                        )}
                                        {activeUser === 'Disbursing Officer' && exp.status === 'Accrued' && (
                                            <button onClick={() => onDisburse(exp.id)} className="px-5 py-2 bg-emerald-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-lg flex items-center gap-2">
                                                <DollarSign size={14}/> Authorize Outlay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeUser === 'Clerk' && (
                            <div className="p-8 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-md space-y-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <Plus size={16} className="text-rose-700"/> Requirement Intake
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Invoice / Rationale</label>
                                        <input type="text" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="e.g., Progress Payment #12" className="w-full bg-white border border-zinc-200 rounded-sm p-3 text-sm focus:outline-none focus:border-rose-400 transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Payment Magnitude ($)</label>
                                        <input type="number" value={formAmount} onChange={e => setFormAmount(Number(e.target.value))} placeholder="0.00" className="w-full bg-white border border-zinc-200 rounded-sm p-3 text-sm font-mono font-bold focus:outline-none focus:border-rose-400 transition-all shadow-sm" />
                                    </div>
                                </div>
                                {error && <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center gap-3 text-rose-700 text-xs font-bold animate-in zoom-in"><AlertTriangle size={18}/> {error}</div>}
                                <button onClick={handleCreate} className="w-full py-4 bg-zinc-900 text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                    <Send size={18}/> Commit to Approval Workflow
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4">
                        <div className="p-10 bg-zinc-50 rounded-full border-2 border-dashed border-zinc-200">
                            <BookCopy size={64} className="opacity-10" />
                        </div>
                        <div className="text-center space-y-1">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Workspace Idle</h4>
                            <p className="text-xs max-w-xs leading-relaxed">Select an active obligation to record expenditures or review history.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseManager;
