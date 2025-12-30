import { Obligation } from '../types';
import { MOCK_OBLIGATIONS } from '../constants';

class ObligationsDataService {
    private obligations: Obligation[] = JSON.parse(JSON.stringify(MOCK_OBLIGATIONS));
    private listeners = new Set<Function>();

    getObligations = () => this.obligations;

    addObligation = (obligation: Obligation) => {
        this.obligations = [obligation, ...this.obligations];
        this.notify();
    }

    updateObligation = (updatedObligation: Obligation) => {
        this.obligations = this.obligations.map(o => o.id === updatedObligation.id ? updatedObligation : o);
        this.notify();
    }

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const obligationsService = new ObligationsDataService();