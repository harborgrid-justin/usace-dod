import { BracInstallation, BracScenario, BracAnalysisResult } from '../types';

/**
 * OSD(BRAC) Decision Support System (DSS) Engine
 * Implements 10 U.S.C. § 2687 logic for Base Realignment and Closure.
 */
export class BracDssEngine {

    // --- 1. Military Value Indexing (MVI) ---
    static calculateMVI(installation: BracInstallation): number {
        // Weighted hierarchical model
        const weights = {
            mission: 0.40,
            facilities: 0.30,
            contingency: 0.20, // Guard/Reserve integration
            costEfficiency: 0.10
        };

        const missionScore = (installation.currentTroopDensity / 50000) * 100; // Normalize
        const facilitiesScore = installation.conditionCode;
        const contingencyScore = (installation.totalForceCapacity / (installation.currentTroopDensity || 1)) * 50; // Ratio of capacity to density
        const costScore = 100 - (installation.economicData.defenseDependencyIndex * 100);

        return (
            (Math.min(missionScore, 100) * weights.mission) +
            (facilitiesScore * weights.facilities) +
            (Math.min(contingencyScore, 100) * weights.contingency) +
            (costScore * weights.costEfficiency)
        );
    }

    // --- 2. Operational & Jointness Modeling ---
    static simulateJointness(losing: BracInstallation, gaining: BracInstallation | undefined): number {
        if (!gaining) return 0; // Closure has no joint synergy

        let score = 0;
        // Synergy detection
        if (losing.service !== gaining.service) {
            score += 0.5; // Multi-service synergy
        }
        
        // Interference detection (Mock logic: training range overlap)
        if (losing.availableAcreage < 5000 && gaining.availableAcreage < 10000) {
            score -= 0.8; // Mission interference due to lack of space
        }

        return score; // Positive = Synergy, Negative = Interference
    }

    // --- 3. Capacity & Surge Thresholds ---
    static checkSurgeBuffer(installation: BracInstallation, proposedReduction: number): boolean {
        const remainingCapacity = installation.availableAcreage; // Simplify acreage as proxy for capacity
        const requiredBuffer = installation.projected20YearReq * 1.15; // 115% Threshold
        
        // If we reduce, do we violate the 115% of 20-year requirement?
        // Note: For a closure, remaining is 0, so it always violates if requirement > 0
        return remainingCapacity >= requiredBuffer;
    }

    // --- 4. COBRA Integration (Net Present Value) ---
    static calculateCobraNPV(scenario: BracScenario, discountRate = 0.028): number {
        const years = 20;
        let npv = -scenario.oneTimeMovingCost - scenario.milconCost; // Initial outlay (Year 0)

        for (let t = 1; t <= years; t++) {
            // Steady state savings discounted back to present value
            npv += scenario.annualSavings / Math.pow(1 + discountRate, t);
        }
        return npv;
    }

    // --- 5. ROI Tracking (Payback Period) ---
    static calculateBreakEvenYear(scenario: BracScenario): number {
        const initialCost = scenario.oneTimeMovingCost + scenario.milconCost;
        if (scenario.annualSavings <= 0) return 999; // Never breaks even
        
        const years = initialCost / scenario.annualSavings;
        return Math.ceil(years);
    }

    // --- 6. Economic Impact Geospatial Analysis ---
    static calculateEconomicImpact(losing: BracInstallation, personnelLost: number): number {
        // Multiplier effect (Bureau of Economic Analysis logic)
        const indirectJobMultiplier = 1.5; 
        const totalJobLoss = personnelLost * indirectJobMultiplier;
        
        // % Change in regional employment
        return (totalJobLoss / losing.economicData.regionalEmployment) * 100;
    }

    // --- 7. Community Infrastructure Gap Analysis ---
    static auditReceivingSite(gaining: BracInstallation, personnelIncoming: number): string[] {
        const gaps: string[] = [];
        
        // Thresholds based on DoD standard of living metrics
        if (gaining.infrastructure.schoolCapacityPct > 95) {
            gaps.push("CRITICAL: School Capacity Exceeded");
        }
        
        // Hospital Beds target: 2.5 per 1000
        const currentPopEstimate = 50000; // Mock base population
        const newPop = currentPopEstimate + personnelIncoming;
        const requiredBeds = (newPop / 1000) * 2.5;
        // Assume current beds based on ratio provided in data
        const currentBeds = (currentPopEstimate / 1000) * gaining.infrastructure.hospitalBedsPer1000;
        
        if (currentBeds < requiredBeds) {
            gaps.push("Gap: Medical Treatment Facility capacity insufficient");
        }

        if (['D', 'E', 'F'].includes(gaining.infrastructure.highwayLevelOfService)) {
            gaps.push("Gap: Local Highway Level of Service requires DOT mitigation");
        }

        return gaps;
    }

    // --- 8. Environmental Liability & RESTORE Modeling ---
    static calculateEnvironmentalLiability(installation: BracInstallation): number {
        let cost = 0;
        if (installation.environmental.hasSuperfundSite) {
            cost += installation.environmental.rmisCleanupEstimate;
        }
        // Base closure adds overhead to environmental monitoring
        cost += 5000000; // $5M baseline for ECP generation
        return cost;
    }

    // --- Master Analysis Function ---
    static analyzeScenario(
        scenario: BracScenario, 
        losing: BracInstallation, 
        gaining?: BracInstallation
    ): BracAnalysisResult {
        
        const alerts: string[] = [];

        // 1. MVI
        const mvi = this.calculateMVI(losing);

        // 2. Jointness
        const jointness = this.simulateJointness(losing, gaining);
        if (jointness < 0) alerts.push("Operational Risk: Mission Interference Detected");
        if (jointness > 0) alerts.push("Synergy: Joint Operational Capability gained");

        // 3. Surge
        const isSurgeCompliant = this.checkSurgeBuffer(losing, scenario.personnelMoving);
        if (!isSurgeCompliant) alerts.push("CONSTRAINT: Action violates 20-year Surge Capacity requirement");

        // 4 & 5. COBRA / ROI
        const npv = this.calculateCobraNPV(scenario);
        const breakEven = this.calculateBreakEvenYear(scenario);
        if (breakEven > 20) alerts.push("ROI WARNING: Payback period exceeds 20 years");

        // 6. Economic Impact
        const econImpact = this.calculateEconomicImpact(losing, scenario.personnelMoving);
        if (econImpact > 5) alerts.push("Economic Alert: Severe regional impact (>5% employment loss)");

        // 7. Infrastructure (If Realignment)
        let infraFlag = false;
        if (gaining) {
            const gaps = this.auditReceivingSite(gaining, scenario.personnelMoving);
            if (gaps.length > 0) {
                infraFlag = true;
                alerts.push(...gaps);
            }
        }

        // 8. Environmental
        const envCost = this.calculateEnvironmentalLiability(losing);
        if (losing.environmental.hasSuperfundSite) alerts.push("Liability: Active Superfund (CERCLA) site identified");

        return {
            mviScore: mvi,
            npv,
            paybackPeriod: breakEven,
            breakEvenYear: breakEven,
            isSurgeCompliant,
            jointnessScore: jointness,
            economicImpactIndex: econImpact,
            infrastructureFlag: infraFlag,
            environmentalLiability: envCost,
            alerts
        };
    }

    // --- 9. Statutory Reporting & Workflow ---
    static lockForLegislation(scenario: BracScenario): BracScenario {
        if (scenario.status === 'Final') {
            return {
                ...scenario,
                status: 'Legislatively Locked',
                auditLog: [...scenario.auditLog, {
                    timestamp: new Date().toISOString(),
                    user: 'SYSTEM_LOCK',
                    action: 'Legislative Lock',
                    details: '10 U.S.C. § 2687 Congressional Notification Package Generated.'
                }]
            };
        }
        throw new Error("Cannot lock scenario: Status must be 'Final'");
    }

    // --- 10. Implementation Lifecycle Management ---
    static getLifecycleMilestones(approvalDate: Date) {
        const startYear = approvalDate.getFullYear();
        return [
            { stage: 'Initiation', deadline: new Date(startYear + 2, 8, 30).toISOString(), desc: 'Begin Closure Actions (Statutory: 2 Yrs)' },
            { stage: 'Civilian RIF', deadline: new Date(startYear + 3, 0, 1).toISOString(), desc: 'Reduction in Force Notices' },
            { stage: 'MILCON', deadline: new Date(startYear + 4, 0, 1).toISOString(), desc: 'Receiving Site Construction Complete' },
            { stage: 'Completion', deadline: new Date(startYear + 6, 8, 30).toISOString(), desc: 'Complete Closure (Statutory: 6 Yrs)' },
        ];
    }
}
