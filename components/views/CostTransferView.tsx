
import React, { useState, useEffect } from 'react';
import { Shuffle, ArrowLeft, Search, Plus, Filter } from 'lucide-react';
import { CostTransfer } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { costTransferService } from '../../services/CostTransferDataService';
import TransferDashboard from '../cost_transfer/TransferDashboard';
import TransferWizard from '../cost_transfer/TransferWizard';
import TransferDetail from '../cost_transfer/TransferDetail';

interface Props {
    onSelectProject: (projectId: string) => void;
}

const CostTransferView: React.FC<Props> = ({ onSelectProject }) => {
    const [view, setView] = useState<'dashboard' | 'list' | 'create' | 'detail'>('dashboard');
    const [transfers, setTransfers] = useState<CostTransfer[]>(costTransferService.getTransfers());
    const [selectedTransfer, setSelectedTransfer] = useState<CostTransfer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');

    // Subscribe to live data
    useEffect(() => {
        const unsubscribe = costTransferService.subscribe(() => {
            setTransfers([...costTransferService.getTransfers()]);
        });
        return unsubscribe;
    }, []);

    // -- Actions --

    const handleCreate = (newTransferData: Omit<CostTransfer, 'id' | 'requestDate' | 'status' | 'auditLog'>) => {
        const newTransfer: CostTransfer = {
            ...newTransferData,
            id: `CT-24-${String(Date.now()).slice(-4)}`,
            requestDate: new Date().toISOString(),
            status: 'Pending Approval',
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'Current User', // In real app, from context
                action: 'Created',
                details: 'Transfer request submitted via Wizard.'
            }]
        };
        costTransferService.addTransfer(newTransfer);
        setView('list');
    };

    const handleUpdateStatus = (id: string, newStatus: CostTransfer['status'], details: string) => {
        const t = transfers.find(tr => tr.id === id);
        if (!t) return;

        const updatedTransfer: CostTransfer = {
            ...t,
            status: newStatus,
            auditLog: [...t.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'Approver', // Mock user
                action: newStatus,
                details
            }]
        };
        
        costTransferService.updateTransfer(updatedTransfer);
        if (selectedTransfer && selectedTransfer.id === id) {
            setSelectedTransfer(updatedTransfer);
        }
    };

    const handlePost = (id: string) => {
        const t = transfers.find(tr => tr.id === id);
        if (!t) return;

        // Integration Logic: Create GL Entry
        const glEntry = IntegrationOrchestrator.generateCostTransferJournal(t, 'System Admin');
        
        const updatedTransfer: CostTransfer = {
            ...t,
            status: 'Posted',
            postedDate: new Date().toISOString(),
            glTransactionId: glEntry.id,
            auditLog: [...t.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'System Admin',
                action: 'Posted',
                details: `GL Transaction ${glEntry.id} generated successfully.`
            }]
        };

        costTransferService.updateTransfer(updatedTransfer);
        setSelectedTransfer(updatedTransfer);
    };

    const filteredTransfers = transfers.filter(t => {
        const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.sourceProjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              t.targetProjectId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col">
            {/* Top Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 text-rose-700 rounded-lg"><Shuffle size={24} /></div>
                    <div>
                        <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight">Cost Transfers</h2>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Expenditure Reallocation & Corrections</p>
                    </div>
                </div>
                
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    <button onClick={() => setView('dashboard')} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${view === 'dashboard' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}>Dashboard</button>
                    <button onClick={() => setView('list')} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${view === 'list' || view === 'detail' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}>Ledger</button>
                    <button onClick={() => setView('create')} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${view === 'create' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}>+ New Request</button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                {view === 'dashboard' && <TransferDashboard transfers={transfers} />}
                
                {view === 'list' && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                                    <input 
                                        type="text" 
                                        placeholder="Search transfers..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:border-zinc-400"
                                    />
                                </div>
                                <select 
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending Approval">Pending</option>
                                    <option value="Posted">Posted</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <button onClick={() => setView('create')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors">
                                <Plus size={14}/> Create
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID / Date</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Source Project</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Project</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                                        <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filteredTransfers.map(t => (
                                        <tr 
                                            key={t.id} 
                                            className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                                            onClick={() => { setSelectedTransfer(t); setView('detail'); }}
                                        >
                                            <td className="p-4">
                                                <p className="text-xs font-mono font-bold text-zinc-900">{t.id}</p>
                                                <p className="text-[10px] text-zinc-500">{new Date(t.requestDate).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-4 text-xs font-medium text-zinc-700">{t.sourceProjectId.split(' - ')[0]}</td>
                                            <td className="p-4 text-xs font-medium text-zinc-700">{t.targetProjectId.split(' - ')[0]}</td>
                                            <td className="p-4 text-right text-xs font-mono font-bold text-zinc-900">{formatCurrency(t.amount)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${
                                                    t.status === 'Posted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    t.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-zinc-100 text-zinc-600 border-zinc-200'
                                                }`}>{t.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTransfers.length === 0 && (
                                        <tr><td colSpan={5} className="p-8 text-center text-zinc-400 text-xs">No records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'create' && <TransferWizard onCancel={() => setView('list')} onSubmit={handleCreate} />}
                
                {view === 'detail' && selectedTransfer && (
                    <TransferDetail 
                        transfer={selectedTransfer} 
                        onBack={() => setView('list')}
                        onApprove={(id) => handleUpdateStatus(id, 'Approved', 'Approved by Manager')}
                        onReject={(id) => handleUpdateStatus(id, 'Rejected', 'Insufficient Justification')}
                        onPost={(id) => handlePost(id)}
                    />
                )}
            </div>
        </div>
    );
};

export default CostTransferView;
