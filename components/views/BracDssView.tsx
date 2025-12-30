
import React, { useState, useMemo, useTransition, useCallback } from 'react';
import { 
    Activity, TrendingUp, AlertTriangle, Building2, Gavel, 
    MapPin, Calculator, FileCheck, Lock, Clock, ShieldAlert, Sparkles, Bot
} from 'lucide-react';
import { BracInstallation, BracScenario } from '../../types';
import { BracDssEngine } from '../../services/BracDssEngine';
import { formatCurrency } from '../../utils/formatting';
import { optimizeBracScenario } from '../../services/geminiService';
import { remisService } from '../../services/RemisDataService';
import { useService } from '../../hooks/useService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, LineChart, Line } from 'recharts';
import InstallationComparison from '../brac/InstallationComparison';

const BracDssView: React.FC = () => {
    const installations = useService<BracInstallation[]>(remisService, useCallback(() => remisService.getBracInstallations(), []));
    const scenarios = useService<BracScenario[]>(remisService, useCallback(() => remisService.getBracScenarios(), []));
    
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
    const [activeTab, setActiveTab] = useState<'Analysis' | 'Comparison' | 'Timeline' | 'Report'>('Analysis');
    const [optimizationResult, setOptimizationResult] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isPending, startTransition] = useTransition();

    const selectedScenario = useMemo(() => scenarios.find(s => s.id === selectedScenarioId)!, [scenarios, selectedScenarioId]);
    const losing = useMemo(() => installations.find(i => i.id === selectedScenario.losingInstallationId)!, [installations, selectedScenario]);
    const gaining = useMemo(() => installations.find(i => i.id === selectedScenario.gainingInstallationId), [installations, selectedScenario]);

    const analysis = useMemo(() => 
        BracDssEngine.analyzeScenario(selectedScenario, losing, gaining), 
    [selectedScenario, losing, gaining]);

    const cobraData = useMemo(() => {
        const data = [];
        let cumCashFlow = -selectedScenario.oneTimeMovingCost - selectedScenario.milconCost;
        for(let i=0; i<=20; i++) {
            if(i > 0) cumCashFlow += selectedScenario.annualSavings;
            data.push({ year: `Yr ${i}`, npv: cumCashFlow });
        }
        return data;
    }, [selectedScenario]);

    const handleOptimize = async () => {
        setIsOptimizing(true);
        const result = await optimizeBracScenario(selectedScenario, installations);
        setOptimizationResult(result);
        setIsOptimizing(false);
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/50 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Gavel size={28} className="text-indigo-700" /> OSD BRAC Decision Support
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">10 U.S.C. § 2687 Analysis Engine • GFEBS Integration</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-md shadow-inner">
                    {['Analysis', 'Comparison', 'Timeline', 'Report'].map(t => (
                        <button 
                            key={t} 
                            onClick={() => setActiveTab(t as any)} 
                            className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                activeTab === t ? 'bg-white shadow-sm text-indigo-700' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                {activeTab === 'Analysis' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm transition-all hover:border-indigo-300">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Military Value Index</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-sm"><Activity size={20}/></div>
                                    <p className="text-2xl font-mono font-bold text-zinc-900">{analysis.mviScore.toFixed(1)}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm transition-all hover:border-indigo-300">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Payback Period</p>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-sm ${analysis.paybackPeriod > 20 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}><Calculator size={20}/></div>
                                    <p className={`text-2xl font-mono font-bold ${analysis.paybackPeriod > 20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {analysis.paybackPeriod > 20 ? '>20' : analysis.paybackPeriod} Yrs
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm transition-all hover:border-indigo-300">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Econ impact index</p>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-sm ${analysis.economicImpactIndex > 5 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}><TrendingUp size={20}/></div>
                                    <p className="text-2xl font-mono font-bold text-zinc-900">{analysis.economicImpactIndex.toFixed(2)}%</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm transition-all hover:border-indigo-300">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Env. Liability (Est)</p>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 text-zinc-600 rounded-sm"><ShieldAlert size={20}/></div>
                                    <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(analysis.environmentalLiability)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-8 bg-white p-8 rounded-md border border-zinc-200 shadow-sm h-[450px] flex flex-col">
                                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">COBRA Analysis: Net Present Value (NPV)</h3>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={cobraData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#71717a'}}/>
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} tickFormatter={(val) => `$${val/1e6}M`}/>
                                            <Tooltip contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px'}} formatter={(val:number) => formatCurrency(val)} />
                                            <ReferenceLine y={0} stroke="#a1a1aa" />
                                            <Line type="monotone" dataKey="npv" stroke="#4f46e5" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-zinc-900 p-8 rounded-md text-white shadow-2xl relative overflow-hidden flex-1 border border-zinc-800">
                                    <div className="absolute top-0 right-0 p-8 opacity-10"><Bot size={100}/></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles size={16} className="text-emerald-400" /> Sentinel Strategist
                                            </h4>
                                            <button 
                                                onClick={handleOptimize} 
                                                disabled={isOptimizing}
                                                className="p-1.5 bg-white/10 rounded-sm hover:bg-white/20 transition-all disabled:opacity-30"
                                            >
                                                {isOptimizing ? <Clock size={14} className="animate-spin"/> : <Activity size={14}/>}
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
                                            {optimizationResult ? (
                                                <div className="text-[10px] leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap animate-in fade-in">
                                                    {optimizationResult}
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-zinc-500 font-medium italic text-center py-12">Click the engine icon to run optimization for this realignment.</p>
                                            )}
                                        </div>
                                        <button className="w-full py-3 bg-white text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-zinc-100 transition-all active:scale-95">
                                            Optimize Logic
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'Comparison' && (
                    <InstallationComparison installations={installations} />
                )}

                {activeTab === 'Timeline' && (
                    <div className="bg-white p-8 rounded-md border border-zinc-200 shadow-sm animate-in fade-in">
                        <h3 className="text-sm font-bold text-zinc-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
                            <Clock size={18} className="text-zinc-400" /> Statutory Implementation Roadmap
                        </h3>
                        <div className="relative pl-12 border-l-2 border-indigo-100 space-y-16">
                            {BracDssEngine.getLifecycleMilestones(new Date()).map((ms, i) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[53px] top-0 w-8 h-8 rounded-full bg-white border-4 border-indigo-600 shadow-xl group-hover:scale-110 transition-transform flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                    </div>
                                    <div className="bg-zinc-50 p-6 rounded-md border border-zinc-100 group-hover:bg-white group-hover:border-indigo-200 transition-all shadow-sm max-w-2xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{ms.stage}</h4>
                                            <p className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-sm border">TARGET: {new Date(ms.deadline).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{ms.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Report' && (
                     <div className="flex flex-col items-center justify-center h-full gap-8 animate-in zoom-in duration-500">
                        <div className="bg-zinc-900 p-12 rounded-md shadow-2xl text-center max-w-2xl border border-zinc-800 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                            <div className="w-20 h-20 bg-rose-600/10 rounded-md flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
                                <Lock size={40} className="text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Legislative Lock Control</h3>
                            <p className="text-xs text-zinc-400 mt-4 mb-10 leading-relaxed font-medium px-8">
                                Affirming this recommendation will freeze all analytic data points and generate the 
                                statutory <span className="text-rose-400 font-bold">10 U.S.C. § 2687 Congressional Notification Package</span>. 
                                This operation creates a permanent audit record.
                            </p>
                            <button className="w-full py-3 bg-white text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-100 shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                                <FileCheck size={16}/> Execute Fiduciary Lock
                            </button>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

export default BracDssView;
