
import React, { useState } from 'react';
import { 
    ShoppingCart, Plus, Search, ShieldCheck, 
    FileText, History, AlertTriangle 
} from 'lucide-react';
import { PurchaseRequest } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { AcquisitionOrchestrator } from '../../services/AcquisitionOrchestrator';
import { MOCK_FUND_HIERARCHY } from '../../constants';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../shared/ToastContext';
import EmptyState from '../shared/EmptyState';
import Badge from '../shared/Badge';
import { formatRelativeTime } from '../../utils/formatting';

interface Props {
    prs: PurchaseRequest[];
    setPrs: React.Dispatch<React.SetStateAction<PurchaseRequest[]>>;
}

const PRCenter: React.FC<Props> = ({ prs, setPrs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { addToast } = useToast();

    const filteredPRs = prs.filter(pr => 
        pr.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        pr.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const selectedPR = prs.find(p => p.id === selectedId);

    const handleCertify = (id: string) => {
        const pr = prs.find(p => p.id === id);
        if (!pr) return;

        const result = AcquisitionOrchestrator.certifyPR(pr, MOCK_FUND_HIERARCHY);
        
        if (result.success) {
            setPrs(prev => prev.map(p => p.id === id ? {
                ...p,
                status: 'Funds Certified',
                certifiedBy: 'G8_USER_ADMIN',
                certificationDate: new Date().toISOString().split('T')[0],
                auditLog: [...p.auditLog, { timestamp: new Date().toISOString(), user: 'G8_USER_ADMIN', action: 'Funds Certified', details: result.message }]
            } : p));
            addToast(`Financial Success: Commitment posted. ${result.message}`, 'success');
        } else {
            addToast(`Certification Failed: ${result.message}`, 'error');
        }
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full">
            {/* List Panel */}
            <div className="w-full md:w-[450px] border-r border-zinc-100 flex flex-col bg-zinc-50/30">
                <div className="p-4 border-b border-zinc-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <ShoppingCart size={14}/> Open Requirements
                        </h3>
                        <button className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
                            <Plus size={14}/>
                        </button>
                    </div>
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Search PR, WBS, or Requester..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {filteredPRs.map(pr => (
                        <button 
                            key={pr.id}
                            onClick={() => setSelectedId(pr.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                selectedId === pr.id 
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]' 
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-mono font-bold ${selectedId === pr.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{pr.id}</span>
                                <Badge variant={
                                    pr.status === 'Funds Certified' ? 'success' :
                                    pr.status === 'Pending Certification' ? 'warning' : 'neutral'
                                }>{pr.status}</Badge>
                            </div>
                            <h4 className="text-sm font-bold truncate leading-tight mb-1">{pr.description}</h4>
                            <p className="text-[10px] opacity-60 mb-3">{pr.requester} • {pr.date}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Amount</span>
                                <span className="text-sm font-mono font-bold">{formatCurrency(pr.amount)}</span>
                            </div>
                        </button>
                    ))}
                    {filteredPRs.length === 0 && (
                        <div className="p-8">
                             <EmptyState title="No PRs Found" description="Try adjusting your search filters or create a new requirement." icon={Search} />
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                {selectedPR ? (
                    <div className="p-8 space-y-8 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-zinc-100 pb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-zinc-900 leading-tight mb-1">{selectedPR.description}</h3>
                                <p className="text-sm text-zinc-500">Requirement Originator: <span className="font-bold text-zinc-800">{selectedPR.requester}</span></p>
                            </div>
                            <div className="flex gap-2">
                                {selectedPR.status === 'Pending Certification' && (
                                    <button 
                                        onClick={() => handleCertify(selectedPR.id)}
                                        className="px-6 py-2.5 bg-rose-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                                    >
                                        <ShieldCheck size={14}/> Certify Funds
                                    </button>
                                )}
                                <button className="p-2.5 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 transition-colors">
                                    <FileText size={18}/>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Financial Linkage</p>
                                <p className="text-sm font-mono font-bold text-zinc-900">{selectedPR.appropriation || 'Pending Code'}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Object Class</p>
                                <p className="text-sm font-mono font-bold text-zinc-900">{selectedPR.objectClass || '25.1 - Contracts'}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">P2 WBS</p>
                                <p className="text-sm font-mono font-bold text-zinc-900">{selectedPR.wbsCode || '123456.01.01'}</p>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle size={14} className="text-amber-500"/> Justification & Purpose
                            </h4>
                            <p className="text-sm text-zinc-600 leading-relaxed indent-4">
                                {selectedPR.justification || 'No justification narrative provided. Requirement pending detailed analyst review.'}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <History size={14} className="text-zinc-400"/> Requirement Audit Trail
                            </h4>
                            <div className="space-y-3">
                                {selectedPR.auditLog.map((log, i) => (
                                    <div key={i} className="flex gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                                        <div className="font-mono text-zinc-400 shrink-0">{formatRelativeTime(log.timestamp)}</div>
                                        <div className="flex-1">
                                            <span className="font-bold text-zinc-800 uppercase text-[10px]">{log.action}:</span> {log.details}
                                        </div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase">{log.user}</div>
                                    </div>
                                ))}
                                {selectedPR.auditLog.length === 0 && <p className="text-xs text-zinc-400 italic">No events recorded in system log.</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3 h-full p-12">
                        <EmptyState 
                            title="Requirement Detail"
                            description="Select a requirement from the list to manage commitment, funding certification, and audit history."
                            icon={ShoppingCart}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PRCenter;
