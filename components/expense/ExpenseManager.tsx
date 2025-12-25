
import React, { useState } from 'react';
import { Obligation, Expense, ExpenseUserRole } from '../../types';
import { formatCurrency, formatCurrencyExact } from '../../utils/formatting';
import { BookCopy, AlertTriangle, Plus, Send, Check, DollarSign } from 'lucide-react';
import AuditTrail from './AuditTrail';

interface Props {
    activeUser: ExpenseUserRole;
    obligations: Obligation[];
    expenses: Expense[];
    onNewExpense: (data: Omit<Expense, 'id' | 'status' | 'createdBy' | 'auditLog'>) => void;
    onApprove: (expenseId: string) => void;
    onDisburse: (expenseId: string) => void;
}

const ExpenseManager: React.FC<Props> = ({ activeUser, obligations, expenses, onNewExpense, onApprove, onDisburse }) => {
    const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(obligations[0] || null);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    // Form state
    const [formAmount, setFormAmount] = useState<number | ''>('');
    const [formDesc, setFormDesc] = useState('');
    const [error, setError] = useState('');

    const filteredExpenses = expenses.filter(e => e.obligationId === selectedObligation?.id);
    
    const handleCreate = () => {
        setError('');
        if (!selectedObligation || !formAmount || !formDesc) {
            setError('Amount and description are required.');
            return;
        }
        if (Number(formAmount) > selectedObligation.unliquidatedAmount) {
            setError('Expense exceeds unliquidated obligation balance. ADA VIOLATION.');
            return;
        }
        onNewExpense({
            obligationId: selectedObligation.id,
            amount: Number(formAmount),
            date: new Date().toISOString().split('T')[0],
            description: formDesc,
            source: 'Contract', // Mocked for now
        });
        setFormAmount('');
        setFormDesc('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Obligations List */}
            <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Obligations</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {obligations.map(obl => (
                        <button key={obl.id} onClick={() => setSelectedObligation(obl)} className={`w-full text-left p-4 border-b border-zinc-100 ${selectedObligation?.id === obl.id ? 'bg-rose-50' : 'hover:bg-zinc-50'}`}>
                            <p className="font-bold text-sm text-zinc-800">{obl.vendor}</p>
                            <p className="text-xs text-zinc-500 font-mono">{obl.documentNumber}</p>
                            <div className="mt-2 text-xs flex justify-between">
                                <span className="text-zinc-500">ULO:</span>
                                <span className="font-mono font-bold text-zinc-900">{formatCurrency(obl.unliquidatedAmount)}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Expenses Area */}
            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col">
                 <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                        {selectedObligation ? `Expenses for ${selectedObligation.documentNumber}` : 'Select an Obligation'}
                    </h3>
                </div>
                {selectedObligation ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {filteredExpenses.map(exp => (
                            <div key={exp.id} className={`p-4 border rounded-lg transition-colors ${selectedExpense?.id === exp.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-zinc-100'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-800">{exp.description}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono">{exp.id} • {exp.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-lg">{formatCurrency(exp.amount)}</p>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${ { 'Pending Approval': 'border-amber-200 bg-amber-50 text-amber-700', 'Accrued': 'border-blue-200 bg-blue-50 text-blue-700', 'Paid': 'border-emerald-200 bg-emerald-50 text-emerald-700', 'Rejected': 'border-rose-200 bg-rose-50 text-rose-700' }[exp.status] }`}>{exp.status}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center">
                                    <AuditTrail expense={exp} />
                                    <div className="flex gap-2">
                                        {activeUser === 'Approver' && exp.status === 'Pending Approval' && <button onClick={() => onApprove(exp.id)} className="px-3 py-1 bg-blue-600 text-white text-[10px] rounded font-bold uppercase flex items-center gap-1"><Check size={12}/>Approve</button>}
                                        {activeUser === 'Disbursing Officer' && exp.status === 'Accrued' && <button onClick={() => onDisburse(exp.id)} className="px-3 py-1 bg-emerald-600 text-white text-[10px] rounded font-bold uppercase flex items-center gap-1"><DollarSign size={12}/>Disburse</button>}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* New Expense Form */}
                        {activeUser === 'Clerk' && (
                            <div className="p-4 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-lg space-y-3">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Plus size={14}/> New Expense Entry</h4>
                                <input type="text" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Description (e.g., Invoice #)" className="w-full p-2 border rounded-md text-xs"/>
                                <input type="number" value={formAmount} onChange={e => setFormAmount(Number(e.target.value))} placeholder="Amount" className="w-full p-2 border rounded-md text-xs"/>
                                {error && <p className="text-xs text-rose-600 font-bold flex items-center gap-2"><AlertTriangle size={14}/> {error}</p>}
                                <button onClick={handleCreate} className="w-full py-2 bg-zinc-900 text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center gap-2"><Send size={12}/>Submit for Approval</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
                        <BookCopy size={24} className="opacity-20" />
                        <span className="text-xs font-medium">Select an obligation to view expenses.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseManager;
