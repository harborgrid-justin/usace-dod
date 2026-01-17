
import { DigitalThread, BusinessRule, AuditLogEntry, FMRVolume, RuleEvaluationResult } from '../types';
import { MOCK_DIGITAL_THREADS, MOCK_BUSINESS_RULES, MOCK_AUDIT_FINDINGS, DOD_FMR_VOLUMES } from '../constants';

// Define AuditFinding type locally or import if available in types (using inference from constants for now to strict type)
export interface AuditFinding {
    id: string;
    severity: 'Material Weakness' | 'Significant Deficiency' | 'Control Deficiency';
    description: string;
    linkedTransactionIds: string[];
}

class ComplianceDataService {
    private digitalThreads: DigitalThread[] = JSON.parse(JSON.stringify(MOCK_DIGITAL_THREADS));
    private businessRules: BusinessRule[] = JSON.parse(JSON.stringify(MOCK_BUSINESS_RULES));
    private auditFindings: AuditFinding[] = JSON.parse(JSON.stringify(MOCK_AUDIT_FINDINGS));
    private fmrVolumes: FMRVolume[] = JSON.parse(JSON.stringify(DOD_FMR_VOLUMES));
    private listeners = new Set<Function>();

    // --- Accessors ---
    getDigitalThreads = () => this.digitalThreads;
    getBusinessRules = () => this.businessRules;
    getAuditFindings = () => this.auditFindings;
    getFMRVolumes = () => this.fmrVolumes;

    // --- Mutators ---
    addDigitalThread = (thread: DigitalThread) => {
        this.digitalThreads = [thread, ...this.digitalThreads];
        this.notify();
    };

    updateDigitalThread = (updated: DigitalThread) => {
        this.digitalThreads = this.digitalThreads.map(t => t.id === updated.id ? updated : t);
        this.notify();
    };

    addBusinessRule = (rule: BusinessRule) => {
        this.businessRules = [rule, ...this.businessRules];
        this.notify();
    };

    updateBusinessRule = (updated: BusinessRule) => {
        this.businessRules = this.businessRules.map(r => r.id === updated.id ? updated : r);
        this.notify();
    };

    addAuditFinding = (finding: AuditFinding) => {
        this.auditFindings = [finding, ...this.auditFindings];
        this.notify();
    };

    updateAuditFinding = (updated: AuditFinding) => {
        this.auditFindings = this.auditFindings.map(f => f.id === updated.id ? updated : f);
        this.notify();
    };

    // --- Subscription ---
    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const complianceService = new ComplianceDataService();
