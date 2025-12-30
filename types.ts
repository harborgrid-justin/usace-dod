
import { AuditLogEntry } from './types/shared_records';

export * from './types/common';
export * from './types/shared_records';
export * from './types/usace';
export * from './types/remis';
export * from './types/financial';

export type AgencyContext = 'ARMY_GFEBS' | 'USACE_CEFMS' | 'USACE_REMIS' | 'OSD_BRAC' | 'OSD_HAP' | 'OSD_LGH';
export type UserRole = 'REMIS_APPRAISER' | 'REMIS_REVIEWER' | 'REMIS_APPROVER' | 'REMIS_VIEWER' | string;

/**
 * Consolidated Investigation & ADA Types
 */
export interface ADAViolation {
    id: string;
    status: 'Suspected' | 'Preliminary Review' | 'Formal Investigation' | 'Reported' | 'Closed - No Violation';
    type: ADAViolationType;
    discoveryDate: string;
    amount: number;
    organization: string;
    description: string;
}

export type ADAViolationType = 
    | '31 USC 1341(a)(1)(A) - Amount Limitation' 
    | '31 USC 1341(a)(1)(B) - Advance of Appropriation' 
    | '31 USC 1342 - Voluntary Services' 
    | '31 USC 1517(a) - Admin Control Limitation' 
    | '31 USC 1301 - Purpose Statute' 
    | '31 USC 1502 - Time Limitation';

export interface ADAInvestigation {
    id: string;
    violationId: string;
    stage: 'IO Appointment' | 'Evidence Collection' | 'Analysis' | 'ROI Generation' | 'Legal Review' | 'Final Submission';
    investigatingOfficer?: InvestigatingOfficer;
    startDate: string;
    suspenseDate: string;
    evidence: EvidenceItem[];
    findings: string[];
    responsibleParties: ResponsibleParty[];
    correctiveActions: string[];
    legalReviewStatus: 'Pending' | 'Complete' | 'Deficient';
    advanceDecisionStatus: 'Pending' | 'Received';
}

export interface InvestigatingOfficer {
    id: string;
    name: string;
    rank: string;
    organization: string;
    fiscalLawTrainingDate: string;
    dateAppointed?: string;
}

export interface EvidenceItem {
    id: string;
    description: string;
    source: string;
    dateCollected: string;
    supportsConclusion: boolean;
}

export interface ResponsibleParty {
    id: string;
    name: string;
    position: string;
    involvementDescription: string;
    proximateCauseAnalysis: string;
    rebuttalReceived: boolean;
    isConfirmed: boolean;
}

/**
 * Workforce Resource Management
 */
export interface WorkforceScenario {
    id: string;
    name: string;
    fiscalYear: number;
    isBaseline: boolean;
    status: 'Draft' | 'Final';
    workloadItemIds: string[];
    workforcePlanIds: string[];
    auditLog: any[];
}

export interface WorkloadItem {
    id: string;
    name: string;
    projectId?: string;
    workloadType: string;
    quantity: number;
    unit: string;
}

export interface WorkforcePlan {
    id: string;
    organization: string;
    functionalArea: string;
    entries: WorkforceEntry[];
}

export interface WorkforceEntry {
    laborCategory: LaborCategory;
    fundedFTE: number;
    unfundedFTE: number;
}

export type LaborCategory = 'Engineer' | 'Scientist' | 'Technician' | 'Admin' | 'Project Manager';

export interface LaborRate {
    laborCategory: LaborCategory;
    rate: number;
}

export interface LaborStandard {
    workloadUnit: string;
    laborCategory: LaborCategory;
    hoursPerUnit: number;
}

// Added missing Expense & Disbursement types
export type ExpenseUserRole = 'Clerk' | 'Approver' | 'Disbursing Officer';

export interface Expense {
    id: string;
    obligationId: string;
    amount: number;
    date: string;
    description: string;
    source: string;
    status: 'Pending Approval' | 'Accrued' | 'Paid' | 'Rejected';
    createdBy: string;
    approvedBy?: string;
    disbursedBy?: string;
    disbursementId?: string;
    auditLog: AuditLogEntry[];
}

export interface Disbursement {
    id: string;
    expenseId: string;
    amount: number;
    date: string;
    paymentMethod: string;
    treasuryConfirmationId: string;
}
