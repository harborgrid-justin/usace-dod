
import { WorkOrder, InventoryItem, Vendor } from '../types';
import { MOCK_INVENTORY, MOCK_VENDORS } from '../constants';

// Seed initial work orders
const SEED_WORK_ORDERS: WorkOrder[] = [
    {id: 'WO-24-1001', description: 'Repair AHU-1 Belt', status: 'In Progress', laborEntries: [], materialEntries: [], serviceEntries: [], totalCost: 450},
    {id: 'WO-24-1002', description: 'Replace Lobby Lighting', status: 'Pending', laborEntries: [], materialEntries: [], serviceEntries: [], totalCost: 120}
];

class MaintenanceDataService {
    private workOrders: WorkOrder[] = JSON.parse(JSON.stringify(SEED_WORK_ORDERS));
    private inventory: InventoryItem[] = JSON.parse(JSON.stringify(MOCK_INVENTORY));
    private vendors: Vendor[] = JSON.parse(JSON.stringify(MOCK_VENDORS));
    private listeners = new Set<Function>();

    getWorkOrders = () => this.workOrders;
    getInventory = () => this.inventory;
    getVendors = () => this.vendors;

    addWorkOrder = (wo: WorkOrder) => {
        this.workOrders = [wo, ...this.workOrders];
        this.notify();
    };

    updateWorkOrder = (updated: WorkOrder) => {
        this.workOrders = this.workOrders.map(w => w.id === updated.id ? updated : w);
        this.notify();
    };

    updateInventory = (updatedItem: InventoryItem) => {
        this.inventory = this.inventory.map(i => i.id === updatedItem.id ? updatedItem : i);
        this.notify();
    };

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const maintenanceService = new MaintenanceDataService();
