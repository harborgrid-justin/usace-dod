import { BusinessRule, Appropriation, USACEProject, CDOCostPool, Asset, PurchaseRequest, Contract, POMEntry, BudgetLineItem } from './types';

export * from './constants/theme';
export * from './constants/mock_remis';
export * from './constants/mock_financial';
export * from './constants/audit_constants';
export * from './constants/fund_constants';
export * from './constants/mock_usace';
export * from './constants/mock_wwp';
export * from './constants/mock_cdo';

export const MOCK_DIGITAL_THREADS = [
    { id: 'TR-10001', vendorName: 'V-NEX SOLUTIONS', appropriation: '21 2020', obligationAmt: 500000, disbursementAmt: 250000, unliquidatedAmt: 250000, unit: 'LRL District', blockchainHash: 'ABC123XYZ789', gaapStandard: 'SFFAS 7', controlObjective: 'Existence', tasSymbol: '21 2020 000', eftStatus: 'Settled', supplyClass: 'II', niinNsn: '1234-01-222-3333', serialNumber: 'SN-001', uicCode: 'W12345', readinessImpact: 'High', bonaFideValid: true, berryCompliant: true, ppaInterestRisk: false, gl1010: 'Balanced', programElement: 'PE123', costCenter: 'CC100', fadNumber: 'FAD123', vendorUEI: 'UEI123', contractVehicle: 'GSA', miprReference: 'MIPR123', socioEconomicStatus: 'SB' },
    { id: 'TR-10002', vendorName: 'DEFENSE LOGISTICS', appropriation: '21 2020', obligationAmt: 1200000, disbursementAmt: 400000, unliquidatedAmt: 800000, unit: 'SAM District', blockchainHash: 'DEF456UVW012', gaapStandard: 'SFFAS 7', controlObjective: 'Valuation', tasSymbol: '21 2020 000', eftStatus: 'Pending', supplyClass: 'IV', niinNsn: '5678-01-444-5555', serialNumber: 'SN-002', uicCode: 'W67890', readinessImpact: 'Critical', bonaFideValid: true, berryCompliant: false, ppaInterestRisk: true, gl1010: 'Balanced', auditFindingId: 'FIND-001', programElement: 'PE456', costCenter: 'CC200', fadNumber: 'FAD456', vendorUEI: 'UEI456', contractVehicle: 'IDIQ', miprReference: 'MIPR456', socioEconomicStatus: 'HUBZone', invoiceDaysPending: 45, dssnNumber: '5555', betcCode: 'COLL' }
];

export const MOCK_BUSINESS_RULES: BusinessRule[] = [
    { id: 'R-001', code: 'ADA-01', name: 'Anti-Deficiency Check', description: 'Obligation must not exceed available authority.', domain: 'Financial', severity: 'Critical', logicString: 'IF obligation > authority THEN violation', citation: '31 U.S.C. 1517', isActive: true, conditions: [{ field: 'amount', operator: 'GREATER_THAN', value: 1000000 }] },
    { id: 'R-002', code: 'PAY-002', name: 'PPA Interest Monitor', description: 'Payments must be within 30 days of invoice.', domain: 'Financial', severity: 'Warning', logicString: 'IF days > 30 THEN flag', citation: 'Prompt Payment Act', isActive: true, conditions: [{ field: 'invoiceDaysPending', operator: 'GREATER_THAN', value: 30 }] }
];

export const DOD_FMR_VOLUMES = [
    { id: 'V12_CH23', volume: 'Volume 12, Chapter 23', title: 'Contingency Operations', category: 'Budget', sizeMB: 4.2, pages: 120 },
    { id: 'V11B', volume: 'Volume 11B', title: 'Reimbursements and Revenue Recognition', category: 'Accounting', sizeMB: 8.5, pages: 340 }
];

export const ERP_TCODES = [
    { code: 'F110', description: 'Automatic Payment Run', module: 'FI', riskLevel: 'High' },
    { code: 'ME21N', description: 'Create Purchase Order', module: 'MM', riskLevel: 'Medium' }
];

export const REIMBURSABLE_RATES = {
    assetUseCharge: 0.04,
    unfundedCivRetirement: 0.18,
    postRetirementHealth: 0.065,
    contractAdminCharge: 0.05,
    milLaborAcceleration: 0.12
};

export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = [];
export const MOCK_CONTRACTS_LIST: Contract[] = [];
export const MOCK_INVENTORY = [];
export const MOCK_VENDORS = [];