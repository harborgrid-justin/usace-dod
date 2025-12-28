import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { PurchaseRequest, PRStatus } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (pr: PurchaseRequest) => void;
}

const PRFormModal: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<PurchaseRequest>>({
        date: new Date().toISOString().split('T')[0],
        status: 'Draft'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.description || !formData.amount || !formData.requester) return;

        /* Fix: Added missing auditLog property */
        const newPR: PurchaseRequest = {
            id: `PR-24-${String(Date.now()).slice(-4)}`,
            description: formData.description,
            amount: Number(formData.amount),
            requester: formData.requester,
            date: formData.date!,
            status: formData.status as PRStatus,
            justification: formData.justification,
            auditLog: []
        };
        onSubmit(newPR);
    };

    return (
        <Modal title="Create Purchase Request" subtitle="ENG Form 93 / PR&C" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description of Requirement</label>
                    <input 
                        type="text" 
                        className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Amount ($)</label>
                        <input 
                            type="number" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.amount || ''}
                            onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requester Code</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.requester || ''}
                            onChange={e => setFormData({...formData, requester: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification</label>
                    <textarea 
                        className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm resize-none"
                        rows={3}
                        value={formData.justification || ''}
                        onChange={e => setFormData({...formData, justification: e.target.value})}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2">
                        <Save size={14}/> Save PR
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PRFormModal;
