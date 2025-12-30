import { CDOCostPool, CDOTransaction } from '../types';

export const MOCK_CDO_POOLS: CDOCostPool[] = [
    { id: 'CP-001', functionName: 'Engineering', orgCode: 'LRL-ED', fyBudget: 12000000, obligated: 8500000, currentRate: 18.5, status: 'Active' }
];

export const MOCK_CDO_TRANSACTIONS: CDOTransaction[] = [
    { id: 'CTX-001', date: '2024-03-10', type: 'Labor', amount: 15000, description: 'Overhead Distribution', function: 'Engineering' }
];