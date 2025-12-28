import { Expense, Disbursement } from '../types';
import { MOCK_EXPENSES, MOCK_DISBURSEMENTS } from '../constants';

class ExpenseDisburseDataService {
    private expenses: Expense[];
    private disbursements: Disbursement[];
    private listeners: Function[] = [];

    constructor() {
        this.expenses = JSON.parse(JSON.stringify(MOCK_EXPENSES));
        this.disbursements = JSON.parse(JSON.stringify(MOCK_DISBURSEMENTS));
    }

    getExpenses() { return this.expenses; }
    getDisbursements() { return this.disbursements; }

    addExpense(expense: Expense) {
        this.expenses.unshift(expense);
        this.notifyListeners();
    }

    updateExpense(updated: Expense) {
        this.expenses = this.expenses.map(e => e.id === updated.id ? updated : e);
        this.notifyListeners();
    }

    addDisbursement(disbursement: Disbursement) {
        this.disbursements.unshift(disbursement);
        this.notifyListeners();
    }
    
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

export const expenseDisburseService = new ExpenseDisburseDataService();
