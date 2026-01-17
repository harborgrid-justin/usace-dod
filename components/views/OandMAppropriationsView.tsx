
import React, { useState, useMemo } from 'react';
import OandMTreeRow from '../appropriations/OandMTreeRow';
import OandMJustificationPanel from '../appropriations/OandMJustificationPanel';
import OandMProposalModal from '../appropriations/OandMProposalModal';
import { useFundsData } from '../../hooks/useDomainData';

const OandMAppropriationsView = () => {
  const { oAndM: data } = useFundsData();
  const [activeAppropId, setActiveAppropId] = useState('OMA');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ 'BA1': true });
  const [selectedSag, setSelectedSag] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  
  const activeApprop = useMemo(() => data.find(a => a.id === activeAppropId), [activeAppropId, data]);

  return (
    <div className="p-8 space-y-6 animate-in h-full flex flex-col overflow-hidden bg-zinc-50/20">
      <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">O&M Appropriations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
         <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-zinc-50/90 backdrop-blur-sm z-10 border-b border-zinc-100"><tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"><th className="p-3">Structure</th><th className="p-3 text-right">Budget</th><th className="p-3 text-center">Action</th></tr></thead>
                <tbody>{activeApprop?.budgetActivities.map(ba => <OandMTreeRow key={ba.id} item={ba} level={0} expanded={expandedRows} onToggle={id => setExpandedRows({...expandedRows, [id]: !expandedRows[id]})} onSelect={setSelectedSag} onPropose={setProposal} />)}</tbody>
            </table>
         </div>
         <div className="lg:col-span-4 h-full"><OandMJustificationPanel sag={selectedSag} onUpdate={setSelectedSag} /></div>
      </div>
      {proposal && <OandMProposalModal changeProposal={proposal} setChangeProposal={setProposal} onClose={() => setProposal(null)} onSave={() => setProposal(null)} />}
    </div>
  );
};
export default OandMAppropriationsView;
