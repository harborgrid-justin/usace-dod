import React, { useState, useEffect } from 'react';
import { X, AlertCircle, ShieldCheck, Scale } from 'lucide-react';
import { TransferAction, TransferAuthorityType, RuleEvaluationResult } from '../../types';
import { evaluateRules } from '../../utils/rulesEngine';
import { MOCK_BUSINESS_RULES } from '../../constants';

interface Props {
  onClose: () => void;
  onSubmit: (data: Partial<TransferAction>) => void;
}

const TransferRequestModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [authorityType, setAuthorityType] = useState<TransferAuthorityType>('General Transfer Authority (GTA)');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [justification, setJustification] = useState('');
  const [isHigherPriority, setIsHigherPriority] = useState(false);
  const [isUnforeseen, setIsUnforeseen] = useState(false);
  const [isCongressionalDenial, setIsCongressionalDenial] = useState(false);
  
  const [ruleResults, setRuleResults] = useState<RuleEvaluationResult[]>([]);
  const [blockingErrors, setBlockingErrors] = useState<number>(0);

  // Real-time Rule Evaluation
  useEffect(() => {
      const transferState = {
          authorityType,
          amount: Number(amount),
          isHigherPriority,
          isUnforeseen,
          isCongressionalDenial
          // Add mapping for new rule fields if necessary
      };

      const relevantRules = MOCK_BUSINESS_RULES.filter(r => r.domain === 'Transfers' && r.isActive);
      const results = evaluateRules(relevantRules, transferState);
      
      setRuleResults(results);
      setBlockingErrors(results.filter(r => !r.passed && r.severity === 'Critical').length);
  }, [authorityType, amount, isHigherPriority, isUnforeseen, isCongressionalDenial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromAccount || !toAccount || !amount || !justification) {
        alert('All core fields are required.');
        return;
    }

    if (blockingErrors > 0) {
        return; 
    }

    onSubmit({
        authorityType,
        fromAccount,
        toAccount,
        amount: Number(amount),
        justification,
        isHigherPriority,
        isUnforeseen,
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in slide-in-from-top-2 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Request Appropriation Transfer</h3>
            <p className="text-xs text-zinc-500">Authority: DoD FMR Vol 3, Chapter 3</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex gap-3">
             <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Legal Warning:</strong> Transfers must be authorized by law. The Business Rules Engine will verify compliance with 31 U.S.C. 1531 and FMR Vol 3.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Legal Authority</label>
                <select 
                    value={authorityType} 
                    onChange={(e) => setAuthorityType(e.target.value as TransferAuthorityType)}
                    className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all"
                >
                    <option>General Transfer Authority (GTA)</option>
                    <option>Congressionally Directed</option>
                    <option>Working Capital Fund</option>
                    <option>MilCon</option>
                    <option>Functional (10 USC 125)</option>
                    <option>Inter-Agency (31 USC 1531)</option>
                </select>
             </div>
             
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Source Account (Losing)</label>
                <input type="text" value={fromAccount} onChange={e => setFromAccount(e.target.value)} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all" placeholder="e.g., OMA 2020" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Account (Gaining)</label>
                <input type="text" value={toAccount} onChange={e => setToAccount(e.target.value)} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all" placeholder="e.g., RDTE 2040" />
             </div>

             <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount ($)</label>
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all" />
             </div>

             <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification / Determination</label>
                <textarea 
                    value={justification} 
                    onChange={e => setJustification(e.target.value)} 
                    rows={3}
                    className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 transition-all resize-none" 
                    placeholder="Explain why this transfer is necessary in the national interest..."
                />
             </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 space-y-3">
             <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck size={14}/> Statutory Certifications
             </h4>
             
             {/* Only show GTA specific checks if GTA is selected */}
             {authorityType === 'General Transfer Authority (GTA)' && (
                 <>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="priority" checked={isHigherPriority} onChange={e => setIsHigherPriority(e.target.checked)} className="h-4 w-4 rounded text-zinc-900 border-zinc-300" />
                        <label htmlFor="priority" className="text-xs text-zinc-700 font-medium">Requirement is higher priority than original appropriation.</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="unforeseen" checked={isUnforeseen} onChange={e => setIsUnforeseen(e.target.checked)} className="h-4 w-4 rounded text-zinc-900 border-zinc-300" />
                        <label htmlFor="unforeseen" className="text-xs text-zinc-700 font-medium">Requirement was unforeseen at time of enactment.</label>
                    </div>
                 </>
             )}
             
             {/* General Check */}
             <div className="flex items-center gap-2">
                <input type="checkbox" id="denial" checked={isCongressionalDenial} onChange={e => setIsCongressionalDenial(e.target.checked)} className="h-4 w-4 rounded text-zinc-900 border-zinc-300" />
                <label htmlFor="denial" className="text-xs text-zinc-700 font-medium">Was this item previously denied by Congress?</label>
             </div>
          </div>

          {/* Rule Feedback */}
          {ruleResults.length > 0 && (
              <div className="space-y-2">
                  {ruleResults.filter(r => !r.passed).map((res, idx) => (
                      <div key={idx} className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 animate-in fade-in">
                          <AlertCircle size={14} className="text-rose-600 mt-0.5 shrink-0" />
                          <div>
                              <p className="text-xs font-bold text-rose-700">{res.ruleName}</p>
                              <p className="text-[10px] text-rose-600">{res.message}</p>
                          </div>
                      </div>
                  ))}
                  {blockingErrors === 0 && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 animate-in fade-in">
                          <ShieldCheck size={14} className="text-emerald-600" />
                          <p className="text-xs font-bold text-emerald-700">Transfer Validated against FMR</p>
                      </div>
                  )}
              </div>
          )}

        </form>

        <div className="pt-4 flex justify-end gap-3 mt-auto shrink-0 border-t border-zinc-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
            <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={blockingErrors > 0}
                className="px-5 py-2.5 bg-zinc-900 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
                {blockingErrors > 0 && <Scale size={14}/>}
                Initiate Proposal
            </button>
        </div>
      </div>
    </div>
  );
};

export default TransferRequestModal;