import React, { useState } from 'react';
import { RelocationBenefit, RelocationCase } from '../../types';
import { REMIS_THEME } from '../../constants';
import PageWithHeader from '../shared/PageWithHeader';

interface Props {
    caseData: RelocationCase;
    onSave: (benefit: Omit<RelocationBenefit, 'id' | 'status'>) => void;
    onClose: () => void;
}

const BenefitForm: React.FC<Props> = ({ caseData, onSave, onClose }) => {
    const [type, setType] = useState<RelocationBenefit['type']>('Moving Expenses');
    const [amount, setAmount] = useState<number | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || amount <= 0) return;
        onSave({ type, amount: Number(amount) });
    };

    return (
        <PageWithHeader title="Add Relocation Benefit" subtitle={`Case: ${caseData.id}`} onBack={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Benefit Type</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full mt-1 border rounded p-2 text-sm bg-white">
                        <option>Moving Expenses</option>
                        <option>Replacement Housing Payment</option>
                        <option>Advisory Services</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Benefit Amount ($)</label>
                    <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-1 border rounded p-2 text-sm font-mono" placeholder="0.00" required />
                </div>
                <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button type="submit" className={`px-4 py-2 text-white rounded-lg text-xs font-bold uppercase ${REMIS_THEME.classes.buttonPrimary}`}>Save Benefit</button>
                </div>
            </form>
        </PageWithHeader>
    );
};

export default BenefitForm;
