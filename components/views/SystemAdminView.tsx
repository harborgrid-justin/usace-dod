
import React, { useState } from 'react';
import { UserCheck, Shield, Key, CheckCircle, XCircle, Search, Plus, User, FileText, ChevronLeft, MoreHorizontal, Settings, FileCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

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
    { id: 'U-001', name: 'John Smith', email: 'john.smith@usace.army.mil', role: 'Budget Analyst', org: 'LRL-RM', status: 'Active' },
    { id: 'U-002', name: 'Jane Doe', email: 'jane.doe@usace.army.mil', role: 'Approving Official', org: 'LRL-ED', status: 'Active' },
];

const MOCK_AX_QUEUE: ApprovalTransaction[] = [
    { id: 'PR-24-009', type: 'Purchase Request', amount: 12500, requestor: 'LRL-OPS', date: '2024-03-15', status: 'Pending Cert' },
    { id: 'OBL-9912', type: 'Obligation', amount: 450000, requestor: 'LRL-CT', date: '2024-03-14', status: 'Pending Sig' },
];

const SystemAdminView = () => {
    const [activeTab, setActiveTab] = useState<'AX' | 'Users' | 'Security'>('AX');
    
    // User Mgmt State
    const [userView, setUserView] = useState<'list' | 'form'>('list');
    const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
    const [newUser, setNewUser] = useState<Partial<UserRecord>>({});

    // AX State
    const [axView, setAxView] = useState<'list' | 'detail'>('list');
    const [axQueue, setAxQueue] = useState<ApprovalTransaction[]>(MOCK_AX_QUEUE);
    const [selectedTx, setSelectedTx] = useState<ApprovalTransaction | null>(null);

    // Handlers
    const handleAddUser = () => {
        if (!newUser.name || !newUser.role) return;
        setUsers([...users, { ...newUser, id: `U-${Date.now()}`, status: 'Active' } as UserRecord]);
        setUserView('list');
        setNewUser({});
    };

    const handleApproveTx = (id: string) => {
        setAxQueue(axQueue.filter(item => item.id !== id));
        setAxView('list');
        setSelectedTx(null);
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <UserCheck size={24} className="text-rose-700" /> System Administration
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Approve Transactions (AX) • Security • User Roles</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    {['AX', 'Users', 'Security'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}>{tab}</button>
                    ))}
                </div>
            </div>

            {/* AX TAB */}
            {activeTab === 'AX' && (
                <div className="flex-1 flex flex-col min-h-0">
                    {axView === 'list' ? (
                        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden flex-1">
                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Approval Queue (AX)</h3>
                                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{axQueue.length} Pending</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="bg-white border-b border-zinc-100">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Transaction ID</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Type</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Requestor</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase text-right">Amount</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {axQueue.map(item => (
                                            <tr key={item.id} className="hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => { setSelectedTx(item); setAxView('detail'); }}>
                                                <td className="p-4 text-xs font-mono font-bold text-zinc-800">{item.id}</td>
                                                <td className="p-4 text-xs text-zinc-600">{item.type}</td>
                                                <td className="p-4 text-xs text-zinc-600">{item.requestor}</td>
                                                <td className="p-4 text-xs font-mono font-bold text-zinc-900 text-right">{formatCurrency(item.amount)}</td>
                                                <td className="p-4 text-center">
                                                    <button className="text-[10px] font-bold text-blue-600 hover:underline">Review</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {axQueue.length === 0 && <tr className="text-center text-zinc-400 text-xs"><td colSpan={5} className="p-8">No pending transactions.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-8 flex flex-col h-full animate-in slide-in-from-right-4">
                            <button onClick={() => setAxView('list')} className="self-start mb-6 flex items-center gap-2 text-xs font-bold uppercase text-zinc-500 hover:text-zinc-900"><ChevronLeft size={14}/> Back to Queue</button>
                            {selectedTx && (
                                <>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-zinc-900 mb-1">{selectedTx.type} Approval</h3>
                                            <p className="text-sm text-zinc-500 font-mono">ID: {selectedTx.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Value</p>
                                            <p className="text-3xl font-mono font-bold text-zinc-900">{formatCurrency(selectedTx.amount)}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl p-6 mb-6">
                                        <div className="flex items-center gap-3 mb-4 text-sm font-bold text-zinc-800 border-b border-zinc-200 pb-2">
                                            <FileText size={16}/> Document Preview
                                        </div>
                                        <div className="text-xs font-mono text-zinc-600 space-y-2">
                                            <p>REQUESTOR: {selectedTx.requestor}</p>
                                            <p>DATE: {selectedTx.date}</p>
                                            <p>STATUS: {selectedTx.status}</p>
                                            <p>--- LINE ITEMS ---</p>
                                            <p>001  SERVICES, NON-PERSONAL   1.00 LS   {formatCurrency(selectedTx.amount)}</p>
                                            <p>--- END ---</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 justify-end">
                                        <button onClick={() => setAxView('list')} className="px-6 py-3 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Return</button>
                                        <button className="px-6 py-3 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold uppercase hover:bg-rose-200 flex items-center gap-2"><XCircle size={16}/> Reject</button>
                                        <button onClick={() => handleApproveTx(selectedTx.id)} className="px-6 py-3 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2"><CheckCircle size={16}/> Sign & Certify</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'Users' && (
                <div className="flex-1 flex flex-col min-h-0">
                    {userView === 'list' ? (
                        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden flex-1">
                            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input type="text" placeholder="Search users..." className="pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 w-64"/>
                                </div>
                                <button onClick={() => setUserView('form')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors">
                                    <Plus size={14}/> Add User
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="bg-white border-b border-zinc-100">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">User</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Role</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Organization</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase">Status</th>
                                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs">{user.name.charAt(0)}</div>
                                                        <div><p className="text-sm font-bold text-zinc-900">{user.name}</p><p className="text-[10px] text-zinc-500">{user.email}</p></div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-medium text-zinc-700">{user.role}</td>
                                                <td className="p-4 text-xs font-medium text-zinc-700">{user.org}</td>
                                                <td className="p-4"><span className="text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">{user.status}</span></td>
                                                <td className="p-4 text-right"><button className="text-zinc-400 hover:text-zinc-600"><MoreHorizontal size={16}/></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-8 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-4">
                            <h3 className="text-lg font-bold text-zinc-900 mb-6">Create New User</h3>
                            <div className="space-y-4">
                                <div><label className="text-[10px] font-bold text-zinc-500 uppercase">Full Name</label><input type="text" className="w-full mt-1 border rounded p-2 text-sm" value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})}/></div>
                                <div><label className="text-[10px] font-bold text-zinc-500 uppercase">Email (Gov)</label><input type="email" className="w-full mt-1 border rounded p-2 text-sm" value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})}/></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase">Role</label><select className="w-full mt-1 border rounded p-2 text-sm bg-white" value={newUser.role || ''} onChange={e => setNewUser({...newUser, role: e.target.value})}><option value="">Select...</option><option>Budget Analyst</option><option>Approving Official</option><option>Administrator</option></select></div>
                                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase">Organization</label><input type="text" className="w-full mt-1 border rounded p-2 text-sm" value={newUser.org || ''} onChange={e => setNewUser({...newUser, org: e.target.value})}/></div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setUserView('list')} className="px-4 py-2 border rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Cancel</button>
                                    <button onClick={handleAddUser} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Create User</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'Security' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Shield size={14} className="text-zinc-400"/> Digital Signature Config</h4>
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-3 mb-4">
                            <FileCheck size={20} className="text-emerald-600" />
                            <div><p className="text-sm font-bold text-emerald-900">Certificate Valid</p><p className="text-[10px] text-emerald-700">Expires: 2025-10-15</p></div>
                        </div>
                        <button className="w-full py-2 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Update CAC Certificate</button>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Settings size={14} className="text-zinc-400"/> System Parameters</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs text-zinc-700 p-2 bg-zinc-50 rounded border border-zinc-100"><span>Session Timeout</span><span className="font-mono font-bold">15 min</span></div>
                            <div className="flex justify-between items-center text-xs text-zinc-700 p-2 bg-zinc-50 rounded border border-zinc-100"><span>Max Login Attempts</span><span className="font-mono font-bold">3</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemAdminView;
