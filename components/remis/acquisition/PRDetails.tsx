
import React from 'react';
import { PurchaseRequest } from '../../../types';
import { formatCurrency, formatRelativeTime } from '../../../utils/formatting';
import { ShieldCheck, History, Landmark, Database, FileText, Trash2, AlertTriangle } from 'lucide-react';
import { IntegrationOrchestrator } from '../../../services/IntegrationOrchestrator';
import { fundsService } from '../../../services/FundsDataService';
import { useToast } from '../../shared/ToastContext';
import { acquisitionService } from '../../../services/AcquisitionDataService';

interface Props {
    pr: PurchaseRequest | null;
    onDelete: (id: string) => void;
}

const PRDetails: React.FC<Props> = ({ pr, onDelete }) => {
    const { addToast } = useToast();
    if (!pr) return <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4">
        <FileText size={48} className="opacity-10" /><p className="text-xs font-bold uppercase tracking-widest">Select Requirement</p>
    </div>;

    const handleCertify = () => {
        const result = IntegrationOrchestrator.certifyPR(pr.id, 'KO_MGR', fundsService.getHierarchy());
        if (result.success) {
            acquisitionService.updatePR({ ...pr, status: 'Funds Certified' });
            addToast(`Requirement Certified for ${formatCurrency(pr.amount)}. Commitment record generated.`, 'success');
        }
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 animate-in fade-in">
            <div className="flex justify-between items-start border-b border-zinc-100 pb-8">
                <div><h3 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">{pr.description}</h3><p className="text-sm text-zinc-500">Requirement Origin: <span className="font-bold text-zinc-800 uppercase">{pr.requester}</span></p></div>
                <div className="flex gap-2">
                    {pr.status === 'Pending Certification' && (
                        <button onClick={handleCertify} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-lg flex items-center gap-2 transition-all active:scale-95"><ShieldCheck size={16}/> Certify Funds</button>
                    )}
                    <button onClick={() => onDelete(pr.id)} className="p-2.5 border border-zinc-200 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all"><Trash2 size={18}/></button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[ 
                    {l: 'Appropriation Symbol', v: pr.appropriation || '96X3122'}, 
                    {l: 'Object Class', v: pr.objectClass || '25.1'}, 
                    {l: 'WBS Control', v: pr.wbsCode || '123456'} 
                ].map(i => (
                    <div key={i.l} className="p-5 bg-zinc-50 rounded-[24px] border border-zinc-100 shadow-inner">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{i.l}</p>
                        <p className="text-sm font-mono font-bold text-zinc-900">{i.v}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm relative overflow-hidden">
                <AlertTriangle size={80} className="absolute -right-8 -bottom-8 opacity-5" />
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <History size={18} className="text-rose-700"/> Bona Fide Need Justification
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed indent-8 italic">"{pr.justification || 'Pending narrative upload from originating official.'}"</p>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Requirement Timeline</h4>
                <div className="space-y-3">{pr.auditLog.map((log, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs">
                        <div className="font-mono text-zinc-400 shrink-0">{formatRelativeTime(log.timestamp)}</div>
                        <div className="flex-1 font-medium">{log.action}: {log.details}</div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">{log.user}</div>
                    </div>
                ))}</div>
            </div>
        </div>
    );
};

export default PRDetails;
