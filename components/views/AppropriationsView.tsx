import React, { useState, useMemo, useEffect, useTransition, useCallback } from 'react';
import { Landmark, TrendingUp, ChevronsRight, GitMerge, List } from 'lucide-react';
import { CommandNode, Appropriation, AgencyContext } from '../../types';
import AppropriationLifecycleManager from '../appropriations/AppropriationLifecycleManager';
import FundsFlowVisualizer from '../appropriations/FundsFlowVisualizer';
import { fundsService } from '../../services/FundsDataService';

interface AppropriationsViewProps {
  onSelectThread: (threadId: string) => void;
  agency?: AgencyContext;
}

const CommandCard: React.FC<{ node: CommandNode, onManage: (commandId: string) => void }> = ({ node, onManage }) => (
  <div className="bg-white p-6 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all group flex flex-col justify-between shadow-sm">
    <div>
      <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{node.id}</p>
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">{node.name}</h3>
          </div>
          <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400 border border-zinc-100 group-hover:text-zinc-800 transition-colors"><Landmark size={18}/></div>
      </div>
      <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                <span className="text-zinc-500">Obligation Burn</span>
                <span className="text-zinc-900 font-mono">{((node.obligated/node.totalAuthority)*100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-800 transition-all duration-1000" style={{ width: `${(node.obligated/node.totalAuthority)*100}%` }} />
            </div>
          </div>
      </div>
    </div>
    <button onClick={() => onManage(node.id)} className="mt-6 w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-lg text-[10px] font-bold uppercase tracking-wide text-zinc-600 hover:text-zinc-900 transition-all flex items-center justify-center gap-2">
      Allocate Resources <ChevronsRight size={12} />
    </button>
  </div>
);

const AppropriationsView: React.FC<AppropriationsViewProps> = ({ onSelectThread, agency }) => {
  const [isPending, startTransition] = useTransition();
  const [selectedAppropriation, setSelectedAppropriation] = useState<Appropriation | null>(null);
  const [viewMode, setViewMode] = useState<'Cards' | 'Flow'>('Cards');
  
  const [appropriations, setAppropriations] = useState<Appropriation[]>(fundsService.getAppropriations());
  const [hierarchy, setHierarchy] = useState(fundsService.getHierarchy());

  useEffect(() => {
      const unsubscribe = fundsService.subscribe(() => {
          setAppropriations([...fundsService.getAppropriations()]);
          setHierarchy([...fundsService.getHierarchy()]);
      });
      return unsubscribe;
  }, []);

  const config = useMemo(() => {
    const armyRoot = hierarchy[0].children?.find(c => c.id === 'ARMY-ROOT');
    const osdRoot = hierarchy[0].children?.find(c => c.id === 'OSD-ROOT');
    const usaceNode = armyRoot?.children?.find(n => n.id === 'USACE');

    switch (agency) {
      case 'USACE_CEFMS':
        return { rootName: 'USACE Commands', topLine: '$7.2B', nodesToRender: usaceNode ? [usaceNode] : [] };
      case 'ARMY_GFEBS':
        return { rootName: 'Army Commands', topLine: `$${(armyRoot?.totalAuthority/1e9).toFixed(1)}B`, nodesToRender: armyRoot?.children || [] };
      default:
        return { rootName: 'Command Hierarchy', topLine: `$${(hierarchy[0].totalAuthority/1e9).toFixed(1)}B`, nodesToRender: hierarchy[0].children || [] };
    }
  }, [agency, hierarchy]);

  const handleSelectAppropriation = useCallback((commandId: string) => {
    const appropriation = appropriations.find(a => a.commandId === commandId);
    if (appropriation) {
      startTransition(() => {
        setSelectedAppropriation(appropriation);
      });
    }
  }, [appropriations]);

  if (selectedAppropriation) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar">
        <AppropriationLifecycleManager 
            appropriation={selectedAppropriation}
            commandName={config.nodesToRender.find(c => c.id === selectedAppropriation.commandId)?.name || 'N/A'}
            onBack={() => setSelectedAppropriation(null)}
            onSelectThread={onSelectThread}
        />
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight">{config.rootName}</h2>
            <div className="hidden sm:flex gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1"><TrendingUp size={14}/> Top-Line Authority: {config.topLine}</div>
         </div>
         
         <div className="flex bg-zinc-100 p-1 rounded-lg shadow-inner">
            <button 
                onClick={() => setViewMode('Cards')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${viewMode === 'Cards' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
                <List size={14} /> Cards
            </button>
            <button 
                onClick={() => setViewMode('Flow')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${viewMode === 'Flow' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
                <GitMerge size={14} /> Stream
            </button>
         </div>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-6">
        {viewMode === 'Cards' ? (
             <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                {config.nodesToRender.map((node) => (
                    <CommandCard key={node.id} node={node as unknown as CommandNode} onManage={handleSelectAppropriation} />
                ))}
            </div>
        ) : (
            <FundsFlowVisualizer hierarchy={hierarchy} />
        )}
      </div>
    </div>
  );
};

export default AppropriationsView;