
import React, { useState } from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';
import { Obligation } from '../../types';
import Modal from '../shared/Modal';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { MOCK_FUND_HIERARCHY } from '../../constants';

interface Props {
    onClose: () => void;
    onSubmit: (o: Obligation) => void;
}

const ObligationForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Obligation>>({
        date: new Date().toISOString().split('T')[0],
        fiscalYear: new Date().getFullYear(),
        status: 'Open',
        obligationType: 'Misc',
        disbursedAmount: 0,
        unliquidatedAmount: 0
    });
    const [adaWarning, setAdaWarning] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Integration Check: Funds Availability
        if (formData.amount) {
            // Mocking a GL transaction structure to reuse the validator
            const mockTx: any = { lines: [{ fund: formData.appropriation }], totalAmount: formData.amount };
            const validation = IntegrationOrchestrator.validateGlAgainstAda(mockTx, MOCK_FUND_HIERARCHY);
            if (!validation.valid) {
                setAdaWarning(validation.message);
                return; // Block submission on ADA violation
            }
        }

        const newObligation: Obligation = {
            id: `OBL-${Date.now()}`,
            vendor: formData.vendor!,
            documentNumber: formData.documentNumber || `MISC-${Date.now().toString().slice(-6)}`,
            description: formData.description!,
            fiscalYear: formData.fiscalYear!,
            appropriation: formData.appropriation!,
            programElement: formData.programElement || 'N/A',
            objectClass: formData.objectClass!,
            amount: Number(formData.amount),
            disbursedAmount: 0,
            unliquidatedAmount: Number(formData.amount),
            status: 'Open',
            date: formData.date!,
            lastActivityDate: formData.date!,
            obligationType: formData.obligationType as any,
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'CURRENT_USER',
                action: 'Record',
                details: 'Manual obligation recorded via dashboard.'
            }]
        };

        onSubmit(newObligation);
    };

    return (
        <Modal title="Record Miscellaneous Obligation" subtitle="Non-Contractual Commitment (1341)" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</label>
                        <select 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2 text-xs bg-white"
                            value={formData.obligationType}
                            onChange={e => setFormData({...formData, obligationType: e.target.value as any})}
                        >
                            <option>Misc</option>
                            <option>Travel</option>
                            <option>Training</option>
                            <option>Utilities</option>
                            <option>GPC</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Document Number</label>
                        <input 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2 text-xs font-mono"
                            value={formData.documentNumber || ''}
                            onChange={e => setFormData({...formData, documentNumber: e.target.value})}
                            placeholder="Auto-generated if blank"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vendor / Payee</label>
                    <input 
                        className="w-full mt-1 border border-zinc-200 rounded-lg p-2 text-xs"
                        value={formData.vendor || ''}
                        onChange={e => setFormData({...formData, vendor: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                    <textarea 
                        className="w-full mt-1 border border-zinc-200 rounded-lg p-2 text-xs resize-none"
                        rows={2}
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold text-zinc-700">Accounting String</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <input className="border rounded p-1.5 text-xs" placeholder="Appropriation" value={formData.appropriation || ''} onChange={e => setFormData({...formData, appropriation: e.target.value})} required />
                        <input className="border rounded p-1.5 text-xs" placeholder="WBS / Cost Center" value={formData.programElement || ''} onChange={e => setFormData({...formData, programElement: e.target.value})} />
                        <input className="border rounded p-1.5 text-xs" placeholder="Object Class" value={formData.objectClass || ''} onChange={e => setFormData({...formData, objectClass: e.target.value})} required />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount ($)</label>
                    <input 
                        type="number"
                        className="w-full mt-1 border border-zinc-200 rounded-lg p-2 text-sm font-mono font-bold"
                        value={formData.amount || ''}
                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                        required
                    />
                </div>

                {adaWarning && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-rose-700 text-xs font-bold animate-in fade-in">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                        <span>{adaWarning}</span>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2">
                        <Save size={14}/> Record Obligation
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ObligationForm;
