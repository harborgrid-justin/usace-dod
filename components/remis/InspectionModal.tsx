
import React, { useState } from 'react';
import { OutgrantInspection, InspectionStatus } from '../../types';
import Modal from '../shared/Modal';
import { Save } from 'lucide-react';

interface Props {
    outgrantId: string;
    inspection: OutgrantInspection | null;
    onClose: () => void;
    onSave: (inspection: OutgrantInspection) => void;
}

const InspectionModal: React.FC<Props> = ({ outgrantId, inspection, onClose, onSave }) => {
    const [form, setForm] = useState<Partial<OutgrantInspection>>(inspection || {
        type: 'Compliance',
        status: 'Scheduled',
        scheduleDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newInspection: OutgrantInspection = {
            id: inspection?.id || `INSP-${Date.now()}`,
            outgrantId: outgrantId,
            type: form.type as any,
            scheduleDate: form.scheduleDate!,
            completionDate: form.completionDate,
            findings: form.findings || '',
            correctiveActions: form.correctiveActions || '',
            status: form.status as InspectionStatus,
            inspector: form.inspector || 'Unassigned'
        };
        onSave(newInspection);
    };

    return (
        <Modal title={inspection ? "Update Inspection" : "Schedule Inspection"} subtitle={`Ref: ${outgrantId}`} onClose={onClose} maxWidth="max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</label>
                        <select 
                            className="w-full mt-1 border rounded p-2 text-sm bg-white" 
                            value={form.type} 
                            onChange={e => setForm({...form, type: e.target.value as any})}
                        >
                            <option>Compliance</option>
                            <option>Utilization</option>
                            <option>Environmental</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                        <select 
                            className="w-full mt-1 border rounded p-2 text-sm bg-white" 
                            value={form.status} 
                            onChange={e => setForm({...form, status: e.target.value as any})}
                        >
                            <option>Scheduled</option>
                            <option>Completed</option>
                            <option>Reviewed</option>
                            <option>Closed</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Schedule Date</label>
                    <input 
                        type="date" 
                        className="w-full mt-1 border rounded p-2 text-sm" 
                        value={form.scheduleDate} 
                        onChange={e => setForm({...form, scheduleDate: e.target.value})} 
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Inspector Name</label>
                    <input 
                        className="w-full mt-1 border rounded p-2 text-sm" 
                        value={form.inspector || ''} 
                        onChange={e => setForm({...form, inspector: e.target.value})} 
                        placeholder="e.g. Ranger Smith"
                    />
                </div>

                {form.status !== 'Scheduled' && (
                    <div className="space-y-4 pt-4 border-t border-zinc-100 animate-in fade-in">
                         <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Completion Date</label>
                            <input 
                                type="date" 
                                className="w-full mt-1 border rounded p-2 text-sm" 
                                value={form.completionDate || ''} 
                                onChange={e => setForm({...form, completionDate: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Findings / Observations</label>
                            <textarea 
                                className="w-full mt-1 border rounded p-2 text-sm h-24" 
                                value={form.findings || ''} 
                                onChange={e => setForm({...form, findings: e.target.value})} 
                                placeholder="Describe compliance status..."
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Corrective Actions (If any)</label>
                            <textarea 
                                className="w-full mt-1 border rounded p-2 text-sm h-16" 
                                value={form.correctiveActions || ''} 
                                onChange={e => setForm({...form, correctiveActions: e.target.value})} 
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-zinc-800">
                        <Save size={14}/> Save Record
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default InspectionModal;
