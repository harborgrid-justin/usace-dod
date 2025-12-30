
import React from 'react';
import { USACEProject } from '../../../types';
import Breadcrumbs from '../../shared/Breadcrumbs';
import { FundingStreamVisualizer, PRCList } from '../FinancialWidgets';
import WorkItemManager from '../WorkItemManager';
import DeepTracePanel from '../DeepTracePanel';
import { RealEstateStatus, LocalSponsorCard } from '../RealEstateWidgets';
import { MilestoneTracker, RiskRegister, WeatherImpactWidget, VendorPerformanceCard } from '../ProjectManagementWidgets';
import { ContractProgress, ChangeOrderLog, ContractRetainageTracker } from '../ContractingWidgets';
import { EngForm93Preview } from '../Forms';

const ProjectWorkArea: React.FC<{project: USACEProject, activeTab: string, onBack: () => void}> = ({ project, activeTab, onBack }) => (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 bg-white shrink-0">
            <Breadcrumbs items={[{ label: 'USACE Projects', onClick: onBack }, { label: project.p2Number }]} />
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{project.name}</h1>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {activeTab === 'Financials' && <div className="space-y-6"><FundingStreamVisualizer project={project} /><PRCList project={project} /></div>}
            {activeTab === 'Trace' && <DeepTracePanel project={project} />}
            {activeTab === 'WI' && <WorkItemManager project={project} />}
            
            {activeTab === 'Real Estate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealEstateStatus project={project} />
                    <LocalSponsorCard project={project} />
                </div>
            )}

            {activeTab === 'PM' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MilestoneTracker project={project} />
                        <RiskRegister project={project} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <WeatherImpactWidget project={project} />
                         <VendorPerformanceCard />
                    </div>
                </div>
            )}

            {activeTab === 'Contracting' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ContractProgress project={project} />
                        <div className="space-y-6">
                            <ContractRetainageTracker project={project} />
                            <ChangeOrderLog project={project} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Reports' && <EngForm93Preview project={project} />}
        </div>
    </div>
);
export default ProjectWorkArea;
