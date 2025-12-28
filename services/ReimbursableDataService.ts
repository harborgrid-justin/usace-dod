import { ReimbursableAgreement, ReimbursableOrder, ProjectOrder } from '../types';
import { MOCK_REIMBURSABLE_AGREEMENTS, MOCK_REIMBURSABLE_ORDERS, MOCK_PROJECT_ORDERS } from '../constants';

class ReimbursableDataService {
    private agreements: ReimbursableAgreement[];
    private orders: ReimbursableOrder[];
    private projectOrders: ProjectOrder[];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.agreements = JSON.parse(JSON.stringify(MOCK_REIMBURSABLE_AGREEMENTS));
        this.orders = JSON.parse(JSON.stringify(MOCK_REIMBURSABLE_ORDERS));
        this.projectOrders = JSON.parse(JSON.stringify(MOCK_PROJECT_ORDERS));
    }

    getAgreements() { return this.agreements; }
    getOrders() { return this.orders; }
    getProjectOrders() { return this.projectOrders; }
    
    addAgreement(agreement: ReimbursableAgreement) {
        this.agreements = [agreement, ...this.agreements];
        this.notifyListeners();
    }

    addOrder(order: ReimbursableOrder) {
        this.orders = [order, ...this.orders];
        this.notifyListeners();
    }

    addProjectOrder(po: ProjectOrder) {
        this.projectOrders = [po, ...this.projectOrders];
        this.notifyListeners();
    }

    updateProjectOrder(updated: ProjectOrder) {
        this.projectOrders = this.projectOrders.map(po => po.id === updated.id ? updated : po);
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

export const reimbursableService = new ReimbursableDataService();