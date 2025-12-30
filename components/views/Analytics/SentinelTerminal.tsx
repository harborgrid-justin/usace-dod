import React from 'react';
import { Terminal, Bot, Loader2, Zap, ShieldAlert } from 'lucide-react';
import { RemoteData } from '../../../types';

interface Props {
    state: RemoteData<string>;
    query: string;
    setQuery: (q: string) => void;
    onExecute: () => void;
}

const SentinelTerminal: React.FC<Props> = ({ state, query, setQuery, onExecute }) => (
    <div className="flex-1 bg-[#09090b] rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden relative">
        <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-6 justify-between shrink-0">
            <div className="flex items-center gap-3">
                <Terminal size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">SENTINEL.LOG</span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 font-mono">
            {state.status === 'LOADING' ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>
            ) : state.status === 'SUCCESS' ? (
                <div className="text-emerald-400 leading-relaxed whitespace-pre-wrap text-sm">{state.data}</div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-700 text-center space-y-6">
                    <Bot size={48} className="opacity-10" />
                    <p className="text-[11px] max-w-xs text-zinc-500">Query authoritative ledgers for strategic inference.</p>
                </div>
            )}
        </div>
        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <div className="bg-zinc-800 rounded-2xl p-2 flex items-center gap-3 border border-zinc-700">
                <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && onExecute()} className="flex-1 bg-transparent border-none text-white text-xs px-3 focus:outline-none font-mono" placeholder="Enter directive..." />
                <button onClick={onExecute} className="p-2.5 bg-emerald-500 rounded-xl"><Zap size={18} fill="currentColor" /></button>
            </div>
        </div>
    </div>
);
export default SentinelTerminal;