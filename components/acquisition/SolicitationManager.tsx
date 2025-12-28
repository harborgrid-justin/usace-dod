import React from 'react';
import { 
    FileText, ArrowRight, ExternalLink, ShieldCheck,
    Briefcase, Activity
} from 'lucide-react';
import { PurchaseRequest, Contract } from '../../types';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { formatCurrency } from '../../utils/formatting';
import { useToast } from '../shared/ToastContext';

interface Props {
    prs: PurchaseRequest[];
    setPrs: React.Dispatch<React.SetStateAction<PurchaseRequest[]>>;
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
}

const SolicitationManager: React.FC<Props> = ({ prs, setPrs, contracts, setContracts }) => {
    const certRequirements = prs.filter(p => p.status === 'Funds Certified' || p.status === 'Solicitation');
    const { addToast } = useToast();

    const handleAward = (pr: PurchaseRequest) => {
        const vendorData = {
            name: 'V-NEX SOLUTIONS LLC',
            uei: 'Z82LK912P',
            cageCode: '1A9F4',
            amount: pr.amount
        };

        const result = IntegrationOrchestrator.awardContract(pr.id, vendorData, 'KO_ADMIN');
        
        setContracts(prev => [result, ...prev]);
        setPrs(prev => prev.map(p => p.id === pr.id ? { 
            ...p, 
            status: 'Awarded',
            auditLog: [...p.auditLog, { timestamp: new Date().toISOString(), user: 'KO_ADMIN', action: 'Awarded', details: `Awarded to ${vendorData.name}` }]
        } : p));

        addToast(`CONTRACT AWARDED: PIID ${result.id} to ${vendorData.name}`, 'success');
    };

    return (
        <div className="p-6 h-full overflow-y-auto custom-scrollbar space-y-8 animate-in fade-in">
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-zinc-400"/> Actionable Requirements
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                    {certRequirements.map(pr => (
                        <div key={pr.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-rose-200 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                             <div className="flex-1 w-full">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded">{pr.id}</span>
                                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">Certified</span>
                                </div>
                                <h5 className="text-lg font-bold text-zinc-900 mb-1">{pr.description}</h5>
                                <p className="text-xs text-zinc-500">Requester: {pr.requester} • <span className="font-mono">{pr.wbsCode}</span></p>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Certified Amount</p>
                                    <p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(pr.amount)}</p>
                                </div>
                                <div className="h-10 w-px bg-zinc-100 hidden md:block" />
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 border border-zinc-200 rounded-xl text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50 transition-all flex items-center gap-2">
                                        <ExternalLink size={14}/> SAM.gov
                                    </button>
                                    <button 
                                        onClick={() => handleAward(pr)}
                                        className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 flex items-center gap-2"
                                    >
                                        Award <ArrowRight size={14}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {certRequirements.length === 0 && (
                        <div className="py-20 text-center bg-zinc-50/50 rounded-2xl border-2 border-dashed border-zinc-200">
                            <Briefcase size={32} className="mx-auto mb-4 opacity-10" />
                            <p className="text-sm font-medium text-zinc-400">No certified requirements pending award.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SolicitationManager;