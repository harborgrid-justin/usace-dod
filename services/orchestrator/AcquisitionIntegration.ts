import { Contract, FundControlNode } from '../../types';
import { acquisitionService } from '../AcquisitionDataService';
import { AdaValidator } from './AdaValidator';

export class AcquisitionIntegration {
    static certifyPR(prId: string, user: string, fundNodes: FundControlNode[]): { success: boolean; message: string } {
        const pr = acquisitionService.getPRs().find(p => p.id === prId);
        if (!pr) return { success: false, message: 'Requirement not found.' };
        const val = AdaValidator.validateGlAgainstAda({ totalAmount: pr.amount, lines: [{ fund: pr.appropriation }] } as any, fundNodes);
        if (!val.valid) return { success: false, message: val.message };

        acquisitionService.updatePR({
            ...pr, status: 'Funds Certified',
            auditLog: [...pr.auditLog, { timestamp: new Date().toISOString(), user, action: 'Funds Certification' }]
        });
        return { success: true, message: 'Requirement certified.' };
    }

    static awardContract(prId: string, vendor: any, user: string): Contract {
        const contract: Contract = {
            id: `W912QR-24-C-${Math.floor(Math.random() * 9000 + 1000)}`,
            vendor: vendor.name, type: 'FFP', value: vendor.amount,
            awardedDate: new Date().toISOString().split('T')[0],
            status: 'Active', prReference: prId, uei: vendor.uei, cageCode: vendor.cageCode,
            periodOfPerformance: { start: new Date().toISOString().split('T')[0], end: '2025-09-30' },
            gInvoicingStatus: 'Accepted', isBerryCompliant: true, modifications: [], auditLog: []
        };
        acquisitionService.addContract(contract);
        return contract;
    }
}