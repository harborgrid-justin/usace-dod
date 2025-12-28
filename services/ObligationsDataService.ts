import { Obligation } from '../types';
import { MOCK_OBLIGATIONS } from '../constants';

class ObligationsDataService {
    private obligations: Obligation[];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.obligations = JSON.parse(JSON.stringify(MOCK_OBLIGATIONS));
    }

    getObligations(): Obligation[] { return this.obligations; }

    addObligation(obligation: Obligation) {
        this.obligations = [obligation, ...this.obligations];
        this.notifyListeners();
    }

    updateObligation(updatedObligation: Obligation) {
        this.obligations = this.obligations.map(o => o.id === updatedObligation.id ? updatedObligation : o);
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

export const obligationsService = new ObligationsDataService();