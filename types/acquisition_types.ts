import { AuditLogEntry } from './shared_records';

export type PRStatus = 'Draft' | 'Pending Certification' | 'Funds Certified' | 'Solicitation' | 'Awarded';

export interface PurchaseRequest {
    id: string;
    description: string;
    amount: number;
    requester: string;
    date: string;
    status: PRStatus;
    justification?: string;
    appropriation?: string;
    objectClass?: string;
    wbsCode?: string;
    auditLog: AuditLogEntry[];
}

export type ContractStatus = 'Active' | 'Under Mod' | 'Closed' | 'Completed' | 'Terminated' | 'Canceled';

export interface Contract {
    id: string;
    vendor: string;
    type: string;
    value: number;
    awardedDate: string;
    status: ContractStatus;
    prReference: string;
    uei: string;
    cageCode: string;
    periodOfPerformance: { start: string; end: string };
    gInvoicingStatus: 'Accepted' | 'Pending' | 'Not Applicable';
    isBerryCompliant: boolean;
    modifications: ContractMod[];
    auditLog: AuditLogEntry[];
}

export interface ContractMod {
    id: string;
    modNumber: string;
    date: string;
    amountDelta: number;
    description: string;
    authority: string;
    status: 'Executed' | 'Pending';
}