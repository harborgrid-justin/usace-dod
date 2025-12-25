
import React, { useState } from 'react';
import { ShieldCheck, ShieldX, CheckCircle, CheckCircle2, Activity, Play } from 'lucide-react';
import { MOCK_DIGITAL_THREADS, FIAR_CONTROLS, MOCK_BUSINESS_RULES } from '../../constants';
import { NavigationTab, RuleEvaluationResult } from '../../types';
import { evaluateRules } from '../../utils/rulesEngine';

interface ComplianceViewProps {
  onSelectThread: (threadId: string) => void;
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ onSelectThread }) => {
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
                
                // Execute Rules against all threads
                let allResults: RuleEvaluationResult[] = [];
                MOCK_DIGITAL_THREADS.forEach(thread => {
                    // Inject mock properties if missing for certain rules (simulating richer data)
                    const enrichedThread = {
                        ...thread,
                        amount: thread.obligationAmt, // Map obligation amount for rules engine
                        invoiceDaysPending: thread.id === 'TR-10002' ? 45 : 10, // Force PPA failure on one
                        isCapitalAsset: thread.obligationAmt > 250000 && thread.appropriation.includes('2020') && (thread as any).objectClass === '3101' ? false : true,
                        daysInactive: thread.id === 'TR-10002' ? 200 : 30 // Force Dormant Account
                    };
                    const results = evaluateRules(MOCK_BUSINESS_RULES, enrichedThread);
                    // Add Thread Context to message
                    const contextResults = results.map(r => ({...r, message: `${r.message} [Thread: ${thread.id}]`}));
                    allResults = [...allResults, ...contextResults.filter(r => !r.passed)];
                });

                setScanResults(allResults);
                setIsScanning(false);
                return 100;
            }
            return prev + 5;
        });
    }, 50);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full overflow-y-auto custom-scrollbar pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         
         {/* FIAR Status Panel */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200 p-6 rounded-xl text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
               <ShieldCheck size={32} className="text-emerald-600 mx-auto mb-4" strokeWidth={1.5} />
               <h3 className="text-2xl font-bold text-zinc-900 mb-1">GOLD</h3>
               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">FIAR Readiness</p>
            </div>
            <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
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

         {/* CAPs and Automated Scan */}
         <div className="lg:col-span-3 space-y-6">
            
            {/* Scrubber Control */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
                    <div className="h-full bg-blue-600 transition-all duration-100 ease-out" style={{ width: `${scanProgress}%` }} />
                </div>
                
                <div className="flex items-center justify-between w-full mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900">FIAR Compliance Scrubber</h3>
                        <p className="text-xs text-zinc-500">Executes {MOCK_BUSINESS_RULES.length} validation rules against active ledgers.</p>
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

                {/* Scan Results */}
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

            {/* Existing Manual CAPs */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Manual Corrective Action Plans (CAP)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_DIGITAL_THREADS.filter(t => t.unmatchedDisb || t.auditFindingId !== 'AF-NONE').map(t => (
                    <button 
                        key={t.id} 
                        onClick={() => onSelectThread(t.id)}
                        className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-all text-left w-full group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldX size={16} className="text-amber-500 group-hover:text-amber-600" />
                            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide">{t.id}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium mb-3 uppercase tracking-wider">Domain: {t.fiarDomain}</p>
                        <div className="text-[11px] text-zinc-600 font-medium leading-relaxed">
                            Anomaly detected in transaction flow. UMD reconciliation required for {t.vendorName}.
                        </div>
                    </button>
                ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ComplianceView;
