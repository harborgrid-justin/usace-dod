import { FADocument, WorkAllowance } from '../types';
import { MOCK_FADS, MOCK_WORK_ALLOWANCES } from '../constants';

class CivilWorksDataService {
    private fads: FADocument[];
    private allowances: WorkAllowance[];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.fads = JSON.parse(JSON.stringify(MOCK_FADS));
        this.allowances = JSON.parse(JSON.stringify(MOCK_WORK_ALLOWANCES));
    }

    getFADs() { return this.fads; }
    getAllowances() { return this.allowances; }

    addFAD(fad: FADocument) {
        this.fads = [fad, ...this.fads];
        this.notifyListeners();
    }

    addAllowance(allowance: WorkAllowance) {
        this.allowances = [allowance, ...this.allowances];
        this.notifyListeners();
    }

    updateAllowance(updated: WorkAllowance) {
        this.allowances = this.allowances.map(a => a.id === updated.id ? updated : a);
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

export const cwaService = new CivilWorksDataService();