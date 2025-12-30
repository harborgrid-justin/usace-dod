import { Expense, Disbursement } from '../types';
import { MOCK_EXPENSES, MOCK_DISBURSEMENTS } from '../constants';

class ExpenseDisburseDataService {
    private expenses: Expense[];
    private disbursements: Disbursement[];
    private listeners = new Set<Function>();

    constructor() {
        this.expenses = JSON.parse(JSON.stringify(MOCK_EXPENSES));
        this.disbursements = JSON.parse(JSON.stringify(MOCK_DISBURSEMENTS));
    }

    getExpenses() { return this.expenses; }
    getDisbursements() { return this.disbursements; }

    addExpense(expense: Expense) {
        this.expenses = [expense, ...this.expenses];
        this.notify();
    }

    updateExpense(updated: Expense) {
        this.expenses = this.expenses.map(e => e.id === updated.id ? updated : e);
        this.notify();
    }

    addDisbursement(disbursement: Disbursement) {
        this.disbursements = [disbursement, ...this.disbursements];
        this.notify();
    }
    
    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => {
        this.listeners.forEach(l => l());
    };
}

export const expenseDisburseService = new ExpenseDisburseDataService();