import { BracInstallation, BracScenario } from '../../types';

export class BracCalculations {
    static calculateMVI(inst: BracInstallation): number {
        const w = { mission: 0.4, facilities: 0.3, contingency: 0.2, cost: 0.1 };
        const m = (inst.currentTroopDensity / 50000) * 100;
        const f = inst.conditionCode;
        const c = (inst.totalForceCapacity / (inst.currentTroopDensity || 1)) * 50;
        const co = 100 - (inst.economicData.defenseDependencyIndex * 100);
        return (Math.min(m, 100) * w.mission) + (f * w.facilities) + (Math.min(c, 100) * w.contingency) + (co * w.cost);
    }

    static calculateNPV(scenario: BracScenario, rate = 0.028): number {
        let npv = -scenario.oneTimeMovingCost - scenario.milconCost;
        for (let t = 1; t <= 20; t++) npv += scenario.annualSavings / Math.pow(1 + rate, t);
        return npv;
    }

    static calculateEconomicImpact(inst: BracInstallation, moving: number): number {
        return ((moving * 1.5) / inst.economicData.regionalEmployment) * 100;
    }
}