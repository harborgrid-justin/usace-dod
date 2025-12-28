import { 
    GLTransaction, FundControlNode, ProjectOrder, USACEProject, Asset, 
    Obligation, Expense, Disbursement, TravelOrder, InventoryItem, 
    CDOTransaction, ReimbursableOrder, ContingencyOperation, CostTransfer, TravelVoucher,
    RealPropertyAsset, Outgrant, DisposalAction, RelocationBenefit, RelocationCase, Solicitation, Contract, PurchaseRequest, VendorQuote, SolicitationStatus, ContractMod
} from '../types';
import { generateSecureId, validateAuthority } from '../utils/security';
import { glService } from './GLDataService';
import { reimbursableService } from './ReimbursableDataService';
import { expenseDisburseService } from './ExpenseDisburseDataService';
import { acquisitionService } from './AcquisitionDataService';

export class AcquisitionOrchestrator {
    
    static getProjectTraceability(project: USACEProject) {
        return {
            funding: {
                fad: { id: 'FAD-CW-24-001', amount: 50000000 },
                allowance: { id: 'WA-LRL-24-A', amount: 5000000 },
                resourceEstimate: { id: `RE-FY26-${project.p2Number}`, status: 'Approved' },
                costShare: { id: 'PPA-2018-001', sponsor: project.costShare?.sponsorName }
            },
            acquisition: {
                pr: { id: 'PR-24-001', status: 'Certified' },
                solicitation: { id: 'SOL-24-0012', status: 'Closed' },
                contract: { id: 'W912QR-24-C-0001', vendor: 'V-NEX SOLUTIONS' },
                mod: { id: 'P00001', type: 'Administrative' }
            },
            execution: {
                workItems: project.id === 'PROJ-001' ? 12 : 4,
                labor: { hours: 1240, cost: 105400 },
                travel: { id: 'TO-24-001', status: 'Completed' }
            },
            accounting: {
                obligation: { id: 'GL-OBL-8821', amount: project.financials.obligated },
                expense: { id: 'EXP-001', status: 'Accrued' },
                disbursement: { id: 'DISB-001', status: 'Paid' }
            }
        };
    }

    static handleAssetLifecycleEvent(asset: RealPropertyAsset, event: 'create' | 'dispose') {
        let glEntry: GLTransaction | null = null;
        if (event === 'create') {
            glEntry = {
                id: generateSecureId('GL-CAP'),
                date: new Date().toISOString().split('T')[0],
                description: `Capitalization of Asset ${asset.rpuid}`,
                type: 'Capitalization',
                sourceModule: 'REMIS',
                referenceDoc: asset.rpuid,
                totalAmount: asset.currentValue,
                status: 'Posted', createdBy: 'SYSTEM_ORCHESTRATOR', lines: [
                    { ussglAccount: '171100', description: 'Land & Improvements', debit: asset.currentValue, credit: 0, fund: 'ARMY', costCenter: 'REMIS' },
                    { ussglAccount: '101000', description: 'Fund Balance w/ Treasury', debit: 0, credit: asset.currentValue, fund: 'ARMY', costCenter: 'REMIS' }
                ], auditLog: []
            };
        }
        if (glEntry) glService.addTransaction(glEntry);
    }

    static initiateSolicitation(prId: string): Solicitation {
        const newSol: Solicitation = {
            id: `SOL-RE-${prId.slice(-5)}`,
            assetId: 'PENDING',
            prId: prId,
            status: 'Requirement Refinement',
            title: `Solicitation for requirement: ${prId}`,
            type: 'RFQ',
            quotes: [],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM',
                action: 'Solicitation Initiated',
                details: `Auto-generated from PR ${prId}`
            }]
        };
        acquisitionService.addSolicitation(newSol);
        return newSol;
    }

    static awardContract(prId: string, vendorData: { name: string, uei: string, cageCode: string, amount: number }, user: string): Contract {
        return {
            id: `W912QR-24-C-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            vendor: vendorData.name,
            type: 'Firm Fixed Price',
            value: vendorData.amount,
            awardedDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            prReference: prId,
            uei: vendorData.uei,
            cageCode: vendorData.cageCode,
            periodOfPerformance: { start: new Date().toISOString().split('T')[0], end: '2025-09-30' },
            gInvoicingStatus: 'Accepted',
            isBerryCompliant: true,
            modifications: [],
            auditLog: []
        };
    }
}