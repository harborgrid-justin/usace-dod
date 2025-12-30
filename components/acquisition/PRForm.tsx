
import React, { useState } from 'react';
import { Save, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { PurchaseRequest, PRStatus } from '../../types';

interface Props {
    onCancel: () => void;
    onSubmit: (pr: PurchaseRequest) => void;
}

const PRForm: React.FC<Props> = ({ onCancel, onSubmit }) => {
    const [isPending, setIsPending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        requester: '',
        justification: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setErrors({});

        // Simulate validation processing
        await new Promise(resolve => setTimeout(resolve, 800));

        const newErrors: Record<string, string> = {};
        if (!formData.description || formData.description.length < 5) newErrors.description = "Description must be at least 5 characters.";
        if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = "Amount must be greater than zero.";
        if (!formData.requester) newErrors.requester = "Requester code is mandatory.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsPending(false);
            return;
        }

        const newPR: PurchaseRequest = {
            id: `PR-24-${String(Date.now()).slice(-4)}`,
            description: formData.description,
            amount: Number(formData.amount),
            requester: formData.requester,
            date: new Date().toISOString().split('T')[0],
            status: 'Draft' as PRStatus,
            justification: formData.justification,
            auditLog: []
        };
        
        onSubmit(newPR);
        setIsPending(false);
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
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className={`w-full mt-1.5 border rounded-lg p-3 text-sm focus:outline-none transition-all ${errors.description ? 'border-rose-300 focus:border-rose-500 bg-rose-50/10' : 'border-zinc-200 focus:border-zinc-400'}`}
                        placeholder="e.g., Annual Software Licensing..."
                    />
                    {errors.description && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Amount ($)</label>
                        <div className="relative mt-1.5">
                             <input 
                                type="number" 
                                step="0.01"
                                value={formData.amount}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                className={`w-full pl-3 pr-3 py-2 border rounded-lg text-sm focus:outline-none transition-all font-mono ${errors.amount ? 'border-rose-300 focus:border-rose-500' : 'border-zinc-200 focus:border-zinc-400'}`}
                                placeholder="0.00"
                            />
                        </div>
                        {errors.amount && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.amount}</p>}
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requester Code</label>
                        <input 
                            type="text" 
                            value={formData.requester}
                            onChange={e => setFormData({...formData, requester: e.target.value})}
                            className={`w-full mt-1.5 border rounded-lg p-3 text-sm focus:outline-none transition-all ${errors.requester ? 'border-rose-300 focus:border-rose-500' : 'border-zinc-200 focus:border-zinc-400'}`}
                        />
                        {errors.requester && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.requester}</p>}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification</label>
                    <textarea 
                        value={formData.justification}
                        onChange={e => setFormData({...formData, justification: e.target.value})}
                        className="w-full mt-1.5 border border-zinc-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-zinc-400 transition-all"
                        rows={6}
                        placeholder="Explain the necessity of this purchase..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50 transition-colors">Cancel</button>
                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14}/>}
                        {isPending ? 'Processing...' : 'Save PR'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PRForm;
