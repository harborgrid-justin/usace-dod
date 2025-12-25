
import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';
import { FADocument, FundType } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (fad: FADocument) => void;
}

const CWA_FADForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [symbol, setSymbol] = useState('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [publicLaw, setPublicLaw] = useState('');
    const [authority, setAuthority] = useState<number | ''>('');
    const [fundType, setFundType] = useState<FundType>('Direct');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!symbol || !year || !publicLaw || !authority) {
            setError('All fields are required.');
            return;
        }

        const newFad: FADocument = {
            id: `FAD-${symbol}-FY${year.toString().slice(-2)}`,
            appropriationSymbol: symbol,
            programYear: year,
            publicLaw: publicLaw,
            totalAuthority: Number(authority),
            fundType: fundType,
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'HQ_BUDGET',
                action: 'Created FAD',
                details: `Initial authority established per ${publicLaw}`
            }]
        };

        onSubmit(newFad);
        onClose();
    };

    return (
        <Modal title="Create Funding Authorization Document (FAD)" subtitle="Establish New Authority" onClose={onClose} maxWidth="max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Appropriation Symbol</label>
                    <input 
                        value={symbol}
                        onChange={e => setSymbol(e.target.value)} 
                        className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                        placeholder="e.g., 96X3122"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Program Year</label>
                        <input 
                            type="number"
                            value={year}
                            onChange={e => setYear(Number(e.target.value))} 
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fund Type</label>
                        <select 
                            value={fundType}
                            onChange={e => setFundType(e.target.value as FundType)}
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm bg-white focus:outline-none focus:border-zinc-400"
                        >
                            <option value="Direct">Direct</option>
                            <option value="Trust">Trust</option>
                            <option value="Reimbursable">Reimbursable</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Public Law / Authority</label>
                    <input 
                        value={publicLaw}
                        onChange={e => setPublicLaw(e.target.value)} 
                        className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                        placeholder="e.g., PL 117-58 (IIJA)"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Authority Amount ($)</label>
                    <div className="relative mt-1">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input 
                            type="number"
                            value={authority}
                            onChange={e => setAuthority(Number(e.target.value))} 
                            className="w-full border border-zinc-200 rounded p-2 pl-8 text-sm focus:outline-none focus:border-zinc-400" 
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded flex items-center gap-2 text-rose-700 text-xs font-medium">
                        <AlertTriangle size={14} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded text-xs font-bold uppercase hover:bg-zinc-800">Create Document</button>
                </div>
            </form>
        </Modal>
    );
};

export default CWA_FADForm;
