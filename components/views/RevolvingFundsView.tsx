import React, { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import { RefreshCw, LayoutDashboard, Settings, Activity, ArrowRight } from 'lucide-react';
import { DWCFActivity, DWCFOrder, DWCFBilling, DWCFBillingStatus, DWCFRateProfile, DWCFTransaction, DWCFAccount } from '../../types';
import DWCFDashboard from '../revolving_funds/DWCFDashboard';
import DWCFActivityDetail from '../revolving_funds/DWCFActivityDetail';
import DWCFOrderDetail from '../revolving_funds/DWCFOrderDetail';
import DWCFRateManager from '../revolving_funds/DWCFRateManager';
import CashFlowMonitor from '../revolving_funds/CashFlowMonitor';
import { formatCurrency } from '../../utils/formatting';
import { revolvingFundService } from '../../services/RevolvingFundDataService';

interface RevolvingFundsViewProps {
  onSelectThread: (threadId: string) => void;
}

const RevolvingFundsView: React.FC<RevolvingFundsViewProps> = ({ onSelectThread }) => {
    const [isPending, startTransition] = useTransition();
    const [currentView, setCurrentView] = useState<'Dashboard' | 'Rates'>('Dashboard');
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const [accounts, setAccounts] = useState(revolvingFundService.getAccounts());
    const [activities, setActivities] = useState(revolvingFundService.getActivities());
    const [orders, setOrders] = useState(revolvingFundService.getOrders());
    const [billings, setBillings] = useState(revolvingFundService.getBillings());
    const [transactions, setTransactions] = useState(revolvingFundService.getTransactions());
    const [rates, setRates] = useState(revolvingFundService.getRates());

    useEffect(() => {
        const unsubscribe = revolvingFundService.subscribe(() => {
            setAccounts([...revolvingFundService.getAccounts()]);
            setActivities([...revolvingFundService.getActivities()]);
            setOrders([...revolvingFundService.getOrders()]);
            setBillings([...revolvingFundService.getBillings()]);
            setTransactions([...revolvingFundService.getTransactions()]);
            setRates([...revolvingFundService.getRates()]);
        });
        return unsubscribe;
    }, []);

    const selectedActivity = useMemo(() => activities.find(a => a.id === selectedActivityId), [activities, selectedActivityId]);
    const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId), [orders, selectedOrderId]);

    // Added handleTabChange to fix "Cannot find name 'handleTabChange'" error.
    const handleTabChange = useCallback((v: 'Dashboard' | 'Rates') => {
        startTransition(() => {
            setCurrentView(v);
        });
    }, []);

    const handleSelectActivity = useCallback((activity: DWCFActivity) => {
        startTransition(() => {
            setSelectedActivityId(activity.id);
        });
    }, []);

    const handleSelectOrder = useCallback((order: DWCFOrder) => {
        startTransition(() => {
            setSelectedOrderId(order.id);
        });
    }, []);

    const handleBack = useCallback(() => {
        startTransition(() => {
            if (selectedOrderId) setSelectedOrderId(null);
            else if (selectedActivityId) setSelectedActivityId(null);
        });
    }, [selectedOrderId, selectedActivityId]);

    const handleUpdateBillStatus = useCallback((billId: string, newStatus: DWCFBillingStatus) => {
        revolvingFundService.updateBillingStatus(billId, newStatus);
    }, []);

    if (selectedOrder) {
        return (
            <DWCFOrderDetail 
                order={selectedOrder}
                billings={billings.filter(b => b.orderId === selectedOrder.id)}
                onBack={handleBack}
                onAddBill={(id, data) => revolvingFundService.addBilling({ ...data, id: `BILL-${Date.now()}`, orderId: id, status: 'Draft' })}
                onUpdateBillStatus={handleUpdateBillStatus}
            />
        );
    }

    if (selectedActivity) {
        return (
            <DWCFActivityDetail 
                activity={selectedActivity}
                orders={orders.filter(o => o.dwcfActivityId === selectedActivity.id)}
                billings={billings}
                onBack={handleBack}
                onSelectOrder={handleSelectOrder}
                onNewOrder={() => {}}
            />
        );
    }

    return (
        <div className={`p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <RefreshCw size={24} className="text-emerald-700" /> Defense Working Capital Fund
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Revolving Fund Management (10 U.S.C. 2208)</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    {['Dashboard', 'Rates'].map(v => (
                        <button key={v} onClick={() => handleTabChange(v as any)} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${currentView === v ? 'bg-white shadow-sm text-emerald-700' : 'text-zinc-500'}`}>{v}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-6">
                {currentView === 'Dashboard' ? (
                    <>
                        <DWCFDashboard accounts={accounts} activities={activities} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 flex flex-col overflow-hidden">
                                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={14}/> Business Areas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto custom-scrollbar">
                                    {activities.map(activity => (
                                        <button key={activity.id} onClick={() => handleSelectActivity(activity)} className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all text-left group">
                                            <div className="flex justify-between items-start mb-2"><span className="font-bold text-zinc-900">{activity.name}</span><ArrowRight size={16} className="text-zinc-300 group-hover:text-emerald-500 transition-colors"/></div>
                                            <p className="text-sm font-mono text-emerald-600 font-bold">{formatCurrency(activity.collections)}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <CashFlowMonitor transactions={transactions} />
                        </div>
                    </>
                ) : (
                    <DWCFRateManager rates={rates} activities={activities} onUpdateRate={(r) => revolvingFundService.updateRate(r)} />
                )}
            </div>
        </div>
    );
};

export default RevolvingFundsView;