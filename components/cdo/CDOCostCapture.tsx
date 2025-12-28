import React, { useState, useTransition } from 'react';
import { Calculator, AlertTriangle, Clock, Receipt, CheckCircle2, History, Database, ArrowRight, User, Briefcase, Calendar } from 'lucide-react';
import { CDOTransaction, CDOFunction } from '../../types';
import { MOCK_CDO_POOLS } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import Badge from '../shared/Badge';

interface Props {
    transactions: CDOTransaction[];
    onAddTransaction: (tx: CDOTransaction) => void;
    onSelectProject: (id: string) => void;
}

const CDOCostCapture: React.FC<Props> = ({ transactions, onAddTransaction, onSelectProject }) => {
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState<Partial<CDOTransaction>>({ 
        date: new Date().toISOString().split('T')[0], 
        type: 'Labor', 
        function: 'Engineering' 
    });
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.amount || !form.description) { setError('All fields are mandatory for audit trail.'); return; }
        
        // Strict Compliance Check: Indirect Costs cannot mention specific projects
        if (form.description?.toLowerCase().includes('project')) { 
            setError('COMPLIANCE ALERT: Indirect CDO costs cannot be mapped to specific projects. Use Direct Charge.'); 
            return; 
        }
        
        startTransition(() => {
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
            setForm({ ...form, amount: 0, description: '', hours: 0, employeeId: '' });
        });
    };

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0 animate-in fade-in overflow-hidden">
            {/* Form Column */}
            <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-3xl p-8 overflow-y-auto custom-scrollbar shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-100">
                    <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-xl"><Calculator size={24} /></div>
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Cost Capture</h3>
                        <p className="text-xs text-zinc-500 font-medium">Record Indirect Operating Expense</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Target Functional Pool</label>
                            <select 
                                className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-sm font-bold focus:border-rose-400 outline-none transition-all appearance-none" 
                                value={form.function} 
                                onChange={e => setForm({...form, function: e.target.value as CDOFunction})}
                            >
                                {MOCK_CDO_POOLS.map(p => <option key={p.id} value={p.functionName}>{p.functionName} ({p.orgCode})</option>)}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            {['Labor', 'Non-Labor', 'Accrual'].map(type => (
                                <button 
                                    key={type} type="button" 
                                    onClick={() => setForm({...form, type: type as any})} 
                                    className={`py-2 rounded-xl text-[9px] font-bold uppercase border transition-all ${
                                        form.type === type ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.type === 'Labor' && (
                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Employee ID</label>
                                <input type="text" className="w-full mt-1 border border-zinc-200 rounded-xl p-2.5 text-xs font-mono" value={form.employeeId || ''} onChange={e => setForm({...form, employeeId: e.target.value})} placeholder="E-1234"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Hours</label>
                                <input type="number" step="0.25" className="w-full mt-1 border border-zinc-200 rounded-xl p-2.5 text-xs font-mono" value={form.hours || ''} onChange={e => setForm({...form, hours: Number(e.target.value)})}/>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-2">Total Amount ($)</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                            <input 
                                type="number" 
                                className="w-full border border-zinc-200 rounded-2xl pl-10 pr-4 py-4 text-2xl font-mono font-bold text-zinc-900 focus:outline-none focus:border-rose-400 transition-all group-hover:bg-zinc-50/50" 
                                value={form.amount || ''} 
                                onChange={e => setForm({...form, amount: Number(e.target.value)})}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-2">Requirement Rationale</label>
                        <textarea 
                            className="w-full border border-zinc-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:border-rose-400 h-32 leading-relaxed" 
                            value={form.description || ''} 
                            onChange={e => setForm({...form, description: e.target.value})} 
                            placeholder="Describe the nature of the indirect expense..."
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-700 text-xs font-bold animate-in zoom-in">
                            <AlertTriangle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" disabled={isPending} className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                        {isPending ? <Clock className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>} Post Transaction
                    </button>
                </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                        <History size={18} className="text-zinc-400"/> Operational Expenditure Ledger
                    </h3>
                    <div className="flex gap-4">
                        <div className="text-right">
                             <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Active Pool Load</p>
                             <p className="text-xs font-mono font-bold text-zinc-900">{transactions.length} Postings</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white sticky top-0 border-b border-zinc-100 shadow-sm z-10">
                            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                <th className="p-6">Entity Reference</th>
                                <th className="p-6">Type</th>
                                <th className="p-6">Fiduciary Description</th>
                                <th className="p-6 text-right">Magnitude</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-zinc-50/80 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all"><Database size={14}/></div>
                                            <div>
                                                <p className="text-xs font-mono font-bold text-zinc-900 uppercase">{tx.function}</p>
                                                <p className="text-[9px] text-zinc-400 font-mono mt-1">{tx.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <Badge variant={tx.type === 'Labor' ? 'info' : 'neutral'}>{tx.type}</Badge>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-xs font-medium text-zinc-700 leading-snug">{tx.description}</p>
                                        <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2">
                                            {/* Fix: Usage of Calendar icon which was used but not imported */}
                                            <Calendar size={12} className="text-zinc-400 opacity-40"/> {tx.date}
                                            {tx.employeeId && <><span className="text-zinc-200">|</span> <User size={12} className="opacity-40"/> {tx.employeeId}</>}
                                        </p>
                                    </td>
                                    <td className="p-6 text-right">
                                        <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(tx.amount)}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CDOCostCapture;