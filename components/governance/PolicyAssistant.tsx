import React from 'react';
import { Bot, Sparkles, Activity, ChevronRight } from 'lucide-react';

interface Props {
  response: string;
  query: string;
  setQuery: (q: string) => void;
  isLoading: boolean;
  onAsk: (e: React.FormEvent) => void;
  volumeName: string;
}

const PolicyAssistant: React.FC<Props> = ({ response, query, setQuery, isLoading, onAsk, volumeName }) => (
  <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col h-[450px] shrink-0 border border-zinc-800 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-10"><Bot size={100} /></div>
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={18} className="text-emerald-400" />
        <h4 className="text-sm font-bold uppercase tracking-widest">Policy Assistant</h4>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-6 space-y-4 pr-2">
          {response ? (
            <div className="bg-white/5 rounded-2xl p-4 text-xs leading-relaxed border border-white/10 text-zinc-200 animate-in fade-in">
              {response}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3 text-center px-4">
              <Bot size={32} className="opacity-20"/><p className="text-xs">Query the FMR Sentinel for strategic interpretations.</p>
            </div>
          )}
      </div>
      <form onSubmit={onAsk} className="relative">
          <input 
            type="text" value={query} onChange={(e) => setQuery(e.target.value)} 
            placeholder={`Query ${volumeName}...`} 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3.5 pl-4 pr-12 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all" 
          />
          <button type="submit" disabled={isLoading || !query} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white disabled:opacity-50">
            {isLoading ? <Activity size={18} className="animate-spin" /> : <ChevronRight size={18} />}
          </button>
      </form>
    </div>
  </div>
);
export default PolicyAssistant;