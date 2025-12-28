import React, { useState, useTransition, useMemo } from 'react';
import { CDOCostPool } from '../../types';
import { formatCurrency } from '../../utils/formatting';
// Fix: Added missing Landmark and X icons to the lucide-react imports
import { DollarSign, Save, RefreshCw, TrendingUp, AlertCircle, Lock, Calculator, CheckCircle2, ShieldAlert, ArrowRight, Landmark, X } from 'lucide-react';
import Badge from '../shared/Badge';

interface Props {
    pools: CDOCostPool[];
    onUpdateBudget: (id: string, newBudget: number) => void;
}

const CDOBudgetManager: React.FC<Props> = ({ pools, onUpdateBudget }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);
    const [isPending, startTransition] = useTransition();

    const totalBudget = useMemo(() => pools.reduce((sum, p) => sum + p.fyBudget, 0), [pools]);
    const totalObligated = useMemo(() => pools.reduce((sum, p) => sum + p.obligated, 0), [pools]);

    const handleSave = (pool: CDOCostPool) => {
        // FMR Rule: Reprogramming check
        const variance = Math.abs((editValue - pool.fyBudget) / pool.fyBudget);
        if (variance > 0.15) {
            if (!confirm("REPROGRAMMING ALERT: Variance exceeds 15%. This requires formal G-8 reprogramming authority (DD 1415). Continue with pending status?")) return;
        }

        startTransition(() => {
            onUpdateBudget(pool.id, editValue);
            setEditingId(null);
        });
    };

    return (
        <div className={`flex flex-col h-full space-y-8 animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
                <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    {/* Fix: Usage of Landmark icon which was missing import */}
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Landmark size={100}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">Total CDO Authority</p>
                        <p className="text-4xl font-mono font-bold text-white tracking-tighter">{formatCurrency(totalBudget)}</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-3 text-xs font-bold text-emerald-400">
                        <CheckCircle2 size={18}/>
                        <span className="uppercase tracking-widest">FY24 Control Level Locked</span>
                    </div>
                </div>
                
                <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Resource Utilization</p>
                        <p className="text-4xl font-mono font-bold text-blue-600 tracking-tighter">{((totalObligated / totalBudget) * 100).toFixed(1)}%</p>
                    </div>
                    <div className="mt-8 space-y-2">
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(totalObligated / totalBudget) * 100}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                            <span>OBLIGATED: {formatCurrency(totalObligated)}</span>
                            <span>AVAIL: {formatCurrency(totalBudget - totalObligated)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-900 rounded-[32px] p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldAlert size={100}/></div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-emerald-400"/> G-8 Formulation Guard
                        </h4>
                        <p className="text-sm leading-relaxed text-emerald-100">
                            Table of Distributions and Allowances (TDA) caps are strictly enforced for FY24. Surplus re-alignment is pending March 31 review.
                        </p>
                    </div>
                    <button className="w-full mt-6 py-3 bg-white text-emerald-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-50 transition-all">
                        Execute SNaP Sync
                    </button>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[40px] shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl border border-zinc-200 text-zinc-400 shadow-sm"><Calculator size={20}/></div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Mission Pool Control Table</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-1">Fiscal Year 2024 • Q2 Snapshot</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg">
                        <RefreshCw size={14}/> Re-Formulate Baseline
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 sticky top-0 z-10 border-b border-zinc-100">
                            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                <th className="p-6">Cost Object</th>
                                <th className="p-6">Org / Level</th>
                                <th className="p-6 text-right">Authorized Budget</th>
                                <th className="p-6 text-right">Consumption Rate</th>
                                <th className="p-6 text-center w-32">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {pools.map(pool => {
                                const utilization = (pool.obligated / pool.fyBudget) * 100;
                                const isEditing = editingId === pool.id;

                                return (
                                    <tr key={pool.id} className="group hover:bg-zinc-50/80 transition-colors">
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-zinc-900 group-hover:text-rose-700 transition-colors">{pool.functionName}</p>
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">{pool.id}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-mono text-xs font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-200 w-fit">{pool.orgCode}</span>
                                                <Badge variant="neutral">{pool.status}</Badge>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-3 animate-in slide-in-from-right-2">
                                                    <span className="text-zinc-300 font-bold">$</span>
                                                    <input 
                                                        type="number" value={editValue} autoFocus
                                                        onChange={(e) => setEditValue(Number(e.target.value))}
                                                        className="w-40 p-2 text-right font-mono font-bold text-sm border-2 border-zinc-900 rounded-xl outline-none shadow-xl"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(pool.fyBudget)}</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`text-[10px] font-bold ${utilization > 90 ? 'text-rose-600' : 'text-zinc-600'}`}>
                                                    {utilization.toFixed(1)}% BURNED
                                                </span>
                                                <div className="w-32 h-1.5 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                                                    <div 
                                                        className={`h-full transition-all duration-700 ${utilization > 90 ? 'bg-rose-50' : utilization > 75 ? 'bg-amber-50' : 'bg-emerald-50'}`} 
                                                        style={{width: `${Math.min(utilization, 100)}%`}}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {isEditing ? (
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleSave(pool)} className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"><Save size={16}/></button>
                                                    {/* Fix: Added usage of X icon after importing it */}
                                                    <button onClick={() => setEditingId(null)} className="p-2 bg-zinc-100 text-zinc-500 rounded-xl hover:bg-zinc-200 transition-colors"><X size={16}/></button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => {setEditingId(pool.id); setEditValue(pool.fyBudget);}}
                                                    className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all"
                                                >
                                                    <TrendingUp size={20}/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CDOBudgetManager;