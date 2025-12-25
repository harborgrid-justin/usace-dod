
import React, { useState } from 'react';
import { InventoryItem, InventoryTransaction } from '../../types';
import { Package, Search, ArrowDownLeft, ArrowUpRight, AlertTriangle, History, MapPin, Tag, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import Modal from '../shared/Modal';

interface Props {
    inventory: InventoryItem[];
    onUpdateInventory: (item: InventoryItem) => void;
}

const InventoryManager: React.FC<Props> = ({ inventory, onUpdateInventory }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [transactionType, setTransactionType] = useState<'Receipt' | 'Adjustment' | null>(null);
    const [qtyInput, setQtyInput] = useState<number>(0);
    const [notesInput, setNotesInput] = useState('');

    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTransaction = () => {
        if (!selectedItem || !transactionType || qtyInput <= 0) return;

        const newQty = transactionType === 'Receipt' 
            ? selectedItem.quantityOnHand + qtyInput 
            : qtyInput;

        const transaction: InventoryTransaction = {
            id: `TX-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: transactionType,
            quantity: qtyInput,
            user: 'CURRENT_USER',
            notes: notesInput
        };

        onUpdateInventory({
            ...selectedItem,
            quantityOnHand: newQty,
            transactions: [transaction, ...selectedItem.transactions]
        });

        setTransactionType(null);
        setQtyInput(0);
        setNotesInput('');
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <h3 className="text-lg font-bold text-zinc-900 hidden sm:block">Inventory</h3>
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Search SKU or Name..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                        <AlertTriangle size={12}/> {inventory.filter(i => i.quantityOnHand <= i.reorderPoint).length} Low Stock
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
                        <Package size={12}/> {inventory.length} Items
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 relative">
                {/* Inventory List - Hidden on mobile if item selected */}
                <div className={`lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col ${selectedItem ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0">
                                <tr>
                                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Item Details</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:table-cell">Location</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Stock</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right hidden sm:table-cell">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredItems.map(item => (
                                    <tr 
                                        key={item.id} 
                                        onClick={() => setSelectedItem(item)}
                                        className={`cursor-pointer transition-colors ${selectedItem?.id === item.id ? 'bg-blue-50' : 'hover:bg-zinc-50'}`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-zinc-100 rounded border border-zinc-200 text-zinc-500 shrink-0">
                                                    <Package size={16}/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                                                    <p className="text-[10px] font-mono text-zinc-500">{item.sku}</p>
                                                    <span className="text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded mt-1 inline-block">{item.category}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-zinc-600 hidden sm:table-cell">
                                            <div className="flex items-center gap-1"><MapPin size={12}/> {item.location}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <p className={`font-mono font-bold text-sm ${item.quantityOnHand <= item.reorderPoint ? 'text-rose-600' : 'text-zinc-900'}`}>
                                                {item.quantityOnHand} <span className="text-[10px] font-normal text-zinc-500">{item.unitOfMeasure}</span>
                                            </p>
                                            {item.quantityOnHand <= item.reorderPoint && <p className="text-[9px] text-rose-500 font-bold uppercase">Reorder</p>}
                                        </td>
                                        <td className="p-4 text-right font-mono text-xs text-zinc-700 hidden sm:table-cell">
                                            {formatCurrency(item.unitCost)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Panel - Full screen on mobile when active */}
                <div className={`bg-white border border-zinc-200 rounded-xl shadow-sm p-6 flex flex-col absolute inset-0 lg:static z-20 lg:z-auto ${selectedItem ? 'flex' : 'hidden lg:flex'}`}>
                    {selectedItem ? (
                        <>
                            <div className="lg:hidden mb-4 pb-2 border-b border-zinc-100">
                                <button onClick={() => setSelectedItem(null)} className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                    <ArrowLeft size={14}/> Back to List
                                </button>
                            </div>
                            <div className="mb-6 pb-6 border-b border-zinc-100">
                                <h4 className="text-lg font-bold text-zinc-900 mb-1">{selectedItem.name}</h4>
                                <p className="text-xs text-zinc-500 font-mono mb-4">SKU: {selectedItem.sku}</p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">On Hand</p>
                                        <p className="text-xl font-mono font-bold text-zinc-900">{selectedItem.quantityOnHand}</p>
                                    </div>
                                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">Value</p>
                                        <p className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(selectedItem.quantityOnHand * selectedItem.unitCost)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setTransactionType('Receipt')} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-500 flex items-center justify-center gap-2">
                                        <ArrowDownLeft size={14}/> Receive
                                    </button>
                                    <button onClick={() => setTransactionType('Adjustment')} className="flex-1 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold uppercase hover:bg-zinc-200 flex items-center justify-center gap-2">
                                        <Tag size={14}/> Adjust
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <History size={14} className="text-zinc-400"/> History
                                </h5>
                                <div className="space-y-3">
                                    {selectedItem.transactions.length > 0 ? selectedItem.transactions.map(tx => (
                                        <div key={tx.id} className="text-xs p-3 bg-zinc-50 rounded border border-zinc-100">
                                            <div className="flex justify-between font-bold text-zinc-800 mb-1">
                                                <span>{tx.type}</span>
                                                <span className={tx.type === 'Receipt' ? 'text-emerald-600' : 'text-zinc-600'}>
                                                    {tx.type === 'Receipt' ? '+' : ''}{tx.quantity}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-zinc-500 text-[10px]">
                                                <span>{tx.date}</span>
                                                <span>{tx.workOrderId || 'Manual'}</span>
                                            </div>
                                        </div>
                                    )) : <p className="text-xs text-zinc-400 italic text-center py-4">No recent history.</p>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-2">
                            <Package size={32} className="opacity-20"/>
                            <p className="text-xs">Select an item to view details.</p>
                        </div>
                    )}
                </div>
            </div>

            {transactionType && (
                <Modal title={`${transactionType} Inventory`} onClose={() => setTransactionType(null)}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Quantity</label>
                            <input 
                                type="number" 
                                value={qtyInput} 
                                onChange={e => setQtyInput(Number(e.target.value))}
                                className="w-full mt-1 border rounded p-2 text-sm" 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Reason / Notes</label>
                            <textarea 
                                value={notesInput} 
                                onChange={e => setNotesInput(e.target.value)}
                                className="w-full mt-1 border rounded p-2 text-sm resize-none" 
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={handleTransaction} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase">Confirm</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default InventoryManager;
