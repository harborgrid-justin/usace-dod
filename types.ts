
export * from './types/common';
export * from './types/shared_records';
export * from './types/usace';
export * from './types/remis';
export * from './types/financial';

export type AgencyContext = 'ARMY_GFEBS' | 'USACE_CEFMS' | 'USACE_REMIS' | 'OSD_BRAC' | 'OSD_HAP' | 'OSD_LGH' | 'USACE_HAPMIS';
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
 * Contingency Operations Types
 */
export interface ContingencyOperation {
    id: string;
    name: string;
    status: 'Planning' | 'Active' | 'Completed';
    type: string;
    location: string;
    fundingSource: 'OCOTF' | 'OHDACA' | 'Base';
    isBaseFunded: boolean;
    personnelDeployed: number;
    executeOrderRef: string;
    sfisCode: string;
    cjcsProjectCode: string;
    baselineCosts: number;
    incrementalCosts: { personnel: number; operatingSupport: number; investment: number; retrograde: number; reset: number };
    billableIncrementalCosts: number;
    costOffsets: { name: string; amount: number }[];
    incrementalCostsBreakdown: any[];
    reimbursement: { billed: number; received: number };
    justificationMaterials: Record<string, JustificationDocStatus>;
    estimates: { preDeployment: any; budget: any; working: any };
    linkedThreadIds: string[];
    ohdacaDetails?: { fadNumber: string; dscaFunding: number; reimbursementRequests: any[] };
    endDate?: string;
}

export type JustificationDocStatus = 'Draft' | 'Submitted' | 'Approved';
export type OHDAReimbursementStatus = 'Pending Validation' | 'Validated' | 'Reimbursed';

export interface ContingencyFinding {
    finding: string;
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
    fmr_reference: string;
    recommendation: string;
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
