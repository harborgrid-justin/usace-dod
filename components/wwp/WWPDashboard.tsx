import React, { useMemo } from 'react';
import { WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard, LaborCategory } from '../../types';
import { Users, Briefcase, DollarSign, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import WWPCharts from './WWPCharts';

interface Props {
    scenarios: WorkforceScenario[]; workloadItems: WorkloadItem[]; workforcePlans: WorkforcePlan[]; laborRates: LaborRate[]; laborStandards: LaborStandard[];
}

const KPICard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-3"><div className={`p-2 rounded-lg bg-zinc-50 ${color}`}><Icon size={16}/></div><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span></div>
        <p className="text-2xl font-mono font-bold text-zinc-900">{value}</p><p className="text-[10px] text-zinc-500 mt-1">{sub}</p>
    </div>
);

const WWPDashboard: React.FC<Props> = (props) => {
    const active = useMemo(() => props.scenarios.find(s => s.isBaseline) || props.scenarios[0], [props.scenarios]);
    const metrics = useMemo(() => {
        if (!active) return { demand: 0, supply: 0, cost: 0 };
        const wItems = props.workloadItems.filter(i => active.workloadItemIds.includes(i.id));
        const wPlans = props.workforcePlans.filter(p => active.workforcePlanIds.includes(p.id));
        let dHrs = 0; wItems.forEach(i => { const s = props.laborStandards.find(st => st.workloadUnit === i.unit); if (s) dHrs += i.quantity * s.hoursPerUnit; });
        let sFTE = 0; wPlans.forEach(p => p.entries.forEach(e => sFTE += (e.fundedFTE + e.unfundedFTE)));
        return { demand: dHrs / 2080, supply: sFTE, cost: sFTE * 2080 * 85 }; // Simplified avg rate
    }, [active, props.workloadItems, props.workforcePlans, props.laborStandards]);

    const chartData = useMemo(() => (['Engineer', 'Scientist', 'Admin'] as LaborCategory[]).map(cat => ({ name: cat, Demand: metrics.demand / 3, Supply: metrics.supply / 3 })), [metrics]);

    return (
        <div className="space-y-6 h-full overflow-y-auto custom-scrollbar p-2 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard label="Total FTE" value={metrics.supply.toFixed(1)} sub="Active Authorization" icon={Users} color="text-blue-600" />
                <KPICard label="FTE Demand" value={metrics.demand.toFixed(1)} sub="Mission Required" icon={Briefcase} color="text-rose-600" />
                <KPICard label="Total Cost" value={formatCurrency(metrics.cost)} sub="Burdened Projection" icon={DollarSign} color="text-emerald-600" />
                <KPICard label="Capacity Gap" value={(metrics.demand - metrics.supply).toFixed(1)} sub="Shortfall Magnitude" icon={AlertTriangle} color="text-amber-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><WWPCharts data={chartData}/><div className="bg-zinc-900 rounded-xl p-8 text-white shadow-xl h-full"><h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-400">Strategic Warnings</h4><p className="text-xs leading-relaxed text-zinc-300">Retirement Risk: 42% of GS-13+ Engineering workforce eligible for retirement within 24 months. Knowledge transfer critical.</p></div></div>
        </div>
    );
};
export default WWPDashboard;