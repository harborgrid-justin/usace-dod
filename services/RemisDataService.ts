import { 
    RealPropertyAsset, Outgrant, EncroachmentCase, GeospatialFeature, 
    DisposalAction, CostShareRecord, CostShareAdjustment, Solicitation, 
    RelocationCase, A123Status, ReportMetadata,
    AppraisalRecord, HAPCase, LGHLease, BracInstallation, BracScenario
} from '../types';
import { 
    MOCK_REMIS_ASSETS, 
    MOCK_REMIS_SOLICITATIONS,
    MOCK_REMIS_OUTGRANTS,
    MOCK_REMIS_ENCROACHMENTS,
    MOCK_REMIS_DISPOSALS,
    MOCK_REMIS_COST_SHARES,
    MOCK_REMIS_RELOCATIONS,
    MOCK_REMIS_FEATURES,
    MOCK_REMIS_APPRAISALS,
    MOCK_HAP_CASES,
    MOCK_LGH_LEASES,
    MOCK_BRAC_INSTALLATIONS,
    MOCK_BRAC_SCENARIOS
} from '../constants';

export const AUTHORITATIVE_SOURCE_ID = 'REMIS-PRD-DB-01';

/**
 * RemisDataService
 * Singleton service for managing real property authoritative state.
 */
class RemisDataService {
    // Initializing state with class fields for better ESM reliability
    private assets: RealPropertyAsset[] = JSON.parse(JSON.stringify(MOCK_REMIS_ASSETS));
    private outgrants: Outgrant[] = JSON.parse(JSON.stringify(MOCK_REMIS_OUTGRANTS));
    private encroachments: EncroachmentCase[] = JSON.parse(JSON.stringify(MOCK_REMIS_ENCROACHMENTS));
    private features: GeospatialFeature[] = JSON.parse(JSON.stringify(MOCK_REMIS_FEATURES));
    private disposals: DisposalAction[] = JSON.parse(JSON.stringify(MOCK_REMIS_DISPOSALS));
    private costShares: CostShareRecord[] = JSON.parse(JSON.stringify(MOCK_REMIS_COST_SHARES));
    private solicitations: Solicitation[] = JSON.parse(JSON.stringify(MOCK_REMIS_SOLICITATIONS));
    private relocationCases: RelocationCase[] = JSON.parse(JSON.stringify(MOCK_REMIS_RELOCATIONS));
    private appraisals: AppraisalRecord[] = JSON.parse(JSON.stringify(MOCK_REMIS_APPRAISALS));
    private hapCases: HAPCase[] = JSON.parse(JSON.stringify(MOCK_HAP_CASES));
    private lghLeases: LGHLease[] = JSON.parse(JSON.stringify(MOCK_LGH_LEASES));
    private bracInstallations: BracInstallation[] = JSON.parse(JSON.stringify(MOCK_BRAC_INSTALLATIONS));
    private bracScenarios: BracScenario[] = JSON.parse(JSON.stringify(MOCK_BRAC_SCENARIOS));
    
    private retrievalLogs: any[] = [];
    private reportHistory: ReportMetadata[] = [];
    private listeners: Set<Function> = new Set();

    logRetrieval(id: string, type: any, purpose: string) {
        this.retrievalLogs = [{ timestamp: new Date().toISOString(), id, type, purpose }, ...this.retrievalLogs];
        this.notifyListeners();
    }

    // --- Data Accessors ---
    getRetrievalLogs() { return this.retrievalLogs; }
    getAssets() { return this.assets.filter(a => a.status !== 'Retired'); }
    getAllAssetsIncludeRetired() { return this.assets; }
    getOutgrants() { return this.outgrants; }
    getDisposals() { return this.disposals; }
    getEncroachments() { return this.encroachments; }
    getSolicitations() { return this.solicitations; }
    getRelocationCases() { return this.relocationCases; }
    getCostShares() { return this.costShares; }
    getAppraisals() { return this.appraisals; }
    getFeatures() { return this.features; }
    getHAPCases() { return this.hapCases; }
    getLGHLeases() { return this.lghLeases; }
    getBracInstallations() { return this.bracInstallations; }
    getBracScenarios() { return this.bracScenarios; }

    // --- State Mutations ---
    addAsset(asset: RealPropertyAsset) { this.assets = [asset, ...this.assets]; this.notifyListeners(); return asset; }
    updateAsset(updatedAsset: RealPropertyAsset) { this.assets = this.assets.map(a => a.rpuid === updatedAsset.rpuid ? updatedAsset : a); this.notifyListeners(); }
    addHAPCase(c: HAPCase) { this.hapCases = [c, ...this.hapCases]; this.notifyListeners(); }
    updateHAPCase(updated: HAPCase) { this.hapCases = this.hapCases.map(c => c.id === updated.id ? updated : c); this.notifyListeners(); }
    addLGHLease(l: LGHLease) { this.lghLeases = [l, ...this.lghLeases]; this.notifyListeners(); }
    updateLGHLease(updated: LGHLease) { this.lghLeases = this.lghLeases.map(l => l.id === updated.id ? updated : l); this.notifyListeners(); }
    updateBracScenario(updated: BracScenario) { this.bracScenarios = this.bracScenarios.map(s => s.id === updated.id ? updated : s); this.notifyListeners(); }
    addOutgrant(o: Outgrant) { this.outgrants = [o, ...this.outgrants]; this.notifyListeners(); }
    updateOutgrant(o: Outgrant) { this.outgrants = this.outgrants.map(item => item.id === o.id ? o : item); this.notifyListeners(); }
    addSolicitation(s: Solicitation) { this.solicitations = [s, ...this.solicitations]; this.notifyListeners(); }
    updateSolicitation(s: Solicitation) { this.solicitations = this.solicitations.map(item => item.id === s.id ? s : item); this.notifyListeners(); }
    
    // Fix: Added missing addAppraisal method required by AppraisalWorkspace.tsx.
    addAppraisal(record: AppraisalRecord) {
        const id = record.id || `APP-${Date.now().toString().slice(-5)}`;
        this.appraisals = [{ ...record, id }, ...this.appraisals];
        this.notifyListeners();
    }
    updateAppraisal(updated: AppraisalRecord) { this.appraisals = this.appraisals.map(r => r.id === updated.id ? updated : r); this.notifyListeners(); }
    addCostShare(record: CostShareRecord) { this.costShares = [record, ...this.costShares]; this.notifyListeners(); }
    updateCostShare(record: CostShareRecord) { this.costShares = this.costShares.map(r => r.id === record.id ? record : r); this.notifyListeners(); }
    
    // Fix: Added missing addCostShareAdjustment method required by CostShareManager.tsx.
    addCostShareAdjustment(id: string, adj: CostShareAdjustment) {
        this.costShares = this.costShares.map(r => 
            r.id === id ? { ...r, adjustments: [...(r.adjustments || []), adj] } : r
        );
        this.notifyListeners();
    }
    addEncroachment(c: EncroachmentCase) { this.encroachments = [c, ...this.encroachments]; this.notifyListeners(); }
    updateEncroachment(updated: EncroachmentCase) { this.encroachments = this.encroachments.map(e => e.id === updated.id ? updated : e); this.notifyListeners(); }
    addRelocationCase(c: RelocationCase) { this.relocationCases = [c, ...this.relocationCases]; this.notifyListeners(); }
    updateRelocationCase(c: RelocationCase) { this.relocationCases = this.relocationCases.map(item => item.id === c.id ? c : item); this.notifyListeners(); }
    updateA123Status(id: string, status: A123Status, reason: string) {
        this.assets = this.assets.map(a => a.rpuid === id ? { ...a, a123Status: status } : a);
        this.notifyListeners();
    }

    initiateDisposalAction(assetId: string, type: DisposalAction['type'], proceeds: number, user: string) {
        const newDisposal: DisposalAction = {
            id: `DISP-${Date.now().toString().slice(-5)}`,
            assetId, type, screeningStatus: 'Submitted', reportedExcessDate: new Date().toISOString().split('T')[0],
            estimatedProceeds: proceeds, auditLog: [{ timestamp: new Date().toISOString(), user, action: 'Initiated' }],
            versionHistory: []
        };
        this.disposals = [newDisposal, ...this.disposals];
        this.notifyListeners();
    }
    updateDisposal(id: string, updates: Partial<DisposalAction>) {
        this.disposals = this.disposals.map(d => d.id === id ? { ...d, ...updates } : d);
        this.notifyListeners();
    }

    addFeature(f: GeospatialFeature) { this.features = [f, ...this.features]; this.notifyListeners(); }
    updateFeature(f: GeospatialFeature) { this.features = this.features.map(item => item.id === f.id ? f : item); this.notifyListeners(); }

    generateStandardReport(type: string, params: any) {
        const meta: ReportMetadata = { id: `REP-${Date.now()}`, generatedBy: 'User', timestamp: new Date().toISOString(), reportType: type, parameters: JSON.stringify(params), hash: 'AUTH-SHA256' };
        this.reportHistory = [meta, ...this.reportHistory];
        this.notifyListeners();
        return meta;
    }

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const remisService = new RemisDataService();