
import React, { useState } from 'react';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { PurchaseRequest, PRStatus } from '../../types';
import MoneyInput from '../shared/MoneyInput';

interface Props {
    onCancel: () => void;
    onSubmit: (pr: PurchaseRequest) => void;
}

const PRForm: React.FC<Props> = ({ onCancel, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<PurchaseRequest>>({
        date: new Date().toISOString().split('T')[0],
        status: 'Draft'
    });
    
    // Opp 15: Structured Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.description || formData.description.length < 5) newErrors.description = "Description must be at least 5 characters.";
        if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount must be greater than zero.";
        if (!formData.requester) newErrors.requester = "Requester code is mandatory.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;

        const newPR: PurchaseRequest = {
            id: `PR-24-${String(Date.now()).slice(-4)}`,
            description: formData.description!,
            amount: Number(formData.amount),
            requester: formData.requester!,
            date: formData.date!,
            status: formData.status as PRStatus,
            justification: formData.justification,
            auditLog: []
        };
        onSubmit(newPR);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 animate-in slide-in-from-right-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Create Purchase Request</h3>
                    <p className="text-xs text-zinc-500">ENG Form 93 / PR&C</p>
                </div>
                <button onClick={onCancel} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14}/> Back to List
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto w-full">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description of Requirement</label>
                    <input 
                        type="text" 
                        className={`w-full mt-1.5 border rounded-lg p-3 text-sm focus:outline-none transition-all ${errors.description ? 'border-rose-300 focus:border-rose-500 bg-rose-50/10' : 'border-zinc-200 focus:border-zinc-400'}`}
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="e.g., Annual Software Licensing..."
                    />
                    {errors.description && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Amount ($)</label>
                        <MoneyInput
                            value={formData.amount || ''}
                            onChangeValue={val => setFormData({...formData, amount: val === '' ? undefined : val})}
                            className={`mt-1.5 p-3 ${errors.amount ? 'border-rose-300 focus:border-rose-500' : ''}`}
                        />
                        {errors.amount && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.amount}</p>}
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requester Code</label>
                        <input 
                            type="text" 
                            className={`w-full mt-1.5 border rounded-lg p-3 text-sm focus:outline-none transition-all ${errors.requester ? 'border-rose-300 focus:border-rose-500' : 'border-zinc-200 focus:border-zinc-400'}`}
                            value={formData.requester || ''}
                            onChange={e => setFormData({...formData, requester: e.target.value})}
                        />
                        {errors.requester && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.requester}</p>}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification</label>
                    <textarea 
                        className="w-full mt-1.5 border border-zinc-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-zinc-400 transition-all"
                        rows={6}
                        value={formData.justification || ''}
                        onChange={e => setFormData({...formData, justification: e.target.value})}
                        placeholder="Explain the necessity of this purchase..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                        <Save size={14}/> Save PR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PRForm;
