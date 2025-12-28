import React, { useState } from 'react';
import { Outgrant, OutgrantType, OutgrantStatus } from '../../types';
import Modal from '../shared/Modal';
import { Save, Calendar, Info, ShieldAlert } from 'lucide-react';
import { REMIS_THEME } from '../../constants';

interface Props {
    onClose: () => void;
    onSubmit: (outgrant: Outgrant) => void;
}

const OutgrantForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Outgrant>>({
        status: 'Proposed',
        type: 'Lease',
        paymentFrequency: 'Annual',
        authority: '10 USC 2667',
        nextPaymentDate: new Date().toISOString().split('T')[0],
        termStart: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.grantee || !formData.annualRent || !formData.expirationDate) return;

        const outgrant: Outgrant = {
            id: `DACW-${Math.floor(Math.random() * 9000) + 1000}`,
            grantee: formData.grantee,
            type: formData.type as OutgrantType,
            authority: formData.authority || '10 USC 2667',
            permittedUse: formData.permittedUse || 'General Use',
            location: formData.location || 'Multiple Sites',
            annualRent: Number(formData.annualRent),
            termStart: formData.termStart,
            expirationDate: formData.expirationDate,
            status: formData.status as OutgrantStatus,
            paymentFrequency: formData.paymentFrequency || 'Annual',
            nextPaymentDate: formData.nextPaymentDate || '',
            auditLog: [{ timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Created' }],
            versionHistory: []
        };
        onSubmit(outgrant);
    };

    return (
        <Modal title="Initiate Real Estate Outgrant" subtitle="10 U.S.C. § 2667 Requirement (Req 12.1)" onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                    <ShieldAlert size={20} className="text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-blue-800 leading-relaxed font-medium uppercase tracking-tight">Standardization Note: All outgrants must be recorded in the REMIS authoritative database prior to execution of formal legal instruments.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Grantee Identity (Entity Name) *</label>
                        <input className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm focus:border-emerald-600 outline-none" value={formData.grantee || ''} onChange={e => setFormData({...formData, grantee: e.target.value})} required placeholder="e.g. Commonwealth of Kentucky"/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Grant Type</label>
                        <select className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm bg-white outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                            <option>Lease</option><option>Easement</option><option>License</option><option>Permit</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Authority</label>
                        <select className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm bg-white outline-none" value={formData.authority} onChange={e => setFormData({...formData, authority: e.target.value})}>
                            <option>10 USC 2667 (General)</option>
                            <option>10 USC 2668 (Easements)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Annual Value ($)</label>
                        <input type="number" className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm font-mono font-bold" value={formData.annualRent || ''} onChange={e => setFormData({...formData, annualRent: Number(e.target.value)})} required/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Start Date</label>
                        <input type="date" className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm" value={formData.termStart} onChange={e => setFormData({...formData, termStart: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Expiration *</label>
                        <input type="date" className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm font-bold text-rose-600" value={formData.expirationDate || ''} onChange={e => setFormData({...formData, expirationDate: e.target.value})} required/>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 border border-zinc-200 rounded-xl text-[10px] font-bold uppercase text-zinc-500 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className={`px-8 py-2.5 text-white rounded-xl text-[10px] font-bold uppercase shadow-lg ${REMIS_THEME.classes.buttonPrimary}`}>
                        Establish Record
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default OutgrantForm;