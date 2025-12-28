
import React, { useState, useMemo } from 'react';
import { Globe, Users, Sparkles, BookOpen, Receipt, AlertTriangle, ChevronRight, FileText } from 'lucide-react';
import { MOCK_CONTINGENCY_OPERATIONS } from '../../constants';
import { JustificationDocStatus } from '../../types';
import { getFinancialAdvice } from '../../services/geminiService';
import { formatCurrency } from '../../utils/formatting';
import SF1080BillingPackageModal from '../contingency/SF1080BillingPackageModal';
import FundingOversightView from '../contingency/FundingOversightView';
import OperationOverview from '../contingency/OperationOverview';
import CostDetermination from '../contingency/CostDetermination';

interface ContingencyOpsViewProps {
  selectedContingencyOpId: string | null;
  setSelectedContingencyOpId: (id: string | null) => void;
  onSelectThread: (id: string) => void;
}

const ContingencyOpsView: React.FC<ContingencyOpsViewProps> = ({ selectedContingencyOpId, setSelectedContingencyOpId, onSelectThread }) => {
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'costCollection' | 'costDetermination' | 'fundingOversight' | 'budgetJustification' | 'billing'>('overview');
  const [showSF1080Modal, setShowSF1080Modal] = useState(false);
  const selectedOp = useMemo(() => MOCK_CONTINGENCY_OPERATIONS.find(op => op.id === selectedContingencyOpId), [selectedContingencyOpId]);
  const [askOcoQuery, setAskOcoQuery] = useState('');
  const [askOcoResponse, setAskOcoResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskOco = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!askOcoQuery || !selectedOp) return;
      setIsAiLoading(true);
      setAskOcoResponse('');
      try {
          const response = await getFinancialAdvice(askOcoQuery, { operation: selectedOp.name, type: 'OCO Budget Request' });
          setAskOcoResponse(response || 'No specific guidance found.');
      } catch { setAskOcoResponse('Sentinel AI query failed.'); } finally { setIsAiLoading(false); }
  };

  const JustificationStatusBadge: React.FC<{status: JustificationDocStatus}> = ({status}) => {
      const classes = { 'Draft': 'bg-amber-100 text-amber-800 border-amber-200', 'Submitted': 'bg-blue-100 text-blue-800 border-blue-200', 'Approved': 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${classes[status]}`}>{status}</span>
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3"><Globe size={24} className="text-zinc-400" /> Contingency Operations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {MOCK_CONTINGENCY_OPERATIONS.map(op => (
             <button key={op.id} onClick={() => { setSelectedContingencyOpId(op.id); setActiveDetailTab('overview'); }} className={`p-4 rounded-xl border text-left transition-all group relative w-full ${selectedContingencyOpId === op.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                <div className="flex justify-between items-start mb-2"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${selectedContingencyOpId === op.id ? 'bg-zinc-700 text-zinc-300 border-zinc-600' : { 'Active': 'bg-emerald-50 text-emerald-700 border-emerald-100', 'Planning': 'bg-amber-50 text-amber-700 border-amber-100', 'Completed': 'bg-zinc-100 text-zinc-500 border-zinc-200' }[op.status]}`}>{op.status}</span><span className={`text-[10px] font-medium ${selectedContingencyOpId === op.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{op.type}</span></div>
                <p className={`font-bold mb-1 ${selectedContingencyOpId === op.id ? 'text-white' : 'text-zinc-900'}`}>{op.name}</p><p className={`text-xs ${selectedContingencyOpId === op.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{op.location}</p>
             </button>
          ))}
        </div>
        <div className="lg:col-span-8 xl:col-span-9 bg-white border border-zinc-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          {selectedOp ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-zinc-100 grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="md:col-span-2"><h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{selectedOp.name}</h3><p className="text-xs text-zinc-500 font-mono">{selectedOp.id}</p></div>
                 <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100"><Users size={16} className="text-zinc-400 shrink-0"/><div><p className="font-bold text-zinc-500 text-[10px] uppercase tracking-wider">Personnel</p><p className="font-mono text-sm font-bold text-zinc-800">{selectedOp.personnelDeployed.toLocaleString()}</p></div></div>
                 <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100"><FileText size={16} className="text-zinc-400 shrink-0"/><div><p className="font-bold text-zinc-500 text-[10px] uppercase tracking-wider">Execute Order</p><p className="font-mono text-sm font-bold text-zinc-800">{selectedOp.executeOrderRef}</p></div></div>
              </div>
              <div className="px-6 border-b border-zinc-100 flex gap-2 overflow-x-auto custom-scrollbar">
                  { (['overview', 'fundingOversight', 'costCollection', 'costDetermination', 'budgetJustification', 'billing'] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveDetailTab(tab)} className={`py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all whitespace-nowrap ${activeDetailTab === tab ? 'border-zinc-800 text-zinc-800' : 'border-transparent text-zinc-400 hover:text-zinc-800'}`}>{tab.replace('costC', 'Cost C').replace('costD', 'Cost D').replace('budgetJ', 'Budget J').replace('billing', 'Billing').replace('fundingOversight', 'Funding & Oversight')}</button>
                  )) }
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeDetailTab === 'overview' && <OperationOverview operation={selectedOp} onSelectThread={onSelectThread} />}
                {activeDetailTab === 'fundingOversight' && <FundingOversightView operation={selectedOp} />}
                {activeDetailTab === 'costCollection' && <div className="space-y-6 animate-in fade-in"><div className="bg-white p-6 rounded-xl border border-zinc-200"><h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Cost Capture (FMR 9.4.3)</h4><div className="flex items-center justify-between p-4 rounded-lg border bg-zinc-50 border-zinc-100 mb-4"><p className="text-xs font-medium text-zinc-800">Unique Coding</p><div className="flex gap-2"><span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase border bg-zinc-100 text-zinc-700 border-zinc-200">SFIS: {selectedOp.sfisCode}</span><span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase border bg-zinc-100 text-zinc-700 border-zinc-200">CJCS: {selectedOp.cjcsProjectCode}</span></div></div><div className="p-4 border border-zinc-100 rounded-lg"><h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Subsidiary Records Feed</h5><div className="text-xs font-mono text-zinc-500 text-center py-4 bg-zinc-50/50 rounded">-- Data stream from component systems --</div></div></div></div>}
                {activeDetailTab === 'costDetermination' && <CostDetermination operation={selectedOp} />}
                {activeDetailTab === 'budgetJustification' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in"><div className="bg-white p-6 rounded-xl border border-zinc-200 space-y-4"><h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Justification Materials (FMR 9.6)</h4>{Object.entries(selectedOp.justificationMaterials).map(([doc, status]) => (<div key={doc} className="flex justify-between items-center p-3 bg-zinc-50 border border-zinc-100 rounded-lg"><div className="flex items-center gap-3"><BookOpen size={14} className="text-zinc-400" /><span className="text-xs font-bold text-zinc-800">Exhibit {doc}</span></div><JustificationStatusBadge status={status as any} /></div>))}</div><div className="bg-zinc-900 rounded-xl p-6 text-white flex flex-col shadow-lg"><h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-4"><Sparkles size={16} className="text-emerald-400"/> Ask OCO (PRCP)</h4><div className="flex-1 overflow-y-auto custom-scrollbar mb-4 pr-2">{askOcoResponse && <div className="bg-white/10 p-3 rounded-lg text-xs leading-relaxed border border-white/10">{askOcoResponse}</div>}</div><form onSubmit={handleAskOco} className="relative"><input type="text" value={askOcoQuery} onChange={e => setAskOcoQuery(e.target.value)} placeholder="Ask about OCO requirements..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-3 pr-8 text-xs placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500" /><button type="submit" disabled={isAiLoading || !askOcoQuery} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white disabled:opacity-50"><ChevronRight size={16}/></button></form></div></div>}
                {activeDetailTab === 'billing' && <div className="space-y-6 animate-in fade-in"><div className="p-6 bg-white border border-zinc-200 rounded-xl"><h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">DFAS Centralized Billing (FMR 10.0)</h4><div className="grid grid-cols-2 gap-4 mb-4"><div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg"><p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Total Incremental Costs</p><p className="font-mono font-bold text-lg text-zinc-800">{formatCurrency(Object.values(selectedOp.incrementalCosts).reduce<number>((sum, cost) => sum + Number(cost), 0))}</p></div><div className="p-3 bg-blue-50 border border-blue-200 rounded-lg"><p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Billable Incremental Costs</p><p className="font-mono font-bold text-lg text-blue-600">{formatCurrency(selectedOp.billableIncrementalCosts)}</p></div></div><button onClick={() => setShowSF1080Modal(true)} className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors"><Receipt size={12}/> Prepare SF 1080 Billing Package</button></div><div className="p-6 bg-white border border-zinc-200 rounded-xl"><h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Reimbursement Status Report</h4><div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 border border-zinc-100 mb-4"><div><p className="text-xs font-medium text-zinc-500">Billed</p><p className="font-mono font-semibold text-zinc-800">{formatCurrency(selectedOp.reimbursement.billed)}</p></div><div><p className="text-xs font-medium text-zinc-500">Received</p><p className="font-mono font-semibold text-emerald-600">{formatCurrency(selectedOp.reimbursement.received)}</p></div><div><p className="text-xs font-medium text-zinc-500">Outstanding</p><p className="font-mono font-semibold text-rose-600">{formatCurrency(selectedOp.reimbursement.billed - selectedOp.reimbursement.received)}</p></div></div><div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"><AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" /><p className="text-xs text-amber-900 leading-relaxed"><strong className="font-bold">FMR 10.1.3 Warning:</strong> Reimbursements must be received within 180 days after fiscal year end.</p></div></div></div>}
              </div>
            </div>
          ) : <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2"><Globe size={24} className="opacity-20" /><span className="text-xs font-medium">Select a contingency operation to view details.</span></div>}
          {showSF1080Modal && selectedOp && <SF1080BillingPackageModal operation={selectedOp} onClose={() => setShowSF1080Modal(false)} />}
        </div>
      </div>
    </div>
  );
};

export default ContingencyOpsView;
