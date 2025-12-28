import React, { useState, useMemo } from 'react';
import { 
    ArrowLeft, Building2, MapPin, Activity, DollarSign, 
    Construction, AlertTriangle, Trash2, Save, FileText, 
    CheckCircle2, TrendingDown, ShieldAlert, BarChart3, Maximize, History, Shield, Landmark, TrendingUp, Clock
} from 'lucide-react';
import { 
    RealPropertyAsset, DisposalAction, RealPropertyStatus 
} from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { remisService } from '../../services/RemisDataService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import VersionHistoryViewer from './VersionHistoryViewer';
import { useToast } from '../shared/ToastContext';

interface Props {
    asset: RealPropertyAsset;
    onBack: () => void;
    onUpdate: (asset: RealPropertyAsset) => void;
}

const AssetLifecyclePage: React.FC<Props> = ({ asset, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'General' | 'Accountability' | 'Financials' | 'Utilization' | 'History'>('General');
    const [formData, setFormData] = useState<RealPropertyAsset>(asset);
    const { addToast } = useToast();

    const fci = formData.currentValue > 0 ? (1 - (formData.deferredMaintenance / formData.currentValue)) * 100 : 100;
    
    // Mock DM Trend Data
    const dmTrend = [
        { year: '2020', dm: formData.deferredMaintenance * 0.7 },
        { year: '2021', dm: formData.deferredMaintenance * 0.8 },
        { year: '2022', dm: formData.deferredMaintenance * 0.85 },
        { year: '2023', dm: formData.deferredMaintenance * 0.92 },
        { year: '2024', dm: formData.deferredMaintenance },
    ];

    const handleSave = () => {
        try {
            onUpdate(formData);
            addToast('Authoritative record updated.', 'success');
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 overflow-hidden animate-in fade-in transition-opacity">
            {/* Sticky Sub-Header */}
            <div className="bg-white border-b border-zinc-200 px-8 py-6 flex flex-col gap-6 shrink-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-colors">
                        <ArrowLeft size={16}/> Back to Inventory
                    </button>
                    <div className="flex items-center gap-3">
                         <button onClick={handleSave} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2">
                            <Save size={16} className="text-emerald-400"/> Save Changes
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-zinc-900 text-white rounded-2xl shadow-xl shrink-0"><Building2 size={32}/></div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{formData.rpaName}</h2>
                            <p className="text-sm text-zinc-500 font-medium">RPUID: <span className="font-mono font-bold text-zinc-900">{formData.rpuid}</span> • {formData.installation}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm min-w-[180px] text-center">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Condition (FCI)</p>
                            <p className={`text-2xl font-mono font-bold ${fci > 90 ? 'text-emerald-600' : fci > 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                                {fci.toFixed(1)}%
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl min-w-[180px] text-center text-white">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-lg font-bold text-emerald-400 uppercase tracking-tighter">{formData.status}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-10 border-t border-zinc-100 pt-2 -mb-8 overflow-x-auto custom-scrollbar">
                    {['General', 'Accountability', 'Financials', 'Utilization', 'History'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as any)} 
                            className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap px-1 ${
                                activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto space-y-8 pb-20">
                    {activeTab === 'General' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
                            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-3 border-b pb-4 border-zinc-50">
                                    <FileText size={18} className="text-zinc-400"/> Core Attribute Registry
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Facility Name</label>
                                            <input className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-sm font-bold text-zinc-900 outline-none focus:bg-white transition-all" value={formData.rpaName} onChange={e => setFormData({...formData, rpaName: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Interest Type</label>
                                            <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-sm font-bold bg-white" value={formData.interestType} onChange={e => setFormData({...formData, interestType: e.target.value as any})}>
                                                <option>Fee</option><option>Easement</option><option>Lease In</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Category Code (CATCODE)</label>
                                            <input className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-sm font-mono font-bold" value={formData.catcode} onChange={e => setFormData({...formData, catcode: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Area (SF)</label>
                                                <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-sm font-mono" value={formData.sqFt} onChange={e => setFormData({...formData, sqFt: Number(e.target.value)})} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Site (AC)</label>
                                                <input type="number" step="0.1" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-sm font-mono" value={formData.acres} onChange={e => setFormData({...formData, acres: Number(e.target.value)})} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden h-fit border border-zinc-800 group">
                                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Shield size={120}/></div>
                                     <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <Landmark size={14}/> Accountability Unit
                                     </h4>
                                     <div className="space-y-4">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                            <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Gaining EROC</p>
                                            <p className="text-sm font-bold text-white uppercase">{formData.accountableDistrict || 'USACE-NAN'}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                            <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Command Custody</p>
                                            <p className="text-sm font-bold text-white uppercase">{formData.custody || 'Army Reserve'}</p>
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
                                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                        <TrendingDown size={18} className="text-rose-600"/> Deferred Maintenance Aging
                                    </h4>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded border">
                                        <Clock size={12}/> Q3 FY24 SCAN
                                    </div>
                                </div>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dmTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} tickFormatter={(v) => `$${v/1000}k`} />
                                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                            <Line type="monotone" dataKey="dm" stroke="#e11d48" strokeWidth={4} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 8}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm text-center">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Total Backlog (DM)</p>
                                    <p className="text-3xl font-mono font-bold text-rose-700">{formatCurrency(formData.deferredMaintenance)}</p>
                                    <div className="mt-6 flex flex-col gap-2">
                                        <button className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                                            <Activity size={14}/> Execute Sustainment WO
                                        </button>
                                        <button className="w-full py-3 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all">Manual Adj (G-8)</button>
                                    </div>
                                </div>
                                <div className="p-8 bg-emerald-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden border border-emerald-800 flex-1 flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={100} /></div>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 relative z-10">Asset Replacement Value</p>
                                    <p className="text-4xl font-mono font-bold text-white tracking-tighter relative z-10">{formatCurrency(formData.currentValue)}</p>
                                    <p className="text-xs text-emerald-200 mt-4 leading-relaxed font-medium relative z-10">PRV updated automatically using DoD 2024 RS Means factors.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'History' && (
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm animate-in fade-in">
                            <div className="flex justify-between items-center mb-10">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <History size={18} className="text-zinc-400"/> Authoritative Version History (FMR Vol 4)
                                </h4>
                            </div>
                            <VersionHistoryViewer history={asset.versionHistory} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssetLifecyclePage;
