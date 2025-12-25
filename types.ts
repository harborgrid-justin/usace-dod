
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
  BRAC_DSS = 'BRAC Decision Support'
}

export type AgencyContext = 'ARMY_GFEBS' | 'USACE_CEFMS' | 'OSD_BRAC' | 'OSD_HAP' | 'OSD_LGH' | 'USACE_HAPMIS';

export type UserRole = string;

export interface AuditLogEntry {
    timestamp: string;
    user: string;
    action: string;
    details?: string;
}

export type ObligationStatus = 'Open' | 'Closed' | 'Dormant';
export type ObligationType = 'Contract' | 'Travel' | 'MIPR' | 'Misc' | 'Training' | 'Utilities' | 'GPC';

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
    status: ObligationStatus;
    date: string;
    lastActivityDate: string;
    obligationType: ObligationType;
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
    invoiceDaysPending?: number;
    auditFindingId?: string;
    daysInactive?: number;
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
    operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS' | 'IS_TRUE' | 'IS_FALSE' | 'CONTAINS' | 'NOT_CONTAINS';
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
    documents: { fs7600a?: string };
    linkedP2Number?: string;
    acceptanceDate?: string;
    commencementDate?: string;
}

export type TransferStage = 'Proposal' | 'SecDef Determination' | 'OMB Approval' | 'Reprogramming (DD 1415)' | 'Congressional Notification' | 'Treasury NET (SF 1151)' | 'Completed';
export type TransferAuthorityType = 'General Transfer Authority (GTA)' | 'Congressionally Directed' | 'Working Capital Fund' | 'MilCon' | 'Functional (10 USC 125)' | 'Inter-Agency (31 USC 1531)';

export interface TransferAction {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    authorityType: TransferAuthorityType;
    legalCitation: string;
    justification: string;
    isHigherPriority: boolean;
    isUnforeseen: boolean;
    isCongressionalDenial?: boolean;
    currentStage: TransferStage;
    dates: { initiated: string };
    documents: { dd1415?: boolean; sf1151?: boolean };
}

export interface FMRVolume {
    id: string;
    volume: string;
    title: string;
    category: 'Policy' | 'Budget' | 'Accounting' | 'Pay' | 'Funds' | 'Debt';
    sizeMB: number;
    pages: number;
}

export interface ReimbursableAgreement {
    id: string;
    buyer: string;
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

export interface USACEProject {
    id: string;
    name: string;
    district: string;
    p2Number: string;
    programType: 'Civil Works' | 'Military Programs';
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
    appropriation?: string;
}

export type CDOFunction = 'Engineering' | 'Operations' | 'Construction' | 'Planning' | 'Contracting' | 'Resource Management';

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

export type AssetLifecycleStatus = 'Planning' | 'Acquisition' | 'CIP' | 'In Service' | 'Modification' | 'Disposal';

export interface Asset {
    id: string;
    name: string;
    type: 'PRIP' | 'Revolving Fund';
    assetClass: 'Vessel' | 'Equipment' | 'Building' | 'Software' | 'Land';
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

export interface DepreciationComponent {
    id: string;
    name: string;
    cost: number;
    placedInServiceDate: string;
    usefulLife: number;
}

export interface AssetHistoryEvent {
    timestamp: string;
    event: string;
    details: string;
    user: string;
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
    status: 'Pending Approval' | 'Posted' | 'Draft' | 'Rejected';
    createdBy: string;
    approvedBy?: string;
    lines: JournalEntryLine[];
    auditLog: AuditLogEntry[];
}

export interface USSGLAccount {
    accountNumber: string;
    description: string;
    category: 'Asset' | 'Liability' | 'Net Position' | 'Budgetary' | 'Revenue' | 'Expense';
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
    hours?: number; // Added for CDO Transaction type compatibility if needed
    employeeId?: string;
}

export interface Disbursement {
    id: string;
    expenseId: string;
    amount: number;
    date: string;
    paymentMethod: 'EFT' | 'Check' | 'Inter-Agency';
    treasuryConfirmationId: string;
}

export interface WorkforceScenario {
    id: string;
    name: string;
    fiscalYear: number;
    isBaseline: boolean;
    status: 'Active' | 'Draft' | 'Archived';
    auditLog: AuditLogEntry[];
    workloadItemIds: string[];
    workforcePlanIds: string[];
}

export interface WorkloadItem {
    id: string;
    projectId?: string;
    name: string;
    workloadType: string;
    unit: string;
    quantity: number;
}

export type LaborCategory = 'Engineer' | 'Scientist' | 'Technician' | 'Admin' | 'Project Manager';

export interface WorkforcePlan {
    id: string;
    organization: string;
    functionalArea: string;
    entries: {
        laborCategory: LaborCategory;
        fundedFTE: number;
        unfundedFTE: number;
    }[];
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

export type PRStatus = 'Draft' | 'Pending Certification' | 'Funds Certified' | 'Solicitation' | 'Awarded' | 'Pending Funds';

export interface PurchaseRequest {
    id: string;
    description: string;
    amount: number;
    requester: string;
    date: string;
    status: PRStatus;
    appropriation?: string;
    programElement?: string; // Add WBS/Cost Center
    objectClass?: string;
    justification?: string;
    wbsCode?: string;
    certifiedBy?: string;
    certificationDate?: string;
    auditLog: AuditLogEntry[];
}

export type ContractStatus = 'Active' | 'Completed' | 'Closed' | 'Terminated' | 'Canceled' | 'Under Mod';

export interface ContractMod {
    id: string;
    modNumber: string;
    date: string;
    amountDelta: number;
    description: string;
    authority: string;
    status: 'Executed' | 'Pending';
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
    periodOfPerformance: { start: string, end: string };
    gInvoicingStatus: 'Draft' | 'Shared' | 'Accepted' | 'Not Applicable';
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
    status: 'In Process' | 'Complete';
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
    costs?: { labor: number; material: number; overhead: number; surcharge: number };
}

export interface CIHOAccount {
    id: string;
    tafs: string;
    component: string;
    balance: number;
    lastReconciliationDate: string;
    cashHoldingAuthorityMemo: string;
    audits: { id: string; type: string; auditor: string; date: string; outcome: CashAuditOutcome; findingsSummary?: string }[];
}

export type BusinessLine = 'Navigation' | 'Flood Control' | 'Environment' | 'Recreation' | 'Hydropower' | 'Water Supply';
export type CapabilityLevel = 'Capability 1' | 'Capability 2' | 'Capability 3';
export type REStatus = 'Draft' | 'Approved - District' | 'Approved - Division' | 'Approved - HQ' | 'Presidential Budget';

export interface BudgetLineItem {
    id: string;
    projectId: string;
    projectName: string;
    businessLine: BusinessLine;
    fiscalYear: number;
    capabilityLevel: CapabilityLevel;
    objectClass: string;
    amount: number;
    justification?: string;
    status: REStatus;
    isInflationAdjusted: boolean;
    lastModified: string;
    justificationNotes?: string; // For O&M View
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
    programType: 'Expanded HAP' | 'Conventional HAP';
    submissionDate: string;
    status: HAPCaseStatus;
    purchasePrice: number;
    purchaseDate: string;
    mortgageBalance: number;
    currentFairMarketValue?: number;
    benefitAmount: number;
    applicantType: 'Military - PCS' | 'Wounded' | 'Surviving Spouse' | 'BRAC';
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
    notes: string;
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

export interface ContingencyOperation {
    id: string;
    name: string;
    status: 'Active' | 'Planning' | 'Completed';
    type: 'Overseas Contingency Operation (OCO)' | 'Humanitarian Assistance' | 'Disaster Relief' | 'Peacekeeping';
    location: string;
    personnelDeployed: number;
    executeOrderRef: string;
    sfisCode: string;
    cjcsProjectCode: string;
    justificationMaterials: Record<string, string>;
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
        preDeployment?: { cost: number };
        budget?: { cost: number };
        working?: { cost: number };
    };
    endDate?: string;
    ohdacaDetails?: {
        fadNumber: string;
        dscaFunding: number;
        reimbursementRequests: { id: string; amount: number; status: OHDAReimbursementStatus }[];
    };
}

export type SubActivityGroup = {
    id: string;
    name: string;
    budget: number;
    priceChange: number;
    programChange: number;
    isModified?: boolean;
    justificationNotes?: string;
}

export type ActivityGroup = {
    id: string;
    name: string;
    subActivityGroups: SubActivityGroup[];
}

export type BudgetActivity = {
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

export interface Solicitation {
    id: string;
    prId: string;
    status: SolicitationStatus;
    title: string;
    type: 'RFQ' | 'RFP' | 'IFB';
    quotes: VendorQuote[];
    auditLog: AuditLogEntry[];
    marketResearch?: MarketResearchReport;
    statementOfWork?: string;
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

export type SolicitationStatus = 'Requirement Refinement' | 'Market Research' | 'Active Solicitation' | 'Evaluating Quotes' | 'Ready for Award' | 'Awarded' | 'Canceled';

export interface RemoteData<T> {
    status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILURE';
    data?: T;
    error?: Error;
}

export interface CommandNode {
    id: string;
    name: string;
    level: string;
    totalAuthority: number;
    obligated: number;
    children?: CommandNode[];
}

export interface Appropriation {
    id: string;
    commandId: string;
    name: string;
    totalAuthority: number;
    distributions: Distribution[];
}

export interface Distribution {
    id: string;
    toUnit: string;
    amount: number;
    purpose: string;
    fadNumber: string;
    status: 'Pending' | 'Approved' | 'Executed' | 'Rejected';
    date: string;
    linkedThreadId?: string;
}

export interface ERPModule {
    code: string;
    name: string;
    category: string;
    icon: any;
    desc: string;
    targetTab?: NavigationTab;
}

export interface IDOCInterface {
    id: string;
    status: 'Success' | 'Warning' | 'Error';
    direction: 'Inbound' | 'Outbound';
    partner: string;
    messageType: string;
    timestamp: string;
}

export interface DepositFundAccount {
    id: string;
    accountName: string;
    treasuryIndex: string;
    responsibleComponent: string;
    currentBalance: number;
    statutoryAuthorization: string;
    auditRequirement: string;
    quarterlyReviews: { [key: string]: QuarterlyReviewStatus };
    audits: { id: string; type: string; auditor: string; date: string; outcome: CashAuditOutcome; findingsSummary?: string }[];
}

export type DWCFTransaction = {
    id: string;
    date: string;
    activityId: string;
    type: 'Collection' | 'Disbursement';
    amount: number;
    description: string;
};

export type ScorecardStatus = 'Green' | 'Yellow' | 'Red';
export type JustificationDocStatus = 'Draft' | 'Submitted' | 'Approved';
export type OHDAReimbursementStatus = 'Pending Validation' | 'Validated' | 'Reimbursed';

export interface UnfundedCustomerOrder {
    id: string;
    customer: string;
    amount: number;
    status: 'Requires Notification' | 'Pending OUSD(C)' | 'Cleared';
    notificationTimestamp: number;
}

export type CashAuditOutcome = 'Passed' | 'Passed with Findings' | 'Failed';
export type QuarterlyReviewStatus = 'Completed' | 'Action Required' | 'Pending' | 'N/A';
export type ReconciliationStatus = 'Open' | 'In-Research' | 'Resolved' | 'Escalated';
export type ADAViolationStatus = 'Suspected' | 'Preliminary Review' | 'Formal Investigation' | 'Reported' | 'Closed - No Violation';

export type ADAViolationType = string;

export interface ADAViolation {
    id: string;
    status: ADAViolationStatus;
    type: ADAViolationType;
    discoveryDate: string;
    amount: number;
    organization: string;
    description: string;
}

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
    investigatingOfficer: InvestigatingOfficer | undefined;
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

export interface MarketResearchReport {
    naicsCode: string;
    smallBusinessSetAside: boolean;
    estimatedMarketPrice: number;
    competitors: string[];
    aiNarrative: string;
}

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

export type GPCStatus = 'Pending Approval' | 'Approved' | 'Flagged';

export interface GPCTransaction {
    id: string;
    date: string;
    merchant: string;
    amount: number;
    cardholder: string;
    status: GPCStatus;
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

export type MaintenanceType = 'Corrective' | 'Preventive';
export type WOStatus = 'Open' | 'Assigned' | 'In Progress' | 'Completed' | 'Closed';

export interface WorkOrder {
    id: string;
    description: string;
    type: MaintenanceType;
    assetId: string;
    status: WOStatus;
    assignedTo?: string;
    dueDate: string;
    totalCost?: number;
    jobPlanId?: string;
    laborEntries: LaborEntry[];
    materialEntries: MaterialEntry[];
    serviceEntries: ServiceEntry[];
}

// BRAC related
export interface BracInstallation {
    id: string;
    name: string;
    service: 'Army' | 'Navy' | 'Air Force' | 'Joint';
    region: string;
    currentTroopDensity: number;
    totalForceCapacity: number;
    availableAcreage: number;
    conditionCode: number;
    isJointBase: boolean;
    infrastructure: {
        schoolCapacityPct: number;
        hospitalBedsPer1000: number;
        highwayLevelOfService: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    };
    economicData: {
        regionalEmployment: number;
        defenseDependencyIndex: number;
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
    status: 'Scenario' | 'Candidate' | 'Final' | 'Legislatively Locked';
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

export interface DWCFRateProfile {
    id: string;
    activityId: string;
    fiscalYear: number;
    compositeRate: number;
    overheadRate: number;
    surchargeRate: number;
    accumulatedOperatingResult: number;
    netOperatingResult: number;
    status: 'Active' | 'Pending';
}

export type CostTransferStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Posted' | 'Rejected';

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
    status: CostTransferStatus;
    requestedBy: string;
    approvedBy?: string;
    postedDate?: string;
    glTransactionId?: string;
    auditLog: AuditLogEntry[];
}
