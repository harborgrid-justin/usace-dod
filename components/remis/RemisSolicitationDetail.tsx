import React, { useState } from 'react';
import { Solicitation, SolicitationStatus } from '../../types';
import { ArrowLeft, FileText, CheckCircle2, Hammer, Gavel, Users, Sparkles, TrendingUp, ShieldAlert, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import { generateMarketResearch } from '../../services/geminiService';
import MarketResearchModule from './MarketResearchModule';
import EvaluationModule from './EvaluationModule';

interface Props {
    solicitation: Solicitation;
    onBack: () => void;
    onUpdate: (solicitation: Solicitation) => void;
}

const STAGES: SolicitationStatus[] = ['Requirement Refinement', 'Market Research', 'Active Solicitation', 'Evaluating Quotes', 'Awarded'];

const RemisSolicitationDetail: React.FC<Props> = ({ solicitation, onBack, onUpdate }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAdvance = () => {
        const currentIdx = STAGES.indexOf(solicitation.status);
        if (currentIdx < STAGES.length - 1) {
            const nextStatus = STAGES[currentIdx + 1];
            onUpdate({ ...solicitation, status: nextStatus });
        }
    };

    const handleRunAI = async () => {
        setIsGenerating(true);
        const result = await generateMarketResearch(solicitation);
        onUpdate({ 
            ...solicitation, 
            marketResearch: {
                naicsCode: '541330',
                smallBusinessSetAside: true,
                estimatedMarketPrice: 1250000,
                competitors: ['V-NEX SOLUTIONS', 'DEFENSE LOGISTICS'],
                aiNarrative: result
            },
            status: 'Market Research'
        });
        setIsGenerating(false);
    };

    const sortedQuotes = solicitation.quotes ? [...solicitation.quotes].sort((a, b) => b.amount - a.amount) : [];
    
    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-4 overflow-hidden">
            <div className="bg-white border-b border-zinc-200 px-8 py-6 sticky top-0 z-20 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase w-fit transition-colors">
                        <ArrowLeft size={16}/> Back to Queue
                    </button>
                    <div className="flex gap-3">
                         {solicitation.status === 'Requirement Refinement' && (
                            <button onClick={handleRunAI} disabled={isGenerating} className="px-6 py-2.5 bg-rose-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-800 transition-all flex items-center gap-2 shadow-lg">
                                {isGenerating ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"/> : <Sparkles size={16}/>}
                                {isGenerating ? 'Synthesizing...' : 'Run Market AI'}
                            </button>
                        )}
                        {solicitation.status !== 'Awarded' && solicitation.status !== 'Requirement Refinement' && (
                            <button onClick={handleAdvance} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl transition-all">
                                Advance Protocol
                            </button>
                        )}
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border bg-zinc-100 text-zinc-600 border-zinc-200`}>
                            {solicitation.status}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="p-4 bg-zinc-900 text-white rounded-2xl shadow-xl shrink-0"><Hammer size={32}/></div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{solicitation.title}</h2>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-medium">
                            <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded border">{solicitation.id}</span>
                            <span>Type: {solicitation.type}</span>
                        </div>
                    </div>
                </div>

                <div className="relative flex justify-between items-center px-4 mt-4 -mb-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                    {STAGES.map((stage, i) => {
                        const activeIdx = STAGES.indexOf(solicitation.status);
                        const isComplete = i < activeIdx;
                        const isCurrent = i === activeIdx;
                        return (
                            <div key={stage} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isComplete ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : isCurrent ? 'bg-white border-zinc-900 text-zinc-900 shadow-md' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                                    {isComplete ? <CheckCircle2 size={16}/> : i + 1}
                                </div>
                                <span className={`text-[8px] font-bold uppercase text-center max-w-[80px] leading-tight ${isCurrent ? 'text-zinc-900' : 'text-zinc-400'}`}>{stage.split(' ')[0]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    {solicitation.marketResearch && (
                        <div className="animate-in slide-in-from-bottom-2">
                             <MarketResearchModule report={solicitation.marketResearch} status={solicitation.status} onAdvance={handleAdvance} />
                        </div>
                    )}
                    
                    {(solicitation.status === 'Evaluating Quotes' || solicitation.status === 'Ready for Award' || solicitation.status === 'Awarded') && (
                        <div className="animate-in slide-in-from-bottom-4">
                             <EvaluationModule sol={solicitation} status={solicitation.status} onAward={handleAdvance} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FileText size={20} className="text-zinc-400"/> Bid Item Breakdown
                            </h4>
                            <div className="space-y-3">
                                {solicitation.bidItems?.map(item => (
                                    <div key={item.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between items-center group hover:border-emerald-200 transition-all">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-800">{item.description}</p>
                                            <p className="text-[10px] text-zinc-400 font-mono mt-1">Ref ID: {item.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-mono font-bold text-zinc-900">{item.quantity} <span className="text-[10px] text-zinc-400 font-sans uppercase">{item.unit}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-[40px] p-8 shadow-sm h-fit">
                             <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-8 flex items-center gap-3"><History size={20} className="text-zinc-400"/> Procurement Timeline</h4>
                             <div className="relative pl-8 border-l border-zinc-100 space-y-8">
                                {solicitation.auditLog.map((log, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-white border-2 border-zinc-200 shadow-sm" />
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs font-bold text-zinc-900 uppercase">{log.action}</p>
                                                <span className="text-[10px] font-mono text-zinc-400">{log.timestamp.split('T')[0]}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 leading-relaxed italic">"{log.details || 'Standard system action.'}"</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2 flex items-center gap-1.5"><Users size={10}/> {log.user}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemisSolicitationDetail;