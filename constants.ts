
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
  OandMAppropriation, UnfundedCustomerOrder, ScorecardStatus, BracInstallation, BracScenario,
  Outgrant, EncroachmentCase, DisposalAction, RelocationCase, CostShareRecord, GeospatialFeature,
  AppraisalRecord, UMDRecord, NULORecord, DredgeMetric
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

export const MOCK_UMD_RECORDS: UMDRecord[] = [
    { id: 'UMD-001', tas: '96X3122', amount: 45000, ageDays: 124, sourceModule: 'Disbursement', researchStatus: 'Researching', assignedTo: 'Analyst A' },
    { id: 'UMD-002', tas: '96X3123', amount: 12000, ageDays: 15, sourceModule: 'Payroll', researchStatus: 'Pending' }
];

export const MOCK_NULO_RECORDS: NULORecord[] = [
    { id: 'NULO-001', documentNumber: 'W912QR-23-C-001', amount: -5400, varianceReason: 'Incorrect quantity billed by vendor', status: 'Correction Pending' }
];

export const MOCK_DREDGE_METRICS: DredgeMetric[] = [
    { id: 'DR-001', projectId: 'PROJ-001', volumeCY: 125000, totalCost: 500000, costPerCY: 4.00, dredgeType: 'Cutterhead', fiscalPeriod: 'FY24 Q1' }
];

/**
 * REMIS MOCK DATA PROVIDER - AUTHORITATIVE DEFAULTS
 */

export const MOCK_REMIS_ASSETS: RealPropertyAsset[] = [
    {
        rpuid: 'RPUID-662104', rpaName: 'Engineering Research Center', installation: 'ERDC-VICKSBURG', catcode: '61050',
        interestType: 'Fee', status: 'Active', acres: 42.5, sqFt: 125000, hasGeo: true, acquisitionDate: '1985-06-12',
        operationalStatus: 'Operational', currentValue: 45000000, deferredMaintenance: 1200000, utilizationRate: 98,
        missionDependency: 'Critical', jurisdiction: 'Exclusive', accountableDistrict: 'MVK', custody: 'USACE',
        sourceSystem: 'REMIS', originatingOrg: 'ERDC', a123Status: 'Certified', auditLog: [], versionHistory: []
    },
    {
        rpuid: 'RPUID-110022', rpaName: 'Wharf B - Logistics Terminal', installation: 'MILITARY-OCEAN-TERM', catcode: '85110',
        interestType: 'Fee', status: 'Active', acres: 12.0, sqFt: 0, hasGeo: true, acquisitionDate: '1992-04-30',
        operationalStatus: 'Operational', currentValue: 28500000, deferredMaintenance: 4500000, utilizationRate: 85,
        missionDependency: 'Critical', jurisdiction: 'Exclusive', accountableDistrict: 'NAN', custody: 'USACE',
        sourceSystem: 'REMIS', originatingOrg: 'NAN', a123Status: 'Pending', auditLog: [], versionHistory: []
    },
    {
        rpuid: 'RPUID-882103', rpaName: 'Ammunition Storage Bunker 4', installation: 'HAWTHORNE-AD', catcode: '44220',
        interestType: 'Fee', status: 'Excess', acres: 2.5, sqFt: 8500, hasGeo: false, acquisitionDate: '1974-11-15',
        operationalStatus: 'Standby', currentValue: 1200000, deferredMaintenance: 850000, utilizationRate: 15,
        missionDependency: 'Not Dependent', jurisdiction: 'Proprietary', accountableDistrict: 'SPK', custody: 'USA',
        sourceSystem: 'REMIS', originatingOrg: 'USA', a123Status: 'Flagged', auditLog: [], versionHistory: []
    }
];

export const MOCK_REMIS_OUTGRANTS: Outgrant[] = [
    {
        id: 'DACA01-1-24-001', grantee: 'Coastal Wind Power LLC', type: 'Lease', authority: '10 USC 2667',
        permittedUse: 'Wind Turbine Placement', location: 'Section A, Fort Story', annualRent: 125000,
        termStart: '2024-01-01', expirationDate: '2049-12-31', status: 'Active', paymentFrequency: 'Annual',
        nextPaymentDate: '2025-01-01', assetId: 'RPUID-110022', auditLog: [], versionHistory: []
    },
    {
        id: 'DACA27-2-23-452', grantee: 'City of Louisville Parks', type: 'License', authority: '10 USC 2668',
        permittedUse: 'Public Recreation Trail', location: 'McAlpine Locks & Dam Boundary', annualRent: 1200,
        termStart: '2023-06-01', expirationDate: '2028-05-31', status: 'Active', paymentFrequency: 'Annual',
        nextPaymentDate: '2024-06-01', assetId: 'RPUID-662104', auditLog: [], versionHistory: []
    }
];

export const MOCK_REMIS_APPRAISALS: AppraisalRecord[] = [
    {
        id: 'APP-2024-001', assetId: 'RPUID-882103', status: 'In-Progress', standard: 'Yellow Book (UASFLA)',
        valuationDate: '2024-02-15', appraiserName: 'Sterling, James', appraiserQualifications: 'MAI Certified',
        purpose: 'Excess Property Disposal Valuation', scope: 'Complete Narrative Report', marketValue: 1250000,
        limitingConditions: ['Access restricted to site perimeter'], extraordinaryAssumptions: ['Soil stability assumed compliant'],
        revisions: [], auditLog: []
    }
];

export const MOCK_REMIS_ENCROACHMENTS: EncroachmentCase[] = [
    {
        id: 'ENC-2024-001', assetId: 'RPUID-662104', locationDescription: 'North Boundary - Gate 4',
        type: 'Structure', discoveryDate: '2024-02-15', description: 'Private fence crossing 5ft into federal boundary.',
        status: 'Investigated', responsibleOfficial: 'Ranger Dave', tasks: [], auditLog: []
    },
    {
        id: 'ENC-2024-002', assetId: 'RPUID-110022', locationDescription: 'Wharf B - West Mooring',
        type: 'Unauthorized Use', discoveryDate: '2024-03-01', description: 'Unauthorized commercial fishing vessel docking nightly.',
        status: 'Action Pending', responsibleOfficial: 'Harbor Master', tasks: [], auditLog: []
    }
];

export const MOCK_REMIS_DISPOSALS: DisposalAction[] = [
    {
        id: 'DISP-24-101', assetId: 'RPUID-882103', type: 'Public Sale', screeningStatus: 'Federal Screening',
        reportedExcessDate: '2024-01-10', estimatedProceeds: 1100000, auditLog: [], versionHistory: []
    },
    {
        id: 'DISP-24-102', assetId: 'RPUID-110022', type: 'Federal Transfer', screeningStatus: 'Submitted',
        reportedExcessDate: '2024-03-12', estimatedProceeds: 0, auditLog: [], versionHistory: []
    },
    {
        id: 'DISP-24-103', assetId: 'RPUID-662104', type: 'PBC', screeningStatus: 'Homeless Screening',
        reportedExcessDate: '2024-02-15', estimatedProceeds: 0, auditLog: [], versionHistory: []
    },
    {
        id: 'DISP-24-104', assetId: 'RPUID-991222', type: 'Public Sale', screeningStatus: 'Final',
        reportedExcessDate: '2023-11-01', estimatedProceeds: 8500000, auditLog: [], versionHistory: []
    },
    {
        id: 'DISP-24-105', assetId: 'RPUID-445566', type: 'Federal Transfer', screeningStatus: 'DoD Screening',
        reportedExcessDate: '2024-03-18', estimatedProceeds: 0, auditLog: [], versionHistory: []
    }
];

export const MOCK_REMIS_COST_SHARES: CostShareRecord[] = [
    {
        id: 'CS-2024-LRL-01', projectOrAssetId: 'PROJ-001', authority: '33 U.S.C. 2213 (Flood Control)',
        sponsorName: 'Louisville MSD', percentage: { federal: 65, nonFederal: 35 },
        contributionType: 'Cash', valuationMethod: 'Standard', status: 'Active',
        agreementDate: '2024-01-15', totalValue: 12000000, contributedValue: 1500000,
        auditLog: [], adjustments: []
    }
];

export const MOCK_REMIS_SOLICITATIONS: Solicitation[] = [
    {
        id: 'SOL-RE-9912', assetId: 'RPUID-882103', status: 'Evaluating Quotes',
        title: 'Appraisal Services - Hawthorne Industrial Complex', type: 'RFP',
        quotes: [
            { vendorId: 'V1', vendorName: 'Valuation Experts Inc', uei: 'ABC123DEF', amount: 15000, technicalScore: 92, pastPerformanceScore: 95, isResponsive: true, isResponsible: true },
            { vendorId: 'V2', vendorName: 'Regional Land Group', uei: 'GHI789JKL', amount: 18500, technicalScore: 88, pastPerformanceScore: 82, isResponsive: true, isResponsible: true }
        ],
        auditLog: []
    }
];

export const MOCK_REMIS_RELOCATIONS: RelocationCase[] = [
    {
        id: 'REL-24-001', assetId: 'RPUID-110022', displacedPersonName: 'Terminal Storage Solutions',
        displacedEntityType: 'Business', eligibilityStatus: 'Eligible', status: 'Initiated',
        initiationDate: '2024-03-01', benefits: [], auditLog: [], linkedRecords: { acquisitionId: 'OBL-REL-101' }
    }
];

export const MOCK_REMIS_FEATURES: GeospatialFeature[] = [
    {
        id: 'GEO-001', assetName: 'ERDC Main Lab', type: 'Point', status: 'Published',
        layer: 'Real Property', coordinates: { x: 45.2, y: 32.8 },
        metadata: { source: 'Field GPS', accuracy: '1m', collectionMethod: 'Survey', captureDate: '2023-10-10', responsibleOfficial: 'GIS Manager' },
        auditLog: []
    }
];

/**
 * EXISTING MOCK DATA
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
      vendorUEI: 'ABC123DEF',
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
    children: [
        {
            id: 'ARMY-ROOT',
            parentId: 'DOD-ROOT',
            name: 'Department of the Army',
            level: 'Allotment',
            totalAuthority: 185000000000,
            amountDistributed: 180000000000,
            amountCommitted: 0,
            amountObligated: 160000000000,
            amountExpended: 140000000000,
            isCMA: false,
            children: [
                {
                    id: 'USACE',
                    parentId: 'ARMY-ROOT',
                    name: 'U.S. Army Corps of Engineers',
                    level: 'Allocation',
                    totalAuthority: 7200000000,
                    amountDistributed: 7000000000,
                    amountCommitted: 0,
                    amountObligated: 5500000000,
                    amountExpended: 4500000000,
                    isCMA: false,
                    children: [
                        {
                           id: 'LRL-DISTRICT-24',
                           parentId: 'USACE',
                           name: 'Louisville District FY24',
                           level: 'Suballocation',
                           totalAuthority: 850000000,
                           amountDistributed: 800000000,
                           amountCommitted: 0,
                           amountObligated: 620000000,
                           amountExpended: 500000000,
                           isCMA: false,
                           history: [
                               { timestamp: '2023-10-01', user: 'SYSTEM', action: 'Created', amount: 850000000, justification: 'FY24 Initial Operating Allotment' }
                           ]
                        }
                    ]
                }
            ]
        }
    ]
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
    },
    {
        id: 'R-PO-001',
        name: '51% Performance Rule',
        code: 'PO-001',
        description: 'Project orders must be performed substantially in-house (min 51%).',
        severity: 'Critical',
        logicString: 'IF in_house_percent < 51 THEN NON_COMPLIANT',
        domain: 'Reimbursables',
        isActive: true,
        conditions: [{ field: 'percentInHouse', operator: 'LESS_THAN', value: 51 }],
        citation: 'FMR Vol 11A, Ch 2'
    },
    {
        id: 'R-PO-002',
        name: 'Non-Severable Services Only',
        code: 'PO-002',
        description: 'Project orders are restricted to non-severable services.',
        severity: 'Critical',
        logicString: 'IF is_severable IS TRUE THEN VIOLATION',
        domain: 'Reimbursables',
        isActive: true,
        conditions: [{ field: 'isSeverable', operator: 'IS_TRUE', value: true }],
        citation: 'FMR Vol 11A, Ch 2'
    },
    {
        id: 'R-TRF-001',
        name: 'Transfer Authority Limit',
        code: 'TRF-001',
        description: 'General Transfer Authority cannot exceed the annual statutory cap.',
        severity: 'Critical',
        logicString: 'IF amount > 5000000000 THEN VIOLATION',
        domain: 'Transfers',
        isActive: true,
        conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 5000000000 }],
        citation: 'FY24 Appropriations Act'
    }
];

export const MOCK_EXECUTION_DATA = [
    { month: 'Oct', planned: 8.3, actual: 8.5 },
    { month: 'Nov', planned: 16.6, actual: 17.2 },
    { month: 'Dec', planned: 25.0, actual: 24.8 },
    { month: 'Jan', planned: 33.3, actual: 33.5 },
    { month: 'Feb', planned: 41.6, actual: 42.1 },
    { month: 'Mar', planned: 50.0, actual: 49.5 },
];

export const MOCK_AUDIT_FINDINGS = [
    { id: 'AF-001', severity: 'Material Weakness', description: 'Lack of segregation of duties in GPC program.', linkedTransactionIds: ['TR-10002'] }
];

export const DOD_FMR_VOLUMES: FMRVolume[] = [
    { id: 'V1', volume: 'Volume 1', title: 'General FM Information', category: 'Policy', sizeMB: 2.5, pages: 150 },
    { id: 'V2A', volume: 'Volume 2A', title: 'Budget Formulation (Ch 1)', category: 'Budget', sizeMB: 3.8, pages: 240 },
    { id: 'V3', volume: 'Volume 3', title: 'Budget Execution - Availability and Use of Funds', category: 'Funds', sizeMB: 4.2, pages: 180 },
    { id: 'V4', volume: 'Volume 4', title: 'Accounting Policy', category: 'Accounting', sizeMB: 5.1, pages: 320 },
    { id: 'V7A', volume: 'Volume 7A', title: 'Military Pay Policy (Active Duty)', category: 'Pay', sizeMB: 6.5, pages: 850 },
    { id: 'V11A', volume: 'Volume 11A', title: 'Reimbursable Operations (Ch 1-3)', category: 'Accounting', sizeMB: 2.1, pages: 110 },
    { id: 'V11B', volume: 'Volume 11B', title: 'Working Capital Funds', category: 'Accounting', sizeMB: 2.4, pages: 140 },
    { id: 'V12_CH23', volume: 'Volume 12, Ch 23', title: 'Contingency Operations', category: 'Accounting', sizeMB: 1.2, pages: 45 },
    { id: 'V14', volume: 'Volume 14', title: 'Administrative Control of Funds and ADA Violations', category: 'Policy', sizeMB: 1.5, pages: 95 },
];

export const POM_PHASES = [
    { year: 2026, phase: 'Planning', progress: 100, status: 'Completed' },
    { year: 2026, phase: 'Programming', progress: 85, status: 'In Progress' },
    { year: 2026, phase: 'Budgeting', progress: 20, status: 'Not Started' },
    { year: 2026, phase: 'Execution', progress: 0, status: 'Future' },
];

export const MOCK_TRANSFERS: TransferAction[] = [
    {
        id: 'TRF-2024-001',
        fromAccount: 'OMA 2020',
        toAccount: 'RDTE 2040',
        amount: 15000000,
        authorityType: 'General Transfer Authority (GTA)',
        legalCitation: 'PL 118-47 Section 8005',
        justification: 'Required to fund emergency tech insertion for Project Sentinel.',
        isHigherPriority: true,
        currentStage: 'SecDef Determination',
        dates: { initiated: '2024-02-01' },
        documents: { dd1415: true }
    }
];

export const MOCK_IDOCS = [
    { id: 'IDOC-4421', timestamp: '2024-03-15 08:42:11', status: 'Success', direction: 'Inbound', partner: 'DA-WAWF', messageType: 'INV_RECEIPT' },
    { id: 'IDOC-4422', timestamp: '2024-03-15 09:10:05', status: 'Warning', direction: 'Outbound', partner: 'US-TREASURY', messageType: 'PAY_ADV' },
    { id: 'IDOC-4423', timestamp: '2024-03-15 10:01:24', status: 'Error', direction: 'Inbound', partner: 'OSD-ADVANA', messageType: 'TRIAL_BAL' }
];

export const MOCK_REIMBURSABLE_AGREEMENTS: ReimbursableAgreement[] = [
    { id: 'AGR-2024-001', buyer: 'FEMA', seller: 'USACE', sender: 'FEMA', gtcNumber: 'A-24-01-FEMA', status: 'Active', estimatedTotalValue: 5000000 },
    { id: 'AGR-2024-002', buyer: 'EPA', seller: 'USACE', sender: 'EPA', gtcNumber: 'A-24-02-EPA', status: 'Active', estimatedTotalValue: 1200000 }
];

export const MOCK_REIMBURSABLE_ORDERS: ReimbursableOrder[] = [
    { id: 'ORD-24-101', agreementId: 'AGR-2024-001', orderNumber: 'O-24-001', authority: 'Stafford Act', amount: 1500000, billingFrequency: 'Monthly' }
];

export const MOCK_PROJECT_ORDERS: ProjectOrder[] = [
    { 
        id: 'PO-24-001', orderNumber: 'N00024-24-F-0101', description: 'Dry Dock Maintenance - USS Enterprise', 
        providerId: 'Norfolk Naval Shipyard', requestingAgency: 'NAVSEA', appropriation: '97 1109', 
        totalAmount: 12500000, obligatedAmount: 12500000, pricingMethod: 'Fixed Price', 
        issueDate: '2023-11-15', completionDate: '2024-09-30', isSeverable: false, 
        percentInHouse: 85, isSpecificDefiniteCertain: true, bonaFideNeedYear: 2024, 
        isDoDOwned: true, isSameCommander: false, status: 'Work In Progress', 
        documents: { fs7600a: 'GTC-24-001' } 
    }
];

export const MOCK_USACE_PROJECTS: USACEProject[] = [
    {
        id: 'PROJ-001', name: 'Ohio River Lock & Dam Maintenance', district: 'LRL', p2Number: '123456',
        programType: 'Civil Works', appropriation: 'Construction, General',
        financials: { currentWorkingEstimate: 12000000, obligated: 8500000, programmed: 10000000, disbursed: 4500000, prc_committed: 250000, contractRetainage: 120000 },
        p2Linkage: true, cwisCode: '01020',
        costShare: { sponsorName: 'Louisville MSD', nonFederalShare: 35, federalShare: 65, totalContributed: 1500000, balanceDue: 2700000 },
        milestones: [{ description: 'Award Base Contract', code: 'A10', scheduledDate: '2023-11-15', status: 'Complete' }],
        risks: [{ id: 'R-1', category: 'Cost', impact: 'Medium', description: 'Material price escalation', mitigationStrategy: 'Firm Fixed Price with EPA' }],
        realEstate: [{ tractNumber: '101E', owner: 'State of KY', status: 'Acquired', cost: 125000, lerrdCredit: true }]
    }
];
export const MOCK_CDO_POOLS: CDOCostPool[] = [
    { id: 'POOL-01', functionName: 'Engineering', orgCode: 'LRL-ED', fyBudget: 5000000, obligated: 1200000, currentRate: 12.5, status: 'Active' },
    { id: 'POOL-02', functionName: 'Operations', orgCode: 'LRL-OPS', fyBudget: 8000000, obligated: 2500000, currentRate: 15.2, status: 'Active' }
];
export const MOCK_CDO_TRANSACTIONS: CDOTransaction[] = [
    { id: 'TX-CDO-001', date: '2024-03-01', type: 'Labor', amount: 12400.50, description: 'Payroll Distribution PP-05', function: 'Engineering' }
];
export const MOCK_ASSETS: Asset[] = [
    {
        id: 'ASSET-001', name: 'Survey Vessel EADS', type: 'PRIP', assetClass: 'Vessel', status: 'In Service',
        acquisitionCost: 2500000, residualValue: 250000, usefulLife: 20, pripAuthorized: true,
        plantIncrementWaiver: { active: false }, components: [], accumulatedDepreciation: 125000,
        placedInServiceDate: '2023-10-01', auditLog: []
    }
];
export const MOCK_GL_TRANSACTIONS: GLTransaction[] = [
    {
        id: 'GL-10001', date: '2024-03-10', description: 'Quarterly Depreciation Posting', type: 'Adjusting Entry',
        sourceModule: 'Asset', referenceDoc: 'DEP-FY24-Q2', totalAmount: 31250, status: 'Posted',
        createdBy: 'SYSTEM_BATCH', lines: [
            { ussglAccount: '610000', description: 'Depreciation Exp', debit: 31250, credit: 0, fund: '96X4902', costCenter: 'AUTO' },
            { ussglAccount: '171900', description: 'Accumulated Dep', debit: 0, credit: 31250, fund: '96X4902', costCenter: 'AUTO' }
        ],
        auditLog: []
    }
];
export const MOCK_USSGL_ACCOUNTS: USSGLAccount[] = [
    { accountNumber: '101000', description: 'Fund Balance with Treasury', category: 'Asset', normalBalance: 'Debit', financialStatement: 'Balance Sheet', isActive: true },
    { accountNumber: '480100', description: 'UDO - Obligations, Unpaid', category: 'Budgetary', normalBalance: 'Credit', financialStatement: 'SBR', isActive: true }
];
export const MOCK_FUND_HIERARCHY: FundControlNode[] = [COMMAND_HIERARCHY];
export const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', obligationId: 'OBL-001', amount: 120000, date: '2024-02-15', description: 'Vendor Invoice INV-8821', source: 'WAWF', status: 'Accrued', createdBy: 'Analyst_J', auditLog: [] }
];
export const MOCK_DISBURSEMENTS: Disbursement[] = [
    { id: 'DISB-001', expenseId: 'EXP-001', amount: 120000, date: '2024-02-20', paymentMethod: 'EFT', treasuryConfirmationId: 'T-992182' }
];
export const MOCK_WWP_SCENARIOS: WorkforceScenario[] = [
    { id: 'SCN-001', name: 'FY24 Master Work Plan', fiscalYear: 2024, isBaseline: true, status: 'Active', auditLog: [], workloadItemIds: ['W-1', 'W-2'], workforcePlanIds: ['P-1'] }
];
export const MOCK_WWP_WORKLOAD_ITEMS: WorkloadItem[] = [
    { id: 'W-1', projectId: 'PROJ-001', name: 'Design Review Phase II', workloadType: 'Engineering', unit: 'Eng Design', quantity: 12 },
    { id: 'W-2', projectId: 'PROJ-001', name: 'Site Supervision', workloadType: 'Construction', unit: 'Construction Oversight', quantity: 24 }
];
export const MOCK_WWP_WORKFORCE_PLANS: WorkforcePlan[] = [
    {
        id: 'P-1', organization: 'LRL-ED-D', functionalArea: 'Design Branch',
        entries: [
            { laborCategory: 'Engineer', fundedFTE: 12.0, unfundedFTE: 0.5 },
            { laborCategory: 'Admin', fundedFTE: 2.0, unfundedFTE: 0.0 }
        ]
    }
];
export const MOCK_WWP_LABOR_RATES: LaborRate[] = [
    { laborCategory: 'Engineer', rate: 85.50 },
    { laborCategory: 'Admin', rate: 45.00 }
];
export const MOCK_WWP_LABOR_STANDARDS: LaborStandard[] = [
    { workloadUnit: 'Eng Design', laborCategory: 'Engineer', hoursPerUnit: 160 }
];
export const MOCK_SPENDING_CHAIN = [
    { type: 'PR', docNumber: 'PR-24-001', amount: 100000, status: 'Certified', linkedThreadId: 'TR-10001' },
    { type: 'PO', docNumber: '45000021', amount: 98000, status: 'Active', linkedThreadId: 'TR-10001' },
    { type: 'GR', docNumber: '50000012', amount: 98000, status: 'Received', linkedThreadId: 'TR-10001' },
    { type: 'IR', docNumber: '51000088', amount: 98000, status: 'Paid', linkedThreadId: 'TR-10001' }
];
export const ERP_TCODES = [
    { code: 'CJ20N', description: 'Project Builder', module: 'PS', riskLevel: 'Medium' },
    { code: 'FBL3N', description: 'G/L Account Line Items', module: 'FI', riskLevel: 'Low' }
];
export const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'INV-001', name: 'Hydraulic Fluid (Industrial)', sku: 'HF-882', category: 'Consumable', location: 'Whse 2', quantityOnHand: 450, reorderPoint: 100, unitOfMeasure: 'Gal', unitCost: 12.50, transactions: [] }
];
export const MOCK_VENDORS: Vendor[] = [{ id: 'V-001', name: 'Acme Heavy Industry', serviceType: 'Maintenance' }];
export const MOCK_VENDORS_LIST: Vendor[] = MOCK_VENDORS;
export const MOCK_FADS: FADocument[] = [
    { id: 'FAD-CW-24-001', appropriationSymbol: '96X3122', programYear: 2024, publicLaw: 'PL 118-22', totalAuthority: 125000000, fundType: 'Direct', auditLog: [] }
];
export const MOCK_WORK_ALLOWANCES: WorkAllowance[] = [
    { id: 'WA-LRL-24-01', fadId: 'FAD-CW-24-001', districtEROC: 'LRL', p2ProgramCode: '123456', ppa: 'Navigation', congressionalLineItem: 'Ohio River Maint', ccsCode: '111', amount: 5000000, obligatedAmount: 1200000, status: 'Active', auditLog: [] }
];
export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = [
    { id: 'PR-24-001', description: 'Consulting Services', amount: 150000, requester: 'LRL-ED', date: '2024-03-01', status: 'Pending Certification', auditLog: [] }
];
export const MOCK_CONTRACTS_LIST: Contract[] = [
    {
        id: 'W912QR-24-C-0001', vendor: 'V-NEX SOLUTIONS', type: 'FFP', value: 8500000, awardedDate: '2023-11-20',
        status: 'Active', prReference: 'PR-23-452', uei: 'Z82LK912P', cageCode: '1A9F4',
        periodOfPerformance: { start: '2023-11-20', end: '2025-09-30' }, gInvoicingStatus: 'Accepted',
        isBerryCompliant: true, modifications: [], auditLog: []
    }
];
export const REIMBURSABLE_RATES = {
    assetUseCharge: 0.04,
    unfundedCivRetirement: 0.18,
    postRetirementHealth: 0.065,
    contractAdminCharge: 0.03,
    milLaborAcceleration: 0.15
};
export const MOCK_POM_ENTRIES: POMEntry[] = [
    { projectId: '123456', projectName: 'Ohio River Maintenance', businessLine: 'Navigation', fy1: 12000000, fy2: 12500000, fy3: 13000000, fy4: 13500000, fy5: 14000000 }
];
export const MOCK_BUDGET_LINE_ITEMS: BudgetLineItem[] = [
    { id: 'BL-001', projectId: '123456', projectName: 'Ohio River Maintenance', businessLine: 'Navigation', fiscalYear: 2026, capabilityLevel: 'Capability 1', objectClass: '25.1', amount: 12000000, justification: 'Critical maintenance for lock stability.', status: 'Draft', isInflationAdjusted: true, lastModified: '2024-03-10' }
];
export const MOCK_HAP_CASES: HAPCase[] = [
    { id: 'HAP-24-001', applicantName: 'SGT John Doe', propertyAddress: '123 Pine St, Killeen, TX', programType: 'Expanded HAP', submissionDate: '2024-02-01', status: 'Benefit Calculation', purchasePrice: 250000, purchaseDate: '2019-06-15', mortgageBalance: 240000, currentFairMarketValue: 210000, benefitAmount: 12500, applicantType: 'Military - PCS', pcsOrderDate: '2024-01-10', assignedOfficer: 'J. Smith' }
];
export const MOCK_LGH_LEASES: LGHLease[] = [
    { id: 'L-001', leaseNumber: 'DACA-01-20-L-0055', propertyName: 'Sunset Apartments', address: '4500 Sunset Blvd, Los Angeles, CA', lessor: 'Sunset Prop Mgmt', annualRent: 1200000, startDate: '2020-10-01', expirationDate: '2025-09-30', status: 'Active', occupancyRate: 98, units: 50, scoring: 'Operating', fairMarketValue: 15000000, auditLog: [] }
];
export const MOCK_DEPOSIT_FUNDS: DepositFundAccount[] = [
    { id: 'DF-001', accountName: 'Standard Deposit Fund', treasuryIndex: '97 6875', responsibleComponent: 'USACE', currentBalance: 850000, statutoryAuthorization: '31 USC 1321', auditRequirement: 'Annual', quarterlyReviews: {}, audits: [] }
];
export const MOCK_LIABILITY_TRANSACTIONS = [];
export const MOCK_CIHO_ACCOUNTS: CIHOAccount[] = [
    { id: 'CH-001', tafs: '96X3122', component: 'USACE-LRL', balance: 50000, lastReconciliationDate: '2024-03-01', cashHoldingAuthorityMemo: 'MEMO-24-01', audits: [] }
];
export const MOCK_CIHO_TRANSACTIONS = [];
export const MOCK_CASH_AUDITS = [];
export const MOCK_FBWT_CASES = [
    { id: 'CASE-001', type: 'Statement Difference', tas: '96X3122', amount: 1500, age: 12, status: 'Open', linkedThreadId: 'TR-10001' }
];
export const MOCK_SCORECARD_DATA = [
    { metric: 'Statement Diff', value: '$12k', status: 'Yellow' as ScorecardStatus, details: 'Minor variances in LRL district.' },
    { metric: 'Unmatched Disb', value: '$0', status: 'Green' as ScorecardStatus, details: 'Fully reconciled.' }
];
export const MOCK_FBWT_TRANSACTIONS = [];
export const MOCK_CONTINGENCY_OPERATIONS: ContingencyOperation[] = [
    { 
        id: 'OP-SENTINEL', name: 'Operation Sentinel Relief', status: 'Active', type: 'Humanitarian', location: 'Region X', 
        personnelDeployed: 1200, executeOrderRef: 'EXORD-24-001', sfisCode: 'OCO-001', cjcsProjectCode: '881', 
        justificationMaterials: { 'O-1': 'Approved' }, incrementalCosts: { personnel: 1200000, operatingSupport: 850000, investment: 0, retrograde: 50000, reset: 0 },
        billableIncrementalCosts: 1800000, reimbursement: { billed: 1500000, received: 1200000 }, fundingSource: 'OCOTF', isBaseFunded: false,
        linkedThreadIds: ['TR-10001'], baselineCosts: 500000, costOffsets: [], incrementalCostsBreakdown: []
    }
];
export const MOCK_O_AND_M_APPROPRIATIONS: OandMAppropriation[] = [
    { 
        id: 'OMA', appropriationCode: '21 2020', name: 'Operation and Maintenance, Army', 
        budgetActivities: [
            { 
                id: 'BA1', name: 'Operating Forces', 
                activityGroups: [
                    { 
                        id: 'AG11', name: 'Land Forces', 
                        subActivityGroups: [
                            { id: 'SAG111', name: 'Divisions', budget: 1250000000 },
                            { id: 'SAG112', name: 'Corps Support Forces', budget: 850000000 }
                        ]
                    }
                ] 
            }
        ] 
    }
];
export const MOCK_ADA_VIOLATIONS: ADAViolation[] = [
    { id: 'ADA-24-001', status: 'Preliminary Review', type: '31 USC 1517(a) - Admin Control Limitation', discoveryDate: '2024-02-10', amount: 450000, organization: 'LRL-RM', description: 'Obligation exceeded allocation at cost center level.' }
];
export const MOCK_INVESTIGATIONS: ADAInvestigation[] = [];
export const MOCK_INVESTIGATING_OFFICERS: InvestigatingOfficer[] = [
    { id: 'IO-01', name: 'Richards, Mark', rank: 'COL', organization: 'USACE-HQ', fiscalLawTrainingDate: '2023-01-15', hasConflict: false }
];
export const MOCK_DWCF_ACCOUNTS: DWCFAccount[] = [
    { id: 'ACC-01', name: 'Supply Management Cash', totalCashBalance: 125000000 }
];
export const MOCK_DWCF_ACTIVITIES: DWCFActivity[] = [
    { id: 'ACT-SUP', name: 'Supply Management', collections: 45000000, disbursements: 42000000 },
    { id: 'ACT-IND', name: 'Industrial Operations', collections: 85000000, disbursements: 88000000 }
];
export const MOCK_DWCF_ORDERS: DWCFOrder[] = [
    { id: 'ORD-24-001', customer: 'FEMA', description: 'Emergency Supply Kit Replenishment', totalAmount: 1200000, status: 'Accepted', dwcfActivityId: 'ACT-SUP' }
];
export const MOCK_DWCF_BILLINGS: DWCFBilling[] = [];
export const MOCK_UNFUNDED_ORDERS: UnfundedCustomerOrder[] = [
    { id: 'UFO-01', customer: 'Private Party X', amount: 25000, status: 'Requires Notification' }
];
export const MOCK_RISK_DISTRIBUTION = [
  { name: 'Low Risk', value: 75, color: '#10b981' },
  { name: 'Medium Risk', value: 20, color: '#f59e0b' },
  { name: 'High Risk', value: 5, color: '#ef4444' }
];
