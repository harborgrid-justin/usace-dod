
import React, { useState } from 'react';
import { EncroachmentCase, EncroachmentType } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (newCase: EncroachmentCase) => void;
}

const EncroachmentCaseForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [form, setForm] = useState<Partial<EncroachmentCase>>({
        status: 'Reported',
        discoveryDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.assetId || !form.description) return;

        const newCase: EncroachmentCase = {
            id: `ENC-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`,
            assetId: form.assetId!,
            locationDescription: form.locationDescription || '',
            type: form.type as EncroachmentType || 'Structure',
            discoveryDate: form.discoveryDate!,
            description: form.description!,
            status: 'Reported',
            responsibleOfficial: form.responsibleOfficial || 'Unassigned',
            tasks: [],
            auditLog: [{ timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Case Created' }]
        };
        onSubmit(newCase);
    };

    return (
        <Modal title="Report Encroachment" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Real Property Asset ID (RPUID)</label>
                    <input className="w-full mt-1 border rounded p-2 text-sm" required onChange={e => setForm({...form, assetId: e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Encroachment Type</label>
                    <select className="w-full mt-1 border rounded p-2 text-sm bg-white" onChange={e => setForm({...form, type: e.target.value as EncroachmentType})}>
                        <option>Structure</option>
                        <option>Vegetation</option>
                        <option>Unauthorized Use</option>
                        <option>Boundary Dispute</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Discovery Date</label>
                    <input type="date" className="w-full mt-1 border rounded p-2 text-sm" value={form.discoveryDate} onChange={e => setForm({...form, discoveryDate: e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Location Details</label>
                    <input className="w-full mt-1 border rounded p-2 text-sm" placeholder="e.g. North Fence Line" onChange={e => setForm({...form, locationDescription: e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Description</label>
                    <textarea className="w-full mt-1 border rounded p-2 text-sm h-24" required onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Responsible Official</label>
                    <input className="w-full mt-1 border rounded p-2 text-sm" placeholder="e.g. Realty Specialist Name" onChange={e => setForm({...form, responsibleOfficial: e.target.value})} />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-rose-700">Submit Report</button>
                </div>
            </form>
        </Modal>
    );
};

export default EncroachmentCaseForm;
