
import React, { useState } from 'react';
import { Solicitation, PurchaseRequest, SolicitationStatus, VendorQuote } from '../../../types';
import { Sparkles, Clock, CheckCircle2, Bot, ArrowRight, FileText, Gavel, Hammer } from 'lucide-react';
import { generateMarketResearch } from '../../../services/geminiService';
import MarketResearchModule from '../../acquisition/MarketResearchModule';
import EvaluationModule from '../../acquisition/EvaluationModule';
import { acquisitionService } from '../../../services/AcquisitionDataService';
import { useToast } from '../../shared/ToastContext';

const STAGES: SolicitationStatus[] = ['Requirement Refinement', 'Market Research', 'Active Solicitation', 'Evaluating Quotes', 'Ready for Award'];

const SolicitationWorkspace: React.FC<{ sol: Solicitation | null, pr: PurchaseRequest | null, onUpdate: (s: Solicitation) => void }> = ({ sol, pr, onUpdate }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { addToast } = useToast();
    
    if (!sol) return <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4">
        <Gavel size={48} className="opacity-10" /><p className="text-xs font-bold uppercase tracking-widest">Select Acquisition Record</p>
    </div>;

    const handleAdvance = (next: SolicitationStatus) => {
        acquisitionService.advanceSolicitation(sol.id, next, 'RE_SPECIALIST');
        addToast(`Solicitation advanced to ${next}.`, 'success');
    };

    const handleAIResearch = async () => {
        setIsGenerating(true);
        const report = await generateMarketResearch(sol);
        onUpdate({ 
            ...sol, 
            marketResearch: { 
                naicsCode: '541330', 
                smallBusinessSetAside: true, 
                estimatedMarketPrice: pr?.amount || 0, 
                competitors: ['V-NEX SOLUTIONS', 'DEFENSE LOGISTICS'], 
                aiNarrative: report 
            }, 
            status: 'Market Research' 
        });
        setIsGenerating(false);
        addToast('AI Market Research synthesized successfully.', 'success');
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 animate-in fade-in">
            <div className="flex justify-between items-start">
                <div><h3 className="text-2xl font-bold text-zinc-900 leading-tight">{sol.title}</h3><p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-widest">Requirement: {sol.prId}</p></div>
                <div className="flex gap-2">
                    {sol.status === 'Requirement Refinement' && (
                        <button onClick={handleAIResearch} disabled={isGenerating} className="px-6 py-2.5 bg-rose-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-800 shadow-xl flex items-center gap-2">
                            {isGenerating ? <Clock className="animate-spin" size={14}/> : <Sparkles size={14}/>} {isGenerating ? 'Analyzing...' : 'Execute AI Research'}
                        </button>
                    )}
                    {sol.status === 'Active Solicitation' && (
                        <button onClick={() => handleAdvance('Evaluating Quotes')} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl flex items-center gap-2">
                            <Clock size={14}/> Close Solicitation & Evaluate
                        </button>
                    )}
                </div>
            </div>

            <div className="relative flex justify-between items-center px-4 py-6 border border-zinc-100 bg-zinc-50/30 rounded-[32px] overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                {STAGES.map((s, i) => {
                    const isDone = i < STAGES.indexOf(sol.status);
                    const isCurr = i === STAGES.indexOf(sol.status);
                    return (<div key={s} className="flex flex-col items-center gap-2 z-10 bg-zinc-50/10 px-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-zinc-900 border-zinc-900 text-white' : isCurr ? 'bg-white border-rose-600 text-rose-700 shadow-lg scale-110' : 'bg-white border-zinc-200 text-zinc-300'}`}>{isDone ? <CheckCircle2 size={16}/> : i+1}</div><span className={`text-[8px] font-bold uppercase text-center max-w-[80px] leading-tight ${isCurr ? 'text-zinc-900' : 'text-zinc-400'}`}>{s.split(' ')[0]}</span></div>);
                })}
            </div>

            {sol.marketResearch && <MarketResearchModule report={sol.marketResearch} status={sol.status} onAdvance={() => handleAdvance('Active Solicitation')} />}
            {(sol.status === 'Evaluating Quotes' || sol.status === 'Ready for Award' || sol.status === 'Awarded') && (
                <EvaluationModule sol={sol} status={sol.status} onAward={(q) => handleAdvance('Awarded')} />
            )}
        </div>
    );
};

export default SolicitationWorkspace;
