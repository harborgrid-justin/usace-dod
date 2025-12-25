
import { TravelOrder, TravelVoucher } from '../types';

// Initial seed data to populate the "production" environment on load
const SEED_ORDERS: TravelOrder[] = [
    { id: 'TO-24-001', traveler: 'John Doe', destination: 'Washington, DC', purpose: 'Budget Conference', startDate: '2024-04-10', endDate: '2024-04-14', estCost: 1500, status: 'Approved', fiscalYear: 2024 },
    { id: 'TO-24-002', traveler: 'Jane Smith', destination: 'Vicksburg, MS', purpose: 'ERDC Site Visit', startDate: '2024-05-01', endDate: '2024-05-05', estCost: 1200, status: 'Draft', fiscalYear: 2024 },
];

const SEED_VOUCHERS: TravelVoucher[] = [
    { 
        id: 'TV-24-001', 
        orderId: 'TO-24-001', 
        traveler: 'John Doe', 
        status: 'Pending Review', 
        dateSubmitted: '2024-04-15',
        totalClaimed: 1450.50,
        expenses: [
            { id: 'EX-1', date: '2024-04-10', category: 'Airfare', amount: 450.50, description: 'Flight to DCA' },
            { id: 'EX-2', date: '2024-04-10', category: 'Lodging', amount: 250.00, description: 'Hotel Night 1' },
            { id: 'EX-3', date: '2024-04-11', category: 'Lodging', amount: 250.00, description: 'Hotel Night 2' },
            { id: 'EX-4', date: '2024-04-12', category: 'Lodging', amount: 250.00, description: 'Hotel Night 3' },
            { id: 'EX-5', date: '2024-04-13', category: 'Lodging', amount: 250.00, description: 'Hotel Night 4' },
        ]
    },
];

class TravelDataService {
    private orders: TravelOrder[];
    private vouchers: TravelVoucher[];
    private listeners: Function[] = [];

    constructor() {
        this.orders = JSON.parse(JSON.stringify(SEED_ORDERS));
        this.vouchers = JSON.parse(JSON.stringify(SEED_VOUCHERS));
    }

    // --- Accessors ---
    getOrders() { return this.orders; }
    getVouchers() { return this.vouchers; }

    // --- Order Mutations ---
    addOrder(order: TravelOrder) {
        this.orders.unshift(order);
        this.notifyListeners();
    }

    updateOrder(updatedOrder: TravelOrder) {
        this.orders = this.orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        this.notifyListeners();
    }

    deleteOrder(id: string) {
        this.orders = this.orders.filter(o => o.id !== id);
        // Cascade delete vouchers linked to this order? 
        // For strict audit, we might prevent this, but for now we'll allow orphan vouchers or block.
        // We will notify only.
        this.notifyListeners();
    }

    // --- Voucher Mutations ---
    addVoucher(voucher: TravelVoucher) {
        this.vouchers.unshift(voucher);
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

    // --- Pub/Sub ---
    subscribe(listener: Function) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const travelService = new TravelDataService();
