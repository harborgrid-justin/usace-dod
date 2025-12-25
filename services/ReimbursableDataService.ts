
import { ReimbursableAgreement, ReimbursableOrder, ProjectOrder } from '../types';
import { MOCK_REIMBURSABLE_AGREEMENTS, MOCK_REIMBURSABLE_ORDERS, MOCK_PROJECT_ORDERS } from '../constants';

class ReimbursableDataService {
    private agreements: ReimbursableAgreement[];
    private orders: ReimbursableOrder[];
    private projectOrders: ProjectOrder[];
    private listeners: Function[] = [];

    constructor() {
        this.agreements = JSON.parse(JSON.stringify(MOCK_REIMBURSABLE_AGREEMENTS));
        this.orders = JSON.parse(JSON.stringify(MOCK_REIMBURSABLE_ORDERS));
        this.projectOrders = JSON.parse(JSON.stringify(MOCK_PROJECT_ORDERS));
    }

    // --- Accessors ---
    getAgreements() { return this.agreements; }
    getOrders() { return this.orders; }
    getProjectOrders() { return this.projectOrders; }

    // --- Mutations ---
    
    addAgreement(agreement: ReimbursableAgreement) {
        this.agreements.unshift(agreement);
        this.notifyListeners();
    }

    addOrder(order: ReimbursableOrder) {
        this.orders.unshift(order);
        this.notifyListeners();
    }

    addProjectOrder(po: ProjectOrder) {
        this.projectOrders.unshift(po);
        this.notifyListeners();
    }

    updateProjectOrder(updated: ProjectOrder) {
        this.projectOrders = this.projectOrders.map(po => po.id === updated.id ? updated : po);
        this.notifyListeners();
    }

    // --- Pub/Sub ---
    subscribe(listener: Function) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const reimbursableService = new ReimbursableDataService();
