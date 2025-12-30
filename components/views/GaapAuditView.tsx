
import React, { useState, useTransition, useMemo, useCallback } from 'react';
import { 
  ClipboardCheck, Activity, Play, ShieldCheck, 
  Search, CheckCircle2, AlertTriangle, 
  FileText, History, ListChecks, Database, Landmark
} from 'lucide-react';
import { MOCK_AUDIT_FINDINGS, REMIS_THEME } from '../../constants';
import Badge from '../shared/Badge';

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
            return prev + 10;
        });
    }, 150);
  }, [isScanning]);

  return (
    <div className="p-4 sm:p-8 animate-in fade-in space-y-6 h-full flex flex-col bg-zinc-50/50 overflow-hidden">
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
           <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
              <ClipboardCheck size={28} className="text-rose-700" /> GAAP Audit & FIAR
           </h2>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">SFFAS Compliance Monitor • Real-Time Integrity Scans</p>
        </div>
        <div className="bg-white px-5 py-2 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Audit Cycle:</span>
            <span className="text-xs font-bold text-zinc-900 uppercase">FY 2024 Q2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
         <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="bg-zinc-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-zinc-800">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-8 flex items-center gap-3 relative z-10">
                  <Database size={16}/> SFFAS Real-Time Scan
               </h3>
               
               <div className="flex flex-col items-center justify-center py-10 relative z-10">
                  <div className="relative w-36 h-36">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle className="text-zinc-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                          <circle className="text-emerald-500 transition-all duration-300 ease-out" strokeWidth="6" strokeDasharray={`${scanProgress * 2.82}, 282`} strokeDashoffset="0" strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-white font-mono tracking-tighter tabular-nums">{scanProgress}%</span>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Verified</span>
                      </div>
                  </div>
               </div>

               <button 
                  disabled={isScanning} 
                  onClick={runAuditScan} 
                  className="w-full py-4 bg-white text-zinc-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-xl relative z-10"
               >
                  {isScanning ? <Activity className="animate-spin" size={16}/> : <Play size={16} fill="currentColor"/>}
                  {isScanning ? 'Processing Blocks...' : 'Initiate Scan'}
               </button>
               
               {/* Added missing Landmark import */}
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12"><Landmark size={180}/></div>
            </div>

            <div className="bg-white border border-zinc-200 p-6 rounded-[32px] shadow-sm">
               <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <ListChecks size={16} className="text-zinc-400"/> Critical Tie-Points
               </h3>
               <div className="space-y-3">
                  {[
                    { label: 'FBWT Reconciliation', value: '100%', status: 'Balanced' },
                    { label: 'PP&E Asset Ledger', value: '98.2%', status: 'Findings' },
                    { label: 'Undelivered Orders', value: '100%', status: 'Balanced' }
                  ].map((tp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-emerald-200 transition-all">
                       <div>
                           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">{tp.label}</span>
                           <p className="text-[8px] font-bold text-zinc-400 mt-0.5 uppercase">{tp.status}</p>
                       </div>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded border font-mono ${tp.value === '100%' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{tp.value}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 flex flex-col min-h-0">
            <div className={`bg-white border border-zinc-200 rounded-[40px] shadow-sm flex flex-col h-full overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
                    <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em]">Active Audit Findings (FY24)</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" />
                            <input className="pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[10px] w-48 outline-none" placeholder="Search finding ID..." />
                        </div>
                        <Badge variant="warning">{findings.length} Anomalies</Badge>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                    {findings.map(finding => (
                        <div key={finding.id} className="p-8 bg-white border border-zinc-100 rounded-[32px] hover:border-rose-300 hover:shadow-xl transition-all group shadow-sm flex flex-col sm:flex-row gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all pointer-events-none">
                                <ShieldCheck size={100} className="text-rose-700" />
                            </div>
                            
                            <div className={`p-5 rounded-2xl shrink-0 h-fit ${finding.severity === 'Material Weakness' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                <AlertTriangle size={28} />
                            </div>
                            
                            <div className="flex-1 relative z-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                                    <div>
                                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border mb-3 inline-block shadow-sm ${finding.severity === 'Material Weakness' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{finding.severity}</span>
                                      <h4 className="text-lg font-bold text-zinc-900 tracking-tight leading-snug group-hover:text-rose-800 transition-colors">{finding.description}</h4>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2.5 py-1.5 rounded-xl border border-zinc-100 shadow-inner shrink-0">{finding.id}</span>
                                </div>
                                <div className="mt-8 pt-6 border-t border-zinc-50 flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button 
                                          onClick={() => onSelectThread(finding.linkedTransactionIds![0])} 
                                          className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest flex items-center gap-2 transition-colors py-2"
                                        >
                                          <History size={14}/> View Forensic Trail
                                        </button>
                                        <button className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest flex items-center gap-2 transition-colors py-2">
                                          <FileText size={14}/> Evidence Folder
                                        </button>
                                    </div>
                                    <button className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                                        Initiate Remediation
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {findings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
                             <CheckCircle2 size={64} strokeWidth={1} className="opacity-10 mb-4" />
                             <p className="text-xs font-bold uppercase tracking-[0.2em]">Audit State: CLEAR</p>
                        </div>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GaapAuditView;
