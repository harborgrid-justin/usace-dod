
import React, { useState } from 'react';
import { CDOCostPool } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { DollarSign, Save, RefreshCw, TrendingUp, AlertCircle, Lock, Calculator, CheckCircle2 } from 'lucide-react';

interface Props {
    pools: CDOCostPool[];
    onUpdateBudget: (id: string, newBudget: number) => void;
}

const CDOBudgetManager: React.FC<Props> = ({ pools, onUpdateBudget }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = (pool: CDOCostPool) => {
        setEditingId(pool.id);
        setEditValue(pool.fyBudget);
    };

    const handleSave = (id: string) => {
        setIsSaving(true);
        // Simulate network request
        setTimeout(() => {
            onUpdateBudget(id, editValue);
            setEditingId(null);
            setIsSaving(false);
        }, 500);
    };

    const totalBudget = pools.reduce((sum, p) => sum + p.fyBudget, 0);
    const totalObligated = pools.reduce((sum, p) => sum + p.obligated, 0);

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in">
            {/* Header / KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-zinc-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64}/></div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Authorized Overhead</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(totalBudget)}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-emerald-400">
                        <CheckCircle2 size={12}/>
                        <span>FY24 Formulation Locked</span>
                    </div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Current Execution</p>
                    <p className="text-2xl font-mono font-bold text-blue-600">{formatCurrency(totalObligated)}</p>
                    <div className="mt-4 w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(totalObligated / totalBudget) * 100}%` }} />
                    </div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Reserve (Unallocated)</p>
                    <p className="text-2xl font-mono font-bold text-emerald-600">{formatCurrency(totalBudget - totalObligated)}</p>
                    <p className="text-[10px] text-zinc-500 mt-2">Available for reprogramming</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-500"><Calculator size={16}/></div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Zero-Based Budget Formulation</h3>
                            <p className="text-xs text-zinc-500">Departmental Pools • Fiscal Year 2024</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-50 transition-colors">
                        <RefreshCw size={12}/> Recalculate Totals
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100">
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-1/4">Cost Pool Function</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-1/6">Org Code</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right w-1/4">FY24 Auth Budget</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right w-1/4">Utilization</th>
                                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {pools.map(pool => {
                                const utilization = (pool.obligated / pool.fyBudget) * 100;
                                const isEditing = editingId === pool.id;

                                return (
                                    <tr key={pool.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="text-sm font-bold text-zinc-900">{pool.functionName}</p>
                                            <p className="text-[10px] text-zinc-500">{pool.status}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded">{pool.orgCode}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-zinc-400 text-xs">$</span>
                                                    <input 
                                                        type="number" 
                                                        value={editValue} 
                                                        onChange={(e) => setEditValue(Number(e.target.value))}
                                                        className="w-32 p-1 text-right font-mono text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <span className="font-mono text-sm font-bold text-zinc-900">{formatCurrency(pool.fyBudget)}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`text-[10px] font-bold ${utilization > 90 ? 'text-rose-600' : 'text-zinc-500'}`}>
                                                    {utilization.toFixed(1)}%
                                                </span>
                                                <div className="w-24 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${utilization > 90 ? 'bg-rose-500' : utilization > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                        style={{width: `${Math.min(utilization, 100)}%`}}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {isEditing ? (
                                                <button 
                                                    onClick={() => handleSave(pool.id)} 
                                                    disabled={isSaving}
                                                    className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors"
                                                >
                                                    <Save size={14}/>
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEdit(pool)}
                                                    className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    <TrendingUp size={14}/>
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

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-xs items-center shadow-sm">
                <AlertCircle size={16} className="shrink-0"/>
                <p><strong>FMR Vol 3 Compliance:</strong> Changes to approved overhead budgets exceeding 5% require G-8 reprogramming authority (DD 1415).</p>
            </div>
        </div>
    );
};

export default CDOBudgetManager;
