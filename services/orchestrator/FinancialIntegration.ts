
import { Expense, GLTransaction, CostTransfer } from '../../types';
import { generateSecureId } from '../../utils/security';
import { glService } from '../GLDataService';

export class FinancialIntegration {
    static generateAccrualFromExpense(expense: Expense): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-ACC'), date: new Date().toISOString().split('T')[0],
            description: `Accrual: ${expense.description}`, type: 'Accrual', sourceModule: 'Expense', 
            referenceDoc: expense.id, totalAmount: expense.amount, status: 'Posted', createdBy: 'SYSTEM',
            lines: [{ ussglAccount: '610000', description: 'Exp', debit: expense.amount, credit: 0, fund: '0100', costCenter: 'DEF' }],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    static generateDisbursementFromExpense(expense: Expense, disbursementId: string): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-PAY'), date: new Date().toISOString().split('T')[0],
            description: `Payment Outlay: ${expense.description}`, type: 'Disbursement',
            sourceModule: 'Expense', referenceDoc: disbursementId, totalAmount: expense.amount,
            status: 'Posted', createdBy: 'SYSTEM',
            lines: [{ ussglAccount: '101000', description: 'FBwT', debit: 0, credit: expense.amount, fund: '0100', costCenter: 'DEF' }],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    /**
     * Fix: Added missing generateCostTransferJournal for CostTransferView
     */
    static generateCostTransferJournal(transfer: CostTransfer, user: string): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-CT'),
            date: new Date().toISOString().split('T')[0],
            description: `Cost Transfer: ${transfer.justification}`,
            type: 'Transfer',
            sourceModule: 'Financial',
            referenceDoc: transfer.id,
            totalAmount: transfer.amount,
            status: 'Posted',
            createdBy: user,
            lines: [
                { ussglAccount: '610000', description: 'Debit Target', debit: transfer.amount, credit: 0, fund: transfer.targetProjectId, costCenter: 'TRANS' },
                { ussglAccount: '610000', description: 'Credit Source', debit: 0, credit: transfer.amount, fund: transfer.sourceProjectId, costCenter: 'TRANS' }
            ],
            auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }
}
