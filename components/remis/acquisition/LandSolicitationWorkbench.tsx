
import React, { useState, useCallback } from 'react';
import { acquisitionService } from '../../../services/AcquisitionDataService';
import { useService } from '../../../hooks/useService';
import { Solicitation, PurchaseRequest } from '../../../types';
import SolicitationSidebar from './SolicitationSidebar';
import SolicitationWorkspace from './SolicitationWorkspace';

const LandSolicitationWorkbench: React.FC = () => {
    const solicitations = useService<Solicitation[]>(acquisitionService, useCallback(() => acquisitionService.getSolicitations(), []));
    const prs = useService<PurchaseRequest[]>(acquisitionService, useCallback(() => acquisitionService.getPRs(), []));
    const [selectedId, setSelectedId] = useState<string | null>(solicitations[0]?.id || null);

    const selectedSol = solicitations.find(s => s.id === selectedId);
    const linkedPR = prs.find(p => p.id === selectedSol?.prId);

    const handleUpdate = (updated: Solicitation) => {
        acquisitionService.updateSolicitation(updated);
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full min-h-0 overflow-hidden">
            <SolicitationSidebar 
                sols={solicitations} 
                selectedId={selectedId} 
                onSelect={setSelectedId} 
            />
            <SolicitationWorkspace 
                sol={selectedSol || null} 
                pr={linkedPR || null}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default LandSolicitationWorkbench;
