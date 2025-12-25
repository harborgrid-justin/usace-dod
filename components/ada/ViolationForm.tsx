
import React, { useState } from 'react';
import { Gavel, X, AlertTriangle } from 'lucide-react';
import { ADAViolationType, ADAViolation } from '../../types';

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
        <div className="flex-1 flex flex-col h-full animate-in fade-in p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2"><Gavel size={24} className="text-zinc-800"/> Preliminary Violation Report</h3>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                    <p className="text-xs text-amber-900 leading-relaxed font-medium"><AlertTriangle size={14} className="inline mr-2 -mt-0.5" /> Reporting a suspected Antideficiency Act (ADA) violation initiates a formal preliminary review. Ensure all details are accurate per DoD FMR Vol 14, Ch 3.</p>
                </div>
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Violation Type</label><select value={formType} onChange={e => setFormType(e.target.value as ADAViolationType)} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400"><option>31 USC 1341(a)(1)(A) - Amount Limitation</option><option>31 USC 1341(a)(1)(B) - Advance of Appropriation</option><option>31 USC 1342 - Voluntary Services</option><option>31 USC 1517(a) - Admin Control Limitation</option><option>31 USC 1301 - Purpose Statute</option><option>31 USC 1502 - Time Limitation</option></select></div>
                <div className="grid grid-cols-2 gap-6">
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Organization</label><input type="text" value={formOrg} onChange={e => setFormOrg(e.target.value)} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400" placeholder="e.g., USACE" /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Amount ($)</label><input type="number" value={formAmount} onChange={e => setFormAmount(Number(e.target.value))} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400" /></div>
                </div>
                <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Incident Description</label><textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={5} className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:border-zinc-400" placeholder="Describe the circumstances, funds involved, and discovery method..." /></div>
                <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button><button type="submit" className="px-5 py-2.5 bg-zinc-900 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white hover:bg-zinc-800 transition-colors">Submit Report</button></div>
            </form>
        </div>
    );
};

export default ViolationForm;
