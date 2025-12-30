import { DisposalAction, EncroachmentCase, AuditLogEntry } from '../../types';

export class RemisTransactionService {
    static createDisposalAction(assetId: string, type: DisposalAction['type'], proceeds: number, user: string): DisposalAction {
        return {
            id: `DISP-${Date.now()}`,
            assetId,
            type,
            estimatedProceeds: proceeds,
            screeningStatus: 'Submitted',
            reportedExcessDate: new Date().toISOString().split('T')[0],
            auditLog: [{ timestamp: new Date().toISOString(), user, action: 'Initiated' }],
            versionHistory: []
        };
    }

    static createEncroachmentCase(assetId: string, description: string, user: string): EncroachmentCase {
        return {
            id: `ENC-${Date.now()}`,
            assetId,
            description,
            type: 'Unauthorized Use',
            status: 'Reported',
            discoveryDate: new Date().toISOString().split('T')[0],
            locationDescription: 'TBD',
            responsibleOfficial: user,
            tasks: [],
            auditLog: [{ timestamp: new Date().toISOString(), user, action: 'Reported' }]
        };
    }
}