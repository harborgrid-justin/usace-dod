
import React, { useState, useTransition } from 'react';
import { Building2, Check, X, Percent, ArrowRight, Save, Database, ShieldCheck, Landmark } from 'lucide-react';
import { CDOCostPool } from '../../types';

interface Props {
    pools: CDOCostPool[];
    onUpdateRate: (id: string, newRate: number) => void;
}

const CDORateManager: React.FC<Props> = ({ pools, onUpdateRate }) => {
    const [editingPoolId, setEditingPoolId] = useState<string | null>(null);
    const [newRate, setNewRate] = useState<number>(0);
    const [isPending, startTransition] = useTransition();

    const handleConfirm = (id: string) => {
        startTransition(() => {
            onUpdateRate(id, newRate);
            setEditingPoolId(null);
        });
    };

    return (
        <div className={`flex-1 bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="p-8 border-b border-zinc-100 bg-zinc-50/50 flex flex-col lg:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Stabilized Rate Repository</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Management of Overhead & Surcharge Burdens (FY24)</p>
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-sm border border-emerald-100 text-[10px] font-bold uppercase flex items-center gap-2 shadow-sm">
                        <ShieldCheck size={14}/> Rates Locked
                    </div>
                    <button className="flex-1 lg:flex-none px-6 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-sm text-xs font-bold uppercase hover:bg-zinc-50 transition-all">
                        Distribution Plan (SF 7600A)
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {pools.map(pool => (
                        <div key={pool.id} className="bg-white border border-zinc-200 rounded-md p-6 hover:shadow-xl hover:border-rose-200 transition-all group flex flex-col h-[280px]">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-zinc-900 text-white rounded-sm shadow-xl"><Landmark size={20}/></div>
                                    <div>
                                        <h4 className="text-base font-bold text-zinc-900">{pool.functionName}</h4>
                                        <p className="text-[10px] font-mono text-zinc-400 tracking-widest mt-0.5">{pool.orgCode}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase border ${
                                    pool.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'
                                }`}>{pool.status}</span>
                            </div>
                            
                            <div className="mb-6 p-5 bg-zinc-50 rounded-sm border border-zinc-100 flex flex-col items-center justify-center text-center">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Stabilized Burden Rate</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter">{pool.currentRate.toFixed(2)}</span>
                                    <span className="text-sm font-bold text-zinc-500">%</span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                {editingPoolId === pool.id ? (
                                    <div className="flex gap-2 animate-in slide-in-from-bottom-2">
                                        <div className="relative flex-1">
                                             <Percent size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                             <input 
                                                type="number" step="0.01" value={newRate} autoFocus
                                                onChange={e => setNewRate(Number(e.target.value))} 
                                                className="w-full bg-white border border-zinc-900 rounded-sm py-2 pl-7 pr-2 text-sm font-mono font-bold outline-none shadow-lg"
                                            />
                                        </div>
                                        <button onClick={() => handleConfirm(pool.id)} className="p-2 bg-zinc-900 text-white rounded-sm hover:bg-zinc-800 shadow-lg"><Check size={18}/></button>
                                        <button onClick={() => setEditingPoolId(null)} className="p-2 bg-zinc-100 text-zinc-500 rounded-sm hover:bg-zinc-200"><X size={18}/></button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => { setEditingPoolId(pool.id); setNewRate(pool.currentRate); }} 
                                        className="w-full py-3 border border-zinc-200 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        Adjust Component <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CDORateManager;
