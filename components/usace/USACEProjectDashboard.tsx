
import React, { useState, useMemo } from 'react';
import { 
    ArrowLeft, Construction, Ruler, Hammer, 
    FileText, DollarSign, Box, List, Landmark, Share2
} from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import Breadcrumbs from '../shared/Breadcrumbs';

// Widget Groups
import { CostShareWidget, PRCList, FundingStreamVisualizer, LaborAnalysis } from './FinancialWidgets';
import { MilestoneTracker, RiskRegister, WeatherImpactWidget, VendorPerformanceCard } from './ProjectManagementWidgets';
import { RealEstateStatus, LocalSponsorCard } from './RealEstateWidgets';
import { ContractProgress, ChangeOrderLog, ContractRetainageTracker } from './ContractingWidgets';
import { EngForm93Preview } from './Forms';
import WorkItemManager from './WorkItemManager';
import DeepTracePanel from './DeepTracePanel';

interface Props {
    project: USACEProject;
    onBack: () => void;
}

const USACEProjectDashboard: React.FC<Props> = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState<'Financials' | 'WI' | 'PM' | 'Contracting' | 'Real Estate' | 'Reports' | 'Trace'>('Financials');
    const [assetCreatedMsg, setAssetCreatedMsg] = useState('');

    const percentObligated = useMemo(() => {
        if (!project.financials.currentWorkingEstimate) return 0;
        return (project.financials.obligated / project.financials.currentWorkingEstimate) * 100;
    }, [project.financials.obligated, project.financials.currentWorkingEstimate]);

    const handleCapitalize = () => {
        const newAsset = IntegrationOrchestrator.capitalizeProjectToAsset(project);
        setAssetCreatedMsg(`Asset Created: ${newAsset.id} (Pending Batch Run)`);
        console.log("Integration Triggered: Project Capitalized", newAsset);
    };

    return (
        <div className="flex h-full overflow-hidden bg-zinc-50">
            {/* Side Navigation for Project Context */}
            <div className="w-16 md:w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0">
                <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
                    <button onClick={onBack} className="p-1 hover:bg-zinc-100 rounded text-zinc-500">
                        <ArrowLeft size={16}/>
                    </button>
                    <div className="hidden md:block">
                        <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest line-clamp-1">{project.p2Number}</h2>
                        <p className="text-[10px] text-zinc-500">Project Workspace</p>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                    {[
                        { id: 'Financials', icon: DollarSign, label: 'Financials' },
                        { id: 'Trace', icon: Share2, label: 'Deep Trace (20)' },
                        { id: 'WI', icon: List, label: 'Work Items (WBS)' },
                        { id: 'PM', icon: Ruler, label: 'Proj Mgmt' },
                        { id: 'Contracting', icon: Hammer, label: 'Contracting' },
                        { id: 'Real Estate', icon: Landmark, label: 'Real Estate' },
                        { id: 'Reports', icon: FileText, label: 'Reports (ENG 93)' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase transition-all ${
                                activeTab === tab.id 
                                ? 'bg-rose-50 text-rose-700 border-r-2 border-rose-700' 
                                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 border-r-2 border-transparent'
                            }`}
                        >
                            <tab.icon size={16} />
                            <span className="hidden md:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
                
                <div className="p-4 border-t border-zinc-100 hidden md:block">
                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">CWE</p>
                        <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(project.financials.currentWorkingEstimate)}</p>
                        <div className="mt-2 text-[9px] flex justify-between">
                            <span className="text-zinc-500">Obligated</span>
                            <span className={`font-bold ${percentObligated > 90 ? 'text-emerald-600' : 'text-blue-600'}`}>{percentObligated.toFixed(1)}%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-200 rounded-full mt-1 overflow-hidden">
                            <div className={`h-full ${percentObligated > 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(percentObligated, 100)}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="p-6 border-b border-zinc-200 bg-white shrink-0">
                    <Breadcrumbs items={[{ label: 'USACE Projects', onClick: onBack }, { label: project.p2Number }]} />
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{project.name}</h1>
                            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-medium">
                                <span className="flex items-center gap-1"><Construction size={12}/> {project.district}</span>
                                {project.cwisCode && <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-600 font-mono">CWIS: {project.cwisCode}</span>}
                            </div>
                        </div>
                        {percentObligated > 95 && !assetCreatedMsg && (
                            <button onClick={handleCapitalize} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-emerald-500 transition-colors shadow-sm">
                                <Box size={14} /> Capitalize Asset
                            </button>
                        )}
                        {assetCreatedMsg && (
                            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded border border-emerald-200 animate-in fade-in">
                                {assetCreatedMsg}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    {activeTab === 'Financials' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in">
                            <div className="xl:col-span-2 space-y-6">
                                <FundingStreamVisualizer project={project} />
                                <PRCList project={project} />
                            </div>
                            <div className="space-y-6">
                                <CostShareWidget project={project} />
                                <LaborAnalysis />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Trace' && <DeepTracePanel project={project} />}

                    {activeTab === 'WI' && <WorkItemManager project={project} />}

                    {activeTab === 'PM' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
                            <div className="space-y-6">
                                <MilestoneTracker project={project} />
                                <VendorPerformanceCard />
                            </div>
                            <div className="space-y-6">
                                <RiskRegister project={project} />
                                <WeatherImpactWidget project={project} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Contracting' && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in">
                            <div className="xl:col-span-2 space-y-6">
                                <ContractProgress project={project} />
                                <ChangeOrderLog project={project} />
                            </div>
                            <div className="space-y-6">
                                <ContractRetainageTracker project={project} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Real Estate' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
                            <RealEstateStatus project={project} />
                            <LocalSponsorCard project={project} />
                        </div>
                    )}

                    {activeTab === 'Reports' && (
                        <div className="max-w-4xl mx-auto animate-in fade-in">
                            <EngForm93Preview project={project} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default USACEProjectDashboard;
