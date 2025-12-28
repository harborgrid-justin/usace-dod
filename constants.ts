import { 
  Obligation, DigitalThread, BusinessRule, ProjectOrder, TransferAction, FMRVolume,
  ReimbursableAgreement, ReimbursableOrder, USACEProject, CDOCostPool, CDOTransaction,
  Asset, GLTransaction, USSGLAccount, FundControlNode, Expense, Disbursement,
  WorkloadItem, WorkforcePlan, LaborRate, LaborStandard,
  FADocument, WorkAllowance, PurchaseRequest, Contract, DWCFAccount, DWCFActivity,
  DWCFOrder, DWCFBilling, CIHOAccount, BudgetLineItem, POMEntry, HAPCase, LGHLease,
  InventoryItem, Vendor, ContingencyOperation,
  Solicitation, RealPropertyAsset, WorkforceScenario,
  Appropriation, DepositFundAccount, ADAViolation, ADAInvestigation, InvestigatingOfficer, 
  OandMAppropriation, UnfundedCustomerOrder, ScorecardStatus, BracInstallation, BracScenario
} from './types';

// REMIS THEME CONFIGURATION
export const REMIS_THEME = {
    colors: {
        primary: '#047857', // emerald-700
        secondary: '#059669', // emerald-600
        accent: '#34d399', // emerald-400
        light: '#ecfdf5', // emerald-50
        dark: '#064e3b', // emerald-900
    },
    classes: {
        headerIconBg: 'bg-emerald-900',
        headerIconColor: 'text-white',
        buttonPrimary: 'bg-emerald-800 text-white hover:bg-emerald-700',
        buttonSecondary: 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50',
        tabActive: 'border-emerald-600 text-emerald-800',
        tabInactive: 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300',
        tabIconActive: 'text-emerald-600',
        tabIconInactive: 'text-zinc-400 group-hover:text-zinc-600',
        cardHover: 'hover:border-emerald-300',
        iconContainer: 'bg-emerald-50 border-emerald-100',
        iconColor: 'text-emerald-700',
        tableRowHover: 'hover:bg-emerald-50/20',
        inputFocus: 'focus:border-emerald-400',
        statusActive: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        badge: {
            warning: 'bg-amber-100 text-amber-800 border-amber-200',
            info: 'bg-blue-100 text-blue-800 border-blue-200'
        }
    }
};

/**
 * Fix: Added missing FIAR_CONTROLS constant used in ComplianceView
 */
export const FIAR_CONTROLS = [
    { id: 'C1', name: 'Entity Level Controls', status: 'PASS', score: 98 },
    { id: 'C2', name: 'Procure to Pay', status: 'PASS', score: 95 },
    { id: 'C3', name: 'Order to Cash', status: 'FAIL', score: 82 },
    { id: 'C4', name: 'Hire to Retire', status: 'PASS', score: 91 },
    { id: 'C5', name: 'Property, Plant & Equipment', status: 'PASS', score: 88 }
];

export const MOCK_BRAC_INSTALLATIONS: BracInstallation[] = [
    {
        id: 'INST-001', name: 'Fort Liberty', service: 'Army', region: 'Southeast',
        currentTroopDensity: 45000, totalForceCapacity: 60000, availableAcreage: 15000,
        conditionCode: 88, isJointBase: true,
        infrastructure: { schoolCapacityPct: 85, hospitalBedsPer1000: 3.1, highwayLevelOfService: 'B' },
        economicData: { regionalEmployment: 150000, defenseDependencyIndex: 0.45 },
        environmental: { hasSuperfundSite: false, rmisCleanupEstimate: 1200000 },
        projected20YearReq: 12000
    },
    {
        id: 'INST-002', name: 'Naval Station Norfolk', service: 'Navy', region: 'Mid-Atlantic',
        currentTroopDensity: 32000, totalForceCapacity: 35000, availableAcreage: 4000,
        conditionCode: 72, isJointBase: false,
        infrastructure: { schoolCapacityPct: 98, hospitalBedsPer1000: 2.2, highwayLevelOfService: 'F' },
        economicData: { regionalEmployment: 400000, defenseDependencyIndex: 0.60 },
        environmental: { hasSuperfundSite: true, rmisCleanupEstimate: 45000000 },
        projected20YearReq: 3800
    },
    {
        id: 'INST-003', name: 'Peterson SFB', service: 'Air Force', region: 'West',
        currentTroopDensity: 12000, totalForceCapacity: 18000, availableAcreage: 2500,
        conditionCode: 92, isJointBase: false,
        infrastructure: { schoolCapacityPct: 75, hospitalBedsPer1000: 4.5, highwayLevelOfService: 'A' },
        economicData: { regionalEmployment: 220000, defenseDependencyIndex: 0.30 },
        environmental: { hasSuperfundSite: false, rmisCleanupEstimate: 0 },
        projected20YearReq: 5000
    }
];

export const MOCK_BRAC_SCENARIOS: BracScenario[] = [
    {
        id: 'SCN-25-001', name: 'Realign Engineering to Liberty', type: 'Realignment',
        losingInstallationId: 'INST-002', gainingInstallationId: 'INST-001',
        personnelMoving: 2500, milconCost: 150000000, oneTimeMovingCost: 45000000, annualSavings: 35000000,
        status: 'Candidate', auditLog: []
    }
];

export const MOCK_OBLIGATIONS: Obligation[] = [
    { 
        id: 'OBL-001', 
        vendor: 'V-NEX SOLUTIONS LLC', 
        documentNumber: 'W912QR-24-C-0001', 
        description: 'Engineering Services - Ohio River',
        fiscalYear: 2024,
        appropriation: '21 2020',
        programElement: '111001',
        objectClass: '25.1',
        amount: 1500000, 
        disbursedAmount: 500000, 
        unliquidatedAmount: 1000000,
        status: 'Open', 
        date: '2023-11-15',
        lastActivityDate: '2024-02-20',
        obligationType: 'Contract',
        auditLog: []
    }
];

export const MOCK_DIGITAL_THREADS: DigitalThread[] = [
  {
      id: 'TR-10001',
      vendorName: 'ACME Corp',
      appropriation: '2020 OMA',
      unit: '1st Brigade',
      programElement: '111001',
      costCenter: 'CC-101',
      fadNumber: 'FAD-24-001',
      vendorUEI: 'UEI-123456789',
      contractVehicle: 'IDIQ',
      miprReference: 'MIPR-24-001',
      socioEconomicStatus: 'Small Business',
      obligationAmt: 100000,
      disbursementAmt: 50000,
      unliquidatedAmt: 50000,
      tasSymbol: '021 2020',
      eftStatus: 'Settled',
      supplyClass: 'Class IX',
      niinNsn: '1234-56-789',
      serialNumber: 'SN-001',
      uicCode: 'W12345',
      readinessImpact: 'High',
      bonaFideValid: true,
      berryCompliant: true,
      ppaInterestRisk: false,
      capId: 'CAP-001',
      gl1010: '$50,000',
      gaapStandard: 'SFFAS 4',
      controlObjective: 'Valid',
      blockchainHash: 'a1b2c3d4e5f6',
      contingencyOpId: 'OP-SENTINEL',
      unmatchedDisb: false,
      fiarDomain: 'Procure to Pay',
      invoiceDaysPending: 10
  }
];

export const COMMAND_HIERARCHY: FundControlNode = {
    id: 'DOD-ROOT',
    parentId: null,
    name: 'Department of Defense',
    level: 'Apportionment',
    totalAuthority: 842000000000,
    amountDistributed: 842000000000,
    amountCommitted: 0,
    amountObligated: 750000000000,
    amountExpended: 600000000000,
    isCMA: false,
    children: []
};

export const MOCK_APPROPRIATIONS: Appropriation[] = [
    { id: 'APP-001', commandId: 'USACE', name: 'Civil Works Fund', totalAuthority: 7200000000, distributions: [] }
];

export const MOCK_BUSINESS_RULES: BusinessRule[] = [
    { 
        id: 'R-ADA-001', 
        name: 'Antideficiency Act Limit', 
        code: 'ADA-001',
        description: 'Obligation amount cannot exceed available appropriation balance.',
        severity: 'Critical',
        logicString: 'IF amount > available_funds THEN VIOLATION',
        domain: 'Funds Control',
        isActive: true,
        conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 1000000 }], 
        citation: '31 U.S.C. 1341'
    }
];

export const MOCK_EXECUTION_DATA = [
    { month: 'Oct', planned: 8.3, actual: 8.5 },
    { month: 'Nov', planned: 16.6, actual: 17.2 },
    { month: 'Dec', planned: 25.0, actual: 24.8 },
    { month: 'Jan', planned: 33.3, actual: 33.5 },
];

export const MOCK_AUDIT_FINDINGS = [
    { id: 'AF-001', severity: 'Material Weakness', description: 'Lack of segregation of duties in GPC program.', linkedTransactionIds: ['TR-10002'] }
];

export const DOD_FMR_VOLUMES: FMRVolume[] = [
    { id: 'V1', volume: 'Volume 1', title: 'General FM Information', category: 'Policy', sizeMB: 2.5, pages: 150 },
    { id: 'V12_CH23', volume: 'Volume 12, Ch 23', title: 'Contingency Operations', category: 'Accounting', sizeMB: 1.2, pages: 45 },
];

export const POM_PHASES = [
    { year: 2026, phase: 'Planning', progress: 100, status: 'Completed' },
    { year: 2026, phase: 'Programming', progress: 85, status: 'In Progress' },
];

export const MOCK_TRANSFERS: TransferAction[] = [];
export const MOCK_IDOCS = [];
export const MOCK_REIMBURSABLE_AGREEMENTS: ReimbursableAgreement[] = [];
export const MOCK_REIMBURSABLE_ORDERS: ReimbursableOrder[] = [];
export const MOCK_PROJECT_ORDERS: ProjectOrder[] = [];
export const MOCK_USACE_PROJECTS: USACEProject[] = [];
export const MOCK_CDO_POOLS: CDOCostPool[] = [];
export const MOCK_CDO_TRANSACTIONS: CDOTransaction[] = [];
export const MOCK_ASSETS: Asset[] = [];
export const MOCK_GL_TRANSACTIONS: GLTransaction[] = [];
export const MOCK_USSGL_ACCOUNTS: USSGLAccount[] = [];
export const MOCK_FUND_HIERARCHY: FundControlNode[] = [];
export const MOCK_EXPENSES: Expense[] = [];
export const MOCK_DISBURSEMENTS: Disbursement[] = [];
export const MOCK_WWP_SCENARIOS: WorkforceScenario[] = [];
export const MOCK_WWP_WORKLOAD_ITEMS: WorkloadItem[] = [];
export const MOCK_WWP_WORKFORCE_PLANS: WorkforcePlan[] = [];
export const MOCK_WWP_LABOR_RATES: LaborRate[] = [];
export const MOCK_WWP_LABOR_STANDARDS: LaborStandard[] = [];
export const MOCK_SPENDING_CHAIN = [];
export const ERP_TCODES = [];
export const MOCK_INVENTORY: InventoryItem[] = [];
export const MOCK_VENDORS: Vendor[] = [];
export const MOCK_VENDORS_LIST: Vendor[] = [];
export const MOCK_FADS: FADocument[] = [];
export const MOCK_WORK_ALLOWANCES: WorkAllowance[] = [];
export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = [];
export const MOCK_CONTRACTS_LIST: Contract[] = [];
export const REIMBURSABLE_RATES = {
    assetUseCharge: 0.04,
    unfundedCivRetirement: 0.18,
    postRetirementHealth: 0.065,
    contractAdminCharge: 0.03,
    milLaborAcceleration: 0.15
};
export const MOCK_POM_ENTRIES: POMEntry[] = [];
export const MOCK_BUDGET_LINE_ITEMS: BudgetLineItem[] = [];
export const MOCK_HAP_CASES: HAPCase[] = [
    { id: 'HAP-24-001', applicantName: 'SGT John Doe', propertyAddress: '123 Pine St, Killeen, TX', programType: 'Expanded HAP', submissionDate: '2024-02-01', status: 'Benefit Calculation', purchasePrice: 250000, purchaseDate: '2019-06-15', mortgageBalance: 240000, currentFairMarketValue: 210000, benefitAmount: 0, applicantType: 'Military - PCS', pcsOrderDate: '2024-01-10', assignedOfficer: 'J. Smith' }
];
export const MOCK_LGH_LEASES: LGHLease[] = [
    { id: 'L-001', leaseNumber: 'DACA-01-20-L-0055', propertyName: 'Sunset Apartments', address: '4500 Sunset Blvd, Los Angeles, CA', lessor: 'Sunset Prop Mgmt', annualRent: 1200000, startDate: '2020-10-01', expirationDate: '2025-09-30', status: 'Active', occupancyRate: 98, units: 50, scoring: 'Operating', fairMarketValue: 15000000, auditLog: [] }
];
export const MOCK_REMIS_SOLICITATIONS: Solicitation[] = [];
export const MOCK_REMIS_ASSETS: RealPropertyAsset[] = [];
export const MOCK_DEPOSIT_FUNDS: DepositFundAccount[] = [];
export const MOCK_LIABILITY_TRANSACTIONS = [];
export const MOCK_CIHO_ACCOUNTS: CIHOAccount[] = [];
export const MOCK_CIHO_TRANSACTIONS = [];
export const MOCK_CASH_AUDITS = [];
export const MOCK_FBWT_CASES = [];
export const MOCK_SCORECARD_DATA = [];
export const MOCK_FBWT_TRANSACTIONS = [];
export const MOCK_CONTINGENCY_OPERATIONS: ContingencyOperation[] = [];
export const MOCK_O_AND_M_APPROPRIATIONS: OandMAppropriation[] = [];
export const MOCK_ADA_VIOLATIONS: ADAViolation[] = [];
export const MOCK_INVESTIGATIONS: ADAInvestigation[] = [];
export const MOCK_INVESTIGATING_OFFICERS: InvestigatingOfficer[] = [];
export const MOCK_DWCF_ACCOUNTS: DWCFAccount[] = [];
export const MOCK_DWCF_ACTIVITIES: DWCFActivity[] = [];
export const MOCK_DWCF_ORDERS: DWCFOrder[] = [];
export const MOCK_DWCF_BILLINGS: DWCFBilling[] = [];
export const MOCK_UNFUNDED_ORDERS: UnfundedCustomerOrder[] = [];
export const MOCK_RISK_DISTRIBUTION = [
  { name: 'Low Risk', value: 75, color: '#10b981' },
  { name: 'Medium Risk', value: 20, color: '#f59e0b' },
  { name: 'High Risk', value: 5, color: '#ef4444' }
];
