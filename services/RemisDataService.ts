import { 
    RealPropertyAsset, Outgrant, EncroachmentCase, GeospatialFeature, 
    DisposalAction, OutgrantInspection, UtilizationSummary, 
    CostShareRecord, CostShareAdjustment, Solicitation, 
    RelocationCase, RelocationBenefit, A123Status, ReportMetadata 
} from '../types';
import { MOCK_REMIS_ASSETS, MOCK_REMIS_SOLICITATIONS } from '../constants';

// Fix: Added missing export member AUTHORITATIVE_SOURCE_ID
export const AUTHORITATIVE_SOURCE_ID = 'REMIS-PRD-DB-01';

class RemisDataService {
    private assets: RealPropertyAsset[];
    private outgrants: Outgrant[] = [];
    private encroachments: EncroachmentCase[] = [];
    private features: GeospatialFeature[] = [];
    private disposals: DisposalAction[] = [];
    private costShares: CostShareRecord[] = [];
    private solicitations: Solicitation[];
    private relocationCases: RelocationCase[] = [];
    private retrievalLogs: any[] = [];
    private reportHistory: ReportMetadata[] = [];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.assets = JSON.parse(JSON.stringify(MOCK_REMIS_ASSETS));
        this.solicitations = JSON.parse(JSON.stringify(MOCK_REMIS_SOLICITATIONS));
    }

    logRetrieval(id: string, type: any, purpose: string) {
        this.retrievalLogs = [{ timestamp: new Date().toISOString(), id, type, purpose }, ...this.retrievalLogs];
    }

    getRetrievalLogs() { return this.retrievalLogs; }
    getAssets() { return this.assets.filter(a => a.status !== 'Retired'); }
    getAllAssetsIncludeRetired() { return this.assets; }
    getOutgrants() { return this.outgrants; }
    getDisposals() { return this.disposals; }
    getEncroachments() { return this.encroachments; }
    getSolicitations() { return this.solicitations; }
    getRelocationCases() { return this.relocationCases; }
    getCostShares() { return this.costShares; }

    addAsset(asset: RealPropertyAsset) {
        this.assets = [asset, ...this.assets];
        this.notifyListeners();
        return asset;
    }

    updateAsset(updatedAsset: RealPropertyAsset) {
        this.assets = this.assets.map(a => a.rpuid === updatedAsset.rpuid ? updatedAsset : a);
        this.notifyListeners();
    }

    retireAsset(rpuid: string, reason: string) {
        this.assets = this.assets.map(a => a.rpuid === rpuid ? { ...a, status: 'Retired' as any } : a);
        this.notifyListeners();
    }

    addOutgrant(o: Outgrant) {
        this.outgrants = [o, ...this.outgrants];
        this.notifyListeners();
    }

    updateOutgrant(o: Outgrant) {
        this.outgrants = this.outgrants.map(item => item.id === o.id ? o : item);
        this.notifyListeners();
    }

    addRelocationCase(c: RelocationCase) {
        this.relocationCases = [c, ...this.relocationCases];
        this.notifyListeners();
    }

    updateRelocationCase(c: RelocationCase) {
        this.relocationCases = this.relocationCases.map(item => item.id === c.id ? c : item);
        this.notifyListeners();
    }

    deleteRelocationCase(id: string) {
        this.relocationCases = this.relocationCases.filter(c => c.id !== id);
        this.notifyListeners();
    }

    addEncroachment(c: EncroachmentCase) {
        this.encroachments = [c, ...this.encroachments];
        this.notifyListeners();
    }

    updateEncroachment(updated: EncroachmentCase) {
        this.encroachments = this.encroachments.map(e => e.id === updated.id ? updated : e);
        this.notifyListeners();
    }

    addSolicitation(s: Solicitation) {
        this.solicitations = [s, ...this.solicitations];
        this.notifyListeners();
    }

    updateSolicitation(s: Solicitation) {
        this.solicitations = this.solicitations.map(item => item.id === s.id ? s : item);
        this.notifyListeners();
    }

    addFeature(f: GeospatialFeature) {
        this.features = [f, ...this.features];
        this.notifyListeners();
    }

    updateFeature(f: GeospatialFeature) {
        this.features = this.features.map(item => item.id === f.id ? f : item);
        this.notifyListeners();
    }

    getFeatures() { return this.features; }

    generateStandardReport(type: string, params: any) {
        const meta: ReportMetadata = { id: `REP-${Date.now()}`, generatedBy: 'User', timestamp: new Date().toISOString(), reportType: type, parameters: JSON.stringify(params), hash: 'AUTH-SHA256' };
        this.reportHistory = [meta, ...this.reportHistory];
        this.notifyListeners();
        return meta;
    }

    updateA123Status(id: string, status: A123Status, reason: string) {
        this.assets = this.assets.map(a => a.rpuid === id ? { ...a, a123Status: status } : a);
        this.notifyListeners();
    }

    // Fix: Added missing methods addCostShare, updateCostShare, addCostShareAdjustment
    addCostShare(record: CostShareRecord) {
        this.costShares = [record, ...this.costShares];
        this.notifyListeners();
    }

    updateCostShare(record: CostShareRecord) {
        this.costShares = this.costShares.map(r => r.id === record.id ? record : r);
        this.notifyListeners();
    }

    addCostShareAdjustment(id: string, adj: CostShareAdjustment) {
        this.costShares = this.costShares.map(r => {
            if (r.id === id) {
                return {
                    ...r,
                    contributedValue: r.contributedValue + adj.amountDelta,
                    adjustments: [...r.adjustments, adj]
                };
            }
            return r;
        });
        this.notifyListeners();
    }

    // Fix: Added missing initiateDisposalAction method
    initiateDisposalAction(assetId: string, type: DisposalAction['type'], proceeds: number, user: string) {
        const newDisposal: DisposalAction = {
            id: `DISP-${Date.now().toString().slice(-5)}`,
            assetId,
            type,
            screeningStatus: 'Submitted',
            reportedExcessDate: new Date().toISOString().split('T')[0],
            estimatedProceeds: proceeds,
            auditLog: [{ timestamp: new Date().toISOString(), user, action: 'Initiated' }],
            versionHistory: []
        };
        this.disposals = [newDisposal, ...this.disposals];
        this.notifyListeners();
    }

    // Fix: Added missing updateDisposal method
    updateDisposal(id: string, updates: Partial<DisposalAction>) {
        this.disposals = this.disposals.map(d => d.id === id ? { ...d, ...updates } : d);
        this.notifyListeners();
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