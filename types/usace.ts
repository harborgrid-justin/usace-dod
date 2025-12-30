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

// Added missing CapabilityLevel enum
export type CapabilityLevel = 'Capability 1' | 'Capability 2' | 'Capability 3';
// Added missing REStatus enum
export type REStatus = 'Draft' | 'Approved' | 'Presidential Budget';
// Added missing BusinessLine enum
export type BusinessLine = 'Navigation' | 'Flood Risk Management' | 'Environment' | 'Hydropower' | 'Recreation' | 'Water Supply';

// Added missing BudgetLineItem interface
export interface BudgetLineItem {
    id: string;
    projectId: string;
    projectName: string;
    businessLine: BusinessLine;
    fiscalYear: number;
    capabilityLevel: CapabilityLevel;
    objectClass: string;
    amount: number;
    justification: string;
    status: REStatus;
    isInflationAdjusted: boolean;
    lastModified: string;
}

// Added missing POMEntry interface
export interface POMEntry {
    projectId: string;
    projectName: string;
    businessLine: BusinessLine;
    fy1: number;
    fy2: number;
    fy3: number;
    fy4: number;
    fy5: number;
}

// Fix: Corrected OHDAReimbursementStatus typo from OHDARreimbursementStatus
export type OHDAReimbursementStatus = 'Pending Validation' | 'Validated' | 'Reimbursed';

// Added missing ContingencyOperation interface
export interface ContingencyOperation {
    id: string;
    name: string;
    status: string;
    type: string;
    location: string;
    fundingSource: 'OHDACA' | 'OCOTF' | 'Base';
    isBaseFunded: boolean;
    executeOrderRef: string;
    sfisCode: string;
    incrementalCosts: {
        personnel: number;
        operatingSupport: number;
        investment: number;
        retrograde: number;
        reset: number;
    };
    billableIncrementalCosts: number;
    baselineCosts: number;
    costOffsets: { name: string; amount: number }[];
    incrementalCostsBreakdown: { id: string; name: string; description: string; isApplicable: boolean; cost: number }[];
    estimates?: {
        preDeployment: { cost: number };
        budget: { cost: number };
        working: { cost: number };
    };
    linkedThreadIds: string[];
    ohdacaDetails?: {
        fadNumber: string;
        dscaFunding: number;
        reimbursementRequests: { id: string; amount: number; status: OHDAReimbursementStatus }[];
    };
    endDate?: string;
    justificationMaterials: Record<string, string>;
}

// Added missing JustificationDocStatus
export type JustificationDocStatus = 'Draft' | 'Final' | 'Pending';

// Added missing FiarInsight
export interface FiarInsight {
    title: string;
    severity: 'High' | 'Medium' | 'Low';
    message: string;
    recommendation: string;
    impactArea: string;
}