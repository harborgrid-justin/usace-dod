
import React from 'react';
import { AgencyContext } from '../../types';
import BracDssView from '../views/BracDssView';
import HAPCasesView from '../views/HAPCasesView';
import LGHPortfolioView from '../views/LGHPortfolioView';

interface OsdRouterProps {
    agency: AgencyContext;
}

const OsdRouter: React.FC<OsdRouterProps> = ({ agency }) => {
    if (agency === 'OSD_BRAC') return <BracDssView />;
    if (agency === 'OSD_HAP') return <HAPCasesView />;
    if (agency === 'OSD_LGH') return <LGHPortfolioView />;
    return <div className="p-8 text-xs font-bold uppercase">Unsupported OSD Domain</div>;
};

export default OsdRouter;
