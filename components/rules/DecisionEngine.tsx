import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, RotateCcw } from 'lucide-react';
import { PO_QUESTIONS } from '../../constants/decision_trees';

const DecisionEngine: React.FC = () => {
    const [history, setHistory] = useState<string[]>(['q1']);
    const [currId, setCurrId] = useState<string | null>('q1');
    const q = currId ? (PO_QUESTIONS as any)[currId] : null;

    const handleAnswer = (next: string | undefined) => {
        if (next) { setHistory(prev => [...prev, next]); setCurrId(next); }
    };

    const reset = () => { setHistory(['q1']); setCurrId('q1'); };

    return (
        <div className="h-full flex flex-col bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden">
            <div className="p-6 border-b bg-white flex justify-between items-center">
                <div><h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2"><ShieldCheck size={20}/> FMR Decision Expert</h3><p className="text-xs text-zinc-500">Project Order Determination</p></div>
                <button onClick={reset} className="p-2 text-zinc-400 hover:text-zinc-800"><RotateCcw size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {q && (
                    <div className="bg-white p-6 rounded-xl border shadow-sm animate-in fade-in">
                        <h4 className="text-lg font-bold text-zinc-900 mb-2">{q.text}</h4>
                        <p className="text-sm text-zinc-600 mb-6">{q.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleAnswer(q.yesNext)} className="py-3 bg-zinc-900 text-white rounded-lg font-bold">Yes <ArrowRight size={14} className="inline"/></button>
                            <button onClick={() => handleAnswer(q.noNext)} className="py-3 bg-white border border-zinc-200 text-zinc-700 rounded-lg font-bold">No</button>
                        </div>
                    </div>
                )}
                {!q && currId && <div className="p-6 bg-emerald-50 border-emerald-100 rounded-xl text-center"><CheckCircle2 className="mx-auto mb-2 text-emerald-500"/><h4 className="font-bold">Determination Reached</h4><p className="text-sm">Final protocol defined as {currId}.</p><button onClick={reset} className="mt-4 text-xs font-bold uppercase underline">Reset</button></div>}
            </div>
        </div>
    );
};
export default DecisionEngine;