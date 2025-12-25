
import React, { useState } from 'react';
import { MinusCircle, AlertTriangle } from 'lucide-react';
import { WorkAllowance } from '../../types';
import Modal from '../shared/Modal';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    allowance: WorkAllowance;
    onClose: () => void;
    onSubmit: (allowance: WorkAllowance, reductionAmount: number, justification: string) => void;
}

const CWA_ReductionForm: React.FC<Props> = ({ allowance, onClose, onSubmit }) => {
    const [reductionAmount, setReductionAmount] = useState<number | ''>('');
    const [justification, setJustification] = useState('');
    const [error, setError] = useState('');

    const availableToReduce = allowance.amount - allowance.obligatedAmount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!reductionAmount || !justification) {
            setError('Reduction amount and justification are required.');
            return;
        }
        if (Number(reductionAmount) > availableToReduce) {
            setError(`Cannot reduce by more than the available balance of ${formatCurrency(availableToReduce)}.`);
            return;
        }
        if (Number(reductionAmount) <= 0) {
            setError('Reduction amount must be positive.');
            return;
        }

        onSubmit(allowance, Number(reductionAmount), justification);
    };

    return (
        <Modal title="Reduce / Withdraw Allowance" subtitle={`Target: ${allowance.id}`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Current Amount</p>
                        <p className="font-mono font-bold">{formatCurrency(allowance.amount)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Available to Reduce</p>
                        <p className="font-mono font-bold text-emerald-600">{formatCurrency(availableToReduce)}</p>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Reduction Amount ($)</label>
                    <input 
                        type="number" 
                        value={reductionAmount}
                        onChange={e => setReductionAmount(Number(e.target.value))}
                        className="w-full mt-1 border rounded p-2 text-sm"
                        max={availableToReduce}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Justification</label>
                    <textarea 
                        value={justification}
                        onChange={e => setJustification(e.target.value)}
                        className="w-full mt-1 border rounded p-2 text-sm resize-none"
                        rows={3}
                        placeholder="e.g., Funds reclaimed during CRA..."
                    />
                </div>

                {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded flex gap-2 text-rose-700 text-xs"><AlertTriangle size={14}/><span>{error}</span></div>}
                
                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-xs font-bold uppercase">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-rose-700 text-white rounded text-xs font-bold uppercase flex items-center gap-2">
                        <MinusCircle size={14}/> Confirm Reduction
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CWA_ReductionForm;
