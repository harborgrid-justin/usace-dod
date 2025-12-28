
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
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

    if (selOrder) return <DWCFOrderDetail order={selOrder} billings={billings.filter(b => b.orderId === selOrder.id)} onBack={() => setSelOrder(null)} onAddBill={() => {}} onUpdateBillStatus={() => {}} />;
    if (selActivity) return <DWCFActivityDetail activity={selActivity} orders={orders.filter(o => o.dwcfActivityId === selActivity.id)} billings={billings} onBack={() => setSelActivity(null)} onSelectOrder={setSelOrder} onNewOrder={() => {}} />;

    return (
        <div className="p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex justify-between items-end shrink-0">
                <div><h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3"><RefreshCw size={24} className="text-emerald-700" /> DWCF</h2><p className="text-xs text-zinc-500">Defense Working Capital Fund (10 U.S.C. 2208)</p></div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    {['Dashboard', 'Rates'].map(v => ( <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${view === v ? 'bg-white shadow-sm text-emerald-700' : 'text-zinc-500'}`}>{v}</button> ))}
                </div>
            </div>
            {view === 'Dashboard' ? <DWCFDashboard accounts={accounts} activities={activities} onSelectActivity={setSelActivity} /> : <DWCFRateManager rates={rates} activities={activities} onUpdateRate={() => {}} />}
        </div>
    );
};
export default RevolvingFundsView;
