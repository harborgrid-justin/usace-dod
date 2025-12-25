
import React, { useMemo } from 'react';
import { Activity, ShieldAlert, Check, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { CDOCostPool } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    pools: CDOCostPool[];
}

const CDOOverview: React.FC<Props> = ({ pools }) => {
    const totalBudget = pools.reduce((sum, p) => sum + p.fyBudget, 0);
    const totalObligated = pools.reduce((sum, p) => sum + p.obligated, 0);
    const executionRate = totalBudget > 0 ? (totalObligated / totalBudget) * 100 : 0;

    // Detect critical pools for Sentinel
    const criticalPools = useMemo(() => pools.filter(p => (p.obligated / p.fyBudget) > 0.85), [pools]);
    const warningPools = useMemo(() => pools.filter(p => (p.obligated / p.fyBudget) > 0.75 && (p.obligated / p.fyBudget) <= 0.85), [pools]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-6">
            {/* KPI Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total CDO Budget</p>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Obligated</p>
                    <p className="text-2xl font-mono font-bold text-blue-600">{formatCurrency(totalObligated)}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Execution Rate</p>
                    <div className="flex items-center gap-2">
                        <p className={`text-2xl font-mono font-bold ${executionRate > 90 ? 'text-rose-600' : executionRate > 75 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {executionRate.toFixed(1)}%
                        </p>
                        <div className="h-1.5 flex-1 bg-zinc-100 rounded-full overflow-hidden max-w-[80px]">
                            <div className={`h-full ${executionRate > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${Math.min(executionRate, 100)}%`}}/>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Target Balance</p>
                    <div className="flex items-center gap-2">
                        {Math.abs(totalBudget - totalObligated) < 1000 ? (
                            <Check size={20} className="text-emerald-500" />
                        ) : (
                            <Activity size={20} className="text-blue-500" />
                        )}
                        <span className="text-xs font-bold text-zinc-700">
                            {Math.abs(totalBudget - totalObligated) < 1000 ? 'Zero Balance Achieved' : 'In Execution'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Cost Pool Performance</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                            <div className="w-2.5 h-2.5 bg-zinc-200 rounded-sm"/> Budget
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                            <div className="w-2.5 h-2.5 bg-rose-700 rounded-sm"/> Obligated
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pools} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis dataKey="functionName" tick={{fontSize: 10, fontWeight: 600, fill: '#71717a'}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fontSize: 10, fill: '#a1a1aa'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                            <Tooltip 
                                cursor={{fill: 'rgba(0,0,0,0.02)'}} 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }} 
                                formatter={(value: any) => formatCurrency(value)} 
                            />
                            <Bar dataKey="fyBudget" name="Budget" fill="#e4e4e7" radius={[4, 4, 0, 0]} barSize={24} />
                            <Bar dataKey="obligated" name="Obligated" radius={[4, 4, 0, 0]} barSize={24}>
                                {pools.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={(entry.obligated / entry.fyBudget) > 0.9 ? '#be123c' : '#4f46e5'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Policy Sentinel */}
            <div className="bg-zinc-900 rounded-xl p-6 text-white shadow-lg flex flex-col h-full overflow-hidden">
                <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                    <ShieldAlert size={16} className="text-rose-500" /> Policy Sentinel
                </h4>
                
                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-zinc-200">Segregation of Duties</span>
                            <Check size={14} className="text-emerald-500" />
                        </div>
                        <p className="text-[10px] text-zinc-400">Rate approval authority separated from entry.</p>
                    </div>

                    {criticalPools.length > 0 && criticalPools.map(pool => (
                        <div key={pool.id} className="p-3 bg-rose-500/20 rounded-lg border border-rose-500/30 animate-in slide-in-from-right-2">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-rose-200">ADA Watch: Critical</span>
                                <Activity size={14} className="text-rose-400 animate-pulse" />
                            </div>
                            <p className="text-[10px] text-rose-300">
                                {pool.functionName} pool at {((pool.obligated/pool.fyBudget)*100).toFixed(1)}% obligation.
                            </p>
                        </div>
                    ))}

                    {warningPools.length > 0 && warningPools.map(pool => (
                        <div key={pool.id} className="p-3 bg-amber-500/20 rounded-lg border border-amber-500/30 animate-in slide-in-from-right-2">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-amber-200">Execution Warning</span>
                                <AlertTriangle size={14} className="text-amber-400" />
                            </div>
                            <p className="text-[10px] text-amber-300">
                                {pool.functionName} pool approaching limits ({((pool.obligated/pool.fyBudget)*100).toFixed(1)}%).
                            </p>
                        </div>
                    ))}

                    {criticalPools.length === 0 && warningPools.length === 0 && (
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-emerald-200">System Healthy</span>
                                <Check size={14} className="text-emerald-400" />
                            </div>
                            <p className="text-[10px] text-emerald-300">All pools operating within normal variances.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CDOOverview;
