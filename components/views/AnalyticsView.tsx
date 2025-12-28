import React, { useState, useMemo, useTransition } from 'react';
import { 
  Terminal, Activity, Bot, 
  TrendingUp, ShieldAlert, Zap, ArrowUpRight, BrainCircuit, Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip 
} from 'recharts';
import { getFinancialAdvice } from '../../services/geminiService';
import { MOCK_RISK_DISTRIBUTION, MOCK_DIGITAL_THREADS, MOCK_EXECUTION_DATA } from '../../constants';
import { RemoteData } from '../../types';

const AnalyticsView: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<RemoteData<string>>({ status: 'IDLE' });
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const runG8Sentinel = async (overrideQuery?: string) => {
    const activeQuery = overrideQuery || query || "Identify potential ADA violations in current PAA accounts.";
    setAnalysisState({ status: 'LOADING' });
    try {
      const advice = await getFinancialAdvice(activeQuery, { threads: MOCK_DIGITAL_THREADS, execution: MOCK_EXECUTION_DATA });
      startTransition(() => {
        setAnalysisState({ status: 'SUCCESS', data: advice || "No critical threats detected." });
      });
    } catch (e: any) {
      setAnalysisState({ status: 'FAILURE', error: e });
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in h-full flex flex-col bg-zinc-50 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shrink-0">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tighter flex items-center gap-3">
            <BrainCircuit size={32} className="text-zinc-900" /> Strategic Sentinel
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Multi-Ledger Anomaly Detection System</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-xl border border-zinc-800 shadow-xl">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
           <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Engine: Gemini 3.1 Flash</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-[#09090b] rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden relative group">
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
            
            <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-6 justify-between shrink-0 z-20">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">D-AFMP_SENTINEL.LOG</span>
              </div>
              <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 font-mono relative z-20">
                {analysisState.status === 'LOADING' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 size={32} className="animate-spin text-emerald-500" />
                        <span className="text-xs uppercase tracking-widest font-bold text-emerald-500/80">Querying Authoritative Ledgers...</span>
                    </div>
                )}
                {analysisState.status === 'SUCCESS' && (
                    <div className={`text-emerald-400 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm animate-in fade-in selection:bg-emerald-500 selection:text-zinc-900 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                        <span className="text-zinc-600 block mb-6 border-b border-zinc-800 pb-2 text-[10px] font-bold uppercase tracking-widest">Analysis Results (Verified)</span>
                        {analysisState.data}
                        <span className="inline-block w-2 h-4 bg-emerald-500 animate-pulse ml-1 align-middle" />
                    </div>
                )}
                {analysisState.status === 'FAILURE' && (
                    <div className="text-rose-500 leading-relaxed text-xs">
                        <span className="font-bold uppercase flex items-center gap-2 mb-4 border-b border-rose-950 pb-2"><ShieldAlert size={14}/> Critical Failure</span>
                        {analysisState.error?.message || "Connection terminated by endpoint."}
                    </div>
                )}
                {analysisState.status === 'IDLE' && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-700 text-center space-y-6">
                        <Bot size={48} className="opacity-10" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Sentinel Terminal Standby</p>
                          <p className="text-[11px] max-w-xs text-zinc-500 leading-relaxed">Integrated with Army Core Ledgers. Enter a strategic request below to initiate inference.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0 z-20">
               <div className="bg-zinc-800 rounded-2xl p-2 flex items-center gap-3 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all border border-zinc-700">
                  <input 
                    type="text" 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="E.g. Analyze PAA burn variance for 1st Brigade..."
                    className="flex-1 bg-transparent border-none text-white text-xs px-3 focus:outline-none placeholder:text-zinc-600 font-mono"
                    onKeyDown={e => e.key === 'Enter' && runG8Sentinel()}
                  />
                  <button 
                    onClick={() => runG8Sentinel()}
                    disabled={analysisState.status === 'LOADING'}
                    className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 rounded-xl transition-all shadow-lg disabled:opacity-50"
                  >
                    <Zap size={18} fill="currentColor" />
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col h-[300px]">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-600" /> Exposure Risk Score
            </h4>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={MOCK_RISK_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                      {MOCK_RISK_DISTRIBUTION.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                 </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
               <TrendingUp size={14} className="text-emerald-600" /> Inferred Directives
            </h4>
            <div className="space-y-2">
               {[
                 { label: 'Optimize PAA Burn', icon: Zap },
                 { label: 'Audit Readiness Scan', icon: ShieldAlert }
               ].map((op, i) => (
                 <button 
                  key={i} 
                  onClick={() => runG8Sentinel(`Analyze directive: ${op.label}`)}
                  className="w-full text-left p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-2xl transition-all group flex justify-between items-center"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-zinc-100 group-hover:text-rose-700 transition-colors"><op.icon size={14}/></div>
                        <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-tight">{op.label}</span>
                    </div>
                    <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-600 transition-all" />
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;