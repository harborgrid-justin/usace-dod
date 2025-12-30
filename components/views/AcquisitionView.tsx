
import React, { useState, useCallback } from 'react';
import { Briefcase, ShoppingCart, Hammer, FileCheck } from 'lucide-react';
import PRCenter from '../acquisition/PRCenter';
import SolicitationWorkbench from '../acquisition/SolicitationWorkbench';
import ContractAwardCenter from '../acquisition/ContractAwardCenter';
import { acquisitionService } from '../../services/AcquisitionDataService';
import { useService } from '../../hooks/useService';
import { REMIS_THEME } from '../../constants';

const AcquisitionView: React.FC = () => {
    const [tab, setTab] = useState<'PR' | 'Sols' | 'Awards'>('PR');
    const prs = useService(acquisitionService, () => acquisitionService.getPRs());
    const contracts = useService(acquisitionService, () => acquisitionService.getContracts());
    const sols = useService(acquisitionService, () => acquisitionService.getSolicitations());

    return (
        <div className="p-6 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-full mx-auto overflow-hidden bg-zinc-50/50">
            <div className="flex justify-between items-end shrink-0 px-2">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                        <Briefcase size={28} className="text-zinc-800" /> Procurement Lifecycle
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">FAR/DFARS Compliance Matrix • Execution Oversight</p>
                </div>
                <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner">
                    {['PR', 'Sols', 'Awards'].map(t => (
                        <button 
                            key={t} 
                            onClick={() => setTab(t as any)} 
                            className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                tab === t ? 'bg-white shadow-sm text-zinc-900 border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            {t === 'PR' ? 'Requirements' : t === 'Sols' ? 'Market Logic' : 'Awards'}
                        </button>
                    ))}
                </div>
            </div>
            <div className={`flex-1 ${REMIS_THEME.enterprise.panel} flex flex-col`}>
                {tab === 'PR' && <PRCenter prs={prs} />}
                {tab === 'Sols' && <SolicitationWorkbench solicitations={sols} prs={prs} />}
                {tab === 'Awards' && <ContractAwardCenter contracts={contracts} />}
            </div>
        </div>
    );
};
export default AcquisitionView;
