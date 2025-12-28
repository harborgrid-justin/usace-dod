
import { RealPropertyAsset, Outgrant, DisposalAction } from '../types';

export const MOCK_REMIS_ASSETS: RealPropertyAsset[] = [
    {
        rpuid: 'RPUID-662104', rpaName: 'Engineering Research Center', installation: 'ERDC-VICKSBURG', catcode: '61050',
        interestType: 'Fee', status: 'Active', acres: 42.5, sqFt: 125000, hasGeo: true, acquisitionDate: '1985-06-12',
        operationalStatus: 'Operational', currentValue: 45000000, deferredMaintenance: 1200000, utilizationRate: 98,
        missionDependency: 'Critical', jurisdiction: 'Exclusive', accountableDistrict: 'MVK', custody: 'USACE',
        sourceSystem: 'REMIS', originatingOrg: 'ERDC', a123Status: 'Certified', auditLog: [], versionHistory: []
    }
];

export const MOCK_REMIS_OUTGRANTS: Outgrant[] = [
    {
        id: 'DACA01-1-24-001', grantee: 'Coastal Wind Power LLC', type: 'Lease', authority: '10 USC 2667',
        permittedUse: 'Wind Turbine Placement', location: 'Section A, Fort Story', annualRent: 125000,
        termStart: '2024-01-01', expirationDate: '2049-12-31', status: 'Active', paymentFrequency: 'Annual',
        nextPaymentDate: '2025-01-01', assetId: 'RPUID-110022', auditLog: [], versionHistory: []
    }
];

export const MOCK_REMIS_DISPOSALS: DisposalAction[] = [
    {
        id: 'DISP-24-101', assetId: 'RPUID-882103', type: 'Public Sale', screeningStatus: 'Federal Screening',
        reportedExcessDate: '2024-01-10', estimatedProceeds: 1100000, auditLog: [], versionHistory: []
    }
];
