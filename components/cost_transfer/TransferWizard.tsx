
import React, { useState } from 'react';
import { CostTransfer } from '../../types';
import { MOCK_USACE_PROJECTS } from '../../constants';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, FileText, Upload } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    onCancel: () => void;
    onSubmit: (transfer: Omit<CostTransfer, 'id' | 'requestDate' | 'status' | 'auditLog'>) => void;
}

const steps = ['Source', 'Target', 'Details', 'Review'];

const TransferWizard: React.FC<Props> = ({ onCancel, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        sourceProjectId: '',
        sourceWorkItem: '',
        targetProjectId: '',
        targetWorkItem: '',
        amount: 0,
        justification: '',
        requestedBy: 'Current User'
    });
    const [error, setError] = useState('');

    const handleNext = () => {
        setError('');
        if (currentStep === 0) {
            if (!formData.sourceProjectId) { setError('Source project required.'); return; }
        }
        if (currentStep === 1) {
            if (!formData.targetProjectId) { setError('Target project required.'); return; }
            if (formData.sourceProjectId === formData.targetProjectId) { setError('Source and Target cannot be the same project.'); return; }
        }
        if (currentStep === 2) {
            if (formData.amount <= 0) { setError('Amount must be positive.'); return; }
            if (!formData.justification) { setError('Justification required for audit trail.'); return; }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const projects = MOCK_USACE_PROJECTS;

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden animate-in slide-in-from-right-4">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight mb-2">New Cost Transfer Request</h3>
                <div className="flex items-center gap-2">
                    {steps.map((step, idx) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center gap-2 ${idx <= currentStep ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                    idx < currentStep ? 'bg-zinc-900 text-white border-zinc-900' : 
                                    idx === currentStep ? 'bg-white text-zinc-900 border-zinc-900' : 
                                    'bg-zinc-50 text-zinc-400 border-zinc-200'
                                }`}>
                                    {idx < currentStep ? <CheckCircle size={12}/> : idx + 1}
                                </div>
                                <span className="text-xs font-bold uppercase">{step}</span>
                            </div>
                            {idx < steps.length - 1 && <div className="w-8 h-px bg-zinc-200" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto">
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-in fade-in">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2 text-rose-700">
                                Step 1: Identify Source (Credit)
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Project</label>
                                    <select 
                                        className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:border-rose-400 transition-all bg-white"
                                        value={formData.sourceProjectId}
                                        onChange={e => setFormData({...formData, sourceProjectId: e.target.value})}
                                    >
                                        <option value="">Select Source Project...</option>
                                        {projects.map(p => <option key={p.id} value={`${p.id} - ${p.name}`}>{p.p2Number} - {p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Work Item (WBS)</label>
                                    <input 
                                        type="text" 
                                        className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:border-rose-400 transition-all"
                                        placeholder="e.g. 01.01 Mobilization"
                                        value={formData.sourceWorkItem}
                                        onChange={e => setFormData({...formData, sourceWorkItem: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2 text-emerald-700">
                                Step 2: Identify Target (Debit)
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Project</label>
                                    <select 
                                        className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-400 transition-all bg-white"
                                        value={formData.targetProjectId}
                                        onChange={e => setFormData({...formData, targetProjectId: e.target.value})}
                                    >
                                        <option value="">Select Target Project...</option>
                                        {projects.map(p => <option key={p.id} value={`${p.id} - ${p.name}`}>{p.p2Number} - {p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Work Item (WBS)</label>
                                    <input 
                                        type="text" 
                                        className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-400 transition-all"
                                        placeholder="e.g. 03.02 Concrete Works"
                                        value={formData.targetWorkItem}
                                        onChange={e => setFormData({...formData, targetWorkItem: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                Step 3: Transaction Details
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Transfer Amount ($)</label>
                                    <input 
                                        type="number" 
                                        className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:border-zinc-400 transition-all"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Justification</label>
                                    <textarea 
                                        className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm resize-none h-32 focus:outline-none focus:border-zinc-400 transition-all"
                                        placeholder="Detailed reason for cost movement (e.g., error correction, scope change)..."
                                        value={formData.justification}
                                        onChange={e => setFormData({...formData, justification: e.target.value})}
                                    />
                                </div>
                                <div className="p-4 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer">
                                    <Upload size={24} className="mb-2"/>
                                    <span className="text-xs font-bold uppercase">Upload Supporting Docs</span>
                                    <span className="text-[10px]">(Optional)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in">
                            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                Step 4: Final Review
                            </h4>
                            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Amount</p>
                                        <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(formData.amount)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Requester</p>
                                        <p className="text-sm font-bold text-zinc-900">{formData.requestedBy}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-rose-700 uppercase mb-1">Source (Credit)</p>
                                        <p className="text-sm font-bold text-zinc-800">{formData.sourceProjectId}</p>
                                        <p className="text-xs text-zinc-500 font-mono mt-1">{formData.sourceWorkItem || 'General'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Target (Debit)</p>
                                        <p className="text-sm font-bold text-zinc-800">{formData.targetProjectId}</p>
                                        <p className="text-xs text-zinc-500 font-mono mt-1">{formData.targetWorkItem || 'General'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Justification</p>
                                    <p className="text-xs text-zinc-600 italic bg-white p-3 rounded border border-zinc-100">{formData.justification}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100 text-xs">
                                <AlertTriangle size={16} className="shrink-0"/>
                                <p>By submitting, you certify this transfer complies with ER 37-1-30 and does not violate purpose/time/amount statutes.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-bold animate-in fade-in">
                            <AlertTriangle size={14}/> {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 bg-white flex justify-between items-center">
                {currentStep > 0 ? (
                    <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase">
                        <ArrowLeft size={14}/> Back
                    </button>
                ) : (
                    <button onClick={onCancel} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase">Cancel</button>
                )}

                {currentStep < steps.length - 1 ? (
                    <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-all">
                        Next Step <ArrowRight size={14}/>
                    </button>
                ) : (
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200">
                        <FileText size={14}/> Submit Request
                    </button>
                )}
            </div>
        </div>
    );
};

export default TransferWizard;
