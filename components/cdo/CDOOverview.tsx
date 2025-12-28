import React, { useMemo } from 'react';
import { Activity, ShieldAlert, Check, TrendingUp, AlertTriangle, LayoutGrid, Calendar, Landmark, Database } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { CDOCostPool } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    pools: CDOCostPool[];
}

const KPICard = React.memo(({ label, value, sub, icon: Icon, colorClass, borderClass }: any) => (
    <div className={`bg-white p-6 rounded-3xl border ${borderClass} shadow-sm flex flex-col justify-between transition-all hover:shadow-md`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl bg-zinc-50 ${colorClass}`}><Icon size={20}/></div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{sub}</p>
        </div>
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-2xl font-mono font-bold text-zinc-900 tracking-tight">{value}</p>
        </div>
    </div>
));

const CDOOverview: React.FC<Props> = ({ pools }) => {
    const totalBudget = useMemo(() => pools.reduce((sum, p) => sum + p.fyBudget, 0), [pools]);
    const totalObligated = useMemo(() => pools.reduce((sum, p) => sum + p.obligated, 0), [pools]);
    const executionRate = totalBudget > 0 ? (totalObligated / totalBudget) * 100 : 0;

    const heatmapData = useMemo(() => pools.map(p => ({
        name: p.functionName,
        actualRate: p.currentRate,
        targetRate: p.currentRate * 0.95,
        variance: (p.currentRate - (p.currentRate * 0.95))
    })), [pools]);

    return (
        <div className="space-y-8 animate-in fade-in h-full overflow-y-auto custom-scrollbar p-1 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard label="CDO Ceiling" value={formatCurrency(totalBudget)} sub="Auth Budget" icon={Landmark} colorClass="text-zinc-700" borderClass="border-zinc-200" />
                <KPICard label="Total Burdened" value={formatCurrency(totalObligated)} sub="Active Obligation" icon={Database} colorClass="text-blue-600" borderClass="border-blue-100" />
                <KPICard label="Execution Rate" value={`${executionRate.toFixed(1)}%`} sub="Pool Velocity" icon={TrendingUp} colorClass="text-emerald-600" borderClass="border-emerald-100" />
                <KPICard label="Pool Stability" value="STABLE" sub="Rate Control" icon={Check} colorClass="text-purple-600" borderClass="border-purple-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm flex flex-col h-[450px]">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Cost Pool Consumption Matrix</h3>
                            <p className="text-[10px] text-zinc-400 font-medium mt-1">Authorized Budget vs Current Obligations</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase"><div className="w-2.5 h-2.5 bg-zinc-100 rounded-sm"/> Budget</div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase"><div className="w-2.5 h-2.5 bg-rose-700 rounded-sm"/> Consumed</div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pools} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={6}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="functionName" tick={{fontSize: 10, fontWeight: 'bold', fill: '#71717a'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 10, fill: '#a1a1aa'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(0,0,0,0.02)'}} 
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                    formatter={(value: any) => formatCurrency(value)} 
                                />
                                <Bar dataKey="fyBudget" name="Budget" fill="#f4f4f5" radius={[6, 6, 0, 0]} barSize={24} />
                                <Bar dataKey="obligated" name="Obligated" radius={[6, 6, 0, 0]} barSize={24}>
                                    {pools.map((entry, index) => <Cell key={index} fill={(entry.obligated / entry.fyBudget) > 0.85 ? '#be123c' : '#18181b'} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl flex flex-col relative overflow-hidden h-[450px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><ShieldAlert size={120} /></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 mb-10 relative z-10">
                        <ShieldAlert size={18} className="text-rose-500" /> Policy Monitor
                    </h4>
                    <div className="space-y-6 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {pools.filter(p => (p.obligated / p.fyBudget) > 0.8).map(pool => (
                             <div key={pool.id} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-in slide-in-from-right-2">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">High Consumption</span>
                                    <Activity size={14} className="text-rose-400 animate-pulse" />
                                </div>
                                <p className="text-xs font-bold text-white mb-1">{pool.functionName}</p>
                                <p className="text-[10px] text-rose-300 leading-relaxed">
                                    Pool is at {((pool.obligated/pool.fyBudget)*100).toFixed(1)}% capacity. Adjust staffing or non-labor burn to avoid deficit.
                                </p>
                            </div>
                        ))}
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">System Healthy</span>
                            <p className="text-xs text-zinc-400">All overhead pools are being distributed using stabilized FY24 rates.</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status Report</p>
                        <p className="text-xs text-zinc-400">Next Rate Reconciliation: Mar 15</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
                 <div className="flex justify-between items-center mb-10">
                     <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                            <TrendingUp size={18} className="text-emerald-600"/> Burden Analysis & Forecast
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium mt-1">Stabilized Target vs Effective Execution Rate</p>
                     </div>
                     <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-2"><Calendar size={14}/> Projected Year-End</span>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                     {heatmapData.map((d, i) => (
                         <div key={i} className="space-y-4">
                             <div className="flex justify-between items-end">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase truncate max-w-[80px]">{d.name}</p>
                                <p className={`text-xs font-mono font-bold ${d.variance > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {d.actualRate.toFixed(1)}%
                                </p>
                             </div>
                             <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ${d.variance > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${Math.min(100, (d.actualRate/d.targetRate)*100)}%`}}/>
                             </div>
                             <p className="text-[8px] font-bold text-zinc-400 uppercase text-center tracking-tighter">Target: {d.targetRate.toFixed(1)}%</p>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default CDOOverview;