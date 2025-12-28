import React, { useState, useMemo, useTransition, useDeferredValue } from 'react';
import { 
    FileText, MapPin, Calendar, DollarSign, Plus, Trash2, Edit, 
    Save, ArrowLeft, Search, Filter, ShieldCheck, Database, ArrowRight, Gavel
} from 'lucide-react';
import { TravelOrder } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { travelService } from '../../services/TravelDataService';
import { glService } from '../../services/GLDataService';
import { useService } from '../../hooks/useService';
import Badge from '../shared/Badge';

const TravelOrderManager: React.FC = () => {
    const orders = useService(travelService, () => travelService.getOrders());
    const [viewMode, setViewMode] = useState<'List' | 'Create' | 'Edit'>('List');
    const [currentOrder, setCurrentOrder] = useState<TravelOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [isPending, startTransition] = useTransition();

    const handleCreateOrder = () => {
        startTransition(() => {
            setCurrentOrder({
                id: `TO-24-${String(orders.length + 1).padStart(3, '0')}`,
                traveler: '', destination: '', purpose: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '', estCost: 0, status: 'Draft', fiscalYear: 2024
            });
            setViewMode('Create');
        });
    };

    const handleSave = () => {
        if (!currentOrder) return;
        startTransition(() => {
            if (currentOrder.status === 'Approved') {
                const glEntry = IntegrationOrchestrator.generateTravelObligation(currentOrder);
                glService.addTransaction(glEntry);
            }
            if (viewMode === 'Create') travelService.addOrder(currentOrder);
            else travelService.updateOrder(currentOrder);
            setViewMode('List');
        });
    };

    const filteredOrders = useMemo(() => orders.filter(o => 
        o.traveler.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        o.destination.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        o.id.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [orders, deferredSearch]);

    if (viewMode === 'List') {
        return (
            <div className={`space-y-6 animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-4 rounded-[24px] border border-zinc-200 shadow-sm gap-4">
                    <div className="flex gap-4 items-center pl-2">
                        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100"><FileText size={20}/></div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Travel Authorizations (DD 1610)</h3>
                            <p className="text-xs text-zinc-500 font-medium">JTR Compliant Authority Monitor</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64 group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                            <input 
                                type="text" placeholder="Search auths..." value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                        <button onClick={handleCreateOrder} className="flex items-center justify-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg whitespace-nowrap active:scale-95">
                            <Plus size={14}/> New Authorization
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white border border-zinc-200 rounded-[32px] p-6 hover:shadow-2xl hover:border-rose-200 transition-all group flex flex-col h-[320px]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-base font-bold text-zinc-900 group-hover:text-rose-700 transition-colors">{order.traveler}</h4>
                                    <p className="text-[10px] text-zinc-400 font-mono mt-1 uppercase tracking-widest">{order.id}</p>
                                </div>
                                <Badge variant={order.status === 'Approved' ? 'success' : 'neutral'}>{order.status}</Badge>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3 text-xs text-zinc-600 font-medium bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                                    <MapPin size={14} className="text-zinc-300"/>
                                    <span className="truncate">{order.destination}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-600 font-medium pl-2">
                                    <Calendar size={14} className="text-zinc-300"/>
                                    <span>{order.startDate} <ArrowRight size={10} className="inline mx-1"/> {order.endDate || 'OPEN'}</span>
                                </div>
                                <div className="p-4 bg-rose-50/20 rounded-2xl border border-rose-100/50">
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Gavel size={10}/> Purpose</p>
                                    <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed font-medium italic">{order.purpose}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-6 mt-6 border-t border-zinc-100">
                                <div>
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Authorization Cap</p>
                                    <p className="text-lg font-mono font-bold text-zinc-900 tracking-tighter">{formatCurrency(order.estCost)}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    <button onClick={() => { startTransition(() => { setCurrentOrder({...order}); setViewMode('Edit'); }); }} className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all shadow-sm"><Edit size={16}/></button>
                                    <button onClick={() => travelService.deleteOrder(order.id)} className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredOrders.length === 0 && (
                        <div className="col-span-full py-20 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-[32px]">
                            <p className="text-sm font-bold uppercase tracking-widest">No Active Authorizations</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-[32px] shadow-sm p-8 animate-in slide-in-from-right-4 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-100">
                <div>
                    <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">{viewMode === 'Create' ? 'New Authorization' : 'Update Authorization'}</h3>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1.5">Authorization Document ID: {currentOrder?.id}</p>
                </div>
                <button onClick={() => setViewMode('List')} className="px-5 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase flex items-center gap-2 bg-zinc-50 rounded-xl border border-zinc-200 transition-all shadow-sm">
                    <ArrowLeft size={16}/> Back
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Traveler Legal Name</label>
                        <input type="text" className="w-full border border-zinc-200 rounded-xl p-4 text-sm font-bold focus:border-rose-400 transition-all outline-none shadow-inner bg-zinc-50/50" value={currentOrder?.traveler} onChange={e => setCurrentOrder({...currentOrder!, traveler: e.target.value})} placeholder="LAST, FIRST MIDDLE" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Destination Unit / Location</label>
                        <input type="text" className="w-full border border-zinc-200 rounded-xl p-4 text-sm font-medium focus:border-rose-400 transition-all outline-none shadow-inner bg-zinc-50/50" value={currentOrder?.destination} onChange={e => setCurrentOrder({...currentOrder!, destination: e.target.value})} placeholder="Name of Post or TDY Site" />
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Arrival</label>
                            <input type="date" className="w-full border border-zinc-200 rounded-xl p-4 text-xs font-mono bg-zinc-50/50" value={currentOrder?.startDate} onChange={e => setCurrentOrder({...currentOrder!, startDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Departure</label>
                            <input type="date" className="w-full border border-zinc-200 rounded-xl p-4 text-xs font-mono bg-zinc-50/50" value={currentOrder?.endDate} onChange={e => setCurrentOrder({...currentOrder!, endDate: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Estimated NTE Allocation ($)</label>
                        <input type="number" className="w-full border border-zinc-200 rounded-xl p-4 text-2xl font-mono font-bold text-zinc-900 focus:border-rose-400 outline-none shadow-inner bg-zinc-50/50" value={currentOrder?.estCost} onChange={e => setCurrentOrder({...currentOrder!, estCost: Number(e.target.value)})} />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">JTR Justification (Required for Audit)</label>
                    <textarea rows={4} className="w-full border border-zinc-200 rounded-2xl p-5 text-sm focus:border-rose-400 transition-all resize-none shadow-inner bg-zinc-50/50 leading-relaxed" value={currentOrder?.purpose} onChange={e => setCurrentOrder({...currentOrder!, purpose: e.target.value})} placeholder="Detailed mission description as per JTR guidelines..." />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-3 block">Approval Stage</label>
                    <div className="flex gap-2 p-1 bg-zinc-100 rounded-2xl w-fit">
                        {['Draft', 'Submitted', 'Approved', 'Rejected'].map(s => (
                            <button key={s} onClick={() => setCurrentOrder({...currentOrder!, status: s as any})} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all ${currentOrder?.status === s ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-800'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-zinc-100">
                <button onClick={() => setViewMode('List')} className="px-8 py-3 border border-zinc-200 rounded-2xl text-xs font-bold uppercase text-zinc-500 hover:bg-zinc-50">Discard</button>
                <button onClick={handleSave} className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all shadow-2xl flex items-center gap-3 active:scale-95">
                    <Save size={18}/> Commit Authorization Record
                </button>
            </div>
        </div>
    );
};

export default TravelOrderManager;