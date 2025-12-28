
import React, { lazy } from 'react';
import { NavigationTab, AgencyContext } from '../../types';

const ArmyGfebsRouter = lazy(() => import('./ArmyGfebsRouter'));
const UsaceCefmsRouter = lazy(() => import('./UsaceCefmsRouter'));
const RemisRouter = lazy(() => import('./RemisRouter'));
const OsdRouter = lazy(() => import('./OsdRouter'));

interface RouterProps {
    tab: NavigationTab;
    agency: AgencyContext;
    projectId: string | null;
    setProjectId: (id: string | null) => void;
    threadId: string | null;
    setThreadId: (id: string | null) => void;
    opId: string | null;
    setOpId: (id: string | null) => void;
    navigate: (tab: NavigationTab) => void;
}

const ActiveViewRouter: React.FC<RouterProps> = (props) => {
    const { agency } = props;

    if (agency === 'USACE_REMIS') return <RemisRouter {...props} />;
    if (agency.startsWith('OSD_')) return <OsdRouter {...props} />;
    if (agency === 'USACE_CEFMS') return <UsaceCefmsRouter {...props} />;
    
    return <ArmyGfebsRouter {...props} />;
};

export default React.memo(ActiveViewRouter);
