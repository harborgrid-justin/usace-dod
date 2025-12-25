
import React, { useState, useMemo } from 'react';
import { 
    Activity, TrendingUp, AlertTriangle, Building2, Gavel, 
    MapPin, Calculator, FileCheck, Lock, Clock, ShieldAlert 
} from 'lucide-react';
import { BracInstallation, BracScenario } from '../../types';
import { BracDssEngine } from '../../services/BracDssEngine';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, LineChart, Line } from 'recharts';

// --- MOCK DATA ---
const MOCK_INSTALLATIONS: BracInstallation[] = [
    {
        id: 'INST-001', name: 'Fort Liberty', service: 'Army', region: 'Southeast',
        currentTroopDensity: 45000, totalForceCapacity: 60000, availableAcreage: 15000,
        conditionCode: 88, isJointBase: true,
        infrastructure: { schoolCapacityPct: 85, hospitalBedsPer1000: 3.1, highwayLevelOfService: 'B' },
        economicData: { regionalEmployment: 150000, defenseDependencyIndex: 0.45 },
        environmental: { hasSuperfundSite: false, rmisCleanupEstimate: 1200000 },
        projected20YearReq: 12000
    },
    {
        id: 'INST-002', name: 'Naval Station Norfolk', service: 'Navy', region: 'Mid-Atlantic',
        currentTroopDensity: 32000, totalForceCapacity: 35000, availableAcreage: 4000,
        conditionCode: 72, isJointBase: false,
        infrastructure: { schoolCapacityPct: 98, hospitalBedsPer1000: 2.2, highwayLevelOfService: 'F' },
        economicData: { regionalEmployment: 400000, defenseDependencyIndex: 0.60 },
        environmental: { hasSuperfundSite: true, rmisCleanupEstimate: 45000000 },
        projected20YearReq: 3800
    }
];

const MOCK_SCENARIOS: BracScenario[] = [
    {
        id: 'SCN-25-001', name: 'Realign Engineering to Liberty', type: 'Realignment',
        losingInstallationId: 'INST-002', gainingInstallationId: 'INST-001',
        personnelMoving: 2500, milconCost: 150000000, oneTimeMovingCost: 45000000, annualSavings: 35000000,
        status: 'Candidate', auditLog: []
    }
];

const BracDssView: React.FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<BracScenario>(MOCK_SCENARIOS[0]);
    const [activeTab, setActiveTab] = useState<'Analysis' | 'Timeline' | 'Report'>('Analysis');

    const losing = MOCK_INSTALLATIONS.find(i => i.id === selectedScenario.losingInstallationId)!;
    const gaining = MOCK_INSTALLATIONS.find(i => i.id === selectedScenario.gainingInstallationId);

    // --- RUN ENGINE ---
    const analysis = useMemo(() => 
        BracDssEngine.analyzeScenario(selectedScenario, losing, gaining), 
    [selectedScenario, losing, gaining]);

    // Chart Data for COBRA
    const cobraData = useMemo(() => {
        const data = [];
        let cumCashFlow = -selectedScenario.oneTimeMovingCost - selectedScenario.milconCost;
        for(let i=0; i<=20; i++) {
            if(i > 0) cumCashFlow += selectedScenario.annualSavings;
            data.push({ year: `Yr ${i}`, npv: cumCashFlow });
        }
        return data;
    }, [selectedScenario]);

    const handleLock = () => {
        if(confirm("CONFIRM LEGISLATIVE LOCK: This will freeze all data and generate the Congressional Notification Package per 10 U.S.C. 2687.")) {
            // In a real app this would save to state, here we just alert
            alert("Scenario Locked. Notification Package Generated.");
        }
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Gavel size={24} className="text-indigo-700" /> OSD BRAC Decision Support
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">10 U.S.C. § 2687 Analysis Engine • Round 2025</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    {['Analysis', 'Timeline', 'Report'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === t ? 'bg-white shadow-sm text-indigo-700' : 'text-zinc-500'}`}>{t}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {activeTab === 'Analysis' && (
                    <div className="space-y-6">
                        {/* Scorecards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Military Value (MVI)</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Activity size={20}/></div>
                                    <p className="text-2xl font-mono font-bold text-zinc-900">{analysis.mviScore.toFixed(1)}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Payback Period</p>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${analysis.paybackPeriod > 20 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}><Calculator size={20}/></div>
                                    <p className={`text-2xl font-mono font-bold ${analysis.paybackPeriod > 20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {analysis.paybackPeriod > 20 ? '>20' : analysis.paybackPeriod} Yrs
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Economic Impact</p>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${analysis.economicImpactIndex > 5 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}><TrendingUp size={20}/></div>
                                    <p className="text-2xl font-mono font-bold text-zinc-900">{analysis.economicImpactIndex.toFixed(2)}%</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Env. Liability</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg"><ShieldAlert size={20}/></div>
                                    <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(analysis.environmentalLiability)}</p>
                                </div>
                            </div>
                        </div>

                        {/* COBRA Chart & Alerts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-[400px] flex flex-col">
                                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">COBRA Analysis: Net Present Value (NPV)</h3>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={cobraData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10}}/>
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `$${val/1e6}M`}/>
                                            <Tooltip formatter={(val:number) => formatCurrency(val)} />
                                            <ReferenceLine y={0} stroke="#a1a1aa" />
                                            <Line type="monotone" dataKey="npv" stroke="#4f46e5" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-amber-500"/> System Alerts
                                    </h3>
                                    <div className="space-y-2">
                                        {analysis.alerts.map((alert, i) => (
                                            <div key={i} className="p-3 bg-white border border-zinc-100 rounded-lg text-xs text-rose-700 font-medium shadow-sm flex gap-2">
                                                <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                                                {alert}
                                            </div>
                                        ))}
                                        {analysis.alerts.length === 0 && <p className="text-xs text-zinc-400 italic">No critical alerts detected.</p>}
                                    </div>
                                </div>
                                <div className="bg-white border border-zinc-200 rounded-xl p-6">
                                     <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <MapPin size={14} className="text-zinc-400"/> Jointness Assessment
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Service Mix</span>
                                            <span className="font-bold text-zinc-900">Army / Navy</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Synergy Score</span>
                                            <span className={`font-bold ${analysis.jointnessScore > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{analysis.jointnessScore.toFixed(1)}</span>
                                        </div>
                                        <div className="p-2 bg-zinc-50 rounded text-[10px] text-zinc-600 leading-tight">
                                            {analysis.jointnessScore > 0 ? "Positive synergy detected through shared infrastructure." : "Potential operational interference detected."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'Timeline' && (
                    <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2"><Clock size={20} /> Implementation Lifecycle (PMO)</h3>
                        <div className="relative pl-8 border-l-2 border-indigo-100 space-y-12">
                            {BracDssEngine.getLifecycleMilestones(new Date()).map((ms, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-indigo-600 shadow-sm" />
                                    <h4 className="text-sm font-bold text-zinc-900">{ms.stage}</h4>
                                    <p className="text-xs font-mono text-zinc-400 mt-1">{new Date(ms.deadline).toLocaleDateString()}</p>
                                    <p className="text-xs text-zinc-600 mt-2">{ms.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Report' && (
                     <div className="flex flex-col items-center justify-center h-full gap-6">
                        <div className="bg-zinc-50 p-8 rounded-2xl border-2 border-dashed border-zinc-200 text-center max-w-lg">
                            <Lock size={48} className="mx-auto text-zinc-300 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-900">Legislative Lock Control</h3>
                            <p className="text-sm text-zinc-500 mt-2 mb-6">
                                Finalizing this recommendation will freeze all data points and generate the 
                                statutory 10 U.S.C. § 2687 Congressional Notification Package. 
                                This action cannot be undone.
                            </p>
                            <button onClick={handleLock} className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl flex items-center gap-2 mx-auto">
                                <FileCheck size={16}/> Finalize & Generate Package
                            </button>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

export default BracDssView;
