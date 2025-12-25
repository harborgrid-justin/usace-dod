
import React, { useState, useEffect } from 'react';
import { 
    Construction, Ruler, FileText, Activity, AlertTriangle, 
    PieChart, RefreshCcw, Search
} from 'lucide-react';
import { MOCK_USACE_PROJECTS } from '../../constants';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import USACEProjectDashboard from '../usace/USACEProjectDashboard';

interface USACEViewProps {
    selectedProjectId: string | null;
    onSelectProject: (id: string) => void;
}

const ProjectCard: React.FC<{ project: USACEProject, onClick: () => void }> = ({ project, onClick }) => {
    const isCivil = project.programType === 'Civil Works';
    const percentObligated = (project.financials.obligated / project.financials.currentWorkingEstimate) * 100;

    return (
        <div 
            onClick={onClick}
            className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-rose-300 hover:shadow-md transition-all group cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${isCivil ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                            {project.programType}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">{project.id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 line-clamp-1 group-hover:text-rose-700 transition-colors">{project.name}</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{project.district} • P2: <span className="font-mono">{project.p2Number}</span></p>
                </div>
                {!project.p2Linkage && <div className="text-rose-500" title="P2 Sync Error"><AlertTriangle size={16}/></div>}
                {project.p2Linkage && <div className="text-emerald-500" title="P2 Synced"><Activity size={16}/></div>}
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        <span>Obligation (CWE)</span>
                        <span className={percentObligated > 90 ? 'text-emerald-600' : 'text-zinc-600'}>{percentObligated.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className={`h-full ${isCivil ? 'bg-blue-600' : 'bg-emerald-600'}`} style={{ width: `${percentObligated}%` }} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-zinc-100">
                    <div>
                        <p className="text-[9px] text-zinc-400 uppercase font-bold">Total Programmed</p>
                        <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(project.financials.programmed)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-zinc-400 uppercase font-bold">Unliquidated Obs</p>
                        <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(project.financials.obligated - project.financials.disbursed)}</p>
                    </div>
                </div>

                {project.costShare && (
                    <div className="bg-zinc-50 p-2 rounded border border-zinc-100 flex justify-between items-center text-[10px]">
                        <span className="font-medium text-zinc-600">Cost Share ({project.costShare.sponsorName})</span>
                        <span className="font-mono font-bold text-zinc-800">{project.costShare.nonFederalShare}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const USACEView: React.FC<USACEViewProps> = ({ selectedProjectId, onSelectProject }) => {
    const [filter, setFilter] = useState<'All' | 'Civil Works' | 'Military Programs'>('All');
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Opportunity 10: Debounced Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 300);
        return () => clearTimeout(handler);
    }, [inputValue]);

    const filteredProjects = MOCK_USACE_PROJECTS.filter(p => {
        const matchesFilter = filter === 'All' || p.programType === filter;
        const matchesSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.p2Number.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const totalCWE = filteredProjects.reduce((sum, p) => sum + p.financials.currentWorkingEstimate, 0);
    const totalObligated = filteredProjects.reduce((sum, p) => sum + p.financials.obligated, 0);

    const handleSelectProject = (project: USACEProject) => {
        onSelectProject(project.id); 
    }
    
    const handleBack = () => {
        onSelectProject('');
    }
    
    const currentProject = MOCK_USACE_PROJECTS.find(p => p.id === selectedProjectId);

    if (currentProject) {
        return <USACEProjectDashboard project={currentProject} onBack={handleBack} />;
    }

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Construction size={24} className="text-rose-700" /> P2 Project Lifecycle
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">CEFMS II • Project Management Business Process (PMBP)</p>
                </div>
                 <div className="relative group w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Search name or P2 number..."
                        className="w-full sm:w-64 pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                    />
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-rose-50 text-rose-700 rounded-lg"><Ruler size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Projects (P2)</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{filteredProjects.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-lg"><PieChart size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Execution Rate</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{totalCWE > 0 ? ((totalObligated/totalCWE)*100).toFixed(1) : 0}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg"><RefreshCcw size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Revolving Fund (96X4902)</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-zinc-900">$850.2M</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 text-amber-700 rounded-lg"><FileText size={16}/></div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Open PR&Cs (ENG 93)</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-zinc-900">142</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex bg-zinc-100 p-1 rounded-lg self-start mb-4 overflow-x-auto">
                    {['All', 'Civil Works', 'Military Programs'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="overflow-y-auto custom-scrollbar pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {filteredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} onClick={() => handleSelectProject(project)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default USACEView;
