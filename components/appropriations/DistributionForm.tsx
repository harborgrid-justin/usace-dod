
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Distribution } from '../../types';

interface Props {
  onClose: () => void;
  onSubmit: (data: Omit<Distribution, 'id' | 'date' | 'status'>) => void;
  remainingBalance: number;
}

const DistributionForm: React.FC<Props> = ({ onClose, onSubmit, remainingBalance }) => {
  const [toUnit, setToUnit] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [purpose, setPurpose] = useState('');
  const [fadNumber, setFadNumber] = useState('');
  const [error, setError] = useState('');

  // --- PHD LEVEL PATTERN: Semantic Event Handling ---
  // Explicitly typing the event prevents implicit 'any' usage and ensures 
  // we access valid properties on HTMLInputElement.
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUnit || !amount || !purpose || !fadNumber) {
      setError('All fields are required.');
      return;
    }
    if (Number(amount) > remainingBalance) {
      setError('Amount exceeds remaining balance.');
      return;
    }
    setError('');
    onSubmit({ toUnit, amount: Number(amount), purpose, fadNumber });
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300 p-4">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in slide-in-from-top-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">New Fund Distribution</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recipient Unit</label>
            <input type="text" value={toUnit} onChange={handleInputChange(setToUnit)} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</label>
            <input type="number" value={amount} onChange={handleAmountChange} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all" />
          </div>
           <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Purpose</label>
            <input type="text" value={purpose} onChange={handleInputChange(setPurpose)} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all" />
          </div>
           <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">FAD Number</label>
            <input type="text" value={fadNumber} onChange={handleInputChange(setFadNumber)} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all" />
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-zinc-900 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800 transition-colors">Create Distribution</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DistributionForm;
