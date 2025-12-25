
import React, { useMemo } from 'react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
    Legend, CartesianGrid, ReferenceLine 
} from 'recharts';
import { WorkloadItem, WorkforcePlan, LaborRate, LaborStandard, LaborCategory } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { AlertCircle, ShieldCheck, TrendingUp, Info } from 'lucide-react';

interface Props {
    workloadItems: WorkloadItem[];
    workforcePlans: WorkforcePlan[];
    laborRates: LaborRate[];
    laborStandards: LaborStandard[];
}

const GapAnalysis: React.FC<Props> = ({
    workloadItems,
    workforcePlans,
    laborRates,
    laborStandards,
}) => {
    const analysisData = useMemo(() => {
        const categories: LaborCategory[] = ['Engineer', 'Scientist', 'Technician', 'Admin', 'Project Manager'];
        const demand: Record<LaborCategory, number> = { 'Engineer': 0, 'Scientist': 0, 'Technician': 0, 'Admin': 0, 'Project Manager': 0 };
        const supply: Record<LaborCategory, number> = { 'Engineer': 0, 'Scientist': 0, 'Technician': 0, 'Admin': 0, 'Project Manager': 0 };
        
        // 1. Calculate Demand (Requirements)
        workloadItems.forEach(item => {
            const standard = laborStandards.find(s => s.workloadUnit === item.unit);
            if (standard) {
                const hoursNeeded = item.quantity * standard.hoursPerUnit;
                demand[standard.laborCategory] += hoursNeeded;
            }
        });

        // 2. Calculate Supply (Planned Strength)
        const HOURS_PER_FTE = 2080;
        workforcePlans.forEach(plan => {
            plan.entries.forEach(entry => {
                supply[entry.laborCategory] += (entry.fundedFTE + entry.unfundedFTE) * HOURS_PER_FTE;
            });
        });

        // 3. Map to Recharts compatible format
        return categories.map(category => {
            const dHours = demand[category];
            const sHours = supply[category];
            const gap = sHours - dHours;
            const rate = laborRates.find(r => r.laborCategory === category)?.rate || 0;

            return {
                category,
                Demand: Number((dHours / HOURS_PER_FTE).toFixed(1)),
                Supply: Number((sHours / HOURS_PER_FTE).toFixed(1)),
                gapHours: gap,
                costImpact: gap * rate,
            };
        });
    }, [workloadItems, workforcePlans, laborStandards, laborRates]);

    const totalCostGap = analysisData.reduce((sum, d) => sum + d.costImpact, 0);

    return (
        <div className="animate-in fade-in space-y-8">
            {/* Chart Panel */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900">Mission Capacity Analysis</h3>
                        <p className="text-xs text-zinc-500">Planned Strength vs. Workload Demand (FTE)</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Projected Labor Variance</p>
                        <p className={`text-xl font-mono font-bold ${totalCostGap < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {totalCostGap < 0 ? '-' : '+'}{formatCurrency(Math.abs(totalCostGap))}
                        </p>
                    </div>
                </div>
                
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysisData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                            <XAxis dataKey="category" tick={{fontSize: 11, fontWeight: 500, fill: '#71717a'}} axisLine={false} tickLine={false} interval={0} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} />
                            <Tooltip
                                formatter={(value) => `${value} FTE`}
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                            />
                            <Legend verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold'}} />
                            <Bar dataKey="Demand" fill="#e4e4e7" name="Required FTE" radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="Supply" fill="#be123c" name="Planned FTE" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Analysis Tiles */}
            <div className="space-y-4">
                 <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Info size={14} className="text-zinc-400"/> Personnel Gap Summary
                 </h4>
                 <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                     {analysisData.map(d => (
                         <div key={d.category} className={`p-4 rounded-xl border shadow-sm transition-all hover:shadow-md bg-white ${d.gapHours < -100 ? 'border-rose-300' : 'border-zinc-200'}`}>
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{d.category}</p>
                             <div className="flex items-baseline gap-2 mb-4">
                                <p className={`text-2xl font-mono font-bold ${d.gapHours >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {(d.gapHours / 2080).toFixed(1)}
                                </p>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">FTE Delta</span>
                             </div>
                             <div className="flex items-center gap-2 pt-3 border-t border-zinc-50">
                                 {d.gapHours >= 0 ? (
                                     <ShieldCheck size={14} className="text-emerald-500" />
                                 ) : (
                                     <AlertCircle size={14} className="text-rose-500" />
                                 )}
                                 <span className={`text-[10px] font-bold uppercase ${d.gapHours >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                     {d.gapHours >= 0 ? 'Optimal' : 'Shortfall'}
                                 </span>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Recommendations */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Planning Directives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
                        <div className="p-3 bg-rose-50 rounded-lg text-rose-600 h-fit"><AlertCircle size={20}/></div>
                        <div>
                            <h5 className="text-sm font-bold text-zinc-900 mb-1">Address Shortfalls</h5>
                            <p className="text-xs text-zinc-500 leading-relaxed">Consider contract support (25.1 Object Class) or TDY assignments for categories where FTE gap exceeds -2.0. Budget impact must be verified in Resource Estimates.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 h-fit"><TrendingUp size={20}/></div>
                        <div>
                            <h5 className="text-sm font-bold text-zinc-900 mb-1">Capacity Surplus</h5>
                            <p className="text-xs text-zinc-500 leading-relaxed">Labor categories with surplus capacity should be reviewed for potential re-assignment to backlog work items or intra-district detail programs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GapAnalysis;
