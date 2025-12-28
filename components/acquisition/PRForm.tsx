
import React, { useActionState } from 'react';
import { Save, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { PurchaseRequest, PRStatus } from '../../types';
import MoneyInput from '../shared/MoneyInput';

interface Props {
    onCancel: () => void;
    onSubmit: (pr: PurchaseRequest) => void;
}

// Type for the state managed by useActionState
type PRFormState = {
    success: boolean;
    errors?: Record<string, string>;
    pr?: PurchaseRequest;
    data?: {
        description: string;
        amount: string;
        requester: string;
        justification: string;
    };
};

const initialState: PRFormState = {
    success: false,
    errors: {},
    data: { description: '', amount: '', requester: '', justification: '' }
};

// Action Logic (Pure Function)
// Principle 27: Mutation Atomicity - logic is encapsulated in an action
async function submitPRAction(prevState: PRFormState, formData: FormData): Promise<PRFormState> {
    // Simulate network delay to demonstrate pending state
    await new Promise(resolve => setTimeout(resolve, 800));

    const description = formData.get('description') as string;
    const amountStr = formData.get('amount') as string;
    const requester = formData.get('requester') as string;
    const justification = formData.get('justification') as string;

    const errors: Record<string, string> = {};
    if (!description || description.length < 5) errors.description = "Description must be at least 5 characters.";
    if (!amountStr || Number(amountStr) <= 0) errors.amount = "Amount must be greater than zero.";
    if (!requester) errors.requester = "Requester code is mandatory.";

    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: { description, amount: amountStr, requester, justification } };
    }

    const newPR: PurchaseRequest = {
        id: `PR-24-${String(Date.now()).slice(-4)}`,
        description,
        amount: Number(amountStr),
        requester,
        date: new Date().toISOString().split('T')[0],
        status: 'Draft' as PRStatus,
        justification,
        auditLog: []
    };

    return { success: true, pr: newPR, errors: {} };
}

const PRForm: React.FC<Props> = ({ onCancel, onSubmit }) => {
    const [state, formAction, isPending] = useActionState(submitPRAction, initialState);

    // Effect to handle success (side-effect)
    React.useEffect(() => {
        if (state.success && state.pr) {
            onSubmit(state.pr);
        }
    }, [state.success, state.pr, onSubmit]);

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

            <form action={formAction} className="space-y-6 max-w-4xl mx-auto w-full">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description of Requirement</label>
                    <input 
                        name="description"
                        type="text" 
                        defaultValue={state.data?.description}
                        className={`w-full mt-1.5 border rounded-lg p-3 text-sm focus:outline-none transition-all ${state.errors?.description ? 'border-rose-300 focus:border-rose-500 bg-rose-50/10' : 'border-zinc-200 focus:border-zinc-400'}`}
                        placeholder="e.g., Annual Software Licensing..."
                    />
                    {state.errors?.description && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {state.errors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Amount ($)</label>
                        <div className="relative mt-1.5">
                             <input 
                                name="amount"
                                type="number" 
                                step="0.01"
                                defaultValue={state.data?.amount}
                                className={`w-full pl-3 pr-3 py-2 border rounded-lg text-sm focus:outline-none transition-all font-mono ${state.errors?.amount ? 'border-rose-300 focus:border-rose-500' : 'border-zinc-200 focus:border-zinc-400'}`}
                                placeholder="0.00"
                            />
                        </div>
                        {state.errors?.amount && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {state.errors.amount}</p>}
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requester Code</label>
                        <input 
                            name="requester"
                            type="text" 
                            defaultValue={state.data?.requester}
                            className={`w-full mt-1.5 border rounded-lg p-3 text-sm focus:outline-none transition-all ${state.errors?.requester ? 'border-rose-300 focus:border-rose-500' : 'border-zinc-200 focus:border-zinc-400'}`}
                        />
                        {state.errors?.requester && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {state.errors.requester}</p>}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Justification</label>
                    <textarea 
                        name="justification"
                        defaultValue={state.data?.justification}
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
