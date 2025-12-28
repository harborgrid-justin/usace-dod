
import { AuditLogEntry, VersionEntry } from './shared_records';
import { A123Status, CostShareStatus } from './common';

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

export type OutgrantType = 'Lease' | 'Easement' | 'License' | 'Permit';
export type OutgrantStatus = 'Proposed' | 'Active' | 'Amended' | 'Suspended' | 'Expired' | 'Terminated' | 'Closed' | 'Archived';

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
    auditLog: AuditLogEntry[];
    versionHistory: VersionEntry<Outgrant>[];
}

/**
 * Appraisal Management
 */
export type AppraisalStandard = 'Yellow Book (UASFLA)' | 'USPAP';
export type AppraisalStatus = 'Initiated' | 'In-Progress' | 'Under Review' | 'Approved';
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
    technicalReview?: AppraisalReview;
    revisions: any[];
    auditLog: AuditLogEntry[];
}

export interface AppraisalReview {
    date: string;
    reviewerId: string;
    findings: string;
    isTechnicallySufficient: boolean;
}

/**
 * Disposal and Excess Management
 */
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

/**
 * Encroachment and Use Management
 */
export type EncroachmentType = 'Structure' | 'Vegetation' | 'Unauthorized Use' | 'Boundary Dispute';
export type EncroachmentStatus = 'Reported' | 'Under Investigation' | 'Resolved' | 'Litigation' | 'Archived' | 'Closed';
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

export type TaskStatus = 'Assigned' | 'In-Progress' | 'Completed' | 'Closed';
export interface EncroachmentTask {
    id: string;
    description: string;
    assignedTo: string;
    status: TaskStatus;
}

/**
 * Geospatial Types
 */
export type GeoLayer = 'Real Property' | 'Tasks' | 'Encumbrance' | 'Environment';
export type GeoLifecycleState = 'Draft' | 'Published' | 'Archived';
export interface GeospatialFeature {
    id: string;
    assetName: string;
    type: 'Point' | 'Polygon';
    status: GeoLifecycleState;
    layer: GeoLayer;
    coordinates: { x: number, y: number };
    metadata: {
        source: string;
        accuracy: string;
        collectionMethod: string;
        captureDate: string;
        responsibleOfficial: string;
    };
    auditLog: AuditLogEntry[];
}

/**
 * Acquisition types used in REMIS context
 */
export interface Solicitation {
    id: string;
    assetId: string;
    prId?: string;
    status: SolicitationStatus;
    title: string;
    type: 'RFQ' | 'RFP' | 'IFB';
    bidItems?: BidItem[];
    quotes: VendorQuote[];
    marketResearch?: MarketResearchReport;
    statementOfWork?: string;
    auditLog: AuditLogEntry[];
}

export type SolicitationStatus = 'Requirement Refinement' | 'Market Research' | 'Active Solicitation' | 'Evaluating Quotes' | 'Ready for Award' | 'Awarded' | 'Closed';

export interface BidItem {
    id: string;
    description: string;
    unit: string;
    quantity: number;
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

export interface MarketResearchReport {
    naicsCode: string;
    smallBusinessSetAside: boolean;
    estimatedMarketPrice: number;
    competitors: string[];
    aiNarrative: string;
}

/**
 * Cost Sharing (PPA)
 */
export interface CostShareRecord {
    id: string;
    projectOrAssetId: string;
    authority: string;
    sponsorName: string;
    percentage: { federal: number, nonFederal: number };
    contributionType: 'Cash' | 'In-Kind' | 'LERRD' | 'Work-in-Kind';
    valuationMethod: 'Standard' | 'Appraisal' | 'Audit';
    status: CostShareStatus;
    agreementDate: string;
    totalValue: number;
    contributedValue: number;
    auditLog: AuditLogEntry[];
    adjustments: CostShareAdjustment[];
}

export interface CostShareAdjustment {
    id: string;
    date: string;
    type: 'Contribution' | 'Valuation Change';
    amountDelta: number;
    justification: string;
    authorizedBy: string;
}

/**
 * Relocation Assistance
 */
export type RelocationCaseStatus = 'Initiated' | 'Eligibility Determined' | 'Assistance Approved' | 'Assistance Provided' | 'Closed';
export interface RelocationCase {
    id: string;
    assetId: string;
    displacedPersonName: string;
    displacedEntityType: 'Individual' | 'Business' | 'Non-Profit';
    eligibilityStatus: 'Eligible' | 'Not Eligible' | 'Pending';
    status: RelocationCaseStatus;
    initiationDate: string;
    benefits: RelocationBenefit[];
    auditLog: AuditLogEntry[];
    linkedRecords: { acquisitionId?: string };
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

/**
 * HAP Case Management
 */
export type HAPCaseStatus = 'New' | 'Valuation Review' | 'Benefit Calculation' | 'Legal Review' | 'Approved' | 'Paid' | 'Denied' | 'Closed';
export interface HAPCase {
    id: string;
    applicantName: string;
    applicantType: string;
    propertyAddress: string;
    programType: string;
    submissionDate: string;
    status: HAPCaseStatus;
    purchasePrice: number;
    purchaseDate: string;
    mortgageBalance: number;
    benefitAmount: number;
    assignedOfficer: string;
    pcsOrderDate: string;
    currentFairMarketValue?: number;
}

/**
 * LGH Portfolio Management
 */
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

/**
 * BRAC DSS Data
 */
export interface BracInstallation {
    id: string;
    name: string;
    service: string;
    region: string;
    isJointBase: boolean;
    currentTroopDensity: number;
    totalForceCapacity: number;
    availableAcreage: number;
    conditionCode: number;
    projected20YearReq: number;
    economicData: {
        regionalEmployment: number;
        defenseDependencyIndex: number;
    };
    infrastructure: {
        schoolCapacityPct: number;
        hospitalBedsPer1000: number;
        highwayLevelOfService: string;
    };
    environmental: {
        hasSuperfundSite: boolean;
        rmisCleanupEstimate: number;
    };
}

export interface BracScenario {
    id: string;
    name: string;
    fiscalYear: number;
    status: 'Draft' | 'Final' | 'Legislatively Locked';
    losingInstallationId: string;
    gainingInstallationId?: string;
    personnelMoving: number;
    oneTimeMovingCost: number;
    milconCost: number;
    annualSavings: number;
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

/**
 * Component Dashboards
 */
export interface EncroachmentDashboardProps {
    onNavigateToGis: () => void;
}

export interface DisposalDashboardProps {
    onNavigateToAsset: (id: string) => void;
    onNavigateToSolicitation: (id: string) => void;
}

export interface RelocationDashboardProps {
    onNavigateToAcquisition: (id: string) => void;
}

/**
 * General Asset Details
 */
export type AssetLifecycleStatus = 'Planning' | 'Acquisition' | 'CIP' | 'In Service' | 'Modification' | 'Disposal';
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
    assetClass: 'Vessel' | 'Building' | 'Equipment' | 'Software' | 'Land';
    status: AssetLifecycleStatus;
    acquisitionCost: number;
    residualValue: number;
    usefulLife: number;
    placedInServiceDate?: string;
    pripAuthorized: boolean;
    plantIncrementWaiver: { active: boolean };
    components: DepreciationComponent[];
    accumulatedDepreciation: number;
    auditLog: AssetHistoryEvent[];
}

export interface AssetHistoryEvent {
    timestamp: string;
    user: string;
    event: string;
    details: string;
}

/**
 * Maintenance and Inventory
 */
export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    quantityOnHand: number;
    reorderPoint: number;
    unitCost: number;
    unitOfMeasure: string;
    category: string;
    location: string;
    transactions: InventoryTransaction[];
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

export interface WorkOrder {
    id: string;
    description: string;
    status: string;
    laborEntries: LaborEntry[];
    materialEntries: MaterialEntry[];
    serviceEntries: ServiceEntry[];
    totalCost: number;
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

export interface Vendor {
    id: string;
    name: string;
    serviceType: string;
}

/**
 * Outgrant Inspections and Utilization
 */
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
    assetId: string;
    period: string;
    occupancyRate: number;
    utilizationScore: number;
    findings: string;
}
