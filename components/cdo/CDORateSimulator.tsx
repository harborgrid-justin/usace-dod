
import React, { useState, useMemo } from 'react';
import { TrendingUp, RefreshCw, AlertTriangle, Calculator, ShieldAlert, Landmark, DollarSign, Activity } from 'lucide-react';
import { CDOCostPool } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
    pools: CDOCostPool[];
}

const CDORateSimulator: React.FC<Props> = ({ pools }) => {
    const [simulationFactor, setSimulationFactor] = useState(1.0); // 1.0 = 100% of current workload
    
    const currentTotalDemand = useMemo(() => pools.reduce((sum, p) => sum + p.fyBudget, 0), [pools]);
    const simulatedDemand = currentTotalDemand * simulationFactor;
    
    const simulatedData = useMemo(() => {
        const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        return months.map((m, i) => {
            const progress = (i + 1) / 12;
            return {
                month: m,
                baseline: currentTotalDemand * progress,
                simulated: simulatedDemand * progress
            };
        });
    }, [currentTotalDemand, simulatedDemand]);

    return (
        <div className="flex flex-col gap-8 animate-in fade-in h-full overflow-y-auto custom-scrollbar p-1">
            <div className="bg-zinc-900 rounded-md p-10 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Calculator size={160}/></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h3 className="text-3xl font-bold tracking-tighter">Pool Impact Simulator</h3>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest mt-2">FY25 Readiness Scenario Engine</p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Adjust Program Magnitude</label>
                                <span className={`px-4 py-1 rounded-full font-mono text-xs font-bold border transition-all ${simulationFactor > 1.1 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                    {(simulationFactor * 100).toFixed(0)}% OF BASELINE
                                </span>
                            </div>
                            <input 
                                type="range" min="0.5" max="1.5" step="0.05"
                                value={simulationFactor}
                                onChange={e => setSimulationFactor(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">
                                <span>-50% Reduction</span>
                                <span>+50% Surge</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-5 grid grid-cols-1 gap-6 relative z-10">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-md backdrop-blur-xl shadow-inner">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Projected Surcharge Recovery</p>
                            <p className="text-4xl font-mono font-bold text-emerald-400">{formatCurrency(simulatedDemand * 0.18)}</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-md backdrop-blur-xl shadow-inner">
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Effective Variance Delta</p>
                            <p className={`text-4xl font-mono font-bold ${simulatedDemand > currentTotalDemand ? 'text-rose-400' : 'text-blue-400'}`}>
                                {simulatedDemand > currentTotalDemand ? '+' : '-'}{formatCurrency(Math.abs(simulatedDemand - currentTotalDemand))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-md p-10 shadow-sm flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                            <Activity size={18} className="text-zinc-400"/> Projected Cash Burn Pattern
                        </h4>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={simulatedData}>
                                <defs>
                                    <linearGradient id="simColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#be123c" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#be123c" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `$${val/1e6}M`}/>
                                <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="baseline" stroke="#a1a1aa" strokeDasharray="5 5" fill="none" name="Baseline" />
                                <Area type="monotone" dataKey="simulated" stroke="#be123c" strokeWidth={3} fill="url(#simColor)" name="Simulated Burn" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-md p-10 shadow-sm space-y-8">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3 border-b border-zinc-50 pb-4">
                        <ShieldAlert size={18} className="text-amber-500"/> Risk Indicators
                    </h4>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 rounded-sm text-amber-600 border border-amber-100 shadow-sm"><AlertTriangle size={20}/></div>
                            <div>
                                <p className="text-xs font-bold text-zinc-900">Stabilization Conflict</p>
                                <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">Simulated workload change exceeds +/- 10% threshold. Rates must be re-negotiated to avoid AOR deficit.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-sm text-blue-600 border border-blue-100 shadow-sm"><Landmark size={20}/></div>
                            <div>
                                <p className="text-xs font-bold text-zinc-900">Capital Surcharge Impact</p>
                                <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">New project volume will accelerate PRIP recovery by an estimated 14 months.</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-4 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                        <DollarSign size={16}/> Lock Rate Simulation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CDORateSimulator;
