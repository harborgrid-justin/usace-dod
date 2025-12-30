
import React, { useState } from 'react';
import { DWCFActivity, DWCFOrder, DWCFBilling, DWCFBillingStatus } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ArrowLeft, Plus, ArrowRight, BookOpen, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { FMR_V11B_CH3_CONTENT } from '../../utils/fmrContent';
import UnfundedOrdersManager from './UnfundedOrdersManager';
import DWCFOrderForm from './DWCFOrderForm';

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
        <div className="flex flex-col h-full space-y-8 animate-in slide-in-from-right-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-100 pb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-sm text-zinc-500 hover:text-zinc-900 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{activity.name}</h2>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Activity Group Management</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white border border-zinc-200 rounded-sm shadow-sm flex flex-col items-end min-w-[140px]">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                            <TrendingUp size={10} className="text-emerald-500"/> Collections
                        </span>
                        <span className="text-sm font-mono font-bold text-zinc-900 mt-1">{formatCurrency(activity.collections)}</span>
                    </div>
                    <div className="px-4 py-2 bg-white border border-zinc-200 rounded-sm shadow-sm flex flex-col items-end min-w-[140px]">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                            <TrendingDown size={10} className="text-rose-500"/> Disbursements
                        </span>
                        <span className="text-sm font-mono font-bold text-zinc-900 mt-1">{formatCurrency(activity.disbursements)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-md shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Customer Orders</h3>
                        <button 
                            onClick={() => setViewState('CREATE_ORDER')}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors shadow-sm"
                        >
                            <Plus size={12}/> New Order
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order Details</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Billed</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase text-center">Status</th>
                                    <th className="px-6 py-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {orders.map(order => {
                                    const billed = getBilledAmount(order.id);
                                    const pct = (billed / order.totalAmount) * 100;
                                    return (
                                        <tr key={order.id} className="hover:bg-zinc-50 cursor-pointer group transition-colors" onClick={() => onSelectOrder(order)}>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-zinc-800">{order.customer}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{order.description} <span className="font-mono text-[10px] text-zinc-400 ml-1">({order.id})</span></p>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xs font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-mono text-xs font-medium text-zinc-700">{formatCurrency(billed)}</span>
                                                    <div className="h-1 w-20 bg-zinc-100 rounded-full mt-1.5 overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{width: `${Math.min(pct, 100)}%`}} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase border ${order.status === 'Complete' ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-600 transition-colors"/>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col gap-6 h-full min-h-0 overflow-hidden">
                    <UnfundedOrdersManager />
                    <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm flex-1 flex flex-col overflow-hidden">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-50 pb-4 shrink-0">
                            <BookOpen size={14} className="text-emerald-700" /> FMR Guidance (Vol 11B)
                        </h3>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-sm p-4 flex-1 overflow-y-auto custom-scrollbar shadow-inner">
                            <pre className="whitespace-pre-wrap font-sans text-[11px] text-zinc-600 leading-relaxed">
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
