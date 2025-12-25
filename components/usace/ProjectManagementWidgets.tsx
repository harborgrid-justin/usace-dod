
import React from 'react';
import { Ruler, AlertTriangle, CloudRain, Star, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { USACEProject } from '../../types';

const MilestoneItem: React.FC<{ m: {description: string, code: string, scheduledDate: string, status: string} }> = ({ m }) => (
    <div className="flex items-start gap-4 relative">
        <div className={`w-3 h-3 rounded-full border-2 bg-white mt-1 shrink-0 ${
            m.status === 'Complete' ? 'border-emerald-500' :
            m.status === 'Late' || m.status === 'At Risk' ? 'border-rose-500' :
            'border-blue-500'
        }`} />
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-zinc-800">{m.description}</span>
                <span className="text-[10px] font-mono text-zinc-400">{m.code}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-zinc-500">{m.scheduledDate}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                    m.status === 'Complete' ? 'bg-emerald-50 text-emerald-700' :
                    m.status === 'At Risk' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-blue-700'
                }`}>{m.status}</span>
            </div>
        </div>
    </div>
);

export const MilestoneTracker = ({ project }: { project: USACEProject }) => {
    if (!project.milestones) return null;

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Ruler size={14} className="text-zinc-400"/> P2 Milestone Schedule
            </h4>
            <div className="relative pl-4 space-y-6">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-zinc-100 -z-10" />
                {project.milestones.map((m, i) => (
                    <MilestoneItem key={i} m={m} />
                ))}
            </div>
        </div>
    );
};

export const RiskRegister = ({ project }: { project: USACEProject }) => {
    if (!project.risks) return null;

    // Opportunity 13: Sort risks by impact level
    const sortedRisks = [...project.risks].sort((a, b) => {
        const impactScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (impactScore[b.impact as keyof typeof impactScore] || 0) - (impactScore[a.impact as keyof typeof impactScore] || 0);
    });

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-zinc-400"/> Risk Register (PDT)
            </h4>
            <div className="space-y-3">
                {sortedRisks.map(risk => (
                    <div key={risk.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                risk.category === 'Cost' ? 'bg-emerald-100 text-emerald-800' :
                                risk.category === 'Schedule' ? 'bg-blue-100 text-blue-800' :
                                'bg-zinc-200 text-zinc-700'
                            }`}>{risk.category}</span>
                            <span className={`text-[9px] font-bold ${risk.impact === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>
                                {risk.impact.toUpperCase()} IMPACT
                            </span>
                        </div>
                        <p className="text-xs font-medium text-zinc-800 mb-2">{risk.description}</p>
                        <p className="text-[10px] text-zinc-500 italic">Mitigation: {risk.mitigationStrategy}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const WeatherImpactWidget = ({ project }: { project: USACEProject }) => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CloudRain size={14} className="text-zinc-400"/> Weather Impact
        </h4>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-2xl font-mono font-bold text-zinc-900">{project.weatherDelayDays || 0}</p>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Days Claimed</p>
            </div>
            <div className="text-right">
                <p className="text-xl font-mono font-bold text-zinc-400">5</p>
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Historical Avg (Oct)</p>
            </div>
        </div>
        <div className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-800 leading-tight">
            <strong>Note:</strong> 3 days approved for extension. 9 days pending COR review.
        </div>
    </div>
);

export const VendorPerformanceCard = () => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Star size={14} className="text-zinc-400"/> Contractor Performance (CPARS)
        </h4>
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-bold text-xl">4.2</div>
            <div>
                <p className="text-sm font-bold text-zinc-900">Acme Construction, Inc.</p>
                <p className="text-[10px] text-zinc-500">UEI: X82L992K</p>
            </div>
        </div>
        <div className="space-y-2">
            {[
                {label: 'Quality', rating: 4},
                {label: 'Schedule', rating: 3},
                {label: 'Safety', rating: 5}
            ].map((metric) => (
                <div key={metric.label} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">{metric.label}</span>
                    <div className="flex gap-0.5 text-emerald-500">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= metric.rating ? "currentColor" : "none"} className={i <= metric.rating ? "" : "text-zinc-200"} />)}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
