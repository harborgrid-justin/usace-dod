
import React, { useState, useCallback, Suspense, useTransition, useMemo } from 'react';
import { NavigationTab, AgencyContext } from './types';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ToastProvider } from './components/shared/ToastContext';
import { Activity } from 'lucide-react';

// Lazy Views
const DashboardView = React.lazy(() => import('./components/views/DashboardView.tsx'));
const AnalyticsView = React.lazy(() => import('./components/views/AnalyticsView.tsx'));
const DigitalThreadView = React.lazy(() => import('./components/views/DigitalThreadView.tsx'));
const PPBECycleView = React.lazy(() => import('./components/views/PPBECycleView.tsx'));
const AppropriationsView = React.lazy(() => import('./components/views/AppropriationsView.tsx'));
const ERPView = React.lazy(() => import('./components/views/ERPView.tsx'));
const DisbursementView = React.lazy(() => import('./components/views/DisbursementView.tsx'));
const ObligationsView = React.lazy(() => import('./components/views/ObligationsView.tsx'));
const ContingencyOpsView = React.lazy(() => import('./components/views/ContingencyOpsView.tsx'));
const ComplianceView = React.lazy(() => import('./components/views/ComplianceView.tsx'));
const GaapAuditView = React.lazy(() => import('./components/views/GaapAuditView.tsx'));
const FBWTReconciliationView = React.lazy(() => import('./components/views/FBWTReconciliationView.tsx'));
const RulesEngineView = React.lazy(() => import('./components/views/RulesEngineView.tsx'));
const GovernanceView = React.lazy(() => import('./components/views/GovernanceView.tsx'));
const DepositLiabilitiesView = React.lazy(() => import('./components/views/DepositLiabilitiesView.tsx'));
const RevolvingFundsView = React.lazy(() => import('./components/views/RevolvingFundsView.tsx'));
const CIHOView = React.lazy(() => import('./components/views/CIHOView.tsx'));
const USACEView = React.lazy(() => import('./components/views/USACEView.tsx'));
const CEFMSModulesView = React.lazy(() => import('./components/views/CEFMSModulesView.tsx'));
const WWPView = React.lazy(() => import('./components/views/WWPView.tsx'));
const LaborCostingView = React.lazy(() => import('./components/views/LaborCostingView.tsx'));
const GeneralLedgerView = React.lazy(() => import('./components/views/GeneralLedgerView.tsx'));
const ExpenseDisburseView = React.lazy(() => import('./components/views/ExpenseDisburseView.tsx'));
const CostTransferView = React.lazy(() => import('./components/views/CostTransferView.tsx'));
const TravelView = React.lazy(() => import('./components/views/TravelView.tsx'));
const AcquisitionView = React.lazy(() => import('./components/views/AcquisitionView.tsx'));
const CivilWorksAllowanceView = React.lazy(() => import('./components/views/CivilWorksAllowanceView.tsx'));
const CDOModuleView = React.lazy(() => import('./components/views/CDOModuleView.tsx'));
const AssetLifecycleView = React.lazy(() => import('./components/views/AssetLifecycleView.tsx'));
const BracDssView = React.lazy(() => import('./components/views/BracDssView.tsx'));
// Point directly to the domain-specific entry points to resolve relative path issues
const HAPCasesView = React.lazy(() => import('./components/hap/HAPCasesView.tsx'));
const LGHPortfolioView = React.lazy(() => import('./components/lgh/LGHPortfolioView.tsx'));
const RealPropertyDashboard = React.lazy(() => import('./components/remis/RealPropertyDashboard.tsx'));
const REMISAssetManager = React.lazy(() => import('./components/remis/REMISAssetManager.tsx'));
const GISMapViewer = React.lazy(() => import('./components/remis/GISMapViewer.tsx'));
const OutgrantManager = React.lazy(() => import('./components/remis/OutgrantManager.tsx'));
const CostShareManager = React.lazy(() => import('./components/remis/CostShareManager.tsx'));
const DisposalDashboard = React.lazy(() => import('./components/remis/DisposalDashboard.tsx'));
const EncroachmentDashboard = React.lazy(() => import('./components/remis/EncroachmentDashboard.tsx'));
const RemisReports = React.lazy(() => import('./components/remis/RemisReports.tsx'));
const InternalControlsDashboard = React.lazy(() => import('./components/remis/InternalControlsDashboard.tsx'));
const AppraisalWorkspace = React.lazy(() => import('./components/remis/AppraisalWorkspace.tsx'));
const RemisSolicitationView = React.lazy(() => import('./components/remis/RemisSolicitationView.tsx'));
const RelocationDashboard = React.lazy(() => import('./components/remis/RelocationDashboard.tsx'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full w-full bg-zinc-50/50">
    <div className="flex flex-col items-center gap-2">
      <Activity className="animate-spin text-rose-700" size={32} />
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Resolving Domain...</span>
    </div>
  </div>
);

interface ActiveViewProps {
    tab: NavigationTab;
    agency: AgencyContext;
    selectedProjectId: string | null;
    setSelectedProjectId: (id: string | null) => void;
    selectedThreadId: string | null;
    setSelectedThreadId: (id: string | null) => void;
    selectedContingencyOpId: string | null;
    setSelectedContingencyOpId: (id: string | null) => void;
    navigateToTab: (tab: NavigationTab) => void;
}

const ActiveView: React.FC<ActiveViewProps> = React.memo(({ 
    tab, agency, selectedProjectId, setSelectedProjectId, 
    selectedThreadId, setSelectedThreadId, selectedContingencyOpId, 
    setSelectedContingencyOpId, navigateToTab 
}) => {
  if (agency === 'USACE_REMIS') {
      switch (tab) {
          case NavigationTab.DASHBOARD: return <RealPropertyDashboard />;
          case NavigationTab.REAL_PROPERTY_ASSETS: return <REMISAssetManager />;
          case NavigationTab.APPRAISALS: return <AppraisalWorkspace />;
          case NavigationTab.GIS_MAP: return <GISMapViewer />;
          case NavigationTab.OUTGRANTS_LEASES: return <OutgrantManager />;
          case NavigationTab.COST_SHARE: return <CostShareManager />;
          case NavigationTab.DISPOSALS: return <DisposalDashboard onNavigateToAsset={() => {}} onNavigateToSolicitation={() => navigateToTab(NavigationTab.SOLICITATIONS)} />;
          case NavigationTab.SOLICITATIONS: return <RemisSolicitationView onNavigateToAsset={() => {}} />;
          case NavigationTab.RELOCATION: return <RelocationDashboard onNavigateToAcquisition={() => {}} />;
          case NavigationTab.ENCROACHMENT: return <EncroachmentDashboard onNavigateToGis={() => navigateToTab(NavigationTab.GIS_MAP)} />;
          case NavigationTab.ACQUISITION: return <AcquisitionView />;
          case NavigationTab.COMPLIANCE: return <InternalControlsDashboard />;
          case NavigationTab.REPORTS: return <RemisReports />;
          case NavigationTab.ANALYTICS: return <AnalyticsView />;
          default: return <RealPropertyDashboard />;
      }
  }

  if (agency === 'OSD_BRAC') {
      return <BracDssView />;
  }
  
  if (agency === 'OSD_HAP') {
      return <HAPCasesView />;
  }

  if (agency === 'OSD_LGH') {
      return <LGHPortfolioView />;
  }

  if (agency === 'USACE_CEFMS') {
      switch (tab) {
          case NavigationTab.DASHBOARD: return <DashboardView setActiveTab={navigateToTab} agency={agency} />;
          case NavigationTab.USACE_PROJECTS: return <USACEView selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId} />;
          case NavigationTab.WWP: return <WWPView onSelectProject={(id) => { setSelectedProjectId(id); navigateToTab(NavigationTab.USACE_PROJECTS); }} />;
          case NavigationTab.LABOR_COSTING: return <LaborCostingView onSelectProject={(id) => { setSelectedProjectId(id); navigateToTab(NavigationTab.USACE_PROJECTS); }} />;
          case NavigationTab.GENERAL_LEDGER: return <GeneralLedgerView onSelectProject={(id) => { setSelectedProjectId(id); navigateToTab(NavigationTab.USACE_PROJECTS); }} />;
          case NavigationTab.EXPENSE_DISBURSE: return <ExpenseDisburseView />;
          case NavigationTab.COST_TRANSFERS: return <CostTransferView onSelectProject={(id) => { setSelectedProjectId(id); navigateToTab(NavigationTab.USACE_PROJECTS); }} />;
          case NavigationTab.TRAVEL: return <TravelView />;
          case NavigationTab.ACQUISITION: return <AcquisitionView />;
          case NavigationTab.CIVIL_WORKS_ALLOWANCE: return <CivilWorksAllowanceView />;
          case NavigationTab.CDO_MANAGEMENT: return <CDOModuleView onSelectProject={(id) => { setSelectedProjectId(id); navigateToTab(NavigationTab.USACE_PROJECTS); }} />;
          case NavigationTab.ASSET_LIFECYCLE: return <AssetLifecycleView />;
          case NavigationTab.ERP_CORE: return <CEFMSModulesView onNavigate={navigateToTab} />;
          case NavigationTab.REIMBURSABLES: return <RevolvingFundsView onSelectThread={(id) => { setSelectedThreadId(id); navigateToTab(NavigationTab.DIGITAL_THREAD); }} />;
          default: return <DashboardView setActiveTab={navigateToTab} agency={agency} />;
      }
  }

  // Default Army GFEBS context
  switch (tab) {
    case NavigationTab.DASHBOARD: return <DashboardView setActiveTab={navigateToTab} agency={agency} />;
    case NavigationTab.ANALYTICS: return <AnalyticsView />;
    case NavigationTab.DIGITAL_THREAD: return <DigitalThreadView selectedThreadId={selectedThreadId} setSelectedThreadId={setSelectedThreadId} setActiveTab={navigateToTab} onSelectContingencyOp={setSelectedContingencyOpId} />;
    case NavigationTab.PPBE_CYCLE: return <PPBECycleView agency={agency} />;
    case NavigationTab.APPROPRIATIONS: return <AppropriationsView onSelectThread={(id) => { setSelectedThreadId(id); navigateToTab(NavigationTab.DIGITAL_THREAD); }} agency={agency} />;
    case NavigationTab.ERP_CORE: return <ERPView onSelectThread={(id) => { setSelectedThreadId(id); navigateToTab(NavigationTab.DIGITAL_THREAD); }} agency={agency} />;
    case NavigationTab.DISBURSEMENT: return <DisbursementView />;
    case NavigationTab.OBLIGATIONS: return <ObligationsView />;
    case NavigationTab.CONTINGENCY_OPS: return <ContingencyOpsView selectedContingencyOpId={selectedContingencyOpId} setSelectedContingencyOpId={setSelectedContingencyOpId} onSelectThread={(id) => { setSelectedThreadId(id); navigateToTab(NavigationTab.DIGITAL_THREAD); }} />;
    case NavigationTab.COMPLIANCE: return <ComplianceView onSelectThread={(id) => { setSelectedThreadId(id); navigateToTab(NavigationTab.DIGITAL_THREAD); }} />;
    case NavigationTab.GAAP_AUDIT: return <GaapAuditView onSelectThread={(id) => { setSelectedThreadId(id); navigateToTab(NavigationTab.DIGITAL_THREAD); }} />;
    case NavigationTab.FBWT_RECONCILIATION: return <FBWTReconciliationView onSelectThread={(id) => { setSelectedThreadId(id); navigateToTab(NavigationTab.DIGITAL_THREAD); }} />;
    case NavigationTab.RULES_ENGINE: return <RulesEngineView />;
    case NavigationTab.GOVERNANCE: return <GovernanceView />;
    default: return <DashboardView setActiveTab={navigateToTab} agency={agency} />;
  }
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [agency, setAgency] = useState<AgencyContext>('ARMY_GFEBS');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedContingencyOpId, setSelectedContingencyOpId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const navigateToTab = useCallback((tab: NavigationTab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  }, []);

  const handleSetAgency = useCallback((newAgency: AgencyContext) => {
    startTransition(() => {
      setAgency(newAgency);
    });
  }, []);

  const handleSetSelectedProjectId = useCallback((id: string | null) => {
    startTransition(() => {
      setSelectedProjectId(id);
    });
  }, []);

  const handleSetSelectedThreadId = useCallback((id: string | null) => {
    startTransition(() => {
      setSelectedThreadId(id);
    });
  }, []);

  const handleSetSelectedContingencyOpId = useCallback((id: string | null) => {
    startTransition(() => {
      setSelectedContingencyOpId(id);
    });
  }, []);

  return (
    <ToastProvider>
      <div className={`flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden ${isPending ? 'opacity-80 grayscale-[0.2]' : ''}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={navigateToTab} 
          agency={agency} 
          setAgency={handleSetAgency}
          isSidebarOpen={isSidebarOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Header 
            activeTab={activeTab} 
            agency={agency} 
            setMobileMenuOpen={setMobileMenuOpen}
            notificationsOpen={notificationsOpen}
            setNotificationsOpen={setNotificationsOpen}
          />
          
          <main className="flex-1 overflow-hidden relative">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <ActiveView 
                  tab={activeTab}
                  agency={agency}
                  selectedProjectId={selectedProjectId}
                  setSelectedProjectId={handleSetSelectedProjectId}
                  selectedThreadId={selectedThreadId}
                  setSelectedThreadId={handleSetSelectedThreadId}
                  selectedContingencyOpId={selectedContingencyOpId}
                  setSelectedContingencyOpId={handleSetSelectedContingencyOpId}
                  navigateToTab={navigateToTab}
                />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;
