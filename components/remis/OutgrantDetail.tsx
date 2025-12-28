import React, { useState, useMemo, useTransition } from 'react';
import { 
    ArrowLeft, FileSignature, Calendar, DollarSign, Activity, 
    ShieldCheck, Eye, Plus, History, User, FileText, 
    AlertTriangle, Archive, PlayCircle, Ban, Database
} from 'lucide-react';
import { Outgrant, OutgrantStatus, OutgrantInspection, UtilizationSummary } from '../../types';
import { formatCurrency, formatRelativeTime } from '../../utils/formatting';
import { remisService } from '../../services/RemisDataService';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { useToast } from '../shared/ToastContext';
import { REMIS_THEME } from '../../constants';

const OutgrantDetail: React.FC<{ outgrant: Outgrant, onBack: () => void, onUpdate: (o: Outgrant) => void }> = ({ outgrant, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'General' | 'Inspections' | 'History'>('General');
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();

    const handleAction = (status: OutgrantStatus) => {
        startTransition(() => {
            onUpdate({ ...outgrant, status });
            addToast(`Record status updated to ${status}.`, 'info');
        });
    };

    const handleBill = () => {
        startTransition(() => {
            IntegrationOrchestrator.handleOutgrantBilling(outgrant);
            addToast('Reimbursable billing generated (FS 7600B equivalent).', 'success');
        });
    };

    return (
        <div className={`flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-4 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase">
                        <ArrowLeft size={16}/> Back to Queue
                    </button>
                    <div className="flex gap-2">
                        {outgrant.status === 'Proposed' && (
                            <button onClick={() => handleAction('Active')} className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg">Activate Grant</button>
                        )}
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${outgrant.status === 'Active' ? REMIS_THEME.classes.statusActive : REMIS_THEME.classes.badge.warning}`}>
                            {outgrant.status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl shadow-inner border border-emerald-100 shrink-0"><FileSignature size={32}/></div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{outgrant.grantee}</h2>
                            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-medium">
                                <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded border">{outgrant.id}</span>
                                <span>{outgrant.type} Authority</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm min-w-[250px]">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Annual Rent Revenue</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(outgrant.annualRent)}</span>
                            <button onClick={handleBill} className="p-1.5 hover:bg-zinc-50 rounded-lg text-emerald-600 transition-colors" title="Trigger Billing">
                                <Database size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <FileText size={18} className="text-zinc-400"/> Regulatory Data (Req 12.1.2)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1.5">Statutory Authority</p><p className="text-sm font-bold text-zinc-800">{outgrant.authority}</p></div>
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1.5">Permitted Land Use</p><p className="text-sm text-zinc-700 leading-relaxed">{outgrant.permittedUse}</p></div>
                            </div>
                            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-4">
                                <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/50">
                                    <span className="text-zinc-500">Effective Date</span>
                                    <span className="font-mono font-bold text-zinc-800">{outgrant.termStart}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/50">
                                    <span className="text-zinc-500">Term Expiration</span>
                                    <span className="font-mono font-bold text-rose-700">{outgrant.expirationDate}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-500">Payment Freq</span>
                                    <span className="font-bold text-zinc-800 uppercase">{outgrant.paymentFrequency}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutgrantDetail;