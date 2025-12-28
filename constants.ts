import { BusinessRule, FundControlLevel, Appropriation, ReimbursableAgreement, ReimbursableOrder, DWCFAccount, DWCFActivity, DWCFOrder, DWCFBilling, UnfundedCustomerOrder, USACEProject, CDOCostPool, CDOTransaction, Solicitation, EncroachmentCase, CostShareRecord, RelocationCase, GeospatialFeature, AppraisalRecord, HAPCase, LGHLease, BracInstallation, BracScenario, Expense, Disbursement, GLTransaction, FundControlNode, PurchaseRequest, Contract, InventoryItem, Vendor, POMEntry, BudgetLineItem, TransferAction, Asset } from './types';

export * from './constants/theme';
export * from './constants/mock_remis';
export * from './constants/mock_financial';

export const FIAR_CONTROLS = [
    { id: 'C1', name: 'Entity Level Controls', status: 'PASS', score: 98 },
    { id: 'C2', name: 'Procure to Pay', status: 'PASS', score: 95 }
];

export const MOCK_RISK_DISTRIBUTION = [
    { name: 'Low', value: 65, color: '#10b981' },
    { name: 'Medium', value: 20, color: '#f59e0b' },
    { name: 'High', value: 15, color: '#ef4444' }
];

export const MOCK_DIGITAL_THREADS = [
    { id: 'TR-10001', vendorName: 'V-NEX SOLUTIONS', appropriation: '21 2020', obligationAmt: 500000, disbursementAmt: 250000, unliquidatedAmt: 250000, unit: 'LRL District', blockchainHash: 'ABC123XYZ789', gaapStandard: 'SFFAS 7', controlObjective: 'Existence', tasSymbol: '21 2020 000', eftStatus: 'Settled', supplyClass: 'II', niinNsn: '1234-01-222-3333', serialNumber: 'SN-001', uicCode: 'W12345', readinessImpact: 'High', bonaFideValid: true, berryCompliant: true, ppaInterestRisk: false, gl1010: 'Balanced', programElement: 'PE123', costCenter: 'CC100', fadNumber: 'FAD123', vendorUEI: 'UEI123', contractVehicle: 'GSA', miprReference: 'MIPR123', socioEconomicStatus: 'SB' },
    { id: 'TR-10002', vendorName: 'DEFENSE LOGISTICS', appropriation: '21 2020', obligationAmt: 1200000, disbursementAmt: 400000, unliquidatedAmt: 800000, unit: 'SAM District', blockchainHash: 'DEF456UVW012', gaapStandard: 'SFFAS 7', controlObjective: 'Valuation', tasSymbol: '21 2020 000', eftStatus: 'Pending', supplyClass: 'IV', niinNsn: '5678-01-444-5555', serialNumber: 'SN-002', uicCode: 'W67890', readinessImpact: 'Critical', bonaFideValid: true, berryCompliant: false, ppaInterestRisk: true, gl1010: 'Balanced', auditFindingId: 'FIND-001', programElement: 'PE456', costCenter: 'CC200', fadNumber: 'FAD456', vendorUEI: 'UEI456', contractVehicle: 'IDIQ', miprReference: 'MIPR456', socioEconomicStatus: 'HUBZone', invoiceDaysPending: 45, dssnNumber: '5555', betcCode: 'COLL' }
];

export const MOCK_BUSINESS_RULES: BusinessRule[] = [
    { 
        id: 'R-001', code: 'ADA-01', name: 'Anti-Deficiency Check', 
        description: 'Obligation must not exceed available authority.', 
        domain: 'Financial', severity: 'Critical', 
        logicString: 'IF obligation > authority THEN violation', 
        citation: '31 U.S.C. 1517', isActive: true, 
        conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 1000000 }] 
    },
    { 
        id: 'R-002', code: 'PAY-002', name: 'PPA Interest Monitor', 
        description: 'Payments must be within 30 days of invoice.', 
        domain: 'Financial', severity: 'Warning', 
        logicString: 'IF days > 30 THEN flag', 
        citation: 'Prompt Payment Act', isActive: true, 
        conditions: [{ field: 'invoiceDaysPending', operator: 'GREATER_THAN', value: 30 }] 
    }
];

export const DOD_FMR_VOLUMES = [
    { id: 'V12_CH23', volume: 'Volume 12, Chapter 23', title: 'Contingency Operations', category: 'Budget', sizeMB: 4.2, pages: 120 },
    { id: 'V11B', volume: 'Volume 11B', title: 'Reimbursements and Revenue Recognition', category: 'Accounting', sizeMB: 8.5, pages: 340 }
];

export const POM_PHASES = [
    { phase: 'Formulation', year: '2026', status: 'Completed', progress: 100 },
    { phase: 'Review', year: '2026', status: 'In Progress', progress: 45 },
    { phase: 'Budget Defense', year: '2027', status: 'Upcoming', progress: 0 },
];

export const MOCK_IDOCS = [
    { id: 'IDOC-001', timestamp: '2024-03-15 08:30:00', status: 'Success', direction: 'Inbound', partner: 'GFEBS-PRD', messageType: 'OBL_REC' },
];

export const ERP_TCODES = [
    { code: 'F110', description: 'Automatic Payment Run', module: 'FI', riskLevel: 'High' },
    { code: 'ME21N', description: 'Create Purchase Order', module: 'MM', riskLevel: 'Medium' }
];

export const MOCK_USSGL_ACCOUNTS = [
    { accountNumber: '101000', description: 'Fund Balance with Treasury', category: 'Asset', normalBalance: 'Debit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '211000', description: 'Accounts Payable', category: 'Liability', normalBalance: 'Credit', financialStatement: 'Balance Sheet', isActive: true }
];

export const COMMAND_HIERARCHY = {
    id: 'DOD-ROOT', parentId: null, name: 'Department of Defense', level: 'Apportionment' as FundControlLevel, totalAuthority: 850000000000, amountDistributed: 750000000000, amountCommitted: 0, amountObligated: 600000000000, amountExpended: 500000000000, isCMA: false, children: [
        { id: 'ARMY-ROOT', parentId: 'DOD-ROOT', name: 'Department of the Army', level: 'Allotment' as FundControlLevel, totalAuthority: 185000000000, amountDistributed: 150000000000, amountCommitted: 0, amountObligated: 120000000000, amountExpended: 100000000000, isCMA: false, children: [], history: [] }
    ], history: []
};

export const MOCK_APPROPRIATIONS: Appropriation[] = [
    { id: 'OMA-FY24', commandId: 'ARMY-ROOT', name: 'O&M, Army', totalAuthority: 5000000000, obligated: 1200000000, distributions: [] }
];

export const MOCK_WWP_SCENARIOS = [
    { id: 'SCN-1', name: 'Baseline FY24', fiscalYear: 2024, isBaseline: true, status: 'Final', workloadItemIds: ['WI-1'], workforcePlanIds: ['WP-1'], auditLog: [] }
];

export const MOCK_WWP_WORKLOAD_ITEMS = [
    { id: 'WI-1', name: 'Dredge Mission', workloadType: 'Operational', quantity: 1200, unit: 'CY' }
];

export const MOCK_WWP_WORKFORCE_PLANS = [
    { id: 'WP-1', organization: 'LRL-ED', functionalArea: 'Engineering', entries: [{ laborCategory: 'Engineer', fundedFTE: 45, unfundedFTE: 5 }] }
];

export const MOCK_WWP_LABOR_RATES = [
    { laborCategory: 'Engineer', rate: 85.50 }
];

export const MOCK_WWP_LABOR_STANDARDS = [
    { workloadUnit: 'CY', laborCategory: 'Engineer', hoursPerUnit: 0.15 }
];

export const MOCK_USACE_PROJECTS: USACEProject[] = [
    { id: 'PROJ-001', name: 'Ohio River Lock & Dam', district: 'LRL', p2Number: '123456', programType: 'Civil Works', appropriation: 'Construction', financials: { currentWorkingEstimate: 12000000, obligated: 4500000, programmed: 12500000, disbursed: 4000000, prc_committed: 500000, contractRetainage: 0 }, p2Linkage: true, costShare: { sponsorName: 'State of KY', federalShare: 65, nonFederalShare: 35, totalContributed: 2000000, balanceDue: 2200000 }, cwisCode: '01234', milestones: [{ description: 'Award Contract', code: 'AWD', scheduledDate: '2024-05-15', status: 'Pending' }], risks: [], contractMods: [], realEstate: [{ tractNumber: '101', owner: 'Private', status: 'Acquired', cost: 250000, lerrdCredit: true }], weatherDelayDays: 2 },
];

/**
 * Added missing mock constants to satisfy module imports
 */
export const MOCK_EXECUTION_DATA = [
    { month: 'Oct', planned: 12.5, actual: 11.8 },
    { month: 'Nov', planned: 24.8, actual: 23.9 },
    { month: 'Dec', planned: 38.2, actual: 40.5 },
    { month: 'Jan', planned: 52.4, actual: 51.2 },
    { month: 'Feb', planned: 65.1, actual: 68.4 }
];

export const MOCK_AUDIT_FINDINGS = [
    { id: 'AF-2024-001', severity: 'Material Weakness', description: 'Incomplete documentation for PR&C certification', linkedTransactionIds: ['TR-10001'] },
    { id: 'AF-2024-002', severity: 'Significant Deficiency', description: 'Stale ULO records exceeding 180 days', linkedTransactionIds: ['TR-10002'] }
];

export const MOCK_DEPOSIT_FUNDS = [
    { id: 'DF-001', treasuryIndex: '97X6000', accountName: 'General Fund Deposit Account', statutoryAuthorization: '31 USC 3302', auditRequirement: 'Annual', quarterlyReviews: { Q1: 'Completed', Q2: 'Pending' }, currentBalance: 45000000 }
];

export const MOCK_LIABILITY_TRANSACTIONS = [
    { id: 'LT-001', depositFundId: 'DF-001', source: 'Treasury Intake', amount: 500000, status: 'Active', description: 'Quarterly Settlement' }
];

export const MOCK_CIHO_ACCOUNTS = [
    { id: 'CIHO-001', tafs: '21 2020', component: 'Army PAA', balance: 1250000, cashHoldingAuthorityMemo: 'OSD-24-A1', lastReconciliationDate: '2024-02-15' }
];

export const MOCK_CIHO_TRANSACTIONS = [
    { id: 'CT-001', cihoAccountId: 'CIHO-001', date: '2024-03-01', description: 'Local Procurement Disbursement', amount: -25000 }
];

export const MOCK_FBWT_CASES = [
    { id: 'REC-001', type: 'IPAC Discrepancy', tas: '21 2020 000', amount: 45000, age: 14, status: 'Open', linkedThreadId: 'TR-10001' }
];

export const MOCK_SCORECARD_DATA = [
    { metric: 'Reconciliation Volume', status: 'Green' as any, details: '98% of FBWT accounts reconciled within 3 days' },
    { metric: 'Variance Magnitude', status: 'Yellow' as any, details: 'Current unresolved variance exceeds $1M' }
];

export const MOCK_FBWT_TRANSACTIONS = [
    { id: 'T-001', type: 'Collection', amount: 250000, tas: '21 2020 000' }
];

export const MOCK_CONTINGENCY_OPERATIONS = [
    { id: 'CO-24-01', name: 'Operation Southern Shield', status: 'Active', type: 'Disaster Relief', location: 'Gulf Coast', fundingSource: 'OHDACA', incrementalCosts: { personnel: 500000, operatingSupport: 1200000, investment: 0, retrograde: 0, reset: 0 }, ohdacaDetails: { fadNumber: 'FAD-OH-001', dscaFunding: 5000000, reimbursementRequests: [] }, justificationMaterials: { 'O-1': 'Ready' } }
];

export const MOCK_O_AND_M_APPROPRIATIONS = [
    { id: 'OMA', name: 'Operation & Maintenance, Army', budgetActivities: [] }
];

export const MOCK_ADA_VIOLATIONS = [
    { id: 'ADA-24-001', status: 'Preliminary Review', type: '31 USC 1517(a) - Admin Control Limitation' as any, discoveryDate: '2024-03-01', amount: 250000, organization: 'LRL District', description: 'Obligation exceeded allotment' }
];

export const MOCK_INVESTIGATIONS = [
    { id: 'INV-001', violationId: 'ADA-24-001', stage: 'Evidence Collection', startDate: '2024-03-05', evidence: [], findings: [], responsibleParties: [], correctiveActions: [] }
];

export const MOCK_INVESTIGATING_OFFICERS = [
    { id: 'IO-001', name: 'Jane Doe', rank: 'Col', organization: 'HQUSACE', fiscalLawTrainingDate: '2023-05-10' }
];

/**
 * Added explicit type to MOCK_CDO_POOLS to satisfy CDOCostPool status constraints
 */
export const MOCK_CDO_POOLS: CDOCostPool[] = [
    { id: 'CP-001', functionName: 'Engineering', orgCode: 'LRL-ED', fyBudget: 12000000, obligated: 8500000, currentRate: 18.5, status: 'Active' }
];

export const MOCK_CDO_TRANSACTIONS = [
    { id: 'CTX-001', date: '2024-03-10', type: 'Labor', amount: 15000, description: 'Overhead Distribution', function: 'Engineering' }
];

export const MOCK_ASSETS: Asset[] = [
    { id: 'A-1001', name: 'Dredge WHEELER', type: 'Revolving Fund', assetClass: 'Vessel', status: 'In Service', acquisitionCost: 45000000, residualValue: 5000000, usefulLife: 25, placedInServiceDate: '2005-01-01', pripAuthorized: true, plantIncrementWaiver: { active: false }, components: [], accumulatedDepreciation: 32000000, auditLog: [] }
];

export const MOCK_GL_TRANSACTIONS = [
    { id: 'GL-001', date: '2024-03-15', description: 'Payroll Accrual', type: 'Accrual', sourceModule: 'LC', referenceDoc: 'PR-1001', totalAmount: 125000, status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: [] }
];

export const MOCK_FUND_HIERARCHY: FundControlNode[] = [
    { id: 'DOD-ROOT', parentId: null, name: 'DOD', level: 'Apportionment', totalAuthority: 1e12, amountDistributed: 8e11, amountCommitted: 0, amountObligated: 0, amountExpended: 0, isCMA: false, children: [], history: [] }
];

export const MOCK_SPENDING_CHAIN = [
    { type: 'PR', docNumber: '10001', amount: '100000', status: 'Success', linkedThreadId: 'TR-10001' },
    { type: 'PO', docNumber: '450000', amount: '100000', status: 'Success', linkedThreadId: 'TR-10001' }
];

export const MOCK_INVENTORY = [
    { id: 'INV-1', name: 'Hydraulic Seal 4"', sku: 'HS-400', quantityOnHand: 25, reorderPoint: 10, unitCost: 145.00, unitOfMeasure: 'EA', category: 'Mechanical', location: 'Warehouse A', transactions: [] }
];

export const MOCK_VENDORS = [
    { id: 'V-101', name: 'Supply Chain Corp', serviceType: 'Materials' }
];

export const REIMBURSABLE_RATES = {
    assetUseCharge: 0.04,
    unfundedCivRetirement: 0.18,
    postRetirementHealth: 0.065,
    contractAdminCharge: 0.05,
    milLaborAcceleration: 0.08
};

export const MOCK_POM_ENTRIES: POMEntry[] = [
    { projectId: '123456', projectName: 'Ohio River Lock', businessLine: 'Navigation', fy1: 5000000, fy2: 5200000, fy3: 5400000, fy4: 5600000, fy5: 5800000 }
];

export const MOCK_BUDGET_LINE_ITEMS: BudgetLineItem[] = [
    { id: 'BL-1', projectId: '123456', projectName: 'Ohio River Lock', businessLine: 'Navigation', fiscalYear: 2026, capabilityLevel: 'Capability 1', objectClass: '25.1', amount: 5000000, justification: 'Critical infrastructure sustainment.', status: 'Draft', isInflationAdjusted: true, lastModified: '2024-03-15' }
];

export const MOCK_TRANSFERS = [];
export const MOCK_REIMBURSABLE_AGREEMENTS = [];
export const MOCK_REIMBURSABLE_ORDERS = [];
export const MOCK_PROJECT_ORDERS = [];
export const MOCK_DWCF_ACCOUNTS = [];
export const MOCK_DWCF_ACTIVITIES = [];
export const MOCK_DWCF_ORDERS = [];
export const MOCK_DWCF_BILLINGS = [];
export const MOCK_UNFUNDED_ORDERS = [];
export const MOCK_FADS = [];
export const MOCK_WORK_ALLOWANCES = [];
export const MOCK_REMIS_SOLICITATIONS = [];
export const MOCK_REMIS_ENCROACHMENTS = [];
export const MOCK_REMIS_COST_SHARES = [];
export const MOCK_REMIS_RELOCATIONS = [];
export const MOCK_REMIS_FEATURES = [];
export const MOCK_REMIS_APPRAISALS = [];
export const MOCK_HAP_CASES = [];
export const MOCK_LGH_LEASES = [];
export const MOCK_BRAC_INSTALLATIONS = [];
export const MOCK_BRAC_SCENARIOS = [];
export const MOCK_PURCHASE_REQUESTS = [];
export const MOCK_CONTRACTS_LIST = [];
export const MOCK_EXPENSES = [];
export const MOCK_DISBURSEMENTS = [];