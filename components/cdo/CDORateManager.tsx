
import React, { useState } from 'react';
import { Building2, Check, X, Percent, ArrowRight } from 'lucide-react';
import { CDOCostPool } from '../../types';

interface Props {
    pools: CDOCostPool[];
    onUpdateRate: (id: string, newRate: number) => void;
}

const CDORateManager: React.FC<Props> = ({ pools, onUpdateRate }) => {
    const [editingPoolId, setEditingPoolId] = useState<string | null>(null);
    const [newRate, setNewRate] = useState<number>(0);

    return (
        <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Departmental Overhead Rates</h3>
                    <p className="text-xs text-zinc-500">Fiscal Year 2024 • Effective Oct 1</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50 transition-colors">
                        Export Rate Table
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pools.map(pool => (
                        <div key={pool.id} className="border border-zinc-200 rounded-xl p-5 hover:shadow-md transition-all group relative bg-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-50 rounded-lg text-rose-700">
                                        <Building2 size={18}/>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-900">{pool.functionName}</h4>
                                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded">{pool.orgCode}</span>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase border ${
                                    pool.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>{pool.status}</span>
                            </div>
                            
                            <div className="mb-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Burden Rate</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-mono font-bold text-zinc-900">{pool.currentRate.toFixed(2)}</span>
                                    <span className="text-sm font-medium text-zinc-500">%</span>
                                </div>
                            </div>

                            {editingPoolId === pool.id ? (
                                <div className="mt-4 pt-4 border-t border-zinc-100 animate-in slide-in-from-bottom-2 fade-in">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1 mb-1.5">
                                        <Percent size={10} /> Propose New Rate
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={newRate} 
                                            onChange={e => setNewRate(Number(e.target.value))} 
                                            className="w-full bg-white border border-blue-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded p-2 text-sm font-mono outline-none"
                                            autoFocus
                                        />
                                        <button 
                                            onClick={() => { onUpdateRate(pool.id, newRate); setEditingPoolId(null); }} 
                                            className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors"
                                            title="Confirm Change"
                                        >
                                            <Check size={16}/>
                                        </button>
                                        <button 
                                            onClick={() => setEditingPoolId(null)} 
                                            className="p-2 bg-zinc-100 text-zinc-500 rounded hover:bg-zinc-200 transition-colors"
                                            title="Cancel"
                                        >
                                            <X size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => { setEditingPoolId(pool.id); setNewRate(pool.currentRate); }} 
                                    className="w-full py-2.5 border border-zinc-200 rounded-lg text-[10px] font-bold uppercase text-zinc-500 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 group-hover:border-zinc-300"
                                >
                                    Adjust Rate <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CDORateManager;
