
import React, { useState } from 'react';
import { Save, ShieldCheck, MapPin, Calculator } from 'lucide-react';
import { HAPCase } from '../../types';
import Modal from '../shared/Modal';
import { REMIS_THEME } from '../../constants';

interface Props {
    onClose: () => void;
    onSubmit: (c: HAPCase) => void;
}

const HAPCaseForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<HAPCase>>({
        status: 'New',
        submissionDate: new Date().toISOString().split('T')[0],
        applicantType: 'Military - PCS',
        programType: 'Expanded HAP',
        benefitAmount: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.applicantName || !formData.propertyAddress) return;

        const newCase: HAPCase = {
            ...formData as HAPCase,
            id: `HAP-24-${Math.floor(1000 + Math.random() * 9000)}`,
            assignedOfficer: 'Unassigned',
            purchasePrice: Number(formData.purchasePrice) || 0,
            mortgageBalance: Number(formData.mortgageBalance) || 0,
            benefitAmount: 0,
            purchaseDate: formData.purchaseDate || '',
            pcsOrderDate: formData.pcsOrderDate || ''
        };
        onSubmit(newCase);
    };

    return (
        <Modal title="HAP Intake Entry" subtitle="32 CFR Part 239 Certification" onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in">
                <div className="bg-teal-50 border border-teal-100 p-5 rounded-md flex items-start gap-4 shadow-sm">
                    <ShieldCheck size={24} className="text-teal-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-teal-900 uppercase tracking-tight">Statutory Eligibility Monitor</p>
                        <p className="text-[10px] text-teal-700 leading-relaxed mt-1 font-medium">This form establishes a formal claim against the OSD HAP fund. Ensure all mortgage servicer data matches current payoff statements to avoid improper payment flags.</p>
                    </div>
                </div>

                <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Applicant Full Name</label>
                            <input type="text" className="w-full border border-zinc-200 rounded-sm p-3 text-sm focus:border-teal-500 transition-all outline-none bg-zinc-50/50 focus:bg-white" value={formData.applicantName || ''} onChange={e => setFormData({...formData, applicantName: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Applicant Category</label>
                            <select className="w-full border border-zinc-200 rounded-sm p-3 text-sm bg-white" value={formData.applicantType} onChange={e => setFormData({...formData, applicantType: e.target.value})}>
                                <option>Military - PCS</option><option>Civilian - BRAC</option><option>Wounded Warrior</option><option>Surviving Spouse</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Situs (Property Address)</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" />
                            <input type="text" className="w-full border border-zinc-200 rounded-sm p-3 pl-10 text-sm focus:border-teal-500" value={formData.propertyAddress || ''} onChange={e => setFormData({...formData, propertyAddress: e.target.value})} required />
                        </div>
                    </div>
                </section>

                <section className="space-y-6 pt-6 border-t border-zinc-100">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Calculator size={14}/> Part 2: Financial Benchmarks
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Original Purchase Price ($)</label>
                            <input type="number" className="w-full border border-zinc-200 rounded-sm p-3 text-sm font-mono font-bold" value={formData.purchasePrice || ''} onChange={e => setFormData({...formData, purchasePrice: Number(e.target.value)})} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Current Payoff Balance ($)</label>
                            <input type="number" className="w-full border border-zinc-200 rounded-sm p-3 text-sm font-mono font-bold" value={formData.mortgageBalance || ''} onChange={e => setFormData({...formData, mortgageBalance: Number(e.target.value)})} required />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-8 border-t border-zinc-100">
                    <button type="submit" className={`px-10 py-3 text-white rounded-sm text-xs font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95 ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Save size={16} className="inline mr-2"/> Establish Claim File
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default HAPCaseForm;
