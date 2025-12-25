
import React, { useState, useMemo } from 'react';
import { Asset, DepreciationComponent, AssetLifecycleStatus } from '../../types';
import Modal from '../shared/Modal';
import { formatCurrency } from '../../utils/formatting';
import { Hash, Plus, Trash2, AlertTriangle, FileText, Wrench, Clock } from 'lucide-react';
import AssetLifecycleStepper from './AssetLifecycleStepper';
import AssetHistoryLog from './AssetHistoryLog';


interface Props {
    asset: Asset | null;
    onClose: () => void;
    onSave: (asset: Asset) => void;
}

const AssetDetailModal: React.FC<Props> = ({ asset, onClose, onSave }) => {
    const isNew = asset === null;
    const [formData, setFormData] = useState<Asset>(
        asset || {
            id: `ASSET-${Date.now()}`,
            name: '',
            type: 'Revolving Fund',
            assetClass: 'Equipment',
            status: 'CIP',
            acquisitionCost: 0,
            residualValue: 0,
            usefulLife: 20,
            pripAuthorized: false,
            plantIncrementWaiver: { active: false },
            components: [],
            accumulatedDepreciation: 0,
            auditLog: []
        }
    );

    const [newComponentName, setNewComponentName] = useState('');
    const [newComponentCost, setNewComponentCost] = useState<number | ''>('');
    const [activeTab, setActiveTab] = useState<'data' | 'components' | 'history'>('data');


    const handleInputChange = (field: keyof Asset, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddComponent = () => {
        if (!newComponentName || !newComponentCost) return;
        const newComponent: DepreciationComponent = {
            id: `COMP-${Date.now()}`,
            name: newComponentName,
            cost: Number(newComponentCost),
            placedInServiceDate: new Date().toISOString().split('T')[0],
            usefulLife: Math.min(formData.usefulLife / 2, 10),
        };
        handleInputChange('components', [...formData.components, newComponent]);
        setNewComponentName('');
        setNewComponentCost('');
    };

    const handleSave = () => {
        onSave(formData);
    };
    
    const totalCapitalizedValue = useMemo(() => 
        formData.acquisitionCost + formData.components.reduce((sum, c) => sum + c.cost, 0),
        [formData]
    );

    const calculateDepreciation = (cost: number, life: number) => (cost / life) / 4; // Quarterly
    
    const quarterlyDepreciation = useMemo(() => {
        if (formData.status !== 'In Service') return 0;
        const baseDep = calculateDepreciation(formData.acquisitionCost - formData.residualValue, formData.usefulLife);
        const compDep = formData.components.reduce((sum, c) => sum + calculateDepreciation(c.cost, c.usefulLife), 0);
        return baseDep + compDep;
    }, [formData]);

    const quarterlyPlantIncrement = useMemo(() => {
        if (formData.status !== 'In Service' || !formData.pripAuthorized || formData.plantIncrementWaiver.active) return 0;
        const plantIncrementFactor = 0.025; // Mock rate
        return (totalCapitalizedValue * plantIncrementFactor) / 4;
    }, [formData, totalCapitalizedValue]);

    const quarterlyInsurance = useMemo(() => {
        if (formData.status !== 'In Service' || formData.type !== 'Revolving Fund' || ['Land', 'Software'].includes(formData.assetClass)) return 0;
        const insuranceRate = 0.0015; // Mock rate
        return (totalCapitalizedValue * insuranceRate) / 4;
    }, [formData, totalCapitalizedValue]);

    return (
        <Modal title={isNew ? "Create New Asset" : `Asset: ${formData.name}`} onClose={onClose} maxWidth="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 flex flex-col gap-4">
                     {/* Tabs */}
                     <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto custom-scrollbar">
                        <button onClick={() => setActiveTab('data')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'data' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500'}`}><FileText size={12}/> Master Data</button>
                        <button onClick={() => setActiveTab('components')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'components' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500'}`}><Wrench size={12}/> Components</button>
                        <button onClick={() => setActiveTab('history')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500'}`}><Clock size={12}/> History</button>
                    </div>

                    <div className="bg-zinc-50/50 p-4 rounded-lg border border-zinc-200 min-h-[400px]">
                        {activeTab === 'data' && (
                            <div className="animate-in fade-in">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Master Data</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-1 sm:col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-bold text-zinc-500">Name</label>
                                        <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500">Asset Class</label>
                                        <select value={formData.assetClass} onChange={e => handleInputChange('assetClass', e.target.value)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs bg-white">
                                            <option>Vessel</option><option>Building</option><option>Equipment</option><option>Software</option><option>Land</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500">Type</label>
                                        <select value={formData.type} onChange={e => handleInputChange('type', e.target.value)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs bg-white">
                                            <option>Revolving Fund</option><option>PRIP</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500">Status</label>
                                        <select value={formData.status} onChange={e => handleInputChange('status', e.target.value as AssetLifecycleStatus)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs bg-white">
                                            <option>CIP</option><option>In Service</option><option>Modification</option><option>Disposal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500">Acquisition Cost</label>
                                        <input type="number" value={formData.acquisitionCost} onChange={e => handleInputChange('acquisitionCost', Number(e.target.value))} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500">Useful Life (Yrs)</label>
                                        <input type="number" value={formData.usefulLife} onChange={e => handleInputChange('usefulLife', Number(e.target.value))} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs"/>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="text-[10px] font-bold text-zinc-500">Placed in Service Date</label>
                                        <input type="date" value={formData.placedInServiceDate || ''} onChange={e => handleInputChange('placedInServiceDate', e.target.value)} className="w-full mt-1 border border-zinc-300 rounded p-1.5 text-xs" disabled={formData.status !== 'In Service'}/>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
                                    <label className="flex items-center gap-2 p-2 rounded hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer"><input type="checkbox" checked={formData.pripAuthorized} onChange={e => handleInputChange('pripAuthorized', e.target.checked)}/> <span className="text-xs font-medium">PRIP Authorized</span></label>
                                    <label className="flex items-center gap-2 p-2 rounded hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer"><input type="checkbox" checked={formData.plantIncrementWaiver.active} onChange={e => handleInputChange('plantIncrementWaiver', {active: e.target.checked})}/> <span className="text-xs font-medium">Plant Increment Waiver</span></label>
                                </div>
                            </div>
                        )}
                        {activeTab === 'components' && (
                           <div className="animate-in fade-in">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Components (Additions & Betterments)</h4>
                                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                    {formData.components.map(comp => (
                                        <div key={comp.id} className="grid grid-cols-4 gap-2 items-center p-2 bg-white rounded border">
                                            <span className="text-xs font-medium col-span-2 truncate">{comp.name}</span>
                                            <span className="text-xs font-mono text-right">{formatCurrency(comp.cost)}</span>
                                            <div className="text-right">
                                                <button className="p-1 text-zinc-400 hover:text-rose-600"><Trash2 size={12}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 border-t border-zinc-200 pt-4">
                                    <input type="text" placeholder="Component Name" value={newComponentName} onChange={e => setNewComponentName(e.target.value)} className="flex-1 border rounded p-2 text-xs"/>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Cost" value={newComponentCost} onChange={e => setNewComponentCost(Number(e.target.value))} className="w-24 border rounded p-2 text-xs"/>
                                        <button onClick={handleAddComponent} className="px-3 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800"><Plus size={14}/></button>
                                    </div>
                                </div>
                           </div>
                        )}
                        {activeTab === 'history' && (
                           <div className="space-y-6 animate-in fade-in">
                                <div className="overflow-x-auto pb-4">
                                    <AssetLifecycleStepper currentStatus={formData.status} />
                                </div>
                                <div className="border-t border-zinc-200 pt-4">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Audit Log</h4>
                                    <AssetHistoryLog log={formData.auditLog} />
                                </div>
                           </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {formData.status !== 'In Service' && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-start gap-3">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <p className="text-xs font-medium">Asset not 'In Service'. Depreciation and related charges are not calculated.</p>
                        </div>
                    )}
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Hash size={12} /> Ownership Cost Summary</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-zinc-500">Total Capitalized Value</span> <span className="font-mono font-bold">{formatCurrency(totalCapitalizedValue)}</span></div>
                            <div className="pt-3 border-t border-dashed"/>
                            <div className="flex justify-between text-sm"><span className="text-zinc-500">Quarterly Depreciation</span> <span className="font-mono">{formatCurrency(quarterlyDepreciation)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-zinc-500">Quarterly Plant Increment</span> <span className="font-mono">{formatCurrency(quarterlyPlantIncrement)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-zinc-500">Quarterly Insurance</span> <span className="font-mono">{formatCurrency(quarterlyInsurance)}</span></div>
                            <div className="pt-3 border-t"/>
                             <div className="flex justify-between text-sm font-bold text-rose-700"><span className="">Total Quarterly Charge</span> <span className="font-mono">{formatCurrency(quarterlyDepreciation + quarterlyPlantIncrement + quarterlyInsurance)}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 mt-6 border-t border-zinc-100">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-rose-700 text-white rounded-lg text-xs font-bold uppercase hover:bg-rose-600">Save Asset</button>
            </div>
        </Modal>
    );
};

export default AssetDetailModal;
