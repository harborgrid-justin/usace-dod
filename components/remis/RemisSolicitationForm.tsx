import React, { useState, useEffect } from 'react';
import { Solicitation, BidItem, SolicitationStatus, RealPropertyAsset } from '../../types';
import Modal from '../shared/Modal';
import { Save, Plus, Trash2 } from 'lucide-react';
import { remisService } from '../../services/RemisDataService';

interface Props {
    onClose: () => void;
    onSubmit: (solicitation: Solicitation) => void;
    solicitation?: Solicitation;
}

const RemisSolicitationForm: React.FC<Props> = ({ onClose, onSubmit, solicitation }) => {
    const [formData, setFormData] = useState<Partial<Solicitation>>(solicitation || {
        status: 'Requirement Refinement',
        type: 'IFB',
        bidItems: [{ id: `item-${Date.now()}`, description: '', unit: 'LS', quantity: 1 }]
    });

    const [bidItems, setBidItems] = useState<BidItem[]>(solicitation?.bidItems || [{ id: `item-${Date.now()}`, description: '', unit: 'LS', quantity: 1 }]);
    const [eligibleAssets, setEligibleAssets] = useState<RealPropertyAsset[]>([]);

    useEffect(() => {
        // Fetch assets marked for disposal to link to.
        setEligibleAssets(remisService.getAssets().filter(a => a.status === 'Excess'));
    }, []);

    const handleItemChange = (index: number, field: keyof BidItem, value: any) => {
        const newItems = [...bidItems];
        (newItems[index] as any)[field] = value;
        setBidItems(newItems);
    };

    const addItem = () => {
        setBidItems([...bidItems, { id: `item-${Date.now()}`, description: '', unit: 'LS', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setBidItems(bidItems.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.assetId) return;

        const newSol: Solicitation = {
            id: solicitation?.id || `SOL-RE-${Date.now().toString().slice(-5)}`,
            assetId: formData.assetId,
            title: formData.title,
            type: formData.type!,
            status: formData.status as SolicitationStatus,
            bidItems: bidItems,
            quotes: solicitation?.quotes || [],
            auditLog: solicitation?.auditLog || [{
                timestamp: new Date().toISOString(),
                user: 'CurrentUser',
                action: 'Created',
                details: 'Solicitation record created.'
            }]
        };
        onSubmit(newSol);
    };

    return (
        <Modal title={solicitation ? "Edit Solicitation" : "New Real Property Solicitation"} onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Asset ID (RPUID)</label>
                        <select
                            className="w-full mt-1 border rounded p-2 text-sm bg-white"
                            value={formData.assetId || ''}
                            onChange={e => setFormData({ ...formData, assetId: e.target.value })}
                            required
                        >
                            <option value="">Select Asset...</option>
                            {eligibleAssets.map(asset => (
                                <option key={asset.rpuid} value={asset.rpuid}>{asset.rpuid} - {asset.rpaName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Solicitation Type</label>
                        <select
                            className="w-full mt-1 border rounded p-2 text-sm bg-white"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                        >
                            <option>IFB</option>
                            <option>RFP</option>
                            <option>RFQ</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Title</label>
                    <input className="w-full mt-1 border rounded p-2 text-sm" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                
                <div className="pt-2">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">Bid Items</h4>
                    <div className="space-y-2 p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                        {bidItems.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                                <input placeholder="Description" className="col-span-7 p-2 border rounded text-xs" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} />
                                <input placeholder="Unit" className="col-span-2 p-2 border rounded text-xs" value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} />
                                <input type="number" placeholder="Qty" className="col-span-2 p-2 border rounded text-xs" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} />
                                <button type="button" onClick={() => removeItem(index)} className="col-span-1 text-zinc-400 hover:text-rose-600"><Trash2 size={14}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addItem} className="text-xs font-bold text-zinc-600 flex items-center gap-1 pt-2"><Plus size={12}/> Add Item</button>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-zinc-800">
                        <Save size={14}/> {solicitation ? 'Save Changes' : 'Create Solicitation'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default RemisSolicitationForm;