
import React, { useState } from 'react';
import { 
    FileText, MapPin, Calendar, DollarSign, Plus, Trash2, Edit, 
    Save, ArrowLeft, Search, Filter, ShieldCheck, Database
} from 'lucide-react';
import { TravelOrder } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { travelService } from '../../services/TravelDataService';

interface Props {
    orders: TravelOrder[];
}

const TravelOrderManager: React.FC<Props> = ({ orders }) => {
    const [viewMode, setViewMode] = useState<'List' | 'Create' | 'Edit'>('List');
    const [currentOrder, setCurrentOrder] = useState<TravelOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [integrationMsg, setIntegrationMsg] = useState('');

    // --- Helpers ---
    const handleCreateOrder = () => {
        setCurrentOrder({
            id: `TO-24-${String(orders.length + 1).padStart(3, '0')}`,
            traveler: '',
            destination: '',
            purpose: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            estCost: 0,
            status: 'Draft',
            fiscalYear: 2024
        });
        setViewMode('Create');
        setIntegrationMsg('');
    };

    const handleEditOrder = (order: TravelOrder) => {
        setCurrentOrder({ ...order });
        setViewMode('Edit');
        setIntegrationMsg('');
    };

    const handleDeleteOrder = (id: string) => {
        if(confirm('Are you sure you want to delete this travel order?')) {
            travelService.deleteOrder(id);
        }
    };

    const saveOrder = () => {
        if (!currentOrder) return;
        if (!currentOrder.traveler || !currentOrder.destination) {
            alert('Traveler and Destination are required.');
            return;
        }

        let updatedOrder = { ...currentOrder };
        
        // Check previous status if editing
        const existingOrder = orders.find(o => o.id === updatedOrder.id);

        // Integration #8: Generate GL Obligation if status is Approved and it wasn't already approved
        if (updatedOrder.status === 'Approved' && existingOrder?.status !== 'Approved') {
            const glEntry = IntegrationOrchestrator.generateTravelObligation(updatedOrder);
            if (glEntry) {
                console.log("Integration Triggered: GL Obligation for Travel", glEntry);
                setIntegrationMsg(`GL Posted: Doc ${glEntry.id} for ${formatCurrency(glEntry.totalAmount)}`);
                // Note: In a full implementation, we'd call a GL service here to save glEntry
            }
        }

        if (viewMode === 'Create') {
            travelService.addOrder(updatedOrder);
        } else {
            travelService.updateOrder(updatedOrder);
        }
        
        // Small delay if there's an integration message to let user see it (simulated)
        if (integrationMsg) {
             setTimeout(() => {
                 setViewMode('List');
                 setCurrentOrder(null);
             }, 1500);
        } else {
             setViewMode('List');
             setCurrentOrder(null);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Draft': 'bg-zinc-100 text-zinc-600 border-zinc-200',
            'Submitted': 'bg-blue-50 text-blue-700 border-blue-100',
            'Rejected': 'bg-rose-50 text-rose-700 border-rose-100'
        };
        // @ts-ignore
        const style = styles[status] || styles['Draft'];
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${style}`}>{status}</span>;
    };

    const filteredOrders = orders.filter(o => 
        o.traveler.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Render ---
    if (viewMode === 'List') {
        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm gap-4">
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                        <div className="p-3 bg-zinc-50 text-zinc-600 rounded-lg"><FileText size={20}/></div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Travel Orders (DD 1610)</h3>
                            <p className="text-xs text-zinc-500">Manage Authorizations & Advances</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                type="text" 
                                placeholder="Search orders..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full sm:w-48 pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400"
                            />
                        </div>
                        <button onClick={handleCreateOrder} className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors whitespace-nowrap">
                            <Plus size={14}/> New Order
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-blue-300 transition-all shadow-sm group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900">{order.traveler}</h4>
                                    <p className="text-xs text-zinc-500 font-mono">{order.id}</p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                            
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2 text-xs text-zinc-600">
                                    <MapPin size={14} className="text-zinc-400 shrink-0"/>
                                    <span className="truncate">{order.destination}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-600">
                                    <Calendar size={14} className="text-zinc-400 shrink-0"/>
                                    <span>{order.startDate} - {order.endDate || 'TBD'}</span>
                                </div>
                                <div className="p-2 bg-zinc-50 rounded border border-zinc-100 mt-2">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Purpose</p>
                                    <p className="text-xs text-zinc-700 line-clamp-2">{order.purpose}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                                    <DollarSign size={14} className="text-zinc-400"/>
                                    <span>{formatCurrency(order.estCost)}</span>
                                </div>
                                <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditOrder(order)} className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit"><Edit size={14}/></button>
                                    <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredOrders.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
                            <p className="text-xs font-medium">No orders found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Form View
    if (!currentOrder) return null;

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 animate-in slide-in-from-right-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">{viewMode === 'Create' ? 'New Travel Order' : 'Edit Travel Order'}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{currentOrder.id}</p>
                </div>
                <button onClick={() => setViewMode('List')} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
                    <ArrowLeft size={14}/> Back to List
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Traveler Name</label>
                    <input 
                        type="text" 
                        className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                        value={currentOrder.traveler}
                        onChange={e => setCurrentOrder({...currentOrder, traveler: e.target.value})}
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Destination</label>
                    <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-2.5 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                            value={currentOrder.destination}
                            onChange={e => setCurrentOrder({...currentOrder, destination: e.target.value})}
                            placeholder="e.g. Washington, DC"
                        />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Purpose of Travel</label>
                    <textarea 
                        className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all resize-none"
                        rows={2}
                        value={currentOrder.purpose}
                        onChange={e => setCurrentOrder({...currentOrder, purpose: e.target.value})}
                        placeholder="Detailed justification for travel..."
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                    <select 
                        className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                        value={currentOrder.status}
                        onChange={e => setCurrentOrder({...currentOrder, status: e.target.value as any})}
                    >
                        <option>Draft</option>
                        <option>Submitted</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estimated Cost ($)</label>
                    <input 
                        type="number" 
                        className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                        value={currentOrder.estCost}
                        onChange={e => setCurrentOrder({...currentOrder, estCost: Number(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Start Date</label>
                    <input 
                        type="date" 
                        className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                        value={currentOrder.startDate}
                        onChange={e => setCurrentOrder({...currentOrder, startDate: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">End Date</label>
                    <input 
                        type="date" 
                        className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                        value={currentOrder.endDate}
                        onChange={e => setCurrentOrder({...currentOrder, endDate: e.target.value})}
                    />
                </div>
            </div>

            {currentOrder.status === 'Approved' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-3 text-emerald-800 text-xs items-center">
                    <ShieldCheck size={16} className="shrink-0"/>
                    <p><strong>Approved:</strong> Saving changes will update the General Ledger Obligation.</p>
                </div>
            )}
            
            {integrationMsg && (
                <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3 text-indigo-800 text-xs items-center animate-in fade-in">
                    <Database size={16} className="shrink-0"/>
                    <p>{integrationMsg}</p>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                <button onClick={() => setViewMode('List')} className="px-5 py-2.5 border border-zinc-200 rounded-lg text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50 transition-colors">Cancel</button>
                <button onClick={saveOrder} className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    <Save size={14}/> Save Order
                </button>
            </div>
        </div>
    );
};

export default TravelOrderManager;
