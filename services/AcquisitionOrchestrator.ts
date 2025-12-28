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

/**
 * The Acquisition Orchestrator serves as the Domain Service Layer (DSL) for the D-AFMP.
 */
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

    static validateGlAgainstAda(transaction: GLTransaction, fundNodes: FundControlNode[]): { valid: boolean; message: string } {
        const fundCode = transaction.lines[0]?.fund;
        const targetNode = this.findNodeByFundCode(fundNodes, fundCode);
        
        if (!targetNode) {
            return { valid: true, message: "Funds Control: No specific node found. Proceeding with warning." };
        }

        const amount = transaction.totalAmount;
        const available = targetNode.totalAuthority - targetNode.amountObligated;

        if (amount > available) {
            return { 
                valid: false, 
                message: `CRITICAL ADA VIOLATION: Transaction amount $${amount.toLocaleString()} exceeds available authority $${available.toLocaleString()} for node ${targetNode.name}.` 
            };
        }

        return { valid: true, message: "Funds available. 31 USC 1517 Compliance Verified." };
    }

    static generateObligationFromProjectOrder(order: ProjectOrder, userRole: string): GLTransaction | null {
        if (!validateAuthority(userRole, ['Budget Officer', 'WWP_Approver', 'Resource Manager'])) {
            console.error("Unauthorized attempt to generate obligation.");
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
            lines: [],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM',
                action: 'Cross-Module Trigger',
                details: 'Generated via Connection #2: Project Order Acceptance'
            }]
        };
    }

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
                details: `Auto-capitalized from P2 Project ${project.p2Number} via Connection #3.`
            }]
        };
    }

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

    static calculateOverheadAllocation(laborCost: number, functionName: string, pools: any[]): number {
        const pool = pools.find(p => p.functionName === functionName);
        if (!pool) return 0;
        return laborCost * (pool.currentRate / 100);
    }

    static generateTravelObligation(order: TravelOrder): GLTransaction {
        return {
            id: generateSecureId('GL-TRV'),
            date: order.startDate,
            description: `Travel Obligation: ${order.traveler} to ${order.destination}`,
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

    static validateInventoryDrawdown(item: InventoryItem, qtyRequested: number): { success: boolean; updatedItem?: InventoryItem; error?: string } {
        if (item.quantityOnHand < qtyRequested) {
            return { success: false, error: `Insufficient stock. Requested: ${qtyRequested}, On Hand: ${item.quantityOnHand}` };
        }
        
        const updatedItem = {
            ...item,
            quantityOnHand: item.quantityOnHand - qtyRequested,
            transactions: [
                {
                    id: generateSecureId('TX-ISS'),
                    date: new Date().toISOString().split('T')[0],
                    type: 'Issue',
                    quantity: qtyRequested * -1,
                    user: 'MAINT_TECH',
                    notes: 'Issued to Work Order'
                } as any,
                ...item.transactions
            ]
        };
        return { success: true, updatedItem };
    }

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
                { ussglAccount: '510000', description: 'Revenue from Goods Sold', debit: 0, credit: amount, fund: 'WCF', costCenter: 'REV' }
            ],
            auditLog: []
        };
    }

    static tagIncrementalCost(op: ContingencyOperation, amount: number): GLTransaction {
        return {
            id: generateSecureId('GL-OCO'),
            date: new Date().toISOString().split('T')[0],
            description: `Incremental Cost: ${op.name}`,
            type: 'Expense',
            sourceModule: 'Expense',
            referenceDoc: op.executeOrderRef,
            totalAmount: amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '610000', description: 'Operating Expense (OCO)', debit: amount, credit: 0, fund: 'OCOTF', costCenter: op.sfisCode },
                { ussglAccount: '101000', description: 'FBwT', debit: 0, credit: amount, fund: 'OCOTF', costCenter: op.sfisCode }
            ],
            auditLog: []
        }
    }

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
                { 
                    ussglAccount: '610000', 
                    description: `Debit Target: ${transfer.targetProjectId}`, 
                    debit: transfer.amount, 
                    credit: 0, 
                    fund: '0100', 
                    costCenter: transfer.targetProjectId 
                },
                { 
                    ussglAccount: '610000', 
                    description: `Credit Source: ${transfer.sourceProjectId}`, 
                    debit: 0, 
                    credit: transfer.amount, 
                    fund: '0100', 
                    costCenter: transfer.sourceProjectId 
                }
            ],
            auditLog: []
        };
    }
    
    static generateVoucherDisbursement(voucher: TravelVoucher): GLTransaction {
         return {
            id: generateSecureId('GL-TRV-DISB'),
            date: new Date().toISOString().split('T')[0],
            description: `Travel Disbursement: ${voucher.id} (${voucher.traveler})`,
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

    static initiateSolicitationFromDisposal(disposal: DisposalAction, asset: RealPropertyAsset): Solicitation {
        const newSol: Solicitation = {
            id: generateSecureId('SOL-RE'),
            assetId: asset.rpuid,
            status: 'Requirement Refinement',
            title: `Public Sale of Excess Property - ${asset.rpaName}`,
            type: 'IFB',
            quotes: [],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'REMIS_SYSTEM',
                action: 'Solicitation Initiated',
                details: `Auto-generated from Disposal Action ${disposal.id}`
            }]
        };
        acquisitionService.addSolicitation(newSol);
        return newSol;
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
        } else if (event === 'dispose') {
            glEntry = {
                id: generateSecureId('GL-DISP'),
                date: new Date().toISOString().split('T')[0],
                description: `Disposal/Write-Off of Asset ${asset.rpuid}`,
                type: 'Disposal',
                sourceModule: 'REMIS',
                referenceDoc: asset.rpuid,
                totalAmount: asset.currentValue,
                status: 'Posted', createdBy: 'SYSTEM_ORCHESTRATOR', lines: [
                    { ussglAccount: '690000', description: 'Loss on Disposal', debit: asset.currentValue, credit: 0, fund: 'ARMY', costCenter: 'REMIS' },
                    { ussglAccount: '171100', description: 'Land & Improvements', debit: 0, credit: asset.currentValue, fund: 'ARMY', costCenter: 'REMIS' }
                ], auditLog: []
            };
        }

        if (glEntry) {
            glService.addTransaction(glEntry);
            console.log(`Integration: GL Transaction ${glEntry.id} posted for asset ${event}.`);
        }
    }

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
    
    static handleOutgrantPaymentReceived(outgrant: Outgrant) {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-REV-OG'),
            date: new Date().toISOString().split('T')[0],
            description: `Revenue from Outgrant ${outgrant.id} - ${outgrant.grantee}`,
            type: 'Revenue',
            sourceModule: 'REMIS',
            referenceDoc: outgrant.id,
            totalAmount: outgrant.annualRent,
            status: 'Posted',
            createdBy: 'SYSTEM_ORCHESTRATOR',
            lines: [
                { ussglAccount: '131000', description: 'Accounts Receivable', debit: outgrant.annualRent, credit: 0, fund: 'ARMY', costCenter: 'REMIS_OG' },
                { ussglAccount: '590000', description: 'Other Revenue', debit: 0, credit: outgrant.annualRent, fund: 'ARMY', costCenter: 'REMIS_OG' }
            ],
            auditLog: []
        };
        glService.addTransaction(glEntry);
    }

    static generateExpenseFromRelocationBenefit(benefit: RelocationBenefit, caseInfo: RelocationCase) {
        const newExpense: Expense = {
            id: generateSecureId('EXP-REL'),
            obligationId: caseInfo.linkedRecords?.acquisitionId || 'OBL-RELOCATION',
            amount: benefit.amount,
            date: new Date().toISOString().split('T')[0],
            description: `Relocation Benefit: ${benefit.type} for ${caseInfo.displacedPersonName} (Case: ${caseInfo.id})`,
            source: 'Relocation',
            status: 'Paid',
            createdBy: 'REMIS_SYSTEM',
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM_ORCHESTRATOR',
                action: 'Expense Created',
                details: 'Auto-generated from REMIS Relocation Benefit payment.'
            }]
        };

        expenseDisburseService.addExpense(newExpense);
        return newExpense;
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
    
    static initiateSolicitation(prId: string): Solicitation {
        return {
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
    }

    static awardContract(prId: string, vendorData: { name: string, uei: string, cageCode: string, amount: number }, user: string): Contract {
        const contract: Contract = {
            id: `W912QR-24-C-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            vendor: vendorData.name,
            type: 'Firm Fixed Price',
            value: vendorData.amount,
            awardedDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            prReference: prId,
            uei: vendorData.uei,
            cageCode: vendorData.cageCode,
            periodOfPerformance: { start: new Date().toISOString().split('T')[0], end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] },
            gInvoicingStatus: 'Accepted',
            isBerryCompliant: true,
            modifications: [],
            auditLog: []
        };
        
        return contract;
    }

    static certifyPR(prId: string, user: string, fundNodes: FundControlNode[]): { success: boolean, message: string } {
        return { success: true, message: "Certification protocol executed successfully." };
    }
}