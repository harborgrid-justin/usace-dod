import { BracInstallation, BracScenario, BracAnalysisResult } from '../types';
import { BracCalculations } from './brac/BracCalculations';

export class BracDssEngine {
    static analyzeScenario(scenario: BracScenario, losing: BracInstallation, gaining?: BracInstallation): BracAnalysisResult {
        const alerts: string[] = [];
        const mvi = BracCalculations.calculateMVI(losing);
        const npv = BracCalculations.calculateNPV(scenario);
        const breakEven = Math.ceil((scenario.oneTimeMovingCost + scenario.milconCost) / Math.max(1, scenario.annualSavings));
        const econImpact = BracCalculations.calculateEconomicImpact(losing, scenario.personnelMoving);
        
        if (breakEven > 20) alerts.push("ROI WARNING: Payback period exceeds 20 years");
        if (econImpact > 5) alerts.push("Economic Alert: Severe regional impact (>5%)");
        if (losing.availableAcreage < losing.projected20YearReq * 1.15) alerts.push("CONSTRAINT: Violates Surge Capacity requirement");

        return {
            mviScore: mvi, npv, paybackPeriod: breakEven, breakEvenYear: breakEven,
            isSurgeCompliant: losing.availableAcreage >= losing.projected20YearReq * 1.15,
            jointnessScore: gaining && losing.service !== gaining.service ? 0.5 : 0,
            economicImpactIndex: econImpact, infrastructureFlag: !!gaining,
            environmentalLiability: losing.environmental.rmisCleanupEstimate + 5000000,
            alerts
        };
    }

    static lockForLegislation(scenario: BracScenario): BracScenario {
        return {
            ...scenario, status: 'Legislatively Locked',
            auditLog: [...scenario.auditLog, { timestamp: new Date().toISOString(), user: 'SYSTEM', action: 'Legislative Lock', details: '10 U.S.C. 2687 Package Generated.' }]
        };
    }

    static getLifecycleMilestones(date: Date) {
        const y = date.getFullYear();
        return [
            { stage: 'Initiation', deadline: new Date(y + 2, 8, 30).toISOString(), desc: 'Begin Closure Actions' },
            { stage: 'Civilian RIF', deadline: new Date(y + 3, 0, 1).toISOString(), desc: 'Reduction in Force Notices' },
            { stage: 'Completion', deadline: new Date(y + 6, 8, 30).toISOString(), desc: 'Final Disposal' }
        ];
    }
}