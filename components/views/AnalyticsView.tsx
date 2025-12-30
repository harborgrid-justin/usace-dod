
import React, { useState, useTransition } from 'react';
import { BrainCircuit, Search, Info, ShieldAlert } from 'lucide-react';
import { getFinancialAdvice, performDeepAudit } from '../../services/geminiService';
import { MOCK_DIGITAL_THREADS } from '../../constants';
import { RemoteData } from '../../types';
import SentinelTerminal from './Analytics/SentinelTerminal';
import ForensicScrubber from './Analytics/ForensicScrubber';

const AnalyticsView: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<RemoteData<string>>({ status: 'IDLE' });
  const [auditState, setAuditState] = useState<RemoteData<string>>({ status: 'IDLE' });
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState<'General' | 'Forensic'>('General');
  const [isPending, startTransition] = useTransition();

  const runG8Sentinel = async () => {
    setAnalysisState({ status: 'LOADING' });
    try {
      const advice = await getFinancialAdvice(query || "Identify potential ADA violations.", { 
        threads: MOCK_DIGITAL_THREADS 
      });
      startTransition(() => setAnalysisState({ status: 'SUCCESS', data: advice }));
    } catch (e: any) { setAnalysisState({ status: 'FAILURE', error: e }); }
  };

  const runDeepAudit = async () => {
    setAuditState({ status: 'LOADING' });
    try {
        const result = await performDeepAudit('Real Property', MOCK_DIGITAL_THREADS);
        startTransition(() => setAuditState({ status: 'SUCCESS', data: result }));
    } catch (e: any) { setAuditState({ status: 'FAILURE', error: e }); }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
            <BrainCircuit size={28} className="text-rose-700" /> Strategic Sentinel
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">Autonomous Financial Inference & Forensic Audit Engine</p>
        </div>
        <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner shrink-0">
            {['General', 'Forensic'].map(d => (
                <button 
                    key={d} 
                    onClick={() => setActiveDomain(d as any)} 
                    className={`px-6 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                        activeDomain === d ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                >
                    {d === 'General' ? 'Sentinel Directive' : 'Forensic Scrubber'}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden relative">
        {activeDomain === 'General' ? (
            <SentinelTerminal state={analysisState} query={query} setQuery={setQuery} onExecute={runG8Sentinel} />
        ) : (
            <ForensicScrubber state={auditState} onRun={runDeepAudit} />
        )}
      </div>
      
      <div className="flex items-center gap-6 px-4 py-2 bg-zinc-100/50 border border-zinc-200 rounded-xl shrink-0">
          <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              <Info size={12}/> Model: <span className="text-zinc-600">Gemini-3-Pro-Preview</span>
          </div>
          <div className="w-px h-3 bg-zinc-300" />
          <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              <ShieldAlert size={12}/> Guardrails: <span className="text-emerald-600">Active</span>
          </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
