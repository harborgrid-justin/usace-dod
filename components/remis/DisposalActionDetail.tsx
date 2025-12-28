import React, { useState, useTransition, useMemo } from 'react';
import { ArrowLeft, Building2, Shuffle, DollarSign, Calendar, FileText, Link as LinkIcon, CheckCircle2, Edit, Trash2 } from 'lucide-react';
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
        <div className="relative flex justify-between items-center px-4 py-8">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
            {SCREENING_STAGES.map((stage, i) => {
                const isComplete = i <= currentIdx;
                return (
                    <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isComplete ? `bg-emerald-600 border-emerald-600 text-white shadow-lg` : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                            {isComplete ? <CheckCircle2 size={16}/> : i + 1}
                        </div>
                        <span className={`text-[8px] font-bold uppercase text-center max-w-[60px] leading-tight ${isComplete ? 'text-zinc-900' : 'text-zinc-400'}`}>
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
    const [activeTab, setActiveTab] = useState<'Screening' | 'Linked Records'>('Screening');

    const handleAdvance = () => {
        const currentIdx = SCREENING_STAGES.indexOf(action.screeningStatus);
        if (currentIdx >= SCREENING_STAGES.length - 1) return;
        
        const nextStatus = SCREENING_STAGES[currentIdx + 1];
        startTransition(() => {
            remisService.updateDisposal(action.id, { screeningStatus: nextStatus });
        });
        addToast(`Disposal moved to ${nextStatus}.`, 'info');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 p-6 animate-in slide-in-from-right-2">
             <div className="mb-6 flex justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-colors">
                    <ArrowLeft size={16}/> Back
                </button>
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(true)} className="p-2 text-zinc-400 hover:text-zinc-800"><Edit size={18}/></button>
                    <button className="p-2 text-zinc-400 hover:text-rose-600"><Trash2 size={18}/></button>
                </div>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${REMIS_THEME.classes.iconContainer} text-rose-600 shadow-inner`}><Shuffle size={32}/></div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{action.id}</h2>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mt-1">{action.type}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-zinc-100">
                    <ScreeningTimeline current={action.screeningStatus} />
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Screening Controls</h4>
                        <button 
                            onClick={handleAdvance} 
                            disabled={isPending || action.screeningStatus === 'Final'}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm ${REMIS_THEME.classes.buttonPrimary} disabled:opacity-50`}
                        >
                            {isPending ? 'Syncing...' : 'Advance Phase'}
                        </button>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-600 leading-relaxed">
                        Per GSA FMR requirements, all DoD excess real property must undergo a 30-day internal screening period prior to federal-wide exposure.
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between h-48 relative overflow-hidden">
                        <DollarSign size={80} className="absolute -right-4 -bottom-4 opacity-10"/>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Est. Proceeds</p>
                        <p className="text-3xl font-mono font-bold text-emerald-400">{formatCurrency(action.estimatedProceeds)}</p>
                    </div>
                </div>
             </div>
             {isEditing && <DisposalActionForm onClose={() => setIsEditing(false)} onSubmit={() => setIsEditing(false)} initialData={action} />}
        </div>
    );
};