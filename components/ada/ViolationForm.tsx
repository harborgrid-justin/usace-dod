import React, { useState } from 'react';
import { Gavel, X, AlertTriangle, Save } from 'lucide-react';
import { ADAViolationType, ADAViolation } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (violation: ADAViolation) => void;
}

const ViolationForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formType, setFormType] = useState<ADAViolationType>('31 USC 1517(a) - Admin Control Limitation');
    const [formOrg, setFormOrg] = useState('');
    const [formAmount, setFormAmount] = useState<number | ''>('');
    const [formDesc, setFormDesc] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formOrg || !formAmount || !formDesc) return;

        const newViolation: ADAViolation = {
            id: `ADA-24-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            status: 'Suspected',
            type: formType,
            discoveryDate: new Date().toISOString().split('T')[0],
            amount: Number(formAmount),
            organization: formOrg,
            description: formDesc
        };
        onSubmit(newViolation);
    };

    return (
        <Modal title="Suspected ADA Violation" subtitle="31 U.S.C. §§ 1341, 1342, 1517" onClose={onClose} maxWidth="max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4 text-amber-900 shadow-inner">
                    <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed font-medium">
                        <strong>Mandatory Action:</strong> Formal discovery of a potential Antideficiency Act violation requires immediate preliminary reporting to the OUSD(C) per FMR Volume 14.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Statutory Category</label>
                        <select 
                            value={formType} 
                            onChange={e => setFormType(e.target.value as ADAViolationType)} 
                            className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-zinc-400 transition-all appearance-none"
                        >
                            <option>31 USC 1341(a)(1)(A) - Amount Limitation</option>
                            <option>31 USC 1341(a)(1)(B) - Advance of Appropriation</option>
                            <option>31 USC 1342 - Voluntary Services</option>
                            <option>31 USC 1517(a) - Admin Control Limitation</option>
                            <option>31 USC 1301 - Purpose Statute</option>
                            <option>31 USC 1502 - Time Limitation</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Responsible Organization</label>
                            <input 
                                type="text" value={formOrg} 
                                onChange={e => setFormOrg(e.target.value)} 
                                className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-400" 
                                placeholder="e.g., USACE-HQ" 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Violation Magnitude ($)</label>
                            <input 
                                type="number" value={formAmount} 
                                onChange={e => setFormAmount(Number(e.target.value))} 
                                className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:border-zinc-400" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Discovery Rationale</label>
                        <textarea 
                            value={formDesc} 
                            onChange={e => setFormDesc(e.target.value)} 
                            rows={4} 
                            className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-zinc-400 leading-relaxed" 
                            placeholder="Describe how the potential violation was identified and which funds were impacted..." 
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 border border-zinc-200 rounded-xl text-xs font-bold uppercase text-zinc-500 hover:bg-zinc-50 transition-all">Cancel</button>
                    <button type="submit" className="px-8 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-100">
                        <Gavel size={14}/> Submit Preliminary Case
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ViolationForm;