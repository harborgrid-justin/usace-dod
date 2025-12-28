import React, { useState, useMemo, useTransition, useDeferredValue } from 'react';
import { 
    DollarSign, Plus, Trash2, Edit, Save, ArrowLeft, 
    FileText, Search, AlertTriangle, CheckCircle2, History, CreditCard, ShieldCheck, PlusCircle
} from 'lucide-react';
import { TravelVoucher, TravelOrder, TravelExpense } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { travelService } from '../../services/TravelDataService';
import { glService } from '../../services/GLDataService';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';
import { useService } from '../../hooks/useService';
import Badge from '../shared/Badge';

const TravelVoucherManager: React.FC<{ orders: TravelOrder[] }> = ({ orders }) => {
    const vouchers = useService(travelService, () => travelService.getVouchers());
    const [viewMode, setViewMode] = useState<'List' | 'Create' | 'Edit'>('List');
    const [currentVoucher, setCurrentVoucher] = useState<TravelVoucher | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [isPending, startTransition] = useTransition();

    const handleCreateVoucher = () => {
        startTransition(() => {
            setCurrentVoucher({
                id: `TV-24-${String(vouchers.length + 1).padStart(3, '0')}`,
                orderId: '', traveler: '', expenses: [], totalClaimed: 0, status: 'Draft'
            });
            setViewMode('Create');
        });
    };

    const handleEditVoucher = (voucher: TravelVoucher) => {
        startTransition(() => {
            setCurrentVoucher({ ...voucher });
            setViewMode('Edit');
        });
    };

    const handleProcessPayment = (voucher: TravelVoucher) => {
        if (voucher.status === 'Paid') return;
        startTransition(() => {
            const updatedVoucher: TravelVoucher = { ...voucher, status: 'Paid' };
            travelService.updateVoucher(updatedVoucher);
            const glEntry = IntegrationOrchestrator.generateVoucherDisbursement(updatedVoucher);
            glService.addTransaction(glEntry);
        });
    };

    const saveVoucher = () => {
        if (!currentVoucher) return;
        const total = currentVoucher.expenses.reduce((sum, ex) => sum + Number(ex.amount), 0);
        
        if (currentVoucher.orderId) {
            const linkedOrder = orders.find(o => o.id === currentVoucher.orderId);
            if (linkedOrder && total > linkedOrder.estCost) {
                if (!confirm(`Audit Warning: Claimed amount (${formatCurrency(total)}) exceeds authorized cap (${formatCurrency(linkedOrder.estCost)}). Proceed with fiscal override?`)) return;
            }
        }

        startTransition(() => {
            const voucherToSave = { ...currentVoucher, totalClaimed: total, dateSubmitted: new Date().toISOString().split('T')[0] };
            if (viewMode === 'Create') travelService.addVoucher(voucherToSave);
            else travelService.updateVoucher(voucherToSave);
            setViewMode('List');
            setCurrentVoucher(null);
        });
    };

    const filteredVouchers = useMemo(() => vouchers.filter(v => 
        v.traveler.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        v.id.toLowerCase().includes(deferredSearch.toLowerCase())
    ), [vouchers, deferredSearch]);

    if (viewMode === 'List') {
        return (
            <div className={`space-y-6 animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-4 rounded-[24px] border border-zinc-200 shadow-sm gap-4">
                    <div className="flex gap-4 items-center pl-2">
                        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100"><DollarSign size={20}/></div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Settlement Vouchers (DD 1351-2)</h3>
                            <p className="text-xs text-zinc-500 font-medium">Reimbursement Outlay Engine</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64 group">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"/>
                            <input 
                                type="text" placeholder="Search vouchers..." value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-emerald-400 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                        <button onClick={handleCreateVoucher} className="flex items-center justify-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all shadow-lg whitespace-nowrap active:scale-95">
                            <Plus size={14}/> File New Settlement
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredVouchers.map(voucher => (
                        <div key={voucher.id} className="bg-white border border-zinc-200 rounded-[32px] p-6 hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col h-[320px]">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-sm font-bold uppercase shadow-lg border border-zinc-800">
                                        {voucher.traveler.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-zinc-900">{voucher.traveler}</h4>
                                        <p className="text-[10px] text-zinc-400 font-mono tracking-widest mt-0.5">AUTH: {voucher.orderId}</p>
                                    </div>
                                </div>
                                <Badge variant={voucher.status === 'Paid' ? 'success' : voucher.status === 'Approved' ? 'info' : 'neutral'}>{voucher.status}</Badge>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                <div className="flex justify-between items-center text-xs font-medium text-zinc-500 px-2">
                                    <span>Expenses Claimed</span>
                                    <span>{voucher.expenses.length} Lines</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden">
                                     <div className="h-full bg-emerald-500 w-[100%] animate-pulse opacity-40" />
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-zinc-100 pt-6 mt-6">
                                <div>
                                    <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Magnitude</p>
                                    <p className="text-2xl font-mono font-bold text-zinc-900 tracking-tighter">{formatCurrency(voucher.totalClaimed)}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {voucher.status === 'Approved' && (
                                        <button onClick={() => handleProcessPayment(voucher)} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-xl flex items-center gap-2 active:scale-95"><CreditCard size={14}/> Disburse</button>
                                    )}
                                    <button onClick={() => handleEditVoucher(voucher)} className="p-2.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"><Edit size={16}/></button>
                                    <button onClick={() => travelService.deleteVoucher(voucher.id)} className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!currentVoucher) return null;
    const total = currentVoucher.expenses.reduce((s, e) => s + Number(e.amount), 0);

    return (
        <div className="bg-white border border-zinc-200 rounded-[32px] shadow-sm p-8 animate-in slide-in-from-right-4 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-100">
                <div>
                    <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Settlement Worksheet (DD 1351-2)</h3>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1.5">Voucher Reference: {currentVoucher.id}</p>
                </div>
                <button onClick={() => setViewMode('List')} className="px-5 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase flex items-center gap-2 bg-zinc-50 rounded-xl border border-zinc-200 transition-all shadow-sm">
                    <ArrowLeft size={16}/> Return to Ledger
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Target Authorization (TO PIID)</label>
                    <select 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-inner appearance-none"
                        value={currentVoucher.orderId}
                        onChange={e => {
                            const order = orders.find(o => o.id === e.target.value);
                            setCurrentVoucher({...currentVoucher, orderId: e.target.value, traveler: order?.traveler || ''});
                        }}
                    >
                        <option value="">Select validated TO...</option>
                        {orders.filter(o => o.status === 'Approved').map(o => (
                            <option key={o.id} value={o.id}>{o.id} - {o.traveler} [Cap: {formatCurrency(o.estCost)}]</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Workflow Status</label>
                    <div className="flex gap-2 p-1 bg-zinc-100 rounded-2xl w-fit">
                        {['Draft', 'Pending Review', 'Approved'].map(s => (
                            <button key={s} onClick={() => setCurrentVoucher({...currentVoucher, status: s as any})} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all ${currentVoucher.status === s ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-800'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-200 mb-10 shadow-inner">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3"><PlusCircle size={16} className="text-rose-700"/> Detailed Itemization</h4>
                    <button onClick={() => setCurrentVoucher({...currentVoucher, expenses: [...currentVoucher.expenses, {id: `E-${Date.now()}`, date: '', category: 'Meals', amount: 0, description: ''}]})} className="text-[10px] font-bold text-emerald-800 uppercase hover:underline flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm"><Plus size={14}/> Add Expense Line</button>
                </div>
                <div className="space-y-4">
                    {currentVoucher.expenses.map((exp, idx) => (
                        <div key={exp.id} className="grid grid-cols-12 gap-4 items-end bg-white p-5 rounded-[24px] border border-zinc-100 group shadow-sm transition-all hover:border-zinc-300">
                            <div className="col-span-2"><label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1 block">Date</label><input type="date" value={exp.date} onChange={e => {const ex = [...currentVoucher.expenses]; ex[idx].date = e.target.value; setCurrentVoucher({...currentVoucher, expenses: ex})}} className="w-full border-b border-zinc-200 p-1.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"/></div>
                            <div className="col-span-3"><label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1 block">Category</label><select value={exp.category} onChange={e => {const ex = [...currentVoucher.expenses]; ex[idx].category = e.target.value as any; setCurrentVoucher({...currentVoucher, expenses: ex})}} className="w-full border-b border-zinc-200 p-1.5 text-xs outline-none bg-transparent transition-all"><option>Airfare</option><option>Lodging</option><option>Meals</option><option>Misc</option></select></div>
                            <div className="col-span-4"><label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1 block">Description</label><input value={exp.description} onChange={e => {const ex = [...currentVoucher.expenses]; ex[idx].description = e.target.value; setCurrentVoucher({...currentVoucher, expenses: ex})}} className="w-full border-b border-zinc-200 p-1.5 text-xs outline-none transition-all" placeholder="Rationale..."/></div>
                            <div className="col-span-2 text-right"><label className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mr-1 mb-1 block">Magnitude ($)</label><input type="number" value={exp.amount || ''} onChange={e => {const ex = [...currentVoucher.expenses]; ex[idx].amount = Number(e.target.value); setCurrentVoucher({...currentVoucher, expenses: ex})}} className="w-full border-b border-zinc-200 p-1.5 text-xs font-mono font-bold text-right outline-none transition-all"/></div>
                            <div className="col-span-1 text-right"><button onClick={() => setCurrentVoucher({...currentVoucher, expenses: currentVoucher.expenses.filter((_, i) => i !== idx)})} className="p-2 text-zinc-300 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button></div>
                        </div>
                    ))}
                    {currentVoucher.expenses.length === 0 && (
                        <div className="text-center py-10 text-zinc-400 italic text-xs">No entries recorded.</div>
                    )}
                </div>
                <div className="mt-8 pt-8 border-t border-zinc-200 flex justify-between items-center px-4">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Settlement Claim</span>
                    <span className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">{formatCurrency(total)}</span>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-zinc-100">
                <button onClick={() => setViewMode('List')} className="px-8 py-3 border border-zinc-200 rounded-2xl text-xs font-bold uppercase text-zinc-500 hover:bg-zinc-50">Discard Draft</button>
                <button onClick={saveVoucher} className="px-12 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase hover:bg-zinc-800 transition-all shadow-2xl flex items-center gap-3 active:scale-95">
                    <ShieldCheck size={18}/> Commit Settlement
                </button>
            </div>
        </div>
    );
};

export default TravelVoucherManager;