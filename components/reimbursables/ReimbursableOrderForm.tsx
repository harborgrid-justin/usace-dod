
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { ReimbursableOrder, ReimbursableAgreement } from '../../types';
import Modal from '../shared/Modal';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    agreements: ReimbursableAgreement[];
    onClose: () => void;
    onSubmit: (order: ReimbursableOrder) => void;
    preSelectedAgreementId?: string;
}

const ReimbursableOrderForm: React.FC<Props> = ({ agreements, onClose, onSubmit, preSelectedAgreementId }) => {
    const [agreementId, setAgreementId] = useState(preSelectedAgreementId || '');
    const [orderNumber, setOrderNumber] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [authority, setAuthority] = useState('Economy Act (31 USC 1535)');
    const [frequency, setFrequency] = useState('Monthly');

    const selectedAgreement = agreements.find(a => a.id === agreementId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreementId || !orderNumber || !amount) return;

        const newOrder: ReimbursableOrder = {
            id: `ORD-${Date.now().toString().slice(-5)}`,
            agreementId,
            orderNumber,
            authority,
            amount: Number(amount),
            billingFrequency: frequency
        };
        onSubmit(newOrder);
    };

    return (
        <Modal title="Issue Reimbursable Order (FS Form 7600B)" subtitle="Funding Document" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Parent Agreement (GT&C)</label>
                    <select 
                        value={agreementId} 
                        onChange={e => setAgreementId(e.target.value)} 
                        className="w-full mt-1 border rounded p-2 text-sm bg-white"
                        disabled={!!preSelectedAgreementId}
                    >
                        <option value="">Select Agreement...</option>
                        {agreements.map(a => (
                            <option key={a.id} value={a.id}>{a.gtcNumber} - {a.buyer} ({formatCurrency(a.estimatedTotalValue)})</option>
                        ))}
                    </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Order Number</label>
                        <input type="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm" placeholder="O-24-..." required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount ($)</label>
                        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-1 border rounded p-2 text-sm" required />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Statutory Authority</label>
                    <select value={authority} onChange={e => setAuthority(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm bg-white">
                        <option>Economy Act (31 USC 1535)</option>
                        <option>Stafford Act</option>
                        <option>Chief Financial Officers Act</option>
                        <option>Project Order (41 USC 6307)</option>
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Billing Frequency</label>
                    <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm bg-white">
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Upon Completion</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2">
                        <Save size={14}/> Issue Order
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ReimbursableOrderForm;
