import { TravelOrder, TravelVoucher } from '../types';

const SEED_ORDERS: TravelOrder[] = [
    { id: 'TO-24-001', traveler: 'John Doe', destination: 'Washington, DC', purpose: 'Budget Conference', startDate: '2024-04-10', endDate: '2024-04-14', estCost: 1500, status: 'Approved', fiscalYear: 2024 },
    { id: 'TO-24-002', traveler: 'Jane Smith', destination: 'Vicksburg, MS', purpose: 'ERDC Site Visit', startDate: '2024-05-01', endDate: '2024-05-05', estCost: 1200, status: 'Draft', fiscalYear: 2024 },
];

const SEED_VOUCHERS: TravelVoucher[] = [
    { 
        id: 'TV-24-001', orderId: 'TO-24-001', traveler: 'John Doe', status: 'Pending Review', dateSubmitted: '2024-04-15', totalClaimed: 1450.50,
        expenses: [{ id: 'EX-1', date: '2024-04-10', category: 'Airfare', amount: 450.50, description: 'Flight' }]
    },
];

class TravelDataService {
    private orders: TravelOrder[];
    private vouchers: TravelVoucher[];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.orders = JSON.parse(JSON.stringify(SEED_ORDERS));
        this.vouchers = JSON.parse(JSON.stringify(SEED_VOUCHERS));
    }

    getOrders() { return this.orders; }
    getVouchers() { return this.vouchers; }

    addOrder(order: TravelOrder) {
        this.orders = [order, ...this.orders];
        this.notifyListeners();
    }

    updateOrder(updatedOrder: TravelOrder) {
        this.orders = this.orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        this.notifyListeners();
    }

    deleteOrder(id: string) {
        this.orders = this.orders.filter(o => o.id !== id);
        this.notifyListeners();
    }

    addVoucher(voucher: TravelVoucher) {
        this.vouchers = [voucher, ...this.vouchers];
        this.notifyListeners();
    }

    updateVoucher(updatedVoucher: TravelVoucher) {
        this.vouchers = this.vouchers.map(v => v.id === updatedVoucher.id ? updatedVoucher : v);
        this.notifyListeners();
    }

    deleteVoucher(id: string) {
        this.vouchers = this.vouchers.filter(v => v.id !== id);
        this.notifyListeners();
    }

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const travelService = new TravelDataService();