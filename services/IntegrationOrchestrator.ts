
import { 
    GLTransaction, FundControlNode, ProjectOrder, USACEProject, Asset, 
    Obligation, Expense, Disbursement, TravelOrder, InventoryItem, 
    CDOTransaction, ReimbursableOrder, ContingencyOperation, CostTransfer
} from '../types';
import { generateSecureId, validateAuthority } from '../utils/security';

/**
 * The Integration Orchestrator serves as the Domain Service Layer.
 * It enforces business rules and ensures atomic transactions across 
 * disparate functional modules of the D-AFMP.
 */
export class IntegrationOrchestrator {
    
    // --- 1. GL <-> Funds Control (ADA Check) ---
    /**
     * Validates if a proposed GL posting violates 31 USC 1517 (Antideficiency Act).
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

    // --- 2. Project Order (Reimbursables) <-> GL ---
    /**
     * Automatically generates a GL Obligation when a Project Order is Accepted (41 USC 6307).
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

    // --- 3. Project Completion <-> Asset Lifecycle ---
    /**
     * Converts a completed construction project into a fixed asset record.
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

    // --- 4. Expense <-> GL (Accrual) ---
    /**
     * Creates an Accrual Entry when an Expense is approved.
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

    // --- 5. Disbursement <-> GL (Outlay) ---
    /**
     * Creates a Cash Outlay Entry when a Disbursement occurs.
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

    // --- 6. Asset <-> GL (Depreciation) ---
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

    // --- 7. Workforce (Payroll) <-> CDO (Overhead) ---
    static calculateOverheadAllocation(laborCost: number, functionName: string, pools: any[]): number {
        const pool = pools.find(p => p.functionName === functionName);
        if (!pool) return 0;
        return laborCost * (pool.currentRate / 100);
    }

    // --- 8. Travel <-> GL (Obligation) ---
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

    private static findNodeByFundCode(nodes: FundControlNode[], code: string): FundControlNode | null {
        for (const node of nodes) {
            if (node.name.includes(code) || (code === '0100' && node.level === 'Allocation')) return node;
            if (node.children) {
                const found = this.findNodeByFundCode(node.children, code);
                if (found) return found;
            }
        }
        return null;
    }
}
