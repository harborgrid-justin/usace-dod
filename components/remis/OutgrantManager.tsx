
import React, { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { 
    Plus, Search, DollarSign, TrendingUp, ShieldCheck, 
    BookOpen, ArrowRight, Database, ClipboardCheck, Landmark, Shuffle,
    FileSignature, Clock
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { Outgrant } from '../../types';
import { remisService } from '../../services/RemisDataService';
import { useService } from '../../hooks/useService';
import { REMIS_THEME } from '../../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
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

    const KPICard = ({ label, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-sm ${color}`}>
                    <Icon size={20} />
                </div>
                <div className="h-2 w-2 rounded-full bg-zinc-200 group-hover:bg-emerald-500 transition-colors" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-mono font-bold text-zinc-900">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full overflow-hidden bg-zinc-50/50 animate-in fade-in">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-end shrink-0 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <FileSignature size={28} className="text-emerald-700" /> Outgrants
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">
                        Real Estate Revenue & Usage (10 U.S.C. 2667)
                    </p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-md shadow-inner">
                    {(['Registry', 'Analytics', 'Compliance', 'Policy'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                                activeTab === tab ? 'bg-white shadow-sm text-emerald-800' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            {tab === 'Registry' && <Database size={12}/>}
                            {tab === 'Analytics' && <TrendingUp size={12}/>}
                            {tab === 'Compliance' && <ClipboardCheck size={12}/>}
                            {tab === 'Policy' && <BookOpen size={12}/>}
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {activeTab === 'Registry' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <KPICard label="Active Instruments" value={outgrants.length.toString()} icon={Shuffle} color="bg-zinc-100 text-zinc-600" />
                            <KPICard label="Annual Revenue" value={formatCurrency(outgrants.reduce((s,o) => s + o.annualRent, 0))} icon={DollarSign} color="bg-emerald-50 text-emerald-700" />
                            <KPICard label="Pending Renewal" value="3" icon={Clock} color="bg-amber-50 text-amber-700" />
                            <KPICard label="Compliance Rate" value="98.2%" icon={ShieldCheck} color="bg-blue-50 text-blue-700" />
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden animate-in fade-in">
                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/30 flex justify-between items-center">
                                <div className="relative max-w-md w-full">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input 
                                        type="text" placeholder="Search Grantee or ID..." value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-sm text-xs focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                                    />
                                </div>
                                <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-md active:scale-95">
                                    <Plus size={12}/> Establish Grant
                                </button>
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
                                        <tr key={grant.id} onClick={() => setSelectedOutgrantId(grant.id)} className="hover:bg-zinc-50 cursor-pointer group transition-colors">
                                            <td className="p-4 font-mono text-xs font-bold text-zinc-800">{grant.id}</td>
                                            <td className="p-4">
                                                <p className="text-sm font-bold text-zinc-900 group-hover:text-emerald-800 transition-colors">{grant.grantee}</p>
                                                <p className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-[200px]">{grant.location}</p>
                                            </td>
                                            <td className="p-4 text-xs text-zinc-600 font-medium">{grant.type}</td>
                                            <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(grant.annualRent)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border ${
                                                    grant.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                    {grant.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-zinc-300 group-hover:text-emerald-600 transition-colors"><ArrowRight size={16}/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'Analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                        <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm flex flex-col h-[400px]">
                            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <DollarSign size={16} className="text-emerald-600"/> Revenue Projection (FY24)
                            </h3>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#71717a'}}/>
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} tickFormatter={(val) => `$${val/1000}k`}/>
                                        <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}/>
                                        <Area type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                        <Area type="monotone" dataKey="actual" stroke="#047857" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-md p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Landmark size={120}/></div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-emerald-400">
                                    <ShieldCheck size={16}/> Compliance Health
                                </h4>
                                <div className="space-y-4 relative z-10">
                                    {[
                                        { label: 'Expired Leases', value: '2', color: 'text-rose-400' },
                                        { label: 'Pending Inspections', value: '5', color: 'text-amber-400' },
                                        { label: 'Insurance Verification', value: '100%', color: 'text-emerald-400' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-sm border border-white/10">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</span>
                                            <span className={`font-mono font-bold ${item.color}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 bg-white text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95 shadow-lg">
                                Run Compliance Report
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Compliance' && (
                    <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-50">
                            <div className="p-3 bg-zinc-100 rounded-sm text-zinc-500"><ClipboardCheck size={20}/></div>
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">GSA Screening Protocol</h3>
                                <p className="text-[10px] text-zinc-500 font-medium mt-1">McKinney-Vento Act & Executive Order 12512</p>
                            </div>
                        </div>
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-sm flex items-start gap-4">
                            <Clock size={18} className="text-amber-600 mt-0.5 shrink-0"/>
                            <div>
                                <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">Action Required</p>
                                <p className="text-xs text-amber-800 mt-1 leading-relaxed font-medium">3 outgrants are approaching their 5-year compliance review window. Initiate Title 10 conformity checks immediately.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <OutgrantForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />
            )}
        </div>
    );
};

export default OutgrantManager;
