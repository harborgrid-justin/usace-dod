
import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Contract, ContractStatus } from '../../types';

interface Props {
    onCancel: () => void;
    onSubmit: (contract: Contract) => void;
}

const ContractForm: React.FC<Props> = ({ onCancel, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Contract>>({
        awardedDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.vendor || !formData.value) return;

        // Fix: Added missing gInvoicingStatus and other required properties to satisfy Contract interface
        const newContract: Contract = {
            id: formData.id,
            vendor: formData.vendor,
            type: formData.type || 'Firm Fixed Price',
            value: Number(formData.value),
            awardedDate: formData.awardedDate!,
            status: formData.status as ContractStatus,
            prReference: 'PR-PENDING',
            uei: 'UEI-PENDING',
            cageCode: 'CAGE-PENDING',
            periodOfPerformance: { start: formData.awardedDate!, end: '2025-09-30' },
            gInvoicingStatus: 'Not Applicable',
            isBerryCompliant: true,
            modifications: [],
            auditLog: []
        };
        onSubmit(newContract);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 animate-in slide-in-from-right-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Award New Contract</h3>
                    <p className="text-xs text-zinc-500">Contract Ledger Entry</p>
                </div>
                <button onClick={onCancel} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14}/> Back to Ledger
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contract Number</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                            value={formData.id || ''}
                            onChange={e => setFormData({...formData, id: e.target.value})}
                            placeholder="W912QR-24-C-..."
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vendor Name</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                            value={formData.vendor || ''}
                            onChange={e => setFormData({...formData, vendor: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contract Type</label>
                        <select 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-zinc-400 transition-all"
                            value={formData.type || ''}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option>Firm Fixed Price</option>
                            <option>Cost Plus Fixed Fee</option>
                            <option>Time & Materials</option>
                            <option>Purchase Order</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Value ($)</label>
                        <input 
                            type="number" 
                            className="w-full mt-1 border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                            value={formData.value || ''}
                            onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                        <Save size={14}/> Award Contract
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContractForm;
