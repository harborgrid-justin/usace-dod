import React, { useState } from 'react';
import { CostTransfer } from '../../types';
import { MOCK_USACE_PROJECTS } from '../../constants';
// Fix: Added missing DollarSign icon to the lucide-react imports
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, FileText, Upload, ShieldCheck, Database, LayoutGrid, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    onCancel: () => void;
    onSubmit: (transfer: Omit<CostTransfer, 'id' | 'requestDate' | 'status' | 'auditLog'>) => void;
}

const steps = ['Source Authority', 'Target Destination', 'Transaction Details', 'Executive Review'];

const TransferWizard: React.FC<Props> = ({ onCancel, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        sourceProjectId: '', sourceWorkItem: '',
        targetProjectId: '', targetWorkItem: '',
        amount: 0, justification: '', requestedBy: 'Budget_Analyst_User'
    });
    const [error, setError] = useState('');

    const handleNext = () => {
        setError('');
        if (currentStep === 0 && !formData.sourceProjectId) { setError('Mission source authority is required.'); return; }
        if (currentStep === 1) {
            if (!formData.targetProjectId) { setError('Destination target authority required.'); return; }
            if (formData.sourceProjectId === formData.targetProjectId) { setError('Source and Target cannot be identical entities.'); return; }
        }
        if (currentStep === 2) {
            if (formData.amount <= 0) { setError('Transfer volume must be positive.'); return; }
            if (formData.justification.length < 20) { setError('Supplemental justification narrative is too brief for audit compliance.'); return; }
        }
        setCurrentStep(prev => prev + 1);
    };

    // Fix: Implemented missing handleSubmit function to call onSubmit prop
    const handleSubmit = () => {
        const { sourceProjectId, sourceWorkItem, targetProjectId, targetWorkItem, amount, justification, requestedBy } = formData;
        onSubmit({
            sourceProjectId,
            sourceWorkItem,
            targetProjectId,
            targetWorkItem,
            amount,
            justification,
            requestedBy
        });
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-[32px] shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right-10">
            <div className="p-8 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Financial Correction Engine</h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Cost Transfer Protocol • 31 U.S.C. § 1501</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase">Step {currentStep + 1} of 4</span>
                    </div>
                </div>
                
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-0" />
                    {steps.map((step, idx) => (
                        <div key={step} className={`flex flex-col items-center gap-3 relative z-10 bg-zinc-50 px-2 group ${idx <= currentStep ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                idx < currentStep ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 
                                idx === currentStep ? 'bg-white border-zinc-900 text-zinc-900 shadow-xl scale-110' : 
                                'bg-zinc-50 border-zinc-200 text-zinc-400'
                            }`}>
                                {idx < currentStep ? <CheckCircle size={20}/> : idx + 1}
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 max-w-[80px] text-center leading-tight">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-white">
                <div className="max-w-3xl mx-auto">
                    {currentStep === 0 && (
                        <div className="space-y-10 animate-in fade-in">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-rose-50 text-rose-700 rounded-3xl"><Database size={32}/></div>
                                <div>
                                    <h4 className="text-xl font-bold text-zinc-900">Select Credit Source</h4>
                                    <p className="text-sm text-zinc-500 font-medium">Identify the project currently burdened by the expenditure.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Source Project Authority</label>
                                    <select 
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-rose-400 transition-all appearance-none"
                                        value={formData.sourceProjectId}
                                        onChange={e => setFormData({...formData, sourceProjectId: e.target.value})}
                                    >
                                        <option value="">Search P2 Registry...</option>
                                        {MOCK_USACE_PROJECTS.map(p => <option key={p.id} value={`${p.id} - ${p.name}`}>{p.p2Number} - {p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Work Item Segment (WBS)</label>
                                    <input 
                                        type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-mono focus:outline-none focus:border-rose-400 transition-all"
                                        placeholder="e.g. 01.01.002"
                                        value={formData.sourceWorkItem}
                                        onChange={e => setFormData({...formData, sourceWorkItem: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-10 animate-in fade-in">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-3xl"><LayoutGrid size={32}/></div>
                                <div>
                                    <h4 className="text-xl font-bold text-zinc-900">Select Debit Target</h4>
                                    <p className="text-sm text-zinc-500 font-medium">Identify the destination project to receive the cost allocation.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Target Project Authority</label>
                                    <select 
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-400 transition-all appearance-none"
                                        value={formData.targetProjectId}
                                        onChange={e => setFormData({...formData, targetProjectId: e.target.value})}
                                    >
                                        <option value="">Search P2 Registry...</option>
                                        {MOCK_USACE_PROJECTS.map(p => <option key={p.id} value={`${p.id} - ${p.name}`}>{p.p2Number} - {p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Work Item Segment (WBS)</label>
                                    <input 
                                        type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-mono focus:outline-none focus:border-emerald-400 transition-all"
                                        placeholder="e.g. 03.05.001"
                                        value={formData.targetWorkItem}
                                        onChange={e => setFormData({...formData, targetWorkItem: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-10 animate-in fade-in">
                            {/* Fix: Applied DollarSign icon which was missing import */}
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-zinc-900 text-white rounded-3xl"><DollarSign size={32}/></div>
                                <div>
                                    <h4 className="text-xl font-bold text-zinc-900">Transfer Parameters</h4>
                                    <p className="text-sm text-zinc-500 font-medium">Define magnitude and formal justification.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Fiduciary Amount ($)</label>
                                    <input 
                                        type="number" className="w-full border border-zinc-200 rounded-2xl p-6 text-3xl font-mono font-bold focus:outline-none focus:border-zinc-900 transition-all"
                                        value={formData.amount || ''}
                                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Audit Narrative (Justification)</label>
                                    <textarea 
                                        className="w-full border border-zinc-200 rounded-2xl p-4 text-sm resize-none h-40 leading-relaxed focus:outline-none focus:border-zinc-900 transition-all"
                                        placeholder="Enter definitive rationale for reallocation. Required for FYE audit trail."
                                        value={formData.justification}
                                        onChange={e => setFormData({...formData, justification: e.target.value})}
                                    />
                                </div>
                                <div className="p-6 border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer">
                                    <Upload size={32} className="mb-3 opacity-20"/>
                                    <span className="text-xs font-bold uppercase tracking-widest">Attach Supporting Evidence</span>
                                    <span className="text-[9px] mt-1 font-medium">Contract Mod, Invoice, or Correction Memo</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-10 animate-in zoom-in duration-300">
                             <div className="bg-zinc-900 p-8 rounded-[40px] text-white shadow-2xl space-y-10">
                                <div className="flex justify-between items-start border-b border-white/10 pb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500 rounded-2xl text-zinc-900"><ShieldCheck size={24}/></div>
                                        <h4 className="text-xl font-bold">Execution Review</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Post Volume</p>
                                        <p className="text-3xl font-mono font-bold text-emerald-400">{formatCurrency(formData.amount)}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-2">Debit Source (Credit)</p>
                                        <p className="text-sm font-bold text-white leading-tight">{formData.sourceProjectId}</p>
                                        <p className="text-[10px] font-mono text-zinc-500 mt-2">WBS: {formData.sourceWorkItem}</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Debit Destination (Debit)</p>
                                        <p className="text-sm font-bold text-white leading-tight">{formData.targetProjectId}</p>
                                        <p className="text-[10px] font-mono text-zinc-500 mt-2">WBS: {formData.targetWorkItem}</p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Official Rationale</p>
                                    <p className="text-sm text-zinc-300 italic leading-relaxed">"{formData.justification}"</p>
                                </div>
                            </div>
                            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex gap-4 text-amber-900">
                                <AlertTriangle size={24} className="shrink-0 mt-0.5"/>
                                <p className="text-xs leading-relaxed font-medium">
                                    <strong>Statutory Certification:</strong> By submitting, you affirm that this reallocation adheres to purpose statutes and the receiving project possesses valid authority.
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold animate-in slide-in-from-bottom-2">
                            <AlertTriangle size={18} className="shrink-0"/>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 border-t border-zinc-100 bg-white flex justify-between items-center shrink-0">
                <button 
                    onClick={currentStep > 0 ? () => setCurrentStep(prev => prev - 1) : onCancel} 
                    className="flex items-center gap-2 px-6 py-3 border border-zinc-200 rounded-2xl text-xs font-bold uppercase text-zinc-500 hover:bg-zinc-50 transition-all"
                >
                    <ArrowLeft size={16}/> {currentStep > 0 ? 'Back' : 'Discard'}
                </button>

                <button 
                    onClick={currentStep < steps.length - 1 ? handleNext : handleSubmit}
                    className={`flex items-center gap-3 px-10 py-3 rounded-2xl text-xs font-bold uppercase transition-all shadow-xl active:scale-95 ${
                        currentStep === steps.length - 1 ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-zinc-900 text-white shadow-zinc-100'
                    }`}
                >
                    {currentStep === steps.length - 1 ? 'Execute Protocol' : 'Next Stage'} <ArrowRight size={18}/>
                </button>
            </div>
        </div>
    );
};

export default TransferWizard;