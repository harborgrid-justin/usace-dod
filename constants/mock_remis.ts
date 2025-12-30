
import { RealPropertyAsset, Outgrant, DisposalAction, EncroachmentCase, AppraisalRecord, HAPCase, LGHLease, BracInstallation, BracScenario } from '../types';

export const MOCK_REMIS_ASSETS: RealPropertyAsset[] = [
    {
        rpuid: 'RPUID-662104', rpaName: 'Engineering Research Center', installation: 'ERDC-VICKSBURG', catcode: '61050',
        interestType: 'Fee', status: 'Active', acres: 42.5, sqFt: 125000, hasGeo: true, acquisitionDate: '1985-06-12',
        operationalStatus: 'Operational', currentValue: 45000000, deferredMaintenance: 1200000, utilizationRate: 98,
        missionDependency: 'Critical', jurisdiction: 'Exclusive', accountableDistrict: 'MVK', custody: 'USACE',
        sourceSystem: 'REMIS', originatingOrg: 'ERDC', a123Status: 'Certified', auditLog: [], versionHistory: []
    }
];

// Added missing MOCK_ASSETS alias
export const MOCK_ASSETS = MOCK_REMIS_ASSETS;

export const MOCK_REMIS_OUTGRANTS: Outgrant[] = [
    {
        id: 'DACA01-1-24-001', grantee: 'Coastal Wind Power LLC', type: 'Lease', authority: '10 USC 2667',
        permittedUse: 'Wind Turbine Placement', location: 'Section A, Fort Story', annualRent: 125000,
        termStart: '2024-01-01', expirationDate: '2049-12-31', status: 'Active', paymentFrequency: 'Annual',
        nextPaymentDate: '2025-01-01', assetId: 'RPUID-110022', auditLog: [], versionHistory: []
    }
];

export const MOCK_REMIS_DISPOSALS: DisposalAction[] = [
    {
        id: 'DISP-24-101', assetId: 'RPUID-882103', type: 'Public Sale', screeningStatus: 'Federal Screening',
        reportedExcessDate: '2024-01-10', estimatedProceeds: 1100000, auditLog: [], versionHistory: []
    }
];

// Added missing MOCK_REMIS_ENCROACHMENTS
export const MOCK_REMIS_ENCROACHMENTS: EncroachmentCase[] = [
    { id: 'ENC-24-001', assetId: 'RPUID-662104', locationDescription: 'North Fence Perimeter', type: 'Structure', discoveryDate: '2024-01-15', description: 'Unauthorized shed structure found on government easement.', status: 'Reported', responsibleOfficial: 'Ranger Smith', tasks: [], auditLog: [] }
];

// Added missing MOCK_REMIS_APPRAISALS
export const MOCK_REMIS_APPRAISALS: AppraisalRecord[] = [
    { id: 'APP-2024-001', assetId: 'RPUID-662104', status: 'Approved', standard: 'Yellow Book (UASFLA)', valuationDate: '2023-12-01', appraiserName: 'James Sterling', appraiserQualifications: 'MAI, SRA', purpose: 'Fair Market Value', scope: 'Narrative', marketValue: 45000000, limitingConditions: [], extraordinaryAssumptions: [], revisions: [], auditLog: [] }
];

// Added missing MOCK_HAP_CASES
export const MOCK_HAP_CASES: HAPCase[] = [
    { id: 'HAP-24-01', applicantName: 'SGT Michael Brown', applicantType: 'Military - PCS', propertyAddress: '123 Army Way, Fayetteville NC', programType: 'Expanded HAP', submissionDate: '2024-02-10', status: 'Valuation Review', purchasePrice: 250000, purchaseDate: '2020-05-01', mortgageBalance: 235000, benefitAmount: 0, assignedOfficer: 'Officer Jones', pcsOrderDate: '2024-01-15' }
];

// Added missing MOCK_LGH_LEASES
export const MOCK_LGH_LEASES: LGHLease[] = [
    { id: 'L-24-01', leaseNumber: 'W912QR-L-24-001', propertyName: 'Fort Knox Housing Complex', address: 'Fort Knox, KY', lessor: 'Knox Housing LLC', annualRent: 2500000, startDate: '2024-01-01', expirationDate: '2034-12-31', status: 'Active', occupancyRate: 95, units: 150, scoring: 'Operating', fairMarketValue: 25000000, auditLog: [] }
];

// Added missing MOCK_BRAC_INSTALLATIONS
export const MOCK_BRAC_INSTALLATIONS: BracInstallation[] = [
    { id: 'INST-001', name: 'Fort Discovery', service: 'Army', region: 'Southeast', isJointBase: false, currentTroopDensity: 12000, totalForceCapacity: 15000, availableAcreage: 25000, conditionCode: 82, projected20YearReq: 10000, economicData: { regionalEmployment: 250000, defenseDependencyIndex: 0.12 }, infrastructure: { schoolCapacityPct: 85, hospitalBedsPer1000: 2.4, highwayLevelOfService: 'B' }, environmental: { hasSuperfundSite: false, rmisCleanupEstimate: 0 } }
];

// Added missing MOCK_BRAC_SCENARIOS
export const MOCK_BRAC_SCENARIOS: BracScenario[] = [
    { id: 'SCN-001', name: 'Southeast Consolidation', fiscalYear: 2025, status: 'Draft', losingInstallationId: 'INST-001', personnelMoving: 2000, oneTimeMovingCost: 45000000, milconCost: 125000000, annualSavings: 35000000, auditLog: [] }
];
