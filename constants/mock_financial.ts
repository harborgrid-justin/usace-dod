
import { Obligation, UMDRecord, NULORecord } from '../types';

export const MOCK_OBLIGATIONS: Obligation[] = [
    { 
        id: 'OBL-001', vendor: 'V-NEX SOLUTIONS LLC', documentNumber: 'W912QR-24-C-0001', 
        description: 'Engineering Services - Ohio River', fiscalYear: 2024, appropriation: '21 2020',
        programElement: '111001', objectClass: '25.1', amount: 1500000, disbursedAmount: 500000, 
        unliquidatedAmount: 1000000, status: 'Open', date: '2023-11-15', lastActivityDate: '2024-02-20',
        obligationType: 'Contract', auditLog: []
    }
];

export const MOCK_UMD_RECORDS: UMDRecord[] = [
    { id: 'UMD-001', tas: '96X3122', amount: 45000, ageDays: 124, sourceModule: 'Disbursement', researchStatus: 'Researching', assignedTo: 'Analyst A' }
];

export const MOCK_NULO_RECORDS: NULORecord[] = [
    { id: 'NULO-001', documentNumber: 'W912QR-23-C-001', amount: -5400, varianceReason: 'Incorrect quantity billed by vendor', status: 'Correction Pending' }
];
