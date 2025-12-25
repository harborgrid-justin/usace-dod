
import { 
  Obligation, DigitalThread, BusinessRule, ProjectOrder, TransferAction, FMRVolume,
  ReimbursableAgreement, ReimbursableOrder, USACEProject, CDOCostPool, CDOTransaction,
  Asset, GLTransaction, USSGLAccount, FundControlNode, Expense, Disbursement,
  WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard,
  FADocument, WorkAllowance, PurchaseRequest, Contract, DWCFAccount, DWCFActivity,
  DWCFOrder, DWCFBilling, CIHOAccount, BudgetLineItem, POMEntry, HAPCase, LGHLease,
  InventoryItem, Vendor
} from './types';

// ... existing constants

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
    },
    { 
        id: 'OBL-002', 
        vendor: 'Global Tech Services', 
        documentNumber: 'W912QR-24-P-0045', 
        description: 'IT Hardware Refresh',
        fiscalYear: 2024,
        appropriation: '21 2020',
        programElement: '111001',
        objectClass: '31.0',
        amount: 45000, 
        disbursedAmount: 0, 
        unliquidatedAmount: 45000,
        status: 'Open', 
        date: '2024-02-10',
        lastActivityDate: '2024-02-10',
        obligationType: 'Contract',
        auditLog: []
    },
    { 
        id: 'OBL-003', 
        vendor: 'DTS', 
        documentNumber: 'TO-24-001', 
        description: 'Travel: J. Doe to DC',
        fiscalYear: 2024,
        appropriation: '21 2020',
        programElement: 'Admin',
        objectClass: '21.0',
        amount: 1500, 
        disbursedAmount: 1500, 
        unliquidatedAmount: 0,
        status: 'Closed', 
        date: '2024-01-15',
        lastActivityDate: '2024-01-20',
        obligationType: 'Travel',
        auditLog: []
    },
    { 
        id: 'OBL-004', 
        vendor: 'Unknown Vendor', 
        documentNumber: 'MIPR-23-9981', 
        description: 'Prior Year Inter-Agency Support',
        fiscalYear: 2023,
        appropriation: '21 2020',
        programElement: 'Support',
        objectClass: '25.3',
        amount: 50000, 
        disbursedAmount: 12000, 
        unliquidatedAmount: 38000,
        status: 'Dormant', 
        date: '2023-05-10',
        lastActivityDate: '2023-06-01', 
        obligationType: 'MIPR',
        auditLog: []
    },
];

export const MOCK_RISK_DISTRIBUTION = [
    { name: 'Low Risk', value: 75, color: '#10b981' },
    { name: 'Medium Risk', value: 20, color: '#f59e0b' },
    { name: 'High Risk', value: 5, color: '#ef4444' }
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
        contingencyOpId: 'OP-DESERT-SENTINEL',
        unmatchedDisb: false,
        fiarDomain: 'Procure to Pay',
        invoiceDaysPending: 10
    },
    {
        id: 'TR-10002',
        vendorName: 'Global Logistics',
        appropriation: '2020 OMA',
        unit: '2nd Brigade',
        programElement: '111002',
        costCenter: 'CC-102',
        fadNumber: 'FAD-24-002',
        vendorUEI: 'UEI-987654321',
        contractVehicle: 'Fixed Price',
        miprReference: 'N/A',
        socioEconomicStatus: 'Large Business',
        obligationAmt: 250000,
        disbursementAmt: 200000,
        unliquidatedAmt: 50000,
        tasSymbol: '021 2020',
        eftStatus: 'Pending',
        supplyClass: 'Class I',
        niinNsn: '9876-54-321',
        serialNumber: 'SN-002',
        uicCode: 'W67890',
        readinessImpact: 'Medium',
        bonaFideValid: true,
        berryCompliant: true,
        ppaInterestRisk: true,
        capId: 'CAP-002',
        auditFindingId: 'AF-PAY-001',
        gl1010: '$200,000',
        gaapStandard: 'SFFAS 4',
        controlObjective: 'Valid',
        blockchainHash: 'f6e5d4c3b2a1',
        unmatchedDisb: true,
        fiarDomain: 'Procure to Pay',
        invoiceDaysPending: 45
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
    children: [
        {
            id: 'ARMY-ROOT',
            parentId: 'DOD-ROOT',
            name: 'Department of the Army',
            level: 'Allotment',
            totalAuthority: 185000000000,
            amountDistributed: 185000000000,
            amountCommitted: 0,
            amountObligated: 165000000000,
            amountExpended: 140000000000,
            isCMA: false,
            children: [
                { id: 'FORSCOM', parentId: 'ARMY-ROOT', name: 'Forces Command', level: 'Allocation', totalAuthority: 42000000000, amountDistributed: 42000000000, amountCommitted: 0, amountObligated: 38000000000, amountExpended: 35000000000, isCMA: false },
                { id: 'TRADOC', parentId: 'ARMY-ROOT', name: 'Training & Doctrine', level: 'Allocation', totalAuthority: 12000000000, amountDistributed: 12000000000, amountCommitted: 0, amountObligated: 11500000000, amountExpended: 10000000000, isCMA: false },
                { id: 'AMC', parentId: 'ARMY-ROOT', name: 'Army Materiel Command', level: 'Allocation', totalAuthority: 28000000000, amountDistributed: 28000000000, amountCommitted: 0, amountObligated: 25000000000, amountExpended: 20000000000, isCMA: false },
                { 
                    id: 'USACE', 
                    parentId: 'ARMY-ROOT',
                    name: 'Corps of Engineers', 
                    level: 'Allocation',
                    totalAuthority: 7200000000, 
                    amountDistributed: 7200000000,
                    amountCommitted: 0,
                    amountObligated: 6800000000,
                    amountExpended: 6000000000,
                    isCMA: false,
                    children: [
                        { id: 'HAPMIS', parentId: 'USACE', name: 'HAPMIS Program', level: 'Suballocation', totalAuthority: 185000000, amountDistributed: 185000000, amountCommitted: 0, amountObligated: 150000000, amountExpended: 140000000, isCMA: false }
                    ]
                }
            ]
        },
        {
            id: 'OSD-ROOT',
            parentId: 'DOD-ROOT',
            name: 'Office of the Secretary of Defense',
            level: 'Allotment',
            totalAuthority: 50000000000,
            amountDistributed: 50000000000,
            amountCommitted: 0,
            amountObligated: 45000000000,
            amountExpended: 40000000000,
            isCMA: false,
            children: [
                { id: 'OSD-BRAC', parentId: 'OSD-ROOT', name: 'Base Realignment & Closure', level: 'Allocation', totalAuthority: 450000000, amountDistributed: 450000000, amountCommitted: 0, amountObligated: 380000000, amountExpended: 300000000, isCMA: false },
                { id: 'OSD-HAP', parentId: 'OSD-ROOT', name: 'Homeowners Assistance', level: 'Allocation', totalAuthority: 120000000, amountDistributed: 120000000, amountCommitted: 0, amountObligated: 90000000, amountExpended: 80000000, isCMA: false },
                { id: 'OSD-LGH', parentId: 'OSD-ROOT', name: 'Leased Government Housing', level: 'Allocation', totalAuthority: 85000000, amountDistributed: 85000000, amountCommitted: 0, amountObligated: 80000000, amountExpended: 75000000, isCMA: false }
            ]
        }
    ]
} as any as FundControlNode; // Temporary cast to match CommandNode usage in UI which is similar but simplified

export const MOCK_APPROPRIATIONS = [
    { id: 'APP-001', commandId: 'USACE', name: 'Civil Works Fund', totalAuthority: 7200000000, distributions: [] },
    { id: 'APP-002', commandId: 'FORSCOM', name: 'Operations & Maintenance, Army', totalAuthority: 42000000000, distributions: [] },
    { id: 'APP-003', commandId: 'OSD-BRAC', name: 'BRAC Closure Fund', totalAuthority: 450000000, distributions: [] }
];

export const FIAR_CONTROLS = [
    { id: 'FC-001', name: 'Fund Balance with Treasury', status: 'PASS', score: 98 },
    { id: 'FC-002', name: 'Appropriations Received', status: 'PASS', score: 100 },
    { id: 'FC-003', name: 'Accounts Receivable', status: 'FAIL', score: 82 },
    { id: 'FC-004', name: 'Accounts Payable', status: 'PASS', score: 95 }
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
        conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 1000000 }], // Mock condition
        citation: '31 U.S.C. 1341'
    },
    { 
        id: 'R-PAY-002', 
        name: 'Prompt Payment Act', 
        code: 'PAY-002',
        description: 'Invoices must be paid within 30 days of receipt.',
        severity: 'Warning',
        logicString: 'IF invoice_age > 30 THEN INTEREST_PENALTY',
        domain: 'Disbursement',
        isActive: true,
        conditions: [{ field: 'invoiceDaysPending', operator: 'GREATER_THAN', value: 30 }],
        citation: '31 U.S.C. 3901'
    },
    {
        id: 'R-DWCF-003',
        name: 'Advance Billing Restriction',
        code: 'DWCF-003',
        description: 'Advance billing requires OUSD(C) waiver.',
        severity: 'Warning',
        logicString: 'IF isAdvanceBilling == TRUE THEN REQUIRE_WAIVER',
        domain: 'Revolving Funds',
        isActive: true,
        conditions: [{ field: 'isAdvanceBilling', operator: 'IS_TRUE', value: true }],
        citation: '10 U.S.C. 2208(l)'
    },
    {
        id: 'R-PO-001',
        name: 'Project Order Severability',
        code: 'PO-001',
        description: 'Project orders must be for non-severable requirements.',
        severity: 'Critical',
        logicString: 'IF isSeverable == TRUE THEN REJECT_PO',
        domain: 'Reimbursables',
        isActive: true,
        conditions: [{ field: 'isSeverable', operator: 'IS_TRUE', value: true }],
        citation: '41 U.S.C. 6307'
    }
];

export const MOCK_EXECUTION_DATA = [
    { month: 'Oct', planned: 8.3, actual: 8.5 },
    { month: 'Nov', planned: 16.6, actual: 17.2 },
    { month: 'Dec', planned: 25.0, actual: 24.8 },
    { month: 'Jan', planned: 33.3, actual: 33.5 },
    { month: 'Feb', planned: 41.6, actual: 42.1 },
    { month: 'Mar', planned: 50.0, actual: 49.8 }
];

export const MOCK_AUDIT_FINDINGS = [
    { id: 'AF-001', severity: 'Material Weakness', description: 'Lack of segregation of duties in GPC program.', linkedTransactionIds: ['TR-10002'] },
    { id: 'AF-002', severity: 'Significant Deficiency', description: 'Incomplete documentation for travel vouchers.', linkedTransactionIds: ['TR-10001'] }
];

export const DOD_FMR_VOLUMES: FMRVolume[] = [
    { id: 'V1', volume: 'Volume 1', title: 'General Financial Management Information, Systems, and Requirements', category: 'Policy', sizeMB: 2.5, pages: 150 },
    { id: 'V2A', volume: 'Volume 2A', title: 'Budget Formulation and Presentation', category: 'Budget', sizeMB: 4.2, pages: 320 },
    { id: 'V2B', volume: 'Volume 2B', title: 'Budget Formulation and Presentation (Chapters 4-19)', category: 'Budget', sizeMB: 5.1, pages: 410 },
    { id: 'V3', volume: 'Volume 3', title: 'Budget Execution - Availability and Use of Budgetary Resources', category: 'Budget', sizeMB: 3.8, pages: 280 },
    { id: 'V4', volume: 'Volume 4', title: 'Accounting Policy', category: 'Accounting', sizeMB: 3.5, pages: 250 },
    { id: 'V5', volume: 'Volume 5', title: 'Disbursing Policy', category: 'Pay', sizeMB: 4.0, pages: 300 },
    { id: 'V11A', volume: 'Volume 11A', title: 'Reimbursable Operations Policy', category: 'Policy', sizeMB: 2.8, pages: 180 },
    { id: 'V11B', volume: 'Volume 11B', title: 'Reimbursable Operations Policy - Working Capital Funds', category: 'Policy', sizeMB: 3.1, pages: 210 },
    { id: 'V12_CH23', volume: 'Volume 12, Ch 23', title: 'Contingency Operations', category: 'Accounting', sizeMB: 1.2, pages: 45 },
    { id: 'V14', volume: 'Volume 14', title: 'Administrative Control of Funds and Antideficiency Act Violations', category: 'Funds', sizeMB: 2.2, pages: 160 }
];

export const POM_PHASES = [
    { year: 2026, phase: 'Planning', progress: 100, status: 'Completed' },
    { year: 2026, phase: 'Programming', progress: 85, status: 'In Progress' },
    { year: 2026, phase: 'Budgeting', progress: 10, status: 'Pending' },
    { year: 2026, phase: 'Execution', progress: 0, status: 'Future' }
];

export const MOCK_TRANSFERS: TransferAction[] = [
    {
        id: 'TRF-24-001',
        fromAccount: '2020 OMA',
        toAccount: '2040 RDTE',
        amount: 5000000,
        authorityType: 'General Transfer Authority (GTA)',
        legalCitation: 'Sec. 8005, PL 117-XXX',
        justification: 'Emerging requirement for counter-UAS technology.',
        isHigherPriority: true,
        isUnforeseen: true,
        currentStage: 'OMB Approval',
        dates: { initiated: '2024-02-15' },
        documents: { dd1415: true }
    }
];

export const MOCK_IDOCS = [
    { id: 'IDOC-001', status: 'Success', direction: 'Inbound', partner: 'WAWF', messageType: 'INVOIC', timestamp: '2024-03-15 10:30:00' },
    { id: 'IDOC-002', status: 'Warning', direction: 'Outbound', partner: 'G-Invoicing', messageType: 'ORDCHG', timestamp: '2024-03-15 11:15:00' },
    { id: 'IDOC-003', status: 'Error', direction: 'Inbound', partner: 'SPS', messageType: 'PORDCR', timestamp: '2024-03-14 16:45:00' }
];

export const MOCK_DEPOSIT_FUNDS = [
    { 
        id: 'DF-001', 
        accountName: 'Withheld State and Local Taxes', 
        treasuryIndex: '97X6275', 
        responsibleComponent: 'DFAS', 
        currentBalance: 15420000, 
        statutoryAuthorization: '31 U.S.C. 3513',
        auditRequirement: 'Annual',
        quarterlyReviews: { Q1: 'Completed', Q2: 'Pending', Q3: 'N/A', Q4: 'N/A' },
        audits: [{ id: 'AUD-001', type: 'Internal', auditor: 'J. Smith', date: '2023-12-15', outcome: 'Passed', findingsSummary: 'No discrepancies found.' }]
    },
    { 
        id: 'DF-002', 
        accountName: 'Bid Guarantees', 
        treasuryIndex: '97X6500', 
        responsibleComponent: 'USACE', 
        currentBalance: 250000, 
        statutoryAuthorization: 'Armed Services Procurement Reg.',
        auditRequirement: 'Semi-Annual',
        quarterlyReviews: { Q1: 'Completed', Q2: 'Action Required', Q3: 'N/A', Q4: 'N/A' },
        audits: []
    }
];

export const MOCK_LIABILITY_TRANSACTIONS = [
    { id: 'TX-L-001', depositFundId: 'DF-001', source: 'Payroll Cycle 05', description: 'State Tax Withholding (CA)', amount: 125000, status: 'Held' },
    { id: 'TX-L-002', depositFundId: 'DF-001', source: 'Payroll Cycle 05', description: 'SALT Withholding (NY)', amount: 85000, status: 'Held' },
    { id: 'TX-L-003', depositFundId: 'DF-002', source: 'Contractor Bid', description: 'Bid Bond - Project 123', amount: 50000, status: 'Held' }
];

export const MOCK_DWCF_ACCOUNTS = [
    { id: '97X4930', name: 'DWCF - Army', totalCashBalance: 1250000000 },
    { id: '97X4930.002', name: 'DWCF - Navy', totalCashBalance: 980000000 }
];

export const MOCK_DWCF_ACTIVITIES = [
    { id: 'ACT-SUP', name: 'Supply Management', collections: 45000000, disbursements: 42000000 },
    { id: 'ACT-IND', name: 'Industrial Operations', collections: 82000000, disbursements: 85000000 }
];

export const MOCK_DWCF_ORDERS = [
    { id: 'ORD-001', customer: 'FORSCOM', description: 'Spare Parts - M1 Abrams', totalAmount: 1500000, status: 'In Process', dwcfActivityId: 'ACT-SUP' },
    { id: 'ORD-002', customer: 'TRADOC', description: 'Training Aids Maintenance', totalAmount: 500000, status: 'Complete', dwcfActivityId: 'ACT-IND' }
];

export const MOCK_DWCF_BILLINGS = [
    { id: 'BILL-001', orderId: 'ORD-001', status: 'Paid', total: 250000, billingDate: '2023-11-30', isAdvanceBilling: false },
    { id: 'BILL-002', orderId: 'ORD-001', status: 'Sent', total: 150000, billingDate: '2023-12-31', isAdvanceBilling: false }
];

export const MOCK_CIHO_ACCOUNTS = [
    { 
        id: 'CIHO-001', 
        tafs: '97 1109', 
        component: 'Disbursing Station 5591', 
        balance: 25000, 
        lastReconciliationDate: '2024-02-28', 
        cashHoldingAuthorityMemo: 'Memo-2023-05',
        audits: [{ id: 'AUD-C-001', type: 'Surprise', auditor: 'DO', date: '2024-01-15', outcome: 'Passed' }] 
    }
];

export const MOCK_CIHO_TRANSACTIONS = [
    { id: 'TX-C-001', cihoAccountId: 'CIHO-001', date: '2024-03-01', type: 'Collection', amount: 500, description: 'Over-the-counter Collection' },
    { id: 'TX-C-002', cihoAccountId: 'CIHO-001', date: '2024-03-05', type: 'Disbursement', amount: -1200, description: 'Emergency Cash Payment' }
];

export const MOCK_CASH_AUDITS = [
    { id: 'AUD-C-001', outcome: 'Passed', type: 'Surprise', auditor: 'DO', date: '2024-01-15', findingsSummary: 'Count matched system balance.' }
];

export const MOCK_FBWT_CASES = [
    { id: 'CASE-001', type: 'Statement of Difference (SOD)', tas: '21 2020', amount: 50000, age: 45, assignedTo: 'J. Smith', status: 'Open', linkedThreadId: 'TR-10002' },
    { id: 'CASE-002', type: 'Check Issue Discrepancy', tas: '97 4930', amount: 1200, age: 15, assignedTo: 'A. Johnson', status: 'In-Research' }
];

export const MOCK_SCORECARD_DATA = [
    { metric: 'Timeliness', status: 'Green', details: 'All SF-224s submitted by T+3.' },
    { metric: 'Accuracy', status: 'Yellow', details: '2 SODs > 60 days old.' },
    { metric: 'Aging', status: 'Green', details: '95% of items resolved < 30 days.' },
    { metric: 'Completeness', status: 'Green', details: 'No missing suspense items.' }
];

export const MOCK_FBWT_TRANSACTIONS = [
    { id: 'TX-F-001', type: 'Deposit', amount: 1500000, tas: '21 2020', programType: 'Appropriated' },
    { id: 'TX-F-002', type: 'Voucher Payment', amount: -45000, tas: '21 2020', programType: 'Appropriated' }
];

export const MOCK_CONTINGENCY_OPERATIONS = [
    {
        id: 'OP-SENTINEL',
        name: 'Operation Sentinel Freedom',
        status: 'Active',
        type: 'Overseas Contingency Operation (OCO)',
        location: 'USCENTCOM AOR',
        personnelDeployed: 1250,
        executeOrderRef: 'EXORD-23-005',
        sfisCode: 'COST-005',
        cjcsProjectCode: '991',
        justificationMaterials: { 'Exhibit OP-5': 'Approved', 'J-Book': 'Submitted' },
        incrementalCosts: { personnel: 15000000, operatingSupport: 25000000, investment: 5000000, retrograde: 2000000, reset: 1000000 },
        billableIncrementalCosts: 48000000,
        reimbursement: { billed: 45000000, received: 40000000 },
        fundingSource: 'OCOTF',
        isBaseFunded: false,
        linkedThreadIds: ['TR-10001', 'TR-10002'],
        baselineCosts: 10000000,
        costOffsets: [{ name: 'Home Station Training', amount: 2000000 }],
        incrementalCostsBreakdown: [{ id: '1.0', name: 'Personnel', description: 'Danger Pay, IDP', isApplicable: true, cost: 15000000 }],
        estimates: {
            preDeployment: { cost: 12000000 },
            budget: { cost: 45000000 },
            working: { cost: 48000000 }
        }
    },
    {
        id: 'OP-HA-RELIEF',
        name: 'Humanitarian Relief - Region X',
        status: 'Active',
        type: 'Humanitarian Assistance',
        location: 'Region X',
        personnelDeployed: 200,
        executeOrderRef: 'EXORD-24-001',
        sfisCode: 'COST-009',
        cjcsProjectCode: '882',
        justificationMaterials: {},
        incrementalCosts: { personnel: 2000000, operatingSupport: 5000000, investment: 0, retrograde: 0, reset: 0 },
        billableIncrementalCosts: 7000000,
        reimbursement: { billed: 0, received: 0 },
        fundingSource: 'OHDACA',
        isBaseFunded: false,
        endDate: '2024-06-30',
        ohdacaDetails: { fadNumber: 'FAD-OHD-001', dscaFunding: 10000000, reimbursementRequests: [] },
        linkedThreadIds: [],
        baselineCosts: 0,
        costOffsets: [],
        incrementalCostsBreakdown: [],
        estimates: {
            preDeployment: { cost: 2000000 },
            budget: { cost: 8000000 },
            working: { cost: 7500000 }
        }
    }
];

export const MOCK_O_AND_M_APPROPRIATIONS = [
    {
        id: 'OMA',
        appropriationCode: '2020',
        name: 'Operation & Maintenance, Army',
        budgetActivities: [
            {
                id: 'BA1',
                name: 'Operating Forces',
                activityGroups: [
                    {
                        id: 'AG11',
                        name: 'Land Forces',
                        subActivityGroups: [
                            { id: 'SAG111', name: 'Maneuver Units', budget: 1250000000, priceChange: 45000000, programChange: 12000000 },
                            { id: 'SAG112', name: 'Modular Support Brigades', budget: 450000000, priceChange: 15000000, programChange: -5000000 }
                        ]
                    }
                ]
            }
        ]
    }
];

export const MOCK_UNFUNDED_ORDERS = [
    { id: 'ORD-UF-001', customer: 'DLA Energy', amount: 250000, status: 'Requires Notification', notificationTimestamp: 0 },
    { id: 'ORD-UF-002', customer: 'Navy MSC', amount: 1500000, status: 'Pending OUSD(C)', notificationTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 }
];

export const MOCK_ADA_VIOLATIONS = [
    { id: 'ADA-23-001', status: 'Formal Investigation', type: '31 USC 1517(a) - Admin Control Limitation', discoveryDate: '2023-11-15', amount: 150000, organization: 'FORSCOM', description: 'Over-obligation of quarterly allotment due to failure to record contract mod.' }
];

export const MOCK_INVESTIGATIONS = [
    {
        id: 'INV-001',
        violationId: 'ADA-23-001',
        stage: 'Evidence Collection',
        investigatingOfficer: { id: 'IO-001', name: 'COL Smith', rank: 'COL', organization: 'TRADOC', fiscalLawTrainingDate: '2023-01-10', hasConflict: false },
        startDate: '2023-12-01',
        suspenseDate: '2024-03-01',
        evidence: [{ id: 'EV-001', description: 'Fund Status Report', source: 'GFEBS', supportsConclusion: true, dateCollected: '2023-12-05' }],
        findings: ['Funds were exceeded on 15 Nov 2023.'],
        responsibleParties: [{ id: 'RP-001', name: 'Maj. Jones', position: 'Budget Officer', involvementDescription: 'Certified funds without checking balance.', proximateCauseAnalysis: 'Negligence', rebuttalReceived: false, isConfirmed: false }],
        correctiveActions: ['Retrain staff on fund control.', 'Update SOP.'],
        legalReviewStatus: 'Pending',
        advanceDecisionStatus: 'N/A'
    }
];

export const MOCK_INVESTIGATING_OFFICERS = [
    { id: 'IO-001', name: 'Smith, James', rank: 'COL', organization: 'TRADOC', fiscalLawTrainingDate: '2023-01-10', hasConflict: false },
    { id: 'IO-002', name: 'Doe, Sarah', rank: 'LTC', organization: 'FORSCOM', fiscalLawTrainingDate: '2020-05-15', hasConflict: true } // Expired training example
];

export const MOCK_REIMBURSABLE_AGREEMENTS = [
    { id: 'AGR-24-001', buyer: 'FEMA', seller: 'USACE', gtcNumber: 'GTC-24-FEMA-01', status: 'Active', estimatedTotalValue: 5000000 },
    { id: 'AGR-24-002', buyer: 'USAF', seller: 'Army Depot', gtcNumber: 'GTC-24-USAF-99', status: 'Pending', estimatedTotalValue: 1200000 }
];

export const MOCK_REIMBURSABLE_ORDERS = [
    { id: 'ORD-24-101', agreementId: 'AGR-24-001', orderNumber: 'FEMA-24-F-005', authority: 'Economy Act', amount: 250000, billingFrequency: 'Monthly' }
];

export const MOCK_PROJECT_ORDERS = [
    {
        id: 'PO-24-001',
        orderNumber: 'N00024-24-F-1234',
        description: 'Overhaul of Generator Set',
        providerId: 'Tobyhanna Army Depot',
        requestingAgency: 'NAVSEA',
        appropriation: '97 1109',
        totalAmount: 1500000,
        obligatedAmount: 1500000,
        pricingMethod: 'Fixed Price',
        issueDate: '2023-10-15',
        completionDate: '2024-09-30',
        isSeverable: false,
        percentInHouse: 85,
        isSpecificDefiniteCertain: true,
        bonaFideNeedYear: 2024,
        isDoDOwned: true,
        isSameCommander: false,
        status: 'Work In Progress',
        documents: { fs7600a: 'GTC-24-NAV-01' }
    }
];

export const MOCK_USACE_PROJECTS: USACEProject[] = [
    {
        id: 'PROJ-001',
        name: 'Ohio River Lock & Dam Replacement',
        district: 'LRL - Louisville',
        p2Number: '123456',
        programType: 'Civil Works',
        financials: { currentWorkingEstimate: 125000000, obligated: 45000000, programmed: 50000000, disbursed: 30000000, prc_committed: 2000000 },
        p2Linkage: true,
        costShare: { sponsorName: 'Ohio River Basin Commission', nonFederalShare: 35, federalShare: 65, totalContributed: 15750000, balanceDue: 2000000 },
        cwisCode: '012345',
        milestones: [{ description: 'Award Construction Contract', code: 'CW100', scheduledDate: '2023-11-01', status: 'Complete' }],
        risks: [{ id: 'R1', category: 'Cost', impact: 'High', description: 'Steel price escalation', mitigationStrategy: 'Advance purchase' }]
    },
    {
        id: 'PROJ-002',
        name: 'Fort Knox Barracks Renovation',
        district: 'LRL - Louisville',
        p2Number: '987654',
        programType: 'Military Programs',
        financials: { currentWorkingEstimate: 25000000, obligated: 24500000, programmed: 25000000, disbursed: 20000000, prc_committed: 500000, contractRetainage: 1200000 },
        p2Linkage: true,
        contractMods: [{ modNumber: 'P00001', amount: 50000, description: 'Change flooring', reason: 'User Request', date: '2024-01-15' }]
    }
];

export const MOCK_CDO_POOLS = [
    { id: 'POOL-01', functionName: 'Engineering', orgCode: 'ED', fyBudget: 12000000, obligated: 4500000, currentRate: 18.5, status: 'Active' },
    { id: 'POOL-02', functionName: 'Operations', orgCode: 'OD', fyBudget: 8500000, obligated: 7200000, currentRate: 22.0, status: 'Active' } // High utilization example
];

export const MOCK_CDO_TRANSACTIONS = [
    { id: 'TX-CDO-001', date: '2024-03-10', type: 'Labor', amount: 1250.00, description: 'Design Review Support', function: 'Engineering', employeeId: 'E-1001', hours: 12 }
];

export const MOCK_ASSETS = [
    { 
        id: 'ASSET-001', 
        name: 'Dredge Potter', 
        type: 'PRIP', 
        assetClass: 'Vessel', 
        status: 'In Service', 
        acquisitionCost: 25000000, 
        residualValue: 2000000, 
        usefulLife: 30, 
        pripAuthorized: true, 
        plantIncrementWaiver: { active: false }, 
        components: [], 
        accumulatedDepreciation: 5000000, 
        auditLog: [],
        placedInServiceDate: '2018-06-01'
    },
    { 
        id: 'ASSET-002', 
        name: 'Mobile Crane - 50 Ton', 
        type: 'Revolving Fund', 
        assetClass: 'Equipment', 
        status: 'In Service', 
        acquisitionCost: 850000, 
        residualValue: 50000, 
        usefulLife: 15, 
        pripAuthorized: false, 
        plantIncrementWaiver: { active: false }, 
        components: [], 
        accumulatedDepreciation: 120000, 
        auditLog: [],
        placedInServiceDate: '2021-03-15'
    }
];

export const MOCK_GL_TRANSACTIONS = [
    {
        id: 'GL-10001',
        date: '2024-03-15',
        description: 'Vendor Payment - Acme Corp',
        type: 'Disbursement',
        sourceModule: 'AP',
        referenceDoc: 'INV-9912',
        totalAmount: 15000,
        status: 'Posted',
        createdBy: 'SYSTEM',
        lines: [
            { ussglAccount: '211000', description: 'Accounts Payable', debit: 15000, credit: 0, fund: '0100', costCenter: 'CC-101' },
            { ussglAccount: '101000', description: 'FBwT', debit: 0, credit: 15000, fund: '0100', costCenter: 'CC-101' }
        ],
        auditLog: []
    }
];

export const MOCK_USSGL_ACCOUNTS = [
    { accountNumber: '101000', description: 'Fund Balance With Treasury', category: 'Asset', normalBalance: 'Debit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '211000', description: 'Accounts Payable', category: 'Liability', normalBalance: 'Credit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '310000', description: 'Unexpended Appropriations', category: 'Net Position', normalBalance: 'Credit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '461000', description: 'Allotments - Realized Resources', category: 'Budgetary', normalBalance: 'Debit', financialStatement: 'SBR', isActive: true },
    { accountNumber: '480100', description: 'Undelivered Orders - Obligations, Unpaid', category: 'Budgetary', normalBalance: 'Debit', financialStatement: 'SBR', isActive: true },
    { accountNumber: '610000', description: 'Operating Expenses', category: 'Expense', normalBalance: 'Debit', financialStatement: 'SNC', isActive: true }
];

export const MOCK_FUND_HIERARCHY: FundControlNode[] = [
    {
        id: 'OMB-CW-24',
        parentId: null,
        name: 'OMB Apportionment - Civil Works FY24',
        level: 'Apportionment',
        totalAuthority: 7200000000,
        amountDistributed: 7200000000,
        amountCommitted: 0,
        amountObligated: 0,
        amountExpended: 0,
        isCMA: false,
        children: [
            {
                id: 'USACE-HQ-CW-24',
                parentId: 'OMB-CW-24',
                name: 'HQ USACE Allocation',
                level: 'Allocation',
                totalAuthority: 7200000000,
                amountDistributed: 6800000000,
                amountCommitted: 0,
                amountObligated: 0,
                amountExpended: 0,
                isCMA: false,
                children: [
                    {
                        id: 'LRL-DISTRICT-24',
                        parentId: 'USACE-HQ-CW-24',
                        name: 'Louisville District (LRL)',
                        level: 'Allotment',
                        totalAuthority: 450000000,
                        amountDistributed: 445000000,
                        amountCommitted: 400000000,
                        amountObligated: 350000000,
                        amountExpended: 200000000,
                        isCMA: false
                    },
                    {
                        id: 'SAJ-DISTRICT-24',
                        parentId: 'USACE-HQ-CW-24',
                        name: 'Jacksonville District (SAJ)',
                        level: 'Allotment',
                        totalAuthority: 380000000,
                        amountDistributed: 380000000,
                        amountCommitted: 375000000, // Warning Level
                        amountObligated: 300000000,
                        amountExpended: 150000000,
                        isCMA: false
                    }
                ]
            }
        ]
    }
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', obligationId: 'OBL-001', amount: 50000, date: '2024-02-15', description: 'Invoice #101 - Progress Payment', source: 'Contract', status: 'Accrued', createdBy: 'Clerk', auditLog: [] },
    { id: 'EXP-002', obligationId: 'OBL-001', amount: 25000, date: '2024-03-01', description: 'Invoice #102 - Materials', source: 'Contract', status: 'Pending Approval', createdBy: 'Clerk', auditLog: [] }
];

export const MOCK_DISBURSEMENTS: Disbursement[] = [
    { id: 'DISB-001', expenseId: 'EXP-001', amount: 50000, date: '2024-02-20', paymentMethod: 'EFT', treasuryConfirmationId: 'T-2024-9912' }
];

export const MOCK_WWP_SCENARIOS: WorkforceScenario[] = [
    { id: 'SCN-BASE-24', name: 'FY24 Baseline Execution', fiscalYear: 2024, isBaseline: true, status: 'Active', auditLog: [], workloadItemIds: ['WL-001', 'WL-002'], workforcePlanIds: ['WP-LRL-ED'] },
    { id: 'SCN-SURGE-24', name: 'FY24 Disaster Surge', fiscalYear: 2024, isBaseline: false, status: 'Draft', auditLog: [], workloadItemIds: ['WL-001', 'WL-002', 'WL-003'], workforcePlanIds: ['WP-LRL-ED'] }
];

export const MOCK_WWP_WORKLOAD_ITEMS: WorkloadItem[] = [
    { id: 'WL-001', projectId: 'PROJ-001', name: 'Design Review - Phase 1', workloadType: 'Engineering', unit: 'Drawing Sets', quantity: 450 },
    { id: 'WL-002', projectId: 'PROJ-001', name: 'Site Inspections', workloadType: 'Construction', unit: 'Site Visits', quantity: 52 },
    { id: 'WL-003', projectId: 'PROJ-002', name: 'Emergency Damage Assessment', workloadType: 'Engineering', unit: 'Reports', quantity: 25 }
];

export const MOCK_WWP_WORKFORCE_PLANS: WorkforcePlan[] = [
    { 
        id: 'WP-LRL-ED', 
        organization: 'LRL-ED (Engineering Div)', 
        functionalArea: 'Civil Design', 
        entries: [
            { laborCategory: 'Engineer', fundedFTE: 12.5, unfundedFTE: 0.0 },
            { laborCategory: 'Technician', fundedFTE: 4.0, unfundedFTE: 1.0 },
            { laborCategory: 'Admin', fundedFTE: 1.0, unfundedFTE: 0.5 }
        ]
    }
];

export const MOCK_WWP_LABOR_RATES: LaborRate[] = [
    { laborCategory: 'Engineer', rate: 85.50 },
    { laborCategory: 'Scientist', rate: 92.00 },
    { laborCategory: 'Technician', rate: 65.00 },
    { laborCategory: 'Admin', rate: 45.00 },
    { laborCategory: 'Project Manager', rate: 110.00 }
];

export const MOCK_WWP_LABOR_STANDARDS: LaborStandard[] = [
    { workloadUnit: 'Drawing Sets', laborCategory: 'Engineer', hoursPerUnit: 4.0 },
    { workloadUnit: 'Site Visits', laborCategory: 'Technician', hoursPerUnit: 6.0 },
    { workloadUnit: 'Reports', laborCategory: 'Engineer', hoursPerUnit: 8.0 }
];

export const MOCK_SPENDING_CHAIN = [
    { type: 'PR', docNumber: '10005521', amount: 45000, status: 'Released', linkedThreadId: 'TR-10001' },
    { type: 'PO', docNumber: '45000021', amount: 45000, status: 'Ordered', linkedThreadId: 'TR-10001' },
    { type: 'GR', docNumber: '50001192', amount: 45000, status: 'Received', linkedThreadId: 'TR-10001' },
    { type: 'IR', docNumber: '51002233', amount: 45000, status: 'Blocked', linkedThreadId: 'TR-10001' } // Invoice Blocked example
];

export const ERP_TCODES = [
    { code: '/nME21N', description: 'Create Purchase Order', module: 'MM', riskLevel: 'Medium' },
    { code: '/nFB50', description: 'Enter G/L Account Document', module: 'FI', riskLevel: 'High' },
    { code: '/nCJ20N', description: 'Project Builder', module: 'PS', riskLevel: 'Low' },
    { code: '/nVA01', description: 'Create Sales Order', module: 'SD', riskLevel: 'Medium' }
];

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'INV-001', name: 'Air Filter 20x20x1', sku: 'FIL-20201', category: 'HVAC', location: 'Whse A-12', quantityOnHand: 45, reorderPoint: 10, unitOfMeasure: 'EA', unitCost: 12.50, transactions: [] },
    { id: 'INV-002', name: 'V-Belt B42', sku: 'BLT-B42', category: 'Mechanical', location: 'Whse B-05', quantityOnHand: 5, reorderPoint: 8, unitOfMeasure: 'EA', unitCost: 18.00, transactions: [] }
];

export const MOCK_VENDORS: Vendor[] = [
    { id: 'V-001', name: 'Grainger', serviceType: 'Materials' },
    { id: 'V-002', name: 'Johnson Controls', serviceType: 'HVAC Services' }
];

export const MOCK_FADS: FADocument[] = [
    { id: 'FAD-CW-24-001', appropriationSymbol: '96X3122', programYear: 2024, publicLaw: 'PL 118-XX', totalAuthority: 50000000, fundType: 'Direct', auditLog: [] }
];

export const MOCK_WORK_ALLOWANCES: WorkAllowance[] = [
    { id: 'WA-LRL-24-A', fadId: 'FAD-CW-24-001', districtEROC: 'LRL', p2ProgramCode: '111222', ppa: 'Construction', congressionalLineItem: 'Ohio River', ccsCode: '111', amount: 5000000, obligatedAmount: 1200000, status: 'Active', auditLog: [] }
];

export const MOCK_PURCHASE_REQUESTS = [
    { id: 'PR-24-001', description: 'Base Security Services', amount: 1200000, requester: 'LRL-SEC', date: '2023-10-01', status: 'Funds Certified', appropriation: '2020 OMA' },
    { id: 'PR-24-002', description: 'IT Laptop Refresh', amount: 45000, requester: 'LRL-G6', date: '2023-10-15', status: 'Pending Certification', appropriation: '2020 OMA' }
];

export const MOCK_CONTRACTS_LIST = [
    { id: 'W912QR-24-C-0001', vendor: 'V-NEX SOLUTIONS', type: 'Firm Fixed Price', value: 1200000, awardedDate: '2023-11-01', status: 'Active' },
    { id: 'W912QR-24-P-0015', vendor: 'DELL FED SYSTEMS', type: 'Purchase Order', value: 45000, awardedDate: '2023-11-20', status: 'Completed' }
];

export const REIMBURSABLE_RATES = {
    assetUseCharge: 0.04,
    unfundedCivRetirement: 0.18,
    postRetirementHealth: 0.065,
    contractAdminCharge: 0.03,
    milLaborAcceleration: 0.15
};

export const MOCK_POM_ENTRIES: POMEntry[] = [
    { projectId: '123456', projectName: 'Ohio River Lock Replacement', businessLine: 'Navigation', fy1: 50000000, fy2: 120000000, fy3: 150000000, fy4: 80000000, fy5: 20000000 },
    { projectId: '987654', projectName: 'Fort Knox Barracks', businessLine: 'Recreation', fy1: 25000000, fy2: 0, fy3: 0, fy4: 0, fy5: 0 }
];

export const MOCK_BUDGET_LINE_ITEMS: BudgetLineItem[] = [
    { id: 'BL-001', projectId: '123456', projectName: 'Ohio River Lock Replacement', businessLine: 'Navigation', fiscalYear: 2026, capabilityLevel: 'Capability 1', objectClass: '32.0 - Land & Structures', amount: 50000000, justification: 'Critical infrastructure failure risk.', status: 'Approved - HQ', isInflationAdjusted: true, lastModified: '2024-03-01' }
];

export const MOCK_HAP_CASES: HAPCase[] = [
    { id: 'HAP-24-001', applicantName: 'SGT John Doe', propertyAddress: '123 Pine St, Killeen, TX', programType: 'Expanded HAP', submissionDate: '2024-02-01', status: 'Benefit Calculation', purchasePrice: 250000, purchaseDate: '2019-06-15', mortgageBalance: 240000, currentFairMarketValue: 210000, benefitAmount: 0, applicantType: 'Military - PCS', pcsOrderDate: '2024-01-10', assignedOfficer: 'J. Smith' }
];

export const MOCK_LGH_LEASES: LGHLease[] = [
    { id: 'L-001', leaseNumber: 'DACA-01-20-L-0055', propertyName: 'Sunset Apartments', address: '4500 Sunset Blvd, Los Angeles, CA', lessor: 'Sunset Prop Mgmt', annualRent: 1200000, startDate: '2020-10-01', expirationDate: '2025-09-30', status: 'Active', occupancyRate: 98, units: 50, scoring: 'Operating', fairMarketValue: 15000000, auditLog: [] }
];
