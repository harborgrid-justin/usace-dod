
import React, { useState } from 'react';
import { Brain, Copy, Plus, Save, ChevronRight, BarChart3, Users, Briefcase, Info, ChevronDown, ChevronUp, LayoutList } from 'lucide-react';
import {
    WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard
} from '../../types';
import WorkloadPlanner from './WorkloadPlanner';
import WorkforcePlanner from './WorkforcePlanner';
import GapAnalysis from './GapAnalysis';

interface Props {
    scenarios: WorkforceScenario[];
    allWorkloadItems: WorkloadItem[];
    allWorkforcePlans: WorkforcePlan[];
    laborRates: LaborRate[];
    laborStandards: LaborStandard[];
    onUpdateScenario: (scenario: WorkforceScenario) => void;
    onCreateScenario: (scenario: WorkforceScenario) => void;
    onUpdateWorkload: (item: WorkloadItem) => void;
    onUpdateWorkforce: (plan: WorkforcePlan) => void;
    onSelectProject: (projectId: string) => void;
}

const ScenarioPlanner: React.FC<Props> = ({
    scenarios,
    allWorkloadItems,
    allWorkforcePlans,
    laborRates,
    laborStandards,
    onUpdateScenario,
    onCreateScenario,
    onUpdateWorkload,
    onUpdateWorkforce,
    onSelectProject,
}) => {
    const [activeScenarioId, setActiveScenarioId] = useState<string | null>(scenarios.find(s => s.isBaseline)?.id || scenarios[0]?.id || null);
    const [activeTab, setActiveTab] = useState<'Workload' | 'Workforce' | 'Analysis'>('Analysis');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const activeScenario = scenarios.find(s => s.id === activeScenarioId);
    
    const workloadForScenario = activeScenario ? allWorkloadItems.filter(item => activeScenario.workloadItemIds.includes(item.id)) : [];
    const plansForScenario = activeScenario ? allWorkforcePlans.filter(plan => activeScenario.workforcePlanIds.includes(plan.id)) : [];

    const handleCreateScenario = () => {
        const baseline = scenarios.find(s => s.isBaseline) || scenarios[0];
        const newScenario: WorkforceScenario = {
            ...baseline,
            id: `SCN-${Date.now()}`,
            name: `${baseline.name} - Simulation`,
            isBaseline: false,
            status: 'Draft',
            auditLog: [{ timestamp: new Date().toISOString(), user: 'WWP_Planner', action: 'Scenario Created' }]
        };
        onCreateScenario(newScenario);
        setActiveScenarioId(newScenario.id);
        setIsMobileMenuOpen(false);
    };

    const handleSelectScenario = (id: string) => {
        setActiveScenarioId(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-full min-h-0 relative">
            
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-2">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl shadow-sm active:bg-zinc-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <LayoutList size={18} className="text-zinc-500" />
                        <div className="text-left">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Active Scenario</span>
                            <span className="text-sm font-bold text-zinc-900 block truncate max-w-[200px]">
                                {activeScenario?.name || "Select Scenario..."}
                            </span>
                        </div>
                    </div>
                    {isMobileMenuOpen ? <ChevronUp size={20} className="text-zinc-400"/> : <ChevronDown size={20} className="text-zinc-400"/>}
                </button>
            </div>

            {/* Sidebar / List */}
            <div className={`
                lg:col-span-3 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden
                ${isMobileMenuOpen ? 'absolute inset-0 z-20 h-full' : 'hidden lg:flex max-h-64 lg:max-h-full'}
            `}>
                <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 sticky top-0 z-10">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Planning Library</h3>
                    <div className="flex gap-2">
                        <button onClick={handleCreateScenario} className="p-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors shadow-sm"><Plus size={14} /></button>
                        {isMobileMenuOpen && (
                            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-1.5 bg-zinc-100 text-zinc-500 rounded hover:bg-zinc-200"><ChevronUp size={14}/></button>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {scenarios.map(s => (
                        <button 
                            key={s.id} 
                            onClick={() => handleSelectScenario(s.id)} 
                            className={`w-full text-left p-3 rounded-lg border transition-all ${activeScenarioId === s.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-md scale-[1.02]' : 'bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${activeScenarioId === s.id ? 'text-zinc-400' : 'text-zinc-400'}`}>FY{s.fiscalYear}</span>
                                {s.isBaseline && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${activeScenarioId === s.id ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-100 text-zinc-600'}`}>MASTER</span>}
                            </div>
                            <p className="font-bold text-sm truncate">{s.name}</p>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                {activeScenario ? (
                    <>
                        <div className="p-2 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center shrink-0 bg-zinc-50/30 gap-3 sm:gap-0">
                            <div className="flex gap-2 p-1 overflow-x-auto w-full sm:w-auto custom-scrollbar">
                                {(['Analysis', 'Workload', 'Workforce'] as const).map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)} 
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold uppercase rounded-lg transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm text-zinc-900 ring-1 ring-zinc-200' : 'text-zinc-400 hover:text-zinc-900'}`}
                                    >
                                        {tab === 'Analysis' && <BarChart3 size={14}/>}
                                        {tab === 'Workload' && <Briefcase size={14}/>}
                                        {tab === 'Workforce' && <Users size={14}/>}
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            {!activeScenario.isBaseline && (
                                <button className="w-full sm:w-auto mr-3 px-4 py-1.5 bg-rose-700 text-white rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-rose-800 transition-all">
                                    <Save size={12}/> Commit Simulation
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                            {activeTab === 'Workload' && (
                                <WorkloadPlanner 
                                    items={workloadForScenario} 
                                    onSelectProject={onSelectProject} 
                                    onUpdateItem={onUpdateWorkload}
                                />
                            )}
                            {activeTab === 'Workforce' && (
                                <WorkforcePlanner 
                                    plans={plansForScenario} 
                                    onUpdatePlan={onUpdateWorkforce}
                                />
                            )}
                            {activeTab === 'Analysis' && (
                                <GapAnalysis
                                    workloadItems={workloadForScenario}
                                    workforcePlans={plansForScenario}
                                    laborRates={laborRates}
                                    laborStandards={laborStandards}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3">
                        <Brain size={48} className="opacity-20"/>
                        <p className="text-sm font-medium">Select a planning scenario from the library.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScenarioPlanner;
