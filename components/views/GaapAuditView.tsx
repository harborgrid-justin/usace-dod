import React, { useState, useTransition, useMemo, useCallback } from 'react';
import { 
  ClipboardCheck, Activity, Play, ShieldCheck, 
  Search, CheckCircle2, AlertTriangle, 
  FileText, History, ListChecks, Database
} from 'lucide-react';
import { MOCK_AUDIT_FINDINGS } from '../../constants';

interface GaapAuditViewProps {
  onSelectThread: (id: string) => void;
}

const GaapAuditView: React.FC<GaapAuditViewProps> = ({ onSelectThread }) => {
  const [isPending, startTransition] = useTransition();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const findings = useMemo(() => MOCK_AUDIT_FINDINGS, []);

  const runAuditScan = useCallback(() => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
        setScanProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                startTransition(() => {
                    setIsScanning(false);
                });
                return 100;
            }
            return prev + 5;
        });
    }, 100);
  }, [isScanning]);

  return (
    <div className="p-4 sm:p-8 animate-in fade-in space-y-8 h-full overflow-y-auto custom-scrollbar pb-12 bg-zinc-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
              <ClipboardCheck size={28} className="text-rose-700" /> GAAP Audit & FIAR Compliance
           </h2>
           <p className="text-xs text-zinc-500 font-medium mt-1">SFFAS Compliance Monitor • USSGL Integrity Scans</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Audit Cycle</span>
            <span className="text-sm font-bold text-zinc-900">FY 2024 Q2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-zinc-800">
               <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-8 flex items-center gap-2">
                  <Database size={16}/> SFFAS Real-Time Scan
               </h3>
               
               <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle className="text-zinc-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                          <circle className="text-emerald-500 transition-all duration-300 ease-out" strokeWidth="8" strokeDasharray={`${scanProgress * 2.51}, 251`} strokeDashoffset="0" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-white font-mono tracking-tighter">{scanProgress}%</span>
                      </div>
                  </div>
               </div>

               <button 
                  disabled={isScanning} 
                  onClick={runAuditScan} 
                  className="w-full py-3 bg-white text-zinc-900 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  {isScanning ? <Activity className="animate-spin" size={16}/> : <Play size={16} fill="currentColor"/>}
                  {isScanning ? 'Processing Blocks...' : 'Initiate GAAP Scan'}
               </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
               <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ListChecks size={16} className="text-zinc-400"/> Key Tie-Points
               </h3>
               <div className="space-y-4">
                  {[
                    { label: 'FBWT Reconciliation', value: '100%' },
                    { label: 'PP&E Asset Ledger', value: '98.2%' },
                    { label: 'Undelivered Orders', value: '100%' }
                  ].map((tp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                       <span className="text-xs font-semibold text-zinc-600">{tp.label}</span>
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">{tp.value}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className={`bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col flex-1 overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Active Audit Findings</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                    {findings.map(finding => (
                        <div key={finding.id} className="p-6 bg-white border border-zinc-100 rounded-3xl hover:border-rose-300 transition-all group shadow-sm flex gap-6">
                            <div className={`p-4 rounded-2xl shrink-0 h-fit ${finding.severity === 'Material Weakness' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border mb-2 inline-block ${finding.severity === 'Material Weakness' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{finding.severity}</span>
                                      <h4 className="text-sm font-bold text-zinc-900">{finding.description}</h4>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">{finding.id}</span>
                                </div>
                                <div className="mt-6 pt-4 border-t border-zinc-50 flex justify-between items-center">
                                    <button 
                                      onClick={() => onSelectThread(finding.linkedTransactionIds![0])} 
                                      className="text-[10px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-widest flex items-center gap-2"
                                    >
                                      <History size={12}/> View Transaction Trail
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GaapAuditView;