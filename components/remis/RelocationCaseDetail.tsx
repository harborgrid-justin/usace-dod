import React, { useState, useTransition, useMemo } from 'react';
// Fix: Added missing Landmark icon to the imports
import { ArrowLeft, CheckCircle, Trash2, Link as LinkIcon, FileText, User, History, Landmark } from 'lucide-react';
import { RelocationCase, RelocationCaseStatus } from '../../types';
import BenefitManager from './BenefitManager';
import { formatRelativeTime } from '../../utils/formatting';

interface Props {
    caseData: RelocationCase;
    onBack: () => void;
    onUpdate: (c: RelocationCase) => void;
    onDelete: (id: string) => void;
    onNavigateToAddBenefit: () => void;
    onNavigateToAcquisition?: (id: string) => void;
}

const RelocationCaseDetail: React.FC<Props> = ({ caseData, onBack, onUpdate, onDelete, onNavigateToAddBenefit, onNavigateToAcquisition }) => {
    const [activeTab, setActiveTab] = useState<'Details' | 'Benefits' | 'History'>('Details');
    const [isPending, startTransition] = useTransition();
    const LIFECYCLE: RelocationCaseStatus[] = ['Initiated', 'Eligibility Determined', 'Assistance Approved', 'Assistance Provided', 'Closed'];
    const currentIdx = LIFECYCLE.indexOf(caseData.status);

    const handleUpdateStatus = (newStatus: RelocationCaseStatus) => {
        startTransition(() => {
            onUpdate({ 
                ...caseData, 
                status: newStatus,
                auditLog: [...caseData.auditLog, {
                    timestamp: new Date().toISOString(),
                    user: 'REMIS_MGR',
                    action: `Lifecycle Advanced to ${newStatus}`
                }]
            });
        });
    };

    return (
        <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-zinc-50 animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase">
                    <ArrowLeft size={14}/> Back to Queue
                </button>
                <div className="flex gap-2">
                    <button onClick={() => onDelete(caseData.id)} className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Archive Record">
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">{caseData.displacedPersonName}</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-mono font-bold text-zinc-400">ID: {caseData.id}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-300"/>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{caseData.displacedEntityType}</span>
                        </div>
                    </div>
                </div>

                <div className="relative flex justify-between items-center px-4 my-10">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                    {LIFECYCLE.map((stage, i) => {
                        const isComplete = i <= currentIdx;
                        return (
                            <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isComplete ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                                    {isComplete ? <CheckCircle size={16}/> : i + 1}
                                </div>
                                <span className={`text-[8px] font-bold uppercase text-center max-w-[80px] leading-tight ${i === currentIdx ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                    {stage.replace(' Determined','').replace(' Approved','').replace(' Provided','')}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {currentIdx < LIFECYCLE.length - 1 && (
                    <div className="flex justify-end pt-4 border-t border-zinc-100">
                        <button onClick={() => handleUpdateStatus(LIFECYCLE[currentIdx + 1])} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg">
                            Move to {LIFECYCLE[currentIdx + 1]}
                        </button>
                    </div>
                )}
            </div>

            <div className="border-b border-zinc-200 flex gap-8 px-2">
                {['Details', 'Benefits', 'History'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}>{tab}</button>
                ))}
            </div>

            <div className="flex-1">
                {activeTab === 'Details' && (
                    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Core Attributes</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-50">
                                        <span className="text-zinc-500">Eligibility Status</span>
                                        <span className={`font-bold uppercase ${caseData.eligibilityStatus === 'Eligible' ? 'text-emerald-600' : 'text-amber-600'}`}>{caseData.eligibilityStatus}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-50">
                                        <span className="text-zinc-500">Displacing Asset</span>
                                        <span className="font-mono font-bold text-zinc-800">{caseData.assetId}</span>
                                    </div>
                                </div>
                             </div>
                             <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col justify-center text-center">
                                <Landmark size={48} className="mx-auto text-zinc-300 mb-2"/>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Relocation Authority</p>
                                <p className="text-xs text-zinc-600 mt-2">Authorized under the Uniform Relocation Assistance and Real Property Acquisition Policies Act.</p>
                             </div>
                         </div>
                    </div>
                )}
                
                {activeTab === 'Benefits' && (
                    <div className="animate-in fade-in">
                        <BenefitManager caseData={caseData} onUpdate={onUpdate} onAddBenefitClick={onNavigateToAddBenefit} />
                    </div>
                )}

                {activeTab === 'History' && (
                    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm h-fit">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Fiduciary Audit Trail</h4>
                        <div className="space-y-4">
                            {caseData.auditLog.map((log, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                                    <div className="font-mono text-zinc-400 w-24 shrink-0">{formatRelativeTime(log.timestamp)}</div>
                                    <div className="flex-1">
                                        <span className="font-bold text-zinc-900 uppercase text-[10px] mr-2">{log.action}:</span> {log.details || 'System event recorded.'}
                                    </div>
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase">{log.user}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RelocationCaseDetail;