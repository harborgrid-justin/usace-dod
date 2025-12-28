import React, { useState } from 'react';
import { UserCheck, Shield, Key, Search, Plus, Settings, FileCheck, Database, RefreshCcw, Lock } from 'lucide-react';
import PageWithHeader from '../shared/PageWithHeader';
import Badge from '../shared/Badge';

const MOCK_ADMIN_LOG = [
    { id: 'L-1', action: 'Permission Change', user: 'REMIS_ADMIN_1', target: 'Doe, Jane', date: '2024-03-15 08:30:00' },
    { id: 'L-2', action: 'API Key Rotation', user: 'SYSTEM', target: 'REMIS_PROD_DB', date: '2024-03-14 12:00:00' }
];

const REMISAdminView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Users' | 'Security' | 'Integration'>('Users');

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <UserCheck size={28} className="text-emerald-700" /> REMIS Administration
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Authoritative Access Control & System Integrity</p>
                </div>
                <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner">
                    {['Users', 'Security', 'Integration'].map(t => (
                        <button 
                            key={t} 
                            onClick={() => setActiveTab(t as any)} 
                            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                activeTab === t ? 'bg-white shadow-sm text-emerald-800' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                {activeTab === 'Users' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input className="pl-9 pr-3 py-1.5 border rounded-lg text-xs w-64" placeholder="Search users..."/></div>
                            <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2"><Plus size={14}/> Provision User</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase"><tr className="shadow-sm"><th className="p-4">Name / ID</th><th className="p-4">Assigned Role</th><th className="p-4">Last Access</th><th className="p-4 text-center">Status</th></tr></thead>
                                <tbody className="divide-y divide-zinc-50">
                                    <tr className="hover:bg-zinc-50 transition-colors">
                                        <td className="p-4"><div><p className="text-sm font-bold text-zinc-900">Sterling, Archer</p><p className="text-[10px] font-mono text-zinc-400">UID: 88122-A</p></div></td>
                                        <td className="p-4 text-xs font-medium text-zinc-700">REMIS_APPRAISER</td>
                                        <td className="p-4 text-xs font-mono text-zinc-500">2024-03-15 09:12</td>
                                        <td className="p-4 text-center"><Badge variant="success">Active</Badge></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Security' && (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-zinc-800">
                             <div className="absolute top-0 right-0 p-8 opacity-5"><Lock size={120} /></div>
                             <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-8 flex items-center gap-3"><Shield size={18}/> Encryption & Rotation</h4>
                             <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <span className="text-xs text-zinc-400 font-medium">DB Connection encryption</span>
                                    <Badge variant="emerald">AES-256-GCM</Badge>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <span className="text-xs text-zinc-400 font-medium">Last Key Rotation</span>
                                    <span className="text-xs font-mono text-white">2024-02-28</span>
                                </div>
                                <button className="w-full py-3 bg-white text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all">Force Re-Authentication</button>
                             </div>
                        </div>
                        <div className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3"><History size={18} className="text-zinc-400"/> System Events</h4>
                            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                                {MOCK_ADMIN_LOG.map(l => (
                                    <div key={l.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between items-start">
                                        <div><p className="text-xs font-bold text-zinc-800">{l.action}</p><p className="text-[10px] text-zinc-500">By: {l.user} on {l.target}</p></div>
                                        <span className="text-[9px] font-mono text-zinc-400">{l.date.split(' ')[0]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Integration' && (
                     <div className="p-12 text-center flex flex-col items-center justify-center gap-6 h-full">
                        <div className="p-8 bg-zinc-900 text-white rounded-full shadow-2xl animate-pulse"><RefreshCcw size={48}/></div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Active Federated Sync</h3>
                            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-2">Managing IDOC and OData channels between REMIS Authoritative Store and GFEBS ECC 6.0.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">GFEBS Latency</p>
                                <p className="text-lg font-mono font-bold text-emerald-600">0.4ms</p>
                            </div>
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Queue Depth</p>
                                <p className="text-lg font-mono font-bold text-zinc-900">0</p>
                            </div>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};
// Fix: Corrected export name to match the component defined on line 11
export default REMISAdminView;