
import React, { useState } from 'react';
import { ClipboardList, Wrench, CalendarClock, Package, Book } from 'lucide-react';
import RequestHub from './modules/RequestHub';
import WorkOrderTracker from './modules/WorkOrderTracker';
import PMScheduleEngine from './modules/PMScheduleEngine';
import InventoryConsole from './modules/InventoryConsole';
import JobPlanLibrary from './modules/JobPlanLibrary';
import WorkOrderDetailModal from './WorkOrderDetailModal';
import { WorkOrder } from '../../types';
import { useMaintenanceData } from '../../hooks/useDomainData';
import { maintenanceService } from '../../services/MaintenanceDataService';

const MaintenanceManager: React.FC = () => {
    const { workOrders, inventory, vendors } = useMaintenanceData();
    const [activeTab, setActiveTab] = useState('WorkOrders');
    const [viewState, setViewState] = useState<'DASHBOARD' | 'DETAIL'>('DASHBOARD');
    const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

    const TABS = [
        {id: 'Requests', icon: ClipboardList}, {id: 'WorkOrders', icon: Wrench},
        {id: 'PM', icon: CalendarClock}, {id: 'Inventory', icon: Package}, {id: 'JobPlans', icon: Book}
    ];

    const handleSelectWO = (wo: WorkOrder) => {
        setSelectedWO(wo);
        setViewState('DETAIL');
    };

    const handleBack = () => {
        setViewState('DASHBOARD');
        setSelectedWO(null);
    };
    
    const handleUpdateWO = (updated: WorkOrder, updateInventory: boolean = false) => {
        maintenanceService.updateWorkOrder(updated);
        // If inventory was used, we assume WorkOrderDetailModal handled inventory validation
        // In a real app, the service would handle transaction logic.
        handleBack();
    };

    if (viewState === 'DETAIL' && selectedWO) {
        return (
            <WorkOrderDetailModal 
                workOrder={selectedWO} 
                inventory={inventory} 
                vendors={vendors} 
                onClose={handleBack} 
                onUpdate={handleUpdateWO} 
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in">
            <div className="flex items-center px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 gap-2 overflow-x-auto shrink-0">
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}>
                        <t.icon size={14}/> {t.id}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeTab === 'Requests' && <RequestHub />}
                {activeTab === 'WorkOrders' && <WorkOrderTracker onSelect={handleSelectWO} />}
                {activeTab === 'PM' && <PMScheduleEngine />}
                {activeTab === 'Inventory' && <InventoryConsole />}
                {activeTab === 'JobPlans' && <JobPlanLibrary />}
            </div>
        </div>
    );
};
export default MaintenanceManager;
