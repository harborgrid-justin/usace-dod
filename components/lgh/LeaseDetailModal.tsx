
import React, { useState } from 'react';
import { LGHLease, LeaseStatus, LeaseScoring } from '../../types';
import Modal from '../shared/Modal';
import { formatCurrency } from '../../utils/formatting';
import { Calendar, Building, DollarSign, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
    lease: LGHLease | null;
    onClose: () => void;
    onSave: (lease: LGHLease) => void;
}

const LeaseDetailModal: React.FC<Props> = ({ lease, onClose, onSave }) => {
    const isNew = !lease;
    const [formData, setFormData] = useState<Partial<LGHLease>>(
        lease || {
            leaseNumber: '',
            propertyName: '',
            address: '',
            lessor: '',
            annualRent: 0,
            startDate: new Date().toISOString().split('T')[0],
            expirationDate: '',
            status: 'Active',
            occupancyRate: 0,
            units: 0,
            scoring: 'Operating',
            fairMarketValue: 0,
            auditLog: []
        }
    );

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
            scoring: formData.scoring as LeaseScoring,
            fairMarketValue: Number(formData.fairMarketValue),
            auditLog: lease?.auditLog || []
        };
        onSave(newLease);
    };

    // OMB A-11 Scoring Logic Check
    const totalLeaseValue = Number(formData.annualRent) * 5; // Simplified 5-year assumption
    const isCapitalLease = totalLeaseValue > (Number(formData.fairMarketValue) * 0.9);

    return (
        <Modal title={isNew ? "Add New Lease" : `Lease: ${formData.leaseNumber}`} onClose={onClose} maxWidth="max-w-3xl">
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Property Name</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.propertyName}
                            onChange={e => setFormData({...formData, propertyName: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lease Number</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm font-mono"
                            value={formData.leaseNumber}
                            onChange={e => setFormData({...formData, leaseNumber: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lessor</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.lessor}
                            onChange={e => setFormData({...formData, lessor: e.target.value})}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Address</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Start Date</label>
                        <input 
                            type="date" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expiration Date</label>
                        <input 
                            type="date" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.expirationDate}
                            onChange={e => setFormData({...formData, expirationDate: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Annual Rent ($)</label>
                        <input 
                            type="number" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm font-mono"
                            value={formData.annualRent}
                            onChange={e => setFormData({...formData, annualRent: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fair Market Value ($)</label>
                        <input 
                            type="number" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm font-mono"
                            value={formData.fairMarketValue}
                            onChange={e => setFormData({...formData, fairMarketValue: Number(e.target.value)})}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Units</label>
                        <input 
                            type="number" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.units}
                            onChange={e => setFormData({...formData, units: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Occupancy Rate (%)</label>
                        <input 
                            type="number" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm"
                            value={formData.occupancyRate}
                            onChange={e => setFormData({...formData, occupancyRate: Number(e.target.value)})}
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                        <select 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm bg-white"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as LeaseStatus})}
                        >
                            <option>Active</option>
                            <option>Expiring</option>
                            <option>Pending Renewal</option>
                            <option>Holdover</option>
                            <option>Terminated</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Scoring (OMB A-11)</label>
                        <select 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-2.5 text-sm bg-white"
                            value={formData.scoring}
                            onChange={e => setFormData({...formData, scoring: e.target.value as LeaseScoring})}
                        >
                            <option>Operating</option>
                            <option>Capital</option>
                        </select>
                    </div>
                </div>

                {/* Scoring Analysis */}
                <div className={`p-4 rounded-xl border ${isCapitalLease ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${isCapitalLease ? 'text-rose-800' : 'text-emerald-800'}`}>
                        {isCapitalLease ? <AlertTriangle size={16}/> : <ShieldCheck size={16}/>}
                        {isCapitalLease ? 'Capital Lease Indicator' : 'Operating Lease Indicator'}
                    </h4>
                    <p className={`text-xs mt-1 ${isCapitalLease ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isCapitalLease 
                            ? `Warning: Net Present Value of lease payments exceeds 90% of Fair Market Value. Must be scored as Capital Lease.`
                            : `Valid: Net Present Value of lease payments is below 90% of Fair Market Value. Can be scored as Operating Lease.`
                        }
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Save Lease</button>
                </div>
            </form>
        </Modal>
    );
};

export default LeaseDetailModal;
