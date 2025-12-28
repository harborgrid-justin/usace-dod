
/**
 * XI. The Principle of Opaque Types (Branding)
 */
export type Brand<K, T> = K & { __brand: T };

export type UserId = Brand<string, 'UserId'>;
export type TransactionId = Brand<string, 'TransactionId'>;

export enum NavigationTab {
  DASHBOARD = 'Dashboard',
  DIGITAL_THREAD = 'Digital Thread',
  PPBE_CYCLE = 'PPBE Cycle',
  ADMIN_CONTROL = 'Admin Control',
  REIMBURSABLES = 'Reimbursables',
  APPROPRIATIONS = 'Appropriations',
  ERP_CORE = 'ERP Core',
  DISBURSEMENT = 'Disbursement',
  COMPLIANCE = 'Compliance',
  GOVERNANCE = 'Governance',
  GAAP_AUDIT = 'GAAP Audit',
  O_AND_M_APPROPRIATIONS = 'O&M Appropriations',
  DEPOSIT_LIABILITIES = 'Deposit Liabilities',
  REVOLVING_FUNDS = 'Revolving Funds',
  CASH_OUTSIDE_TREASURY = 'Cash Outside Treasury',
  FBWT_RECONCILIATION = 'FBWT Reconciliation',
  CONTINGENCY_OPS = 'Contingency Ops',
  RULES_ENGINE = 'Rules Engine',
  ANALYTICS = 'Analytics',
  OBLIGATIONS = 'Obligations',
  USACE_PROJECTS = 'P2 Project Lifecycle',
  SYSTEM_ADMIN = 'System Admin',
  WWP = 'WWP',
  LABOR_COSTING = 'Labor Costing',
  ACQUISITION = 'Acquisition',
  GENERAL_LEDGER = 'General Ledger',
  EXPENSE_DISBURSE = 'Expense & Disburse',
  COST_TRANSFERS = 'Cost Transfers',
  TRAVEL = 'Travel',
  CIVIL_WORKS_ALLOWANCE = 'Civil Works Allowance',
  CDO_MANAGEMENT = 'CDO Management',
  ASSET_LIFECYCLE = 'Asset Lifecycle',
  HAP_CASES = 'HAP Cases',
  LGH_PORTFOLIO = 'LGH Portfolio',
  BRAC_DSS = 'BRAC Decision Support',
  // REMIS Tabs
  REMIS_REQUIREMENTS = 'Requirements',
  REAL_PROPERTY_ASSETS = 'Real Property Assets',
  OUTGRANTS_LEASES = 'Outgrants & Leases',
  APPRAISALS = 'Appraisal Workspace',
  DISPOSALS = 'Disposals',
  REMIS_ADMIN = 'REMIS Admin',
  ENCROACHMENT = 'Encroachment',
  COST_SHARE = 'Cost Share Programs',
  SOLICITATIONS = 'Solicitations',
  RELOCATION = 'Relocation',
  REPORTS = 'Reports',
  GIS_MAP = 'GIS Map',
}

export type AgencyContext = 'ARMY_GFEBS' | 'USACE_CEFMS' | 'USACE_REMIS' | 'OSD_BRAC' | 'OSD_HAP' | 'OSD_LGH' | 'USACE_HAPMIS';

export type UserRole = 'REMIS_APPRAISER' | 'REMIS_REVIEWER' | 'REMIS_APPROVER' | 'REMIS_VIEWER' | string;

export interface AuditLogEntry {
    timestamp: string;
    user: string;
    action: string;
    organization?: string;
    transactionId?: string;
    details?: string;
    reason?: string;
}

export interface RetrievalLogEntry {
    timestamp: string;
    user: string;
    entityId: string;
    entityType: 'Asset' | 'Outgrant' | 'Solicitation' | 'Appraisal';
    accessRole: string;
    purpose: string;
}

export interface UMDRecord {
    id: string;
    tas: string;
    amount: number;
    ageDays: number;
    sourceModule: string;
    researchStatus: 'Pending' | 'Researching' | 'Resolved' | 'Escalated';
    assignedTo?: string;
}

export interface NULORecord {
    id: string;
    documentNumber: string;
    amount: number;
    varianceReason: string;
    status: 'Open' | 'Correction Pending' | 'Closed';
}

export interface DredgeMetric {
    id: string;
    projectId: string;
    volumeCY: number;
    totalCost: number;
    costPerCY: number;
    dredgeType: 'Cutterhead' | 'Hopper' | 'Clamshell';
    fiscalPeriod: string;
}

// Appraisal Specific Types
export type AppraisalStatus = 'Initiated' | 'In-Progress' | 'Under Review' | 'Approved' | 'Archived';
export type AppraisalStandard = 'USPAP' | 'Yellow Book (UASFLA)' | 'Proprietary';

export interface AppraisalReview {
    reviewerId: string;
    date: string;
    findings: string;
    isTechnicallySufficient: boolean;
}

export interface AppraisalRecord {
    id: string;
    assetId: string; 
    status: AppraisalStatus;
    standard: AppraisalStandard;
    valuationDate: string;
    appraiserName: string;
    appraiserQualifications: string;
    purpose: string; 
    scope: string;
    marketValue: number;
    limitingConditions: string[];
    extraordinaryAssumptions: string[];
    linkedActionId?: string; 
    revisions: VersionEntry<AppraisalRecord>[];
    technicalReview?: AppraisalReview;
    auditLog: AuditLogEntry[];
}

export type A123Status = 'Pending' | 'In-Review' | 'Certified' | 'Flagged';

export interface ReportMetadata {
    id: string;
    generatedBy: string;
    timestamp: string;
    reportType: string;
    parameters: string; 
    hash: string;
}

export interface VersionEntry<T> {
    timestamp: string;
    user: string;
    snapshot: Partial<T>;
    effectiveDate?: string;
    reason?: string;
}

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
    costShare?: {
        sponsorName: string;
        nonFederalShare: number;
        federalShare: number;
        totalContributed: number;
        balanceDue: number;
    };
    cwisCode?: string;
    milestones?: {
        description: string;
        code: string;
        scheduledDate: string;
        status: string;
    }[];
    risks?: {
        id: string;
        category: string;
        impact: string;
        description: string;
        mitigationStrategy: string;
    }[];
    contractMods?: {
        modNumber: string;
        amount: number;
        description: string;
        reason: string;
        date: string;
    }[];
    realEstate?: {
        tractNumber: string;
        owner: string;
        status: string;
        cost: number;
        lerrdCredit: boolean;
    }[];
    weatherDelayDays?: number;
}

export type RealPropertyStatus = 'Active' | 'Excess' | 'Disposed' | 'Retired' | 'Archived';
export type JurisdictionType = 'Exclusive' | 'Concurrent' | 'Partial' | 'Proprietary';

export interface RealPropertyAsset {
    rpuid: string;
    rpaName: string;
    installation: string;
    catcode: string;
    interestType: 'Fee' | 'Easement' | 'Lease In';
    status: RealPropertyStatus;
    acres: number;
    sqFt: number;
    hasGeo: boolean;
    acquisitionDate: string;
    operationalStatus: string;
    currentValue: number;
    deferredMaintenance: number;
    utilizationRate: number;
    missionDependency: 'Critical' | 'Dependent' | 'Not Dependent';
    jurisdiction?: JurisdictionType;
    accountableDistrict?: string;
    custody?: string;
    sourceSystem?: string;
    originatingOrg?: string;
    a123Status?: A123Status;
    auditLog: AuditLogEntry[];
    versionHistory: VersionEntry<RealPropertyAsset>[];
}

export type OutgrantStatus = 'Proposed' | 'Active' | 'Amended' | 'Suspended' | 'Expired' | 'Terminated' | 'Closed' | 'Archived';
export type OutgrantType = 'Lease' | 'Easement' | 'License' | 'Permit';

export interface Outgrant {
    id: string;
    grantee: string;
    type: OutgrantType;
    authority: string;
    permittedUse: string;
    location: string;
    annualRent: number;
    termStart?: string;
    expirationDate: string;
    status: OutgrantStatus;
    paymentFrequency: 'Monthly' | 'Quarterly' | 'Annual';
    nextPaymentDate: string;
    assetId?: string;
    sourceSystem?: string;
    a123Status?: A123Status;
    auditLog: AuditLogEntry[];
    versionHistory: VersionEntry<Outgrant>[];
}

export interface DisposalAction {
    id: string;
    assetId: string;
    type: 'Public Sale' | 'Federal Transfer' | 'PBC' | 'Exchange';
    screeningStatus: 'Submitted' | 'DoD Screening' | 'Federal Screening' | 'Homeless Screening' | 'Final';
    reportedExcessDate: string;
    estimatedProceeds: number;
    auditLog: AuditLogEntry[];
    versionHistory: VersionEntry<DisposalAction>[];
}

export type SolicitationStatus = 'Requirement Refinement' | 'Market Research' | 'Active Solicitation' | 'Evaluating Quotes' | 'Ready for Award' | 'Awarded';

export interface Solicitation {
    id: string;
    prId?: string;
    assetId?: string;
    status: SolicitationStatus;
    title: string;
    type: string;
    bidItems?: BidItem[];
    quotes: VendorQuote[];
    marketResearch?: MarketResearchReport;
    statementOfWork?: string;
    auditLog: AuditLogEntry[];
}

export type GPCStatus = 'Pending Approval' | 'Approved' | 'Flagged';

export interface GPCTransaction {
    id: string;
    merchant: string;
    amount: number;
    date: string;
    cardholder: string;
    status: GPCStatus;
}

export interface BidItem {
    id: string;
    description: string;
    unit: string;
    quantity: number;
}

export type RelocationCaseStatus = 'Initiated' | 'Eligibility Determined' | 'Assistance Approved' | 'Assistance Provided' | 'Closed';

export interface RelocationCase {
    id: string;
    assetId: string;
    displacedPersonName: string;
    displacedEntityType: string;
    eligibilityStatus: string;
    status: RelocationCaseStatus;
    initiationDate: string;
    benefits: RelocationBenefit[];
    auditLog: AuditLogEntry[];
    linkedRecords?: {
        acquisitionId?: string;
    };
}

export type BenefitStatus = 'Pending' | 'Approved' | 'Paid' | 'Denied';

export interface RelocationBenefit {
    id: string;
    type: 'Moving Expenses' | 'Replacement Housing Payment' | 'Advisory Services';
    amount: number;
    status: BenefitStatus;
    approvalDate?: string;
    approvingOfficial?: string;
    paymentId?: string;
}

export type EncroachmentType = 'Structure' | 'Vegetation' | 'Unauthorized Use' | 'Boundary Dispute';
export type EncroachmentStatus = 'Reported' | 'Investigated' | 'Action Pending' | 'Legal Action' | 'Resolved' | 'Closed' | 'Archived';
export type TaskStatus = 'Assigned' | 'In-Progress' | 'Completed' | 'Blocked' | 'Verified' | 'Closed';

export interface WorkActivity {
    id: string;
    date: string;
    description: string;
    performedBy: string;
}

export interface EncroachmentTask {
    id: string;
    description: string;
    assignedTo: string;
    status: TaskStatus;
    dueDate: string;
    activities: WorkActivity[];
}

export interface EncroachmentCase {
    id: string;
    assetId: string;
    locationDescription: string;
    type: EncroachmentType;
    discoveryDate: string;
    description: string;
    status: EncroachmentStatus;
    responsibleOfficial: string;
    tasks: EncroachmentTask[];
    auditLog: AuditLogEntry[];
}

// Financial & ERP Types
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

export interface DigitalThread {
    id: string;
    vendorName: string;
    appropriation: string;
    unit: string;
    programElement: string;
    costCenter: string;
    fadNumber: string;
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
    capId: string;
    gl1010: string;
    gaapStandard: string;
    controlObjective: string;
    blockchainHash: string;
    contingencyOpId?: string;
    unmatchedDisb: boolean;
    fiarDomain: string;
    invoiceDaysPending: number;
    auditFindingId?: string;
    dssnNumber?: string;
    betcCode?: string;
}

export interface BusinessRule {
    id: string;
    name: string;
    code: string;
    description: string;
    severity: 'Critical' | 'Warning' | 'Info';
    logicString: string;
    domain: string;
    isActive: boolean;
    conditions: RuleCondition[];
    citation: string;
    linkedFmrVolumeId?: string;
}

export interface RuleCondition {
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'NOT_CONTAINS' | 'IS_TRUE' | 'IS_FALSE';
    value: any;
}

export interface RuleEvaluationResult {
    ruleId: string;
    ruleName: string;
    passed: boolean;
    severity: string;
    message: string;
    timestamp: string;
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
    pricingMethod: 'Fixed Price' | 'Cost Reimbursement';
    issueDate: string;
    completionDate: string;
    isSeverable: boolean;
    percentInHouse: number;
    isSpecificDefiniteCertain: boolean;
    bonaFideNeedYear: number;
    isDoDOwned: boolean;
    isSameCommander: boolean;
    status: ProjectOrderStatus;
    documents: {
        fs7600a?: string;
    };
    linkedP2Number?: string;
    acceptanceDate?: string;
    commencementDate?: string;
}

export type TransferStage = 'Proposal' | 'SecDef Determination' | 'OMB Approval' | 'Reprogramming (DD 1415)' | 'Congressional Notification' | 'Treasury NET (SF 1151)' | 'Completed';
export type TransferAuthorityType = 'General Transfer Authority (GTA)' | 'Congressionally Directed' | 'Working Capital Fund' | 'MilCon' | 'Functional (10 USC 125)' | 'Inter-Agency (31 USC 1531)';

export type TransferAction = {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    authorityType: TransferAuthorityType;
    legalCitation: string;
    justification: string;
    isHigherPriority?: boolean;
    isUnforeseen?: boolean;
    isCongressionalDenial?: boolean;
    currentStage: TransferStage;
    dates: {
        initiated: string;
    };
    documents: {
        dd1415?: boolean;
        sf1151?: boolean;
    };
};

export interface FMRVolume {
    id: string;
    volume: string;
    title: string;
    category: string;
    sizeMB: number;
    pages: number;
}

export interface ReimbursableAgreement {
    id: string;
    buyer: string;
    sender: string; // Corrected sender/seller field for logic
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

export type CDOFunction = 'Engineering' | 'Operations' | string;

export interface CDOCostPool {
    id: string;
    functionName: CDOFunction;
    orgCode: string;
    fyBudget: number;
    obligated: number;
    currentRate: number;
    status: 'Active' | 'Pending Approval';
}

export interface CDOTransaction {
    id: string;
    date: string;
    type: 'Labor' | 'Non-Labor' | 'Accrual';
    amount: number;
    description: string;
    function: CDOFunction;
    employeeId?: string;
    hours?: number;
    linkedP2Number?: string;
    isIncidental?: boolean;
}

export type AssetLifecycleStatus = 'Planning' | 'Acquisition' | 'CIP' | 'In Service' | 'Modification' | 'Disposal' | 'Retired';

export interface AssetHistoryEvent {
    timestamp: string;
    user: string;
    event: string;
    details: string;
}

export interface DepreciationComponent {
    id: string;
    name: string;
    cost: number;
    placedInServiceDate: string;
    usefulLife: number;
}

export interface Asset {
    id: string;
    name: string;
    type: 'Revolving Fund' | 'PRIP';
    assetClass: string;
    status: AssetLifecycleStatus;
    acquisitionCost: number;
    residualValue: number;
    usefulLife: number;
    pripAuthorized: boolean;
    plantIncrementWaiver: { active: boolean };
    components: DepreciationComponent[];
    accumulatedDepreciation: number;
    auditLog: AssetHistoryEvent[];
    placedInServiceDate?: string;
}

export interface JournalEntryLine {
    ussglAccount: string;
    description: string;
    debit: number;
    credit: number;
    fund: string;
    costCenter: string;
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

export interface USSGLAccount {
    accountNumber: string;
    description: string;
    category: string;
    normalBalance: 'Debit' | 'Credit';
    financialStatement: string;
    isActive: boolean;
}

export type FundControlLevel = 'Apportionment' | 'Allotment' | 'Allocation' | 'Suballocation' | 'Suballotment';

export interface AEAHistoryEvent {
    timestamp: string;
    user: string;
    action: 'Created' | 'Increased' | 'Decreased' | 'Updated';
    amount: number;
    justification: string;
}

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
    children?: FundControlNode[];
    history?: AEAHistoryEvent[];
}

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

export interface WorkloadItem {
    id: string;
    projectId: string;
    name: string;
    workloadType: string;
    unit: string;
    quantity: number;
}

export type LaborCategory = 'Engineer' | 'Scientist' | 'Technician' | 'Admin' | 'Project Manager' | string;

export interface WorkforceEntry {
    laborCategory: LaborCategory;
    fundedFTE: number;
    unfundedFTE: number;
}

export interface WorkforcePlan {
    id: string;
    organization: string;
    functionalArea: string;
    entries: WorkforceEntry[];
}

export interface WorkforceScenario {
    id: string;
    name: string;
    fiscalYear: number;
    isBaseline: boolean;
    status: 'Draft' | 'Active' | 'Archived';
    auditLog: AuditLogEntry[];
    workloadItemIds: string[];
    workforcePlanIds: string[];
}

export interface LaborRate {
    laborCategory: LaborCategory;
    rate: number;
}

export interface LaborStandard {
    workloadUnit: string;
    laborCategory: LaborCategory;
    hoursPerUnit: number;
}

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
    certifiedBy?: string;
    certificationDate?: string;
}

export type ContractStatus = 'Active' | 'Under Mod' | 'Closed' | 'Completed' | 'Terminated' | 'Canceled';

export interface ContractMod {
    id: string;
    modNumber: string;
    date: string;
    amountDelta: number;
    description: string;
    authority: string;
    status: string;
}

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
    gInvoicingStatus: string;
    isBerryCompliant: boolean;
    modifications: ContractMod[];
    auditLog: AuditLogEntry[];
}

export interface DWCFAccount {
    id: string;
    name: string;
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
    customer: string;
    description: string;
    totalAmount: number;
    status: string;
    dwcfActivityId: string;
}

export type DWCFBillingStatus = 'Draft' | 'Sent' | 'Paid' | 'Canceled';

export interface DWCFBilling {
    id: string;
    orderId: string;
    status: DWCFBillingStatus;
    total: number;
    billingDate: string;
    isAdvanceBilling: boolean;
    costs?: {
        labor: number;
        material: number;
        overhead: number;
        surcharge: number;
    };
}

export type CashAuditOutcome = 'Passed' | 'Passed with Findings' | 'Failed';

export interface CIHOAccount {
    id: string;
    tafs: string;
    component: string;
    balance: number;
    lastReconciliationDate: string;
    cashHoldingAuthorityMemo: string;
    audits: {
        id: string;
        type: string;
        auditor: string;
        date: string;
        outcome: CashAuditOutcome;
        findingsSummary?: string;
    }[];
}

export type QuarterlyReviewStatus = 'Completed' | 'Action Required' | 'Pending' | 'N/A';

export interface DepositFundAccount {
    id: string;
    accountName: string;
    treasuryIndex: string;
    responsibleComponent: string;
    currentBalance: number;
    statutoryAuthorization: string;
    auditRequirement: string;
    quarterlyReviews: Record<string, QuarterlyReviewStatus>;
    audits: {
        id: string;
        type: string;
        auditor: string;
        date: string;
        outcome: CashAuditOutcome;
        findingsSummary?: string;
    }[];
}

export type BusinessLine = 'Navigation' | 'Flood Risk Management' | 'Environment' | 'Recreation' | 'Hydropower';
export type CapabilityLevel = 'Capability 1' | 'Capability 2' | 'Capability 3';
export type REStatus = 'Draft' | 'Pending Review' | 'Approved - District' | 'Approved - MSC' | 'Approved - HQ' | 'Presidential Budget';

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

export type HAPCaseStatus = 'New' | 'Valuation Review' | 'Benefit Calculation' | 'Legal Review' | 'Approved' | 'Paid' | 'Denied' | 'Closed';

export interface HAPCase {
    id: string;
    applicantName: string;
    propertyAddress: string;
    programType: string;
    submissionDate: string;
    status: HAPCaseStatus;
    purchasePrice: number;
    purchaseDate: string;
    mortgageBalance: number;
    currentFairMarketValue?: number;
    benefitAmount: number;
    applicantType: string;
    pcsOrderDate: string;
    assignedOfficer: string;
}

export type LeaseStatus = 'Active' | 'Expiring' | 'Holdover' | 'Terminated' | 'Pending Renewal';
export type LeaseScoring = 'Operating' | 'Capital';

export interface LGHLease {
    id: string;
    leaseNumber: string;
    propertyName: string;
    address: string;
    lessor: string;
    annualRent: number;
    startDate: string;
    expirationDate: string;
    status: LeaseStatus;
    occupancyRate: number;
    units: number;
    scoring: LeaseScoring;
    fairMarketValue: number;
    auditLog: AuditLogEntry[];
}

export interface InventoryTransaction {
    id: string;
    date: string;
    type: 'Receipt' | 'Issue' | 'Adjustment';
    quantity: number;
    user: string;
    notes?: string;
    workOrderId?: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    location: string;
    quantityOnHand: number;
    reorderPoint: number;
    unitOfMeasure: string;
    unitCost: number;
    transactions: InventoryTransaction[];
}

export interface Vendor {
    id: string;
    name: string;
    serviceType: string;
}

export type JustificationDocStatus = 'Draft' | 'Submitted' | 'Approved';
export type OHDAReimbursementStatus = 'Pending Validation' | 'Validated' | 'Reimbursed';

export interface ContingencyOperation {
    id: string;
    name: string;
    status: 'Planning' | 'Active' | 'Completed';
    type: string;
    location: string;
    personnelDeployed: number;
    executeOrderRef: string;
    sfisCode: string;
    cjcsProjectCode: string;
    justificationMaterials: Record<string, JustificationDocStatus>;
    incrementalCosts: {
        personnel: number;
        operatingSupport: number;
        investment: number;
        retrograde: number;
        reset: number;
    };
    billableIncrementalCosts: number;
    reimbursement: {
        billed: number;
        received: number;
    };
    fundingSource: 'OCOTF' | 'OHDACA' | 'Base';
    isBaseFunded: boolean;
    linkedThreadIds: string[];
    baselineCosts: number;
    costOffsets: { name: string; amount: number }[];
    incrementalCostsBreakdown: { id: string; name: string; description: string; isApplicable: boolean; cost: number }[];
    estimates?: {
        preDeployment: { cost: number };
        budget: { cost: number };
        working: { cost: number };
    };
    endDate?: string;
    ohdacaDetails?: {
        fadNumber: string;
        dscaFunding: number;
        reimbursementRequests: { id: string; amount: number; status: OHDAReimbursementStatus }[];
    };
}

export interface RemoteData<T> {
    status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILURE';
    data?: T;
    error?: Error;
}

export interface CommandNode {
    id: string;
    name: string;
    obligated: number;
    totalAuthority: number;
}

export interface ERPModule {
    id: string;
    label: string;
    icon: any;
    desc: string;
}

export interface IDOCInterface {
    id: string;
    timestamp: string;
    status: 'Success' | 'Warning' | 'Error';
    direction: 'Inbound' | 'Outbound';
    partner: string;
    messageType: string;
}

export type ScorecardStatus = 'Green' | 'Yellow' | 'Red';

export interface ContingencyFinding {
    finding: string;
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
    fmr_reference: string;
    recommendation: string;
}

export interface FiarInsight {
    title: string;
    severity: string;
    message: string;
    recommendation: string;
    impactArea: string;
}

export interface UnfundedCustomerOrder {
    id: string;
    customer: string;
    amount: number;
    status: 'Requires Notification' | 'Pending OUSD(C)' | 'Cleared';
    notificationTimestamp?: number;
}

export type ReconciliationStatus = 'Open' | 'In-Research' | 'Resolved' | 'Escalated';
export type ADAViolationStatus = 'Suspected' | 'Preliminary Review' | 'Formal Investigation' | 'Reported' | 'Closed - No Violation';

export interface ADAViolation {
    id: string;
    status: ADAViolationStatus;
    type: ADAViolationType;
    discoveryDate: string;
    amount: number;
    organization: string;
    description: string;
}

export type ADAViolationType = '31 USC 1341(a)(1)(A) - Amount Limitation' | '31 USC 1341(a)(1)(B) - Advance of Appropriation' | '31 USC 1342 - Voluntary Services' | '31 USC 1517(a) - Admin Control Limitation' | '31 USC 1301 - Purpose Statute' | '31 USC 1502 - Time Limitation';

export interface InvestigatingOfficer {
    id: string;
    name: string;
    rank: string;
    organization: string;
    fiscalLawTrainingDate: string;
    hasConflict: boolean;
    dateAppointed?: string;
}

export interface EvidenceItem {
    id: string;
    description: string;
    source: string;
    supportsConclusion: boolean;
    dateCollected: string;
}

export interface EvidenceItem {
    id: string;
    description: string;
    source: string;
    supportsConclusion: boolean;
    dateCollected: string;
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

export interface ADAInvestigation {
    id: string;
    violationId: string;
    stage: string;
    investigatingOfficer: InvestigatingOfficer;
    startDate: string;
    suspenseDate: string;
    evidence: EvidenceItem[];
    findings: string[];
    responsibleParties: ResponsibleParty[];
    correctiveActions: string[];
    legalReviewStatus: string;
    advanceDecisionStatus: string;
}

export type ReimbursableCustomerType = 'Intra-DoD' | 'Inter-Agency' | 'Private Party' | 'FMS';

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

export interface Appropriation {
    id: string;
    commandId: string;
    name: string;
    totalAuthority: number;
    distributions: Distribution[];
}

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
    appropriationCode: string;
    name: string;
    budgetActivities: BudgetActivity[];
}

export interface MarketResearchReport {
    naicsCode: string;
    smallBusinessSetAside: boolean;
    estimatedMarketPrice: number;
    competitors: string[];
    aiNarrative: string;
}

export interface VendorQuote {
    vendorId: string;
    vendorName: string;
    uei: string;
    amount: number;
    technicalScore: number;
    pastPerformanceScore: number;
    isResponsive: boolean;
    isResponsible: boolean;
}

export interface DWCFRateProfile {
    id: string;
    activityId: string;
    fiscalYear: number;
    compositeRate: number;
    overheadRate: number;
    surchargeRate: number;
    accumulatedOperatingResult: number;
    netOperatingResult: number;
    status: 'Active' | 'Draft' | 'Pending Approval';
}

export interface DWCFTransaction {
    id: string;
    date: string;
    activityId: string;
    type: 'Collection' | 'Disbursement' | 'Accrual';
    amount: number;
    description: string;
}

export interface BracInstallation {
    id: string;
    name: string;
    service: 'Army' | 'Navy' | 'Air Force' | 'Marine Corps';
    region: string;
    currentTroopDensity: number;
    totalForceCapacity: number;
    availableAcreage: number;
    conditionCode: number; // 0-100
    isJointBase: boolean;
    infrastructure: {
        schoolCapacityPct: number;
        hospitalBedsPer1000: number;
        highwayLevelOfService: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    };
    economicData: {
        regionalEmployment: number;
        defenseDependencyIndex: number; // 0-1
    };
    environmental: {
        hasSuperfundSite: boolean;
        rmisCleanupEstimate: number;
    };
    projected20YearReq: number;
}

export interface BracScenario {
    id: string;
    name: string;
    type: 'Closure' | 'Realignment';
    losingInstallationId: string;
    gainingInstallationId?: string;
    personnelMoving: number;
    milconCost: number;
    oneTimeMovingCost: number;
    annualSavings: number;
    status: 'Candidate' | 'Final' | 'Legislatively Locked';
    auditLog: AuditLogEntry[];
}

export interface BracAnalysisResult {
    mviScore: number;
    npv: number;
    paybackPeriod: number;
    breakEvenYear: number;
    isSurgeCompliant: boolean;
    jointnessScore: number;
    economicImpactIndex: number;
    infrastructureFlag: boolean;
    environmentalLiability: number;
    alerts: string[];
}

export interface CostTransfer {
    id: string;
    requestDate: string;
    description: string;
    amount: number;
    sourceProjectId: string;
    targetProjectId: string;
    sourceWorkItem: string;
    targetWorkItem: string;
    justification: string;
    status: 'Pending Approval' | 'Approved' | 'Posted' | 'Rejected';
    requestedBy: string;
    approvedBy?: string;
    postedDate?: string;
    glTransactionId?: string;
    auditLog: AuditLogEntry[];
}

export interface TravelOrder {
    id: string;
    traveler: string;
    destination: string;
    purpose: string;
    startDate: string;
    endDate?: string;
    estCost: number;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    fiscalYear: number;
}

export interface TravelExpense {
    id: string;
    date: string;
    category: 'Airfare' | 'Lodging' | 'Meals' | 'Ground Transport' | 'Misc';
    amount: number;
    description: string;
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

export type InspectionStatus = 'Scheduled' | 'Completed' | 'Reviewed' | 'Closed';

export interface OutgrantInspection {
    id: string;
    outgrantId: string;
    type: 'Compliance' | 'Utilization' | 'Environmental';
    scheduleDate: string;
    completionDate?: string;
    findings: string;
    correctiveActions: string;
    status: InspectionStatus;
    inspector: string;
}

export interface UtilizationSummary {
    id: string;
    outgrantId: string;
    dateObserved: string;
    observedUse: string;
    utilizationRate: number;
    inspector: string;
}

export type CostShareStatus = 'Initiated' | 'Active' | 'Completed' | 'Archived';

export interface CostShareAdjustment {
    id: string;
    date: string;
    type: 'Contribution' | 'Valuation Change';
    amountDelta: number;
    justification: string;
    authorizedBy: string;
}

export interface CostShareRecord {
    id: string;
    projectOrAssetId: string;
    authority: string;
    sponsorName: string;
    percentage: { federal: number; nonFederal: number };
    contributionType: 'Cash' | 'In-Kind' | 'LERRD' | 'Work-in-Kind';
    valuationMethod: 'Standard' | 'Appraisal' | 'Audit';
    status: CostShareStatus;
    agreementDate: string;
    totalValue: number;
    contributedValue: number;
    auditLog: AuditLogEntry[];
    adjustments: CostShareAdjustment[];
}

export type GeoLifecycleState = 'Draft' | 'Validated' | 'Published' | 'Retired';
export type GeoLayer = 'Real Property' | 'Tasks' | 'Encumbrance' | 'Environment';

export type GeospatialFeature = {
    id: string;
    assetName: string;
    type: 'Point' | 'Polygon' | 'Line';
    status: GeoLifecycleState;
    layer: GeoLayer;
    coordinates: { x: number; y: number };
    metadata: {
        source: string;
        accuracy: string;
        collectionMethod: string;
        captureDate: string;
        responsibleOfficial: string;
    };
    auditLog: AuditLogEntry[];
};

export type ExpenseUserRole = 'Clerk' | 'Approver' | 'Disbursing Officer';

export interface EncroachmentDashboardProps {
    onNavigateToGis: () => void;
}

export interface DisposalDashboardProps {
    onNavigateToAsset: (id: string) => void;
    onNavigateToSolicitation: (id: string) => void;
}

export interface RelocationDashboardProps {
    onNavigateToAcquisition?: (id: string) => void;
}

export interface LaborEntry {
    id: string;
    technicianName: string;
    laborCategory: string;
    hours: number;
    hourlyRate: number;
    date: string;
}

export interface MaterialEntry {
    id: string;
    inventoryItemId: string;
    itemName: string;
    quantity: number;
    unitCost: number;
    dateIssued: string;
}

export interface ServiceEntry {
    id: string;
    vendorId: string;
    vendorName: string;
    description: string;
    cost: number;
    date: string;
    invoiceNumber?: string;
}

export interface WorkOrder {
    id: string;
    description: string;
    type: 'Corrective' | 'Preventive';
    assetId: string;
    status: 'Open' | 'Assigned' | 'In Progress' | 'Completed' | 'Closed';
    assignedTo?: string;
    dueDate: string;
    jobPlanId?: string;
    laborEntries: LaborEntry[];
    materialEntries: MaterialEntry[];
    serviceEntries: ServiceEntry[];
    totalCost?: number;
}
