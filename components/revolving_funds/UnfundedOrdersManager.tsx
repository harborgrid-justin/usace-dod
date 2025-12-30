
import React, { useState, useEffect } from 'react';
import { Bell, Clock, Check, AlertTriangle } from 'lucide-react';
import { UnfundedCustomerOrder } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { revolvingFundService } from '../../services/RevolvingFundDataService';

const UnfundedOrdersManager: React.FC = () => {
    const [orders, setOrders] = useState<UnfundedCustomerOrder[]>(revolvingFundService.getUnfundedOrders());
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const unsubscribe = revolvingFundService.subscribe(() => {
            setOrders([...revolvingFundService.getUnfundedOrders()]);
        });
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const handleNotify = (orderId: string) => {
        revolvingFundService.updateUnfundedOrder(orderId, {
            status: 'Pending OUSD(C)',
            notificationTimestamp: Date.now()
        });
    };

    const getRemainingTime = (timestamp?: number) => {
        if (!timestamp) return 0;
        const fiveWorkdays = 5 * 24 * 60 * 60 * 1000;
        const endTime = timestamp + fiveWorkdays;
        return Math.max(0, endTime - Date.now());
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm shrink-0">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" /> Priority Unfunded Orders
            </h3>
            <div className="bg-amber-50 border border-amber-100 rounded-sm p-3 mb-4">
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                    Per FMR Vol 11B Ch 11 (230606), 5-day waiting period required after OUSD(C) notification before filling orders without advance funding.
                </p>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {orders.map(order => {
                    const remaining = getRemainingTime(order.notificationTimestamp);
                    const isPending = order.status === 'Pending OUSD(C)';
                    const isCleared = order.status === 'Cleared' || (isPending && remaining === 0);

                    return (
                        <div key={order.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-sm group hover:border-zinc-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs font-bold text-zinc-800">{order.customer}</p>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{order.id}</p>
                                </div>
                                <span className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(order.amount)}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-zinc-200/50">
                                {order.status === 'Requires Notification' && (
                                    <button onClick={() => handleNotify(order.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm">
                                        <Bell size={12} /> Notify OUSD(C)
                                    </button>
                                )}
                                {isPending && !isCleared && (
                                    <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-sm text-[10px] font-bold uppercase">
                                        <Clock size={12} /> 
                                        <span>Wait: {Math.floor(remaining / (1000 * 60 * 60 * 24))}d {new Date(remaining).toISOString().substr(11, 8)}</span>
                                    </div>
                                )}
                                {isCleared && (
                                    <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm text-[10px] font-bold uppercase">
                                        <Check size={12} /> Cleared for Funding
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {orders.length === 0 && <p className="text-[10px] text-zinc-400 text-center py-6 font-bold uppercase tracking-widest border border-dashed border-zinc-200 rounded-sm">No unfunded orders pending.</p>}
            </div>
        </div>
    );
};

export default UnfundedOrdersManager;
