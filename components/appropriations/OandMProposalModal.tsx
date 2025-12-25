
import React from 'react';
import { X } from 'lucide-react';
import { SubActivityGroup } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface OandMProposalModalProps {
    changeProposal: { sag: SubActivityGroup; newBudget: number | ''; justification: string; };
    setChangeProposal: React.Dispatch<React.SetStateAction<{ sag: SubActivityGroup; newBudget: number | ''; justification: string; } | null>>;
    onClose: () => void;
    onSave: () => void;
}

const OandMProposalModal: React.FC<OandMProposalModalProps> = ({ changeProposal, setChangeProposal, onClose, onSave }) => {
    return (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Propose Budget Change</h3>
                    <button onClick={onClose}><X size={18}/></button>
                </div>
                <p className="text-sm mb-1 font-semibold">{changeProposal.sag.name}</p>
                <p className="text-xs text-zinc-500 mb-4">Current Budget: {formatCurrency(changeProposal.sag.budget)}</p>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">New Budget ($M)</label>
                        <input 
                            type="number" 
                            value={changeProposal.newBudget} 
                            onChange={e => setChangeProposal(c => c ? {...c, newBudget: Number(e.target.value)} : null)} 
                            className="w-full mt-1 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification for Change</label>
                        <textarea 
                            value={changeProposal.justification} 
                            onChange={e => setChangeProposal(c => c ? {...c, justification: e.target.value} : null)} 
                            rows={3} 
                            className="w-full mt-1 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:border-zinc-400" 
                        />
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button onClick={onSave} className="px-5 py-2.5 bg-zinc-900 rounded-lg text-[10px] font-bold uppercase text-white hover:bg-zinc-800">Submit Proposal</button>
                </div>
            </div>
        </div>
    );
};

export default OandMProposalModal;
