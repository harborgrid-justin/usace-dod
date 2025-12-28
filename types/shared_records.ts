
export interface AuditLogEntry {
    timestamp: string;
    user: string;
    action: string;
    organization?: string;
    transactionId?: string;
    details?: string;
    reason?: string;
}

export interface RetrievalLogEntry {
    timestamp: string;
    user: string;
    entityId: string;
    entityType: 'Asset' | 'Outgrant' | 'Solicitation' | 'Appraisal';
    accessRole: string;
    purpose: string;
}

export interface VersionEntry<T> {
    timestamp: string;
    user: string;
    snapshot: Partial<T>;
    effectiveDate?: string;
    reason?: string;
}

export interface ReportMetadata {
    id: string;
    generatedBy: string;
    timestamp: string;
    reportType: string;
    parameters: string; 
    hash: string;
}
