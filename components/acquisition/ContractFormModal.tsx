
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Contract, ContractStatus } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (contract: Contract) => void;
}

const ContractFormModal: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Contract>>({
        awardedDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.vendor || !formData.value) return;

        // Fix: Added missing gInvoicingStatus and other required properties to satisfy Contract interface
        const newContract: Contract = {
            id: formData.id,
            vendor: formData.vendor,
            type: formData.type || 'Firm Fixed Price',
            value: Number(formData.value),
            awardedDate: formData.awardedDate!,
            status: formData.status as ContractStatus,
            prReference: 'PR-PENDING',
            uei: 'UEI-PENDING',
            cageCode: 'CAGE-PENDING',
            periodOfPerformance: { start: formData.awardedDate!, end: '2025-09-30' },
            gInvoicingStatus: 'Not Applicable',
            isBerryCompliant: true,
            modifications: [],
            auditLog: []
        };
        onSubmit(newContract);
    };

    return (
        <Modal title="Award New Contract" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contract Number</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.id || ''}
                            onChange={e => setFormData({...formData, id: e.target.value})}
                            placeholder="W912QR-24-C-..."
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vendor Name</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.vendor || ''}
                            onChange={e => setFormData({...formData, vendor: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contract Type</label>
                        <select 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm bg-white"
                            value={formData.type || ''}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option>Firm Fixed Price</option>
                            <option>Cost Plus Fixed Fee</option>
                            <option>Time & Materials</option>
                            <option>Purchase Order</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Value ($)</label>
                        <input 
                            type="number" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.value || ''}
                            onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2">
                        <Save size={14}/> Award Contract
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ContractFormModal;
