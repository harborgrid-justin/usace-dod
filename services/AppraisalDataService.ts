import { AppraisalRecord, AppraisalStatus, UserRole } from '../types';
import { remisService } from './RemisDataService';

class AppraisalDataService {
    private records: AppraisalRecord[] = [];
    private listeners: Set<Function> = new Set();

    getAppraisals() {
        remisService.logRetrieval('ALL_APPRAISALS', 'Appraisal', 'Bulk View');
        return this.records;
    }

    addAppraisal(record: AppraisalRecord) {
        const id = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        this.records = [{ ...record, id }, ...this.records];
        this.notifyListeners();
    }

    updateAppraisal(updated: AppraisalRecord, user: string, role: UserRole) {
        this.records = this.records.map(r => r.id === updated.id ? updated : r);
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

export const appraisalService = new AppraisalDataService();