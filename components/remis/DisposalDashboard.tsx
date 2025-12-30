
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Shuffle, Plus, DollarSign, Activity, Clock, Building2, Search, 
    Filter, LayoutGrid, BarChart3, ChevronRight, ShieldCheck, Database, BookOpen, Truck, TrendingUp, ArrowRight, Landmark, FileText, CheckCircle2, AlertTriangle, RefreshCcw
} from 'lucide-react';
import { DisposalAction, DisposalDashboardProps } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';
import { useService } from '../../hooks/useService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, Cell } from 'recharts';
import DisposalActionForm from './DisposalActionForm';
import { DisposalActionDetail } from './DisposalActionDetail';

const DisposalDashboard: React.FC<DisposalDashboardProps> = ({ onNavigateToAsset, onNavigateToSolicitation }) => {
    const disposals = useService<DisposalAction[]>(remisService, useCallback(() => remisService.getDisposals(), []));
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'Registry' | 'Analytics' | 'Pipeline' | 'Policy'>('Registry');
    const [searchTerm, setSearchTerm] = useState('');

    const selectedAction = useMemo(() => 
        disposals.find(d => d.id === selectedActionId),
    [disposals, selectedActionId]);

    const filtered = useMemo(() => disposals.filter(d => 
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.assetId.toLowerCase().includes(searchTerm.toLowerCase())
    ), [disposals, searchTerm]);

    const stats = useMemo(() => {
        const screeningComplete = disposals.filter(d => d.screeningStatus === 'Final').length;
        const totalProceeds = disposals.reduce((sum, d) => sum + d.estimatedProceeds, 0);
        return { count: disposals.length, screeningComplete, totalProceeds };
    }, [disposals]);

    if (selectedAction) {
        return <DisposalActionDetail 
            action={selectedAction} 
            onBack={() => setSelectedActionId(null)}
            onNavigateToAsset={onNavigateToAsset}
            onNavigateToSolicitation={onNavigateToSolicitation}
        />;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-zinc-50/50 animate-in fade-in">
             {/* Contextual Workspace Tabs */}
             <div className="px-6 bg-white border-b border-zinc-200 flex justify-between items-end shrink-0 z-10">
                <div className="flex gap-8">
                    {(['Registry', 'Analytics', 'Pipeline', 'Policy'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab === 'Registry' && <Database size={14}/>}
                            {tab === 'Analytics' && <TrendingUp size={14}/>}
                            {tab === 'Pipeline' && <Truck size={14}/>}
                            {tab === 'Policy' && <BookOpen size={14}/>}
                            {tab === 'Registry' ? 'ROE Registry' : tab === 'Analytics' ? 'Recovery Intel' : tab === 'Pipeline' ? 'GSA Screening' : 'Regulations'}
                        </button>
                    ))}
                </div>
                <div className="pb-3">
                    <button onClick={() => setIsFormOpen(true)} className={`flex items-center gap-2 px-5 py-2 rounded-sm text-[10px] font-bold uppercase transition-all shadow-md ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> Declare Excess (ROE)
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {activeTab === 'Registry' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-zinc-50 text-zinc-600 rounded-sm border border-zinc-100"><Shuffle size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Active Actions</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.count}</p></div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-sm border border-emerald-100"><ShieldCheck size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Screening Done</p><p className="text-xl font-mono font-bold text-zinc-900">{stats.screeningComplete}</p></div>
                            </div>
                            <div className="bg-white p-5 rounded-md border border-zinc-200 shadow-sm flex items-center gap-4 lg:col-span-2">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-sm border border-blue-100"><DollarSign size={20}/></div>
                                <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Projected Recovery (PRV)</p><p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(stats.totalProceeds)}</p></div>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/30 flex justify-between items-center">
                                <div className="relative max-w-md w-full">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input 
                                        type="text" placeholder="Filter by RPUID or Action..." value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className={`w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-sm text-xs focus:outline-none transition-all ${REMIS_THEME.classes.inputFocus}`}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded-sm text-[9px] font-bold uppercase border border-zinc-200">GSA Integrated</span>
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4">Action ID</th>
                                        <th className="p-4">Target Asset</th>
                                        <th className="p-4">Disposal Type</th>
                                        <th className="p-4 text-right">Est. Proceeds</th>
                                        <th className="p-4 text-center">Screening</th>
                                        <th className="p-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filtered.map(d => (
                                        <tr key={d.id} onClick={() => setSelectedActionId(d.id)} className={`${REMIS_THEME.classes.tableRowHover} transition-colors cursor-pointer group`}>
                                            <td className="p-4 font-mono text-xs font-bold text-zinc-800">{d.id}</td>
                                            <td className="p-4">
                                                <p className="text-sm font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors">RPUID: {d.assetId}</p>
                                                <p className="text-[10px] text-zinc-500 mt-0.5">Reported: {d.reportedExcessDate}</p>
                                            </td>
                                            <td className="p-4 text-xs text-zinc-600 uppercase font-medium">{d.type}</td>
                                            <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(d.estimatedProceeds)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border ${d.screeningStatus === 'Final' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.warning}`}>
                                                    {d.screeningStatus}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-zinc-300 group-hover:text-emerald-600 transition-all"><ArrowRight size={16}/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'Analytics' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Average Recovery Time</p>
                                <p className="text-2xl font-mono font-bold text-zinc-900">242 Days</p>
                            </div>
                            <div className="bg-zinc-900 p-6 rounded-md shadow-xl">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Portfolio Recovery Factor</p>
                                <p className="text-2xl font-mono font-bold text-white">88.4%</p>
                            </div>
                         </div>
                         
                         <div className="bg-white border border-zinc-200 rounded-md p-10 shadow-sm flex flex-col h-[500px]">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                        <BarChart3 size={18} className="text-rose-600"/> Recovery Value Matrix
                                    </h3>
                                    <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-widest">Projected proceeds by disposal method</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={disposals} margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                        <XAxis dataKey="id" hide />
                                        <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1e6}M`}/>
                                        <Tooltip 
                                            formatter={(v: any) => formatCurrency(v)}
                                            contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="estimatedProceeds" radius={[2, 2, 0, 0]} barSize={40}>
                                            {disposals.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#18181b', '#059669', '#2563eb'][index % 3]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Pipeline' && (
                    <div className="bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm animate-in fade-in h-full flex flex-col">
                        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <Truck size={18} className="text-zinc-600"/> GSA Screening Pipeline (GSA X-Press)
                            </h3>
                            <button className="px-5 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-md active:scale-95">
                                <RefreshCcw size={14}/> Refresh GSA Feed
                            </button>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                                    <tr>
                                        <th className="pb-4">Stage</th>
                                        <th className="pb-4">Asset Identification</th>
                                        <th className="pb-4">Regulatory Gate</th>
                                        <th className="pb-4 text-center">Time in Stage</th>
                                        <th className="pb-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {disposals.filter(d => d.screeningStatus !== 'Final').map(d => (
                                        <tr key={d.id} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-sm text-[9px] font-bold uppercase border ${d.screeningStatus.includes('Homeless') ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                    {d.screeningStatus}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-sm font-bold text-zinc-800">{d.assetId}</p>
                                                <p className="text-[10px] text-zinc-400 font-mono">Control #: {d.id}</p>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-xs font-medium text-zinc-700">{d.screeningStatus === 'Homeless Screening' ? 'HUD Suitability Test' : 'Federal Interest Poll'}</p>
                                            </td>
                                            <td className="py-4 text-center">
                                                <p className="text-xs font-mono font-bold text-zinc-900">14 Days</p>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => setSelectedActionId(d.id)} className="text-zinc-400 hover:text-emerald-600 transition-colors"><ChevronRight size={18}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Policy' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4">
                        <div className="bg-white border border-zinc-200 rounded-md p-10 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5"><Landmark size={120}/></div>
                             <h3 className="text-xl font-bold text-zinc-900 mb-8 border-b border-zinc-50 pb-4">Statutory Disposal Framework</h3>
                             <div className="space-y-10">
                                <div className="flex gap-8 items-start group">
                                    <div className="p-4 bg-zinc-900 text-white rounded-md group-hover:bg-rose-700 transition-all shadow-lg"><ShieldCheck size={24}/></div>
                                    <div>
                                        <h5 className="text-base font-bold text-zinc-900 uppercase">FMR Vol 12, Chapter 6</h5>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">Prescribes uniform policy and procedures for the accounting and reporting of real property disposal actions across the Department.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-start group">
                                    <div className="p-4 bg-zinc-900 text-white rounded-md group-hover:bg-blue-700 transition-all shadow-lg"><FileText size={24}/></div>
                                    <div>
                                        <h5 className="text-base font-bold text-zinc-900 uppercase">McKinney-Vento Act</h5>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">Mandatory screening requirement for all excess property to determine suitability for homeless assistance use.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-start group">
                                    <div className="p-4 bg-zinc-900 text-white rounded-md group-hover:bg-emerald-700 transition-all shadow-lg"><BookOpen size={24}/></div>
                                    <div>
                                        <h5 className="text-base font-bold text-zinc-900 uppercase">41 CFR 102-75</h5>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">Federal Management Regulation governing the utilization and disposal of real property by executive agencies.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-start group">
                                    <div className="p-4 bg-zinc-900 text-white rounded-md group-hover:bg-indigo-700 transition-all shadow-lg"><AlertTriangle size={24}/></div>
                                    <div>
                                        <h5 className="text-base font-bold text-zinc-900 uppercase">Executive Order 12512</h5>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">Requirement for agencies to identify and report underutilized real property to the GSA on an annual basis.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
            {isFormOpen && <DisposalActionForm onClose={() => setIsFormOpen(false)} onSubmit={(aid, t, p) => { remisService.initiateDisposalAction(aid, t, p, 'User'); setIsFormOpen(false); }} />}
        </div>
    );
};

export default DisposalDashboard;
