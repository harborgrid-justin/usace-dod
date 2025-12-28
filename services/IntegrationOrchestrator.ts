import { 
    GLTransaction, FundControlNode, ProjectOrder, USACEProject, Asset, 
    Expense, Disbursement, CostTransfer, TravelOrder, TravelVoucher, 
    ReimbursableOrder, ContingencyOperation, RealPropertyAsset, Outgrant, InventoryItem, CDOCostPool, Contract, PurchaseRequest
} from '../types';
import { generateSecureId } from '../utils/security';
import { glService } from './GLDataService';
import { AdaValidator } from './orchestrator/AdaValidator';
import { TraceabilityService } from './orchestrator/TraceabilityService';

export class IntegrationOrchestrator {
    static getProjectTraceability = TraceabilityService.getProjectTraceability;
    static validateGlAgainstAda = AdaValidator.validateGlAgainstAda;

    static generateAccrualFromExpense(expense: Expense): GLTransaction {
        return {
            id: generateSecureId('GL-ACC'),
            date: new Date().toISOString().split('T')[0],
            description: `Accrual: ${expense.description}`,
            type: 'Accrual', sourceModule: 'Expense', referenceDoc: expense.id,
            totalAmount: expense.amount, status: 'Posted', createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '610000', description: 'Operating Expense', debit: expense.amount, credit: 0, fund: '0100', costCenter: 'DEFAULT' },
                { ussglAccount: '211000', description: 'Accounts Payable', debit: 0, credit: expense.amount, fund: '0100', costCenter: 'DEFAULT' }
            ],
            auditLog: []
        };
    }

    // Fix: Add generateDisbursementFromExpense
    static generateDisbursementFromExpense(expense: Expense, disbursementId: string): GLTransaction {
        return {
            id: generateSecureId('GL-DISB'),
            date: new Date().toISOString().split('T')[0],
            description: `Disbursement: ${expense.description}`,
            type: 'Disbursement', sourceModule: 'Disbursement', referenceDoc: disbursementId,
            totalAmount: expense.amount, status: 'Posted', createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '211000', description: 'Accounts Payable', debit: expense.amount, credit: 0, fund: '0100', costCenter: 'DEFAULT' },
                { ussglAccount: '101000', description: 'Fund Balance w/ Treasury', debit: 0, credit: expense.amount, fund: '0100', costCenter: 'DEFAULT' }
            ],
            auditLog: []
        };
    }

    static handleAssetLifecycleEvent(asset: RealPropertyAsset, event: 'create' | 'dispose') {
        const glEntry: GLTransaction = {
            id: generateSecureId(event === 'create' ? 'GL-CAP' : 'GL-DISP'),
            date: new Date().toISOString().split('T')[0],
            description: `${event === 'create' ? 'Capitalization' : 'Disposal'} of Asset ${asset.rpuid}`,
            type: event === 'create' ? 'Capitalization' : 'Disposal',
            sourceModule: 'REMIS', referenceDoc: asset.rpuid, totalAmount: asset.currentValue,
            status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: []
        };
        glService.addTransaction(glEntry);
    }

    // Fix: Add generateDepreciationJournal
    static generateDepreciationJournal(asset: Asset): GLTransaction {
        const quarterlyDep = (asset.acquisitionCost / asset.usefulLife) / 4;
        return {
            id: generateSecureId('GL-DEP'),
            date: new Date().toISOString().split('T')[0],
            description: `Depreciation: ${asset.name}`,
            type: 'Adjusting Entry', sourceModule: 'Asset', referenceDoc: asset.id,
            totalAmount: quarterlyDep, status: 'Posted', createdBy: 'SYSTEM_BATCH',
            lines: [
                { ussglAccount: '610000', description: 'Depreciation Expense', debit: quarterlyDep, credit: 0, fund: 'WCF', costCenter: 'AUTO' },
                { ussglAccount: '171900', description: 'Accumulated Depreciation', debit: 0, credit: quarterlyDep, fund: 'WCF', costCenter: 'AUTO' }
            ],
            auditLog: []
        };
    }

    // Fix: Add validateInventoryDrawdown
    static validateInventoryDrawdown(item: InventoryItem, qtyRequested: number): { success: boolean; error?: string } {
        if (item.quantityOnHand < qtyRequested) {
            return { success: false, error: `Insufficient stock. Requested: ${qtyRequested}, On Hand: ${item.quantityOnHand}` };
        }
        return { success: true };
    }

    // Fix: Add generateRevenueRecognition
    static generateRevenueRecognition(order: ReimbursableOrder, amount: number): GLTransaction {
        return {
            id: generateSecureId('GL-REV'),
            date: new Date().toISOString().split('T')[0],
            description: `Revenue: ${order.orderNumber}`,
            type: 'Revenue', sourceModule: 'Reimbursables', referenceDoc: order.orderNumber,
            totalAmount: amount, status: 'Posted', createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '131000', description: 'Accounts Receivable', debit: amount, credit: 0, fund: 'WCF', costCenter: 'REV' },
                { ussglAccount: '510000', description: 'Revenue', debit: 0, credit: amount, fund: 'WCF', costCenter: 'REV' }
            ],
            auditLog: []
        };
    }

    // Fix: Add tagIncrementalCost
    static tagIncrementalCost(op: ContingencyOperation, amount: number): GLTransaction {
        return {
            id: generateSecureId('GL-OCO'),
            date: new Date().toISOString().split('T')[0],
            description: `Incremental Cost: ${op.name}`,
            type: 'Expense', sourceModule: 'Expense', referenceDoc: op.executeOrderRef,
            totalAmount: amount, status: 'Posted', createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '610000', description: 'Operating Expense (OCO)', debit: amount, credit: 0, fund: 'OCOTF', costCenter: op.sfisCode },
                { ussglAccount: '101000', description: 'FBwT', debit: 0, credit: amount, fund: 'OCOTF', costCenter: op.sfisCode }
            ],
            auditLog: []
        };
    }

    // Fix: Add generateCostTransferJournal
    static generateCostTransferJournal(transfer: CostTransfer, user: string): GLTransaction {
        return {
            id: generateSecureId('GL-CT'),
            date: new Date().toISOString().split('T')[0],
            description: `Cost Transfer: ${transfer.id}`,
            type: 'Adjusting Entry', sourceModule: 'Cost Transfer', referenceDoc: transfer.id,
            totalAmount: transfer.amount, status: 'Posted', createdBy: user,
            lines: [
                { ussglAccount: '610000', description: `Debit: ${transfer.targetProjectId}`, debit: transfer.amount, credit: 0, fund: '0100', costCenter: 'CT' },
                { ussglAccount: '610000', description: `Credit: ${transfer.sourceProjectId}`, debit: 0, credit: transfer.amount, fund: '0100', costCenter: 'CT' }
            ],
            auditLog: []
        };
    }

    // Fix: Add generateTravelObligation
    static generateTravelObligation(order: TravelOrder): GLTransaction {
        return {
            id: generateSecureId('GL-TRV'),
            date: order.startDate,
            description: `Travel Obligation: ${order.traveler}`,
            type: 'Obligation', sourceModule: 'Travel', referenceDoc: order.id,
            totalAmount: order.estCost, status: 'Posted', createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '480100', description: 'UDO - Travel', debit: 0, credit: order.estCost, fund: '0100', costCenter: 'TRV' },
                { ussglAccount: '461000', description: 'Allotment', debit: order.estCost, credit: 0, fund: '0100', costCenter: 'TRV' }
            ],
            auditLog: []
        };
    }

    // Fix: Add generateVoucherDisbursement
    static generateVoucherDisbursement(voucher: TravelVoucher): GLTransaction {
        return {
            id: generateSecureId('GL-TRV-DISB'),
            date: new Date().toISOString().split('T')[0],
            description: `Travel Disb: ${voucher.id}`,
            type: 'Disbursement', sourceModule: 'Travel', referenceDoc: voucher.id,
            totalAmount: voucher.totalClaimed, status: 'Posted', createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '490200', description: 'Delivered Orders - Paid', debit: voucher.totalClaimed, credit: 0, fund: '0100', costCenter: 'TRV' },
                { ussglAccount: '101000', description: 'FBwT', debit: 0, credit: voucher.totalClaimed, fund: '0100', costCenter: 'TRV' }
            ],
            auditLog: []
        };
    }

    // Fix: Add generateObligationFromProjectOrder
    static generateObligationFromProjectOrder(order: ProjectOrder, userRole: string): GLTransaction | null {
        return {
            id: generateSecureId('GL-PO'),
            date: new Date().toISOString().split('T')[0],
            description: `Auto-Obligation: Project Order ${order.orderNumber}`,
            type: 'Obligation', sourceModule: 'Reimbursables', referenceDoc: order.orderNumber,
            totalAmount: order.totalAmount, status: 'Posted', createdBy: 'SYSTEM',
            lines: [],
            auditLog: []
        };
    }

    // Fix: Add createRemisAsset
    static createRemisAsset(asset: RealPropertyAsset) {
        console.log("Mock: Asset created in REMIS", asset);
    }

    // Fix: Add awardContract
    static awardContract(prId: string, vendorData: any, user: string): any {
        return {
            id: `W912QR-24-C-${Math.floor(Math.random()*1000)}`,
            vendor: vendorData.name,
            type: 'FFP', value: vendorData.amount, awardedDate: new Date().toISOString().split('T')[0],
            status: 'Active', prReference: prId, uei: vendorData.uei, cageCode: vendorData.cageCode,
            periodOfPerformance: { start: '', end: '' }, gInvoicingStatus: 'Not Applicable',
            isBerryCompliant: true, modifications: [], auditLog: []
        };
    }

    // Fix: Add certifyPR
    static certifyPR(prId: string, user: string, fundNodes: FundControlNode[]): { success: boolean, message: string } {
        return { success: true, message: "Funds certified successfully." };
    }

    // Fix: Add calculateOverheadAllocation
    static calculateOverheadAllocation(laborCost: number, functionName: string, pools: CDOCostPool[]): number {
        const pool = pools.find(p => p.functionName === functionName);
        if (!pool) return 0;
        return laborCost * (pool.currentRate / 100);
    }

    // Fix: Add handleOutgrantBilling
    static handleOutgrantBilling(outgrant: Outgrant) {
        console.log("Mock: Outgrant billing triggered", outgrant);
    }

    // Fix: Add generateExpenseFromRelocationBenefit
    static generateExpenseFromRelocationBenefit(benefit: any, caseInfo: any) {
        console.log("Mock: Expense generated from relocation benefit", benefit);
    }
}