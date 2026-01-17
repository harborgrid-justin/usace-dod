
import { InvestigatingOfficer } from '../types';
import { MOCK_INVESTIGATING_OFFICERS } from '../constants';

interface UserRecord { id: string; name: string; email: string; role: string; org: string; status: 'Active' | 'Locked' }
interface AdminLog { id: string; action: string; user: string; target: string; date: string; }

const MOCK_USERS: UserRecord[] = [
    { id: 'U-001', name: 'Richards, Alan', email: 'alan.richards@usace.army.mil', role: 'HQ_BUDGET_OFFICER', org: 'USACE-HQ', status: 'Active' },
    { id: 'U-002', name: 'Henderson, Sarah', email: 's.henderson@usace.army.mil', role: 'RE_SPECIALIST', org: 'LRL-RE', status: 'Active' },
    { id: 'U-88122-A', name: 'Sterling, Archer', email: 'archer.sterling@usace.army.mil', role: 'REMIS_APPRAISER', org: 'USACE-LRL', status: 'Active' },
    { id: 'U-99212-B', name: 'Lana, Kane', email: 'lana.kane@usace.army.mil', role: 'REMIS_REVIEWER', org: 'USACE-MVK', status: 'Active' }
];

const MOCK_ADMIN_LOG: AdminLog[] = [
    { id: 'L-1', action: 'Permission Change', user: 'REMIS_ADMIN_1', target: 'Doe, Jane', date: '2024-03-15 08:30:00' },
    { id: 'L-2', action: 'API Key Rotation', user: 'SYSTEM', target: 'REMIS_PROD_DB', date: '2024-03-14 12:00:00' }
];

class SystemDataService {
    private users: UserRecord[] = JSON.parse(JSON.stringify(MOCK_USERS));
    private logs: AdminLog[] = JSON.parse(JSON.stringify(MOCK_ADMIN_LOG));
    private investigatingOfficers: InvestigatingOfficer[] = JSON.parse(JSON.stringify(MOCK_INVESTIGATING_OFFICERS));
    private listeners = new Set<Function>();

    getUsers = () => this.users;
    getLogs = () => this.logs;
    getInvestigatingOfficers = () => this.investigatingOfficers;

    addUser = (user: UserRecord) => {
        this.users = [user, ...this.users];
        this.notify();
    };

    updateUser = (updated: UserRecord) => {
        this.users = this.users.map(u => u.id === updated.id ? updated : u);
        this.notify();
    };
    
    addInvestigatingOfficer = (io: InvestigatingOfficer) => {
        this.investigatingOfficers = [io, ...this.investigatingOfficers];
        this.notify();
    };

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const systemService = new SystemDataService();
