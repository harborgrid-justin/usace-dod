
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Hammer, Search, Plus, Gavel, TrendingUp, 
    ShieldCheck, BookOpen, Database, LayoutGrid, 
    Users, ArrowRight, ClipboardCheck, Clock, CheckCircle2
} from 'lucide-react';
import { Solicitation, SolicitationStatus } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';
import { useService } from '../../hooks/useService';
import { formatCurrency } from '../../utils/formatting';
import RemisSolicitationForm from './RemisSolicitationForm';
import RemisSolicitationDetail from './RemisSolicitationDetail';
import Badge from '../shared/Badge';

const RemisSolicitationView: React.FC = () => {
    const solicitations = useService<Solicitation[]>(remisService, useCallback(() => remisService.getSolicitations(), []));
    const [selectedSolId, setSelectedSolId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'Registry' | 'Evaluations' | 'Intelligence' | 'Policy'>('Registry');

    const selectedSol = useMemo(() => solicitations.find(s => s.id === selectedSolId) || null, [solicitations, selectedSolId]);

    const filtered = useMemo(() => solicitations.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [solicitations, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: solicitations.length,
            evaluating: solicitations.filter(s => s.status === 'Evaluating Quotes').length,
            awarded: solicitations.filter(s => s.status === 'Awarded').length,
            sbSetAside: solicitations.filter(s => s.marketResearch?.smallBusinessSetAside).length
        };
    }, [solicitations]);

    const handleCreate = (newSol: Solicitation) => {
        remisService.addSolicitation(newSol);
        setIsFormOpen(false);
    };

    const handleUpdate = (updated: Solicitation) => {
        remisService.updateSolicitation(updated);
    };

    if (selectedSol) {
        return <RemisSolicitationDetail solicitation={selectedSol} onBack={() => setSelectedSolId(null)} onUpdate={handleUpdate} />;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-zinc-50/50 animate-in fade-in">
            {/* Contextual Workspace Tabs */}
            <div className="px-6 bg-white border-b border-zinc-200 flex justify-between items-end shrink-0 z-10">
                <div className="flex gap-8">
                    {(['Registry', 'Evaluations', 'Intelligence', 'Policy'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab === 'Registry' && <Database size={14}/>}
                            {tab === 'Evaluations' && <Gavel size={14}/>}
                            {tab === 'Intelligence' && <TrendingUp size={14}/>}
                            {tab === 'Policy' && <BookOpen size={14}/>}
                            {tab === 'Registry' ? 'Solicitation Registry' : tab === 'Evaluations' ? 'Evaluation Board' : tab === 'Intelligence' ? 'Market Intel' : 'FAR/DFARS'}
                        </button>
                    ))}
                </div>
                <div className="pb-3">
                    <button onClick={() => setIsFormOpen(true)} className={`flex items-center gap-2 px-5 py-2 rounded-sm text-[10px] font-bold uppercase transition-all shadow-md ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> New Solicitation
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {activeTab === 'Registry' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-zinc-50 text-zinc-600 rounded-sm border border-zinc-100"><Hammer size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Population</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.total}</p></div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-sm border border-amber-100"><Gavel size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">In Evaluation</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.evaluating}</p></div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-sm border border-emerald-100"><ShieldCheck size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">SB Set-Aside</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.sbSetAside}</p></div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                {/* Fix: CheckCircle2 icon now correctly imported from lucide-react */}
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-sm border border-blue-100"><CheckCircle2 size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Awarded (FY)</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.awarded}</p></div>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/30">
                                <div className="relative max-w-md">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input 
                                        type="text" placeholder="Filter solicitations..." value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className={`w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-sm text-xs focus:outline-none transition-all ${REMIS_THEME.classes.inputFocus}`}
                                    />
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4">PIID / Reference</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4 text-center">Bids</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filtered.map(sol => (
                                        <tr key={sol.id} onClick={() => setSelectedSolId(sol.id)} className={`${REMIS_THEME.classes.tableRowHover} transition-colors cursor-pointer group`}>
                                            <td className="p-4 font-mono text-xs font-bold text-zinc-800">{sol.id}</td>
                                            <td className="p-4">
                                                <p className="text-sm font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors">{sol.title}</p>
                                                <p className="text-[10px] text-zinc-500 mt-0.5">Asset Ref: {sol.assetId}</p>
                                            </td>
                                            <td className="p-4"><Badge variant="info">{sol.type}</Badge></td>
                                            <td className="p-4 text-center font-mono text-sm font-bold text-zinc-700">{sol.quotes.length}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border ${sol.status === 'Active Solicitation' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.warning}`}>
                                                    {sol.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-zinc-200 group-hover:text-emerald-600 transition-all"><ArrowRight size={16}/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'Evaluations' && (
                    <div className="bg-white border border-zinc-200 rounded-md p-20 shadow-sm flex flex-col items-center justify-center min-h-[500px] text-center gap-6">
                        <div className="p-6 bg-amber-50 text-amber-600 rounded-full border border-amber-100 shadow-inner animate-pulse"><Gavel size={48}/></div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Source Selection Board</h3>
                            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed">
                                You have <span className="font-bold text-amber-600">{stats.evaluating}</span> solicitations currently pending technical and price evaluations.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setActiveTab('Registry')} className="px-8 py-3 bg-zinc-900 text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl transition-all active:scale-95">Open Evaluation Registry</button>
                        </div>
                    </div>
                )}

                {activeTab === 'Intelligence' && (
                    <div className="space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm h-[400px] flex flex-col">
                             <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <TrendingUp size={18} className="text-emerald-600" /> Procurement Acquisition Cycle Time (PACT)
                                </h3>
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-sm text-[10px] font-bold border border-emerald-100">FY24 AVG: 42 Days</div>
                             </div>
                             <div className="flex-1 flex items-center justify-center text-zinc-300 border-2 border-dashed border-zinc-100 rounded-md">
                                <p className="text-xs font-bold uppercase tracking-widest">PACT Analytics Engine Initializing...</p>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Policy' && (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-4">
                        <div className="bg-white border border-zinc-200 rounded-md p-10 shadow-sm relative overflow-hidden">
                             <h3 className="text-xl font-bold text-zinc-900 mb-8 border-b border-zinc-50 pb-4 flex items-center gap-3"><BookOpen size={24} className="text-rose-600"/> Acquisition Regulatory Library</h3>
                             <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="p-3 bg-rose-50 text-rose-700 rounded-sm shrink-0"><ShieldCheck size={20}/></div>
                                    <div>
                                        <h5 className="text-sm font-bold text-zinc-900 uppercase">FAR Part 15 - Contracting by Negotiation</h5>
                                        <p className="text-xs text-zinc-500 leading-relaxed mt-1">Prescribes policies and procedures governing competitive and noncompetitive negotiated acquisitions.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <div className="p-3 bg-blue-50 text-blue-700 rounded-sm shrink-0"><ShieldCheck size={20}/></div>
                                    <div>
                                        <h5 className="text-sm font-bold text-zinc-900 uppercase">DFARS Part 215 - Source Selection</h5>
                                        <p className="text-xs text-zinc-500 leading-relaxed mt-1">Defense-specific supplements for technical evaluation and trade-off analysis.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <RemisSolicitationForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />
            )}
        </div>
    );
};

export default RemisSolicitationView;
