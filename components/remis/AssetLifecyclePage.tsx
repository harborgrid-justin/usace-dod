import React, { useState, useMemo, useCallback } from 'react';
import { 
    ArrowLeft, Building2, MapPin, Activity, DollarSign, 
    Construction, AlertTriangle, Trash2, Save, FileText, 
    /* Fix: Added missing ShieldCheck to the import list from lucide-react */
    CheckCircle2, TrendingDown, ShieldAlert, BarChart3, Maximize, History, Shield, Landmark, TrendingUp, Clock, Eye, Database, ShieldCheck
} from 'lucide-react';
import { 
    RealPropertyAsset, RealPropertyStatus 
} from '../../types';
import { formatCurrency, formatRelativeTime } from '../../utils/formatting';
import { remisService } from '../../services/RemisDataService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import VersionHistoryViewer from './VersionHistoryViewer';
import { useToast } from '../shared/ToastContext';
import { REMIS_THEME } from '../../constants';
import RemisAuditTrail from './RemisAuditTrail';

interface Props {
    asset: RealPropertyAsset;
    onBack: () => void;
    onUpdate: (asset: RealPropertyAsset) => void;
}

const AssetLifecyclePage: React.FC<Props> = ({ asset, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'General' | 'Financials' | 'Utilization' | 'Compliance' | 'History'>('General');
    const [formData, setFormData] = useState<RealPropertyAsset>(asset);
    const { addToast } = useToast();

    const fci = useMemo(() => 
        formData.currentValue > 0 ? (1 - (formData.deferredMaintenance / formData.currentValue)) * 100 : 100
    , [formData]);
    
    const dmTrend = useMemo(() => [
        { year: '2020', dm: formData.deferredMaintenance * 0.75 },
        { year: '2021', dm: formData.deferredMaintenance * 0.82 },
        { year: '2022', dm: formData.deferredMaintenance * 0.88 },
        { year: '2023', dm: formData.deferredMaintenance * 0.94 },
        { year: '2024', dm: formData.deferredMaintenance },
    ], [formData.deferredMaintenance]);

    const handleSave = () => {
        onUpdate(formData);
        addToast('Authoritative Record synchronized.', 'success');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 overflow-hidden animate-in fade-in transition-opacity">
            {/* Sticky Sub-Header */}
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 shrink-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-all">
                        <ArrowLeft size={16}/> Back to Inventory
                    </button>
                    <div className="flex items-center gap-3">
                         <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg flex items-center gap-2 ${REMIS_THEME.classes.buttonPrimary}`}>
                            <Save size={16} className="text-emerald-400"/> Save Protocol
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-zinc-900 text-white rounded-3xl shadow-2xl shrink-0"><Building2 size={32}/></div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">{formData.rpaName}</h2>
                            <p className="text-sm text-zinc-500 font-medium mt-2">RPUID: <span className="font-mono font-bold text-zinc-900">{formData.rpuid}</span> • {formData.installation}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm min-w-[200px] text-center">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Asset Health (FCI)</p>
                            <p className={`text-2xl font-mono font-bold ${fci > 90 ? 'text-emerald-600' : fci > 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                                {fci.toFixed(1)}%
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-5 shadow-xl min-w-[200px] text-center text-white">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Inventory Status</p>
                            <p className="text-lg font-bold text-emerald-400 uppercase tracking-tighter">{formData.status}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-8 border-t border-zinc-100 pt-2 -mb-8 overflow-x-auto custom-scrollbar px-2">
                    {(['General', 'Financials', 'Utilization', 'Compliance', 'History'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap px-1 ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8 pb-20">
                    {activeTab === 'General' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
                            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm space-y-10">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-3 border-b pb-4 border-zinc-50">
                                    <FileText size={18} className="text-zinc-400"/> Authoritative Attribute Registry
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Asset Designation</label>
                                            <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold text-zinc-900 outline-none focus:bg-white focus:border-emerald-600 transition-all shadow-inner" value={formData.rpaName} onChange={e => setFormData({...formData, rpaName: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Real Estate Interest</label>
                                            <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold bg-white outline-none focus:border-emerald-600 transition-all shadow-inner" value={formData.interestType} onChange={e => setFormData({...formData, interestType: e.target.value as any})}>
                                                <option>Fee</option><option>Easement</option><option>Lease In</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Category Code (CATCODE)</label>
                                            <input className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-mono font-bold outline-none focus:border-emerald-600 transition-all shadow-inner" value={formData.catcode} onChange={e => setFormData({...formData, catcode: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Built Area (SF)</label>
                                                <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-mono outline-none focus:border-emerald-600 transition-all shadow-inner" value={formData.sqFt} onChange={e => setFormData({...formData, sqFt: Number(e.target.value)})} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 ml-1">Site Size (AC)</label>
                                                <input type="number" step="0.1" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-mono outline-none focus:border-emerald-600 transition-all shadow-inner" value={formData.acres} onChange={e => setFormData({...formData, acres: Number(e.target.value)})} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden h-fit border border-zinc-800 group">
                                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Shield size={120}/></div>
                                     <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                                        <Landmark size={18}/> Accountability Hub
                                     </h4>
                                     <div className="space-y-6 relative z-10">
                                        <div className="p-5 bg-white/5 border border-white/10 rounded-3xl shadow-inner">
                                            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Accountable EROC</p>
                                            <p className="text-base font-bold text-white uppercase">{formData.accountableDistrict || 'LRL - Louisville'}</p>
                                        </div>
                                        <div className="p-5 bg-white/5 border border-white/10 rounded-3xl shadow-inner">
                                            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Operating Command</p>
                                            <p className="text-base font-bold text-white uppercase">{formData.custody || 'USACE CIVIL WORKS'}</p>
                                        </div>
                                        <div className="pt-4">
                                            <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-zinc-100 transition-all active:scale-95">
                                                Transfer Control
                                            </button>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Financials' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-2">
                            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm flex flex-col h-[450px]">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                            <TrendingDown size={20} className="text-rose-600"/> Sustenance Liability Trend
                                        </h4>
                                        <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-widest">Deferred Maintenance (DM) Backlog 2020-2024</p>
                                    </div>
                                    <div className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 shadow-lg">
                                        <Clock size={14} className="text-emerald-400"/> Last Scanned: {formatRelativeTime(new Date().toISOString())}
                                    </div>
                                </div>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dmTrend}>
                                            <defs>
                                                <linearGradient id="dmColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.15}/>
                                                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a', fontWeight: 'bold'}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} tickFormatter={(v) => `$${v/1000}k`} />
                                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} formatter={(v: any) => formatCurrency(v)} />
                                            <Area type="monotone" dataKey="dm" stroke="#e11d48" strokeWidth={4} fill="url(#dmColor)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-6 flex flex-col">
                                <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm flex flex-col justify-between flex-1">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Aggregate DM Backlog</p>
                                        <p className="text-4xl font-mono font-bold text-rose-700 tracking-tighter">{formatCurrency(formData.deferredMaintenance)}</p>
                                    </div>
                                    <div className="space-y-3 mt-8">
                                        <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3">
                                            <Activity size={16}/> Build Sustainment WO
                                        </button>
                                        <button className="w-full py-4 border-2 border-zinc-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all">Adjust Costs (G-8)</button>
                                    </div>
                                </div>
                                <div className="p-8 bg-emerald-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center border border-emerald-800">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><TrendingUp size={120} /></div>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 relative z-10">Plant Replacement Value (PRV)</p>
                                    <p className="text-4xl font-mono font-bold text-white tracking-tighter relative z-10">{formatCurrency(formData.currentValue)}</p>
                                    <p className="text-[9px] text-emerald-200 mt-6 leading-relaxed font-bold uppercase tracking-widest relative z-10 flex items-center gap-2">
                                        {/* Fix: Added usage of ShieldCheck which was added to imports */}
                                        <ShieldCheck size={12}/> DoD 2024 RS Means Calibrated
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Utilization' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                            <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="p-6 bg-blue-50 text-blue-600 rounded-full mb-8 shadow-inner border border-blue-100"><Maximize size={48}/></div>
                                <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Active Occupancy Profile</h3>
                                <p className="text-4xl font-mono font-bold text-blue-600 mt-4 tracking-tighter">{formData.utilizationRate}%</p>
                                <p className="text-xs text-zinc-400 mt-2 font-medium uppercase tracking-widest">Effective Use of Authorized Footprint</p>
                                <div className="w-full h-1.5 bg-zinc-100 rounded-full mt-10 overflow-hidden shadow-inner border border-zinc-100">
                                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{width: `${formData.utilizationRate}%`}} />
                                </div>
                            </div>
                            <div className="bg-zinc-900 rounded-[40px] p-10 text-white shadow-2xl flex flex-col justify-between">
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3 text-emerald-400">
                                        <TrendingUp size={18}/> Mission Support Index (MSI)
                                    </h4>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-zinc-400">Dependency Tier</span>
                                            <span className="font-bold text-emerald-400 uppercase tracking-widest">{formData.missionDependency}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-zinc-400">Capability Code</span>
                                            <span className="font-mono text-zinc-300">Level 1 - Sustenance</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-10 py-4 bg-white text-zinc-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-zinc-100 transition-all">
                                    Update MSI Rationale
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'History' && (
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm animate-in fade-in">
                            <div className="flex justify-between items-center mb-10 border-b border-zinc-50 pb-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <History size={20} className="text-zinc-400"/> Authoritative Change Ledger (Vol 4)
                                </h4>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400">
                                    <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500"/> PROTOCOL OK</span>
                                </div>
                            </div>
                            <RemisAuditTrail log={formData.auditLog} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssetLifecyclePage;