
import React from 'react';
import { USACEProject } from '../../../types';
import Breadcrumbs from '../../shared/Breadcrumbs';
import { FundingStreamVisualizer, PRCList } from '../FinancialWidgets';
import WorkItemManager from '../WorkItemManager';
import DeepTracePanel from '../DeepTracePanel';

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
        </div>
    </div>
);
export default ProjectWorkArea;
