import React, { useState, useTransition } from 'react';
import { ShieldCheck, ShieldX, CheckCircle2, Activity, Play } from 'lucide-react';
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
                
                // Concurrent Update: Processing logic results
                startTransition(() => {
                    let allResults: RuleEvaluationResult[] = [];
                    MOCK_DIGITAL_THREADS.forEach(thread => {
                        const enrichedThread = {
                            ...thread,
                            amount: thread.obligationAmt,
                            invoiceDaysPending: thread.id === 'TR-10002' ? 45 : 10,
                            isCapitalAsset: thread.obligationAmt > 250000 && thread.appropriation.includes('2020'),
                            daysInactive: thread.id === 'TR-10002' ? 200 : 30
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
            return prev + 5;
        });
    }, 50);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full overflow-y-auto custom-scrollbar pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200 p-6 rounded-xl text-center shadow-sm">
               <ShieldCheck size={32} className="text-emerald-600 mx-auto mb-4" strokeWidth={1.5} />
               <h3 className="text-2xl font-bold text-zinc-900 mb-1">GOLD</h3>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">FIAR Readiness</p>
            </div>
            <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
               <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-widest mb-4 pb-2 border-b border-zinc-100">Audit Entities</h4>
               <div className="space-y-3">
                  {FIAR_CONTROLS.map(c => (
                     <div key={c.id} className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-500">{c.name}</span>
                        <span className={`text-[11px] font-bold font-mono ${c.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>{c.score}%</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-3 space-y-6">
            <div className={`bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
                    <div className="h-full bg-blue-600 transition-all duration-100 ease-out" style={{ width: `${scanProgress}%` }} />
                </div>
                
                <div className="flex items-center justify-between w-full mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900">FIAR Compliance Scrubber</h3>
                        <p className="text-xs text-zinc-500">Executing {MOCK_BUSINESS_RULES.length} policy validations.</p>
                    </div>
                    <button 
                        disabled={isScanning} 
                        onClick={runAuditScan} 
                        className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-800/50 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {isScanning ? <Activity className="animate-spin" size={14}/> : <Play size={14}/>}
                        {isScanning ? `Scanning ${scanProgress}%` : 'Initiate Full Scan'}
                    </button>
                </div>

                {scanResults.length > 0 && (
                    <div className="w-full space-y-2 max-h-60 overflow-y-auto custom-scrollbar border-t border-zinc-100 pt-4">
                        {scanResults.map((res, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-lg animate-in slide-in-from-bottom-1">
                                <ShieldX size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="text-xs font-bold text-rose-800">{res.ruleName}</span>
                                        <span className="text-[10px] font-mono text-rose-400">{res.ruleId}</span>
                                    </div>
                                    <p className="text-[11px] text-rose-700 mt-1">{res.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {!isScanning && scanResults.length === 0 && scanProgress === 100 && (
                    <div className="flex flex-col items-center justify-center py-4 text-emerald-600 animate-in fade-in">
                        <CheckCircle2 size={32} className="mb-2" />
                        <p className="text-sm font-bold">No Violations Found</p>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ComplianceView;