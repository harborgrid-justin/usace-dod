
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    PieChart, Plus, Search, Scale, TrendingUp, 
    Users, BookOpen, Database, ArrowRight, 
    Filter, Info, Landmark, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { CostShareRecord, CostShareStatus } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import CostShareForm from './CostShareForm';
import CostShareDetail from './CostShareDetail';
import { REMIS_THEME } from '../../constants';
import { useService } from '../../hooks/useService';

const CostShareManager: React.FC = () => {
    const records = useService<CostShareRecord[]>(remisService, useCallback(() => remisService.getCostShares(), []));
    const [activeTab, setActiveTab] = useState<'Registry' | 'Analytics' | 'Sponsors' | 'Policy'>('Registry');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    const selectedRecord = useMemo(() => 
        records.find(r => r.id === selectedRecordId),
    [records, selectedRecordId]);

    const filtered = useMemo(() => records.filter(r => 
        r.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.projectOrAssetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [records, searchTerm]);

    // Analytics Data Aggregation
    const stats = useMemo(() => {
        const totalVal = records.reduce((s, r) => s + r.totalValue, 0);
        const totalContributed = records.reduce((s, r) => s + r.contributedValue, 0);
        const fedShare = records.reduce((s, r) => s + (r.totalValue * (r.percentage.federal/100)), 0);
        const nonFedShare = records.reduce((s, r) => s + (r.totalValue * (r.percentage.nonFederal/100)), 0);
        return { totalVal, totalContributed, fedShare, nonFedShare };
    }, [records]);

    const splitData = [
        { name: 'Federal Authority', value: stats.fedShare, color: REMIS_THEME.colors.primary },
        { name: 'Non-Federal Commitment', value: stats.nonFedShare, color: REMIS_THEME.colors.secondary }
    ];

    const handleCreate = (newRecord: CostShareRecord) => {
        remisService.addCostShare(newRecord);
        setIsFormOpen(false);
    };

    const handleUpdate = (updated: CostShareRecord) => {
        remisService.updateCostShare(updated);
    };

    const handleAdjustment = (id: string, adj: any) => {
        remisService.addCostShareAdjustment(id, adj);
    };

    if (selectedRecord) {
        return (
            <CostShareDetail 
                record={selectedRecord} 
                onBack={() => setSelectedRecordId(null)}
                onUpdate={handleUpdate}
                onAdjust={handleAdjustment}
            />
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-zinc-50/50 animate-in fade-in">
            {/* Contextual Workspace Tabs */}
            <div className="px-6 bg-white border-b border-zinc-200 flex justify-between items-end shrink-0 z-10">
                <div className="flex gap-8">
                    {(['Registry', 'Analytics', 'Sponsors', 'Policy'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab === 'Registry' && <Database size={14}/>}
                            {tab === 'Analytics' && <TrendingUp size={14}/>}
                            {tab === 'Sponsors' && <Users size={14}/>}
                            {tab === 'Policy' && <BookOpen size={14}/>}
                            {tab === 'Registry' ? 'Agreement Registry' : tab === 'Analytics' ? 'Strategic Analytics' : tab === 'Sponsors' ? 'Sponsor Portfolio' : 'Regulatory'}
                        </button>
                    ))}
                </div>
                <div className="pb-3">
                    <button onClick={() => setIsFormOpen(true)} className={`flex items-center gap-2 px-5 py-2 rounded-sm text-[10px] font-bold uppercase transition-all shadow-md ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Plus size={14}/> Establish Agreement
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {activeTab === 'Registry' && (
                    <div className="space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden animate-in fade-in">
                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/30 flex justify-between items-center">
                                <div className="relative max-w-md w-full">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input 
                                        type="text" placeholder="Search Sponsor, Project, or ID..." value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className={`w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-sm text-xs focus:outline-none transition-all ${REMIS_THEME.classes.inputFocus}`}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="neutral">{records.length} Agreements</Badge>
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4">Agreement Ref</th>
                                        <th className="p-4">Non-Federal Sponsor</th>
                                        <th className="p-4">Linked Project</th>
                                        <th className="p-4 text-right">Non-Fed Target</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filtered.map(r => {
                                        const nonFedTarget = r.totalValue * (r.percentage.nonFederal/100);
                                        return (
                                            <tr key={r.id} onClick={() => setSelectedRecordId(r.id)} className={`${REMIS_THEME.classes.tableRowHover} transition-colors cursor-pointer group`}>
                                                <td className="p-4 font-mono text-xs font-bold text-zinc-800">{r.id}</td>
                                                <td className="p-4">
                                                    <p className="text-sm font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors">{r.sponsorName}</p>
                                                    <p className="text-[10px] text-zinc-500 mt-0.5">{r.contributionType} Contribution</p>
                                                </td>
                                                <td className="p-4 text-xs text-zinc-600 font-mono font-bold uppercase">{r.projectOrAssetId}</td>
                                                <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(nonFedTarget)}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border ${r.status === 'Active' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.info}`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right text-zinc-300 group-hover:text-emerald-600 transition-colors"><ArrowRight size={16}/></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Analytics' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Program Value</p>
                                <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(stats.totalVal)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Non-Fed Contributions</p>
                                <p className="text-2xl font-mono font-bold text-emerald-700">{formatCurrency(stats.totalContributed)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Pending Balance</p>
                                <p className="text-2xl font-mono font-bold text-rose-600">{formatCurrency(stats.nonFedShare - stats.totalContributed)}</p>
                            </div>
                            <div className="bg-zinc-900 p-6 rounded-md shadow-xl">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Sponsor Yield</p>
                                <p className="text-2xl font-mono font-bold text-white">{((stats.totalContributed / stats.nonFedShare) * 100).toFixed(1)}%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-md p-10 shadow-sm h-[450px] flex flex-col">
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                                    <PieChart size={18} className="text-emerald-600"/> District Cost Share Profile (Federal vs Non-Federal)
                                </h3>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie data={splitData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value" stroke="none">
                                                {splitData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold', paddingTop: '20px'}} />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200 rounded-md p-8 space-y-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-600"/> Compliance Highlights
                                </h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white rounded-sm border border-zinc-100 shadow-sm">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Valuation Protocol</p>
                                        <p className="text-sm font-bold text-zinc-800 mt-1">100% Audit Verified</p>
                                        <p className="text-[10px] text-zinc-500 mt-1">LERRD credits reconciled against GFEBS sub-ledger.</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-sm border border-zinc-100 shadow-sm">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Aging In-Kind</p>
                                        <p className="text-sm font-bold text-rose-600 mt-1">2 Work-in-Kind Blocks Pending</p>
                                        <p className="text-[10px] text-zinc-500 mt-1">Acceptance documentation overdue for MVR Project office.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Sponsors' && (
                    <div className="bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm animate-in fade-in">
                        <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                            <div className="p-6 bg-zinc-50 rounded-full border border-zinc-100 text-zinc-300">
                                <Users size={48} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900">Sponsor Exposure Monitor</h3>
                            <p className="text-xs text-zinc-400 max-w-sm">Aggregating multiple cost-share agreements by unique sponsor entity to track total non-federal exposure levels.</p>
                            <button className="mt-4 px-8 py-3 bg-zinc-900 text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-lg">Refresh Aggregate Report</button>
                        </div>
                    </div>
                )}

                {activeTab === 'Policy' && (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-4">
                        <div className="bg-white border border-zinc-200 rounded-md p-12 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-10 opacity-5"><Landmark size={120}/></div>
                             <h3 className="text-xl font-bold text-zinc-900 mb-10 border-b border-zinc-50 pb-6 flex items-center gap-4">
                                <BookOpen size={24} className="text-rose-700"/> Cost Sharing Authority Library
                             </h3>
                             <div className="space-y-10">
                                <div className="flex gap-8 items-start group">
                                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-sm group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-sm"><Info size={22}/></div>
                                    <div>
                                        <h5 className="text-base font-bold text-zinc-900 uppercase">33 U.S.C. § 2213</h5>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">The primary statute governing non-Federal cost-sharing for Civil Works flood control projects. Establishes the 65/35 default split.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-start group">
                                    <div className="p-4 bg-blue-50 text-blue-700 rounded-sm group-hover:bg-blue-700 group-hover:text-white transition-all shadow-sm"><Info size={22}/></div>
                                    <div>
                                        <h5 className="text-base font-bold text-zinc-900 uppercase">ER 405-1-12</h5>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">USACE Real Estate Regulation for LERRD (Lands, Easements, Rights-of-Way, Relocations, and Disposal) credit valuation and auditing.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-start group">
                                    <div className="p-4 bg-purple-50 text-purple-700 rounded-sm group-hover:bg-purple-700 group-hover:text-white transition-all shadow-sm"><Info size={22}/></div>
                                    <div>
                                        <h5 className="text-base font-bold text-zinc-900 uppercase">WRDA Section 103</h5>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">Establishes cost-share requirements for commercial navigation and harbor development projects.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <CostShareForm 
                    onClose={() => setIsFormOpen(false)} 
                    onSubmit={handleCreate} 
                />
            )}
        </div>
    );
};

const Badge: React.FC<{ children: React.ReactNode, variant?: string }> = ({ children, variant }) => (
    <span className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase border shadow-sm tracking-widest ${variant === 'neutral' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
        {children}
    </span>
);

export default CostShareManager;
