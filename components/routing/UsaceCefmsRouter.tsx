
import React from 'react';
import { NavigationTab } from '../../types';
import DashboardView from '../views/DashboardView';
import USACEView from '../views/USACEView';
import WWPView from '../views/WWPView';
import LaborCostingView from '../views/LaborCostingView';
import GeneralLedgerView from '../views/GeneralLedgerView';
import ExpenseDisburseView from '../views/ExpenseDisburseView';
import CostTransferView from '../views/CostTransferView';
import TravelView from '../views/TravelView';
import AcquisitionView from '../views/AcquisitionView';
import CivilWorksAllowanceView from '../views/CivilWorksAllowanceView';
import CDOModuleView from '../views/CDOModuleView';
import AssetLifecycleView from '../views/AssetLifecycleView';
import CEFMSModulesView from '../views/CEFMSModulesView';
import RevolvingFundsView from '../views/RevolvingFundsView';

const UsaceCefmsRouter: React.FC<any> = ({ tab, agency, projectId, setProjectId, setThreadId, navigate }) => {
    switch (tab) {
        case NavigationTab.DASHBOARD: return <DashboardView setActiveTab={navigate} agency={agency} />;
        case NavigationTab.USACE_PROJECTS: return <USACEView selectedProjectId={projectId} onSelectProject={setProjectId} />;
        case NavigationTab.WWP: return <WWPView onSelectProject={(id) => { setProjectId(id); navigate(NavigationTab.USACE_PROJECTS); }} />;
        case NavigationTab.LABOR_COSTING: return <LaborCostingView onSelectProject={(id) => { setProjectId(id); navigate(NavigationTab.USACE_PROJECTS); }} />;
        case NavigationTab.GENERAL_LEDGER: return <GeneralLedgerView onSelectProject={(id) => { setProjectId(id); navigate(NavigationTab.USACE_PROJECTS); }} />;
        case NavigationTab.EXPENSE_DISBURSE: return <ExpenseDisburseView />;
        case NavigationTab.COST_TRANSFERS: return <CostTransferView onSelectProject={(id) => { setProjectId(id); navigate(NavigationTab.USACE_PROJECTS); }} />;
        case NavigationTab.TRAVEL: return <TravelView />;
        case NavigationTab.ACQUISITION: return <AcquisitionView />;
        case NavigationTab.CIVIL_WORKS_ALLOWANCE: return <CivilWorksAllowanceView />;
        case NavigationTab.CDO_MANAGEMENT: return <CDOModuleView onSelectProject={(id) => { setProjectId(id); navigate(NavigationTab.USACE_PROJECTS); }} />;
        case NavigationTab.ASSET_LIFECYCLE: return <AssetLifecycleView />;
        case NavigationTab.ERP_CORE: return <CEFMSModulesView onNavigate={navigate} />;
        case NavigationTab.REIMBURSABLES: return <RevolvingFundsView onSelectThread={(id) => { setThreadId(id); navigate(NavigationTab.DIGITAL_THREAD); }} />;
        default: return <DashboardView setActiveTab={navigate} agency={agency} />;
    }
};

export default UsaceCefmsRouter;
