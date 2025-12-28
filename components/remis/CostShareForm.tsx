
import React, { useState } from 'react';
import { CostShareRecord, CostShareStatus } from '../../types';
import Modal from '../shared/Modal';
import { Save } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSubmit: (record: CostShareRecord) => void;
}

const CostShareForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<CostShareRecord>>({
        status: 'Initiated',
        contributionType: 'Cash',
        valuationMethod: 'Standard',
        agreementDate: new Date().toISOString().split('T')[0],
        percentage: { federal: 65, nonFederal: 35 }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.sponsorName || !formData.projectOrAssetId || !formData.authority) return;

        const record: CostShareRecord = {
            id: `CS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            projectOrAssetId: formData.projectOrAssetId,
            authority: formData.authority,
            sponsorName: formData.sponsorName,
            percentage: formData.percentage || { federal: 65, nonFederal: 35 },
            contributionType: formData.contributionType as any,
            valuationMethod: formData.valuationMethod as any,
            status: formData.status as CostShareStatus,
            agreementDate: formData.agreementDate!,
            totalValue: Number(formData.totalValue) || 0,
            contributedValue: 0,
            auditLog: [{ timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Created', details: 'Record established.' }],
            adjustments: []
        };
        onSubmit(record);
    };

    return (
        <Modal title="Establish Cost-Share Agreement" subtitle="33 U.S.C. §2211 / ER 405-1-12" onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Non-Federal Sponsor</label>
                        <input className="w-full mt-1 border rounded p-2 text-sm" value={formData.sponsorName || ''} onChange={e => setFormData({...formData, sponsorName: e.target.value})} required placeholder="e.g. Flood Control District"/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Linked Project/Asset ID</label>
                        <input className="w-full mt-1 border rounded p-2 text-sm" value={formData.projectOrAssetId || ''} onChange={e => setFormData({...formData, projectOrAssetId: e.target.value})} required/>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Authority</label>
                    <select className="w-full mt-1 border rounded p-2 text-sm bg-white" value={formData.authority} onChange={e => setFormData({...formData, authority: e.target.value})}>
                        <option value="">Select Authority...</option>
                        <option value="33 U.S.C. 2211 (Harbor Dev)">33 U.S.C. 2211 (Harbor Dev)</option>
                        <option value="33 U.S.C. 2213 (Flood Control)">33 U.S.C. 2213 (Flood Control)</option>
                        <option value="33 U.S.C. 2326 (Env Infra)">33 U.S.C. 2326 (Env Infra)</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Total Value ($)</label>
                        <input type="number" className="w-full mt-1 border rounded p-2 text-sm" value={formData.totalValue} onChange={e => setFormData({...formData, totalValue: Number(e.target.value)})} required/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Fed Share (%)</label>
                        <input type="number" className="w-full mt-1 border rounded p-2 text-sm" value={formData.percentage?.federal} onChange={e => setFormData({...formData, percentage: { federal: Number(e.target.value), nonFederal: 100 - Number(e.target.value) }})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Non-Fed Share (%)</label>
                        <input type="number" className="w-full mt-1 border rounded p-2 text-sm bg-zinc-100" value={formData.percentage?.nonFederal} disabled />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Contribution Type</label>
                        <select className="w-full mt-1 border rounded p-2 text-sm bg-white" value={formData.contributionType} onChange={e => setFormData({...formData, contributionType: e.target.value as any})}>
                            <option>Cash</option>
                            <option>In-Kind</option>
                            <option>LERRD</option>
                            <option>Work-in-Kind</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Valuation Method</label>
                        <select className="w-full mt-1 border rounded p-2 text-sm bg-white" value={formData.valuationMethod} onChange={e => setFormData({...formData, valuationMethod: e.target.value as any})}>
                            <option>Standard</option>
                            <option>Appraisal</option>
                            <option>Audit</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button type="submit" className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-emerald-600">
                        <Save size={14}/> Create Record
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CostShareForm;
