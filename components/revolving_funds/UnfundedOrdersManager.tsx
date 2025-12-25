
import React, { useState, useEffect } from 'react';
import { Bell, Clock, Check, AlertTriangle } from 'lucide-react';
import { UnfundedCustomerOrder } from '../../types';
import { MOCK_UNFUNDED_ORDERS } from '../../constants';
import { formatCurrency } from '../../utils/formatting';

const UnfundedOrdersManager: React.FC = () => {
    const [orders, setOrders] = useState<UnfundedCustomerOrder[]>(MOCK_UNFUNDED_ORDERS);
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleNotify = (orderId: string) => {
        setOrders(orders.map(o => 
            o.id === orderId 
            ? { ...o, status: 'Pending OUSD(C)', notificationTimestamp: Date.now() } 
            : o
        ));
    };

    const getRemainingTime = (timestamp?: number) => {
        if (!timestamp) return 0;
        const fiveWorkdays = 5 * 24 * 60 * 60 * 1000; // Simplified for demo
        const endTime = timestamp + fiveWorkdays;
        return Math.max(0, endTime - Date.now());
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" /> Priority Unfunded Orders
            </h3>
            <p className="text-[10px] text-zinc-500 mb-4 leading-relaxed">
                Per FMR Vol 11B Ch 11 (230606), 5-day waiting period required after OUSD(C) notification before filling orders without advance funding.
            </p>
            <div className="space-y-3">
                {orders.map(order => {
                    const remaining = getRemainingTime(order.notificationTimestamp);
                    const isPending = order.status === 'Pending OUSD(C)';
                    const isCleared = order.status === 'Cleared' || (isPending && remaining === 0);

                    return (
                        <div key={order.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-lg group hover:border-zinc-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs font-bold text-zinc-800">{order.customer}</p>
                                    <p className="text-[10px] text-zinc-500 font-mono">{order.id}</p>
                                </div>
                                <span className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(order.amount)}</span>
                            </div>
                            <div className="mt-3">
                                {order.status === 'Requires Notification' && (
                                    <button onClick={() => handleNotify(order.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors shadow-sm">
                                        <Bell size={12} /> Notify OUSD(C)
                                    </button>
                                )}
                                {isPending && !isCleared && (
                                    <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold uppercase">
                                        <Clock size={12} /> 
                                        <span>Wait: {Math.floor(remaining / (1000 * 60 * 60 * 24))}d {new Date(remaining).toISOString().substr(11, 8)}</span>
                                    </div>
                                )}
                                {isCleared && (
                                    <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold uppercase">
                                        <Check size={12} /> Cleared for Funding
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {orders.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No unfunded orders.</p>}
            </div>
        </div>
    );
};

export default UnfundedOrdersManager;
