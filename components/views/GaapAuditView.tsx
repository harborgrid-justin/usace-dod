
import React, { useState } from 'react';
import { ClipboardCheck, Activity, Play } from 'lucide-react';
import { MOCK_AUDIT_FINDINGS } from '../../constants';
import { NavigationTab } from '../../types';

interface GaapAuditViewProps {
  onSelectThread: (id: string) => void;
}

const GaapAuditView: React.FC<GaapAuditViewProps> = ({ onSelectThread }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const runAuditScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
        setScanProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                return 100;
            }
            return prev + 10;
        });
    }, 200);
  };

  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
  };

  return (
    <div className="p-4 sm:p-8 animate-in space-y-6 max-w-[1600px] mx-auto h-full overflow-y-auto custom-scrollbar pb-8">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
         <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-4 border-b border-zinc-100">
            <div className="p-3 w-fit bg-purple-50 text-purple-600 rounded-lg border border-purple-100"><ClipboardCheck size={20}/></div>
            <div>
               <h3 className="text-xl font-semibold text-zinc-900 uppercase tracking-tight">Audit Engine</h3>
               <p className="text-xs text-zinc-400 font-medium mt-1">SFFAS Compliance Scanner</p>
            </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Findings Matrix</h4>
                  <div className="space-y-3">
                      {MOCK_AUDIT_FINDINGS.map(finding => (
                          <div key={finding.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-lg hover:border-zinc-200 transition-colors">
                              <div className="flex justify-between items-start">
                                  <p className={`text-[10px] font-bold uppercase tracking-wide ${finding.severity === 'Material Weakness' ? 'text-rose-600' : 'text-amber-600'}`}>{finding.severity}</p>
                                  <span className="text-[10px] font-mono text-zinc-400">{finding.id}</span>
                              </div>
                              <p className="text-xs text-zinc-600 mt-2 font-medium">{finding.description}</p>
                              <div className="mt-3 pt-3 border-t border-zinc-200/50 flex justify-between items-center">
                                  <p className="text-[10px] text-zinc-400">Linked TX: 
                                      <button onClick={() => handleSelectThread(finding.linkedTransactionIds![0])} className="font-mono text-blue-600 ml-1 hover:underline">{finding.linkedTransactionIds![0]}</button>
                                  </p>
                                  <button className="text-[10px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-wide">View CAP</button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="bg-zinc-50/50 p-8 rounded-xl border border-zinc-100 flex flex-col justify-center items-center">
                  <div className="w-full text-center">
                      <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-tight mb-2">Compliance Scan</h4>
                      <p className="text-xs text-zinc-500 mb-8">Real-time validation of USSGL tie-points.</p>
                  </div>
                  <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-zinc-200" strokeWidth="6" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                          <circle className="text-zinc-800" strokeWidth="6" strokeDasharray={`${scanProgress * 2.83}, 283`} strokeDashoffset="0" strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{transition: 'stroke-dasharray 0.3s ease 0s'}} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tighter">{scanProgress}%</span>
                      </div>
                  </div>
                  <button disabled={isScanning} onClick={runAuditScan} className="mt-8 w-full max-w-xs py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-800/50 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 shadow-sm">
                     {isScanning ? <Activity className="animate-spin" size={14}/> : <Play size={14}/>}
                     {isScanning ? 'Scanning...' : 'Initiate Full Scan'}
                  </button>
              </div>
         </div>
      </div>
    </div>
  );
};

export default GaapAuditView;
