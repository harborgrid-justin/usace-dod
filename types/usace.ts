
import { AuditLogEntry } from './shared_records';

export interface USACEProject {
    id: string;
    name: string;
    district: string;
    p2Number: string;
    programType: 'Civil Works' | 'Military Programs';
    appropriation: string;
    financials: {
        currentWorkingEstimate: number;
        obligated: number;
        programmed: number;
        disbursed: number;
        prc_committed: number;
        contractRetainage?: number;
    };
    p2Linkage: boolean;
    costShare?: CostShareData;
    cwisCode?: string;
    milestones?: ProjectMilestone[];
    risks?: ProjectRisk[];
    contractMods?: ContractModSummary[];
    realEstate?: ProjectRealEstate[];
    weatherDelayDays?: number;
}

export interface CostShareData {
    sponsorName: string;
    nonFederalShare: number;
    federalShare: number;
    totalContributed: number;
    balanceDue: number;
}

export interface ProjectMilestone {
    description: string;
    code: string;
    scheduledDate: string;
    status: string;
}

export interface ProjectRisk {
    id: string;
    category: string;
    impact: string;
    description: string;
    mitigationStrategy: string;
}

export interface ContractModSummary {
    modNumber: string;
    amount: number;
    description: string;
    reason: string;
    date: string;
}

export interface ProjectRealEstate {
    tractNumber: string;
    owner: string;
    status: string;
    cost: number;
    lerrdCredit: boolean;
}

/**
 * Civil Works Allowance Types
 */
export type FundType = 'Direct' | 'Trust' | 'Reimbursable';
export interface FADocument {
    id: string;
    appropriationSymbol: string;
    programYear: number;
    publicLaw: string;
    totalAuthority: number;
    fundType: FundType;
    auditLog: AuditLogEntry[];
}

export type WorkAllowanceStatus = 'Pending Approval' | 'Active' | 'Rejected' | 'Reduced' | 'Closed';
export interface WorkAllowance {
    id: string;
    fadId: string;
    districtEROC: string;
    p2ProgramCode: string;
    ppa: string;
    congressionalLineItem: string;
    ccsCode: string;
    amount: number;
    obligatedAmount: number;
    status: WorkAllowanceStatus;
    auditLog: AuditLogEntry[];
}

/**
 * O&M Appropriation Structure
 */
export interface SubActivityGroup {
    id: string;
    name: string;
    budget: number;
    priceChange?: number;
    programChange?: number;
    isModified?: boolean;
    justificationNotes?: string;
}

export interface ActivityGroup {
    id: string;
    name: string;
    subActivityGroups: SubActivityGroup[];
}

export interface BudgetActivity {
    id: string;
    name: string;
    activityGroups: ActivityGroup[];
}

export interface OandMAppropriation {
    id: string;
    name: string;
    appropriationCode: string;
    budgetActivities: BudgetActivity[];
}
