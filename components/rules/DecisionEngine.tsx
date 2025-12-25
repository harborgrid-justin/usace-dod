
import React, { useState } from 'react';
import { 
    CheckCircle2, XCircle, ArrowRight, ShieldCheck, 
    AlertTriangle, Building2, Hammer, Calendar, RotateCcw
} from 'lucide-react';

interface Question {
    id: string;
    text: string;
    description: string;
    yesNext?: string;
    noNext?: string;
    result?: 'Valid' | 'Invalid' | 'EconomyAct';
    citation?: string;
}

const QUESTIONS: Record<string, Question> = {
    'q1': {
        id: 'q1',
        text: 'Is the provider a DoD-owned establishment or the USCG?',
        description: 'Includes WCF activities, labs, depots, and arsenals. Contractor-operated facilities do not qualify.',
        yesNext: 'q2',
        noNext: 'r_invalid_provider',
        citation: 'FMR Vol 11A, Ch 2, Para 2.2'
    },
    'q2': {
        id: 'q2',
        text: 'Will the order be issued to a unit under the same activity commander?',
        description: 'An entity cannot enter into a formal contract with itself.',
        yesNext: 'r_same_commander',
        noNext: 'q3',
        citation: 'FMR Vol 11A, Ch 2, Para 5.2'
    },
    'q3': {
        id: 'q3',
        text: 'Is the work "Entire" (Non-Severable)?',
        description: 'Does it call for a single unified outcome or product where benefit is only received upon full completion?',
        yesNext: 'q4',
        noNext: 'r_economy_act',
        citation: 'FMR Vol 11A, Ch 2, Para 5.9'
    },
    'q4': {
        id: 'q4',
        text: 'Is the order Specific, Definite, and Certain?',
        description: 'Are specifications clear enough to be considered a valid obligation, similar to a commercial contract?',
        yesNext: 'q5',
        noNext: 'r_invalid_spec',
        citation: 'FMR Vol 11A, Ch 2, Para 5.6'
    },
    'q5': {
        id: 'q5',
        text: 'Will the provider incur at least 51% of costs in-house?',
        description: 'The performing activity must substantially perform the work using its own resources.',
        yesNext: 'q6',
        noNext: 'r_economy_act_sub',
        citation: 'FMR Vol 11A, Ch 2, Para 5.15'
    },
    'q6': {
        id: 'q6',
        text: 'Will work commence within a reasonable time (approx. 90 days)?',
        description: 'Work must begin without delay to satisfy the Bona Fide Need rule.',
        yesNext: 'r_valid',
        noNext: 'r_invalid_timing',
        citation: 'FMR Vol 11A, Ch 2, Para 5.10'
    }
};

const RESULTS = {
    'r_valid': {
        title: 'Authorized Project Order',
        type: 'success',
        desc: 'This requirement meets all criteria for a Project Order under 41 U.S.C. 6307. Funds are obligated upon acceptance and do not de-obligate at fiscal year-end.'
    },
    'r_invalid_provider': {
        title: 'Ineligible Provider',
        type: 'error',
        desc: 'Project Orders can only be issued to DoD-owned/operated establishments. Use a commercial contract or Economy Act order for other federal agencies.'
    },
    'r_same_commander': {
        title: 'Prohibited Transaction',
        type: 'error',
        desc: 'Orders between units under the same commander are internal allocations, not Project Orders.'
    },
    'r_economy_act': {
        title: 'Use Economy Act Order',
        type: 'warning',
        desc: 'Severable services must be funded via the Economy Act (31 U.S.C. 1535). Funds are subject to de-obligation if not performed by FY end.'
    },
    'r_economy_act_sub': {
        title: 'Use Economy Act Order',
        type: 'warning',
        desc: 'Since >49% of work is outsourced, this does not qualify as a Project Order. Use Economy Act authority to permit the agency to contract out the work.'
    },
    'r_invalid_spec': {
        title: 'Invalid Obligation',
        type: 'error',
        desc: 'The order lacks specificity. It cannot be recorded as a valid obligation under 31 U.S.C. 1501.'
    },
    'r_invalid_timing': {
        title: 'Bona Fide Need Violation',
        type: 'error',
        desc: 'Failure to commence work promptly indicates the need may not exist in the current fiscal year.'
    }
};

const DecisionEngine: React.FC = () => {
    const [history, setHistory] = useState<string[]>(['q1']);
    const [currentStepId, setCurrentStepId] = useState<string | null>('q1');

    const currentQuestion = currentStepId && QUESTIONS[currentStepId] ? QUESTIONS[currentStepId] : null;
    const resultKey = currentStepId && !QUESTIONS[currentStepId] ? currentStepId : null;
    const result = resultKey ? RESULTS[resultKey as keyof typeof RESULTS] : null;

    const handleAnswer = (nextId: string | undefined) => {
        if (nextId) {
            setHistory(prev => [...prev, nextId]);
            setCurrentStepId(nextId);
        }
    };

    const handleReset = () => {
        setHistory(['q1']);
        setCurrentStepId('q1');
    };

    return (
        <div className="h-full flex flex-col bg-zinc-50 rounded-xl overflow-hidden border border-zinc-200">
            <div className="p-6 border-b border-zinc-200 bg-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                            <ShieldCheck size={20} className="text-zinc-800" />
                            FMR Decision Expert
                        </h3>
                        <p className="text-xs text-zinc-500">Vol 11A, Chapter 2 • Project Order Determination</p>
                    </div>
                    <button 
                        onClick={handleReset}
                        className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors"
                        title="Reset Engine"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* History Trail */}
                    <div className="space-y-4">
                        {history.slice(0, history.length - 1).map((stepId, idx) => {
                            const q = QUESTIONS[stepId];
                            if (!q) return null;
                            const nextId = history[idx + 1];
                            const answer = q.yesNext === nextId ? 'Yes' : 'No';
                            
                            return (
                                <div key={stepId} className="flex gap-4 opacity-50">
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="w-0.5 flex-1 bg-zinc-200 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-sm font-medium text-zinc-700">{q.text}</p>
                                        <p className="text-xs font-bold text-zinc-900 mt-1">Answer: {answer}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Current Question */}
                    {currentQuestion && (
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                                    {history.length}
                                </div>
                            </div>
                            <div className="flex-1 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                                <h4 className="text-lg font-bold text-zinc-900 mb-2">{currentQuestion.text}</h4>
                                <p className="text-sm text-zinc-600 leading-relaxed mb-4">{currentQuestion.description}</p>
                                <div className="text-[10px] font-mono text-zinc-400 mb-6 bg-zinc-50 inline-block px-2 py-1 rounded">
                                    Ref: {currentQuestion.citation}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleAnswer(currentQuestion.yesNext)}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-bold uppercase transition-all shadow-sm"
                                    >
                                        Yes <ArrowRight size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleAnswer(currentQuestion.noNext)}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-sm font-bold uppercase transition-all"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="flex gap-4 animate-in zoom-in duration-300">
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                                    result.type === 'success' ? 'bg-emerald-500' : 
                                    result.type === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                                }`}>
                                    <CheckCircle2 size={16} />
                                </div>
                            </div>
                            <div className={`flex-1 p-6 rounded-xl border shadow-sm ${
                                result.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 
                                result.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
                            }`}>
                                <h4 className={`text-lg font-bold mb-2 ${
                                    result.type === 'success' ? 'text-emerald-800' : 
                                    result.type === 'warning' ? 'text-amber-800' : 'text-rose-800'
                                }`}>{result.title}</h4>
                                <p className={`text-sm leading-relaxed ${
                                    result.type === 'success' ? 'text-emerald-700' : 
                                    result.type === 'warning' ? 'text-amber-700' : 'text-rose-700'
                                }`}>{result.desc}</p>
                                
                                <button 
                                    onClick={handleReset}
                                    className="mt-6 text-xs font-bold uppercase tracking-wide underline opacity-60 hover:opacity-100"
                                >
                                    Start New Determination
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DecisionEngine;
