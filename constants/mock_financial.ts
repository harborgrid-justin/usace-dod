import { 
    Obligation, UMDRecord, NULORecord, BudgetLineItem, POMEntry, 
    Appropriation, TransferAction, USSGLAccount, GLTransaction,
    ADAViolation, ADAInvestigation, InvestigatingOfficer,
    ReimbursableAgreement, ReimbursableOrder, ProjectOrder,
    DWCFAccount, DWCFActivity, DWCFOrder, DWCFBilling, UnfundedCustomerOrder
} from '../types';

export const MOCK_OBLIGATIONS: Obligation[] = [
    { 
        id: 'OBL-001', vendor: 'V-NEX SOLUTIONS LLC', documentNumber: 'W912QR-24-C-0001', 
        description: 'Engineering Services - Ohio River', fiscalYear: 2024, appropriation: '21 2020',
        programElement: '111001', objectClass: '25.1', amount: 1500000, disbursedAmount: 500000, 
        unliquidatedAmount: 1000000, status: 'Open', date: '2023-11-15', lastActivityDate: '2024-02-20',
        obligationType: 'Contract', auditLog: []
    }
];

export const MOCK_UMD_RECORDS: UMDRecord[] = [
    { id: 'UMD-001', tas: '96X3122', amount: 45000, ageDays: 124, sourceModule: 'Disbursement', researchStatus: 'Researching', assignedTo: 'Analyst A' }
];

export const MOCK_NULO_RECORDS: NULORecord[] = [
    { id: 'NULO-001', documentNumber: 'W912QR-23-C-001', amount: -5400, varianceReason: 'Incorrect quantity billed by vendor', status: 'Correction Pending' }
];

// Added missing MOCK_BUDGET_LINE_ITEMS
export const MOCK_BUDGET_LINE_ITEMS: BudgetLineItem[] = [
    { id: 'BL-001', projectId: '123456', projectName: 'Ohio River Lock Maintenance', businessLine: 'Navigation', fiscalYear: 2026, capabilityLevel: 'Capability 1', objectClass: '25.1 - Contracts', amount: 4500000, justification: 'Critical lifecycle sustainment.', status: 'Draft', isInflationAdjusted: true, lastModified: '2024-03-01' },
    { id: 'BL-002', projectId: '998877', projectName: 'Everglades Restoration', businessLine: 'Environment', fiscalYear: 2026, capabilityLevel: 'Capability 2', objectClass: '11.1 - Civilian Labor', amount: 1200000, justification: 'Ecosystem protection.', status: 'Draft', isInflationAdjusted: false, lastModified: '2024-03-01' }
];

// Added missing MOCK_POM_ENTRIES
export const MOCK_POM_ENTRIES: POMEntry[] = [
    { projectId: '123456', projectName: 'Ohio River Lock Maintenance', businessLine: 'Navigation', fy1: 4500000, fy2: 4644000, fy3: 4792608, fy4: 4945971, fy5: 5104242 },
    { projectId: '998877', projectName: 'Everglades Restoration', businessLine: 'Environment', fy1: 1200000, fy2: 1238400, fy3: 1278028, fy4: 1318925, fy5: 1361131 }
];

// Added missing MOCK_USSGL_ACCOUNTS
export const MOCK_USSGL_ACCOUNTS: USSGLAccount[] = [
    { accountNumber: '101000', description: 'Fund Balance with Treasury', category: 'Asset', normalBalance: 'Debit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '211000', description: 'Accounts Payable', category: 'Liability', normalBalance: 'Credit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '610000', description: 'Operating Expenses', category: 'Expense', normalBalance: 'Debit', financialStatement: 'SBR', isActive: true }
];

// Added missing MOCK_GL_TRANSACTIONS
export const MOCK_GL_TRANSACTIONS: GLTransaction[] = [
    { id: 'GL-1001', date: '2024-03-15', description: 'Service Contract Accrual', type: 'Manual Journal', sourceModule: 'GL', referenceDoc: 'W912QR-24-P-001', totalAmount: 450000, status: 'Posted', createdBy: 'KO_ADMIN', lines: [
        { ussglAccount: '610000', description: 'Exp', debit: 450000, credit: 0, fund: '0100', costCenter: 'LRL' },
        { ussglAccount: '211000', description: 'Payable', debit: 0, credit: 450000, fund: '0100', costCenter: 'LRL' }
    ], auditLog: [] }
];

// Added missing MOCK_TRANSFERS
export const MOCK_TRANSFERS: TransferAction[] = [
    { id: 'TRF-24-01', fromAccount: 'OMA 2024', toAccount: 'RDTE 2024', amount: 12000000, authorityType: 'General Transfer Authority (GTA)', legalCitation: 'PL 118-22', justification: 'Unforeseen testing requirements.', currentStage: 'OMB Approval', dates: { initiated: '2024-02-15' }, documents: { dd1415: 'DD-1415-24-01' } }
];

// Added missing MOCK_APPROPRIATIONS
export const MOCK_APPROPRIATIONS: Appropriation[] = [
    { id: 'OMA-24', commandId: 'USACE', name: 'Operation & Maintenance, Army', totalAuthority: 1250000000, obligated: 850000000, distributions: [] }
];

// Added missing MOCK_DEPOSIT_FUNDS
export const MOCK_DEPOSIT_FUNDS = [
    { id: 'DF-001', treasuryIndex: '96X6000', accountName: 'Advances from Others', statutoryAuthorization: '31 USC 1321', auditRequirement: 'Annual SBR', currentBalance: 4500000, quarterlyReviews: { Q1: 'Completed', Q2: 'Pending' } }
];

// Added missing MOCK_LIABILITY_TRANSACTIONS
export const MOCK_LIABILITY_TRANSACTIONS = [
    { id: 'TX-L-001', depositFundId: 'DF-001', source: 'FEMA', amount: 1250000, description: 'Disaster Recovery Advance', status: 'Available' }
];

// Added missing MOCK_CIHO_ACCOUNTS
export const MOCK_CIHO_ACCOUNTS = [
    { id: 'CIHO-001', tafs: '96X6050', component: 'USACE LRL', balance: 45000, cashHoldingAuthorityMemo: 'Memo-2023-012', lastReconciliationDate: '2024-02-28' }
];

// Added missing MOCK_CIHO_TRANSACTIONS
export const MOCK_CIHO_TRANSACTIONS = [
    { id: 'TX-C-001', cihoAccountId: 'CIHO-001', date: '2024-03-01', amount: 500, description: 'Petty Cash Replenishment' }
];

// Added missing MOCK_FBWT_CASES
export const MOCK_FBWT_CASES = [
    { id: 'CASE-001', type: 'Disbursement Variance', tas: '96 3122', amount: 12450.50, age: 45, status: 'In-Research', linkedThreadId: 'TR-10001' }
];

// Added missing MOCK_SCORECARD_DATA
export const MOCK_SCORECARD_DATA = [
    { metric: 'FBWT Accuracy', status: 'Green', details: '99.8% match against Treasury 6653.' },
    { metric: 'Aging Variances', status: 'Yellow', details: '12 cases exceeding 60-day threshold.' }
];

// Added missing MOCK_FBWT_TRANSACTIONS
export const MOCK_FBWT_TRANSACTIONS = [
    { id: 'FT-001', type: 'IPAC Collection', tas: '96 3122', amount: 85000, date: '2024-03-10' }
];

// Added missing MOCK_CONTINGENCY_OPERATIONS
export const MOCK_CONTINGENCY_OPERATIONS = [
    { id: 'CO-01', name: 'Operation Guardian Shield', status: 'Active', type: 'Border Security', location: 'Southern US', fundingSource: 'OCOTF', isBaseFunded: false, executeOrderRef: 'EXORD-2024-01', sfisCode: 'C8821', incrementalCosts: { personnel: 1200000, operatingSupport: 4500000, investment: 0, retrograde: 0, reset: 0 }, billableIncrementalCosts: 5700000, baselineCosts: 0, costOffsets: [], incrementalCostsBreakdown: [], linkedThreadIds: ['TR-10001'], justificationMaterials: {} }
];

// Added missing MOCK_O_AND_M_APPROPRIATIONS
export const MOCK_O_AND_M_APPROPRIATIONS = [
    { id: 'OMA', name: 'Operation & Maintenance, Army', budgetActivities: [
        { id: 'BA1', name: 'Operating Forces', activityGroups: [
            { id: 'AG1', name: 'Land Forces', subActivityGroups: [
                { id: 'SAG1', name: 'Divisions', budget: 1250000000 }
            ]}
        ]}
    ]}
];

// Added missing MOCK_EXPENSES
export const MOCK_EXPENSES = [
    { id: 'EXP-001', obligationId: 'OBL-001', amount: 125000, date: '2024-03-10', description: 'Phase 1 Deliverable', status: 'Pending Approval', createdBy: 'Analyst_A', auditLog: [] }
];

// Added missing MOCK_DISBURSEMENTS
export const MOCK_DISBURSEMENTS = [
    { id: 'DISB-001', expenseId: 'EXP-001', amount: 125000, date: '2024-03-14', paymentMethod: 'EFT', treasuryConfirmationId: 'TR-998122' }
];

// Added missing MOCK_SPENDING_CHAIN
export const MOCK_SPENDING_CHAIN = [
    { type: 'PR', docNumber: 'PR-10001', amount: 500000, status: 'Completed', linkedThreadId: 'TR-10001' },
    { type: 'PO', docNumber: '4500001', amount: 500000, status: 'Completed', linkedThreadId: 'TR-10001' }
];

// Fix: Added missing MOCK_ADA_VIOLATIONS
export const MOCK_ADA_VIOLATIONS: ADAViolation[] = [
    { id: 'ADA-24-001', status: 'Formal Investigation', type: '31 USC 1517(a) - Admin Control Limitation', discoveryDate: '2024-01-15', amount: 2500000, organization: 'LRL District', description: 'Over-obligation of O&M funds.' }
];

// Fix: Added missing MOCK_INVESTIGATIONS
export const MOCK_INVESTIGATIONS: ADAInvestigation[] = [
    { id: 'INV-1001', violationId: 'ADA-24-001', stage: 'Evidence Collection', startDate: '2024-01-20', suspenseDate: '2024-06-20', evidence: [], findings: [], responsibleParties: [], correctiveActions: [], legalReviewStatus: 'Pending', advanceDecisionStatus: 'Pending' }
];

// Fix: Added missing MOCK_INVESTIGATING_OFFICERS
export const MOCK_INVESTIGATING_OFFICERS: InvestigatingOfficer[] = [
    { id: 'IO-001', name: 'Mustard, Alan', rank: 'COL', organization: 'HQUSACE', fiscalLawTrainingDate: '2023-05-10', dateAppointed: '2024-01-20' }
];

// Fix: Added missing MOCK_REIMBURSABLE_AGREEMENTS
export const MOCK_REIMBURSABLE_AGREEMENTS: ReimbursableAgreement[] = [
    { id: 'AGR-1001', buyer: 'FEMA', sender: 'USACE', seller: 'USACE', gtcNumber: 'GTC-FEMA-24-001', status: 'Active', estimatedTotalValue: 5000000 }
];

// Fix: Added missing MOCK_REIMBURSABLE_ORDERS
export const MOCK_REIMBURSABLE_ORDERS: ReimbursableOrder[] = [
    { id: 'ORD-1001', agreementId: 'AGR-1001', orderNumber: 'O-24-001', authority: 'Economy Act (31 USC 1535)', amount: 1250000, billingFrequency: 'Monthly' }
];

// Fix: Added missing MOCK_PROJECT_ORDERS
export const MOCK_PROJECT_ORDERS: ProjectOrder[] = [
    { id: 'PO-1001', orderNumber: 'W912QR-24-F-001', description: 'Pump Station Overhaul', providerId: 'Tobyhanna Depot', requestingAgency: 'USACE LRL', appropriation: '96X3123', totalAmount: 850000, obligatedAmount: 850000, pricingMethod: 'Fixed Price', issueDate: '2024-01-10', completionDate: '2024-09-30', isSeverable: false, percentInHouse: 100, isSpecificDefiniteCertain: true, bonaFideNeedYear: 2024, isDoDOwned: true, isSameCommander: false, status: 'Accepted', documents: { fs7600a: 'GTC-24-001' } }
];

// Fix: Added missing MOCK_DWCF_ACCOUNTS
export const MOCK_DWCF_ACCOUNTS: DWCFAccount[] = [
    { id: 'ACC-4930', fundCode: '97X4930', accountName: 'Defense Working Capital Fund', totalCashBalance: 125000000 }
];

// Fix: Added missing MOCK_DWCF_ACTIVITIES
export const MOCK_DWCF_ACTIVITIES: DWCFActivity[] = [
    { id: 'ACT-SUP', name: 'Supply Management', collections: 45000000, disbursements: 42000000 }
];

// Fix: Added missing MOCK_DWCF_ORDERS
export const MOCK_DWCF_ORDERS: DWCFOrder[] = [
    { id: 'DWO-001', dwcfActivityId: 'ACT-SUP', customer: 'ARMY', description: 'Spare Parts Delivery', totalAmount: 1500000, status: 'Accepted' }
];

// Fix: Added missing MOCK_DWCF_BILLINGS
export const MOCK_DWCF_BILLINGS: DWCFBilling[] = [];

// Fix: Added missing MOCK_UNFUNDED_ORDERS
export const MOCK_UNFUNDED_ORDERS: UnfundedCustomerOrder[] = [];
