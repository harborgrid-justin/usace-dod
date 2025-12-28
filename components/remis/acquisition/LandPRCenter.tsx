import React, { useState, useCallback } from 'react';
import { acquisitionService } from '../../../services/AcquisitionDataService';
import { useService } from '../../../hooks/useService';
import { PurchaseRequest } from '../../../types';
import PRSidebar from './PRSidebar';
import PRDetails from './PRDetails';
import PRFormModal from '../../acquisition/PRFormModal';

const LandPRCenter: React.FC = () => {
    const prs = useService<PurchaseRequest[]>(acquisitionService, useCallback(() => acquisitionService.getPRs(), []));
    const [selectedId, setSelectedId] = useState<string | null>(prs[0]?.id || null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const selectedPR = prs.find(p => p.id === selectedId);

    const handleCreate = (newPR: PurchaseRequest) => {
        acquisitionService.addPR(newPR);
        setIsFormOpen(false);
        setSelectedId(newPR.id);
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full min-h-0 overflow-hidden">
            <PRSidebar prs={prs} selectedId={selectedId} onSelect={setSelectedId} onAdd={() => setIsFormOpen(true)} />
            <PRDetails pr={selectedPR || null} onDelete={() => {}} />
            {isFormOpen && <PRFormModal onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />}
        </div>
    );
};

export default LandPRCenter;