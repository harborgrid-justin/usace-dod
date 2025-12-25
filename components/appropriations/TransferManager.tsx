
import React from 'react';
import { TransferAction, TransferStage } from '../../types';
import { FileText, ArrowRight, AlertTriangle, Building2, Gavel } from 'lucide-react';

interface Props {
  transfers: TransferAction[];
}

const STAGES_ORDER: TransferStage[] = [
  'Proposal', 
  'SecDef Determination', 
  'OMB Approval', 
  'Reprogramming (DD 1415)', 
  'Congressional Notification', 
  'Treasury NET (SF 1151)', 
  'Completed'
];

const StageIndicator: React.FC<{ stage: TransferStage, current: TransferStage }> = ({ stage, current }) => {
  const stageIdx = STAGES_ORDER.indexOf(stage);
  const currentIdx = STAGES_ORDER.indexOf(current);
  
  const status = stageIdx < currentIdx ? 'completed' : stageIdx === currentIdx ? 'active' : 'pending';
  
  return (
    <div className="flex flex-col items-center gap-1 min-w-[60px] flex-1">
       <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
          status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
          status === 'active' ? 'bg-white border-blue-500 animate-pulse' :
          'bg-white border-zinc-200'
       }`} />
       <span className={`text-[8px] text-center font-medium leading-tight max-w-[80px] ${
          status === 'active' ? 'text-blue-600 font-bold' : 'text-zinc-400'
       }`}>
          {stage.replace(/\s*\(.*\)\s*/g, '')}
       </span>
    </div>
  );
};

const TransferManager: React.FC<Props> = ({ transfers }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
       <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Active Transfer Authorities</h3>
          <span className="text-[10px] text-zinc-500 font-medium">DoD FMR Vol 3, Ch 3 Compliant</span>
       </div>
       
       <div className="divide-y divide-zinc-100">
          {transfers.map(transfer => (
             <div key={transfer.id} className="p-6 hover:bg-zinc-50/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-mono font-bold text-zinc-600">{transfer.id}</span>
                         <h4 className="text-sm font-bold text-zinc-900">{transfer.authorityType}</h4>
                      </div>
                      <p className="text-xs text-zinc-600 max-w-xl leading-relaxed">{transfer.justification}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                         <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                            <Gavel size={12} /> {transfer.legalCitation}
                         </div>
                         {transfer.isHigherPriority && (
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-100">
                               <AlertTriangle size={12} /> Higher Priority
                            </div>
                         )}
                         {transfer.isUnforeseen && (
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-100">
                               <AlertTriangle size={12} /> Unforeseen
                            </div>
                         )}
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4 sm:gap-8 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100 w-full md:w-auto">
                      <div className="text-center">
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Source</p>
                         <p className="text-xs font-bold text-zinc-700">{transfer.fromAccount}</p>
                      </div>
                      <ArrowRight size={16} className="text-zinc-300 shrink-0" />
                      <div className="text-center">
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Target</p>
                         <p className="text-xs font-bold text-emerald-700">{transfer.toAccount}</p>
                      </div>
                      <div className="h-8 w-[1px] bg-zinc-200 mx-2 hidden sm:block" />
                      <div className="text-right">
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Net Impact</p>
                         <p className="text-sm font-mono font-bold text-zinc-900">${(transfer.amount / 1e6).toFixed(2)}M</p>
                      </div>
                   </div>
                </div>

                {/* Workflow Visualization */}
                <div className="relative pt-4 pb-2">
                    <div className="absolute top-[21px] left-8 right-8 h-[2px] bg-zinc-100" />
                    <div className="flex justify-between w-full relative">
                       {STAGES_ORDER.map(stage => <StageIndicator key={stage} stage={stage} current={transfer.currentStage} />)}
                    </div>
                </div>
                
                {/* Document Links */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {transfer.documents.dd1415 && (
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-bold uppercase hover:bg-blue-100 transition-colors">
                            <FileText size={12}/> View DD 1415
                        </button>
                    )}
                    {transfer.documents.sf1151 && (
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors">
                            <Building2 size={12}/> View SF 1151 (NET)
                        </button>
                    )}
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default TransferManager;
