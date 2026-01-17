
import { Timecard } from '../types';

const MOCK_TIMECARDS: Timecard[] = [
    {
        id: 'TC-24-05-001',
        employeeName: 'John Smith',
        employeeGrade: 'GS-12',
        payPeriod: '2024-03-A',
        status: 'Draft',
        totalHours: 80,
        totalCost: 6840,
        entries: [
            { project: '123456 - Ohio River Lock', workItem: 'Eng Services', hours: [8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 0, 0], rate: 85.50 },
            { project: 'CDO - Overhead', workItem: 'General Admin', hours: [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], rate: 85.50 },
        ]
    },
    {
        id: 'TC-24-05-002',
        employeeName: 'Jane Doe',
        employeeGrade: 'GS-11',
        payPeriod: '2024-03-A',
        status: 'Signed',
        totalHours: 80,
        totalCost: 5200,
        entries: [
            { project: '998877 - Miss. River Maint', workItem: 'Field Ops', hours: [9, 9, 9, 9, 4, 0, 0, 9, 9, 9, 9, 4, 0, 0], rate: 65.00 },
        ]
    }
];

class LaborDataService {
    private timecards: Timecard[] = JSON.parse(JSON.stringify(MOCK_TIMECARDS));
    private listeners = new Set<Function>();

    getTimecards = () => this.timecards;

    updateTimecard = (updated: Timecard) => {
        this.timecards = this.timecards.map(tc => tc.id === updated.id ? updated : tc);
        this.notify();
    };

    addTimecard = (tc: Timecard) => {
        this.timecards = [tc, ...this.timecards];
        this.notify();
    };

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const laborService = new LaborDataService();
