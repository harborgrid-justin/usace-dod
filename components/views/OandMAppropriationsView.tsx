import React, { useState, useMemo, useCallback } from 'react';
import { FileText, ChevronDown, Edit, Sparkles, Activity, Info } from 'lucide-react';
import { MOCK_O_AND_M_APPROPRIATIONS } from '../../constants';
import { OandMAppropriation, SubActivityGroup, BudgetActivity, ActivityGroup } from '../../types';
import { generateOandMJustification } from '../../services/geminiService';
import { formatCurrency } from '../../utils/formatting';
import OandMProposalModal from '../appropriations/OandMProposalModal';

interface RenderRowContext {
    appropriation?: OandMAppropriation;
    budgetActivity?: BudgetActivity;
}

const OandMAppropriationsView = () => {
  const [appropriationsData, setAppropriationsData] = useState<OandMAppropriation[]>(MOCK_O_AND_M_APPROPRIATIONS);
  const [activeAppropId, setActiveAppropId] = useState<OandMAppropriation['id']>('OMA');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ 'BA1': true, 'AG11': true });
  const [selectedSag, setSelectedSag] = useState<SubActivityGroup | null>(null);
  const [contextForSag, setContextForSag] = useState<{ appropriation: string; budgetActivity: string; } | null>(null);
  const [isJustificationLoading, setIsJustificationLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeProposal, setChangeProposal] = useState<{ sag: SubActivityGroup; newBudget: number | ''; justification: string; } | null>(null);
  
  const activeAppropriation = useMemo(() => appropriationsData.find(a => a.id === activeAppropId), [activeAppropId, appropriationsData]);

  const toggleRow = useCallback((id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSelectSag = useCallback((sag: SubActivityGroup, appropriation?: OandMAppropriation, budgetActivity?: BudgetActivity) => {
    if (!appropriation || !budgetActivity) return;
    setSelectedSag(sag);
    setContextForSag({ appropriation: appropriation.name, budgetActivity: budgetActivity.name });
  }, []);
  
  const handleGenerateJustification = async () => {
    if (!selectedSag || !contextForSag) return;
    setIsJustificationLoading(true);
    try {
      const justification = await generateOandMJustification(selectedSag, contextForSag);
      setSelectedSag(prev => prev ? { ...prev, justificationNotes: justification } : null);
    } finally {
      setIsJustificationLoading(false);
    }
  };
  
  const handleProposeChange = useCallback((sag: SubActivityGroup) => {
    setChangeProposal({ sag, newBudget: sag.budget, justification: '' });
    setIsModalOpen(true);
  }, []);
  
  const handleSaveChanges = () => {
    if (!changeProposal) return;
    const { sag, newBudget, justification } = changeProposal;
    
    setAppropriationsData(prevData => {
      return prevData.map(approp => {
        if(approp.id !== activeAppropId) return approp;
        return {
          ...approp,
          budgetActivities: approp.budgetActivities.map(ba => ({
            ...ba,
            activityGroups: ba.activityGroups.map(ag => ({
              ...ag,
              subActivityGroups: ag.subActivityGroups.map(currentSag => 
                currentSag.id === sag.id 
                ? { ...currentSag, budget: Number(newBudget), isModified: true, justificationNotes: justification } 
                : currentSag
              ),
            })),
          })),
        };
      });
    });

    if (selectedSag && selectedSag.id === sag.id) {
        setSelectedSag(prev => prev ? {...prev, budget: Number(newBudget), isModified: true, justificationNotes: justification} : null);
    }

    setIsModalOpen(false);
    setChangeProposal(null);
  };
  
  const renderRow = (item: SubActivityGroup | ActivityGroup | BudgetActivity, level: number, parentContext: RenderRowContext) => {
    const isExpanded = !!expandedRows[item.id];
    const hasChildren = 'activityGroups' in item || 'subActivityGroups' in item;
    
    let totalBudget = 0;
    if ('budget' in item) {
        totalBudget = item.budget;
    } else if ('activityGroups' in item) {
        totalBudget = item.activityGroups.reduce((sum, ag) => sum + ag.subActivityGroups.reduce((agSum, sag) => agSum + sag.budget, 0), 0);
    } else if ('subActivityGroups' in item) {
        totalBudget = item.subActivityGroups.reduce((sum, sag) => sum + sag.budget, 0);
    }

    return (
      <React.Fragment key={item.id}>
        <tr className={`group transition-colors ${(selectedSag && 'budget' in item && selectedSag.id === item.id) ? 'bg-blue-50' : 'hover:bg-zinc-50/50'}`} >
          <td className="p-3 text-xs font-medium text-zinc-800">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 1.5}rem` }}>
              {hasChildren ? (
                <button onClick={() => toggleRow(item.id)} className="p-0.5 text-zinc-400 hover:text-zinc-800">
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                </button>
              ) : <div className="w-5"/>}
              <span className={hasChildren ? 'font-bold uppercase tracking-tight' : ''}>{item.name}</span>
            </div>
          </td>
          <td className="p-3 text-xs font-mono text-zinc-800 text-right">{formatCurrency(totalBudget)}</td>
          <td className="p-3 text-xs font-mono text-right">{'priceChange' in item && item.priceChange ? <span className={item.priceChange > 0 ? 'text-rose-600' : 'text-emerald-600'}>{formatCurrency(item.priceChange)}</span> : <span className="text-zinc-300">-</span>}</td>
          <td className="p-3 text-xs font-mono text-right">{'programChange' in item && item.programChange ? <span className={item.programChange > 0 ? 'text-emerald-600' : 'text-rose-600'}>{formatCurrency(item.programChange)}</span> : <span className="text-zinc-300">-</span>}</td>
          <td className="p-3 text-center">
             {'budget' in item && (
                 <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleSelectSag(item, parentContext.appropriation, parentContext.budgetActivity)} className="p-1 text-zinc-400 hover:text-zinc-800" title="Details"><Info size={14}/></button>
                    <button onClick={() => handleProposeChange(item)} className="p-1 text-zinc-400 hover:text-zinc-800" title="Propose Change"><Edit size={14}/></button>
                 </div>
             )}
          </td>
        </tr>
        {isExpanded && hasChildren && ('activityGroups' in item ? item.activityGroups : item.subActivityGroups).map(child => renderRow(child, level + 1, { ...parentContext, budgetActivity: 'budget' in item ? parentContext.budgetActivity : (item as BudgetActivity) }))}
      </React.Fragment>
    );
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-full mx-auto h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
        <FileText size={24} className="text-zinc-400" /> O&M Appropriations
      </h2>
      
      <div className="bg-zinc-100 p-1 rounded-lg flex gap-1 self-start shadow-inner">
        {appropriationsData.map(approp => (
          <button 
            key={approp.id}
            onClick={() => { setActiveAppropId(approp.id); setSelectedSag(null); }}
            className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeAppropId === approp.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            {approp.id} ({approp.appropriationCode})
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
         <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-zinc-50/90 backdrop-blur-sm z-10">
                        <tr className="border-b border-zinc-100">
                            <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Budget Structure</th>
                            <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total Budget</th>
                            <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Price Δ</th>
                            <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Prog Δ</th>
                            <th className="p-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {activeAppropriation?.budgetActivities.map(ba => renderRow(ba, 0, { appropriation: activeAppropriation }))}
                    </tbody>
                </table>
            </div>
         </div>
         <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 flex flex-col">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-100 pb-3">Justification Panel</h3>
            {selectedSag ? (
                <div className="flex flex-col flex-1">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-baseline"><span className="text-xs font-semibold text-zinc-500">SAG:</span><span className="text-sm font-bold text-zinc-900 text-right">{selectedSag.name}</span></div>
                        <div className="flex justify-between items-baseline"><span className="text-xs font-semibold text-zinc-500">Value:</span><span className="text-sm font-mono text-zinc-800">{formatCurrency(selectedSag.budget)}</span></div>
                    </div>
                    <textarea 
                        value={selectedSag.justificationNotes || ''} 
                        onChange={(e) => setSelectedSag(s => s ? {...s, justificationNotes: e.target.value} : null)} 
                        rows={10} 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400 transition-all flex-1" 
                        placeholder="Draft narrative..." 
                    />
                    <button onClick={handleGenerateJustification} disabled={isJustificationLoading} className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors disabled:bg-zinc-300">
                        {isJustificationLoading ? <Activity size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {isJustificationLoading ? 'Analyzing...' : 'Sentiel-3 Justification'}
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 gap-2">
                    <Info size={24} className="opacity-50"/>
                    <p className="text-xs font-medium">Select a budget row for strategic justification establishment.</p>
                </div>
            )}
         </div>
      </div>
      
      {isModalOpen && changeProposal && (
         <OandMProposalModal 
            changeProposal={changeProposal} 
            setChangeProposal={setChangeProposal}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveChanges}
         />
      )}
    </div>
  );
};

export default OandMAppropriationsView;