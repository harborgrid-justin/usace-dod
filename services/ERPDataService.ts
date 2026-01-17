
import { IDOCInterface } from '../types';
import { MOCK_SPENDING_CHAIN, ERP_TCODES } from '../constants';

export interface SpendingChainDoc {
    type: string;
    docNumber: string;
    amount: number;
    status: string;
    linkedThreadId?: string;
}

export interface TCode {
    code: string;
    description: string;
    module: string;
    riskLevel: string;
}

export interface BatchJob {
    id: string;
    name: string;
    progress: number;
    status: 'Scheduled' | 'Running' | 'Complete' | 'Error';
    time: string;
}

class ERPDataService {
    private spendingChain: SpendingChainDoc[] = JSON.parse(JSON.stringify(MOCK_SPENDING_CHAIN));
    private tCodes: TCode[] = JSON.parse(JSON.stringify(ERP_TCODES));
    private idocs: IDOCInterface[] = [
        { id: '5501229', status: 'Success', direction: 'Inbound', partner: 'GSA_BUY', messageType: 'SHP_CON', timestamp: '14:20:11' },
        { id: '5501230', status: 'Warning', direction: 'Outbound', partner: 'TREASURY', messageType: 'PAY_ADV', timestamp: '14:21:45' },
        { id: '5501231', status: 'Success', direction: 'Inbound', partner: 'DFAS_IN', messageType: 'GL_POST', timestamp: '14:22:05' },
        { id: '5501232', status: 'Error', direction: 'Outbound', partner: 'WAWF', messageType: 'INV_RCV', timestamp: '14:24:12' }
    ];
    private batchJobs: BatchJob[] = [
        { id: 'B_001', name: 'GL Reconciliation', progress: 100, status: 'Complete', time: '14:02:11' },
        { id: 'B_002', name: 'Interest Calc (PPA)', progress: 42, status: 'Running', time: '14:22:05' },
        { id: 'B_003', name: 'Treasury Feed (SF-1151)', progress: 10, status: 'Scheduled', time: '15:00:00' }
    ];
    private listeners = new Set<Function>();

    // --- Accessors ---
    getSpendingChain = () => this.spendingChain;
    getTCodes = () => this.tCodes;
    getIDOCs = () => this.idocs;
    getBatchJobs = () => this.batchJobs;

    // --- Mutators ---
    addIDOC = (idoc: IDOCInterface) => {
        this.idocs = [idoc, ...this.idocs].slice(0, 50); // Keep last 50
        this.notify();
    };

    updateBatchJob = (updated: BatchJob) => {
        this.batchJobs = this.batchJobs.map(j => j.id === updated.id ? updated : j);
        this.notify();
    };

    // --- Subscription ---
    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const erpService = new ERPDataService();
