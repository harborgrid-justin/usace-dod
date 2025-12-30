export const FIAR_CONTROLS = [
    { id: 'C1', name: 'Entity Level Controls', status: 'PASS', score: 98 },
    { id: 'C2', name: 'Procure to Pay', status: 'PASS', score: 95 }
];

export const MOCK_AUDIT_FINDINGS = [
    { id: 'AF-2024-001', severity: 'Material Weakness', description: 'Incomplete documentation for PR&C certification', linkedTransactionIds: ['TR-10001'] },
    { id: 'AF-2024-002', severity: 'Significant Deficiency', description: 'Stale ULO records exceeding 180 days', linkedTransactionIds: ['TR-10002'] }
];

export const MOCK_RISK_DISTRIBUTION = [
    { name: 'Low', value: 65, color: '#10b981' },
    { name: 'Medium', value: 20, color: '#f59e0b' },
    { name: 'High', value: 15, color: '#ef4444' }
];