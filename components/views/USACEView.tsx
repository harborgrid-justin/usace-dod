
import React, { useState, useMemo, useDeferredValue } from 'react';
import { 
    Construction, Ruler, Activity, AlertTriangle, 
    Search
} from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import USACEProjectDashboard from '../usace/USACEProjectDashboard';
import { useUSACEProjects } from '../../hooks/useDomainData';

const ProjectCard: React.FC<{ project: USACEProject, onClick: () => void }> = ({ project, onClick }) => {
    const isCivil = project.programType === 'Civil Works';
    const percentObligated = project.financials.currentWorkingEstimate ? (project.financials.obligated / project.financials.currentWorkingEstimate) * 100 : 0;

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
            </div>
        </div>
    );
};

const USACEView: React.FC<{ selectedProjectId: string | null; onSelectProject: (id: string | null) => void }> = ({ selectedProjectId, onSelectProject }) => {
    const projects = useUSACEProjects();
    const [filter, setFilter] = useState<'All' | 'Civil Works' | 'Military Programs'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // React 18/19 Concurrent Pattern: useDeferredValue for filtering large lists
    const deferredSearch = useDeferredValue(searchTerm);

    const filteredProjects = useMemo(() => projects.filter(p => {
        const matchesFilter = filter === 'All' || p.programType === filter;
        const matchesSearch = deferredSearch === '' || p.name.toLowerCase().includes(deferredSearch.toLowerCase()) || p.p2Number.includes(deferredSearch);
        return matchesFilter && matchesSearch;
    }), [filter, deferredSearch, projects]);

    const currentProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);

    if (currentProject) {
        return <USACEProjectDashboard project={currentProject} onBack={() => onSelectProject(null)} />;
    }

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Construction size={24} className="text-rose-700" /> P2 Project Lifecycle
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Authoritative Project Management Workbench</p>
                </div>
                <div className="relative group w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Filter by name or P2 ID..."
                        className="w-full sm:w-64 pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-rose-300 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-rose-50 text-rose-700 rounded-lg"><Ruler size={16}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active P2 Entries</p>
                        <p className="text-xl font-mono font-bold text-zinc-900">{filteredProjects.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg"><Activity size={16}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Linkage</p>
                        <p className="text-xl font-mono font-bold text-emerald-700">100%</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex bg-zinc-100 p-1 rounded-lg self-start mb-4 overflow-x-auto max-w-full">
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

                <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
                        {filteredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project.id)} />
                        ))}
                         {filteredProjects.length === 0 && (
                            <div className="col-span-full py-20 text-center text-zinc-400">
                                <p className="text-sm font-bold uppercase tracking-widest">No Projects Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default USACEView;
