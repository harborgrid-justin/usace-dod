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
    private accounts: DWCFAccount[] = JSON.parse(JSON.stringify(MOCK_DWCF_ACCOUNTS));
    private activities: DWCFActivity[] = JSON.parse(JSON.stringify(MOCK_DWCF_ACTIVITIES));
    private orders: DWCFOrder[] = JSON.parse(JSON.stringify(MOCK_DWCF_ORDERS));
    private billings: DWCFBilling[] = JSON.parse(JSON.stringify(MOCK_DWCF_BILLINGS));
    private rates: DWCFRateProfile[] = JSON.parse(JSON.stringify(INITIAL_RATES));
    private transactions: DWCFTransaction[] = [];
    private unfundedOrders: UnfundedCustomerOrder[] = JSON.parse(JSON.stringify(MOCK_UNFUNDED_ORDERS));
    private listeners = new Set<Function>();

    getAccounts = () => this.accounts;
    getActivities = () => this.activities;
    getOrders = () => this.orders;
    getBillings = () => this.billings;
    getRates = () => this.rates;
    getTransactions = () => this.transactions;
    getUnfundedOrders = () => this.unfundedOrders;

    addOrder = (order: DWCFOrder) => { this.orders = [order, ...this.orders]; this.notify(); };
    addBilling = (billing: DWCFBilling) => { this.billings = [billing, ...this.billings]; this.notify(); };

    updateBillingStatus = (id: string, status: DWCFBillingStatus) => {
        this.billings = this.billings.map(b => b.id === id ? { ...b, status } : b);
        this.notify();
    };

    updateRate = (updatedRate: DWCFRateProfile) => {
        this.rates = this.rates.map(r => r.id === updatedRate.id ? updatedRate : r);
        this.notify();
    };

    updateUnfundedOrder = (id: string, updates: Partial<UnfundedCustomerOrder>) => {
        this.unfundedOrders = this.unfundedOrders.map(o => o.id === id ? { ...o, ...updates } : o);
        this.notify();
    };

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const revolvingFundService = new RevolvingFundDataService();