
export type Brand<K, T> = K & { __brand: T };
export type UserId = Brand<string, 'UserId'>;
export type TransactionId = Brand<string, 'TransactionId'>;

export enum NavigationTab {
  DASHBOARD = 'Dashboard',
  DIGITAL_THREAD = 'Digital Thread',
  PPBE_CYCLE = 'PPBE Cycle',
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
  SYSTEM_ADMIN_USERS = 'User Management',
}

/**
 * Common status and result types for cross-module coordination.
 */
export interface RemoteData<T> {
  status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILURE';
  data?: T;
  error?: Error;
}

export type ScorecardStatus = 'Green' | 'Yellow' | 'Red';
export type CashAuditOutcome = 'Passed' | 'Passed with Findings' | 'Failed';
export type QuarterlyReviewStatus = 'Completed' | 'Action Required' | 'Pending' | 'N/A';
export type ReconciliationStatus = 'Open' | 'In-Research' | 'Resolved' | 'Escalated';
export type ADAViolationStatus = 'Suspected' | 'Preliminary Review' | 'Formal Investigation' | 'Reported' | 'Closed - No Violation';

export type A123Status = 'Pending' | 'In-Review' | 'Certified' | 'Flagged';
export type CostShareStatus = 'Initiated' | 'Active' | 'Completed';
export type GPCStatus = 'Pending Approval' | 'Approved' | 'Flagged';

export interface RuleEvaluationResult {
    ruleId: string;
    ruleName: string;
    passed: boolean;
    severity: 'Critical' | 'Warning' | 'Info';
    message: string;
    timestamp: string;
}

export interface RuleCondition {
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'NOT_CONTAINS' | 'IS_TRUE' | 'IS_FALSE';
    value: any;
}

export interface BusinessRule {
    id: string;
    code: string;
    name: string;
    description: string;
    domain: 'General' | 'Acquisition' | 'Financial' | 'Reimbursables' | 'Transfers' | 'Audit';
    severity: 'Critical' | 'Warning' | 'Info';
    logicString: string;
    citation: string;
    isActive: boolean;
    linkedFmrVolumeId?: string;
    conditions: RuleCondition[];
}
