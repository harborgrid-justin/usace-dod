import React, { useState, useMemo, useTransition } from 'react';
import { LGHLease, LeaseStatus, LeaseScoring } from '../../types';
import Modal from '../shared/Modal';
import { AlertTriangle, ShieldCheck, Landmark, DollarSign, Calculator, Info, FileText, Check, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import Badge from '../shared/Badge';

interface Props {
    lease: LGHLease | null;
    onClose: () => void;
    onSave: (lease: LGHLease) => void;
}

const LeaseDetailModal: React.FC<Props> = ({ lease, onClose, onSave }) => {
    const isNew = !lease;
    const [formData, setFormData] = useState<Partial<LGHLease>>(
        lease || {
            leaseNumber: '', propertyName: '', address: '', lessor: '',
            annualRent: 0, startDate: new Date().toISOString().split('T')[0],
            expirationDate: '', status: 'Active', occupancyRate: 0,
            units: 0, scoring: 'Operating', fairMarketValue: 0, auditLog: []
        }
    );
    const [isPending, startTransition] = useTransition();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.leaseNumber || !formData.propertyName) return;

        const newLease: LGHLease = {
            id: lease?.id || `L-${Date.now()}`,
            leaseNumber: formData.leaseNumber!,
            propertyName: formData.propertyName!,
            address: formData.address || '',
            lessor: formData.lessor || '',
            annualRent: Number(formData.annualRent),
            startDate: formData.startDate!,
            expirationDate: formData.expirationDate || '',
            status: formData.status as LeaseStatus,
            occupancyRate: Number(formData.occupancyRate),
            units: Number(formData.units),
            scoring: isCapitalScore ? 'Capital' : 'Operating',
            fairMarketValue: Number(formData.fairMarketValue),
            auditLog: lease?.auditLog || [{ timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Record Established' }]
        };
        
        startTransition(() => {
            onSave(newLease);
        });
    };

    // OMB A-11 Scoring Decision Engine (90% Threshold Test)
    const isCapitalScore = useMemo(() => {
        const rent = Number(formData.annualRent) || 0;
        const fmv = Number(formData.fairMarketValue) || 1;
        const term = 10; // Nominal evaluation term per regulation
        const totalRentNominal = rent * term;
        // In reality, this uses Net Present Value (NPV), using 90% test as simplified proxy
        return totalRentNominal > (fmv * 0.9);
    }, [formData.annualRent, formData.fairMarketValue]);

    return (
        <Modal title={isNew ? "Register Portfolio Lease" : "Strategic Asset Profile"} subtitle="OMB Circular A-11 Scoring Compliance" onClose={onClose} maxWidth="max-w-4xl">
            <form onSubmit={handleSave} className="space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Property Designation</label>
                            <input 
                                type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-bold bg-zinc-50/50 focus:bg-white focus:border-cyan-500 transition-all outline-none shadow-inner"
                                value={formData.propertyName}
                                onChange={e => setFormData({...formData, propertyName: e.target.value})}
                                placeholder="e.g. Sunset Heights (Phase II)" required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">PIID / Lease #</label>
                                <input type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-xs font-mono bg-zinc-50/50" value={formData.leaseNumber} onChange={e => setFormData({...formData, leaseNumber: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Execution Status</label>
                                <select className="w-full border border-zinc-200 rounded-2xl p-4 text-xs font-bold bg-zinc-50/50 focus:bg-white transition-all outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as LeaseStatus})}>
                                    <option>Active</option><option>Expiring</option><option>Pending Renewal</option><option>Holdover</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Situs Address</label>
                            <input type="text" className="w-full border border-zinc-200 rounded-2xl p-4 text-sm bg-zinc-50/50" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
                        <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Calculator size={120}/></div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 flex items-center gap-3 text-cyan-400">
                             <DollarSign size={16}/> Financial Commitment
                        </h4>
                        <div className="space-y-8 relative z-10">
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Calculated Annual Rent ($)</label>
                                <input type="number" className="w-full bg-transparent border-none p-0 text-3xl font-mono font-bold text-white focus:ring-0" value={formData.annualRent || ''} onChange={e => setFormData({...formData, annualRent: Number(e.target.value)})} placeholder="0.00" />
                            </div>
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Estimated FMV @ Inception</label>
                                <input type="number" className="w-full bg-transparent border-none p-0 text-3xl font-mono font-bold text-white focus:ring-0" value={formData.fairMarketValue || ''} onChange={e => setFormData({...formData, fairMarketValue: Number(e.target.value)})} placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[40px] border border-zinc-200 bg-zinc-100/50 space-y-6 shadow-inner relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                            <Shield size={16} className="text-cyan-700" /> Lifecycle Budget Scoring (90% Test)
                        </h4>
                        <div className="animate-in fade-in slide-in-from-right-2">
                            {isCapitalScore ? (
                                <Badge variant="danger">HIGH SCORE: CAPITAL LEASE</Badge>
                            ) : (
                                <Badge variant="success">LOW SCORE: OPERATING LEASE</Badge>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-6 relative z-10">
                        <div className={`p-4 rounded-2xl shadow-xl transition-all ${isCapitalScore ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                            {isCapitalScore ? <AlertTriangle size={28}/> : <ShieldCheck size={28}/>}
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-bold text-zinc-900">
                                {isCapitalScore ? 'Statutory Obligation Risk Detected' : 'Fiscal Authority Baseline Met'}
                            </p>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                {isCapitalScore 
                                    ? 'Warning: Total lease payments exceed 90% of asset FMV. Per OMB A-11, this requires full budget authority (up-front obligation) in the fiscal year of award.'
                                    : 'Requirement: Lease payments are within threshold. Multi-year incremental funding is permissible subject to standard Availability of Funds clauses.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-8 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-8 py-3 border border-zinc-200 rounded-2xl text-xs font-bold uppercase text-zinc-500 hover:bg-zinc-50 transition-all">Cancel</button>
                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 shadow-2xl active:scale-95 transition-all flex items-center gap-3 disabled:opacity-30"
                    >
                        {isPending ? <Check className="animate-pulse" size={18}/> : <FileText size={18}/>} 
                        {isPending ? 'Syncing...' : 'Commit Portfolio Record'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LeaseDetailModal;