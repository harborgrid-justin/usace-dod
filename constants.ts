import { BusinessRule, FundControlLevel, Appropriation, ReimbursableAgreement, ReimbursableOrder, DWCFAccount, DWCFActivity, DWCFOrder, DWCFBilling, UnfundedCustomerOrder, USACEProject, CDOCostPool, CDOTransaction, Solicitation, EncroachmentCase, CostShareRecord, RelocationCase, GeospatialFeature, AppraisalRecord, HAPCase, LGHLease, BracInstallation, BracScenario, Expense, Disbursement } from './types';

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

export const MOCK_EXECUTION_DATA = [
    { month: 'Oct', planned: 45, actual: 42 },
    { month: 'Nov', planned: 52, actual: 48 },
    { month: 'Dec', planned: 38, actual: 41 },
    { month: 'Jan', planned: 65, actual: 62 },
    { month: 'Feb', planned: 72, actual: 75 }
];

// Added BusinessRule typing
export const MOCK_BUSINESS_RULES: BusinessRule[] = [
    { id: 'R-001', code: 'ADA-01', name: 'Anti-Deficiency Check', description: 'Obligation must not exceed available authority.', domain: 'Financial', severity: 'Critical', logicString: 'IF obligation > authority THEN violation', citation: '31 U.S.C. 1517', isActive: true, conditions: [] },
    { id: 'R-002', code: 'PAY-002', name: 'PPA Interest Monitor', description: 'Payments must be within 30 days of invoice.', domain: 'Financial', severity: 'Warning', logicString: 'IF days > 30 THEN flag', citation: 'Prompt Payment Act', isActive: true, conditions: [] },
    { id: 'R-003', code: 'DWCF-003', name: 'Advance Billing Check', description: 'Validate authorization for advance billing.', domain: 'Reimbursables', severity: 'Critical', logicString: 'IF advance_billing AND NOT authorized THEN error', citation: '10 U.S.C. 2208', isActive: true, conditions: [] }
];

export const MOCK_AUDIT_FINDINGS = [
    { id: 'FIND-001', severity: 'Material Weakness', description: 'Lack of supporting documentation for service contract payments.', linkedTransactionIds: ['TR-10002'] },
    { id: 'FIND-002', severity: 'Significant Deficiency', description: 'Inconsistent application of Berry Amendment clauses in small purchases.', linkedTransactionIds: ['TR-10001'] }
];

export const DOD_FMR_VOLUMES = [
    { id: 'V12_CH23', volume: 'Volume 12, Chapter 23', title: 'Contingency Operations', category: 'Budget', sizeMB: 4.2, pages: 120 },
    { id: 'V11B', volume: 'Volume 11B', title: 'Reimbursements and Revenue Recognition', category: 'Accounting', sizeMB: 8.5, pages: 340 }
];

export const POM_PHASES = [
    { phase: 'Formulation', year: '2026', status: 'Completed', progress: 100 },
    { phase: 'Review', year: '2026', status: 'In Progress', progress: 45 },
    { phase: 'Budget Defense', year: '2027', status: 'Upcoming', progress: 0 },
    { phase: 'Enactment', year: '2027', status: 'Upcoming', progress: 0 }
];

export const MOCK_IDOCS = [
    { id: 'IDOC-001', timestamp: '2024-03-15 08:30:00', status: 'Success', direction: 'Inbound', partner: 'GFEBS-PRD', messageType: 'OBL_REC' },
    { id: 'IDOC-002', timestamp: '2024-03-15 09:15:00', status: 'Warning', direction: 'Outbound', partner: 'TREASURY', messageType: 'PAY_SCHED' }
];

export const ERP_TCODES = [
    { code: 'F110', description: 'Automatic Payment Run', module: 'FI', riskLevel: 'High' },
    { code: 'ME21N', description: 'Create Purchase Order', module: 'MM', riskLevel: 'Medium' }
];

export const MOCK_DEPOSIT_FUNDS = [
    { id: 'DF-1', treasuryIndex: '21X6050', accountName: 'Savings Bonds', statutoryAuthorization: '31 U.S.C. 3105', auditRequirement: 'Annual', quarterlyReviews: { q1: 'Completed', q2: 'Pending' }, currentBalance: 450000 }
];

export const MOCK_LIABILITY_TRANSACTIONS = [
    { id: 'TX-L1', depositFundId: 'DF-1', source: 'Payroll', amount: 12500, status: 'Held', description: 'Employee Bond Deduction' }
];

export const MOCK_CIHO_ACCOUNTS = [
    { id: 'CIHO-1', tafs: '21 2020', component: 'Army', balance: 5000000, cashHoldingAuthorityMemo: 'MEMO-2024-01', lastReconciliationDate: '2024-03-01' }
];

export const MOCK_CIHO_TRANSACTIONS = [
    { id: 'TX-C1', cihoAccountId: 'CIHO-1', date: '2024-03-10', description: 'Field Advance', amount: -25000 }
];

export const MOCK_FBWT_CASES = [
    { id: 'REC-001', type: 'Disbursement Mismatch', tas: '96X3122', amount: 1250.00, age: 45, status: 'Open', linkedThreadId: 'TR-10002' }
];

export const MOCK_SCORECARD_DATA = [
    { metric: 'FBWT Variance', status: 'Yellow', details: 'Aggregate $1.2M unmatched items.' },
    { metric: 'PPA Compliance', status: 'Green', details: '100% on-time payments for Q2.' }
];

export const MOCK_FBWT_TRANSACTIONS = [
    { id: 'TP-1', type: 'Treasury Disb', amount: 450000, tas: '96X3122' }
];

export const MOCK_CONTINGENCY_OPERATIONS = [
    { 
        id: 'OP-EAGLE', name: 'Operation Eagle Resolve', status: 'Active', type: 'Peacekeeping', 
        location: 'Red Sea', fundingSource: 'OCOTF', isBaseFunded: false, personnelDeployed: 2500, 
        executeOrderRef: 'EXORD-2024-01', sfisCode: 'OCO123', cjcsProjectCode: 'PJ01', 
        baselineCosts: 10000000, incrementalCosts: { personnel: 5000000, operatingSupport: 3000000, investment: 1000000, retrograde: 500000, reset: 500000 },
        billableIncrementalCosts: 8000000, costOffsets: [], incrementalCostsBreakdown: [], 
        reimbursement: { billed: 4000000, received: 3500000 }, justificationMaterials: { 'O-1': 'Approved' }, 
        estimates: {}, linkedThreadIds: ['TR-10001']
    }
];

export const MOCK_O_AND_M_APPROPRIATIONS = [
    { id: 'OMA', name: 'Operation & Maintenance, Army', appropriationCode: '21 2020', budgetActivities: [] }
];

export const MOCK_ADA_VIOLATIONS = [
    { id: 'ADA-24-001', status: 'Preliminary Review', type: '31 USC 1517(a) - Admin Control Limitation', discoveryDate: '2024-01-15', amount: 450000, organization: 'USACE-LRL', description: 'Reprogramming threshold exceeded without authorization.' }
];

export const MOCK_INVESTIGATIONS = [
    { id: 'INV-101', violationId: 'ADA-24-001', stage: 'Analysis', evidence: [], findings: [], responsibleParties: [], correctiveActions: [], legalReviewStatus: 'Pending', advanceDecisionStatus: 'Pending' }
];

export const MOCK_INVESTIGATING_OFFICERS = [
    { id: 'IO-01', name: 'Richards, Mark', rank: 'COL', organization: 'USACE-HQ', fiscalLawTrainingDate: '2023-06-15' }
];

export const MOCK_ASSETS = [
    { id: 'ASSET-001', name: 'River Barge L-10', type: 'PRIP', assetClass: 'Vessel', status: 'In Service', acquisitionCost: 1200000, residualValue: 100000, usefulLife: 20, placedInServiceDate: '2020-01-01', pripAuthorized: true, plantIncrementWaiver: { active: false }, components: [], accumulatedDepreciation: 240000, auditLog: [] }
];

export const MOCK_GL_TRANSACTIONS = [
    { id: 'GL-1001', date: '2024-03-15', description: 'Contract Payment', type: 'Disbursement', sourceModule: 'Acquisition', referenceDoc: 'W912QR-24-C-0001', totalAmount: 125000, status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: [] }
];

export const MOCK_USSGL_ACCOUNTS = [
    { accountNumber: '101000', description: 'Fund Balance with Treasury', category: 'Asset', normalBalance: 'Debit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '211000', description: 'Accounts Payable', category: 'Liability', normalBalance: 'Credit', financialStatement: 'Balance Sheet', isActive: true }
];

export const MOCK_FUND_HIERARCHY = [
    { id: 'ARMY-ROOT', parentId: null, name: 'Department of the Army', level: 'Apportionment' as FundControlLevel, totalAuthority: 185000000000, amountDistributed: 150000000000, amountCommitted: 0, amountObligated: 120000000000, amountExpended: 100000000000, isCMA: false, children: [], history: [] }
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

export const MOCK_SPENDING_CHAIN = [
    { type: 'PR', docNumber: '100021', amount: 100000, status: 'Approved', linkedThreadId: 'TR-10001' },
    { type: 'PO', docNumber: '450002', amount: 100000, status: 'Awarded', linkedThreadId: 'TR-10001' }
];

export const MOCK_INVENTORY = [
    { id: 'INV-1', name: 'Steel Gasket', sku: 'SG-123', quantityOnHand: 450, reorderPoint: 100, unitCost: 12.50, unitOfMeasure: 'EA', category: 'Parts', location: 'Whse A', transactions: [] }
];

export const MOCK_VENDORS = [
    { id: 'V-1', name: 'Acme Parts', serviceType: 'Supplies' }
];

export const MOCK_FADS = [
    { id: 'FAD-01', appropriationSymbol: '96X3122', programYear: 2024, publicLaw: 'PL 117-58', totalAuthority: 50000000, fundType: 'Direct', auditLog: [] }
];

export const MOCK_WORK_ALLOWANCES = [
    { id: 'WA-01', fadId: 'FAD-01', districtEROC: 'LRL', p2ProgramCode: '123456', ppa: 'Navigation', congressionalLineItem: 'River Maint', ccsCode: '111', amount: 5000000, obligatedAmount: 4200000, status: 'Active', auditLog: [] }
];

export const MOCK_PURCHASE_REQUESTS = [
    { id: 'PR-1', description: 'Software Subscription', amount: 12500, requester: 'LRL-ED', date: '2024-03-10', status: 'Funds Certified', auditLog: [] }
];

export const MOCK_CONTRACTS_LIST = [
    { id: 'W912QR-24-C-001', vendor: 'V-NEX', type: 'FFP', value: 1000000, awardedDate: '2024-01-01', status: 'Active', prReference: 'PR-1', uei: 'UEI-1', cageCode: 'CAGE-1', periodOfPerformance: { start: '2024-01-01', end: '2024-12-31' }, gInvoicingStatus: 'Accepted', isBerryCompliant: true, modifications: [], auditLog: [] }
];

export const REIMBURSABLE_RATES = {
    assetUseCharge: 0.04,
    unfundedCivRetirement: 0.18,
    postRetirementHealth: 0.065,
    contractAdminCharge: 0.015,
    milLaborAcceleration: 1.15
};

export const MOCK_POM_ENTRIES = [
    { projectId: '123456', projectName: 'Ohio River Lock', businessLine: 'Navigation', fy1: 5000000, fy2: 5150000, fy3: 5300000, fy4: 5450000, fy5: 5600000 }
];

export const MOCK_BUDGET_LINE_ITEMS = [
    { id: 'BL-1', projectId: '123456', projectName: 'Ohio River Lock', businessLine: 'Navigation', fiscalYear: 2026, capabilityLevel: 'Capability 1', objectClass: '25.1', amount: 5000000, justification: 'Critical maintenance.', status: 'G-8 Certified', isInflationAdjusted: true, lastModified: '' }
];

export const COMMAND_HIERARCHY = {
    id: 'DOD-ROOT', parentId: null, name: 'Department of Defense', level: 'Apportionment' as FundControlLevel, totalAuthority: 850000000000, amountDistributed: 750000000000, amountCommitted: 0, amountObligated: 600000000000, amountExpended: 500000000000, isCMA: false, children: [
        { id: 'ARMY-ROOT', parentId: 'DOD-ROOT', name: 'Department of the Army', level: 'Allotment' as FundControlLevel, totalAuthority: 185000000000, amountDistributed: 150000000000, amountCommitted: 0, amountObligated: 120000000000, amountExpended: 100000000000, isCMA: false, children: [], history: [] }
    ], history: []
};

export const MOCK_TRANSFERS = [
    { id: 'TRF-01', fromAccount: 'OMA', toAccount: 'RDTE', amount: 5000000, authorityType: 'General Transfer Authority (GTA)', legalCitation: 'FY24 Approp Act', justification: 'Urgent requirement.', currentStage: 'Completed', dates: { initiated: '2024-01-10', completed: '2024-02-15' }, documents: {} }
];

export const MOCK_PROJECT_ORDERS = [
    { id: 'PO-01', orderNumber: 'N001-24-F-01', description: 'Depot Repair', providerId: 'TYAD', requestingAgency: 'NAVY', appropriation: '97-1109', totalAmount: 450000, obligatedAmount: 450000, pricingMethod: 'Fixed Price', issueDate: '2024-01-01', completionDate: '2024-09-30', isSeverable: false, percentInHouse: 85, isSpecificDefiniteCertain: true, status: 'Accepted', documents: {} }
];

// Added missing MOCK_USACE_PROJECTS
export const MOCK_USACE_PROJECTS: USACEProject[] = [
    { id: 'PROJ-001', name: 'Ohio River Lock & Dam', district: 'LRL', p2Number: '123456', programType: 'Civil Works', appropriation: 'Construction', financials: { currentWorkingEstimate: 12000000, obligated: 4500000, programmed: 12500000, disbursed: 4000000, prc_committed: 500000, contractRetainage: 0 }, p2Linkage: true, costShare: { sponsorName: 'State of KY', federalShare: 65, nonFederalShare: 35, totalContributed: 2000000, balanceDue: 2200000 }, cwisCode: '01234', milestones: [{ description: 'Award Contract', code: 'AWD', scheduledDate: '2024-05-15', status: 'Pending' }], risks: [], contractMods: [], realEstate: [{ tractNumber: '101', owner: 'Private', status: 'Acquired', cost: 250000, lerrdCredit: true }], weatherDelayDays: 2 },
];

// Added missing MOCK_APPROPRIATIONS
export const MOCK_APPROPRIATIONS: Appropriation[] = [
    { id: 'OMA-FY24', commandId: 'ARMY-ROOT', name: 'O&M, Army', totalAuthority: 5000000000, obligated: 1200000000, distributions: [] }
];

// Added missing MOCK_REIMBURSABLE_AGREEMENTS
export const MOCK_REIMBURSABLE_AGREEMENTS: ReimbursableAgreement[] = [
    { id: 'AGR-001', buyer: 'FEMA', sender: 'USACE', seller: 'USACE', gtcNumber: 'GTC-24-001', status: 'Active', estimatedTotalValue: 10000000 }
];

// Added missing MOCK_REIMBURSABLE_ORDERS
export const MOCK_REIMBURSABLE_ORDERS: ReimbursableOrder[] = [
    { id: 'ORD-001', agreementId: 'AGR-001', orderNumber: 'O-24-001', authority: 'Economy Act', amount: 500000, billingFrequency: 'Monthly' }
];

// Added missing MOCK_CDO_POOLS
export const MOCK_CDO_POOLS: CDOCostPool[] = [
    { id: 'POOL-01', functionName: 'Engineering', orgCode: 'LRL-ED', fyBudget: 2500000, obligated: 1200000, currentRate: 18.5, status: 'Active' }
];

// Added missing MOCK_CDO_TRANSACTIONS
export const MOCK_CDO_TRANSACTIONS: CDOTransaction[] = [
    { id: 'TX-CDO-001', date: '2024-03-01', type: 'Labor', amount: 1250, description: 'General Design Support', function: 'Engineering', employeeId: 'E-1234', hours: 14.5 }
];

// Added missing MOCK_DWCF_ACCOUNTS
export const MOCK_DWCF_ACCOUNTS: DWCFAccount[] = [
    { id: 'AC-1', fundCode: '97X4930', accountName: 'Supply Management', totalCashBalance: 125000000 }
];

// Added missing MOCK_DWCF_ACTIVITIES
export const MOCK_DWCF_ACTIVITIES: DWCFActivity[] = [
    { id: 'ACT-SUP', name: 'Supply Management', collections: 45000000, disbursements: 42000000 }
];

// Added missing MOCK_DWCF_ORDERS
export const MOCK_DWCF_ORDERS: DWCFOrder[] = [
    { id: 'D-ORD-001', dwcfActivityId: 'ACT-SUP', customer: 'Army G-4', description: 'Repair Parts', totalAmount: 1200000, status: 'Accepted' }
];

// Added missing MOCK_DWCF_BILLINGS
export const MOCK_DWCF_BILLINGS: DWCFBilling[] = [
    { id: 'BILL-001', orderId: 'D-ORD-001', billingDate: '2024-02-15', status: 'Sent', total: 450000, isAdvanceBilling: false, costs: { labor: 100000, material: 250000, overhead: 50000, surcharge: 50000 } }
];

// Added missing MOCK_UNFUNDED_ORDERS
export const MOCK_UNFUNDED_ORDERS: UnfundedCustomerOrder[] = [
    { id: 'UF-001', customer: 'DLA', amount: 850000, status: 'Requires Notification' }
];

// Added missing MOCK_REMIS_SOLICITATIONS
export const MOCK_REMIS_SOLICITATIONS: Solicitation[] = [
    { id: 'SOL-001', assetId: 'RPUID-662104', status: 'Active Solicitation', title: 'Survey Services', type: 'RFQ', quotes: [], auditLog: [] }
];

// Added missing MOCK_REMIS_ENCROACHMENTS
export const MOCK_REMIS_ENCROACHMENTS: EncroachmentCase[] = [
    { id: 'ENC-001', assetId: 'RPUID-662104', locationDescription: 'North Boundary', type: 'Structure', discoveryDate: '2024-01-10', description: 'Fence overlap detected', status: 'Reported', responsibleOfficial: 'Dave Miller', tasks: [], auditLog: [] }
];

// Added missing MOCK_REMIS_COST_SHARES
export const MOCK_REMIS_COST_SHARES: CostShareRecord[] = [
    { id: 'CS-001', projectOrAssetId: '123456', authority: '33 U.S.C. 2213', sponsorName: 'State of KY', percentage: { federal: 65, nonFederal: 35 }, contributionType: 'Cash', valuationMethod: 'Standard', status: 'Active', agreementDate: '2023-10-01', totalValue: 12000000, contributedValue: 2000000, auditLog: [], adjustments: [] }
];

// Added missing MOCK_REMIS_RELOCATIONS
export const MOCK_REMIS_RELOCATIONS: RelocationCase[] = [
    { id: 'REL-001', assetId: 'RPUID-662104', displacedPersonName: 'Smith, Arthur', displacedEntityType: 'Individual', eligibilityStatus: 'Eligible', status: 'Initiated', initiationDate: '2024-02-15', benefits: [], auditLog: [], linkedRecords: {} }
];

// Added missing MOCK_REMIS_FEATURES
export const MOCK_REMIS_FEATURES: GeospatialFeature[] = [
    { id: 'GEO-1', assetName: 'HQ Building', type: 'Point', status: 'Published', layer: 'Real Property', coordinates: { x: 45, y: 55 }, metadata: { source: 'Survey', accuracy: 'High', collectionMethod: 'GPS', captureDate: '2023-01-01', responsibleOfficial: 'GIS Team' }, auditLog: [] }
];

// Added missing MOCK_REMIS_APPRAISALS
export const MOCK_REMIS_APPRAISALS: AppraisalRecord[] = [
    { id: 'APP-001', assetId: 'RPUID-662104', status: 'Approved', standard: 'Yellow Book (UASFLA)', valuationDate: '2023-09-15', appraiserName: 'Jones, Sarah', appraiserQualifications: 'Certified General', purpose: 'Fair Market Value', scope: 'Narrative', marketValue: 45000000, limitingConditions: [], extraordinaryAssumptions: [], revisions: [], auditLog: [] }
];

// Added missing MOCK_HAP_CASES
export const MOCK_HAP_CASES: HAPCase[] = [
    { id: 'HAP-001', applicantName: 'Williams, Mark', applicantType: 'Military - PCS', propertyAddress: '456 Soldier Way, Clarksville TN', programType: 'Expanded HAP', submissionDate: '2024-01-20', status: 'Valuation Review', purchasePrice: 285000, purchaseDate: '2020-05-12', mortgageBalance: 245000, benefitAmount: 0, assignedOfficer: 'Jane Doe', pcsOrderDate: '2023-12-01' }
];

// Added missing MOCK_LGH_LEASES
export const MOCK_LGH_LEASES: LGHLease[] = [
    { id: 'L-001', leaseNumber: 'W912QR-20-L-0001', propertyName: 'Fort Knox Housing', address: '100 Main St, Ft Knox', lessor: 'Knox Partners LLC', annualRent: 1500000, startDate: '2020-01-01', expirationDate: '2030-12-31', status: 'Active', occupancyRate: 98, units: 150, scoring: 'Operating', fairMarketValue: 12000000, auditLog: [] }
];

// Added missing MOCK_BRAC_INSTALLATIONS
export const MOCK_BRAC_INSTALLATIONS: BracInstallation[] = [
    { id: 'INST-01', name: 'Fort Knox', service: 'Army', region: 'Southeast', isJointBase: false, currentTroopDensity: 25000, totalForceCapacity: 45000, availableAcreage: 12000, conditionCode: 88, projected20YearReq: 8000, economicData: { regionalEmployment: 500000, defenseDependencyIndex: 0.12 }, infrastructure: { schoolCapacityPct: 82, hospitalBedsPer1000: 4.2, highwayLevelOfService: 'B' }, environmental: { hasSuperfundSite: false, rmisCleanupEstimate: 0 } }
];

// Added missing MOCK_BRAC_SCENARIOS
export const MOCK_BRAC_SCENARIOS: BracScenario[] = [
    { id: 'SCN-BRAC-01', name: 'Southeast Consolidation', fiscalYear: 2026, status: 'Draft', losingInstallationId: 'INST-01', personnelMoving: 1200, oneTimeMovingCost: 45000000, milconCost: 120000000, annualSavings: 35000000, auditLog: [] }
];

// Added missing MOCK_EXPENSES
export const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', obligationId: 'OBL-001', amount: 125000, date: '2024-03-01', description: 'Progress Payment #4', source: 'Manual Intake', status: 'Accrued', createdBy: 'Clerk', auditLog: [] }
];

// Added missing MOCK_DISBURSEMENTS
export const MOCK_DISBURSEMENTS: Disbursement[] = [
    { id: 'DISB-001', expenseId: 'EXP-001', amount: 125000, date: '2024-03-05', paymentMethod: 'EFT', treasuryConfirmationId: 'T2024000123' }
];