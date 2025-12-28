import React, { useState, useTransition, useMemo } from 'react';
import { ArrowLeft, Building2, Shuffle, DollarSign, Calendar, FileText, Link as LinkIcon, CheckCircle2, Edit, Trash2, ShieldCheck, Database, ArrowRight } from 'lucide-react';
import { DisposalAction } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';
import { remisService } from '../../services/RemisDataService';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import DisposalActionForm from './DisposalActionForm';
import { useToast } from '../shared/ToastContext';

const SCREENING_STAGES: DisposalAction['screeningStatus'][] = ['Submitted', 'DoD Screening', 'Federal Screening', 'Homeless Screening', 'Final'];

const ScreeningTimeline = React.memo(({ current }: { current: DisposalAction['screeningStatus'] }) => {
    const currentIdx = SCREENING_STAGES.indexOf(current);
    return (
        <div className="relative flex justify-between items-center px-4 py-8 max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
            {SCREENING_STAGES.map((stage, i) => {
                const isComplete = i < currentIdx;
                const isCurrent = i === currentIdx;
                return (
                    <div key={stage} className="flex flex-col items-center gap-2 bg-white px-3 z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            isComplete ? `bg-emerald-600 border-emerald-600 text-white shadow-lg` : 
                            isCurrent ? 'bg-white border-emerald-600 text-emerald-600 shadow-md scale-110' :
                            'bg-zinc-50 border-zinc-200 text-zinc-400'
                        }`}>
                            {isComplete ? <CheckCircle2 size={16}/> : i + 1}
                        </div>
                        <span className={`text-[8px] font-bold uppercase text-center max-w-[80px] leading-tight ${isCurrent ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
                            {stage.replace(' Screening', '')}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

export const DisposalActionDetail: React.FC<{ action: DisposalAction, onBack: () => void, onNavigateToAsset: (id: string) => void, onNavigateToSolicitation: (id: string) => void }> = ({ action, onBack, onNavigateToAsset, onNavigateToSolicitation }) => {
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'Execution' | 'Audit' | 'Compliance'>('Execution');

    const handleAdvance = () => {
        const currentIdx = SCREENING_STAGES.indexOf(action.screeningStatus);
        if (currentIdx >= SCREENING_STAGES.length - 1) return;
        
        const nextStatus = SCREENING_STAGES[currentIdx + 1];
        startTransition(() => {
            remisService.updateDisposal(action.id, { screeningStatus: nextStatus });
        });
        addToast(`GSA Screening Stage advanced to ${nextStatus}.`, 'success');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-2 overflow-hidden">
             {/* Sticky Header */}
             <div className="bg-white border-b border-zinc-200 px-8 py-8 flex flex-col gap-8 shrink-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-all">
                        <ArrowLeft size={16}/> Back to Registry
                    </button>
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(true)} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all shadow-sm"><Edit size={18}/></button>
                        <button className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-500 hover:text-rose-600 transition-all shadow-sm"><Trash2 size={18}/></button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-3xl ${REMIS_THEME.classes.iconContainer} text-emerald-700 shadow-inner border border-emerald-100 shrink-0`}><Shuffle size={32}/></div>
                        <div>
                            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none">{action.id}</h2>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-2">{action.type} Activity</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm min-w-[200px] text-center">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Projected Recovery</p>
                            <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(action.estimatedProceeds)}</p>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-5 shadow-xl min-w-[200px] text-center text-white">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Screening Status</p>
                            <p className="text-base font-bold text-emerald-400 uppercase tracking-tighter">{action.screeningStatus}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-6 border-t border-zinc-100">
                    <ScreeningTimeline current={action.screeningStatus} />
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm space-y-10">
                            <div className="flex justify-between items-center border-b border-zinc-50 pb-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-emerald-600"/> Authorization Workbench
                                </h4>
                                <button 
                                    onClick={handleAdvance} 
                                    disabled={isPending || action.screeningStatus === 'Final'}
                                    className={`px-8 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg ${REMIS_THEME.classes.buttonPrimary} disabled:opacity-50 active:scale-95`}
                                >
                                    {isPending ? 'Syncing...' : 'Advance Screening Stage'}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1.5">Asset Ref (RPUID)</p><button onClick={() => onNavigateToAsset(action.assetId)} className="text-sm font-bold text-emerald-800 hover:underline flex items-center gap-2">{action.assetId} <ArrowRight size={14}/></button></div>
                                    <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1.5">Excess Declaration Date</p><p className="text-sm font-mono font-bold text-zinc-800">{action.reportedExcessDate}</p></div>
                                </div>
                                <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 flex flex-col justify-center gap-4">
                                     <div className="flex items-center gap-3 text-zinc-500">
                                        <Database size={16}/>
                                        <span className="text-[10px] font-bold uppercase">Linked Solicitation</span>
                                     </div>
                                     <button onClick={() => onNavigateToSolicitation('SOL-9912')} className="w-full py-3 bg-white border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-emerald-300 transition-all flex items-center justify-center gap-2">
                                        <FileText size={14}/> View Public Sale RFP
                                     </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-zinc-900 text-white p-8 rounded-[40px] shadow-2xl flex flex-col justify-between relative overflow-hidden h-fit border border-zinc-800">
                                <DollarSign size={100} className="absolute -right-8 -bottom-8 opacity-5 rotate-12"/>
                                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                                    <Database size={16}/> Recovery Projections
                                </h4>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                                        <span className="text-zinc-400">Recovery Factor</span>
                                        <span className="font-bold text-white">Market Value</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">GSA Surcharge (2%)</span>
                                        <span className="font-mono text-zinc-300">-{formatCurrency(action.estimatedProceeds * 0.02)}</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t-2 border-white/10">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Net Recovery Estimate</p>
                                    <p className="text-4xl font-mono font-bold text-white tracking-tighter">{formatCurrency(action.estimatedProceeds * 0.98)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
             {isEditing && <DisposalActionForm onClose={() => setIsEditing(false)} onSubmit={() => setIsEditing(false)} initialData={action} />}
        </div>
    );
};
