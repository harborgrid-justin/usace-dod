import { FADocument, WorkAllowance } from '../types';
import { MOCK_FADS, MOCK_WORK_ALLOWANCES } from '../constants';

class CivilWorksDataService {
    private fads: FADocument[] = JSON.parse(JSON.stringify(MOCK_FADS));
    private allowances: WorkAllowance[] = JSON.parse(JSON.stringify(MOCK_WORK_ALLOWANCES));
    private listeners = new Set<Function>();

    getFADs = () => this.fads;
    getAllowances = () => this.allowances;

    addFAD = (fad: FADocument) => {
        this.fads = [fad, ...this.fads];
        this.notify();
    }

    addAllowance = (allowance: WorkAllowance) => {
        this.allowances = [allowance, ...this.allowances];
        this.notify();
    }

    updateAllowance = (updated: WorkAllowance) => {
        this.allowances = this.allowances.map(a => a.id === updated.id ? updated : a);
        this.notify();
    }

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const cwaService = new CivilWorksDataService();