
import React, { useState } from 'react';
import { Save, AlertCircle, ShoppingCart, Database, Landmark, ShieldCheck } from 'lucide-react';
import { PurchaseRequest, PRStatus } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (pr: PurchaseRequest) => void;
}

const PRFormModal: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<PurchaseRequest>>({
        date: new Date().toISOString().split('T')[0],
        status: 'Draft',
        objectClass: '25.1 - Contracts',
        appropriation: '21 2020'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.description || !formData.amount || !formData.requester) return;

        const newPR: PurchaseRequest = {
            id: `PR-24-${String(Date.now()).slice(-4)}`,
            description: formData.description,
            amount: Number(formData.amount),
            requester: formData.requester,
            date: formData.date!,
            status: 'Pending Certification',
            justification: formData.justification,
            appropriation: formData.appropriation,
            objectClass: formData.objectClass,
            wbsCode: formData.wbsCode,
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'Requirement_Originator',
                action: 'Intake',
                details: 'PR established in system.'
            }]
        };
        onSubmit(newPR);
    };

    return (
        <Modal title="Requirement Intake Workspace" subtitle="Establish Fiduciary Requirement (ENG Form 93)" onClose={onClose}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in">
                {/* Instruction Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
                        <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><ShoppingCart size={140} /></div>
                        <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Landmark size={16}/> Requirement Protocol
                        </h4>
                        <div className="space-y-6 relative z-10">
                            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                                Submission of this requirement initiates the acquisition lifecycle. Funds will be committed upon formal certification by the G-8 Budget Officer.
                            </p>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Status Check</span>
                                <p className="text-xs font-bold text-emerald-400">Pre-Certification Phase</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-rose-700"/> Legal Basis
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium italic">
                            "Requirements must possess a valid Bona Fide Need for the current fiscal year to be eligible for obligation." - FMR Vol 3
                        </p>
                    </div>
                </div>

                {/* Form Panel */}
                <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-10">
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Narrative Description</label>
                            <textarea 
                                className="w-full border border-zinc-200 rounded-3xl p-5 text-sm focus:border-rose-400 transition-all outline-none bg-zinc-50/50 focus:bg-white shadow-inner h-24"
                                value={formData.description || ''}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="e.g., Annual software maintenance for hydraulic modeling suite..."
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Projected Magnitude ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-zinc-400">$</span>
                                    <input 
                                        type="number" 
                                        className="w-full border border-zinc-200 rounded-2xl p-4 pl-10 text-xl font-mono font-bold focus:border-rose-400 transition-all outline-none"
                                        value={formData.amount || ''}
                                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Requester EROC / Code</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-bold uppercase focus:border-rose-400 transition-all outline-none"
                                    value={formData.requester || ''}
                                    onChange={e => setFormData({...formData, requester: e.target.value})}
                                    placeholder="e.g., LRL-ED-D"
                                    required
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-50 rounded-[40px] border border-zinc-100 space-y-8 shadow-inner">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                <Database size={18} className="text-zinc-400"/> Accounting Logic String
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-2 block">Appropriation</label>
                                    <input className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs font-mono" value={formData.appropriation} onChange={e => setFormData({...formData, appropriation: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-2 block">Object Class</label>
                                    <input className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs font-mono" value={formData.objectClass} onChange={e => setFormData({...formData, objectClass: e.target.value})} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 mb-2 block">P2 WBS Structure</label>
                                    <input className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs font-mono" placeholder="123456.01.002" value={formData.wbsCode || ''} onChange={e => setFormData({...formData, wbsCode: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Formal Justification</label>
                            <textarea 
                                className="w-full border border-zinc-200 rounded-3xl p-5 text-sm focus:border-rose-400 transition-all outline-none bg-zinc-50/50 focus:bg-white shadow-inner h-40 leading-relaxed"
                                value={formData.justification || ''}
                                onChange={e => setFormData({...formData, justification: e.target.value})}
                                placeholder="Explain why this requirement is critical for mission success..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-zinc-100">
                        <button type="button" onClick={onClose} className="px-8 py-3 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50">Cancel Intake</button>
                        <button type="submit" className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-2xl active:scale-95 transition-all">
                            Submit Requirement Record
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default PRFormModal;
