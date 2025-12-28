import React, { useState } from 'react';
import { Save, Key, Building, ShieldCheck, DollarSign, Calculator } from 'lucide-react';
import { LGHLease, LeaseStatus } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    onClose: () => void;
    onSubmit: (lease: LGHLease) => void;
}

const LeaseForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<LGHLease>>({
        status: 'Active',
        startDate: new Date().toISOString().split('T')[0],
        units: 0,
        occupancyRate: 100,
        scoring: 'Operating'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.leaseNumber || !formData.propertyName) return;

        const newLease: LGHLease = {
            ...formData as LGHLease,
            id: `L-${Date.now()}`,
            annualRent: Number(formData.annualRent) || 0,
            fairMarketValue: Number(formData.fairMarketValue) || 0,
            auditLog: []
        };
        onSubmit(newLease);
    };

    return (
        <Modal title="Register LGH Portfolio Lease" subtitle="10 U.S.C. 2835 Compliance" onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in">
                <div className="bg-cyan-50 border border-cyan-100 p-5 rounded-3xl flex items-start gap-4 shadow-sm">
                    <ShieldCheck size={24} className="text-cyan-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-cyan-900 uppercase tracking-tight">Lifecycle Authority Monitor</p>
                        <p className="text-[10px] text-cyan-700 leading-relaxed mt-1">Registration here establishes the budgetary baseline for recurring O&M outlays. Automated scoring for capital vs operating lease (OMB A-11) will occur upon submission.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Property Name</label>
                        <input type="text" className="w-full border border-zinc-200 rounded-xl p-3 text-sm focus:border-cyan-500 outline-none" value={formData.propertyName || ''} onChange={e => setFormData({...formData, propertyName: e.target.value})} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">PIID / Lease Number</label>
                        <input type="text" className="w-full border border-zinc-200 rounded-xl p-3 text-sm font-mono focus:border-cyan-500" value={formData.leaseNumber || ''} onChange={e => setFormData({...formData, leaseNumber: e.target.value})} required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-100">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Annual Rent ($)</label>
                        <input type="number" className="w-full border border-zinc-200 rounded-xl p-3 text-sm font-mono font-bold" value={formData.annualRent || ''} onChange={e => setFormData({...formData, annualRent: Number(e.target.value)})} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Authorized Units</label>
                        <input type="number" className="w-full border border-zinc-200 rounded-xl p-3 text-sm font-mono" value={formData.units || ''} onChange={e => setFormData({...formData, units: Number(e.target.value)})} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Expiration Date</label>
                        <input type="date" className="w-full border border-zinc-200 rounded-xl p-3 text-sm" value={formData.expirationDate || ''} onChange={e => setFormData({...formData, expirationDate: e.target.value})} required />
                    </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-zinc-100">
                    <button type="submit" className="px-10 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-xl transition-all active:scale-95">
                        <Key size={16} className="inline mr-2"/> Commit to Portfolio
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LeaseForm;
