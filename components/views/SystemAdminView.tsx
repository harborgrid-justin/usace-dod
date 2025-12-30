
import React, { useState } from 'react';
// Added missing Clock import from lucide-react
import { UserCheck, Shield, Key, CheckCircle, XCircle, Search, Plus, User, FileText, ChevronLeft, MoreHorizontal, Settings, FileCheck, Landmark, ShieldCheck, Database, Save, Fingerprint, Clock, ShieldAlert as LucideShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import Modal from '../shared/Modal';
import Badge from '../shared/Badge';

// Types & Mock Data
interface UserRecord { id: string; name: string; email: string; role: string; org: string; status: 'Active' | 'Locked' }

interface ApprovalTransaction {
    id: string;
    type: string;
    amount: number;
    requestor: string;
    date: string;
    status: string;
}

const MOCK_USERS: UserRecord[] = [
    { id: 'U-001', name: 'Richards, Alan', email: 'alan.richards@usace.army.mil', role: 'HQ_BUDGET_OFFICER', org: 'USACE-HQ', status: 'Active' },
    { id: 'U-002', name: 'Henderson, Sarah', email: 's.henderson@usace.army.mil', role: 'RE_SPECIALIST', org: 'LRL-RE', status: 'Active' },
];

const MOCK_AX_QUEUE: ApprovalTransaction[] = [
    { id: 'PR-24-009', type: 'Purchase Request', amount: 12500, requestor: 'LRL-OPS', date: '2024-03-15', status: 'Pending Cert' },
    { id: 'OBL-9912', type: 'Obligation', amount: 450000, requestor: 'LRL-CT', date: '2024-03-14', status: 'Pending Sig' },
];

const SystemAdminView = () => {
    const [activeTab, setActiveTab] = useState<'AX' | 'Users' | 'Security' | 'Systems'>('AX');
    
    // State management
    const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
    const [axQueue, setAxQueue] = useState<ApprovalTransaction[]>(MOCK_AX_QUEUE);
    const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
    const [showUserForm, setShowUserForm] = useState(false);

    const selectedTx = axQueue.find(t => t.id === selectedTxId);

    const handleOnboardUser = (u: UserRecord) => {
        setUsers([u, ...users]);
        setShowUserForm(false);
    };

    const handleApproveTx = (id: string) => {
        setAxQueue(axQueue.filter(item => item.id !== id));
        setSelectedTxId(null);
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <UserCheck size={28} className="text-rose-700" /> Administrative Command
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">Approve Transactions (AX) • Federated Identity • Crypto-Security</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-xl shadow-inner">
                    {['AX', 'Users', 'Security'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm text-rose-700 border border-rose-100' : 'text-zinc-500 hover:text-zinc-800'}`}>{tab === 'AX' ? 'Approval Center' : tab}</button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 bg-white border border-zinc-200 rounded-[32px] shadow-sm flex flex-col overflow-hidden relative">
                
                {activeTab === 'AX' && (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-amber-500"/> Inbound Approval Queue</h3>
                            <span className="text-[10px] font-mono font-bold text-zinc-400">{axQueue.length} PENDING TRANSACTIONS</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-white sticky top-0 border-b border-zinc-100 z-10 shadow-sm">
                                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <th className="p-5">Entity ID</th>
                                        <th className="p-5">Instruction Type</th>
                                        <th className="p-5">Requesting Org</th>
                                        <th className="p-5 text-right">Value ($)</th>
                                        <th className="p-5 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {axQueue.map(item => (
                                        <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group cursor-default">
                                            <td className="p-5 text-xs font-mono font-bold text-zinc-900">{item.id}</td>
                                            <td className="p-5 text-xs font-medium text-zinc-700">{item.type}</td>
                                            <td className="p-5"><span className="text-[10px] font-bold uppercase bg-zinc-100 px-2 py-1 rounded border border-zinc-200">{item.requestor}</span></td>
                                            <td className="p-5 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(item.amount)}</td>
                                            <td className="p-5 text-center">
                                                <button 
                                                    onClick={() => setSelectedTxId(item.id)}
                                                    className="px-4 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 shadow-sm transition-all active:scale-95"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Users' && (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                            <div className="relative group">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                                <input type="text" placeholder="Search by name or email..." className="pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-rose-400 w-80 transition-all"/>
                            </div>
                            <button 
                                onClick={() => setShowUserForm(true)}
                                className="flex items-center justify-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 shadow-lg"
                            >
                                <Plus size={14}/> Provision Access
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <th className="p-5">User Profile</th>
                                        <th className="p-5">Security Role</th>
                                        <th className="p-5">Organization</th>
                                        <th className="p-5 text-center">Protocol Status</th>
                                        <th className="p-5 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-sm uppercase group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div><p className="text-sm font-bold text-zinc-900">{user.name}</p><p className="text-[10px] text-zinc-400 font-mono">{user.email}</p></div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-[10px] font-bold font-mono text-zinc-600 bg-zinc-50/50 rounded">{user.role}</td>
                                            <td className="p-5 text-xs font-bold text-zinc-700">{user.org}</td>
                                            <td className="p-5 text-center"><Badge variant="success">{user.status}</Badge></td>
                                            <td className="p-5 text-right"><button className="p-2 text-zinc-300 hover:text-zinc-600 transition-colors"><MoreHorizontal size={18}/></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Security' && (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in h-full overflow-y-auto custom-scrollbar">
                        <div className="bg-zinc-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden border border-zinc-800 flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><ShieldCheck size={160} /></div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 flex items-center gap-3 text-emerald-400"><Fingerprint size={18}/> Digital Signature Protocol</h4>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-6 mb-10">
                                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20"><ShieldCheck size={32} /></div>
                                    <div><p className="text-base font-bold text-white">X.509 Certificate Valid</p><p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Expires: 2025-10-15</p></div>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed font-medium">Federated identity is authenticated via D-AFMP Multi-Factor Gateway. PKI signatures are enforced on all 4801/4901 series transactions.</p>
                            </div>
                            <button className="w-full mt-10 py-4 bg-white text-zinc-900 rounded-3xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-zinc-100 shadow-2xl active:scale-95 transition-all">Rotate Keys</button>
                        </div>
                        <div className="space-y-8">
                             <div className="bg-white border border-zinc-200 rounded-[40px] p-8 shadow-sm">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-zinc-50 pb-4"><Settings size={18} className="text-zinc-400"/> Authoritative System Parameters</h4>
                                <div className="space-y-4">
                                    {[
                                        { l: 'Session Timeout Duration', v: '15.0 Minutes' },
                                        { l: 'Max Authentication Attempts', v: '3 Cycles' },
                                        { l: 'Auditor View Access', v: 'G8-READ-ONLY' }
                                    ].map(p => (
                                        <div key={p.l} className="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-rose-200 transition-all">
                                            <span className="text-xs font-bold text-zinc-500 uppercase">{p.l}</span>
                                            <span className="text-xs font-mono font-bold text-zinc-900">{p.v}</span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             <div className="p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex gap-5 items-start">
                                <LucideShieldAlert size={24} className="text-rose-600 mt-1 shrink-0" />
                                <div><p className="text-xs font-bold text-rose-900 uppercase">Emergency Protocol</p><p className="text-[11px] text-rose-700 leading-relaxed mt-1 font-medium">Initiating a "System Lockdown" will terminate all active P2P/GL sessions and freeze budgetary authority updates globally.</p></div>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Approval Detail Workspace */}
            {selectedTx && (
                <Modal title={`Approval Directive: ${selectedTx.id}`} subtitle={`${selectedTx.type} Evaluation`} onClose={() => setSelectedTxId(null)}>
                    <div className="space-y-12 animate-in slide-in-from-right-4">
                        <div className="flex justify-between items-start">
                            <div><h3 className="text-4xl font-bold text-zinc-900 tracking-tighter leading-none mb-2">{selectedTx.type}</h3><p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Originator: {selectedTx.requestor} • FY 2024</p></div>
                            <div className="text-right"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Impact Value</p><p className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">{formatCurrency(selectedTx.amount)}</p></div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-[40px] p-10 font-mono text-xs leading-loose shadow-inner min-h-[400px] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-700 to-rose-400" />
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-10">Electronic Data Interchange (EDI) Snapshot</h4>
                            <div className="space-y-4 text-zinc-600">
                                <p>HEADER_DOC_NUM: {selectedTx.id}</p>
                                <p>POSTING_DATE: {selectedTx.date}</p>
                                <p>WF_STAGE: {selectedTx.status}</p>
                                <p className="pt-4 border-t border-zinc-200 border-dashed">-- ITEMIZATION 001 --</p>
                                <p>DESC: CONTRACTUAL SERVICES (NON-PERSONAL)</p>
                                <p>MAGNITUDE: {formatCurrency(selectedTx.amount)}</p>
                                <p>USSGL_ACCT: 480100 (UDO)</p>
                                <p>FUND: 21 2020 0000</p>
                                <p className="pt-4">-- END TRANSMISSION --</p>
                            </div>
                        </div>
                        <div className="pt-10 border-t border-zinc-100 flex justify-end gap-6">
                            <button onClick={() => setSelectedTxId(null)} className="px-8 py-3 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50">Return to Queue</button>
                            <button className="px-8 py-3 bg-rose-100 text-rose-700 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-200 flex items-center gap-3"><XCircle size={18}/> Reject Directive</button>
                            <button onClick={() => handleApproveTx(selectedTx.id)} className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-2xl active:scale-95 flex items-center gap-3 transition-all"><ShieldCheck size={20}/> Sign & Execute</button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* User Onboarding Workspace */}
            {showUserForm && (
                <Modal title="Provision Federated Identity" subtitle="System User Onboarding" onClose={() => setShowUserForm(false)}>
                    <UserOnboardingForm onCancel={() => setShowUserForm(false)} onSubmit={handleOnboardUser} />
                </Modal>
            )}
        </div>
    );
};

const UserOnboardingForm = ({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (u: UserRecord) => void }) => {
    const [u, setU] = useState<Partial<UserRecord>>({ role: 'Budget Analyst', org: 'USACE-LRL', status: 'Active' });
    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4">
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex gap-5 items-start">
                <ShieldCheck size={24} className="text-emerald-600 mt-1 shrink-0" />
                <div><p className="text-xs font-bold text-emerald-900 uppercase">IAM Certification</p><p className="text-[11px] text-emerald-700 mt-1 font-medium">Provisioning a new user requires affirmation of CAC-based authentication protocols and multi-agency role mapping.</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <div><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Full Legal Name</label><input type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-bold bg-zinc-50/50 focus:bg-white focus:border-rose-400 outline-none" onChange={e => setU({...u, name: e.target.value})} required /></div>
                    <div><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Enterprise Email (.mil)</label><input type="email" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-medium bg-zinc-50/50 focus:bg-white focus:border-rose-400 outline-none" onChange={e => setU({...u, email: e.target.value})} required /></div>
                </div>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Role Allocation</label><select className="w-full border border-zinc-200 rounded-2xl p-4 text-xs font-bold bg-zinc-50/50 focus:bg-white outline-none" onChange={e => setU({...u, role: e.target.value})}><option>Budget Analyst</option><option>Approving Official</option><option>System Administrator</option></select></div>
                        <div><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Parent Command</label><input type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-xs font-bold bg-zinc-50/50" value={u.org} readOnly /></div>
                    </div>
                    <div className="p-8 bg-zinc-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                        <Key size={80} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Security Profile</p>
                        <p className="text-xs text-zinc-400 leading-relaxed font-medium">User will be assigned a dynamic <strong>SHA-256 HMAC Secret</strong> for transaction signing upon first login.</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-10 border-t border-zinc-100">
                <button type="button" onClick={onCancel} className="px-8 py-3 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50">Cancel</button>
                <button onClick={() => onSubmit({...u, id: `U-${Date.now()}`} as UserRecord)} className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-2xl active:scale-95 transition-all">Provision Federated ID</button>
            </div>
        </div>
    );
};

export default SystemAdminView;
