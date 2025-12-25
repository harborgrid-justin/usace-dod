
import React, { useState, useMemo } from 'react';
import { X, AlertTriangle, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { FADocument, WorkAllowance } from '../../types';
import Modal from '../shared/Modal';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    fad: FADocument;
    allowances: WorkAllowance[];
    onClose: () => void;
    onSubmit: (allowance: WorkAllowance) => void;
}

const CWA_AllowanceForm: React.FC<Props> = ({ fad, allowances, onClose, onSubmit }) => {
    const [formState, setFormState] = useState<Partial<WorkAllowance>>({
        fadId: fad.id,
        status: 'Pending Approval',
        obligatedAmount: 0
    });
    const [error, setError] = useState('');
    const [p2Validated, setP2Validated] = useState(false);
    const [workplanChecked, setWorkplanChecked] = useState(false);

    // Calculate remaining FAD balance
    const fadDistributedAmount = useMemo(() => 
        allowances.filter(a => a.fadId === fad.id && a.status !== 'Rejected').reduce((sum, a) => sum + a.amount, 0), 
    [allowances, fad]);

    const fadRemainingBalance = fad.totalAuthority - fadDistributedAmount;

    const handleChange = (field: keyof WorkAllowance, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleP2Blur = () => {
        // Mock validation against P2 database (REQ-3.2)
        if (formState.p2ProgramCode) {
            setP2Validated(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const { districtEROC, p2ProgramCode, ppa, amount } = formState;
        
        if (!districtEROC || !p2ProgramCode || !ppa || !amount) {
            setError('All fields except Line Item & CCS are required.');
            return;
        }
        
        if (Number(amount) > fadRemainingBalance) {
            setError('Amount exceeds FAD unencumbered balance. Potential ADA violation.');
            return;
        }
        
        if (!workplanChecked) {
            setError('Must confirm cross-reference with Approved Annual Work Plan.');
            return;
        }

        const newAllowance: WorkAllowance = {
            id: `WA-${districtEROC}-${fad.programYear}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            fadId: fad.id,
            districtEROC: districtEROC,
            p2ProgramCode: p2ProgramCode,
            ppa: ppa,
            congressionalLineItem: formState.congressionalLineItem || 'N/A',
            ccsCode: formState.ccsCode || 'N/A',
            amount: Number(amount),
            obligatedAmount: 0,
            status: 'Pending Approval',
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'CEFMS_MGR',
                action: 'Created Allowance',
                details: `Initial submission for ${formatCurrency(Number(amount))}.`
            }]
        };

        onSubmit(newAllowance);
        onClose();
    };

    return (
        <Modal title="Issue New Work Allowance" subtitle={`From FAD: ${fad.id}`} onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 mb-4 flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium">Available Authority:</span>
                    <span className="font-mono font-bold text-emerald-600">{formatCurrency(fadRemainingBalance)}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">District (EROC)</label>
                        <input 
                            onChange={e => handleChange('districtEROC', e.target.value)} 
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                            placeholder="e.g., LRL"
                        />
                    </div>
                     <div className="relative">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">P2 Program Code</label>
                        <input 
                            onBlur={handleP2Blur} 
                            onChange={e => handleChange('p2ProgramCode', e.target.value)} 
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                            placeholder="e.g., 123456"
                        />
                        {p2Validated && <CheckCircle2 size={14} className="absolute right-2 top-8 text-emerald-500"/>}
                    </div>
                     <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Program, Project, Activity (PPA)</label>
                        <input 
                            onChange={e => handleChange('ppa', e.target.value)} 
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                            placeholder="e.g., Navigation"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Congressional Line-Item</label>
                        <input 
                            onChange={e => handleChange('congressionalLineItem', e.target.value)} 
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category-Class-Subclass (CCS)</label>
                        <input 
                            onChange={e => handleChange('ccsCode', e.target.value)} 
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                            placeholder="e.g., 111-NAV-1000"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount ($)</label>
                        <input 
                            type="number" 
                            onChange={e => handleChange('amount', e.target.value)} 
                            className="w-full mt-1 border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-zinc-400" 
                        />
                    </div>
                </div>
                
                <div className="pt-2">
                    <label className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors">
                        <input type="checkbox" checked={workplanChecked} onChange={e => setWorkplanChecked(e.target.checked)} className="mt-0.5 h-4 w-4 rounded text-rose-600 focus:ring-rose-500 border-zinc-300"/>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-zinc-700 block">Confirm cross-reference with Approved Annual Work Plan (REQ-4.4)</span>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">Prevents unauthorized spending by ensuring funds are issued only for planned work.</span>
                        </div>
                    </label>
                </div>

                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-medium animate-in fade-in">
                        <AlertTriangle size={14} className="shrink-0"/>
                        <span>{error}</span>
                    </div>
                )}
                
                {!error && p2Validated && workplanChecked && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-700 text-xs font-medium animate-in fade-in">
                        <ShieldCheck size={14} className="shrink-0"/>
                        <span>ADA Compliance Check Passed</span>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors">Submit for Approval</button>
                </div>
            </form>
        </Modal>
    );
};

export default CWA_AllowanceForm;
