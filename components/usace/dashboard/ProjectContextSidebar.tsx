
import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProjectTabList } from '../ProjectTabs';
import { formatCurrency } from '../../../utils/formatting';

const ProjectContextSidebar: React.FC<any> = ({ project, activeTab, onTabChange, onBack }) => {
    const percentObligated = useMemo(() => project.financials.currentWorkingEstimate ? (project.financials.obligated / project.financials.currentWorkingEstimate) * 100 : 0, [project]);

    return (
        <div className="w-16 md:w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0">
            <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
                <button onClick={onBack} className="p-1 hover:bg-zinc-100 rounded text-zinc-500"><ArrowLeft size={16}/></button>
                <h2 className="hidden md:block text-xs font-bold text-zinc-900 uppercase tracking-widest truncate">{project.p2Number}</h2>
            </div>
            <ProjectTabList activeTab={activeTab} onTabChange={onTabChange} />
            <div className="p-4 border-t border-zinc-100 hidden md:block">
                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">CWE</p>
                    <p className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(project.financials.currentWorkingEstimate)}</p>
                    <div className="mt-2 text-[9px] flex justify-between"><span className="text-zinc-500">Obs</span><span className="font-bold">{percentObligated.toFixed(1)}%</span></div>
                    <div className="h-1 w-full bg-zinc-200 rounded-full mt-1 overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${percentObligated}%` }} /></div>
                </div>
            </div>
        </div>
    );
};
export default ProjectContextSidebar;
