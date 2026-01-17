
import { WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard } from '../types';
import { MOCK_WWP_SCENARIOS, MOCK_WWP_WORKLOAD_ITEMS, MOCK_WWP_WORKFORCE_PLANS, MOCK_WWP_LABOR_RATES, MOCK_WWP_LABOR_STANDARDS } from '../constants';

class WWPDataService {
    private scenarios: WorkforceScenario[] = JSON.parse(JSON.stringify(MOCK_WWP_SCENARIOS));
    private workloadItems: WorkloadItem[] = JSON.parse(JSON.stringify(MOCK_WWP_WORKLOAD_ITEMS));
    private workforcePlans: WorkforcePlan[] = JSON.parse(JSON.stringify(MOCK_WWP_WORKFORCE_PLANS));
    private laborRates: LaborRate[] = JSON.parse(JSON.stringify(MOCK_WWP_LABOR_RATES));
    private laborStandards: LaborStandard[] = JSON.parse(JSON.stringify(MOCK_WWP_LABOR_STANDARDS));
    private listeners = new Set<Function>();

    getScenarios = () => this.scenarios;
    getWorkloadItems = () => this.workloadItems;
    getWorkforcePlans = () => this.workforcePlans;
    getLaborRates = () => this.laborRates;
    getLaborStandards = () => this.laborStandards;

    updateScenario = (updated: WorkforceScenario) => {
        this.scenarios = this.scenarios.map(s => s.id === updated.id ? updated : s);
        this.notify();
    };

    addScenario = (scenario: WorkforceScenario) => {
        this.scenarios = [...this.scenarios, scenario];
        this.notify();
    };

    updateWorkloadItem = (updated: WorkloadItem) => {
        this.workloadItems = this.workloadItems.map(i => i.id === updated.id ? updated : i);
        this.notify();
    };

    updateWorkforcePlan = (updated: WorkforcePlan) => {
        this.workforcePlans = this.workforcePlans.map(p => p.id === updated.id ? updated : p);
        this.notify();
    };

    updateLaborRate = (updated: LaborRate) => {
        this.laborRates = this.laborRates.map(r => r.laborCategory === updated.laborCategory ? updated : r);
        this.notify();
    };

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const wwpService = new WWPDataService();
