
import React, { useState, useMemo } from 'react';
import { RefreshCw, LayoutDashboard, Settings, Activity, ArrowLeft, ArrowRight } from 'lucide-react';
import { 
    MOCK_DWCF_ACCOUNTS, 
    MOCK_DWCF_ACTIVITIES, 
    MOCK_DWCF_ORDERS,
    MOCK_DWCF_BILLINGS,
} from '../../constants';
import { DWCFActivity, DWCFOrder, DWCFBilling, DWCFBillingStatus, DWCFTransaction } from '../../types';
import DWCFDashboard from '../revolving_funds/DWCFDashboard';
import DWCFActivityDetail from '../revolving_funds/DWCFActivityDetail';
import DWCFOrderDetail from '../revolving_funds/DWCFOrderDetail';
import DWCFRateManager from '../revolving_funds/DWCFRateManager';
import CashFlowMonitor from '../revolving_funds/CashFlowMonitor';
import { formatCurrency } from '../../utils/formatting';

interface RevolvingFundsViewProps {
  onSelectThread: (threadId: string) => void;
}

const RevolvingFundsView: React.FC<RevolvingFundsViewProps> = ({ onSelectThread }) => {
    // --- State Management ---
    // 1. Navigation State
    const [currentView, setCurrentView] = useState<'Dashboard' | 'Rates'>('Dashboard');
    const [selectedActivity, setSelectedActivity] = useState<DWCFActivity | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<DWCFOrder | null>(null);

    // 2. Data State
    const [ordersData, setOrdersData] = useState<DWCFOrder[]>(MOCK_DWCF_ORDERS);
    const [billingsData, setBillingsData] = useState<DWCFBilling[]>(MOCK_DWCF_BILLINGS);
    const [activities, setActivities] = useState<DWCFActivity[]>(MOCK_DWCF_ACTIVITIES);
    
    // Mock Transactions for Cash Flow
    const [transactions, setTransactions] = useState<DWCFTransaction[]>([
        { id: 'TX-001', date: '2024-03-15', activityId: 'ACT-SUP', type: 'Collection', amount: 45000, description: 'SLA Payment' },
        { id: 'TX-002', date: '2024-03-14', activityId: 'ACT-IND', type: 'Disbursement', amount: 12000, description: 'Payroll Run' },
        { id: 'TX-003', date: '2024-03-12', activityId: 'ACT-SUP', type: 'Collection', amount: 150000, description: 'Bulk Fuel' }
    ]);

    // --- Handlers ---

    // Navigation
    const handleSelectActivity = (activity: DWCFActivity) => {
        setSelectedActivity(activity);
    };

    const handleSelectOrder = (order: DWCFOrder) => {
        setSelectedOrder(order);
    };

    const handleBack = () => {
        if (selectedOrder) {
            setSelectedOrder(null);
        } else if (selectedActivity) {
            setSelectedActivity(null);
        } else {
            // Already at root
        }
    };

    // Data Mutations
    const handleAddOrder = () => {
        const newOrder: DWCFOrder = {
            id: `ORD-${Date.now().toString().slice(-5)}`,
            customer: 'New Customer',
            description: 'New Requirement',
            totalAmount: 0,
            status: 'In Process',
            dwcfActivityId: selectedActivity?.id || ''
        };
        setOrdersData([newOrder, ...ordersData]);
        setSelectedOrder(newOrder); // Jump to edit
    };

    const handleAddBill = (orderId: string, newBillData: Omit<DWCFBilling, 'id' | 'orderId' | 'status'>) => {
        const newBill: DWCFBilling = {
            id: `BILL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            orderId,
            status: 'Draft',
            ...newBillData
        };
        setBillingsData(prev => [newBill, ...prev]);
    };

    const handleUpdateBillStatus = (billId: string, newStatus: DWCFBillingStatus) => {
        setBillingsData(prev => prev.map(b => b.id === billId ? {...b, status: newStatus} : b));
        
        // If paid, add to cash flow
        if (newStatus === 'Paid') {
            const bill = billingsData.find(b => b.id === billId);
            if (bill) {
                const order = ordersData.find(o => o.id === bill.orderId);
                setTransactions(prev => [{
                    id: `TX-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    activityId: order?.dwcfActivityId || 'UNKNOWN',
                    type: 'Collection',
                    amount: bill.total,
                    description: `Payment for ${bill.id}`
                }, ...prev]);
                
                // Update Activity Collections
                if (order) {
                    setActivities(prev => prev.map(a => a.id === order.dwcfActivityId ? { ...a, collections: a.collections + bill.total } : a));
                }
            }
        }
    };

    // --- Render Logic ---

    // 1. Order Detail View
    if (selectedOrder) {
        return (
            <DWCFOrderDetail 
                order={selectedOrder}
                billings={billingsData.filter(b => b.orderId === selectedOrder.id)}
                onBack={handleBack}
                onAddBill={handleAddBill}
                onUpdateBillStatus={handleUpdateBillStatus}
            />
        );
    }

    // 2. Activity Detail View
    if (selectedActivity) {
        return (
            <DWCFActivityDetail 
                activity={selectedActivity}
                orders={ordersData.filter(o => o.dwcfActivityId === selectedActivity.id)}
                billings={billingsData}
                onBack={handleBack}
                onSelectOrder={handleSelectOrder}
                onNewOrder={handleAddOrder}
            />
        );
    }

    // 3. Main Dashboard / Rates View
    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <RefreshCw size={24} className="text-emerald-700" /> Defense Working Capital Fund
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Revolving Fund Management (10 U.S.C. 2208)</p>
                </div>
                
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setCurrentView('Dashboard')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${currentView === 'Dashboard' ? 'bg-white shadow-sm text-emerald-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <LayoutDashboard size={14} /> Dashboard
                    </button>
                    <button 
                        onClick={() => setCurrentView('Rates')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${currentView === 'Rates' ? 'bg-white shadow-sm text-emerald-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Settings size={14} /> Rate Mgmt
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 flex flex-col gap-6">
                {currentView === 'Dashboard' ? (
                    <div className="flex flex-col h-full gap-6">
                        <div className="flex-1 min-h-0">
                            <DWCFDashboard accounts={MOCK_DWCF_ACCOUNTS} activities={activities} />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                            {/* Activity Navigation */}
                            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 flex flex-col">
                                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity size={14} className="text-zinc-400"/> Business Areas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto custom-scrollbar">
                                    {activities.map(activity => (
                                        <button 
                                            key={activity.id}
                                            onClick={() => handleSelectActivity(activity)}
                                            className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all text-left group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-zinc-900">{activity.name}</span>
                                                <ArrowRight size={16} className="text-zinc-300 group-hover:text-emerald-500 transition-colors"/>
                                            </div>
                                            <p className="text-xs text-zinc-500 font-mono mb-4">{activity.id}</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[9px] font-bold text-zinc-400 uppercase">Revenue</p>
                                                    <p className="text-sm font-mono text-emerald-600 font-bold">{formatCurrency(activity.collections)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-zinc-400 uppercase">Orders</p>
                                                    <p className="text-sm font-mono text-zinc-900 font-bold">{ordersData.filter(o => o.dwcfActivityId === activity.id).length}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cash Flow Monitor */}
                            <div className="lg:col-span-1 h-full">
                                <CashFlowMonitor transactions={transactions} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <DWCFRateManager activities={activities} />
                )}
            </div>
        </div>
    );
};

export default RevolvingFundsView;
