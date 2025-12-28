
import React, { useState } from 'react';
import { ShieldCheck, ArrowRightLeft } from 'lucide-react';
import DecisionEngine from './DecisionEngine';
import TransferDecisionEngine from './TransferDecisionEngine';

const DecisionExpertArea: React.FC = () => {
    const [engine, setEngine] = useState<'projectOrder' | 'transfer'>('projectOrder');
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex gap-2 shrink-0">
                <button onClick={() => setEngine('projectOrder')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all ${engine === 'projectOrder' ? 'bg-zinc-900 text-white shadow-md' : 'bg-white text-zinc-500'}`}><ShieldCheck size={14} className="inline mr-2"/> Project Orders</button>
                <button onClick={() => setEngine('transfer')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all ${engine === 'transfer' ? 'bg-zinc-900 text-white shadow-md' : 'bg-white text-zinc-500'}`}><ArrowRightLeft size={14} className="inline mr-2"/> Transfers</button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
                {engine === 'projectOrder' ? <DecisionEngine /> : <TransferDecisionEngine />}
            </div>
        </div>
    );
};
export default DecisionExpertArea;
