
import { AuditLogEntry } from './shared_records';
import { RuleEvaluationResult, GPCStatus, QuarterlyReviewStatus } from './common';

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

// Added missing FMRVolume type
export interface FMRVolume {
    id: string;
    volume: string;
    title: string;
    category: string;
    sizeMB: number;
    pages: number;
}

/**
 * Acquisition Lifecycle Types
 */
export type PRStatus = 'Draft' | 'Pending Certification' | 'Funds Certified' | 'Solicitation' | 'Awarded';
export interface PurchaseRequest {
    id: string;
    description: string;
    amount: number;
    requester: string;
    date: string;
    status: PRStatus;
    justification?: string;
    appropriation?: string;
    objectClass?: string;
    wbsCode?: string;
    auditLog: AuditLogEntry[];
}

export type ContractStatus = 'Active' | 'Under Mod' | 'Closed' | 'Completed' | 'Terminated' | 'Canceled';
export interface Contract {
    id: string;
    vendor: string;
    type: string;
    value: number;
    awardedDate: string;
    status: ContractStatus;
    prReference: string;
    uei: string;
    cageCode: string;
    periodOfPerformance: { start: string; end: string };
    gInvoicingStatus: 'Accepted' | 'Pending' | 'Not Applicable';
    isBerryCompliant: boolean;
    modifications: ContractMod[];
    auditLog: AuditLogEntry[];
}

export interface ContractMod {
    id: string;
    modNumber: string;
    date: string;
    amountDelta: number;
    description: string;
    authority: string;
    status: 'Executed' | 'Pending';
}

/**
 * Travel Types
 */
export interface TravelOrder {
    id: string;
    traveler: string;
    destination: string;
    purpose: string;
    startDate: string;
    endDate: string;
    estCost: number;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    fiscalYear: number;
}

export interface TravelVoucher {
    id: string;
    orderId: string;
    traveler: string;
    status: 'Draft' | 'Pending Review' | 'Approved' | 'Paid';
    dateSubmitted?: string;
    totalClaimed: number;
    expenses: TravelExpense[];
}

export interface TravelExpense {
    id: string;
    date: string;
    category: 'Airfare' | 'Lodging' | 'Meals' | 'Misc';
    amount: number;
    description: string;
}

/**
 * Revolving Fund (DWCF) Types
 */
export interface DWCFAccount {
    id: string;
    fundCode: string;
    accountName: string;
    totalCashBalance: number;
}

export interface DWCFActivity {
    id: string;
    name: string;
    collections: number;
    disbursements: number;
}

export interface DWCFOrder {
    id: string;
    dwcfActivityId: string;
    customer: string;
    description: string;
    totalAmount: number;
    status: 'Draft' | 'Issued' | 'Accepted' | 'Work In Progress' | 'Complete' | 'Canceled';
}

export type DWCFBillingStatus = 'Draft' | 'Sent' | 'Paid' | 'Canceled';
export interface DWCFBilling {
    id: string;
    orderId: string;
    billingDate: string;
    status: DWCFBillingStatus;
    total: number;
    isAdvanceBilling: boolean;
    costs: { labor: number; material: number; overhead: number; surcharge: number };
}

export interface DWCFRateProfile {
    id: string;
    activityId: string;
    fiscalYear: number;
    compositeRate: number;
    overheadRate: number;
    surchargeRate: number;
    netOperatingResult: number;
    accumulatedOperatingResult: number;
    status: 'Active' | 'Pending Approval';
}

export interface DWCFTransaction {
    id: string;
    date: string;
    type: 'Collection' | 'Disbursement' | 'Adjustment';
    amount: number;
    description: string;
}

export interface UnfundedCustomerOrder {
    id: string;
    customer: string;
    amount: number;
    status: 'Requires Notification' | 'Pending OUSD(C)' | 'Cleared';
    notificationTimestamp?: number;
}

// Added missing GPCTransaction type
export interface GPCTransaction {
    id: string;
    merchant: string;
    amount: number;
    date: string;
    cardholder: string;
    status: GPCStatus;
}

/**
 * Miscellaneous Ledger Types
 */
export interface UMDRecord {
    id: string;
    tas: string;
    amount: number;
    ageDays: number;
    sourceModule: string;
    researchStatus: string;
    assignedTo: string;
}

export interface NULORecord {
    id: string;
    documentNumber: string;
    amount: number;
    varianceReason: string;
    status: string;
}

export interface IDOCInterface {
    id: string;
    timestamp: string;
    status: 'Success' | 'Warning' | 'Error';
    direction: 'Inbound' | 'Outbound';
    partner: string;
    messageType: string;
}

export type ERPModule = 'FI' | 'CO' | 'MM' | 'SD' | 'BI' | 'PS' | 'ALL';

/**
 * Funds Control and ADA Types
 */
export type FundControlLevel = 'Apportionment' | 'Allotment' | 'Allocation' | 'Suballocation' | 'Suballotment';
export interface FundControlNode {
    id: string;
    parentId: string | null;
    name: string;
    level: FundControlLevel;
    totalAuthority: number;
    amountDistributed: number;
    amountCommitted: number;
    amountObligated: number;
    amountExpended: number;
    isCMA: boolean;
    children: FundControlNode[];
    history: AEAHistoryEvent[];
}

export interface AEAHistoryEvent {
    timestamp: string;
    user: string;
    action: 'Created' | 'Increased' | 'Decreased' | 'Updated';
    amount: number;
    justification: string;
}

export interface Appropriation {
    id: string;
    commandId: string;
    name: string;
    totalAuthority: number;
    obligated: number;
    distributions: Distribution[];
}

export interface CommandNode {
    id: string;
    name: string;
    totalAuthority: number;
    obligated: number;
    children?: CommandNode[];
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

export type TransferAuthorityType = 'General Transfer Authority (GTA)' | 'Congressionally Directed' | 'Working Capital Fund' | 'MilCon' | 'Functional (10 USC 125)' | 'Inter-Agency (31 USC 1531)';
export type TransferStage = 'Proposal' | 'SecDef Determination' | 'OMB Approval' | 'Reprogramming (DD 1415)' | 'Congressional Notification' | 'Treasury NET (SF 1151)' | 'Completed';
export interface TransferAction {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    authorityType: TransferAuthorityType;
    legalCitation: string;
    justification: string;
    isHigherPriority?: boolean;
    isUnforeseen?: boolean;
    currentStage: TransferStage;
    dates: { initiated: string; completed?: string };
    documents: { dd1415?: string; sf1151?: string };
}

// Added missing DepositFundAccount type
export interface DepositFundAccount {
    id: string;
    treasuryIndex: string;
    accountName: string;
    statutoryAuthorization: string;
    auditRequirement: string;
    quarterlyReviews: Record<string, QuarterlyReviewStatus>;
    currentBalance: number;
}

// Added missing CIHOAccount type
export interface CIHOAccount {
    id: string;
    tafs: string;
    component: string;
    balance: number;
    cashHoldingAuthorityMemo: string;
    lastReconciliationDate: string;
}

// Added missing CDOFunction type
export type CDOFunction = 'Engineering' | 'Construction' | 'Operations' | 'Admin' | string;

// Added missing CDOCostPool type
export interface CDOCostPool {
    id: string;
    functionName: CDOFunction;
    orgCode: string;
    fyBudget: number;
    obligated: number;
    currentRate: number;
    status: 'Active' | 'Inactive';
}

/**
 * CDO Transaction Logic Entity
 */
export interface CDOTransaction {
    id: string;
    date: string;
    type: 'Labor' | 'Non-Labor' | 'Accrual';
    amount: number;
    description: string;
    function: CDOFunction;
    employeeId?: string;
    hours?: number;
    isIncidental?: boolean;
}

/**
 * Reimbursable and Project Order Types
 */
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
    pricingMethod: 'Fixed Price' | 'Cost Reimbursement';
    issueDate: string;
    completionDate: string;
    acceptanceDate?: string;
    commencementDate?: string;
    isSeverable: boolean;
    percentInHouse: number;
    isSpecificDefiniteCertain: boolean;
    bonaFideNeedYear: number;
    isDoDOwned: boolean;
    isSameCommander: boolean;
    status: ProjectOrderStatus;
    linkedP2Number?: string;
    documents: { fs7600a?: string; fs7600b?: string };
}

export interface ReimbursableOrder {
    id: string;
    agreementId: string;
    orderNumber: string;
    authority: string;
    amount: number;
    billingFrequency: string;
}

export interface ReimbursableAgreement {
    id: string;
    buyer: string;
    sender: string;
    seller: string;
    gtcNumber: string;
    status: 'Active' | 'Proposed' | 'Closed';
    estimatedTotalValue: number;
}

export type ReimbursableCustomerType = 'Intra-DoD' | 'Inter-Agency' | 'Private Party' | 'FMS';

/**
 * Expenditure Management
 */
export type ExpenseUserRole = 'Clerk' | 'Approver' | 'Disbursing Officer' | 'REMIS_SYSTEM';
export interface Expense {
    id: string;
    obligationId: string;
    amount: number;
    date: string;
    description: string;
    source: string;
    status: 'Pending Approval' | 'Accrued' | 'Paid';
    createdBy: ExpenseUserRole;
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

export interface CostTransfer {
    id: string;
    sourceProjectId: string;
    sourceWorkItem: string;
    targetProjectId: string;
    targetWorkItem: string;
    amount: number;
    justification: string;
    requestDate: string;
    postedDate?: string;
    status: 'Pending Approval' | 'Approved' | 'Posted' | 'Rejected';
    requestedBy: string;
    glTransactionId?: string;
    auditLog: AuditLogEntry[];
}

/**
 * Fiar and Audit Types
 */
export interface FiarInsight {
    title: string;
    severity: string;
    message: string;
    recommendation: string;
    impactArea: string;
}

/**
 * Digital Thread Traceability
 */
export interface DigitalThread {
    id: string;
    appropriation: string;
    unit: string;
    programElement: string;
    costCenter: string;
    fadNumber: string;
    vendorName: string;
    vendorUEI: string;
    contractVehicle: string;
    miprReference: string;
    socioEconomicStatus: string;
    obligationAmt: number;
    disbursementAmt: number;
    unliquidatedAmt: number;
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
    capId?: string;
    auditFindingId?: string;
    gl1010: string;
    gaapStandard: string;
    controlObjective: string;
    blockchainHash: string;
    contingencyOpId?: string;
    invoiceDaysPending?: number;
    dssnNumber?: string;
    betcCode?: string;
}

/**
 * Resource Estimating and POM formulation
 */
export type REStatus = 'Draft' | 'Under Review' | 'G-8 Certified' | 'Presidential Budget';
export type BusinessLine = 'Navigation' | 'Flood Risk' | 'Environment' | 'Regulatory' | 'Recreation' | 'Emergency Management';
export type CapabilityLevel = 'Capability 1' | 'Capability 2' | 'Capability 3';
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
