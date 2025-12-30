
import React, { useState, useMemo, useEffect, useTransition, useCallback } from 'react';
import { Landmark, TrendingUp, ChevronsRight, GitMerge, List, ShieldCheck, Database, ArrowUpRight } from 'lucide-react';
import { CommandNode, Appropriation, AgencyContext, NavigationTab } from '../../types';
import AppropriationLifecycleManager from '../appropriations/AppropriationLifecycleManager';
import FundsFlowVisualizer from '../appropriations/FundsFlowVisualizer';
import { fundsService } from '../../services/FundsDataService';
import { formatCurrency } from '../../utils/formatting';
import { REMIS_THEME } from '../../constants';

interface AppropriationsViewProps {
  onSelectThread: (threadId: string) => void;
  agency?: AgencyContext;
}

const CommandCard: React.FC<{ node: CommandNode, onManage: (commandId: string) => void }> = ({ node, onManage }) => (
  <button 
    onClick={() => onManage(node.id)}
    className={`${REMIS_THEME.enterprise.container} ${REMIS_THEME.enterprise.interactive} p-6 text-left group w-full`}
  >
    <div className="flex justify-between items-start mb-8">
        <div className="min-w-0">
          <p className={REMIS_THEME.enterprise.label}>{node.id}</p>
          <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight mt-1 leading-tight truncate">{node.name}</h3>
        </div>
        <div className={`p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-400 group-hover:bg-rose-50 group-hover:text-rose-700 transition-all shadow-inner shrink-0`}>
            <Landmark size={20}/>
        </div>
    </div>
    
    <div className="space-y-5">
        <div>
            <div className="flex justify-between text-[9px] font-bold uppercase mb-2">
                <span className="text-zinc-500 tracking-widest">Authority Consumed</span>
                <span className="text-zinc-900 font-mono tracking-tighter text-xs">{((node.obligated/node.totalAuthority)*100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-zinc-900 transition-all duration-1000 group-hover:bg-rose-700" style={{ width: `${(node.obligated/node.totalAuthority)*100}%` }} />
            </div>
        </div>
        
        <div className="flex justify-between items-end pt-4 border-t border-zinc-50">
            <div className="min-w-0">
                <p className={REMIS_THEME.enterprise.label}>Total Limit</p>
                <p className="text-base font-mono font-bold text-zinc-900 truncate">{formatCurrency(node.totalAuthority)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-700 uppercase group-hover:translate-x-1 transition-transform shrink-0">
                Manage <ArrowUpRight size={12} />
            </div>
        </div>
    </div>
  </button>
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
      <div className="h-full w-full overflow-hidden flex flex-col bg-zinc-50/50">
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
    <div className={`p-6 sm:p-10 space-y-10 animate-in h-full w-full flex flex-col transition-opacity duration-300 bg-zinc-50/50 overflow-hidden ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-200 pb-10 shrink-0">
         <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shrink-0">
                <Landmark size={24} className="text-white" />
            </div>
            <div className="min-w-0">
               <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tighter leading-none truncate">{config.rootName}</h2>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2 truncate">
                  <Database size={14} className="shrink-0"/> Top-Line Statutory Authority: <span className="text-zinc-900 font-mono font-bold whitespace-nowrap">{config.topLine}</span>
               </p>
            </div>
         </div>
         
         <div className="flex bg-zinc-100 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0">
            <button 
                onClick={() => setViewMode('Cards')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${viewMode === 'Cards' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
                <List size={14} /> Matrix View
            </button>
            <button 
                onClick={() => setViewMode('Flow')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${viewMode === 'Flow' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
                <GitMerge size={14} /> Stream Analysis
            </button>
         </div>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-12">
        <div className="w-full">
            {viewMode === 'Cards' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {config.nodesToRender.map((node) => (
                        <CommandCard key={node.id} node={node as unknown as CommandNode} onManage={handleSelectAppropriation} />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-zinc-200 rounded-2xl p-10 shadow-sm min-h-full w-full">
                    <FundsFlowVisualizer hierarchy={hierarchy} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AppropriationsView;
