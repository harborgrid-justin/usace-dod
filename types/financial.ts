import { AuditLogEntry } from './shared_records';
import { GPCStatus, QuarterlyReviewStatus, ADAViolationStatus, Brand } from './common';

export * from './acquisition_types';
export * from './travel_types';
export * from './dwcf_types';
export * from './funds_types';

export interface Obligation {
    id: string;
    vendor: string;
    documentNumber: string;
    description: string;
    fiscalYear: number;
    appropriation: string;
    programElement: string;
    objectClass: string;
    amount: number;
    disbursedAmount: number;
    unliquidatedAmount: number;
    status: 'Open' | 'Closed' | 'Dormant';
    date: string;
    lastActivityDate: string;
    obligationType: 'Contract' | 'Travel' | 'MIPR' | 'Misc' | 'Training' | 'Utilities' | 'GPC';
    auditLog: AuditLogEntry[];
}

export interface GLTransaction {
    id: string;
    date: string;
    description: string;
    type: string;
    sourceModule: string;
    referenceDoc: string;
    totalAmount: number;
    status: 'Draft' | 'Pending Approval' | 'Posted' | 'Rejected';
    createdBy: string;
    approvedBy?: string;
    lines: JournalEntryLine[];
    auditLog: AuditLogEntry[];
}

export interface JournalEntryLine {
    ussglAccount: string;
    description: string;
    debit: number;
    credit: number;
    fund: string;
    costCenter: string;
}

export interface USSGLAccount {
    accountNumber: string;
    description: string;
    category: string;
    normalBalance: 'Debit' | 'Credit';
    financialStatement: string;
    isActive: boolean;
}

export interface FMRVolume {
    id: string;
    volume: string;
    title: string;
    category: string;
    sizeMB: number;
    pages: number;
}

export interface AEAHistoryEvent {
    timestamp: string;
    user: string;
    action: 'Created' | 'Increased' | 'Decreased' | 'Updated';
    amount: number;
    justification: string;
}

export interface Distribution {
    id: string;
    toUnit: string;
    amount: number;
    purpose: string;
    fadNumber: string;
    date: string;
    status: 'Approved' | 'Pending' | 'Executed' | 'Rejected';
    linkedThreadId?: string;
}

// Added missing DigitalThread interface for audit traceability
export interface DigitalThread {
    id: string;
    vendorName: string;
    appropriation: string;
    obligationAmt: number;
    disbursementAmt: number;
    unliquidatedAmt: number;
    unit: string;
    blockchainHash: string;
    gaapStandard: string;
    controlObjective: string;
    tasSymbol: string;
    eftStatus: string;
    supplyClass: string;
    niinNsn: string;
    serialNumber: string;
    uicCode: string;
    readinessImpact: string;
    bonaFideValid: boolean;
    berryCompliant: boolean;
    ppaInterestRisk: boolean;
    gl1010: string;
    programElement: string;
    costCenter: string;
    fadNumber: string;
    vendorUEI: string;
    contractVehicle: string;
    miprReference: string;
    socioEconomicStatus: string;
    invoiceDaysPending?: number;
    dssnNumber?: string;
    betcCode?: string;
    auditFindingId?: string;
    capId?: string;
    contingencyOpId?: string;
}

// Added missing UMDRecord
export interface UMDRecord {
    id: string;
    tas: string;
    amount: number;
    ageDays: number;
    sourceModule: string;
    researchStatus: string;
    assignedTo: string;
}

// Added missing NULORecord
export interface NULORecord {
    id: string;
    documentNumber: string;
    amount: number;
    varianceReason: string;
    status: string;
}

// Added missing IDOCInterface for ERP sync
export interface IDOCInterface {
    id: string;
    status: 'Success' | 'Warning' | 'Error';
    direction: 'Inbound' | 'Outbound';
    partner: string;
    messageType: string;
    timestamp: string;
}

// Added missing GPCTransaction
export interface GPCTransaction {
    id: string;
    merchant: string;
    date: string;
    cardholder: string;
    amount: number;
    status: GPCStatus;
}

// Added missing Reimbursable types
export type ReimbursableCustomerType = 'Intra-DoD' | 'Inter-Agency' | 'Private Party' | 'FMS';

export interface ReimbursableAgreement {
    id: string;
    buyer: string;
    sender: string;
    seller: string;
    gtcNumber: string;
    status: string;
    estimatedTotalValue: number;
}

export interface ReimbursableOrder {
    id: string;
    agreementId: string;
    orderNumber: string;
    authority: string;
    amount: number;
    billingFrequency: string;
}

export type ProjectOrderStatus = 'Draft (Advance Planning)' | 'Issued' | 'Accepted' | 'Work In Progress' | 'Completed' | 'Canceled';

export interface ProjectOrder {
    id: string;
    orderNumber: string;
    description: string;
    providerId: string;
    requestingAgency: string;
    appropriation: string;
    totalAmount: number;
    obligatedAmount: number;
    pricingMethod: string;
    issueDate: string;
    completionDate: string;
    isSeverable: boolean;
    percentInHouse: number;
    isSpecificDefiniteCertain: boolean;
    bonaFideNeedYear: number;
    isDoDOwned: boolean;
    isSameCommander: boolean;
    status: ProjectOrderStatus;
    documents: { fs7600a?: string };
    linkedP2Number?: string;
    // Fix: Added missing properties for lifecycle management
    acceptanceDate?: string;
    commencementDate?: string;
}

// Added missing CommandNode type used in AppropriationsView
export interface CommandNode {
    id: string;
    name: string;
    level: string;
    totalAuthority: number;
    obligated: number;
    amountObligated: number;
    amountDistributed: number;
    parentId: string | null;
    children?: CommandNode[];
}

// Added missing DepositFundAccount interface
export interface DepositFundAccount {
    id: string;
    treasuryIndex: string;
    accountName: string;
    statutoryAuthorization: string;
    auditRequirement: string;
    currentBalance: number;
    quarterlyReviews: Record<string, QuarterlyReviewStatus>;
}

// Added missing CIHOAccount interface
export interface CIHOAccount {
    id: string;
    tafs: string;
    component: string;
    balance: number;
    cashHoldingAuthorityMemo: string;
    lastReconciliationDate: string;
}

// Added missing ERPModule type
export type ERPModule = 'FI' | 'CO' | 'MM' | 'SD' | 'BI' | 'PS';

// Fix: Added missing CostTransfer interface
export interface CostTransfer {
    id: string;
    sourceProjectId: string;
    sourceWorkItem: string;
    targetProjectId: string;
    targetWorkItem: string;
    amount: number;
    justification: string;
    status: 'Pending Approval' | 'Approved' | 'Posted' | 'Rejected';
    requestDate: string;
    postedDate?: string;
    glTransactionId?: string;
    requestedBy: string;
    auditLog: AuditLogEntry[];
}

export interface TimecardEntry {
    project: string;
    workItem: string;
    hours: number[];
    rate: number;
}

export interface Timecard {
    id: string;
    employeeName: string;
    employeeGrade: string;
    payPeriod: string;
    status: 'Draft' | 'Signed' | 'Certified' | 'Rejected';
    totalHours: number;
    totalCost: number;
    entries: TimecardEntry[];
}
