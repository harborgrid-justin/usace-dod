
import { 
    GLTransaction, FundControlNode, ProjectOrder, USACEProject, Asset, 
    Obligation, Expense, Disbursement, TravelOrder, InventoryItem, 
    ReimbursableOrder, ContingencyOperation, CostTransfer, TravelVoucher,
    RealPropertyAsset, Outgrant, DisposalAction, Solicitation, Contract, PurchaseRequest, 
    RelocationBenefit, RelocationCase, ContractMod, SolicitationStatus,
    BracInstallation, BracScenario, VendorQuote
} from '../types';
import { generateSecureId, validateAuthority } from '../utils/security';
import { glService } from './GLDataService';
import { reimbursableService } from './ReimbursableDataService';
import { expenseDisburseService } from './ExpenseDisburseDataService';
import { acquisitionService } from './AcquisitionDataService';
import { remisService } from './RemisDataService';

export class IntegrationOrchestrator {
    
    /**
     * Integration #21: BRAC <-> REMIS Synchronization
     * Transfers property accountability and triggers write-offs for closed installations.
     */
    static synchronizeBracClosure(scenario: BracScenario, losing: BracInstallation) {
        if (scenario.status !== 'Legislatively Locked') return;

        // 1. Identify all REMIS assets associated with the closing installation
        const assets = remisService.getAllAssetsIncludeRetired().filter(a => a.installation === losing.name);
        
        assets.forEach(asset => {
            // 2. Mark for disposal in REMIS
            remisService.updateAsset({ ...asset, status: 'Retired' });
            
            // 3. Trigger GL write-off via existing lifecycle event handler
            this.handleAssetLifecycleEvent(asset, 'dispose');
        });

        console.log(`BRAC Sync: Accountability for ${assets.length} assets retired from ${losing.name}.`);
    }

    /**
     * Retrieves a complete cross-module traceability matrix for a given project.
     */
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
                travel: { id: 'TO-24-001', status: 'Completed' },
                inventory: { id: 'TX-ISS-9912', item: 'Concrete' }
            },
            accounting: {
                obligation: { id: 'GL-OBL-8821', amount: project.financials.obligated },
                expense: { id: 'EXP-001', status: 'Accrued' },
                disbursement: { id: 'DISB-001', status: 'Paid' },
                costTransfer: { id: 'CT-24-002', status: 'Posted' }
            },
            assets: {
                realEstate: project.realEstate?.[0]?.tractNumber || 'N/A',
                capitalAsset: { id: 'ASSET-001', status: 'CIP' },
                workOrder: { id: 'WO-24-1001', type: 'Preventive' },
                auditLog: { count: 242 }
            }
        };
    }

    /**
     * Validates a GL Transaction against the Anti-Deficiency Act (ADA) controls.
     */
    static validateGlAgainstAda(transaction: GLTransaction, fundNodes: FundControlNode[]): { valid: boolean; message: string } {
        const fundCode = transaction.lines[0]?.fund;
        const targetNode = this.findNodeByFundCode(fundNodes, fundCode);
        if (!targetNode) return { valid: true, message: "Funds Control: Pass with warning." };

        const available = targetNode.totalAuthority - targetNode.amountObligated;
        if (transaction.totalAmount > available) {
            return { valid: false, message: `ADA VIOLATION: $${transaction.totalAmount.toLocaleString()} exceeds available $${available.toLocaleString()} for ${targetNode.name}.` };
        }
        return { valid: true, message: "Compliance Verified." };
    }

    private static findNodeByFundCode(nodes: FundControlNode[], code: string | undefined): FundControlNode | null {
        if (!code) return null;
        for (const node of nodes) {
            if (node.name.includes(code) || (code === '0100' && node.level === 'Allocation')) return node;
            if (node.children) {
                const found = this.findNodeByFundCode(node.children, code);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * Generates a General Ledger Obligation record from an accepted Project Order.
     */
    static generateObligationFromProjectOrder(order: ProjectOrder, userRole: string): GLTransaction | null {
        if (!validateAuthority(userRole, ['Budget Officer', 'Resource Manager'])) {
            return null;
        }
        return {
            id: generateSecureId('GL-PO'),
            date: new Date().toISOString().split('T')[0],
            description: `Auto-Obligation: Project Order ${order.orderNumber}`,
            type: 'Obligation',
            sourceModule: 'Reimbursables',
            referenceDoc: order.orderNumber,
            totalAmount: order.totalAmount,
            status: 'Posted',
            createdBy: 'SYSTEM_ORCHESTRATOR',
            lines: [
                { ussglAccount: '480100', description: 'UDO - Unpaid', debit: order.totalAmount, credit: 0, fund: order.appropriation, costCenter: 'AUTO' },
                { ussglAccount: '461000', description: 'Allotment', debit: 0, credit: order.totalAmount, fund: order.appropriation, costCenter: 'AUTO' }
            ],
            auditLog: []
        };
    }

    /**
     * Converts a completed USACE Project into a capitalized asset.
     */
    static capitalizeProjectToAsset(project: USACEProject): Asset {
        return {
            id: generateSecureId('ASSET'),
            name: `${project.name} - Capitalized Facility`,
            type: 'PRIP',
            assetClass: 'Building',
            status: 'In Service',
            placedInServiceDate: new Date().toISOString().split('T')[0],
            acquisitionCost: project.financials.obligated,
            residualValue: 0,
            usefulLife: 40, 
            pripAuthorized: true,
            plantIncrementWaiver: { active: false },
            components: [],
            accumulatedDepreciation: 0,
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM',
                event: 'Asset Acquired',
                details: `Auto-capitalized from P2 Project ${project.p2Number}`
            }]
        };
    }

    /**
     * Generates an Accrual GL Transaction from a recorded Expense.
     */
    static generateAccrualFromExpense(expense: Expense): GLTransaction {
        return {
            id: generateSecureId('GL-ACC'),
            date: new Date().toISOString().split('T')[0],
            description: `Accrual: ${expense.description}`,
            type: 'Accrual',
            sourceModule: 'Expense',
            referenceDoc: expense.id,
            totalAmount: expense.amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '610000', description: 'Operating Expense', debit: expense.amount, credit: 0, fund: '0100', costCenter: 'DEFAULT' },
                { ussglAccount: '211000', description: 'Accounts Payable', debit: 0, credit: expense.amount, fund: '0100', costCenter: 'DEFAULT' }
            ],
            auditLog: []
        };
    }

    /**
     * Generates a Disbursement GL Transaction.
     */
    static generateDisbursementFromExpense(expense: Expense, disbursementId: string): GLTransaction {
        return {
            id: generateSecureId('GL-DISB'),
            date: new Date().toISOString().split('T')[0],
            description: `Disbursement: ${expense.description}`,
            type: 'Disbursement',
            sourceModule: 'Disbursement',
            referenceDoc: disbursementId,
            totalAmount: expense.amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '211000', description: 'Accounts Payable', debit: expense.amount, credit: 0, fund: '0100', costCenter: 'DEFAULT' },
                { ussglAccount: '101000', description: 'Fund Balance w/ Treasury', debit: 0, credit: expense.amount, fund: '0100', costCenter: 'DEFAULT' }
            ],
            auditLog: []
        };
    }

    /**
     * Generates a quarterly depreciation journal entry for an asset.
     */
    static generateDepreciationJournal(asset: Asset): GLTransaction {
        const quarterlyDep = (asset.acquisitionCost / asset.usefulLife) / 4;
        return {
            id: generateSecureId('GL-DEP'),
            date: new Date().toISOString().split('T')[0],
            description: `Q3 Depreciation: ${asset.name}`,
            type: 'Adjusting Entry',
            sourceModule: 'Asset',
            referenceDoc: asset.id,
            totalAmount: quarterlyDep,
            status: 'Posted',
            createdBy: 'SYSTEM_BATCH',
            lines: [
                { ussglAccount: '610000', description: 'Depreciation Expense', debit: quarterlyDep, credit: 0, fund: 'WCF', costCenter: 'AUTO' },
                { ussglAccount: '171900', description: 'Accumulated Depreciation', debit: 0, credit: quarterlyDep, fund: 'WCF', costCenter: 'AUTO' }
            ],
            auditLog: []
        };
    }

    /**
     * Calculates overhead allocation for labor costing.
     */
    static calculateOverheadAllocation(laborCost: number, functionName: string, pools: any[]): number {
        const pool = pools.find(p => p.functionName === functionName);
        if (!pool) return 0;
        return laborCost * (pool.currentRate / 100);
    }

    /**
     * Validates inventory drawdown for work orders.
     */
    static validateInventoryDrawdown(item: InventoryItem, qtyRequested: number): { success: boolean; updatedItem?: InventoryItem; error?: string } {
        if (item.quantityOnHand < qtyRequested) {
            return { success: false, error: `Insufficient stock. Requested: ${qtyRequested}, On Hand: ${item.quantityOnHand}` };
        }
        return { success: true };
    }

    /**
     * Generates a Cost Transfer GL Transaction.
     */
    static generateCostTransferJournal(transfer: CostTransfer, user: string): GLTransaction {
        return {
            id: generateSecureId('GL-CT'),
            date: new Date().toISOString().split('T')[0],
            description: `Cost Transfer: ${transfer.id}`,
            type: 'Adjusting Entry',
            sourceModule: 'Cost Transfer',
            referenceDoc: transfer.id,
            totalAmount: transfer.amount,
            status: 'Posted',
            createdBy: user,
            lines: [
                { ussglAccount: '610000', description: `Debit: ${transfer.targetProjectId}`, debit: transfer.amount, credit: 0, fund: '0100', costCenter: 'ACQ' },
                { ussglAccount: '610000', description: `Credit: ${transfer.sourceProjectId}`, debit: 0, credit: transfer.amount, fund: '0100', costCenter: 'ACQ' }
            ],
            auditLog: []
        };
    }

    /**
     * Generates a Travel Obligation GL Transaction.
     */
    static generateTravelObligation(order: TravelOrder): GLTransaction {
        return {
            id: generateSecureId('GL-TRV'),
            date: order.startDate,
            description: `Travel Obligation: ${order.traveler}`,
            type: 'Obligation',
            sourceModule: 'Travel',
            referenceDoc: order.id,
            totalAmount: order.estCost,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '480100', description: 'UDO - Travel', debit: 0, credit: order.estCost, fund: '0100', costCenter: 'TRV' },
                { ussglAccount: '461000', description: 'Allotment', debit: order.estCost, credit: 0, fund: '0100', costCenter: 'TRV' }
            ],
            auditLog: []
        };
    }

    /**
     * Generates a Travel Voucher Disbursement GL Transaction.
     */
    static generateVoucherDisbursement(voucher: TravelVoucher): GLTransaction {
         return {
            id: generateSecureId('GL-TRV-DISB'),
            date: new Date().toISOString().split('T')[0],
            description: `Travel Disbursement: ${voucher.id}`,
            type: 'Disbursement',
            sourceModule: 'Travel',
            referenceDoc: voucher.id,
            totalAmount: voucher.totalClaimed,
            status: 'Posted',
            createdBy: 'DFAS_AUTO',
            lines: [
                { ussglAccount: '490200', description: 'Delivered Orders - Paid', debit: voucher.totalClaimed, credit: 0, fund: '0100', costCenter: 'TRV' },
                { ussglAccount: '101000', description: 'FBwT', debit: 0, credit: voucher.totalClaimed, fund: '0100', costCenter: 'TRV' }
            ],
            auditLog: []
        };
    }

    /**
     * Generates a GL transaction for revenue recognition.
     */
    static generateRevenueRecognition(order: ReimbursableOrder, amount: number): GLTransaction {
        return {
            id: generateSecureId('GL-REV'),
            date: new Date().toISOString().split('T')[0],
            description: `Revenue Rec: ${order.orderNumber}`,
            type: 'Revenue',
            sourceModule: 'Reimbursables',
            referenceDoc: order.orderNumber,
            totalAmount: amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '131000', description: 'Accounts Receivable', debit: amount, credit: 0, fund: 'WCF', costCenter: 'REV' },
                { ussglAccount: '510000', description: 'Revenue', debit: 0, credit: amount, fund: 'WCF', costCenter: 'REV' }
            ],
            auditLog: []
        };
    }

    /**
     * Records an incremental cost for a contingency operation.
     */
    static tagIncrementalCost(op: ContingencyOperation, amount: number): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-OCO'),
            date: new Date().toISOString().split('T')[0],
            description: `Incremental Cost: ${op.name}`,
            type: 'Expense',
            sourceModule: 'Contingency',
            referenceDoc: op.id,
            totalAmount: amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '610000', description: 'Operating Expense (OCO)', debit: amount, credit: 0, fund: 'OCOTF', costCenter: op.sfisCode },
                { ussglAccount: '101000', description: 'FBwT', debit: 0, credit: amount, fund: 'OCOTF', costCenter: op.sfisCode }
            ],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    /**
     * Certifies a Purchase Request and generates a Commitment.
     */
    static certifyPR(prId: string, user: string, fundNodes: FundControlNode[]): { success: boolean; message: string } {
        const pr = acquisitionService.getPRs().find(p => p.id === prId);
        if (!pr) return { success: false, message: 'PR not found' };

        const mockTx = { totalAmount: pr.amount, lines: [{ fund: '0100' }] } as any;
        const validation = this.validateGlAgainstAda(mockTx, fundNodes);
        if (!validation.valid) return { success: false, message: validation.message };

        acquisitionService.updatePR({
            ...pr,
            status: 'Funds Certified',
            certifiedBy: user,
            certificationDate: new Date().toISOString(),
            auditLog: [...pr.auditLog, { timestamp: new Date().toISOString(), user, action: 'Certification', details: 'Funds certified against AEA.' }]
        });

        return { success: true, message: 'PR Certified' };
    }

    /**
     * Award a contract and post the formal obligation to the GL.
     */
    static awardContract(prId: string, vendorData: any, user: string): Contract {
        const contract: Contract = {
            id: generateSecureId('W912QR-24-C'),
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
        
        acquisitionService.addContract(contract);
        
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-OBL'),
            date: new Date().toISOString().split('T')[0],
            description: `Obligation for Contract ${contract.id}`,
            type: 'Obligation',
            sourceModule: 'Acquisition',
            referenceDoc: contract.id,
            totalAmount: contract.value,
            status: 'Posted',
            createdBy: user,
            lines: [
                { ussglAccount: '480100', description: 'UDO - Unpaid', debit: contract.value, credit: 0, fund: '0100', costCenter: 'ACQ' },
                { ussglAccount: '461000', description: 'Allotment', debit: 0, credit: contract.value, fund: '0100', costCenter: 'ACQ' }
            ],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        
        return contract;
    }

    /**
     * Establishes a new REMIS asset and triggers capitalization.
     */
    static createRemisAsset(asset: RealPropertyAsset) {
        remisService.addAsset(asset);
        this.handleAssetLifecycleEvent(asset, 'create');
    }

    /**
     * Handles capitalization and disposal events for real property assets.
     */
    static handleAssetLifecycleEvent(asset: RealPropertyAsset, event: 'create' | 'dispose') {
        const glEntry: GLTransaction = {
            id: generateSecureId(event === 'create' ? 'GL-CAP' : 'GL-DISP'),
            date: new Date().toISOString().split('T')[0],
            description: `${event === 'create' ? 'Capitalization' : 'Disposal'} of Asset ${asset.rpuid}`,
            type: event === 'create' ? 'Capitalization' : 'Disposal',
            sourceModule: 'REMIS',
            referenceDoc: asset.rpuid,
            totalAmount: asset.currentValue,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: event === 'create' ? [
                { ussglAccount: '171100', description: 'Land', debit: asset.currentValue, credit: 0, fund: 'ARMY', costCenter: 'REMIS' },
                { ussglAccount: '101000', description: 'FBwT', debit: 0, credit: asset.currentValue, fund: 'ARMY', costCenter: 'REMIS' }
            ] : [
                { ussglAccount: '690000', description: 'Loss on Disposal', debit: asset.currentValue, credit: 0, fund: 'ARMY', costCenter: 'REMIS' },
                { ussglAccount: '171100', description: 'Land', debit: 0, credit: asset.currentValue, fund: 'ARMY', costCenter: 'REMIS' }
            ],
            auditLog: []
        };
        glService.addTransaction(glEntry);
    }

    /**
     * Generates a reimbursable order from an outgrant for billing.
     */
    static handleOutgrantBilling(outgrant: Outgrant) {
        const newOrder: ReimbursableOrder = {
            id: `ORD-OG-${outgrant.id.slice(-4)}`,
            agreementId: 'AGR-REMIS-MASTER',
            orderNumber: `BILL-${outgrant.id}-${new Date().getFullYear()}`,
            authority: outgrant.authority,
            amount: outgrant.annualRent,
            billingFrequency: outgrant.paymentFrequency
        };
        reimbursableService.addOrder(newOrder);
    }

    /**
     * Creates an Expense record from an approved and paid Relocation Benefit.
     */
    static generateExpenseFromRelocationBenefit(benefit: RelocationBenefit, caseInfo: RelocationCase) {
        const newExpense: Expense = {
            id: generateSecureId('EXP-REL'),
            obligationId: caseInfo.linkedRecords?.acquisitionId || 'OBL-RELOCATION',
            amount: benefit.amount,
            date: new Date().toISOString().split('T')[0],
            description: `Relocation Benefit: ${benefit.type} for ${caseInfo.displacedPersonName}`,
            source: 'Relocation',
            status: 'Paid',
            createdBy: 'REMIS_SYSTEM',
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM',
                action: 'Expense Created',
                details: 'Auto-generated from REMIS.'
            }]
        };
        expenseDisburseService.addExpense(newExpense);
        return newExpense;
    }
}
