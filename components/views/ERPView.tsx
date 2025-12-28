import React, { useState, useDeferredValue, useMemo } from 'react';
import { 
  Grid, Server, Activity, ArrowRight, Database, CheckCircle2, 
  Settings, RefreshCw, List, Clock, Layers, AlertTriangle, Terminal, Code
} from 'lucide-react';
import { MOCK_IDOCS, ERP_TCODES } from '../../constants';
import { ERPModule, IDOCInterface, AgencyContext } from '../../types';
import IdocDetailModal from '../erp/IdocDetailModal';
import SpendingChain from '../erp/SpendingChain';
import TCodeList from '../erp/TCodeList';

interface ERPViewProps {
  onSelectThread: (threadId: string) => void;
  agency?: AgencyContext;
}

const ERPView: React.FC<ERPViewProps> = ({ onSelectThread, agency }) => {
  const [commandField, setCommandField] = useState('');
  const [activeModule, setActiveModule] = useState<string | 'ALL'>('ALL');
  const [simulatedView, setSimulatedView] = useState<string | null>(null);
  const [selectedIdoc, setSelectedIdoc] = useState<IDOCInterface | null>(null);
  
  const deferredCommand = useDeferredValue(commandField);
  const isUsace = agency === 'USACE_CEFMS';

  const modules = useMemo(() => [
    { id: 'FI', label: 'Financials', icon: Database, desc: 'GL, AP, AR, Asset Accounting' },
    { id: 'CO', label: 'Controlling', icon: Layers, desc: 'Cost Centers, Internal Orders' },
    { id: 'MM', label: 'Materials', icon: Server, desc: 'Procurement, Inventory, MRP' },
    { id: 'SD', label: 'Sales & Dist', icon: Activity, desc: 'Reimbursables, Billing' },
    { id: 'BI', label: 'Business Intel', icon: Grid, desc: 'BW Reporting, Analytics' },
    { id: 'PS', label: 'Project Sys', icon: List, desc: 'WBS, Project Builder' }
  ], []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if(commandField) {
      setSimulatedView(`Executing T-Code: ${commandField.toUpperCase()}...`);
      setTimeout(() => setSimulatedView(null), 2000);
      setCommandField('');
    }
  };

  return (
    <div className="p-4 sm:p-8 animate-in fade-in space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded border border-zinc-700 w-72 focus-within:border-emerald-500 transition-all">
          <Terminal size={14} className="text-emerald-500" />
          <form onSubmit={handleCommand} className="flex-1">
            <input 
              type="text" 
              value={commandField} 
              onChange={(e) => setCommandField(e.target.value)} 
              placeholder="Enter T-Code (e.g. /nME21N)" 
              className="w-full bg-transparent text-xs font-mono text-emerald-400 focus:outline-none placeholder:text-zinc-600 uppercase"
            />
          </form>
          <button onClick={handleCommand}><ArrowRight size={14} className="text-zinc-500 hover:text-emerald-400 transition-colors" /></button>
        </div>
        <div className="h-6 w-[1px] bg-zinc-800" />
        <div className="flex items-center gap-6 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
           <span className="flex items-center gap-2">System: <span className="text-zinc-200">{isUsace ? 'CEFMS II PRD' : 'GFEBS ECC 6.0'}</span></span>
           <span className="flex items-center gap-2">Status: <span className="text-emerald-500 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"/> Connected</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {modules.map((mod) => (
                <button 
                  key={mod.id} 
                  onClick={() => setActiveModule(mod.id === activeModule ? 'ALL' : mod.id)} 
                  className={`p-5 rounded-2xl border text-left transition-all group relative overflow-hidden ${
                    activeModule === mod.id 
                    ? 'bg-zinc-900 border-zinc-800 text-white shadow-xl scale-[1.02]' 
                    : 'bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-md'
                  }`}
                >
                  <div className="relative z-10">
                    <div className={`p-2.5 w-fit rounded-xl mb-4 transition-colors ${
                      activeModule === mod.id ? 'bg-zinc-800 text-emerald-400' : 'bg-zinc-50 text-zinc-600 group-hover:bg-zinc-100'
                    }`}>
                      <mod.icon size={20} />
                    </div>
                    <h4 className={`font-bold text-sm mb-1 uppercase tracking-tight ${activeModule === mod.id ? 'text-white' : 'text-zinc-900'}`}>{mod.label}</h4>
                    <p className={`text-[10px] leading-relaxed ${activeModule === mod.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{mod.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <SpendingChain onSelectThread={onSelectThread} />
            
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <Code size={14} className="text-zinc-400" /> Functional Navigator
                    </h3>
                </div>
                <TCodeList activeModule={activeModule} onSelectCommand={setCommandField} />
            </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden border border-zinc-800">
              <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><Settings size={80}/></div>
              <h3 className="text-lg font-bold mb-4 tracking-tight">Period Control (OKP)</h3>
              <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                 <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Posting Period</p>
                    <p className="text-3xl font-mono font-bold text-emerald-400 mt-1">03 / 2024</p>
                 </div>
                 <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">OPEN</span>
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <button className="bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg flex items-center justify-center gap-2">
                    <RefreshCw size={14} /> Run Payment (F110)
                 </button>
                 <button className="bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 border border-zinc-700">
                    <Clock size={14} /> Close Period
                 </button>
              </div>
           </div>

           <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} className="text-zinc-400" /> IDOC Interface Monitoring
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-600">ONLINE</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                 {MOCK_IDOCS.map((idoc) => (
                    <button 
                        key={idoc.id} 
                        onClick={() => setSelectedIdoc(idoc)} 
                        className="w-full text-left p-4 border border-zinc-100 rounded-xl hover:border-zinc-300 hover:shadow-md transition-all bg-zinc-50/30"
                    >
                       <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] font-mono font-bold text-zinc-400">{idoc.timestamp}</span>
                          {idoc.status === 'Success' ? (
                            <div className="p-1 bg-emerald-50 text-emerald-600 rounded-full"><CheckCircle2 size={12} /></div>
                          ) : (
                            <div className={`p-1 rounded-full ${idoc.status === 'Warning' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
                                <AlertTriangle size={12} />
                            </div>
                          )}
                       </div>
                       <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                            idoc.direction === 'Inbound' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                          }`}>
                            {idoc.direction}
                          </span>
                          <span className="text-xs font-bold text-zinc-800">{idoc.partner}</span>
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
      {selectedIdoc && <IdocDetailModal idoc={selectedIdoc} onClose={() => setSelectedIdoc(null)} />}
    </div>
  );
};

export default ERPView;