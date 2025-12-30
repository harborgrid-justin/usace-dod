import { WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard } from '../types';

export const MOCK_WWP_SCENARIOS: WorkforceScenario[] = [
    { id: 'SCN-1', name: 'Baseline FY24', fiscalYear: 2024, isBaseline: true, status: 'Final', workloadItemIds: ['WI-1'], workforcePlanIds: ['WP-1'], auditLog: [] }
];

export const MOCK_WWP_WORKLOAD_ITEMS: WorkloadItem[] = [
    { id: 'WI-1', name: 'Dredge Mission', workloadType: 'Operational', quantity: 1200, unit: 'CY' }
];

export const MOCK_WWP_WORKFORCE_PLANS: WorkforcePlan[] = [
    { id: 'WP-1', organization: 'LRL-ED', functionalArea: 'Engineering', entries: [{ laborCategory: 'Engineer', fundedFTE: 45, unfundedFTE: 5 }] }
];

export const MOCK_WWP_LABOR_RATES: LaborRate[] = [
    { laborCategory: 'Engineer', rate: 85.50 }
];

export const MOCK_WWP_LABOR_STANDARDS: LaborStandard[] = [
    { workloadUnit: 'CY', laborCategory: 'Engineer', hoursPerUnit: 0.15 }
];