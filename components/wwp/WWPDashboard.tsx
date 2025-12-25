
import React, { useMemo } from 'react';
import { 
    WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard, LaborCategory 
} from '../../types';
import { 
    Users, Briefcase, TrendingUp, AlertTriangle, CheckCircle2, 
    DollarSign, BarChart3, PieChart as PieIcon 
} from 'lucide-react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
    CartesianGrid, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    scenarios: WorkforceScenario[];
    workloadItems: WorkloadItem[];
    workforcePlans: WorkforcePlan[];
    laborRates: LaborRate[];
    laborStandards: LaborStandard[];
}

const WWPDashboard: React.FC<Props> = ({
    scenarios,
    workloadItems,
    workforcePlans,
    laborRates,
    laborStandards,
}) => {
    // 1. Calculate Core Metrics
    const activeScenario = useMemo(() => scenarios.find(s => s.isBaseline) || scenarios[0], [scenarios]);
    
    const metrics = useMemo(() => {
        if (!activeScenario) return { totalDemandFTE: 0, totalSupplyFTE: 0, totalCost: 0, gaps: 0 };
        
        const scenarioWorkload = workloadItems.filter(i => activeScenario.workloadItemIds.includes(i.id));
        const scenarioPlans = workforcePlans.filter(p => activeScenario.workforcePlanIds.includes(p.id));

        let demandHours = 0;
        scenarioWorkload.forEach(item => {
            const standard = laborStandards.find(s => s.workloadUnit === item.unit);
            if (standard) demandHours += item.quantity * standard.hoursPerUnit;
        });

        let supplyFTE = 0;
        scenarioPlans.forEach(plan => {
            plan.entries.forEach(entry => supplyFTE += (entry.fundedFTE + entry.unfundedFTE));
        });

        const demandFTE = demandHours / 2080;
        
        // Calculate Total Projected Cost (Supply based)
        let totalCost = 0;
        scenarioPlans.forEach(plan => {
            plan.entries.forEach(entry => {
                const rate = laborRates.find(r => r.laborCategory === entry.laborCategory)?.rate || 0;
                totalCost += (entry.fundedFTE + entry.unfundedFTE) * 2080 * rate;
            });
        });

        return {
            totalDemandFTE: demandFTE,
            totalSupplyFTE: supplyFTE,
            totalCost: totalCost,
            gaps: Math.max(0, demandFTE - supplyFTE)
        };
    }, [activeScenario, workloadItems, workforcePlans, laborStandards, laborRates]);

    // 2. Chart Data: Demand vs Supply by Labor Category
    const categoryData = useMemo(() => {
        const categories: LaborCategory[] = ['Engineer', 'Scientist', 'Technician', 'Admin', 'Project Manager'];
        const scenarioWorkload = workloadItems.filter(i => activeScenario?.workloadItemIds.includes(i.id));
        const scenarioPlans = workforcePlans.filter(p => activeScenario?.workforcePlanIds.includes(p.id));

        return categories.map(cat => {
            let dHours = 0;
            scenarioWorkload.forEach(item => {
                const std = laborStandards.find(s => s.workloadUnit === item.unit && s.laborCategory === cat);
                if (std) dHours += item.quantity * std.hoursPerUnit;
            });

            let sFTE = 0;
            scenarioPlans.forEach(plan => {
                const entry = plan.entries.find(e => e.laborCategory === cat);
                if (entry) sFTE += (entry.fundedFTE + entry.unfundedFTE);
            });

            return {
                name: cat,
                Demand: dHours / 2080,
                Supply: sFTE
            };
        });
    }, [activeScenario, workloadItems, workforcePlans, laborStandards]);

    const pieData = [
        { name: 'Funded', value: workforcePlans.reduce((sum, p) => sum + p.entries.reduce((es, e) => es + e.fundedFTE, 0), 0), color: '#059669' },
        { name: 'Unfunded', value: workforcePlans.reduce((sum, p) => sum + p.entries.reduce((es, e) => es + e.unfundedFTE, 0), 0), color: '#f59e0b' }
    ];

    return (
        <div className="p-2 space-y-6 h-full overflow-y-auto custom-scrollbar animate-in fade-in">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Planned FTE</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{metrics.totalSupplyFTE.toFixed(1)}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Based on active scenario: {activeScenario?.name}</p>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Briefcase size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">FTE Demand</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{metrics.totalDemandFTE.toFixed(1)}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Required to execute current workload</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Est. Labor Cost</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-emerald-600">{formatCurrency(metrics.totalCost)}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Projected FY Total burdened</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><AlertTriangle size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Shortfall Gap</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-amber-600">{metrics.gaps.toFixed(1)} FTE</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{metrics.gaps > 0 ? 'Hiring action required' : 'Workforce balanced'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Comparison Chart */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={16} className="text-zinc-400" /> Supply vs Demand Analysis
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase">
                                <div className="w-2.5 h-2.5 bg-zinc-200 rounded-sm" /> Required
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase">
                                <div className="w-2.5 h-2.5 bg-rose-600 rounded-sm" /> Planned
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }}
                                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                                />
                                <Bar dataKey="Demand" fill="#e4e4e7" radius={[4, 4, 0, 0]} name="Required FTE" />
                                <Bar dataKey="Supply" fill="#be123c" radius={[4, 4, 0, 0]} name="Planned FTE" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Workforce Composition */}
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <PieIcon size={16} className="text-zinc-400" /> Funding Composition
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 w-full space-y-3">
                            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex justify-between items-center">
                                <span className="text-xs font-medium text-zinc-500">Funded Positions</span>
                                <span className="text-xs font-mono font-bold text-emerald-700">{pieData[0].value.toFixed(1)}</span>
                            </div>
                            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex justify-between items-center">
                                <span className="text-xs font-medium text-zinc-500">Unfunded (Overhire)</span>
                                <span className="text-xs font-mono font-bold text-amber-700">{pieData[1].value.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Warnings */}
            <div className="bg-zinc-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><TrendingUp size={120} /></div>
                <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3">
                        <TrendingUp className="text-emerald-400" /> Strategic Outlook FY25-26
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Automation Impact</p>
                            <p className="text-sm text-zinc-200">CEFMS II modernization projected to reduce Admin demand by 12% across all districts.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Retirement Risk</p>
                            <p className="text-sm text-zinc-200">42% of GS-13+ Engineering workforce eligible for retirement within 24 months. Knowledge transfer critical.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Budget Variance</p>
                            <p className="text-sm text-zinc-200">Labor escalation rates exceeding programmed 3.2% cap. Re-alignment of PRIP assets suggested.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WWPDashboard;
