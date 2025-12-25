
import React, { useState, useMemo, useEffect } from 'react';
import { Globe, GitMerge } from 'lucide-react';
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
  const [ruleResults, setRuleResults] = useState<RuleEvaluationResult[]>([]);
  
  const filteredThreads = useMemo(() => {
    if (!searchTerm) return MOCK_DIGITAL_THREADS;
    return MOCK_DIGITAL_THREADS.filter(t => Object.values(t).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm]);

  const selectedThread = useMemo(() => MOCK_DIGITAL_THREADS.find(t => t.id === selectedThreadId), [selectedThreadId]);

  useEffect(() => {
      if (selectedThread) {
          const activeRules = MOCK_BUSINESS_RULES.filter(r => r.isActive);
          const results = evaluateRules(activeRules, selectedThread);
          setRuleResults(results.filter(r => !r.passed));
      } else {
          setRuleResults([]);
      }
  }, [selectedThread]);

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 space-y-4 animate-in overflow-hidden">
      <ThreadControls 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        filteredThreads={filteredThreads} 
        selectedThreadId={selectedThreadId} 
        onSelect={setSelectedThreadId} 
      />

      {selectedThread ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-2 relative border border-zinc-200 rounded-xl bg-zinc-50/50">
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
