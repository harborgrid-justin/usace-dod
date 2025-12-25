
import React, { useState } from 'react';
import { Calculator, AlertTriangle, Clock, Receipt, CheckCircle2, History } from 'lucide-react';
import { CDOTransaction, CDOFunction, CDOCostPool } from '../../types';
import { MOCK_CDO_POOLS } from '../../constants'; // We still use this to populate dropdowns if pool prop isn't available, but optimally we should pass pools
import { formatCurrency } from '../../utils/formatting';

interface Props {
    transactions: CDOTransaction[];
    onAddTransaction: (tx: CDOTransaction) => void;
    onSelectProject: (id: string) => void;
}

const CDOCostCapture: React.FC<Props> = ({ transactions, onAddTransaction, onSelectProject }) => {
    const [form, setForm] = useState<Partial<CDOTransaction>>({ 
        date: new Date().toISOString().split('T')[0], 
        type: 'Labor', 
        function: 'Engineering' 
    });
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.amount || !form.description) { setError('Amount and Description required.'); return; }
        if (form.description?.toLowerCase().includes('project')) { setError('COMPLIANCE ERROR: CDO cannot be charged to specific projects. Use Direct Charge.'); return; }
        
        onAddTransaction({
            id: `TX-CDO-${Date.now()}`,
            date: form.date!,
            type: form.type as any,
            amount: Number(form.amount),
            description: form.description!,
            function: form.function as CDOFunction,
            employeeId: form.employeeId,
            hours: form.type === 'Labor' ? Number(form.hours) : undefined,
            isIncidental: form.type === 'Labor' && (form.hours || 0) < 0.25
        });
        setForm({ ...form, amount: 0, description: '', hours: 0 });
    };

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 animate-in fade-in">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-700"><Calculator size={20} /></div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Overhead Entry</h3>
                        <p className="text-xs text-zinc-500">Record Indirect Expenses</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Pool Function</label>
                        <select 
                            className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all" 
                            value={form.function} 
                            onChange={e => setForm({...form, function: e.target.value as CDOFunction})}
                        >
                            {MOCK_CDO_POOLS.map(p => <option key={p.id} value={p.functionName}>{p.functionName} ({p.orgCode})</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Cost Type</label>
                        <div className="flex gap-2">
                            {['Labor', 'Non-Labor', 'Accrual'].map(type => (
                                <button 
                                    key={type} 
                                    type="button" 
                                    onClick={() => setForm({...form, type: type as any})} 
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                                        form.type === type ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.type === 'Labor' && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Emp ID</label>
                                <input type="text" className="w-full mt-1 border border-zinc-200 rounded-lg p-2 text-sm bg-white" value={form.employeeId || ''} onChange={e => setForm({...form, employeeId: e.target.value})} placeholder="E-1234"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hours</label>
                                <input type="number" step="0.25" className="w-full mt-1 border border-zinc-200 rounded-lg p-2 text-sm bg-white" value={form.hours || 0} onChange={e => setForm({...form, hours: Number(e.target.value)})}/>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount ($)</label>
                        <div className="relative mt-1.5">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-serif italic">$</span>
                            <input 
                                type="number" 
                                className="w-full border border-zinc-200 rounded-lg pl-7 pr-3 py-2.5 text-sm font-mono font-bold focus:outline-none focus:border-rose-400" 
                                value={form.amount || ''} 
                                onChange={e => setForm({...form, amount: Number(e.target.value)})}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                        <textarea 
                            className="w-full mt-1.5 border border-zinc-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-rose-400 h-24" 
                            value={form.description || ''} 
                            onChange={e => setForm({...form, description: e.target.value})} 
                            placeholder="Justification for indirect charge..."
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex gap-2 text-rose-700 text-xs items-center animate-in fade-in">
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="w-full py-3 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                        <CheckCircle2 size={16}/> Record Transaction
                    </button>
                </form>
            </div>

            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <History size={16} className="text-zinc-400"/> Transaction Ledger
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400">{transactions.length} Entries</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white sticky top-0 border-b border-zinc-100 shadow-sm">
                            <tr>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date / Ref</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Function</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-zinc-50 transition-colors group">
                                    <td className="p-4">
                                        <p className="text-xs font-mono text-zinc-500">{tx.date}</p>
                                        <p className="text-[10px] text-zinc-300 font-mono">{tx.id}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                                            tx.function === 'Engineering' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                            tx.function === 'Operations' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                        }`}>{tx.function}</span>
                                    </td>
                                    <td className="p-4 text-xs text-zinc-600">
                                        {tx.description} 
                                        {tx.linkedP2Number && (
                                            <button 
                                                onClick={() => onSelectProject(tx.linkedP2Number!)} 
                                                className="ml-2 text-rose-600 font-mono text-[10px] hover:underline"
                                            >
                                                P2:{tx.linkedP2Number}
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-4 text-xs font-mono font-bold text-zinc-900 text-right">
                                        {formatCurrency(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-zinc-400 text-xs italic">
                                        No transactions recorded. Use the form to capture costs.
                                    </td>
                                                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CDOCostCapture;
