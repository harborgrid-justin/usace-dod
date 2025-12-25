
import React, { useState } from 'react';
import { 
    DollarSign, Plus, Trash2, Edit, Save, ArrowLeft, 
    FileText, Search, AlertTriangle 
} from 'lucide-react';
import { TravelVoucher, TravelOrder, TravelExpense } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { travelService } from '../../services/TravelDataService';

interface Props {
    vouchers: TravelVoucher[];
    orders: TravelOrder[];
}

const TravelVoucherManager: React.FC<Props> = ({ vouchers, orders }) => {
    const [viewMode, setViewMode] = useState<'List' | 'Create' | 'Edit'>('List');
    const [currentVoucher, setCurrentVoucher] = useState<TravelVoucher | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Helpers ---
    const handleCreateVoucher = () => {
        setCurrentVoucher({
            id: `TV-24-${String(vouchers.length + 1).padStart(3, '0')}`,
            orderId: '',
            traveler: '',
            expenses: [],
            totalClaimed: 0,
            status: 'Draft'
        });
        setViewMode('Create');
    };

    const handleEditVoucher = (voucher: TravelVoucher) => {
        setCurrentVoucher(JSON.parse(JSON.stringify(voucher))); // Deep copy
        setViewMode('Edit');
    };
    
    const handleDeleteVoucher = (id: string) => {
        if(confirm('Are you sure you want to delete this travel voucher?')) {
            travelService.deleteVoucher(id);
        }
    };

    const saveVoucher = () => {
        if (!currentVoucher) return;
        const total = currentVoucher.expenses.reduce((sum, ex) => sum + Number(ex.amount), 0);
        
        // Validation: Check against Travel Order Limit
        if (currentVoucher.orderId) {
            const linkedOrder = orders.find(o => o.id === currentVoucher.orderId);
            if (linkedOrder && total > linkedOrder.estCost) {
                alert(`Cannot Save: Total claimed (${formatCurrency(total)}) exceeds the authorized limit of ${formatCurrency(linkedOrder.estCost)} on Travel Order ${linkedOrder.id}.`);
                return;
            }
        }

        const voucherToSave = { ...currentVoucher, totalClaimed: total };

        if (viewMode === 'Create') {
            travelService.addVoucher(voucherToSave);
        } else {
            travelService.updateVoucher(voucherToSave);
        }
        setViewMode('List');
        setCurrentVoucher(null);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            'Paid': 'bg-emerald-50 text-emerald-800 border-emerald-200',
            'Pending Review': 'bg-amber-50 text-amber-700 border-amber-100',
            'Draft': 'bg-zinc-100 text-zinc-600 border-zinc-200',
            'Approved': 'bg-blue-50 text-blue-700 border-blue-100'
        };
        // @ts-ignore
        const style = styles[status] || styles['Draft'];
        return <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${style}`}>{status}</span>;
    };

    // --- Render ---
    if (viewMode === 'List') {
        const filteredVouchers = vouchers.filter(v => 
            v.traveler.toLowerCase().includes(searchTerm.toLowerCase()) || 
            v.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm gap-4">
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={20}/></div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Travel Vouchers (DD 1351-2)</h3>
                            <p className="text-xs text-zinc-500">Claim Expenses & Reimbursement</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                type="text" 
                                placeholder="Search vouchers..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full sm:w-48 pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400"
                            />
                        </div>
                        <button onClick={handleCreateVoucher} className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors whitespace-nowrap">
                            <Plus size={14}/> New Voucher
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredVouchers.map(voucher => (
                        <div key={voucher.id} className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-blue-300 transition-all shadow-sm group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                                        {voucher.traveler.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-900">{voucher.traveler}</h4>
                                        <p className="text-xs text-zinc-500 font-mono">Ref: {voucher.orderId}</p>
                                    </div>
                                </div>
                                <StatusBadge status={voucher.status} />
                            </div>
                            <div className="flex justify-between items-end border-t border-zinc-100 pt-4 mt-2">
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Submitted</p>
                                    <p className="text-xs text-zinc-600">{voucher.dateSubmitted || 'Pending'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Claimed</p>
                                    <p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(voucher.totalClaimed)}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-2 border-t border-zinc-50 flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditVoucher(voucher)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors" title="Edit"><Edit size={14}/></button>
                                <button onClick={() => handleDeleteVoucher(voucher.id)} className="p-2 text-zinc-400 hover:text-rose-600 transition-colors" title="Delete"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                    {filteredVouchers.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
                            <p className="text-xs">No pending vouchers.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Form View Logic
    const addExpense = () => {
        if(!currentVoucher) return;
        const newExp: TravelExpense = {
            id: `EX-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            category: 'Meals',
            amount: 0,
            description: ''
        };
        setCurrentVoucher({ ...currentVoucher, expenses: [...currentVoucher.expenses, newExp] });
    };

    const removeExpense = (id: string) => {
        if(!currentVoucher) return;
        setCurrentVoucher({ ...currentVoucher, expenses: currentVoucher.expenses.filter(e => e.id !== id) });
    };

    const updateExpense = (id: string, field: keyof TravelExpense, value: any) => {
        if(!currentVoucher) return;
        setCurrentVoucher({
            ...currentVoucher,
            expenses: currentVoucher.expenses.map(e => e.id === id ? { ...e, [field]: value } : e)
        });
    };

    const linkOrder = (orderId: string) => {
        if(!currentVoucher) return;
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setCurrentVoucher({ ...currentVoucher, orderId: order.id, traveler: order.traveler });
        }
    };

    if (!currentVoucher) return null;
    
    const linkedOrder = orders.find(o => o.id === currentVoucher.orderId);
    const total = currentVoucher.expenses.reduce((s, e) => s + Number(e.amount), 0);
    const isOverLimit = linkedOrder && total > linkedOrder.estCost;

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 animate-in slide-in-from-right-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900">{viewMode === 'Create' ? 'New Travel Voucher' : 'Edit Travel Voucher'}</h3>
                    <p className="text-xs text-zinc-500 font-mono">DD 1351-2 • {currentVoucher.id}</p>
                </div>
                <button onClick={() => setViewMode('List')} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
                    <ArrowLeft size={14}/> Back to List
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Link Travel Order</label>
                    <select 
                        className="w-full mt-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-all"
                        value={currentVoucher.orderId}
                        onChange={e => linkOrder(e.target.value)}
                    >
                        <option value="">Select Order...</option>
                        {orders.filter(o => o.status === 'Approved').map(o => (
                            <option key={o.id} value={o.id}>{o.id} - {o.traveler} ({o.destination})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Traveler</label>
                    <input 
                        type="text" 
                        className="w-full mt-1.5 border border-zinc-200 rounded-lg p-2.5 text-sm bg-zinc-50/50 text-zinc-500"
                        value={currentVoucher.traveler}
                        disabled
                    />
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Reimbursable Expenses</h4>
                    <button onClick={addExpense} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                        <Plus size={12}/> Add Line Item
                    </button>
                </div>
                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="p-3 text-[10px] text-zinc-500 uppercase tracking-widest">Date</th>
                                <th className="p-3 text-[10px] text-zinc-500 uppercase tracking-widest">Category</th>
                                <th className="p-3 text-[10px] text-zinc-500 uppercase tracking-widest">Description</th>
                                <th className="p-3 text-[10px] text-zinc-500 uppercase tracking-widest text-right">Amount</th>
                                <th className="p-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {currentVoucher.expenses.map(exp => (
                                <tr key={exp.id}>
                                    <td className="p-2"><input type="date" value={exp.date} onChange={e => updateExpense(exp.id, 'date', e.target.value)} className="w-full text-xs p-1.5 border border-zinc-200 rounded bg-white"/></td>
                                    <td className="p-2">
                                        <select value={exp.category} onChange={e => updateExpense(exp.id, 'category', e.target.value)} className="w-full text-xs p-1.5 border border-zinc-200 rounded bg-white">
                                            <option>Airfare</option><option>Lodging</option><option>Meals</option><option>Ground Transport</option><option>Misc</option>
                                        </select>
                                    </td>
                                    <td className="p-2"><input type="text" value={exp.description} onChange={e => updateExpense(exp.id, 'description', e.target.value)} className="w-full text-xs p-1.5 border border-zinc-200 rounded bg-white"/></td>
                                    <td className="p-2"><input type="number" value={exp.amount} onChange={e => updateExpense(exp.id, 'amount', Number(e.target.value))} className="w-full text-xs p-1.5 border border-zinc-200 rounded bg-white text-right"/></td>
                                    <td className="p-2 text-center"><button onClick={() => removeExpense(exp.id)} className="text-zinc-300 hover:text-rose-500"><Trash2 size={14}/></button></td>
                                </tr>
                            ))}
                            {currentVoucher.expenses.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-xs text-zinc-400 italic">No expenses added. Click "Add Line Item" to begin.</td></tr>
                            )}
                        </tbody>
                        <tfoot className="bg-zinc-50 border-t border-zinc-200">
                            <tr>
                                <td colSpan={3} className="p-3 text-right text-xs font-bold text-zinc-600 uppercase tracking-widest">
                                    {linkedOrder ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-zinc-400">Order Authorized:</span>
                                            <span className="font-mono">{formatCurrency(linkedOrder.estCost)}</span>
                                        </div>
                                    ) : (
                                        <span>Total Claimed</span>
                                    )}
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`text-sm font-mono font-bold ${isOverLimit ? 'text-rose-600' : 'text-zinc-900'}`}>
                                            {formatCurrency(total)}
                                        </span>
                                        {isOverLimit && (
                                            <span className="text-[9px] font-bold text-rose-600 uppercase flex items-center gap-1">
                                                <AlertTriangle size={10} /> Exceeds Auth
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                <button onClick={() => setViewMode('List')} className="px-5 py-2.5 border border-zinc-200 rounded-lg text-xs font-bold uppercase hover:bg-zinc-50 transition-colors">Cancel</button>
                <button onClick={saveVoucher} disabled={!!isOverLimit} className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={14}/> Submit Voucher
                </button>
            </div>
        </div>
    );
};

export default TravelVoucherManager;
