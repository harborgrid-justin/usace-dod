
import React, { useState } from 'react';
import { RefreshCw, LayoutDashboard, Settings } from 'lucide-react';
import { revolvingFundService } from '../../services/RevolvingFundDataService';
import { useService } from '../../hooks/useService';
import DWCFDashboard from '../revolving_funds/DWCFDashboard';
import DWCFRateManager from '../revolving_funds/DWCFRateManager';
import DWCFActivityDetail from '../revolving_funds/DWCFActivityDetail';
import DWCFOrderDetail from '../revolving_funds/DWCFOrderDetail';

const RevolvingFundsView: React.FC<any> = () => {
    const [view, setView] = useState('Dashboard');
    const [selActivity, setSelActivity] = useState<any>(null);
    const [selOrder, setSelOrder] = useState<any>(null);
    
    const accounts = useService(revolvingFundService, () => revolvingFundService.getAccounts());
    const activities = useService(revolvingFundService, () => revolvingFundService.getActivities());
    const orders = useService(revolvingFundService, () => revolvingFundService.getOrders());
    const billings = useService(revolvingFundService, () => revolvingFundService.getBillings());
    const rates = useService(revolvingFundService, () => revolvingFundService.getRates());

    const renderContent = () => {
        if (selOrder) return <DWCFOrderDetail order={selOrder} billings={billings.filter(b => b.orderId === selOrder.id)} onBack={() => setSelOrder(null)} onAddBill={(id, data) => revolvingFundService.addBilling({...data, id: `BILL-${Date.now()}`, orderId: id} as any)} onUpdateBillStatus={(id, s) => revolvingFundService.updateBillingStatus(id, s)} />;
        if (selActivity) return <DWCFActivityDetail activity={selActivity} orders={orders.filter(o => o.dwcfActivityId === selActivity.id)} billings={billings} onBack={() => setSelActivity(null)} onSelectOrder={setSelOrder} onAddOrder={(data) => revolvingFundService.addOrder(data)} />;
        
        if (view === 'Rates') return <DWCFRateManager rates={rates} activities={activities} onUpdateRate={(r) => revolvingFundService.updateRate(r)} />;
        return <DWCFDashboard accounts={accounts} activities={activities} onSelectActivity={setSelActivity} />;
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 px-2">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                        <RefreshCw size={28} className="text-emerald-700" /> DWCF
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">
                        Defense Working Capital Fund (10 U.S.C. 2208)
                    </p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-md shadow-inner">
                    {['Dashboard', 'Rates'].map(v => ( 
                        <button 
                            key={v} 
                            onClick={() => { setView(v); setSelActivity(null); setSelOrder(null); }} 
                            className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                                view === v && !selActivity && !selOrder ? 'bg-white shadow-sm text-emerald-700' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            {v === 'Dashboard' ? <LayoutDashboard size={12}/> : <Settings size={12}/>}
                            {v}
                        </button> 
                    ))}
                </div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};
export default RevolvingFundsView;
