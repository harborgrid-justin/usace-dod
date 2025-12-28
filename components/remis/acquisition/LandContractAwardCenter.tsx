
import React, { useState, useCallback } from 'react';
import { acquisitionService } from '../../../services/AcquisitionDataService';
import { useService } from '../../../hooks/useService';
import { Contract } from '../../../types';
import ContractSidebar from './ContractSidebar';
import ContractDetails from './ContractDetails';
import ContractFormModal from '../../acquisition/ContractFormModal';

const LandContractAwardCenter: React.FC = () => {
    const contracts = useService<Contract[]>(acquisitionService, useCallback(() => acquisitionService.getContracts(), []));
    const [selectedId, setSelectedId] = useState<string | null>(contracts[0]?.id || null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const selectedContract = contracts.find(c => c.id === selectedId);

    const handleCreate = (newContract: Contract) => {
        acquisitionService.addContract(newContract);
        setIsFormOpen(false);
        setSelectedId(newContract.id);
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full min-h-0 overflow-hidden">
            <ContractSidebar 
                contracts={contracts} 
                selectedId={selectedId} 
                onSelect={setSelectedId} 
                onAdd={() => setIsFormOpen(true)} 
            />
            <ContractDetails 
                contract={selectedContract || null}
            />
            {isFormOpen && <ContractFormModal onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} />}
        </div>
    );
};

export default LandContractAwardCenter;
