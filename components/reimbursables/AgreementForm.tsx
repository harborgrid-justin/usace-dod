
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { ReimbursableAgreement } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (agreement: ReimbursableAgreement) => void;
}

const AgreementForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [buyer, setBuyer] = useState('');
    const [seller, setSeller] = useState('USACE');
    const [gtcNumber, setGtcNumber] = useState('');
    const [ceiling, setCeiling] = useState<number | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!buyer || !gtcNumber || !ceiling) return;

        /**
         * Fix: Added missing 'sender' property to satisfy ReimbursableAgreement interface
         */
        const newAgreement: ReimbursableAgreement = {
            id: `AGR-${Date.now().toString().slice(-5)}`,
            buyer,
            sender: seller,
            seller,
            gtcNumber,
            status: 'Active',
            estimatedTotalValue: Number(ceiling)
        };
        onSubmit(newAgreement);
    };

    return (
        <Modal title="Establish New Agreement (FS Form 7600A)" subtitle="General Terms & Conditions (GT&C)" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Buyer (Requesting Agency)</label>
                        <input type="text" value={buyer} onChange={e => setBuyer(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm" placeholder="e.g. FEMA" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Seller (Servicing Agency)</label>
                        <input type="text" value={seller} onChange={e => setSeller(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm" />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">GT&C Number</label>
                    <input type="text" value={gtcNumber} onChange={e => setGtcNumber(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm" placeholder="A-24-..." required />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Total Value ($)</label>
                    <input type="number" value={ceiling} onChange={e => setCeiling(Number(e.target.value))} className="w-full mt-1 border rounded p-2 text-sm" placeholder="0.00" required />
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2">
                        <Save size={14}/> Create Agreement
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AgreementForm;
