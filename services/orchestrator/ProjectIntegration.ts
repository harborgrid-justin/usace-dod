import { ProjectOrder, ReimbursableOrder, CostTransfer, GLTransaction, ContingencyOperation, InventoryItem } from '../../types';
import { generateSecureId } from '../../utils/security';
import { glService } from '../GLDataService';

export class ProjectIntegration {
    static tagIncrementalCost(operation: ContingencyOperation, amount: number): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-TAG'), date: new Date().toISOString().split('T')[0],
            description: `Contingency Tag: ${operation.name}`, type: 'Contingency Tagging',
            sourceModule: 'Contingency', referenceDoc: operation.id, totalAmount: amount,
            status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    static generateObligationFromProjectOrder(order: ProjectOrder, user: string): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-OBL'), date: new Date().toISOString().split('T')[0],
            description: `Project Order Obligation: ${order.orderNumber}`, type: 'Obligation',
            sourceModule: 'Reimbursable', referenceDoc: order.id, totalAmount: order.totalAmount,
            status: 'Posted', createdBy: user,
            lines: [{ ussglAccount: '480100', description: 'UDO', debit: order.totalAmount, credit: 0, fund: order.appropriation, costCenter: 'LRL' }],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    static generateRevenueRecognition(order: ReimbursableOrder, amount: number): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-REV'), date: new Date().toISOString().split('T')[0],
            description: `Revenue Recognition: ${order.orderNumber}`, type: 'Revenue',
            sourceModule: 'Reimbursable', referenceDoc: order.id, totalAmount: amount,
            status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    /**
     * Fix: Added missing validateInventoryDrawdown for WorkOrderDetailModal
     */
    static validateInventoryDrawdown(item: InventoryItem, qty: number): { success: boolean; error?: string } {
        if (item.quantityOnHand < qty) {
            return { success: false, error: `Insufficient inventory: ${item.name} has ${item.quantityOnHand} units, requested ${qty}.` };
        }
        // Fix: Removed erroneous 'true' key from return object to match declared interface.
        return { success: true };
    }
}