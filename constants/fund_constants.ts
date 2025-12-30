
import { FundControlLevel, FundControlNode } from '../types/funds_types';

export const COMMAND_HIERARCHY: FundControlNode = {
    id: 'DOD-ROOT', parentId: null, name: 'Department of Defense', level: 'Apportionment' as FundControlLevel, totalAuthority: 850000000000, amountDistributed: 750000000000, amountCommitted: 0, amountObligated: 600000000000, amountExpended: 500000000000, isCMA: false, children: [
        { id: 'ARMY-ROOT', parentId: 'DOD-ROOT', name: 'Department of the Army', level: 'Allotment' as FundControlLevel, totalAuthority: 185000000000, amountDistributed: 150000000000, amountCommitted: 0, amountObligated: 120000000000, amountExpended: 100000000000, isCMA: false, children: [], history: [] }
    ], history: []
};

export const MOCK_FUND_HIERARCHY: FundControlNode[] = [COMMAND_HIERARCHY];

// Added missing POM_PHASES
export const POM_PHASES = [
    { year: '2026', phase: 'Formulation', progress: 85, status: 'Active' },
    { year: '2027', phase: 'Review', progress: 40, status: 'Active' },
    { year: '2028', phase: 'Planning', progress: 10, status: 'Active' },
    { year: '2025', phase: 'Enactment', progress: 100, status: 'Completed' }
];

// Added missing MOCK_EXECUTION_DATA
export const MOCK_EXECUTION_DATA = [
    { month: 'Oct', planned: 1.2, actual: 1.1 },
    { month: 'Nov', planned: 2.4, actual: 2.5 },
    { month: 'Dec', planned: 3.6, actual: 3.2 },
    { month: 'Jan', planned: 4.8, actual: 4.9 },
    { month: 'Feb', planned: 6.0, actual: 6.2 },
    { month: 'Mar', planned: 7.2, actual: 7.1 }
];
