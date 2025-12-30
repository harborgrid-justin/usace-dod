
import React from 'react';
import { NavigationTab } from '../../types';
import RealPropertyDashboard from '../remis/RealPropertyDashboard';
import REMISAssetManager from '../remis/REMISAssetManager';
import AppraisalWorkspace from '../remis/AppraisalWorkspace';
import GISMapViewer from '../remis/GISMapViewer';
import OutgrantManager from '../remis/OutgrantManager';
import CostShareManager from '../remis/CostShareManager';
import DisposalDashboard from '../remis/DisposalDashboard';
import RemisSolicitationView from '../remis/RemisSolicitationView';
import RelocationDashboard from '../remis/RelocationDashboard';
import EncroachmentDashboard from '../remis/EncroachmentDashboard';
import RemisAcquisitionView from '../remis/RemisAcquisitionView';
import InternalControlsDashboard from '../remis/InternalControlsDashboard';
import RemisReports from '../remis/RemisReports';
import AnalyticsView from '../views/AnalyticsView';
import REMISAdminView from '../views/REMISAdminView';
import RemisRequirementManager from '../remis/RemisRequirementManager';

const RemisRouter: React.FC<any> = ({ tab, navigate, setProjectId }) => {
    // Shared navigation handler for assets
    const handleToAsset = (id: string) => {
        setProjectId(id);
        navigate(NavigationTab.REAL_PROPERTY_ASSETS);
    };

    switch (tab) {
        case NavigationTab.DASHBOARD: 
            return <RealPropertyDashboard onNavigateToAsset={handleToAsset} />;
        case NavigationTab.REMIS_REQUIREMENTS: 
            return <RemisRequirementManager />;
        case NavigationTab.REAL_PROPERTY_ASSETS: 
            return <REMISAssetManager />;
        case NavigationTab.APPRAISALS: 
            return <AppraisalWorkspace />;
        case NavigationTab.GIS_MAP: 
            return <GISMapViewer />;
        case NavigationTab.OUTGRANTS_LEASES: 
            return <OutgrantManager />;
        case NavigationTab.COST_SHARE: 
            return <CostShareManager />;
        case NavigationTab.DISPOSALS: 
            return <DisposalDashboard onNavigateToAsset={handleToAsset} onNavigateToSolicitation={() => navigate(NavigationTab.SOLICITATIONS)} />;
        case NavigationTab.SOLICITATIONS: 
            return <RemisSolicitationView />;
        case NavigationTab.RELOCATION: 
            return <RelocationDashboard onNavigateToAcquisition={() => navigate(NavigationTab.ACQUISITION)} />;
        case NavigationTab.ENCROACHMENT: 
            return <EncroachmentDashboard onNavigateToGis={() => navigate(NavigationTab.GIS_MAP)} />;
        case NavigationTab.ACQUISITION: 
            return <RemisAcquisitionView />;
        case NavigationTab.COMPLIANCE: 
            return <InternalControlsDashboard />;
        case NavigationTab.REPORTS: 
            return <RemisReports />;
        case NavigationTab.ANALYTICS: 
            return <AnalyticsView />;
        case NavigationTab.REMIS_ADMIN: 
            return <REMISAdminView />;
        default: 
            return <RealPropertyDashboard onNavigateToAsset={handleToAsset} />;
    }
};

export default RemisRouter;
