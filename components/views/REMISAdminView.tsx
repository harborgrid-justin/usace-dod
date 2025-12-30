
import React, { useState } from 'react';
import { UserCheck, Shield, Key, Search, Plus, Settings, FileCheck, Database, RefreshCcw, Lock, User, MoreHorizontal, History, ShieldCheck, Fingerprint, XCircle, Send } from 'lucide-react';
import PageWithHeader from '../shared/PageWithHeader';
import Badge from '../shared/Badge';
import Modal from '../shared/Modal';
import { useToast } from '../shared/ToastContext';

interface UserRecord { id: string; name: string; email: string; role: string; org: string; status: 'Active' | 'Locked' }

const MOCK_USERS: UserRecord[] = [
    { id: 'U-88122-A', name: 'Sterling, Archer', email: 'archer.sterling@usace.army.mil', role: 'REMIS_APPRAISER', org: 'USACE-LRL', status: 'Active' },
    { id: 'U-99212-B', name: 'Lana, Kane', email: 'lana.kane@usace.army.mil', role: 'REMIS_REVIEWER', org: 'USACE-MVK', status: 'Active' }
];

const MOCK_ADMIN_LOG = [
    { id: 'L-1', action: 'Permission Change', user: 'REMIS_ADMIN_1', target: 'Doe, Jane', date: '2024-03-15 08:30:00' },
    { id: 'L-2', action: 'API Key Rotation', user: 'SYSTEM', target: 'REMIS_PROD_DB', date: '2024-03-14 12:00:00' }
];

const REMISAdminView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Users' | 'Security' | 'Integration'>('Users');
    const [showUserForm, setShowUserForm] = useState(false);
    const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
    const { addToast } = useToast();

    const handleOnboardUser = (u: UserRecord) => {
        setUsers([u, ...users]);
        setShowUserForm(false);
        addToast(`Provisioned access for ${u.name}.`, 'success');
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <UserCheck size={28} className="text-emerald-700" /> REMIS Administration
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">Authoritative Access Control • System Integrity • GFEBS Interface</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-xl shadow-inner">
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

            <div className="flex-1 bg-white border border-zinc-200 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
                {activeTab === 'Users' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative group w-full sm:w-80">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors"/>
                                <input className="pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500 transition-all shadow-sm" placeholder="Search authoritative user records..."/>
                            </div>
                            <button 
                                onClick={() => setShowUserForm(true)}
                                className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                            >
                                <Plus size={14}/> Provision User Profile
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                                    <tr className="shadow-sm">
                                        <th className="p-5">Name / Legal Email</th>
                                        <th className="p-5">Assigned Fiduciary Role</th>
                                        <th className="p-5">Command / Org</th>
                                        <th className="p-5 text-center">Status</th>
                                        <th className="p-5 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-sm uppercase group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                                                        <p className="text-[10px] font-mono text-zinc-400">UID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-xs font-bold text-zinc-700 uppercase tracking-tighter">
                                                <span className="bg-zinc-50 px-2 py-1 rounded border border-zinc-200">{user.role}</span>
                                            </td>
                                            <td className="p-5 text-xs font-bold text-zinc-700">{user.org}</td>
                                            <td className="p-5 text-center">
                                                <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>{user.status}</Badge>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors">
                                                    <MoreHorizontal size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Security' && (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 h-full overflow-y-auto custom-scrollbar">
                        <div className="bg-zinc-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl border border-zinc-800 flex flex-col justify-between">
                             <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Lock size={160} /></div>
                             <div>
                                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-10 flex items-center gap-3">
                                    <ShieldCheck size={20}/> Cryptographic Rotation
                                </h4>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center p-5 bg-white/5 border border-white/10 rounded-[24px] shadow-inner">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/10 rounded-xl"><Fingerprint size={20}/></div>
                                            <span className="text-xs text-zinc-400 font-medium">Session Encryption Protocol</span>
                                        </div>
                                        <Badge variant="emerald">AES-256-GCM</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-5 bg-white/5 border border-white/10 rounded-[24px] shadow-inner">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/10 rounded-xl"><RefreshCcw size={20}/></div>
                                            <span className="text-xs text-zinc-400 font-medium">Last PKI Synchronization</span>
                                        </div>
                                        <span className="text-xs font-mono text-white font-bold">2024-02-28 04:00</span>
                                    </div>
                                </div>
                             </div>
                             <button className="w-full mt-10 py-4 bg-white text-zinc-900 rounded-3xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-100 shadow-2xl active:scale-95 transition-all">Rotate Platform Keys</button>
                        </div>
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 flex flex-col shadow-sm">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-zinc-50 pb-4">
                                <History size={20} className="text-zinc-400"/> Critical System Events
                            </h4>
                            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                {MOCK_ADMIN_LOG.map(l => (
                                    <div key={l.id} className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl flex justify-between items-start group hover:border-emerald-200 transition-all">
                                        <div className="flex gap-4">
                                            <div className="p-2 bg-white rounded-xl border border-zinc-200 text-zinc-400 group-hover:text-emerald-700 transition-colors"><Shield size={16}/></div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-900">{l.action}</p>
                                                <p className="text-[10px] text-zinc-500 mt-1">Initiated by: <span className="text-zinc-800 font-bold">{l.user}</span></p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-mono text-zinc-400 font-bold">{l.date.split(' ')[0]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Integration' && (
                     <div className="p-20 text-center flex flex-col items-center justify-center gap-8 h-full bg-zinc-50/20">
                        <div className="p-12 bg-zinc-900 text-white rounded-[50px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
                            <RefreshCcw size={64} className="relative z-10"/>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-zinc-900 tracking-tighter">Federated Sync active</h3>
                            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-4 leading-relaxed font-medium">
                                Maintaining authoritative OData channels between <span className="text-emerald-700 font-bold">REMIS 2.0</span> and 
                                <span className="text-rose-700 font-bold ml-1">GFEBS (ECC 6.0)</span>.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
                            <div className="p-6 bg-white border border-zinc-200 rounded-[32px] shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Interface Latency</p>
                                <p className="text-3xl font-mono font-bold text-emerald-600">0.42ms</p>
                            </div>
                            <div className="p-6 bg-white border border-zinc-200 rounded-[32px] shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Daily Payload</p>
                                <p className="text-3xl font-mono font-bold text-zinc-900">4,201 <span className="text-xs uppercase font-sans text-zinc-400">TX</span></p>
                            </div>
                        </div>
                        <button className="px-10 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl transition-all active:scale-95">Restart IDOC Listener</button>
                     </div>
                )}
            </div>

            {showUserForm && (
                <Modal title="Provision Federated Identity" subtitle="Identity and Access Management (IAM)" onClose={() => setShowUserForm(false)}>
                    <UserOnboardingForm onCancel={() => setShowUserForm(false)} onSubmit={handleOnboardUser} />
                </Modal>
            )}
        </div>
    );
};

const UserOnboardingForm = ({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (u: UserRecord) => void }) => {
    const [u, setU] = useState<Partial<UserRecord>>({ role: 'REMIS_APPRAISER', org: 'USACE-LRL', status: 'Active' });
    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-6">
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[32px] flex gap-6 items-start shadow-inner">
                <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm"><ShieldCheck size={28} /></div>
                <div>
                    <p className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Identity Certification</p>
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium leading-relaxed">
                        Provisioning a new user requires validation of CAC-based credentials. Role assignments are derived from standard USACE personnel data schemas.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Full Legal Identity</label>
                        <input type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-bold bg-zinc-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all" onChange={e => setU({...u, name: e.target.value})} required placeholder="e.g. DOE, JOHN A" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Enterprise Mail (.mil)</label>
                        <input type="email" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-medium bg-zinc-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all" onChange={e => setU({...u, email: e.target.value})} required placeholder="john.a.doe@usace.army.mil" />
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Authoritative Role</label>
                            <select className="w-full border border-zinc-200 rounded-2xl p-4 text-xs font-bold bg-zinc-50/50 focus:bg-white outline-none transition-all" onChange={e => setU({...u, role: e.target.value})}>
                                <option value="REMIS_APPRAISER">REMIS_APPRAISER</option>
                                <option value="REMIS_REVIEWER">REMIS_REVIEWER</option>
                                <option value="REMIS_ADMIN">REMIS_ADMIN</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Assigned Command</label>
                            <input type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-xs font-bold bg-zinc-50/50" value={u.org} readOnly />
                        </div>
                    </div>
                    <div className="p-8 bg-zinc-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center gap-4">
                        <Key size={80} className="absolute -right-4 -bottom-4 opacity-5 rotate-12" />
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest relative z-10">Provisioning Logic</p>
                        <p className="text-xs text-zinc-400 leading-relaxed font-medium relative z-10">User will be assigned a permanent <strong>Unique User Identifier (UUID)</strong> synced with DEERS upon the first successful CAC login.</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-10 border-t border-zinc-100">
                <button type="button" onClick={onCancel} className="px-8 py-3 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50">Cancel Provision</button>
                <button onClick={() => onSubmit({...u, id: `U-${Date.now().toString().slice(-6)}`} as UserRecord)} className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-2xl active:scale-95 transition-all flex items-center gap-2">
                    <Send size={16} /> Execute IAM Protocol
                </button>
            </div>
        </div>
    );
};

export default REMISAdminView;
