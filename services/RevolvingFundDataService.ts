import { 
    DWCFAccount, DWCFActivity, DWCFOrder, DWCFBilling, 
    DWCFRateProfile, DWCFTransaction, UnfundedCustomerOrder, DWCFBillingStatus
} from '../types';
import { 
    MOCK_DWCF_ACCOUNTS, MOCK_DWCF_ACTIVITIES, MOCK_DWCF_ORDERS, 
    MOCK_DWCF_BILLINGS, MOCK_UNFUNDED_ORDERS 
} from '../constants';

const INITIAL_RATES: DWCFRateProfile[] = [
    { id: 'RATE-24-SUP', activityId: 'ACT-SUP', fiscalYear: 2024, compositeRate: 115.00, overheadRate: 18.5, surchargeRate: 12.0, accumulatedOperatingResult: -500000, netOperatingResult: 125000, status: 'Active' },
    { id: 'RATE-24-IND', activityId: 'ACT-IND', fiscalYear: 2024, compositeRate: 210.00, overheadRate: 22.0, surchargeRate: 15.0, accumulatedOperatingResult: 200000, netOperatingResult: -50000, status: 'Active' },
];

class RevolvingFundDataService {
    private accounts: DWCFAccount[];
    private activities: DWCFActivity[];
    private orders: DWCFOrder[];
    private billings: DWCFBilling[];
    private rates: DWCFRateProfile[];
    private transactions: DWCFTransaction[] = [];
    private unfundedOrders: UnfundedCustomerOrder[];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.accounts = JSON.parse(JSON.stringify(MOCK_DWCF_ACCOUNTS));
        this.activities = JSON.parse(JSON.stringify(MOCK_DWCF_ACTIVITIES));
        this.orders = JSON.parse(JSON.stringify(MOCK_DWCF_ORDERS));
        this.billings = JSON.parse(JSON.stringify(MOCK_DWCF_BILLINGS));
        this.rates = JSON.parse(JSON.stringify(INITIAL_RATES));
        this.unfundedOrders = JSON.parse(JSON.stringify(MOCK_UNFUNDED_ORDERS));
    }

    getAccounts() { return this.accounts; }
    getActivities() { return this.activities; }
    getOrders() { return this.orders; }
    getBillings() { return this.billings; }
    getRates() { return this.rates; }
    getTransactions() { return this.transactions; }
    getUnfundedOrders() { return this.unfundedOrders; }

    addOrder(order: DWCFOrder) {
        this.orders = [order, ...this.orders];
        this.notifyListeners();
    }

    addBilling(billing: DWCFBilling) {
        this.billings = [billing, ...this.billings];
        this.notifyListeners();
    }

    updateBillingStatus(id: string, status: DWCFBillingStatus) {
        this.billings = this.billings.map(b => b.id === id ? { ...b, status } : b);
        this.notifyListeners();
    }

    updateRate(updatedRate: DWCFRateProfile) {
        this.rates = this.rates.map(r => r.id === updatedRate.id ? updatedRate : r);
        this.notifyListeners();
    }

    updateUnfundedOrder(id: string, updates: Partial<UnfundedCustomerOrder>) {
        this.unfundedOrders = this.unfundedOrders.map(o => o.id === id ? { ...o, ...updates } : o);
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

export const revolvingFundService = new RevolvingFundDataService();