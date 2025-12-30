
import React, { useState, useTransition } from 'react';
import { ShieldCheck, ShieldX, CheckCircle2, Activity, Play, ListChecks, Database } from 'lucide-react';
import { MOCK_DIGITAL_THREADS, FIAR_CONTROLS, MOCK_BUSINESS_RULES } from '../../constants';
import { RuleEvaluationResult } from '../../types';
import { evaluateRules } from '../../utils/rulesEngine';

interface ComplianceViewProps {
  onSelectThread: (threadId: string) => void;
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ onSelectThread }) => {
  const [isPending, startTransition] = useTransition();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<RuleEvaluationResult[]>([]);

  const runAuditScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);

    const interval = setInterval(() => {
        setScanProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                startTransition(() => {
                    let allResults: RuleEvaluationResult[] = [];
                    MOCK_DIGITAL_THREADS.forEach(thread => {
                        const enrichedThread = {
                            ...thread,
                            amount: thread.obligationAmt,
                            invoiceDaysPending: thread.id === 'TR-10002' ? 45 : 10,
                        };
                        const results = evaluateRules(MOCK_BUSINESS_RULES, enrichedThread);
                        const contextResults = results.map(r => ({...r, message: `${r.message} [Thread: ${thread.id}]`}));
                        allResults = [...allResults, ...contextResults.filter(r => !r.passed)];
                    });
                    setScanResults(allResults);
                    setIsScanning(false);
                });
                return 100;
            }
            return prev + 10;
        });
    }, 100);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/30 overflow-hidden">
      <div className="shrink-0">
          <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
              <ShieldCheck size={28} className="text-emerald-700" /> FIAR Compliance Center
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">Real-time Statutory Policy Enforcement (Vol 1, Ch 3)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
         <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="bg-white border border-zinc-200 p-8 rounded-[32px] text-center shadow-sm">
               <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto mb-4 border border-emerald-100 shadow-inner">
                  <ShieldCheck size={40} strokeWidth={1.5} />
               </div>
               <h3 className="text-3xl font-black text-zinc-900 mb-1">GOLD</h3>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Aggregate Readiness Tier</p>
            </div>

            <div className="bg-white border border-zinc-200 p-6 rounded-[32px] shadow-sm">
               <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <ListChecks size={16} className="text-zinc-400"/> Key Internal Controls
               </h4>
               <div className="space-y-4">
                  {FIAR_CONTROLS.map(c => (
                     <div key={c.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-tight">{c.name}</span>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs font-mono font-bold ${c.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>{c.score}%</span>
                            <div className={`w-2 h-2 rounded-full ${c.status === 'PASS' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 flex flex-col min-h-0">
            <div className={`bg-white border border-zinc-200 rounded-[32px] shadow-sm flex flex-col h-full overflow-hidden transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Policy Scrubber Directive</h3>
                        <p className="text-[10px] text-zinc-400 font-medium mt-1">Executing {MOCK_BUSINESS_RULES.length} authoritative logic checks.</p>
                    </div>
                    <button 
                        disabled={isScanning} 
                        onClick={runAuditScan} 
                        className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                        {isScanning ? <Activity className="animate-spin" size={14}/> : <Play size={14} fill="currentColor"/>}
                        {isScanning ? `Processing ${scanProgress}%` : 'Initiate Enterprise Scan'}
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {isScanning ? (
                        <div className="flex flex-col items-center justify-center h-full gap-6 text-zinc-300">
                             <Database size={64} className="animate-pulse opacity-10" />
                             <div className="w-64 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                             </div>
                        </div>
                    ) : scanResults.length > 0 ? (
                        <div className="space-y-3">
                            {scanResults.map((res, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-5 bg-rose-50/30 border border-rose-100 rounded-2xl animate-in slide-in-from-bottom-2 group cursor-pointer hover:border-rose-300 transition-all">
                                    <div className="p-2 bg-white rounded-xl shadow-sm text-rose-600 border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                        <ShieldX size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-black text-rose-800 uppercase tracking-tight">{res.ruleName}</span>
                                            <span className="text-[10px] font-mono text-rose-400 font-bold">{res.ruleId}</span>
                                        </div>
                                        <p className="text-xs text-rose-700 mt-1 leading-relaxed font-medium">{res.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : scanProgress === 100 ? (
                        <div className="flex flex-col items-center justify-center h-full text-emerald-600 animate-in zoom-in">
                            <div className="p-6 bg-emerald-50 rounded-full border-2 border-emerald-100 mb-4">
                                <CheckCircle2 size={48} strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-black uppercase tracking-tight">Full Compliance Verified</h4>
                            <p className="text-xs text-zinc-500 mt-2 font-medium">Authoritative ledger state matches all active business rules.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-300 gap-4 grayscale opacity-40">
                             <ShieldCheck size={80} strokeWidth={1} />
                             <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Scanner Ready</p>
                        </div>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ComplianceView;
