import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { ProjectOrder, RuleEvaluationResult } from '../../types';
import { evaluateRules } from '../../utils/rulesEngine';
import { MOCK_BUSINESS_RULES } from '../../constants';
import DetailsSection from './ProjectOrderDetailsSection';
import ComplianceSection from './ProjectOrderComplianceSection';

interface Props { onClose: () => void; onSubmit: (order: ProjectOrder) => void; }

const ProjectOrderForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [form, setForm] = useState({ orderNumber: '', description: '', providerId: '', totalAmount: 0, isDoDOwned: true, isSpecificDefiniteCertain: true, isSeverable: false, percentInHouse: 100 });
    const [rules, setRules] = useState<RuleEvaluationResult[]>([]);

    useEffect(() => {
        const relevant = MOCK_BUSINESS_RULES.filter(r => r.domain === 'Reimbursables');
        setRules(evaluateRules(relevant, form));
    }, [form]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const hasCritical = rules.some(r => !r.passed && r.severity === 'Critical');
        if (hasCritical) return alert("Block: Critical compliance error.");
        onSubmit({ ...form, id: `PO-${Date.now()}`, status: 'Draft (Advance Planning)', documents: {}, totalAmount: Number(form.totalAmount) } as any);
    };

    return (
        <Modal title="Create Project Order" onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <DetailsSection form={form} setForm={setForm} />
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount ($)</label>
                    <input type="number" value={form.totalAmount || ''} onChange={e => setForm({...form, totalAmount: Number(e.target.value)})} className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm font-mono font-bold" />
                </div>
                <ComplianceSection form={form} setForm={setForm} />
                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold uppercase text-zinc-500">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded text-xs font-bold uppercase">Initiate Order</button>
                </div>
            </form>
        </Modal>
    );
};
export default ProjectOrderForm;