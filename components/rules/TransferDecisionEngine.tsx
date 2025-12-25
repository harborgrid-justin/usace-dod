
import React, { useState } from 'react';
import { 
    CheckCircle2, ArrowRight, ShieldCheck, 
    RotateCcw
} from 'lucide-react';

interface Question {
    id: string;
    text: string;
    description: string;
    yesNext?: string;
    noNext?: string;
    citation?: string;
}

const QUESTIONS: Record<string, Question> = {
    'q1': {
        id: 'q1',
        text: 'Does the action move funds between different appropriations?',
        description: 'For example, moving funds from O&M to Procurement, or RDTE to O&M.',
        yesNext: 'q2',
        noNext: 'r_reprogramming',
        citation: 'FMR Vol 3, Ch 3, Para 030102'
    },
    'q2': {
        id: 'q2',
        text: 'Is there a specific statutory authority for this transfer?',
        description: 'E.g., MilCon (10 USC 2803), Working Capital Fund (10 USC 2208).',
        yesNext: 'r_specific_authority',
        noNext: 'q3',
        citation: 'FMR Vol 3, Ch 3, Para 030201'
    },
    'q3': {
        id: 'q3',
        text: 'Is the requirement a higher priority than the source funds?',
        description: 'Funds must be taken from a lower priority program to support a higher priority need.',
        yesNext: 'q4',
        noNext: 'r_invalid_priority',
        citation: 'FMR Vol 3, Ch 3, Para 030202.A'
    },
    'q4': {
        id: 'q4',
        text: 'Was this specific item or program previously denied by Congress?',
        description: 'Transfer authority cannot be used to restore funds for items denied authorization.',
        yesNext: 'r_prohibited_denial',
        noNext: 'q5',
        citation: 'FMR Vol 3, Ch 3, Para 030202.B'
    },
    'q5': {
        id: 'q5',
        text: 'Does the cumulative value exceed the General Transfer Authority limit for the FY?',
        description: 'Check current FY limit (typically $4B - $6B) against total transfers to date.',
        yesNext: 'r_invalid_cap',
        noNext: 'r_gta_valid',
        citation: 'Annual DoD Appropriations Act'
    }
};

const RESULTS = {
    'r_reprogramming': {
        title: 'Reprogramming Action',
        type: 'info',
        desc: 'Movement within the same appropriation. Use DD 1415-3 (Internal Reprogramming) unless specific congressional special interest items are involved.'
    },
    'r_specific_authority': {
        title: 'Specific Statutory Transfer',
        type: 'success',
        desc: 'Proceed under the specific authority cited (e.g., 10 USC 2803 for Emergency MilCon). Verify specific limits for that statute.'
    },
    'r_invalid_priority': {
        title: 'Transfer Denied',
        type: 'error',
        desc: 'Transfers must be for higher priority items. The justification does not meet the "Higher Priority" test required by SecDef.'
    },
    'r_prohibited_denial': {
        title: 'Prohibited Transaction',
        type: 'error',
        desc: 'Funds cannot be used for items specifically denied by Congress. This is a potential Purpose Statute violation (31 USC 1301).'
    },
    'r_invalid_cap': {
        title: 'GTA Limit Exceeded',
        type: 'error',
        desc: 'General Transfer Authority (GTA) ceiling has been reached for the fiscal year. Additional transfers require specific legislative relief.'
    },
    'r_gta_valid': {
        title: 'General Transfer Authority (GTA)',
        type: 'success',
        desc: 'Valid candidate for GTA. Requires DD 1415-1 (Prior Approval Reprogramming), OMB Approval, and Congressional Notification (30 days).'
    }
};

const TransferDecisionEngine: React.FC = () => {
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
                            Transfer Authority Expert
                        </h3>
                        <p className="text-xs text-zinc-500">Vol 3, Chapter 3 • Reprogramming Determination</p>
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
                                    result.type === 'info' ? 'bg-blue-500' : 'bg-rose-500'
                                }`}>
                                    <CheckCircle2 size={16} />
                                </div>
                            </div>
                            <div className={`flex-1 p-6 rounded-xl border shadow-sm ${
                                result.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 
                                result.type === 'info' ? 'bg-blue-50 border-blue-100' : 'bg-rose-50 border-rose-100'
                            }`}>
                                <h4 className={`text-lg font-bold mb-2 ${
                                    result.type === 'success' ? 'text-emerald-800' : 
                                    result.type === 'info' ? 'text-blue-800' : 'text-rose-800'
                                }`}>{result.title}</h4>
                                <p className={`text-sm leading-relaxed ${
                                    result.type === 'success' ? 'text-emerald-700' : 
                                    result.type === 'info' ? 'text-blue-700' : 'text-rose-700'
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

export default TransferDecisionEngine;
