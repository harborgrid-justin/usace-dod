import { TravelOrder, TravelVoucher, GLTransaction } from '../../types';
import { generateSecureId } from '../../utils/security';
import { glService } from '../GLDataService';

export class TravelIntegration {
    static generateTravelObligation(order: TravelOrder): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-TO'), date: new Date().toISOString().split('T')[0],
            description: `Travel Authorization: ${order.traveler}`, type: 'Obligation',
            sourceModule: 'Travel', referenceDoc: order.id, totalAmount: order.estCost,
            status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }

    static generateVoucherDisbursement(voucher: TravelVoucher): GLTransaction {
        const glEntry: GLTransaction = {
            id: generateSecureId('GL-TV'), date: new Date().toISOString().split('T')[0],
            description: `Travel Settlement: ${voucher.traveler}`, type: 'Disbursement',
            sourceModule: 'Travel', referenceDoc: voucher.id, totalAmount: voucher.totalClaimed,
            status: 'Posted', createdBy: 'SYSTEM', lines: [], auditLog: []
        };
        glService.addTransaction(glEntry);
        return glEntry;
    }
}