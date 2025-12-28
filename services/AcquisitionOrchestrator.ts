import { 
    GLTransaction, FundControlNode, ProjectOrder, USACEProject, Asset, 
    Obligation, Expense, Disbursement, TravelOrder, InventoryItem, 
    CDOTransaction, ReimbursableOrder, ContingencyOperation, CostTransfer, TravelVoucher,
    RealPropertyAsset, Outgrant, DisposalAction, RelocationBenefit, RelocationCase, Solicitation, Contract, PurchaseRequest, VendorQuote, SolicitationStatus, ContractMod,
    // Fix: Added missing import for CostShareRecord and related acquisition types
    CostShareRecord 
} from '../types';
import { generateSecureId, validateAuthority } from '../utils/security';
import { glService } from './GLDataService';
import { reimbursableService } from './ReimbursableDataService';
import { expenseDisburseService } from './ExpenseDisburseDataService';
import { acquisitionService } from './AcquisitionDataService';

/**
 * The Acquisition Orchestrator serves as the Domain Service Layer (DSL) for the D-AFMP.
 * 
 * It enforces business rules and ensures atomic transactions across disparate functional modules,
 * specifically handling the interaction between the General Ledger (GL) and subsidiary ledgers
 * (Projects, Assets, Funds Control).
 * 
 * @class AcquisitionOrchestrator
 */
// Fix: Renamed from IntegrationOrchestrator to match expected export in SolicitationManager
export class AcquisitionOrchestrator {
    
    /**
     * Retrieves a complete cross-module traceability matrix for a given project.
     * This simulates an advanced join across 20 distinct data tables/services.
     * 
     * @param project - The project context.
     * @returns A consolidated object of 20 related entity types.
     */
    static getProjectTraceability(project: USACEProject) {
        // In a real system, these would be indexed lookups against the specific data services.
        // For the prototype, we construct a deterministic web of mock relations based on the Project ID.
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
     * Validates a GL Transaction against the Anti-Deficiency Act (ADA) controls (31 U.S.C. 1517).
     * This ensures no obligation or expenditure exceeds the authorized amount at the fund control node level.
     * 
     * @param transaction - The General Ledger transaction object attempting to be posted.
     * @param fundNodes - The current hierarchy of funds control nodes (AEA).
     * @returns An object containing a boolean `valid` flag and a descriptive `message`.
     */
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

    /**
     * Generates a General Ledger Obligation record from an accepted Project Order.
     * This automates the recording of 480100 (Undelivered Orders - Obligations, Unpaid).
     * 
     * @param order - The accepted Project Order.
     * @param userRole - The role of the user attempting to generate the obligation (Must be authorized).
     * @returns A `GLTransaction` object if authorized, otherwise `null`.
     */
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
            approvedBy: 'SYSTEM_AUTO',
            lines: [
                {
                    ussglAccount: '480100', 
                    description: `Obligation for ${order.providerId}`,
                    debit: 0,
                    credit: order.totalAmount,
                    fund: order.appropriation || '97-1109',
                    costCenter: 'AUTO'
                },
                {
                    ussglAccount: '461000', 
                    description: 'Reduction of Allotment',
                    debit: order.totalAmount,
                    credit: 0,
                    fund: order.appropriation || '97-1109',
                    costCenter: 'AUTO'
                }
            ],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM',
                action: 'Cross-Module Trigger',
                details: 'Generated via Connection #2: Project Order Acceptance'
            }]
        };
    }

    /**
     * Converts a completed USACE Project into a capitalized asset.
     * Triggers the transfer from Construction in Progress (CIP) to Property, Plant, and Equipment (PP&E).
     * 
     * @param project - The completed USACE Project.
     * @returns A new `Asset` object initialized with project financials.
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
                details: `Auto-capitalized from P2 Project ${project.p2Number} via Connection #3.`
            }]
        };
    }

    /**
     * Generates an Accrual GL Transaction from a recorded Expense.
     * Debits Operating Expense (6100) and Credits Accounts Payable (2110).
     * 
     * @param expense - The validated expense record.
     * @returns A `GLTransaction` representing the accrual.
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
            approvedBy: 'SYSTEM',
            lines: [
                { ussglAccount: '610000', description: 'Operating Expense', debit: expense.amount, credit: 0, fund: '0100', costCenter: 'DEFAULT' },
                { ussglAccount: '211000', description: 'Accounts Payable', debit: 0, credit: expense.amount, fund: '0100', costCenter: 'DEFAULT' }
            ],
            auditLog: []
        };
    }

    /**
     * Generates a Disbursement GL Transaction.
     * Debits Accounts Payable (2110) and Credits Fund Balance with Treasury (1010).
     * 
     * @param expense - The expense being paid.
     * @param disbursementId - The reference ID of the payment event.
     * @returns A `GLTransaction` representing the outlay.
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
            approvedBy: 'SYSTEM',
            lines: [
                { ussglAccount: '211000', description: 'Accounts Payable', debit: expense.amount, credit: 0, fund: '0100', costCenter: 'DEFAULT' },
                { ussglAccount: '101000', description: 'Fund Balance w/ Treasury', debit: 0, credit: expense.amount, fund: '0100', costCenter: 'DEFAULT' }
            ],
            auditLog: []
        };
    }

    /**
     * Calculates the quarterly depreciation journal entry for an asset.
     * 
     * @param asset - The asset to depreciate.
     * @returns A `GLTransaction` for the depreciation expense.
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
     * Calculates overhead allocation for labor costing based on defined pools.
     * 
     * @param laborCost - The direct labor cost base.
     * @param functionName - The function (e.g., Engineering) to determine the rate.
     * @param pools - The list of active overhead pools.
     * @returns The calculated overhead amount.
     */
    static calculateOverheadAllocation(laborCost: number, functionName: string, pools: any[]): number {
        const pool = pools.find(p => p.functionName === functionName);
        if (!pool) return 0;
        return laborCost * (pool.currentRate / 100);
    }

    /**
     * Generates a Travel Obligation GL Transaction.
     * 
     * @param order - The approved Travel Order.
     * @returns A `GLTransaction` representing the travel obligation.
     */
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

    // --- 9. Work Order <-> Inventory (Drawdown) ---
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

    // --- 10. Reimbursable Order <-> GL (Revenue) ---
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

    // --- 11. Contingency <-> GL (Incremental Cost) ---
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

    // --- 12. Cost Transfer <-> GL (Reallocation) ---
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
    
    // --- 13. Travel Voucher <-> GL (Disbursement) ---
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

    /**
     * Integration #4: Disposal <-> Solicitation
     * Creates a new solicitation record from a disposal action.
     */
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

    // --- NEW INTEGRATION METHODS ---

    /**
     * Integration #1: Asset Management <-> General Ledger
     * Generates GL transactions for asset capitalization and disposal.
     */
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

    /**
     * Integration #2: Outgrants <-> Reimbursables
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
        console.log(`Integration: Reimbursable Order ${newOrder.id} created for outgrant billing.`);
    }
    
     /**
     * Integration #2b: Outgrants <-> GL
     * Generates a GL transaction for revenue recognition upon payment.
     */
    static handleOutgrantPaymentReceived(outgrant: Outgrant) {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-REV-OG'),
            date: new Date().toISOString().split('T')[0],
            description: `Revenue from Outgrant ${outgrant.id} - ${outgrant.grantee}`,
            type: 'Revenue',
            sourceModule: 'REMIS',
            referenceDoc: outgrant.id,
            totalAmount: outgrant.annualRent, // Assuming full annual payment for simplicity
            status: 'Posted',
            createdBy: 'SYSTEM_ORCHESTRATOR',
            lines: [
                { ussglAccount: '131000', description: 'Accounts Receivable', debit: outgrant.annualRent, credit: 0, fund: 'ARMY', costCenter: 'REMIS_OG' },
                { ussglAccount: '590000', description: 'Other Revenue', debit: 0, credit: outgrant.annualRent, fund: 'ARMY', costCenter: 'REMIS_OG' }
            ],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        console.log(`Integration: Revenue recognized for Outgrant ${outgrant.id}.`);
    }

    /**
     * Integration #3b: Cost Share <-> Reimbursables
     * Generates a reimbursable order to bill a non-federal sponsor.
     */
    static handleCostShareBilling(record: CostShareRecord) {
        const amountToBill = (record.totalValue * (record.percentage.nonFederal / 100)) - record.contributedValue;
        if (amountToBill <= 0) {
            console.warn(`Integration Warning: No balance to bill for sponsor ${record.sponsorName}.`);
            return;
        };

        const newOrder: ReimbursableOrder = {
            id: `ORD-CS-${record.id.slice(-4)}`,
            agreementId: record.id, // Link directly to Cost Share Agreement
            orderNumber: `BILL-SPONSOR-${record.id}-${new Date().getFullYear()}`,
            authority: record.authority,
            amount: amountToBill,
            billingFrequency: 'Annual' // Assumption
        };
        reimbursableService.addOrder(newOrder);
        console.log(`Integration: Reimbursable Order ${newOrder.id} created to bill sponsor ${record.sponsorName}.`);
    }

    /**
     * Integration #6: Relocation <-> Expense & Disburse
     * Creates an Expense record from an approved and paid Relocation Benefit.
     */
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
            approvedBy: benefit.approvingOfficial,
            disbursedBy: 'DFAS_AUTO',
            disbursementId: benefit.paymentId,
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM_ORCHESTRATOR',
                action: 'Expense Created',
                details: 'Auto-generated from REMIS Relocation Benefit payment.'
            }]
        };

        expenseDisburseService.addExpense(newExpense);
        console.log(`Integration: Expense record ${newExpense.id} created for Relocation Benefit.`);
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
    
    // Fix: Added missing static methods for Acquisition orchestration
    static initiateSolicitation(pr: PurchaseRequest): Solicitation {
        return {
            id: `SOL-RE-${pr.id.slice(-5)}`,
            prId: pr.id,
            status: 'Requirement Refinement',
            title: `Solicitation for: ${pr.description}`,
            type: 'RFQ',
            quotes: [],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'SYSTEM',
                action: 'Solicitation Initiated',
                details: `Auto-generated from certified PR ${pr.id}`
            }]
        };
    }

    static awardContract(pr: PurchaseRequest, vendorData: { name: string, uei: string, cageCode: string, amount: number }): { contract: Contract, obligation: GLTransaction } {
        const contract: Contract = {
            id: `W912QR-24-C-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            vendor: vendorData.name,
            type: 'Firm Fixed Price',
            value: vendorData.amount,
            awardedDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            prReference: pr.id,
            uei: vendorData.uei,
            cageCode: vendorData.cageCode,
            periodOfPerformance: { start: new Date().toISOString().split('T')[0], end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] },
            gInvoicingStatus: 'Accepted',
            isBerryCompliant: true,
            modifications: [],
            auditLog: []
        };

        const obligation: GLTransaction = {
            id: generateSecureId('GL-OBL'),
            date: new Date().toISOString().split('T')[0],
            description: `Obligation for Contract ${contract.id}`,
            type: 'Obligation',
            sourceModule: 'Acquisition',
            referenceDoc: contract.id,
            totalAmount: contract.value,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                { ussglAccount: '480100', description: 'Undelivered Orders - Obligations, Unpaid', debit: contract.value, credit: 0, fund: '0100', costCenter: 'ACQ' },
                { ussglAccount: '490100', description: 'Delivered Orders - Obligations, Unpaid', debit: 0, credit: contract.value, fund: '0100', costCenter: 'ACQ' }
            ],
            auditLog: []
        };
        
        return { contract, obligation };
    }

    static certifyPR(pr: PurchaseRequest, fundNodes: FundControlNode[]): { success: boolean, message: string, commitment?: GLTransaction } {
        // This is a simplified check. A real check would use the full accounting string.
        const mockTx = { totalAmount: pr.amount, lines: [{ fund: pr.appropriation }] } as GLTransaction;
        const validation = this.validateGlAgainstAda(mockTx, fundNodes);

        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        const commitment: GLTransaction = {
            id: generateSecureId('GL-COM'),
            date: new Date().toISOString().split('T')[0],
            description: `Commitment for PR ${pr.id}`,
            type: 'Commitment',
            sourceModule: 'Acquisition',
            referenceDoc: pr.id,
            totalAmount: pr.amount,
            status: 'Posted',
            createdBy: 'SYSTEM',
            lines: [
                 { ussglAccount: '470000', description: 'Commitments', debit: pr.amount, credit: 0, fund: '0100', costCenter: 'ACQ' },
                 { ussglAccount: '461000', description: 'Allotments - Realized Resources', debit: 0, credit: pr.amount, fund: '0100', costCenter: 'ACQ' }
            ],
            auditLog: []
        };

        return { success: true, message: `Funds certified. Commitment ${commitment.id} posted.`, commitment };
    }
    
    static advanceSolicitation(sol: Solicitation, status: SolicitationStatus, user: string): Solicitation {
        return {
            ...sol,
            status,
            auditLog: [...sol.auditLog, { timestamp: new Date().toISOString(), user, action: 'Status Change', details: `Advanced to ${status}` }]
        };
    }

    static simulateVendorQuotes(sol: Solicitation, baseAmount: number): VendorQuote[] {
        return [
            { vendorId: 'V-001', vendorName: 'V-NEX SOLUTIONS LLC', uei: 'ABC123DEF', amount: baseAmount * 0.98, technicalScore: 92, pastPerformanceScore: 95, isResponsive: true, isResponsible: true },
            { vendorId: 'V-002', vendorName: 'ACME Defense', uei: 'GHI789JKL', amount: baseAmount * 1.05, technicalScore: 85, pastPerformanceScore: 88, isResponsive: true, isResponsible: true },
            { vendorId: 'V-003', vendorName: 'Global Tech', uei: 'MNO456PQR', amount: baseAmount * 0.95, technicalScore: 78, pastPerformanceScore: 82, isResponsive: false, isResponsible: true },
        ];
    }
    
    static executeModification(contract: Contract, modData: Partial<ContractMod>, user: string): { contract: Contract, glAdjustment?: GLTransaction } {
        const newMod: ContractMod = {
            id: `MOD-${contract.id}-${contract.modifications.length + 1}`,
            modNumber: `P0000${contract.modifications.length + 1}`,
            date: new Date().toISOString().split('T')[0],
            amountDelta: modData.amountDelta || 0,
            description: modData.description || 'No description provided.',
            authority: modData.authority || 'FAR 43.103',
            status: 'Executed'
        };

        const updatedContract: Contract = {
            ...contract,
            value: contract.value + newMod.amountDelta,
            modifications: [...contract.modifications, newMod],
            auditLog: [...contract.auditLog, {
                timestamp: new Date().toISOString(),
                user,
                action: 'Contract Modification',
                details: `Mod ${newMod.modNumber} executed for ${newMod.amountDelta > 0 ? '+' : ''}${newMod.amountDelta}`
            }]
        };

        let glAdjustment: GLTransaction | undefined;
        if (newMod.amountDelta !== 0) {
            glAdjustment = {
                id: generateSecureId('GL-MOD'),
                date: new Date().toISOString().split('T')[0],
                description: `Adjustment for Mod ${newMod.modNumber} on ${contract.id}`,
                type: 'Obligation Adjustment',
                sourceModule: 'Acquisition',
                referenceDoc: newMod.id,
                totalAmount: Math.abs(newMod.amountDelta),
                status: 'Posted',
                createdBy: user,
                lines: [
                    { ussglAccount: '480100', description: 'UDO Adjustment', debit: newMod.amountDelta > 0 ? newMod.amountDelta : 0, credit: newMod.amountDelta < 0 ? Math.abs(newMod.amountDelta) : 0, fund: '0100', costCenter: 'ACQ' },
                    { ussglAccount: '461000', description: 'Allotment Adjustment', debit: newMod.amountDelta < 0 ? Math.abs(newMod.amountDelta) : 0, credit: newMod.amountDelta > 0 ? newMod.amountDelta : 0, fund: '0100', costCenter: 'ACQ' },
                ],
                auditLog: []
            };
        }
        
        return { contract: updatedContract, glAdjustment };
    }

    static closeoutContract(contract: Contract, user: string): Contract {
        return {
            ...contract,
            status: 'Closed',
            auditLog: [...contract.auditLog, {
                timestamp: new Date().toISOString(),
                user,
                action: 'Contract Closeout',
                details: 'All performance complete and payments made.'
            }]
        };
    }
}