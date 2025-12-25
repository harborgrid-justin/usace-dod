
import React, { useState } from 'react';
import { 
  Grid, Server, Activity, ArrowRight, Database, CheckCircle2, 
  Settings, RefreshCw, List, Clock, Layers, AlertTriangle 
} from 'lucide-react';
import { MOCK_IDOCS } from '../../constants';
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
  const isUsace = agency === 'USACE_CEFMS';

  const modules: { id: string; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'FI', label: 'Financials', icon: Database, desc: 'GL, AP, AR, Asset Accounting' },
    { id: 'CO', label: 'Controlling', icon: Layers, desc: 'Cost Centers, Internal Orders' },
    { id: 'MM', label: 'Materials', icon: Server, desc: 'Procurement, Inventory, MRP' },
    { id: 'SD', label: 'Sales & Dist', icon: Activity, desc: 'Reimbursables, Billing' },
    { id: 'BI', label: 'Business Intel', icon: Grid, desc: 'BW Reporting, Analytics' },
    { id: 'PS', label: 'Project Sys', icon: List, desc: 'WBS, Project Builder' }
  ];

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if(commandField) {
      setSimulatedView(`Executing T-Code: ${commandField.toUpperCase()}...`);
      setTimeout(() => setSimulatedView(null), 2000);
      setCommandField('');
    }
  };

  return (
    <div className="p-4 sm:p-8 animate-in space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="bg-white border border-zinc-300 rounded-lg p-2 shadow-sm flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded border border-zinc-200 w-64">
          <CheckCircle2 size={16} className={isUsace ? "text-rose-600" : "text-emerald-600"} />
          <form onSubmit={handleCommand} className="flex-1"><input type="text" value={commandField} onChange={(e) => setCommandField(e.target.value)} placeholder="/nME21N" className="w-full bg-transparent text-sm font-mono text-zinc-800 focus:outline-none placeholder:text-zinc-400"/></form>
          <button onClick={handleCommand}><ArrowRight size={14} className="text-zinc-400 hover:text-zinc-800" /></button>
        </div>
        <div className="h-6 w-[1px] bg-zinc-200" />
        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
           <span>System: <span className="text-zinc-900">{isUsace ? 'CEFMS II' : 'GFEBS PRD (300)'}</span></span>
           <span>User: <span className="text-zinc-900">{isUsace ? 'USACE_RM' : 'G8_ADMIN'}</span></span>
        </div>
      </div>

      {simulatedView && <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4"><Activity className="animate-spin" size={18} /><span className="font-mono text-sm">{simulatedView}</span></div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {modules.map((mod) => (
                <button key={mod.id} onClick={() => setActiveModule(mod.id === activeModule ? 'ALL' : mod.id)} className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${activeModule === mod.id ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 hover:border-zinc-400'}`}>
                  <div className="relative z-10"><div className={`p-2 w-fit rounded-lg mb-3 ${activeModule === mod.id ? 'bg-zinc-800' : 'bg-zinc-100 group-hover:bg-zinc-200'}`}><mod.icon size={18} className={activeModule === mod.id ? 'text-zinc-300' : 'text-zinc-600'} /></div><h4 className={`font-bold text-sm mb-1 ${activeModule === mod.id ? 'text-white' : 'text-zinc-900'}`}>{mod.label}</h4><p className={`text-[10px] ${activeModule === mod.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{mod.desc}</p></div>
                </button>
              ))}
            </div>
            <SpendingChain onSelectThread={onSelectThread} />
            <TCodeList activeModule={activeModule} onSelectCommand={setCommandField} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Settings size={64}/></div>
              <h3 className="text-lg font-bold mb-4">Period Control</h3>
              <div className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-lg border border-white/10">
                 <div><p className="text-[10px] text-zinc-400 uppercase tracking-widest">Posting Period</p><p className="text-2xl font-mono font-bold">02 / 2024</p></div>
                 <div className="flex flex-col items-end"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/><span className="text-xs font-bold text-emerald-400">OPEN</span></div><span className="text-[10px] text-zinc-500">Variant: 1000</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <button className="bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-2"><RefreshCw size={12} /> Exec Payment Run</button>
                 <button className="bg-zinc-800 hover:bg-zinc-700 py-2 rounded text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-2"><Clock size={12} /> Close Period</button>
              </div>
           </div>
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex-1">
              <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">IDOC Interface</h3><span className="flex h-2 w-2 rounded-full bg-emerald-500"></span></div>
              <div className="space-y-3">
                 {MOCK_IDOCS.map((idoc) => (
                    <button key={idoc.id} onClick={() => setSelectedIdoc(idoc)} className="w-full text-left p-3 border border-zinc-100 rounded-lg hover:border-zinc-300 transition-all group">
                       <div className="flex justify-between items-start mb-2"><span className="text-[10px] font-mono text-zinc-400">{idoc.timestamp}</span>{idoc.status === 'Success' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertTriangle size={12} className={idoc.status === 'Warning' ? "text-amber-500" : "text-rose-500"} />}</div>
                       <div className="flex items-center gap-2 mb-1"><span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${idoc.direction === 'Inbound' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>{idoc.direction}</span><span className="text-xs font-bold text-zinc-800">{idoc.partner}</span></div>
                       <p className="text-[10px] font-mono text-zinc-500 truncate">Msg: {idoc.messageType} / {idoc.id}</p>
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
