
import React, { useState, useTransition, useCallback } from 'react';
import { Terminal, Database, ShieldCheck, RefreshCcw, Clock, Zap, Activity } from 'lucide-react';
import SpendingChain from '../erp/SpendingChain';
import TCodeList from '../erp/TCodeList';
import ERPModuleGrid from './ERP/ERPModuleGrid';
import IdocMonitor from '../erp/IdocMonitor';
import ModuleHUD from '../shared/ModuleHUD';
import BatchJobMonitor from '../erp/BatchJobMonitor';
import FiduciaryBadge from '../shared/FiduciaryBadge';
import { REMIS_THEME } from '../../constants/theme';

interface Props {
  onSelectThread: (id: string) => void;
  agency?: string;
}

const ERPView: React.FC<Props> = ({ onSelectThread }) => {
  const [cmd, setCmd] = useState('');
  const [activeMod, setActiveMod] = useState('FI');
  const [isPending, startTransition] = useTransition();

  const handleTCodeSelect = useCallback((code: string) => {
    setCmd(code);
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in h-full flex flex-col bg-zinc-50/50 overflow-hidden">
      
      <ModuleHUD 
        title="Authoritative ERP Shell" 
        subtitle="GFEBS S/4 HANA PROD" 
        icon={Terminal}
        onSearch={setCmd}
        actions={
            <button className="p-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl transition-all shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] active:scale-90 flex items-center justify-center">
                <Zap size={20} fill="currentColor"/>
            </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-0 flex-1 overflow-hidden">
        {/* Core Matrix Column */}
        <div className="lg:col-span-8 flex flex-col gap-10 overflow-y-auto custom-scrollbar pr-2 pb-12">
            <section className="space-y-6">
                <div className="flex justify-between items-center px-4">
                    <h3 className={REMIS_THEME.enterprise.label}>Integrated Functional Matrix</h3>
                    <FiduciaryBadge variant="dark" icon>SFFAS COMPLIANT</FiduciaryBadge>
                </div>
                <ERPModuleGrid activeModule={activeMod} onSelect={setActiveMod} />
            </section>
            
            <section className="space-y-6">
                <h3 className={REMIS_THEME.enterprise.label}>Execution Chain Traceability</h3>
                <SpendingChain onSelectThread={onSelectThread} />
            </section>

            <section className="space-y-6">
                <h3 className={REMIS_THEME.enterprise.label}>Authoritative Transaction Index</h3>
                <TCodeList activeModule={activeMod} onSelectCommand={handleTCodeSelect} />
            </section>
        </div>

        {/* Global Control Column */}
        <div className="lg:col-span-4 flex flex-col gap-8 min-h-0">
           <div className="bg-zinc-900 text-white p-10 rounded-[48px] shadow-3xl border border-zinc-800 relative overflow-hidden shrink-0 group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-all duration-1000"><ShieldCheck size={180} /></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-zinc-500">Posting Period Registry</h3>
                    <FiduciaryBadge variant="pulse">SYNC ACTIVE</FiduciaryBadge>
                </div>
                
                <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] mb-10 group-hover:border-emerald-500/30 transition-all shadow-inner">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Active Fiscal Cycle</p>
                        <FiduciaryBadge variant="emerald">PERIOD OPEN</FiduciaryBadge>
                    </div>
                    <p className="text-4xl font-mono font-bold text-white tracking-tighter tabular-nums">05 / 2024</p>
                    <p className="text-[10px] text-zinc-500 mt-5 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} className="text-zinc-600"/> Automated Lock in 12.4 Days
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <button className="bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 shadow-emerald-900/40">
                        <RefreshCcw size={16} strokeWidth={3} /> Settlement
                    </button>
                    <button className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-zinc-700 transition-all active:scale-95">
                        <Database size={16} /> Batch Engine
                    </button>
                </div>
              </div>
           </div>

           <div className="flex-1 min-h-0 flex flex-col">
                <IdocMonitor />
           </div>

           <div className="h-[300px] shrink-0">
                <BatchJobMonitor />
           </div>
        </div>
      </div>
    </div>
  );
};
export default ERPView;
