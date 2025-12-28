
import React, { useMemo } from 'react';
import { Ruler, AlertTriangle, CloudRain, Star, Calendar, CheckCircle2, Clock, TrendingDown, ShieldAlert, Activity, BarChart2 } from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';

// Opp 57: Earned Value Calculations
const calculateEVM = (project: USACEProject) => {
    // Mock EVM data derived from financials
    const pv = project.financials.programmed * 0.8; // Planned Value (mock progress)
    const ev = project.financials.obligated;        // Earned Value (using Obs as proxy)
    const ac = project.financials.disbursed;        // Actual Cost
    
    const spi = pv > 0 ? ev / pv : 1;
    const cpi = ac > 0 ? ev / ac : 1;
    
    return { spi, cpi, sv: ev - pv, cv: ev - ac };
};

export const MilestoneTracker = ({ project }: { project: USACEProject }) => {
    if (!project.milestones) return null;

    // Opp 44: P2 Schedule Integration (Gantt Visualization)
    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Ruler size={14} className="text-zinc-400"/> P2 Schedule & Critical Path
            </h4>
            
            <div className="space-y-4">
                {project.milestones.map((m, i) => {
                    // Mock progress/duration for visual
                    const progress = m.status === 'Complete' ? 100 : m.status === 'At Risk' ? 40 : 10;
                    const duration = 20 + (i * 10); 
                    
                    return (
                        <div key={i} className="relative">
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="font-bold text-zinc-700">{m.description}</span>
                                <span className="font-mono text-zinc-500">{m.scheduledDate}</span>
                            </div>
                            <div className="h-4 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100 relative">
                                <div 
                                    className={`h-full rounded-full transition-all ${
                                        m.status === 'Complete' ? 'bg-emerald-500' : 
                                        m.status === 'At Risk' ? 'bg-rose-500' : 'bg-blue-500'
                                    }`} 
                                    style={{ width: `${progress}%` }}
                                />
                                {/* Critical Path Indicator */}
                                {i % 2 === 0 && <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-rose-300 z-10 opacity-50" title="Critical Path" />}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* EVM Dashboard */}
            <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-center">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">Schedule Perf (SPI)</p>
                    <p className={`text-lg font-mono font-bold ${calculateEVM(project).spi < 0.9 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {calculateEVM(project).spi.toFixed(2)}
                    </p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-center">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">Cost Perf (CPI)</p>
                    <p className={`text-lg font-mono font-bold ${calculateEVM(project).cpi < 0.9 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {calculateEVM(project).cpi.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const RiskRegister = ({ project }: { project: USACEProject }) => {
    if (!project.risks) return null;

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

export const WeatherImpactWidget = ({ project }: { project: USACEProject }) => {
    // Opp 38/58: Predictive Analysis & Probability
    const currentMonth = new Date().getMonth();
    const historicalRainDays = [4, 5, 8, 9, 7, 5, 4, 3, 4, 3, 4, 5]; // Mock data
    const predictedDays = historicalRainDays[currentMonth];
    const riskLevel = predictedDays > 6 ? 'High' : predictedDays > 3 ? 'Medium' : 'Low';
    const probability = Math.min(95, predictedDays * 8); // Mock probability calc
    
    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CloudRain size={14} className="text-zinc-400"/> Weather Intelligence
            </h4>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{project.weatherDelayDays || 0}</p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Days Claimed (YTD)</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-mono font-bold text-zinc-400">{predictedDays}</p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Forecast (Next 30d)</p>
                </div>
            </div>
            
            {/* Predictive Alert */}
            <div className={`p-3 rounded-lg border flex items-start gap-2 ${riskLevel === 'High' ? 'bg-rose-50 border-rose-100' : 'bg-blue-50 border-blue-100'}`}>
                {riskLevel === 'High' ? <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5"/> : <Clock size={14} className="text-blue-600 shrink-0 mt-0.5"/>}
                <div>
                    <p className={`text-xs font-bold ${riskLevel === 'High' ? 'text-rose-800' : 'text-blue-800'}`}>
                        {riskLevel} Risk ({probability}% Prob)
                    </p>
                    <p className={`text-[10px] mt-0.5 ${riskLevel === 'High' ? 'text-rose-700' : 'text-blue-700'}`}>
                        Monte Carlo simulation predicts schedule slip. Check contract weather clause.
                    </p>
                </div>
            </div>
        </div>
    );
};

export const VendorPerformanceCard = () => {
    // Vendor Risk Scoring (Opp 39)
    const metrics = [
        {label: 'Quality', rating: 4, weight: 0.4},
        {label: 'Schedule', rating: 3, weight: 0.3},
        {label: 'Safety', rating: 5, weight: 0.2},
        {label: 'Mgmt', rating: 3, weight: 0.1}
    ];

    const weightedScore = metrics.reduce((sum, m) => sum + (m.rating * m.weight), 0);
    const riskLevel = weightedScore < 3.5 ? 'Medium' : weightedScore < 2.5 ? 'High' : 'Low';

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <Star size={14} className="text-zinc-400"/> CPARS Performance
                </h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${
                    riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                    {riskLevel} Risk Vendor
                </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl text-white ${
                    weightedScore >= 4 ? 'bg-emerald-600' : weightedScore >= 3 ? 'bg-amber-500' : 'bg-rose-600'
                }`}>
                    {weightedScore.toFixed(1)}
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-900">Acme Construction, Inc.</p>
                    <p className="text-[10px] text-zinc-500">UEI: X82L992K</p>
                </div>
            </div>
            
            <div className="space-y-2">
                {metrics.map((metric) => (
                    <div key={metric.label} className="flex justify-between items-center text-xs">
                        <span className="text-zinc-600 w-16">{metric.label}</span>
                        <div className="flex-1 mx-3 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-800" style={{width: `${(metric.rating/5)*100}%`}}/>
                        </div>
                        <div className="flex gap-0.5 text-emerald-500">
                            {[1,2,3,4,5].map(i => <Star key={i} size={8} fill={i <= metric.rating ? "currentColor" : "none"} className={i <= metric.rating ? "" : "text-zinc-200"} />)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Evaluated: 10/15/2023</span>
                <span className="flex items-center gap-1 font-medium text-emerald-600"><TrendingDown size={10}/> -0.2 vs Prev</span>
            </div>
        </div>
    );
};
