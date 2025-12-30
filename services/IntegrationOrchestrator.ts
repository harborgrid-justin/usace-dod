
import { 
    CDOCostPool, GLTransaction, RealPropertyAsset, Asset, Outgrant, RelocationBenefit, 
    RelocationCase, Expense, ProjectOrder, ReimbursableOrder, ContingencyOperation, 
    InventoryItem, TravelOrder, TravelVoucher, FundControlNode, Contract 
} from '../types';
import { AssetIntegration } from './orchestrator/AssetIntegration';
import { AdaValidator } from './orchestrator/AdaValidator';
import { TraceabilityService } from './orchestrator/TraceabilityService';
import { FinancialIntegration } from './orchestrator/FinancialIntegration';
import { ProjectIntegration } from './orchestrator/ProjectIntegration';
import { TravelIntegration } from './orchestrator/TravelIntegration';
import { AcquisitionIntegration } from './orchestrator/AcquisitionIntegration';

export class IntegrationOrchestrator {
    static getProjectTraceability = TraceabilityService.getProjectTraceability;
    static validateGlAgainstAda = AdaValidator.validateGlAgainstAda;
    static handleAssetLifecycleEvent = AssetIntegration.handleLifecycleEvent;
    
    static generateDepreciationJournal = AssetIntegration.generateDepreciationJournal;
    static createRemisAsset = AssetIntegration.createRemisAsset;
    static handleOutgrantBilling = AssetIntegration.handleOutgrantBilling;
    static generateExpenseFromRelocationBenefit = AssetIntegration.generateExpenseFromRelocationBenefit;
    
    static generateAccrualFromExpense = FinancialIntegration.generateAccrualFromExpense;
    static generateDisbursementFromExpense = FinancialIntegration.generateDisbursementFromExpense;
    static generateCostTransferJournal = FinancialIntegration.generateCostTransferJournal;
    
    static tagIncrementalCost = ProjectIntegration.tagIncrementalCost;
    static generateObligationFromProjectOrder = ProjectIntegration.generateObligationFromProjectOrder;
    static generateRevenueRecognition = ProjectIntegration.generateRevenueRecognition;
    static validateInventoryDrawdown = ProjectIntegration.validateInventoryDrawdown;
    
    static generateTravelObligation = TravelIntegration.generateTravelObligation;
    static generateVoucherDisbursement = TravelIntegration.generateVoucherDisbursement;
    
    static certifyPR = AcquisitionIntegration.certifyPR;
    static awardContract = AcquisitionIntegration.awardContract;

    static calculateOverheadAllocation(laborCost: number, functionName: string, pools: CDOCostPool[]): number {
        const pool = pools.find(p => p.functionName === functionName);
        return pool ? laborCost * (pool.currentRate / 100) : 0;
    }
}
