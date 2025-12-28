
import { 
    PurchaseRequest, Contract, Solicitation, VendorQuote, ContractMod, SolicitationStatus 
} from '../types';
import { MOCK_PURCHASE_REQUESTS, MOCK_CONTRACTS_LIST } from '../constants';

class AcquisitionDataService {
    private prs: PurchaseRequest[];
    private contracts: Contract[];
    private solicitations: Solicitation[];
    private listeners: Set<Function> = new Set();

    constructor() {
        this.prs = JSON.parse(JSON.stringify(MOCK_PURCHASE_REQUESTS));
        this.contracts = JSON.parse(JSON.stringify(MOCK_CONTRACTS_LIST));
        
        this.solicitations = this.prs
            .filter(p => p.status === 'Funds Certified')
            .map(pr => ({
                id: `SOL-RE-${pr.id.slice(-5)}`,
                // Fix: assetId is a required property in the Solicitation interface
                assetId: 'PENDING',
                prId: pr.id,
                status: 'Requirement Refinement' as SolicitationStatus,
                title: `Solicitation for: ${pr.description}`,
                type: 'RFQ',
                quotes: [],
                auditLog: [{
                    timestamp: new Date().toISOString(),
                    user: 'SYSTEM',
                    action: 'Solicitation Initiated',
                    details: `Auto-generated from existing certified PR ${pr.id}`
                }]
            }));
    }

    getPRs() { return this.prs; }
    getContracts() { return this.contracts; }
    getSolicitations() { return this.solicitations; }

    addPR(pr: PurchaseRequest) {
        this.prs = [pr, ...this.prs];
        this.notifyListeners();
    }

    updatePR(updatedPR: PurchaseRequest) {
        this.prs = this.prs.map(p => p.id === updatedPR.id ? updatedPR : p);
        this.notifyListeners();
    }

    addSolicitation(sol: Solicitation) {
        this.solicitations = [sol, ...this.solicitations];
        this.notifyListeners();
    }

    updateSolicitation(updatedSol: Solicitation) {
        this.solicitations = this.solicitations.map(s => s.id === updatedSol.id ? updatedSol : s);
        this.notifyListeners();
    }

    advanceSolicitation(id: string, status: SolicitationStatus, user: string) {
        this.solicitations = this.solicitations.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    status,
                    auditLog: [...s.auditLog, {
                        timestamp: new Date().toISOString(),
                        user,
                        action: 'Status Change',
                        details: `Advanced to ${status}`
                    }]
                };
            }
            return s;
        });
        this.notifyListeners();
    }

    addContract(contract: Contract) {
        this.contracts = [contract, ...this.contracts];
        this.notifyListeners();
    }

    updateContract(updated: Contract) {
        this.contracts = this.contracts.map(c => c.id === updated.id ? updated : c);
        this.notifyListeners();
    }

    executeContractMod(id: string, modData: Partial<ContractMod>, user: string) {
        this.contracts = this.contracts.map(c => {
            if (c.id !== id) return c;
            const newMod: ContractMod = {
                id: `MOD-${c.id}-${c.modifications.length + 1}`,
                modNumber: `P0000${c.modifications.length + 1}`,
                date: new Date().toISOString().split('T')[0],
                amountDelta: modData.amountDelta || 0,
                description: modData.description || 'Adjustment',
                authority: modData.authority || 'FAR 43.103',
                status: 'Executed'
            };
            return {
                ...c,
                value: c.value + newMod.amountDelta,
                modifications: [...c.modifications, newMod],
                auditLog: [...c.auditLog, {
                    timestamp: new Date().toISOString(),
                    user,
                    action: 'Contract Modification',
                    details: `Mod ${newMod.modNumber} executed for ${newMod.amountDelta}`
                }]
            };
        });
        this.notifyListeners();
    }

    closeoutContract(id: string, user: string) {
        this.contracts = this.contracts.map(c => 
            c.id === id ? { ...c, status: 'Closed', auditLog: [...c.auditLog, { timestamp: new Date().toISOString(), user, action: 'Contract Closeout' }] } : c
        );
        this.notifyListeners();
    }

    generateQuotes(solId: string) {
        this.solicitations = this.solicitations.map(sol => {
            if (sol.id !== solId) return sol;
            return {
                ...sol,
                status: 'Evaluating Quotes',
                quotes: [
                    { vendorId: 'V-001', vendorName: 'V-NEX SOLUTIONS LLC', uei: 'ABC123DEF', amount: 100000, technicalScore: 92, pastPerformanceScore: 95, isResponsive: true, isResponsible: true },
                    { vendorId: 'V-002', vendorName: 'ACME Defense', uei: 'GHI789JKL', amount: 105000, technicalScore: 85, pastPerformanceScore: 88, isResponsive: true, isResponsible: true },
                ]
            };
        });
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

export const acquisitionService = new AcquisitionDataService();
