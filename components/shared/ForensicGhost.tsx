
import React from 'react';
import { Info, Database, ShieldCheck, History } from 'lucide-react';

interface Props {
  code: string;
  source: string;
  status: string;
  timestamp: string;
}

const ForensicGhost: React.FC<Props> = ({ code, source, status, timestamp }) => {
  return (
    <div className="absolute z-50 bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 w-64 animate-in zoom-in duration-200 pointer-events-none">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Database size={14}/></div>
            <span className="text-[10px] font-mono font-bold tracking-widest">{code}</span>
        </div>
        <div className="space-y-2.5">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                <span className="text-zinc-500">Origin Source</span>
                <span className="text-zinc-300">{source}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                <span className="text-zinc-500">Fiduciary State</span>
                <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck size={8}/> {status}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                <span className="text-zinc-500">Atomic Sync</span>
                <span className="text-zinc-400 flex items-center gap-1"><History size={8}/> {timestamp}</span>
            </div>
        </div>
        <div className="absolute -bottom-1 left-6 w-2 h-2 bg-zinc-900 rotate-45 border-r border-b border-white/10" />
    </div>
  );
};

export default ForensicGhost;
