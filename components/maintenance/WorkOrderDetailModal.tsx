
import React, { useState, useMemo } from 'react';
import { WorkOrder, InventoryItem, Vendor, LaborEntry, MaterialEntry, ServiceEntry } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import Modal from '../shared/Modal';
import { Users, Package, Truck, Clock, Plus, Trash2, AlertTriangle, Briefcase, Calculator } from 'lucide-react';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';

interface Props {
    workOrder: WorkOrder;
    inventory: InventoryItem[];
    vendors: Vendor[];
    onClose: () => void;
    onUpdate: (updatedWO: WorkOrder, updatesInventory?: boolean) => void;
}

const WorkOrderDetailModal: React.FC<Props> = ({ workOrder, inventory, vendors, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Labor' | 'Materials' | 'Services'>('Labor');
    
    // Local state for edits
    const [labor, setLabor] = useState<LaborEntry[]>(workOrder.laborEntries);
    const [materials, setMaterials] = useState<MaterialEntry[]>(workOrder.materialEntries);
    const [services, setServices] = useState<ServiceEntry[]>(workOrder.serviceEntries);

    // Form states
    const [newLabor, setNewLabor] = useState<Partial<LaborEntry>>({ date: new Date().toISOString().split('T')[0] });
    const [newMaterial, setNewMaterial] = useState<{ itemId: string; qty: number }>({ itemId: '', qty: 1 });
    const [newService, setNewService] = useState<Partial<ServiceEntry>>({ date: new Date().toISOString().split('T')[0] });

    // Costs
    const laborCost = labor.reduce((s, l) => s + (l.hours * l.hourlyRate), 0);
    const materialCost = materials.reduce((s, m) => s + (m.quantity * m.unitCost), 0);
    const serviceCost = services.reduce((s, x) => s + x.cost, 0);
    const totalCost = laborCost + materialCost + serviceCost;

    const handleAddLabor = () => {
        if (!newLabor.technicianName || !newLabor.hours || !newLabor.hourlyRate) return;
        const entry: LaborEntry = {
            id: `LAB-${Date.now()}`,
            technicianName: newLabor.technicianName,
            laborCategory: newLabor.laborCategory || 'General',
            hours: Number(newLabor.hours),
            hourlyRate: Number(newLabor.hourlyRate),
            date: newLabor.date || new Date().toISOString().split('T')[0]
        };
        setLabor([...labor, entry]);
        setNewLabor({ date: new Date().toISOString().split('T')[0] });
    };

    const handleAddMaterial = () => {
        const item = inventory.find(i => i.id === newMaterial.itemId);
        if (!item || newMaterial.qty <= 0) return;
        
        // Integration #9: Validate Inventory Drawdown via Orchestrator
        const validation = IntegrationOrchestrator.validateInventoryDrawdown(item, Number(newMaterial.qty));
        
        if (!validation.success) {
            alert(validation.error);
            return;
        }

        const entry: MaterialEntry = {
            id: `MAT-${Date.now()}`,
            inventoryItemId: item.id,
            itemName: item.name,
            quantity: Number(newMaterial.qty),
            unitCost: item.unitCost,
            dateIssued: new Date().toISOString().split('T')[0]
        };
        setMaterials([...materials, entry]);
        setNewMaterial({ itemId: '', qty: 1 });
    };

    const handleAddService = () => {
        const vendor = vendors.find(v => v.id === newService.vendorId);
        if (!vendor || !newService.cost || !newService.description) return;

        const entry: ServiceEntry = {
            id: `SVC-${Date.now()}`,
            vendorId: vendor.id,
            vendorName: vendor.name,
            description: newService.description,
            cost: Number(newService.cost),
            date: newService.date || new Date().toISOString().split('T')[0],
            invoiceNumber: newService.invoiceNumber
        };
        setServices([...services, entry]);
        setNewService({ date: new Date().toISOString().split('T')[0] });
    };

    const handleSave = () => {
        onUpdate({
            ...workOrder,
            laborEntries: labor,
            materialEntries: materials,
            serviceEntries: services,
            totalCost: totalCost
        }, true);
    };

    return (
        <Modal title={`Work Order: ${workOrder.id}`} subtitle={workOrder.description} onClose={onClose} maxWidth="max-w-4xl">
            <div className="flex flex-col h-[600px]">
                {/* Cost Summary Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-xl mb-4">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Labor Cost</p>
                        <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(laborCost)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Material Cost</p>
                        <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(materialCost)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">External Services</p>
                        <p className="text-lg font-mono font-bold text-zinc-900">{formatCurrency(serviceCost)}</p>
                    </div>
                    <div className="border-l border-zinc-200 pl-4">
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Total WO Cost</p>
                        <p className="text-2xl font-mono font-bold text-blue-700">{formatCurrency(totalCost)}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-zinc-100 mb-4 overflow-x-auto custom-scrollbar">
                    <button onClick={() => setActiveTab('Labor')} className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Labor' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}><Users size={14} className="inline mr-2"/> Labor</button>
                    <button onClick={() => setActiveTab('Materials')} className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Materials' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}><Package size={14} className="inline mr-2"/> Materials</button>
                    <button onClick={() => setActiveTab('Services')} className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Services' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}><Truck size={14} className="inline mr-2"/> Services</button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    
                    {/* LABOR TAB */}
                    {activeTab === 'Labor' && (
                        <>
                            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col sm:flex-row gap-2 items-end">
                                <div className="flex-1 w-full">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Technician</label>
                                    <input className="w-full mt-1 border rounded p-1.5 text-xs" placeholder="Name" value={newLabor.technicianName || ''} onChange={e => setNewLabor({...newLabor, technicianName: e.target.value})} />
                                </div>
                                <div className="w-full sm:w-32">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Role</label>
                                    <select className="w-full mt-1 border rounded p-1.5 text-xs" value={newLabor.laborCategory} onChange={e => setNewLabor({...newLabor, laborCategory: e.target.value})}>
                                        <option value="">Select...</option>
                                        <option>Electrician</option>
                                        <option>Mechanic</option>
                                        <option>Plumber</option>
                                        <option>General</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <div className="w-20">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Hours</label>
                                        <input type="number" className="w-full mt-1 border rounded p-1.5 text-xs" value={newLabor.hours || ''} onChange={e => setNewLabor({...newLabor, hours: Number(e.target.value)})} />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Rate ($)</label>
                                        <input type="number" className="w-full mt-1 border rounded p-1.5 text-xs" value={newLabor.hourlyRate || ''} onChange={e => setNewLabor({...newLabor, hourlyRate: Number(e.target.value)})} />
                                    </div>
                                    <button onClick={handleAddLabor} className="p-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 mt-auto h-[34px] w-10 flex items-center justify-center"><Plus size={14}/></button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {labor.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-zinc-50">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-800">{l.technicianName}</p>
                                            <p className="text-[10px] text-zinc-500">{l.laborCategory} • {l.date}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div>
                                                <p className="text-xs font-mono">{l.hours} hrs @ {formatCurrency(l.hourlyRate)}</p>
                                                <p className="text-xs font-bold">{formatCurrency(l.hours * l.hourlyRate)}</p>
                                            </div>
                                            <button onClick={() => setLabor(labor.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-rose-600"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* MATERIALS TAB */}
                    {activeTab === 'Materials' && (
                        <>
                            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col sm:flex-row gap-2 items-end">
                                <div className="flex-1 w-full">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Inventory Item</label>
                                    <select className="w-full mt-1 border rounded p-1.5 text-xs" value={newMaterial.itemId} onChange={e => setNewMaterial({...newMaterial, itemId: e.target.value})}>
                                        <option value="">Select Item...</option>
                                        {inventory.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} ({item.quantityOnHand} on hand)</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <div className="w-24">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Qty</label>
                                        <input type="number" className="w-full mt-1 border rounded p-1.5 text-xs" value={newMaterial.qty} onChange={e => setNewMaterial({...newMaterial, qty: Number(e.target.value)})} />
                                    </div>
                                    <button onClick={handleAddMaterial} className="p-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 mt-auto h-[34px] w-10 flex items-center justify-center"><Plus size={14}/></button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {materials.map((m, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-zinc-50">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-800">{m.itemName}</p>
                                            <p className="text-[10px] text-zinc-500">Issued: {m.dateIssued}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div>
                                                <p className="text-xs font-mono">{m.quantity} x {formatCurrency(m.unitCost)}</p>
                                                <p className="text-xs font-bold">{formatCurrency(m.quantity * m.unitCost)}</p>
                                            </div>
                                            <button onClick={() => setMaterials(materials.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-rose-600"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* SERVICES TAB */}
                    {activeTab === 'Services' && (
                        <>
                            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex-1 w-full">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Vendor</label>
                                        <select className="w-full mt-1 border rounded p-1.5 text-xs" value={newService.vendorId || ''} onChange={e => setNewService({...newService, vendorId: e.target.value})}>
                                            <option value="">Select Vendor...</option>
                                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.serviceType})</option>)}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-32">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Invoice #</label>
                                            <input className="w-full mt-1 border rounded p-1.5 text-xs" value={newService.invoiceNumber || ''} onChange={e => setNewService({...newService, invoiceNumber: e.target.value})} />
                                        </div>
                                        <div className="w-24">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Cost ($)</label>
                                            <input type="number" className="w-full mt-1 border rounded p-1.5 text-xs" value={newService.cost || ''} onChange={e => setNewService({...newService, cost: Number(e.target.value)})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Description of Work</label>
                                        <input className="w-full mt-1 border rounded p-1.5 text-xs" value={newService.description || ''} onChange={e => setNewService({...newService, description: e.target.value})} />
                                    </div>
                                    <button onClick={handleAddService} className="p-2 bg-zinc-900 text-white rounded hover:bg-zinc-800"><Plus size={14}/></button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {services.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-zinc-50">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-800">{s.vendorName}</p>
                                            <p className="text-[10px] text-zinc-500">{s.description} • Inv: {s.invoiceNumber || 'N/A'}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <p className="text-xs font-mono font-bold">{formatCurrency(s.cost)}</p>
                                            <button onClick={() => setServices(services.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-rose-600"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-100 gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 flex items-center gap-2">
                        <Briefcase size={14}/> Save Updates
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default WorkOrderDetailModal;
