
import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { FundControlNode, FundControlLevel, AEAHistoryEvent } from '../../types';
import Modal from '../shared/Modal';

interface Props {
  node: FundControlNode | null;
  parentNode: FundControlNode | null;
  onClose: () => void;
  onSave: (node: FundControlNode) => void;
}

const FundNodeModal: React.FC<Props> = ({ node, parentNode, onClose, onSave }) => {
  const isEdit = !!node;
  
  const initialLevel: FundControlLevel = parentNode 
    ? (parentNode.level === 'Apportionment' ? 'Allotment' : 
       parentNode.level === 'Allotment' ? 'Allocation' : 
       parentNode.level === 'Allocation' ? 'Suballocation' : 'Suballocation')
    : (node?.level || 'Allocation');

  const [name, setName] = useState(node?.name || '');
  const [amount, setAmount] = useState(node?.totalAuthority || 0);
  const [isCMA, setIsCMA] = useState(node?.isCMA || false);
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || amount < 0 || (isEdit && !justification)) {
        setError('Name, a valid amount, and justification for edits are required.');
        return;
    }

    if (parentNode) {
       const parentRemaining = parentNode.totalAuthority - parentNode.amountDistributed + (isEdit ? (node?.totalAuthority || 0) : 0);
       if (amount > parentRemaining) {
           setError(`ADA Violation (31 USC 1517): Amount (${amount.toLocaleString()}) exceeds parent's undistributed balance (${parentRemaining.toLocaleString()}).`);
           return;
       }
    }
    
    const oldAuthority = node?.totalAuthority || 0;
    let historyAction: AEAHistoryEvent['action'] = 'Created';
    let historyAmount = Number(amount);
    let historyJustification = justification || 'Initial establishment of authority.';

    if (isEdit) {
        const amountDifference = Number(amount) - oldAuthority;
        if (amountDifference > 0) {
            historyAction = 'Increased';
            historyAmount = amountDifference;
        } else if (amountDifference < 0) {
            historyAction = 'Decreased';
            historyAmount = Math.abs(amountDifference);
        } else {
            historyAction = 'Updated';
            historyAmount = 0; // No financial change
            historyJustification = `Record updated: ${justification}`;
        }
    }

    const newHistoryEvent: AEAHistoryEvent = {
        timestamp: new Date().toISOString(),
        user: 'RM_ADMIN',
        action: historyAction,
        amount: historyAmount,
        justification: historyJustification,
    };

    onSave({
        id: node?.id || `NODE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        parentId: parentNode?.id || node?.parentId || null,
        name,
        level: initialLevel,
        totalAuthority: Number(amount),
        amountDistributed: node?.amountDistributed || 0,
        amountCommitted: node?.amountCommitted || 0,
        amountObligated: node?.amountObligated || 0,
        amountExpended: node?.amountExpended || 0,
        isCMA,
        history: [...(node?.history || []), newHistoryEvent],
        children: node?.children || []
    });
  };

  return (
    <Modal 
        title={isEdit ? 'Edit Expenditure Authority' : `New ${initialLevel}`} 
        onClose={onClose}
        maxWidth="max-w-lg"
    >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400"
                    placeholder={`e.g., LRL District FY24`}
                />
            </div>
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Authority ($)</label>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value))} 
                    className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400"
                />
                {parentNode && (
                    <div className="mt-2 flex justify-between items-center text-[10px]">
                        <span className="text-zinc-400">Parent Undistributed:</span>
                        <span className="font-mono font-bold text-zinc-700">${(parentNode.totalAuthority - parentNode.amountDistributed + (isEdit ? (node?.totalAuthority || 0) : 0)).toLocaleString()}</span>
                    </div>
                )}
            </div>
            
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification</label>
                 <textarea 
                    value={justification} 
                    onChange={e => setJustification(e.target.value)}
                    rows={2}
                    className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:border-zinc-400"
                    placeholder={isEdit ? 'Justification for change is required for audit trail.' : 'Optional justification for new authority.'}
                />
            </div>

            <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={isCMA} 
                        onChange={e => setIsCMA(e.target.checked)} 
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span className="text-xs font-bold text-zinc-700">Designate as Centrally Managed Account (CMA)</span>
                </label>
            </div>

            {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-rose-700 text-xs font-medium animate-in fade-in">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" /> 
                    <span>{error}</span>
                </div>
            )}

            {!error && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-700 text-xs font-medium">
                    <ShieldCheck size={14} /> 31 USC 1517 Check Passed
                </div>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Save</button>
            </div>
        </form>
    </Modal>
  );
};

export default FundNodeModal;
