import React, { useState } from 'react';
import { DWCFActivity, DWCFOrder, DWCFBilling, DWCFBillingStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ArrowLeft, Plus, ArrowRight, BookOpen } from 'lucide-react';
import { FMR_V11B_CH3_CONTENT } from '../../utils/fmrContent';
import UnfundedOrdersManager from './UnfundedOrdersManager';
import DWCFOrderForm from './DWCFOrderForm'; // Assumed component name for full page form

interface Props {
    activity: DWCFActivity;
    orders: DWCFOrder[];
    billings: DWCFBilling[];
    onBack: () => void;
    onSelectOrder: (order: DWCFOrder) => void;
    onAddOrder: (orderData: any) => void;
}

const DWCFActivityDetail: React.FC<Props> = ({ activity, orders, billings, onBack, onSelectOrder, onAddOrder }) => {
    const [viewState, setViewState] = useState<'VIEW' | 'CREATE_ORDER'>('VIEW');
    
    const getBilledAmount = (orderId: string) => {
        return billings
            .filter(b => b.orderId === orderId && b.status !== 'Canceled')
            .reduce((sum, b) => sum + b.total, 0);
    };

    if (viewState === 'CREATE_ORDER') {
        return (
            <DWCFOrderForm 
                activityId={activity.id} 
                onCancel={() => setViewState('VIEW')} 
                onSubmit={(data) => { onAddOrder(data); setViewState('VIEW'); }} 
            />
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">{activity.name}</h2>
                        <p className="text-xs text-zinc-500">Activity Group Management</p>
                    </div>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="px-3 py-1.5 bg-zinc-100 rounded-lg">
                        <span className="text-zinc-500 block text-[9px] uppercase font-bold">Collections</span>
                        <span className="text-zinc-900 font-bold">{formatCurrency(activity.collections)}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-zinc-100 rounded-lg">
                        <span className="text-zinc-500 block text-[9px] uppercase font-bold">Disbursements</span>
                        <span className="text-zinc-900 font-bold">{formatCurrency(activity.disbursements)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Customer Orders</h3>
                        <button 
                            onClick={() => setViewState('CREATE_ORDER')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors"
                        >
                            <Plus size={12}/> New Order
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-zinc-100 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order Details</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Billed</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {orders.map(order => {
                                    const billed = getBilledAmount(order.id);
                                    const pct = (billed / order.totalAmount) * 100;
                                    return (
                                        <tr key={order.id} className="hover:bg-zinc-50 cursor-pointer group" onClick={() => onSelectOrder(order)}>
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-bold text-zinc-800">{order.customer}</p>
                                                <p className="text-xs text-zinc-500">{order.description} <span className="font-mono text-[10px] text-zinc-400">({order.id})</span></p>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-xs font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-mono text-xs font-medium text-zinc-700">{formatCurrency(billed)}</span>
                                                    <div className="h-1 w-16 bg-zinc-100 rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{width: `${Math.min(pct, 100)}%`}} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${order.status === 'Complete' ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-600"/>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <UnfundedOrdersManager />
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex-1">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><BookOpen size={14} /> FMR Guidance (Vol 11B)</h3>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 h-full max-h-64 overflow-y-auto custom-scrollbar">
                            <pre className="whitespace-pre-wrap font-sans text-[10px] text-zinc-600 leading-relaxed">
                                {FMR_V11B_CH3_CONTENT}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DWCFActivityDetail;