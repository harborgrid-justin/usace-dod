
import { 
    RealPropertyAsset, Outgrant, EncroachmentCase, DisposalAction, 
    AppraisalRecord, HAPCase, LGHLease, BracInstallation, 
    BracScenario, GeospatialFeature, A123Status, CostShareRecord, 
    RelocationCase, Solicitation, CostShareAdjustment 
} from '../types';
import { 
    MOCK_REMIS_ASSETS, MOCK_REMIS_OUTGRANTS, MOCK_REMIS_ENCROACHMENTS, 
    MOCK_REMIS_DISPOSALS, MOCK_REMIS_APPRAISALS, MOCK_HAP_CASES, 
    MOCK_LGH_LEASES, MOCK_BRAC_INSTALLATIONS, MOCK_BRAC_SCENARIOS 
} from '../constants';

export const AUTHORITATIVE_SOURCE_ID = 'REMIS_AUTH_01';

export interface RPA_Requirement {
    id: string;
    title: string;
    priority: 'Critical' | 'High' | 'Normal';
    estCost: number;
    wbsCode: string;
    status: 'Identifying' | 'Validation' | 'G-8 Review' | 'Ready for Solicitation';
    justification: string;
}

const MOCK_REMIS_REQS: RPA_Requirement[] = [
    { id: 'REQ-101', title: 'Perimeter Security Upgrade - Fort Knox', priority: 'High', estCost: 1250000, wbsCode: 'FK.24.S1', status: 'G-8 Review', justification: 'Mitigation of identified trespass risks at North Gate.' },
    { id: 'REQ-102', title: 'HVAC Modernization - District HQ', priority: 'Normal', estCost: 450000, wbsCode: 'HQ.24.M2', status: 'Validation', justification: 'Energy efficiency mandate compliance.' }
];

class RemisDataService {
    private assets: RealPropertyAsset[] = JSON.parse(JSON.stringify(MOCK_REMIS_ASSETS));
    private outgrants: Outgrant[] = JSON.parse(JSON.stringify(MOCK_REMIS_OUTGRANTS));
    private encroachments: EncroachmentCase[] = JSON.parse(JSON.stringify(MOCK_REMIS_ENCROACHMENTS));
    private disposals: DisposalAction[] = JSON.parse(JSON.stringify(MOCK_REMIS_DISPOSALS));
    private appraisals: AppraisalRecord[] = JSON.parse(JSON.stringify(MOCK_REMIS_APPRAISALS));
    private hapCases: HAPCase[] = JSON.parse(JSON.stringify(MOCK_HAP_CASES));
    private lghLeases: LGHLease[] = JSON.parse(JSON.stringify(MOCK_LGH_LEASES));
    private bracInst: BracInstallation[] = JSON.parse(JSON.stringify(MOCK_BRAC_INSTALLATIONS));
    private bracScen: BracScenario[] = JSON.parse(JSON.stringify(MOCK_BRAC_SCENARIOS));
    private requirements: RPA_Requirement[] = JSON.parse(JSON.stringify(MOCK_REMIS_REQS));
    
    private costShares: CostShareRecord[] = [];
    private relocationCases: RelocationCase[] = [];
    private solicitations: Solicitation[] = [];
    private features: GeospatialFeature[] = [];
    private listeners = new Set<Function>();

    // --- Accessors ---
    getAssets = () => this.assets;
    getOutgrants = () => this.outgrants;
    getDisposals = () => this.disposals;
    getEncroachments = () => this.encroachments;
    getAppraisals = () => this.appraisals;
    getHAPCases = () => this.hapCases;
    getLGHLeases = () => this.lghLeases;
    getBracInstallations = () => this.bracInst;
    getBracScenarios = () => this.bracScen;
    getCostShares = () => this.costShares;
    getRelocationCases = () => this.relocationCases;
    getSolicitations = () => this.solicitations;
    getFeatures = () => this.features;
    getRequirements = () => this.requirements;

    // --- Mutators ---
    addAsset = (a: RealPropertyAsset) => { this.assets = [a, ...this.assets]; this.notify(); };
    updateAsset = (a: RealPropertyAsset) => { this.assets = this.assets.map(x => x.rpuid === a.rpuid ? a : x); this.notify(); };
    addOutgrant = (o: Outgrant) => { this.outgrants = [o, ...this.outgrants]; this.notify(); };
    updateOutgrant = (o: Outgrant) => { this.outgrants = this.outgrants.map(x => x.id === o.id ? o : x); this.notify(); };
    addAppraisal = (r: AppraisalRecord) => { this.appraisals = [r, ...this.appraisals]; this.notify(); };
    updateAppraisal = (r: AppraisalRecord) => { this.appraisals = this.appraisals.map(x => x.id === r.id ? r : x); this.notify(); };
    addEncroachment = (e: EncroachmentCase) => { this.encroachments = [e, ...this.encroachments]; this.notify(); };
    updateEncroachment = (e: EncroachmentCase) => { this.encroachments = this.encroachments.map(x => x.id === e.id ? e : x); this.notify(); };
    addDisposal = (d: DisposalAction) => { this.disposals = [d, ...this.disposals]; this.notify(); };
    updateDisposal = (id: string, updates: Partial<DisposalAction>) => { this.disposals = this.disposals.map(x => x.id === id ? { ...x, ...updates } : x); this.notify(); };
    addHAPCase = (c: HAPCase) => { this.hapCases = [c, ...this.hapCases]; this.notify(); };
    updateHAPCase = (c: HAPCase) => { this.hapCases = this.hapCases.map(x => x.id === c.id ? c : x); this.notify(); };
    addLGHLease = (l: LGHLease) => { this.lghLeases = [l, ...this.lghLeases]; this.notify(); };
    updateLGHLease = (l: LGHLease) => { this.lghLeases = this.lghLeases.map(x => x.id === l.id ? l : x); this.notify(); };
    addFeature = (f: GeospatialFeature) => { this.features = [f, ...this.features]; this.notify(); };
    updateFeature = (f: GeospatialFeature) => { this.features = this.features.map(x => x.id === f.id ? f : x); this.notify(); };
    addCostShare = (r: CostShareRecord) => { this.costShares = [r, ...this.costShares]; this.notify(); };
    updateCostShare = (r: CostShareRecord) => { this.costShares = this.costShares.map(x => x.id === r.id ? r : x); this.notify(); };
    addRelocationCase = (c: RelocationCase) => { this.relocationCases = [c, ...this.relocationCases]; this.notify(); };
    updateRelocationCase = (c: RelocationCase) => { this.relocationCases = this.relocationCases.map(x => x.id === c.id ? c : x); this.notify(); };
    addSolicitation = (s: Solicitation) => { this.solicitations = [s, ...this.solicitations]; this.notify(); };
    updateSolicitation = (s: Solicitation) => { this.solicitations = this.solicitations.map(x => x.id === s.id ? s : x); this.notify(); };
    
    addRequirement = (r: RPA_Requirement) => { this.requirements = [r, ...this.requirements]; this.notify(); };
    updateRequirement = (updated: RPA_Requirement) => { this.requirements = this.requirements.map(r => r.id === updated.id ? updated : r); this.notify(); };

    logRetrieval = (entityId: string, entityType: string, purpose: string) => {
        console.debug(`[REMIS_AUDIT] Data Retrieval: ${entityType} ${entityId} for ${purpose}`);
    };

    initiateDisposalAction = (assetId: string, type: DisposalAction['type'], proceeds: number, user: string) => {
        const d: DisposalAction = {
            id: `DISP-${Date.now()}`,
            assetId,
            type,
            estimatedProceeds: proceeds,
            screeningStatus: 'Submitted',
            reportedExcessDate: new Date().toISOString().split('T')[0],
            auditLog: [{ timestamp: new Date().toISOString(), user, action: 'Initiated' }],
            versionHistory: []
        };
        this.disposals = [d, ...this.disposals];
        this.notify();
    };

    addCostShareAdjustment = (id: string, adj: CostShareAdjustment) => {
        this.costShares = this.costShares.map(r => 
            r.id === id ? { 
                ...r, 
                adjustments: [...(r.adjustments || []), adj],
                contributedValue: adj.type === 'Contribution' ? r.contributedValue + adj.amountDelta : r.contributedValue
            } : r
        );
        this.notify();
    };

    updateA123Status = (id: string, status: A123Status, reason: string) => {
        this.assets = this.assets.map(a => a.rpuid === id ? { ...a, a123Status: status } : a);
        this.notify();
    };

    subscribe = (fn: Function) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const remisService = new RemisDataService();
