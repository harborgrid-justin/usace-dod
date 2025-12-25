
import React, { useState, useCallback } from 'react';
import { NavigationTab, AgencyContext } from './types';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ToastProvider } from './components/shared/ToastContext';

import DashboardView from './components/views/DashboardView';
import DigitalThreadView from './components/views/DigitalThreadView';
import PPBECycleView from './components/views/PPBECycleView';
import AppropriationsView from './components/views/AppropriationsView';
import FundsControlView from './components/views/FundsControlView';
import ERPView from './components/views/ERPView';
import DisbursementView from './components/views/DisbursementView';
import ComplianceView from './components/views/ComplianceView';
import GovernanceView from './components/views/GovernanceView';
import GaapAuditView from './components/views/GaapAuditView';
import AnalyticsView from './components/views/AnalyticsView';
import DepositLiabilitiesView from './components/views/DepositLiabilitiesView';
import RevolvingFundsView from './components/views/RevolvingFundsView';
import CIHOView from './components/views/CIHOView';
import FBWTReconciliationView from './components/views/FBWTReconciliationView';
import ContingencyOpsView from './components/views/ContingencyOpsView';
import OandMAppropriationsView from './components/views/OandMAppropriationsView';
import ReimbursablesView from './components/views/ReimbursablesView';
import RulesEngineView from './components/views/RulesEngineView';
import USACEView from './components/views/USACEView';
import CivilWorksAllowanceView from './components/views/CivilWorksAllowanceView';
import CDOModuleView from './components/views/CDOModuleView';
import AssetLifecycleView from './components/views/AssetLifecycleView';
import GeneralLedgerView from './components/views/GeneralLedgerView';
import ExpenseDisburseView from './components/views/ExpenseDisburseView';
import WWPView from './components/views/WWPView';
import CEFMSModulesView from './components/views/CEFMSModulesView';
import AcquisitionView from './components/views/AcquisitionView';
import TravelView from './components/views/TravelView';
import LaborCostingView from './components/views/LaborCostingView';
import CostTransferView from './components/views/CostTransferView';
import SystemAdminView from './components/views/SystemAdminView';
import ObligationsView from './components/views/ObligationsView';
import ResourceEstimatesView from './components/resource_estimates/ResourceEstimatesView';
import HAPCasesView from './components/hap/HAPCasesView';
import LGHPortfolioView from './components/lgh/LGHPortfolioView';
import BracDssView from './components/views/BracDssView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [agency, setAgency] = useState<AgencyContext>('ARMY_GFEBS'); // Multi-Tenant State
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>('TR-10001');
  const [selectedContingencyOpId, setSelectedContingencyOpId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const navigateToThread = useCallback((id: string) => {
    setSelectedThreadId(id);
    setActiveTab(NavigationTab.DIGITAL_THREAD);
  }, [setActiveTab, setSelectedThreadId]);

  const navigateToContingencyOp = useCallback((id: string) => {
    setSelectedContingencyOpId(id);
    setActiveTab(NavigationTab.CONTINGENCY_OPS);
  }, [setActiveTab, setSelectedContingencyOpId]);

  const navigateToProject = useCallback((id: string) => {
    setSelectedProjectId(id);
    setAgency('USACE_CEFMS'); // Automatically switch context
    setActiveTab(NavigationTab.USACE_PROJECTS);
  }, [setActiveTab, setSelectedProjectId, setAgency]);
  
  const renderActiveView = () => {
    // USACE Specific Overrides
    if (agency === 'USACE_CEFMS') {
        switch (activeTab) {
            case NavigationTab.DASHBOARD:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
            case NavigationTab.USACE_PROJECTS:
                return <USACEView selectedProjectId={selectedProjectId} onSelectProject={navigateToProject} />;
            case NavigationTab.SYSTEM_ADMIN:
                return <SystemAdminView />;
            case NavigationTab.ANALYTICS:
                return <AnalyticsView />;
            
            // Program Execution
            case NavigationTab.WWP:
                return <WWPView onSelectProject={navigateToProject} />;
            case NavigationTab.LABOR_COSTING:
                return <LaborCostingView onSelectProject={navigateToProject} />;
            case NavigationTab.PPBE_CYCLE:
                return <ResourceEstimatesView agency={agency} />;
            case NavigationTab.ACQUISITION:
                return <AcquisitionView />;
            case NavigationTab.REVOLVING_FUNDS:
                return <RevolvingFundsView onSelectThread={navigateToThread} />;
            case NavigationTab.APPROPRIATIONS:
                return <AppropriationsView onSelectThread={navigateToThread} agency={agency} />;
            case NavigationTab.REIMBURSABLES:
                return <ReimbursablesView agency={agency} onSelectProject={navigateToProject} />;

            // Financial Operations
            case NavigationTab.GENERAL_LEDGER:
                return <GeneralLedgerView onSelectProject={navigateToProject}/>;
            case NavigationTab.EXPENSE_DISBURSE:
                return <ExpenseDisburseView />;
            case NavigationTab.COST_TRANSFERS:
                return <CostTransferView onSelectProject={navigateToProject} />;
            case NavigationTab.TRAVEL:
                return <TravelView />;
            case NavigationTab.CIVIL_WORKS_ALLOWANCE:
                return <CivilWorksAllowanceView />;
            case NavigationTab.CDO_MANAGEMENT:
                return <CDOModuleView onSelectProject={navigateToProject} />;
            case NavigationTab.ASSET_LIFECYCLE:
                return <AssetLifecycleView />;
            case NavigationTab.ERP_CORE:
                return <CEFMSModulesView onNavigate={setActiveTab} />;
            case NavigationTab.DISBURSEMENT:
                return <DisbursementView />;
            case NavigationTab.FBWT_RECONCILIATION:
                return <FBWTReconciliationView onSelectThread={navigateToThread} />;
            case NavigationTab.CONTINGENCY_OPS:
                return <ContingencyOpsView selectedContingencyOpId={selectedContingencyOpId} setSelectedContingencyOpId={setSelectedContingencyOpId} onSelectThread={navigateToThread} />;
            case NavigationTab.OBLIGATIONS:
                return <ObligationsView />;

            // Control & Audit
            case NavigationTab.ADMIN_CONTROL:
                return <FundsControlView agency={agency} />;
            case NavigationTab.COMPLIANCE:
                return <ComplianceView onSelectThread={navigateToThread} />;
            case NavigationTab.GOVERNANCE:
                return <GovernanceView />;
                
            // Fallback
            default:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
        }
    }

    // OSD BRAC Specific Overrides
    if (agency === 'OSD_BRAC') {
        switch (activeTab) {
            case NavigationTab.DASHBOARD:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
            case NavigationTab.BRAC_DSS:
                return <BracDssView />;
            case NavigationTab.PPBE_CYCLE:
                return <ResourceEstimatesView agency={agency} />;
            case NavigationTab.APPROPRIATIONS:
                return <AppropriationsView onSelectThread={navigateToThread} agency={agency} />;
            case NavigationTab.ANALYTICS:
                return <AnalyticsView />;
            case NavigationTab.ASSET_LIFECYCLE:
                return <AssetLifecycleView />;
            case NavigationTab.REIMBURSABLES:
                return <ReimbursablesView agency={agency} />;
            case NavigationTab.ADMIN_CONTROL:
                return <FundsControlView agency={agency} />;
            case NavigationTab.OBLIGATIONS:
                return <ObligationsView />;
            case NavigationTab.DISBURSEMENT:
                return <DisbursementView />;
            case NavigationTab.COMPLIANCE:
                return <ComplianceView onSelectThread={navigateToThread} />;
            default:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
        }
    }

    // OSD HAP Specific Overrides
    if (agency === 'OSD_HAP') {
        switch (activeTab) {
            case NavigationTab.DASHBOARD:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
            case NavigationTab.HAP_CASES:
                return <HAPCasesView />;
            case NavigationTab.APPROPRIATIONS:
                return <AppropriationsView onSelectThread={navigateToThread} agency={agency} />;
            case NavigationTab.ASSET_LIFECYCLE:
                return <AssetLifecycleView />;
            case NavigationTab.DISBURSEMENT:
                return <DisbursementView />;
            case NavigationTab.ADMIN_CONTROL:
                return <FundsControlView agency={agency} />;
            case NavigationTab.OBLIGATIONS:
                return <ObligationsView />;
            case NavigationTab.COMPLIANCE:
                return <ComplianceView onSelectThread={navigateToThread} />;
            case NavigationTab.ANALYTICS:
                return <AnalyticsView />;
            default:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
        }
    }

    // USACE HAPMIS Specific Overrides
    if (agency === 'USACE_HAPMIS') {
        switch (activeTab) {
            case NavigationTab.DASHBOARD:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
            case NavigationTab.HAP_CASES:
                return <HAPCasesView />;
            case NavigationTab.APPROPRIATIONS:
                return <AppropriationsView onSelectThread={navigateToThread} agency={agency} />;
            case NavigationTab.ASSET_LIFECYCLE:
                return <AssetLifecycleView />;
            case NavigationTab.DISBURSEMENT:
                return <DisbursementView />;
            case NavigationTab.ADMIN_CONTROL:
                return <FundsControlView agency={agency} />;
            case NavigationTab.OBLIGATIONS:
                return <ObligationsView />;
            case NavigationTab.COMPLIANCE:
                return <ComplianceView onSelectThread={navigateToThread} />;
            case NavigationTab.ANALYTICS:
                return <AnalyticsView />;
            default:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
        }
    }

    // OSD LGH Specific Overrides
    if (agency === 'OSD_LGH') {
        switch (activeTab) {
            case NavigationTab.DASHBOARD:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
            case NavigationTab.LGH_PORTFOLIO:
                return <LGHPortfolioView />;
            case NavigationTab.APPROPRIATIONS:
                return <AppropriationsView onSelectThread={navigateToThread} agency={agency} />;
            case NavigationTab.ASSET_LIFECYCLE:
                return <AssetLifecycleView />;
            case NavigationTab.DISBURSEMENT:
                return <DisbursementView />;
            case NavigationTab.ADMIN_CONTROL:
                return <FundsControlView agency={agency} />;
            case NavigationTab.OBLIGATIONS:
                return <ObligationsView />;
            case NavigationTab.COMPLIANCE:
                return <ComplianceView onSelectThread={navigateToThread} />;
            case NavigationTab.ANALYTICS:
                return <AnalyticsView />;
            default:
                return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
        }
    }


    switch (activeTab) {
      case NavigationTab.DASHBOARD:
        return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
      case NavigationTab.DIGITAL_THREAD:
        return <DigitalThreadView selectedThreadId={selectedThreadId} setSelectedThreadId={setSelectedThreadId} setActiveTab={setActiveTab} onSelectContingencyOp={navigateToContingencyOp} />;
      case NavigationTab.PPBE_CYCLE:
        return <PPBECycleView />;
      case NavigationTab.ADMIN_CONTROL:
        return <FundsControlView agency={agency} />;
      case NavigationTab.REIMBURSABLES:
        return <ReimbursablesView agency={agency} onSelectProject={navigateToProject} />;
      case NavigationTab.APPROPRIATIONS:
        return <AppropriationsView onSelectThread={navigateToThread} agency={agency} />;
      case NavigationTab.ERP_CORE:
        return <ERPView onSelectThread={navigateToThread} agency={agency} />;
      case NavigationTab.DISBURSEMENT:
        return <DisbursementView />;
      case NavigationTab.COMPLIANCE:
        return <ComplianceView onSelectThread={navigateToThread} />;
      case NavigationTab.GOVERNANCE:
        return <GovernanceView />;
      case NavigationTab.GAAP_AUDIT:
        return <GaapAuditView onSelectThread={navigateToThread} />;
       case NavigationTab.O_AND_M_APPROPRIATIONS:
        return <OandMAppropriationsView />;
       case NavigationTab.DEPOSIT_LIABILITIES:
        return <DepositLiabilitiesView />;
      case NavigationTab.REVOLVING_FUNDS:
        return <RevolvingFundsView onSelectThread={navigateToThread} />;
      case NavigationTab.CASH_OUTSIDE_TREASURY:
        return <CIHOView setActiveTab={setActiveTab} />;
      case NavigationTab.FBWT_RECONCILIATION:
        return <FBWTReconciliationView onSelectThread={navigateToThread} />;
      case NavigationTab.CONTINGENCY_OPS:
        return <ContingencyOpsView selectedContingencyOpId={selectedContingencyOpId} setSelectedContingencyOpId={setSelectedContingencyOpId} onSelectThread={navigateToThread} />;
      case NavigationTab.RULES_ENGINE:
        return <RulesEngineView />;
      case NavigationTab.ANALYTICS:
        return <AnalyticsView />;
      case NavigationTab.OBLIGATIONS:
        return <ObligationsView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} agency={agency} />;
    }
  };

  return (
    <ToastProvider>
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
          <ErrorBoundary>
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              agency={agency}
              setAgency={setAgency}
              isSidebarOpen={isSidebarOpen}
              isMobileMenuOpen={isMobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </ErrorBoundary>
          
          <div className="flex-1 flex flex-col min-h-0">
            <Header 
              activeTab={activeTab} 
              agency={agency}
              setMobileMenuOpen={setMobileMenuOpen}
              notificationsOpen={notificationsOpen}
              setNotificationsOpen={setNotificationsOpen}
            />
            
            <main className="flex-1 overflow-hidden relative">
              <ErrorBoundary>
                {renderActiveView()}
              </ErrorBoundary>
            </main>
          </div>
        </div>
    </ToastProvider>
  );
};

export default App;
