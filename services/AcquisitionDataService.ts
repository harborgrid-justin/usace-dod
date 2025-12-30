import { 
    PurchaseRequest, Contract, Solicitation, VendorQuote, ContractMod, SolicitationStatus 
} from '../types';
import { MOCK_PURCHASE_REQUESTS, MOCK_CONTRACTS_LIST } from '../constants';

class AcquisitionDataService {
    private prs: PurchaseRequest[] = JSON.parse(JSON.stringify(MOCK_PURCHASE_REQUESTS));
    private contracts: Contract[] = JSON.parse(JSON.stringify(MOCK_CONTRACTS_LIST));
    private solicitations: Solicitation[] = [];
    private listeners = new Set<Function>();

    constructor() {
        // Hydrate solicitations from certified PRs
        this.solicitations = this.prs
            .filter(p => p.status === 'Funds Certified')
            .map(pr => ({
                id: `SOL-RE-${pr.id.slice(-5)}`,
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
                    details: `Auto-generated from PR ${pr.id}`
                }]
            }));
    }

    getPRs = () => this.prs;
    getContracts = () => this.contracts;
    getSolicitations = () => this.solicitations;

    addPR = (pr: PurchaseRequest) => { this.prs = [pr, ...this.prs]; this.notify(); };
    updatePR = (updatedPR: PurchaseRequest) => { this.prs = this.prs.map(p => p.id === updatedPR.id ? updatedPR : p); this.notify(); };
    addSolicitation = (sol: Solicitation) => { this.solicitations = [sol, ...this.solicitations]; this.notify(); };
    updateSolicitation = (s: Solicitation) => { this.solicitations = this.solicitations.map(x => x.id === s.id ? s : x); this.notify(); };

    advanceSolicitation = (id: string, status: SolicitationStatus, user: string) => {
        this.solicitations = this.solicitations.map(s => s.id === id ? {
            ...s, status, 
            auditLog: [...s.auditLog, { timestamp: new Date().toISOString(), user, action: 'Status Change', details: `Advanced to ${status}` }]
        } : s);
        this.notify();
    };

    addContract = (contract: Contract) => { this.contracts = [contract, ...this.contracts]; this.notify(); };
    updateContract = (updated: Contract) => { this.contracts = this.contracts.map(c => c.id === updated.id ? updated : c); this.notify(); };

    executeContractMod = (id: string, modData: Partial<ContractMod>, user: string) => {
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
                auditLog: [...c.auditLog, { timestamp: new Date().toISOString(), user, action: 'Mod Executed', details: newMod.description }]
            };
        });
        this.notify();
    };

    closeoutContract = (id: string, user: string) => {
        this.contracts = this.contracts.map(c => c.id === id ? { ...c, status: 'Closed' as any, auditLog: [...c.auditLog, { timestamp: new Date().toISOString(), user, action: 'Closeout' }] } : c);
        this.notify();
    };

    generateQuotes = (solId: string) => {
        this.solicitations = this.solicitations.map(sol => {
            if (sol.id !== solId) return sol;
            return {
                ...sol,
                status: 'Evaluating Quotes' as SolicitationStatus,
                quotes: [
                    { vendorId: 'V-001', vendorName: 'V-NEX SOLUTIONS LLC', uei: 'ABC123DEF', amount: 100000, technicalScore: 92, pastPerformanceScore: 95, isResponsive: true, isResponsible: true },
                    { vendorId: 'V-002', vendorName: 'ACME Defense', uei: 'GHI789JKL', amount: 105000, technicalScore: 85, pastPerformanceScore: 88, isResponsive: true, isResponsible: true },
                ]
            };
        });
        this.notify();
    };

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const acquisitionService = new AcquisitionDataService();