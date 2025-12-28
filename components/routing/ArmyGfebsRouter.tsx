
import React from 'react';
import { NavigationTab } from '../../types';
import DashboardView from '../views/DashboardView';
import AnalyticsView from '../views/AnalyticsView';
import DigitalThreadView from '../views/DigitalThreadView';
import PPBECycleView from '../views/PPBECycleView';
import AppropriationsView from '../views/AppropriationsView';
import ERPView from '../views/ERPView';
import DisbursementView from '../views/DisbursementView';
import ObligationsView from '../views/ObligationsView';
import ContingencyOpsView from '../views/ContingencyOpsView';
import ComplianceView from '../views/ComplianceView';
import GaapAuditView from '../views/GaapAuditView';
import FBWTReconciliationView from '../views/FBWTReconciliationView';
import RulesEngineView from '../views/RulesEngineView';
import GovernanceView from '../views/GovernanceView';

const ArmyGfebsRouter: React.FC<any> = ({ tab, agency, threadId, setThreadId, opId, setOpId, navigate }) => {
    switch (tab) {
        case NavigationTab.DASHBOARD: return <DashboardView setActiveTab={navigate} agency={agency} />;
        case NavigationTab.ANALYTICS: return <AnalyticsView />;
        case NavigationTab.DIGITAL_THREAD: return <DigitalThreadView selectedThreadId={threadId} setSelectedThreadId={setThreadId} setActiveTab={navigate} onSelectContingencyOp={setOpId} />;
        case NavigationTab.PPBE_CYCLE: return <PPBECycleView agency={agency} />;
        case NavigationTab.APPROPRIATIONS: return <AppropriationsView onSelectThread={setThreadId} agency={agency} />;
        case NavigationTab.ERP_CORE: return <ERPView onSelectThread={setThreadId} agency={agency} />;
        case NavigationTab.DISBURSEMENT: return <DisbursementView />;
        case NavigationTab.OBLIGATIONS: return <ObligationsView />;
        case NavigationTab.CONTINGENCY_OPS: return <ContingencyOpsView selectedContingencyOpId={opId} setSelectedContingencyOpId={setOpId} onSelectThread={setThreadId} />;
        case NavigationTab.COMPLIANCE: return <ComplianceView onSelectThread={setThreadId} />;
        case NavigationTab.GAAP_AUDIT: return <GaapAuditView onSelectThread={setThreadId} />;
        case NavigationTab.FBWT_RECONCILIATION: return <FBWTReconciliationView onSelectThread={setThreadId} />;
        case NavigationTab.RULES_ENGINE: return <RulesEngineView />;
        case NavigationTab.GOVERNANCE: return <GovernanceView />;
        default: return <DashboardView setActiveTab={navigate} agency={agency} />;
    }
};

export default ArmyGfebsRouter;
