
import React, { useState } from 'react';
import { Terminal, Sparkles, Activity, Cpu } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getFinancialAdvice } from '../../services/geminiService';
import { MOCK_RISK_DISTRIBUTION, MOCK_DIGITAL_THREADS } from '../../constants';
import { RemoteData } from '../../types';

const AnalyticsView: React.FC = () => {
  // --- PHD LEVEL PATTERN: Finite State Machine for UI ---
  // Replaces separate [data, error, loading] booleans with a single truth source.
  const [analysisState, setAnalysisState] = useState<RemoteData<string>>({ status: 'IDLE' });

  const runG8Sentinel = async () => {
    setAnalysisState({ status: 'LOADING' });
    try {
      const advice = await getFinancialAdvice("Identify potential ADA violations in current PAA accounts.", { threads: MOCK_DIGITAL_THREADS });
      setAnalysisState({ status: 'SUCCESS', data: advice || "No critical threats detected." });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown system error";
      setAnalysisState({ status: 'FAILURE', error: new Error(errorMessage) });
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Sentinel Intelligence</h2>
        <button 
            onClick={runG8Sentinel} 
            disabled={analysisState.status === 'LOADING'} 
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium uppercase tracking-wide flex items-center gap-2 transition-all shadow-sm disabled:bg-zinc-300 disabled:cursor-not-allowed"
        >
          {analysisState.status === 'LOADING' ? <Activity size={14} className="animate-spin" /> : <Sparkles size={14}/>}
          {analysisState.status === 'LOADING' ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          {/* Terminal Window */}
          <div className="flex-1 bg-white rounded-xl border border-zinc-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden relative">
            <div className="h-10 bg-zinc-50 border-b border-zinc-100 flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-zinc-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Output.log</span>
              </div>
              <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-sm">
                {/* Pattern Matching on State */}
                {analysisState.status === 'LOADING' && (
                    <div className="space-y-3">
                        <div className="h-3 w-3/4 bg-zinc-100 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-zinc-100 rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-zinc-100 rounded animate-pulse" />
                    </div>
                )}
                {analysisState.status === 'SUCCESS' && (
                    <div className="text-zinc-700 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm animate-in fade-in">
                        {analysisState.data}
                    </div>
                )}
                {analysisState.status === 'FAILURE' && (
                    <div className="text-rose-600 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
                        <span className="font-bold">SYSTEM ERROR:</span> {analysisState.error.message}
                    </div>
                )}
                {analysisState.status === 'IDLE' && (
                    <div className="text-zinc-300 italic text-xs">Awaiting command...</div>
                )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-white p-6 rounded-xl border border-zinc-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Activity size={14} className="text-zinc-400" /> Risk Distribution
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={MOCK_RISK_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                      {MOCK_RISK_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#18181b' }} />
                 </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
             {/* Subtle mesh background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
            <Cpu size={24} className="mb-4 text-zinc-500" />
            <h4 className="text-lg font-medium tracking-tight mb-2">Predictive Burn</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">OMA accounts projected to reach 98% execution 4 days ahead of Q4 close.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all">Optimize</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
