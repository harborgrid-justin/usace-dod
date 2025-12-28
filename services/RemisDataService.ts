import { 
    RealPropertyAsset, Outgrant, EncroachmentCase, GeospatialFeature, 
    DisposalAction, CostShareRecord, CostShareAdjustment, Solicitation, 
    RelocationCase, A123Status, ReportMetadata,
    AppraisalRecord, HAPCase, LGHLease, BracInstallation, BracScenario,
    RetrievalLogEntry
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

class RemisDataService {
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
    
    private retrievalLogs: RetrievalLogEntry[] = [];
    private listeners: Set<Function> = new Set();

    getAssets() { return this.assets.filter(a => a.status !== 'Retired'); }
    // Added missing methods for reports and audit
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
    getRetrievalLogs() { return this.retrievalLogs; }

    addAsset(asset: RealPropertyAsset) { this.assets = [asset, ...this.assets]; this.notifyListeners(); return asset; }
    updateAsset(updatedAsset: RealPropertyAsset) { this.assets = this.assets.map(a => a.rpuid === updatedAsset.rpuid ? updatedAsset : a); this.notifyListeners(); }
    addHAPCase(c: HAPCase) { this.hapCases = [c, ...this.hapCases]; this.notifyListeners(); }
    updateHAPCase(updated: HAPCase) { this.hapCases = this.hapCases.map(c => c.id === updated.id ? updated : c); this.notifyListeners(); }
    addLGHLease(l: LGHLease) { this.lghLeases = [l, ...this.lghLeases]; this.notifyListeners(); }
    updateLGHLease(updated: LGHLease) { this.lghLeases = this.lghLeases.map(l => l.id === updated.id ? updated : l); this.notifyListeners(); }
    addOutgrant(o: Outgrant) { this.outgrants = [o, ...this.outgrants]; this.notifyListeners(); }
    updateOutgrant(o: Outgrant) { this.outgrants = this.outgrants.map(item => item.id === o.id ? o : item); this.notifyListeners(); }
    addAppraisal(record: AppraisalRecord) { this.appraisals = [{ ...record, id: `APP-${Date.now()}` }, ...this.appraisals]; this.notifyListeners(); }
    updateAppraisal(updated: AppraisalRecord) { this.appraisals = this.appraisals.map(r => r.id === updated.id ? updated : r); this.notifyListeners(); }
    addCostShare(record: CostShareRecord) { this.costShares = [record, ...this.costShares]; this.notifyListeners(); }
    updateCostShare(record: CostShareRecord) { this.costShares = this.costShares.map(r => r.id === record.id ? record : r); this.notifyListeners(); }
    
    // Fix: Added missing addCostShareAdjustment
    addCostShareAdjustment(recordId: string, adj: CostShareAdjustment) {
        this.costShares = this.costShares.map(r => {
            if (r.id === recordId) {
                return { ...r, adjustments: [...r.adjustments, adj], contributedValue: r.contributedValue + adj.amountDelta };
            }
            return r;
        });
        this.notifyListeners();
    }

    // Fix: Added missing addSolicitation and updateSolicitation
    addSolicitation(sol: Solicitation) {
        this.solicitations = [sol, ...this.solicitations];
        this.notifyListeners();
    }
    updateSolicitation(updated: Solicitation) {
        this.solicitations = this.solicitations.map(s => s.id === updated.id ? updated : s);
        this.notifyListeners();
    }

    addEncroachment(c: EncroachmentCase) { this.encroachments = [c, ...this.encroachments]; this.notifyListeners(); }
    updateEncroachment(updated: EncroachmentCase) { this.encroachments = this.encroachments.map(e => e.id === updated.id ? updated : e); this.notifyListeners(); }
    addRelocationCase(c: RelocationCase) { this.relocationCases = [c, ...this.relocationCases]; this.notifyListeners(); }
    updateRelocationCase(c: RelocationCase) { this.relocationCases = this.relocationCases.map(item => item.id === c.id ? c : item); this.notifyListeners(); }
    
    // Fix: Added missing initiateDisposalAction and updateDisposal
    initiateDisposalAction(assetId: string, type: DisposalAction['type'], proceeds: number, user: string) {
        const newAction: DisposalAction = {
            id: `DISP-${Date.now()}`,
            assetId,
            type,
            estimatedProceeds: proceeds,
            screeningStatus: 'Submitted',
            reportedExcessDate: new Date().toISOString().split('T')[0],
            auditLog: [{ timestamp: new Date().toISOString(), user, action: 'Initiated' }],
            versionHistory: []
        };
        this.disposals = [newAction, ...this.disposals];
        this.notifyListeners();
    }
    updateDisposal(id: string, updates: Partial<DisposalAction>) {
        this.disposals = this.disposals.map(d => d.id === id ? { ...d, ...updates } : d);
        this.notifyListeners();
    }

    updateA123Status(id: string, status: A123Status, reason: string) {
        this.assets = this.assets.map(a => a.rpuid === id ? { ...a, a123Status: status } : a);
        this.notifyListeners();
    }
    addFeature(f: GeospatialFeature) { this.features = [f, ...this.features]; this.notifyListeners(); }
    updateFeature(f: GeospatialFeature) { this.features = this.features.map(item => item.id === f.id ? f : item); this.notifyListeners(); }

    // Fix: Added missing logRetrieval and generateStandardReport
    logRetrieval(entityId: string, entityType: RetrievalLogEntry['entityType'], purpose: string) {
        this.retrievalLogs.unshift({
            timestamp: new Date().toISOString(),
            user: 'CURRENT_USER',
            entityId,
            entityType,
            accessRole: 'ADMIN',
            purpose
        });
        this.notifyListeners();
    }

    generateStandardReport(type: string, params: any): ReportMetadata {
        return {
            id: `REP-${Date.now()}`,
            generatedBy: 'CURRENT_USER',
            timestamp: new Date().toISOString(),
            reportType: type,
            parameters: JSON.stringify(params),
            hash: 'SHA256-MOCK'
        };
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
