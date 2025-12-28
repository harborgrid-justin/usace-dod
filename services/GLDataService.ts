import { GLTransaction } from '../types';
import { MOCK_GL_TRANSACTIONS } from '../constants';

class GLDataService {
    private transactions: GLTransaction[];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.transactions = JSON.parse(JSON.stringify(MOCK_GL_TRANSACTIONS));
    }

    getTransactions(): GLTransaction[] {
        return this.transactions;
    }

    addTransaction(transaction: GLTransaction) {
        // Essential: Immutable update for Concurrent React
        this.transactions = [transaction, ...this.transactions];
        this.notifyListeners();
    }

    updateTransaction(updated: GLTransaction) {
        this.transactions = this.transactions.map(t => t.id === updated.id ? updated : t);
        this.notifyListeners();
    }

    // --- Pub/Sub ---
    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const glService = new GLDataService();