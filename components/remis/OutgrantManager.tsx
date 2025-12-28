import React, { useState, useEffect, useMemo, useDeferredValue, useCallback } from 'react';
import { 
    FileSignature, Plus, Search, Calendar, DollarSign, 
    TrendingUp, ShieldCheck, BarChart3, ClipboardCheck, 
    BookOpen, ArrowRight, Filter, Database, Clock,
    // Fix: Added missing Landmark and FileText imports from lucide-react
    Landmark, FileText
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { Outgrant, OutgrantStatus } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { useService } from '../../hooks/useService';
import { REMIS_THEME } from '../../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import OutgrantForm from './OutgrantForm';
import OutgrantDetail from './OutgrantDetail';

const OutgrantManager: React.FC = () => {
    const outgrants = useService<Outgrant[]>(remisService, useCallback(() => remisService.getOutgrants(), []));
    const [activeTab, setActiveTab] = useState<'Registry' | 'Analytics' | 'Compliance' | 'Policy'>('Registry');
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [selectedOutgrantId, setSelectedOutgrantId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const selectedOutgrant = useMemo(() => 
        outgrants.find(o => o.id === selectedOutgrantId),
    [outgrants, selectedOutgrantId]);

    const filtered = useMemo(() => outgrants.filter(o => 
        o.grantee.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        o.id.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [outgrants, deferredSearch]);

    // Analytics Data Transformation
    const revenueData = useMemo(() => {
        const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        return months.map((m, i) => ({
            month: m,
            projected: outgrants.reduce((sum, o) => sum + (o.annualRent / 12), 0) * (i + 1),
            actual: outgrants.reduce((sum, o) => sum + (o.annualRent / 12), 0) * (i + 1) * 0.98 // Simulated collections
        }));
    }, [outgrants]);

    const handleCreate = (newGrant: Outgrant) => {
        remisService.addOutgrant(newGrant);
        setIsFormOpen(false);
    };

    const handleUpdate = (updated: Outgrant) => {
        remisService.updateOutgrant(updated);
    };

    if (selectedOutgrant) {
        return (
            <OutgrantDetail 
                outgrant={selectedOutgrant} 
                onBack={() => setSelectedOutgrantId(null)} 
                onUpdate={handleUpdate} 
            />
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-zinc-50/50 animate-in fade-in">
            {/* Contextual Workspace Tabs */}
            <div className="px-6 bg-white border-b border-zinc-200 flex justify-between items-end shrink-0 z-10">
                <div className="flex gap-8">
                    {(['Registry', 'Analytics', 'Compliance', 'Policy'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab === 'Registry' && <Database size={14}/>}
                            {tab === 'Analytics' && <TrendingUp size={14}/>}
                            {tab === 'Compliance' && <ClipboardCheck size={14}/>}
                            {tab === 'Policy' && <BookOpen size={14}/>}
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="pb-3">
                    <button onClick={() => setIsFormOpen(true)} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-md ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> Establish Outgrant
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeTab === 'Registry' && (
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col overflow-hidden animate-in fade-in">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/30">
                            <div className="relative max-w-md">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                <input 
                                    type="text" placeholder="Search by Grantee or ID..." value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className={`w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none transition-all ${REMIS_THEME.classes.inputFocus}`}
                                />
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                <tr>
                                    <th className="p-4">Authority Ref</th>
                                    <th className="p-4">Grantee Identity</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-right">Annual Rent</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filtered.map(grant => (
                                    <tr key={grant.id} onClick={() => setSelectedOutgrantId(grant.id)} className={`${REMIS_THEME.classes.tableRowHover} transition-colors cursor-pointer group`}>
                                        <td className="p-4 font-mono text-xs font-bold text-zinc-800">{grant.id}</td>
                                        <td className="p-4">
                                            <p className="text-sm font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors">{grant.grantee}</p>
                                            <p className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-[200px]">{grant.location}</p>
                                        </td>
                                        <td className="p-4 text-xs text-zinc-600">{grant.type}</td>
                                        <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(grant.annualRent)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${grant.status === 'Active' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.warning}`}>
                                                {grant.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-zinc-300 group-hover:text-emerald-600 transition-colors"><ArrowRight size={16}/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Analytics' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Portfolio Value</p>
                                <p className="text-3xl font-mono font-bold text-zinc-900">{formatCurrency(outgrants.reduce((sum, o) => sum + o.annualRent, 0))}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Yield Stability</p>
                                <p className="text-3xl font-mono font-bold text-emerald-600">98.2%</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Collections Status</p>
                                <p className="text-3xl font-mono font-bold text-zinc-900">Normal</p>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm h-[500px] flex flex-col">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <TrendingUp size={18} className="text-emerald-600"/> Revenue Accrual Projection (FY24)
                            </h3>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={REMIS_THEME.colors.secondary} stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor={REMIS_THEME.colors.secondary} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `$${val/1000}k`} />
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} formatter={(v: number) => formatCurrency(v)} />
                                        <Area type="monotone" dataKey="projected" stroke={REMIS_THEME.colors.primary} strokeWidth={3} fill="url(#revenueColor)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Compliance' && (
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in h-full flex flex-col">
                        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Compliance Inspection Queue</h3>
                                <p className="text-xs text-zinc-500 font-medium">Monitoring use conditions and encroachment for active outgrants.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase">Past Due</p>
                                    <p className="text-sm font-bold text-rose-600">3</p>
                                </div>
                                <div className="text-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase">Next 30d</p>
                                    <p className="text-sm font-bold text-blue-600">12</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                            <div className="p-6 bg-zinc-100 rounded-full border-2 border-dashed border-zinc-200 text-zinc-300">
                                <ClipboardCheck size={48} />
                            </div>
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">No Critical Violations</h4>
                            <p className="text-xs text-zinc-400 max-w-sm">All outgrants are currently within 10% of their scheduled compliance review interval.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'Policy' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4">
                        <div className="bg-white border border-zinc-200 rounded-3xl p-10 shadow-sm relative overflow-hidden">
                             {/* Fix: Usage of Landmark icon which was missing import */}
                             <div className="absolute top-0 right-0 p-8 opacity-5"><Landmark size={120}/></div>
                             <h3 className="text-xl font-bold text-zinc-900 mb-8 border-b border-zinc-50 pb-4">Real Estate Regulatory Library</h3>
                             <div className="space-y-8">
                                <div className="flex gap-6 items-start group cursor-help">
                                    {/* Fix: Usage of FileText icon which was missing import */}
                                    <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl group-hover:bg-rose-700 group-hover:text-white transition-all"><FileText size={20}/></div>
                                    <div>
                                        <h5 className="text-sm font-bold text-zinc-900 uppercase">10 U.S.C. § 2667</h5>
                                        <p className="text-xs text-zinc-500 leading-relaxed mt-1">Primary authority for leasing of non-excess military property to non-federal entities.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start group cursor-help">
                                    <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl group-hover:bg-blue-700 group-hover:text-white transition-all"><FileText size={20}/></div>
                                    <div>
                                        <h5 className="text-sm font-bold text-zinc-900 uppercase">AR 405-80</h5>
                                        <p className="text-xs text-zinc-500 leading-relaxed mt-1">Army management procedures for granting use of real property.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start group cursor-help">
                                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl group-hover:bg-emerald-700 group-hover:text-white transition-all"><FileText size={20}/></div>
                                    <div>
                                        <h5 className="text-sm font-bold text-zinc-900 uppercase">ER 405-1-12</h5>
                                        <p className="text-xs text-zinc-500 leading-relaxed mt-1">USACE specific regulations for Civil Works Real Estate management.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && <OutgrantForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />}
        </div>
    );
};

export default OutgrantManager;