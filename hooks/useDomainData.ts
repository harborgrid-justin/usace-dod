
import { useCallback } from 'react';
import { useService } from './useService';
import { projectService } from '../services/ProjectDataService';
import { maintenanceService } from '../services/MaintenanceDataService';
import { systemService } from '../services/SystemDataService';
import { fundsService } from '../services/FundsDataService';
import { financeService, LiabilityTransaction, CihoTransaction, FbwtCase, FbwtTransaction } from '../services/FinanceDataService';
import { glService } from '../services/GLDataService';
import { acquisitionService } from '../services/AcquisitionDataService';
import { travelService } from '../services/TravelDataService';
import { remisService, RPA_Requirement } from '../services/RemisDataService';
import { erpService, SpendingChainDoc, TCode, BatchJob } from '../services/ERPDataService';
import { expenseDisburseService } from '../services/ExpenseDisburseDataService';
import { complianceService, AuditFinding } from '../services/ComplianceDataService';
import { laborService } from '../services/LaborDataService';
import { wwpService } from '../services/WWPDataService';

import { 
    USACEProject, WorkOrder, InventoryItem, Vendor, 
    Appropriation, FundControlNode, TransferAction, OandMAppropriation,
    DepositFundAccount, CIHOAccount, UMDRecord, NULORecord, ContingencyOperation, USSGLAccount,
    GLTransaction, PurchaseRequest, Contract, Solicitation,
    TravelOrder, TravelVoucher,
    RealPropertyAsset, Outgrant, EncroachmentCase, DisposalAction, AppraisalRecord, HAPCase, LGHLease, BracInstallation, BracScenario, CostShareRecord, RelocationCase, GeospatialFeature,
    IDOCInterface, DigitalThread, BusinessRule, FMRVolume,
    Expense, Disbursement, Timecard, WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard, InvestigatingOfficer
} from '../types';

// Projects
export const useUSACEProjects = () => useService<USACEProject[]>(projectService, useCallback(() => projectService.getProjects(), []));

// Maintenance
export const useMaintenanceData = () => {
    return {
        workOrders: useService<WorkOrder[]>(maintenanceService, useCallback(() => maintenanceService.getWorkOrders(), [])),
        inventory: useService<InventoryItem[]>(maintenanceService, useCallback(() => maintenanceService.getInventory(), [])),
        vendors: useService<Vendor[]>(maintenanceService, useCallback(() => maintenanceService.getVendors(), []))
    };
};

// System
export const useSystemData = () => {
    return {
        users: useService<any[]>(systemService, useCallback(() => systemService.getUsers(), [])),
        logs: useService<any[]>(systemService, useCallback(() => systemService.getLogs(), [])),
        investigatingOfficers: useService<InvestigatingOfficer[]>(systemService, useCallback(() => systemService.getInvestigatingOfficers(), []))
    };
};

// Funds
export const useFundsData = () => {
    return {
        appropriations: useService<Appropriation[]>(fundsService, useCallback(() => fundsService.getAppropriations(), [])),
        fundHierarchy: useService<FundControlNode[]>(fundsService, useCallback(() => fundsService.getHierarchy(), [])),
        transfers: useService<TransferAction[]>(fundsService, useCallback(() => fundsService.getTransfers(), [])),
        oAndM: useService<OandMAppropriation[]>(fundsService, useCallback(() => fundsService.getOandMAppropriations(), [])),
        executionData: useService<any[]>(fundsService, useCallback(() => fundsService.getExecutionData(), [])),
        pomPhases: useService<any[]>(fundsService, useCallback(() => fundsService.getPomPhases(), []))
    };
};

// Finance
export const useFinanceData = () => {
    return {
        depositFunds: useService<DepositFundAccount[]>(financeService, useCallback(() => financeService.getDepositFunds(), [])),
        liabilityTransactions: useService<LiabilityTransaction[]>(financeService, useCallback(() => financeService.getLiabilityTransactions(), [])),
        cihoAccounts: useService<CIHOAccount[]>(financeService, useCallback(() => financeService.getCihoAccounts(), [])),
        cihoTransactions: useService<CihoTransaction[]>(financeService, useCallback(() => financeService.getCihoTransactions(), [])),
        fbwtCases: useService<FbwtCase[]>(financeService, useCallback(() => financeService.getFbwtCases(), [])),
        fbwtTransactions: useService<FbwtTransaction[]>(financeService, useCallback(() => financeService.getFbwtTransactions(), [])),
        contingencyOps: useService<ContingencyOperation[]>(financeService, useCallback(() => financeService.getContingencyOps(), [])),
        ussglAccounts: useService<USSGLAccount[]>(financeService, useCallback(() => financeService.getUssglAccounts(), []))
    };
};

// GL
export const useGLData = () => {
    return {
        transactions: useService<GLTransaction[]>(glService, useCallback(() => glService.getTransactions(), []))
    };
};

// Acquisition
export const useAcquisitionData = () => {
    return {
        prs: useService<PurchaseRequest[]>(acquisitionService, useCallback(() => acquisitionService.getPRs(), [])),
        contracts: useService<Contract[]>(acquisitionService, useCallback(() => acquisitionService.getContracts(), [])),
        solicitations: useService<Solicitation[]>(acquisitionService, useCallback(() => acquisitionService.getSolicitations(), []))
    };
};

// Travel
export const useTravelData = () => {
    return {
        orders: useService<TravelOrder[]>(travelService, useCallback(() => travelService.getOrders(), [])),
        vouchers: useService<TravelVoucher[]>(travelService, useCallback(() => travelService.getVouchers(), []))
    };
};

// REMIS
export const useRemisData = () => {
    return {
        assets: useService<RealPropertyAsset[]>(remisService, useCallback(() => remisService.getAssets(), [])),
        outgrants: useService<Outgrant[]>(remisService, useCallback(() => remisService.getOutgrants(), [])),
        encroachments: useService<EncroachmentCase[]>(remisService, useCallback(() => remisService.getEncroachments(), [])),
        disposals: useService<DisposalAction[]>(remisService, useCallback(() => remisService.getDisposals(), [])),
        appraisals: useService<AppraisalRecord[]>(remisService, useCallback(() => remisService.getAppraisals(), [])),
        hapCases: useService<HAPCase[]>(remisService, useCallback(() => remisService.getHAPCases(), [])),
        lghLeases: useService<LGHLease[]>(remisService, useCallback(() => remisService.getLGHLeases(), [])),
        bracInst: useService<BracInstallation[]>(remisService, useCallback(() => remisService.getBracInstallations(), [])),
        bracScen: useService<BracScenario[]>(remisService, useCallback(() => remisService.getBracScenarios(), [])),
        requirements: useService<RPA_Requirement[]>(remisService, useCallback(() => remisService.getRequirements(), [])),
        costShares: useService<CostShareRecord[]>(remisService, useCallback(() => remisService.getCostShares(), [])),
        relocationCases: useService<RelocationCase[]>(remisService, useCallback(() => remisService.getRelocationCases(), [])),
        solicitations: useService<Solicitation[]>(remisService, useCallback(() => remisService.getSolicitations(), [])),
        features: useService<GeospatialFeature[]>(remisService, useCallback(() => remisService.getFeatures(), []))
    };
};

// ERP
export const useERPData = () => {
    return {
        spendingChain: useService<SpendingChainDoc[]>(erpService, useCallback(() => erpService.getSpendingChain(), [])),
        tCodes: useService<TCode[]>(erpService, useCallback(() => erpService.getTCodes(), [])),
        idocs: useService<IDOCInterface[]>(erpService, useCallback(() => erpService.getIDOCs(), [])),
        batchJobs: useService<BatchJob[]>(erpService, useCallback(() => erpService.getBatchJobs(), []))
    };
};

// Compliance
export const useComplianceData = () => {
    return {
        digitalThreads: useService<DigitalThread[]>(complianceService, useCallback(() => complianceService.getDigitalThreads(), [])),
        businessRules: useService<BusinessRule[]>(complianceService, useCallback(() => complianceService.getBusinessRules(), [])),
        auditFindings: useService<AuditFinding[]>(complianceService, useCallback(() => complianceService.getAuditFindings(), [])),
        fmrVolumes: useService<FMRVolume[]>(complianceService, useCallback(() => complianceService.getFMRVolumes(), []))
    };
};

// Expense
export const useExpenseData = () => {
    return {
        expenses: useService<Expense[]>(expenseDisburseService, useCallback(() => expenseDisburseService.getExpenses(), [])),
        disbursements: useService<Disbursement[]>(expenseDisburseService, useCallback(() => expenseDisburseService.getDisbursements(), []))
    };
};

// Labor
export const useLaborData = () => {
    return {
        timecards: useService<Timecard[]>(laborService, useCallback(() => laborService.getTimecards(), []))
    };
};

// WWP
export const useWWPData = () => {
    return {
        scenarios: useService<WorkforceScenario[]>(wwpService, useCallback(() => wwpService.getScenarios(), [])),
        workloadItems: useService<WorkloadItem[]>(wwpService, useCallback(() => wwpService.getWorkloadItems(), [])),
        workforcePlans: useService<WorkforcePlan[]>(wwpService, useCallback(() => wwpService.getWorkforcePlans(), [])),
        laborRates: useService<LaborRate[]>(wwpService, useCallback(() => wwpService.getLaborRates(), [])),
        laborStandards: useService<LaborStandard[]>(wwpService, useCallback(() => wwpService.getLaborStandards(), []))
    };
};
