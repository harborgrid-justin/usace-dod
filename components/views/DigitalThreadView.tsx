import React, { useState, useMemo, useTransition } from 'react';
import { Globe, GitMerge, Loader2 } from 'lucide-react';
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

  // Rule Evaluation: Pure derivation instead of Effect
  const ruleResults = useMemo(() => {
    if (!selectedThread) return [];
    const activeRules = MOCK_BUSINESS_RULES.filter(r => r.isActive);
    const results = evaluateRules(activeRules, selectedThread);
    return results.filter(r => !r.passed);
  }, [selectedThread]);

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 space-y-4 animate-in overflow-hidden">
      <ThreadControls 
        searchTerm={searchTerm} 
        setSearchTerm={handleSearchChange} 
        filteredThreads={filteredThreads} 
        selectedThreadId={selectedThreadId} 
        onSelect={setSelectedThreadId} 
      />
      {isPending && (
          <div className="absolute top-20 right-8 z-50 flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-400 bg-white/80 px-2 py-1 rounded-full border border-zinc-100">
              <Loader2 size={10} className="animate-spin" /> Reconciling...
          </div>
      )}

      {selectedThread ? (
        <div className={`flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-2 relative border border-zinc-200 rounded-xl bg-zinc-50/50 transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
           {selectedThread.contingencyOpId && (
              <button onClick={() => onSelectContingencyOp(selectedThread.contingencyOpId!)} className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all shadow-sm animate-in fade-in">
                <Globe size={12} /> Linked to {selectedThread.contingencyOpId}
              </button>
            )}
           <ThreadVisualizer thread={selectedThread} ruleResults={ruleResults} setActiveTab={setActiveTab} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2 border border-dashed border-zinc-200 rounded-xl">
           <GitMerge size={24} className="opacity-20" />
           <span className="text-xs font-medium">Select a thread to inspect data lineage.</span>
        </div>
      )}
    </div>
  );
};

export default DigitalThreadView;