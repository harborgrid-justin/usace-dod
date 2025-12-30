import React, { useState, useMemo } from 'react';
import { Asset, AssetLifecycleStatus } from '../../types';
import Modal from '../shared/Modal';
import { formatCurrency } from '../../utils/formatting';
import { Calculator } from 'lucide-react';
import AssetFinancialForm from './AssetFinancialForm';
import AssetComponentManager from './AssetComponentManager';

interface Props {
    asset: Asset | null;
    onClose: () => void;
    onSave: (asset: Asset) => void;
}

const AssetDetailModal: React.FC<Props> = ({ asset, onClose, onSave }) => {
    const [formData, setFormData] = useState<Asset>(asset || { id: `A-${Date.now()}`, name: '', type: 'PRIP', assetClass: 'Equipment', status: 'CIP', acquisitionCost: 0, residualValue: 0, usefulLife: 20, pripAuthorized: false, plantIncrementWaiver: { active: false }, components: [], accumulatedDepreciation: 0, auditLog: [] });
    const [activeTab, setActiveTab] = useState<'data' | 'components'>('data');

    const handleUpdate = (f: keyof Asset, v: any) => setFormData(p => ({ ...p, [f]: v }));
    const totalVal = useMemo(() => formData.acquisitionCost + formData.components.reduce((s, c) => s + c.cost, 0), [formData]);
    const quarterlyDep = useMemo(() => (formData.status === 'In Service' ? (totalVal / formData.usefulLife) / 4 : 0), [formData, totalVal]);

    return (
        <Modal title={asset ? `Asset: ${formData.name}` : "Create New Asset"} onClose={onClose} maxWidth="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-4">
                     <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto">
                        {['data', 'components'].map(t => (<button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all ${activeTab === t ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500'}`}>{t === 'data' ? 'Master Data' : 'Components'}</button>))}
                    </div>
                    <div className="bg-zinc-50/50 p-6 rounded-2xl border border-zinc-200 min-h-[400px]">
                        {activeTab === 'data' && <AssetFinancialForm data={formData} onChange={handleUpdate} />}
                        {activeTab === 'components' && <AssetComponentManager components={formData.components} onUpdate={v => handleUpdate('components', v)} usefulLife={formData.usefulLife} />}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm h-fit">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Calculator size={16}/> Cost Summary</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium"><span className="text-zinc-500">Book Value</span><span className="font-mono">{formatCurrency(totalVal)}</span></div>
                        <div className="flex justify-between items-center text-sm font-bold text-rose-700 pt-4 border-t"><span className="uppercase">Qtr Deprec</span><span className="font-mono">{formatCurrency(quarterlyDep)}</span></div>
                    </div>
                    <button onClick={() => onSave(formData)} className="w-full mt-8 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all">Save Changes</button>
                </div>
            </div>
        </Modal>
    );
};
export default AssetDetailModal;