
import React, { useState, useEffect } from 'react';
import { Plane, FileText, DollarSign } from 'lucide-react';
import { TravelOrder, TravelVoucher } from '../../types';
import TravelOrderManager from '../travel/TravelOrderManager';
import TravelVoucherManager from '../travel/TravelVoucherManager';
import { travelService } from '../../services/TravelDataService';

const TravelView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Orders' | 'Vouchers'>('Orders');
    
    // Live State from Service
    const [orders, setOrders] = useState<TravelOrder[]>(travelService.getOrders());
    const [vouchers, setVouchers] = useState<TravelVoucher[]>(travelService.getVouchers());

    useEffect(() => {
        const unsubscribe = travelService.subscribe(() => {
            setOrders([...travelService.getOrders()]);
            setVouchers([...travelService.getVouchers()]);
        });
        return unsubscribe;
    }, []);

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Plane size={24} className="text-rose-700" /> Travel Management
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Joint Travel Regulations (JTR) Compliance</p>
                </div>
                
                <div className="flex bg-zinc-100 p-1 rounded-lg min-w-max">
                    <button 
                        onClick={() => setActiveTab('Orders')} 
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === 'Orders' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <FileText size={12}/> Travel Orders
                    </button>
                    <button 
                        onClick={() => setActiveTab('Vouchers')} 
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === 'Vouchers' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <DollarSign size={12}/> Vouchers
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {activeTab === 'Orders' ? (
                    <TravelOrderManager orders={orders} />
                ) : (
                    <TravelVoucherManager vouchers={vouchers} orders={orders} />
                )}
            </div>
        </div>
    );
};

export default TravelView;
