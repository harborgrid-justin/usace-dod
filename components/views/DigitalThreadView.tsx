
import React, { useState, useMemo, useTransition } from 'react';
import { Globe, GitMerge, Loader2, Info } from 'lucide-react';
import { MOCK_DIGITAL_THREADS, MOCK_BUSINESS_RULES } from '../../constants';
import { NavigationTab, RuleEvaluationResult } from '../../types';
import { evaluateRules } from '../../utils/rulesEngine';
import ThreadControls from '../digital_thread/ThreadControls';
import ThreadVisualizer from '../digital_thread/ThreadVisualizer';

interface DigitalThreadViewProps {
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;
  setActiveTab: (tab: NavigationTab) => void;
  onSelectContingencyOp: (id: string) => void;
}

const DigitalThreadView: React.FC<DigitalThreadViewProps> = ({ selectedThreadId, setSelectedThreadId, setActiveTab, onSelectContingencyOp }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    startTransition(() => {
        setDeferredSearchTerm(term);
    });
  };

  const filteredThreads = useMemo(() => {
    if (!deferredSearchTerm) return MOCK_DIGITAL_THREADS;
    return MOCK_DIGITAL_THREADS.filter(t => 
      Object.values(t).some(val => String(val).toLowerCase().includes(deferredSearchTerm.toLowerCase()))
    );
  }, [deferredSearchTerm]);

  const selectedThread = useMemo(() => 
    MOCK_DIGITAL_THREADS.find(t => t.id === selectedThreadId), 
  [selectedThreadId]);

  const ruleResults = useMemo(() => {
    if (!selectedThread) return [];
    const activeRules = MOCK_BUSINESS_RULES.filter(r => r.isActive);
    const results = evaluateRules(activeRules, selectedThread);
    return results.filter(r => !r.passed);
  }, [selectedThread]);

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 space-y-6 animate-in overflow-hidden bg-zinc-50/50">
      <div className="shrink-0">
          <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
              <GitMerge size={28} className="text-rose-700" /> Fiduciary Digital Thread
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">Cross-Module Data Lineage & Cryptographic Traceability</p>
      </div>

      <ThreadControls 
        searchTerm={searchTerm} 
        setSearchTerm={handleSearchChange} 
        filteredThreads={filteredThreads} 
        selectedThreadId={selectedThreadId} 
        onSelect={setSelectedThreadId} 
      />

      <div className={`flex-1 min-h-0 overflow-hidden relative border border-zinc-200 rounded-[32px] bg-white shadow-sm transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
        {selectedThread ? (
          <>
            <div className="absolute top-4 right-6 z-20 flex items-center gap-3">
               {selectedThread.contingencyOpId && (
                  <button onClick={() => onSelectContingencyOp(selectedThread.contingencyOpId!)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all shadow-sm">
                    <Globe size={12} /> Mission: {selectedThread.contingencyOpId}
                  </button>
                )}
                {isPending && (
                    <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-zinc-400 bg-white/80 px-2 py-1 rounded-full border border-zinc-100 shadow-sm backdrop-blur-sm">
                        <Loader2 size={10} className="animate-spin" /> Syncing Blockchain...
                    </div>
                )}
            </div>
            <div className="h-full w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
                <ThreadVisualizer thread={selectedThread} ruleResults={ruleResults} setActiveTab={setActiveTab} />
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4 animate-in fade-in">
             <div className="p-8 bg-zinc-50 rounded-full border-2 border-dashed border-zinc-100">
                <GitMerge size={48} className="opacity-10" />
             </div>
             <div className="text-center space-y-1">
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Trace Workspace Idle</p>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">Select an authoritative thread ID from the tray to inspect life-of-funds lineage.</p>
             </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6 px-4 py-2 bg-zinc-900 text-white rounded-xl shrink-0 border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Node: <span className="text-white">AUTH_LRL_01</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-auto">
              <Info size={12} className="text-zinc-600"/> Persistence: <span className="text-emerald-400">Validated</span>
          </div>
      </div>
    </div>
  );
};

export default DigitalThreadView;
