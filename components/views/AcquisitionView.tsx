
import React, { useState, useCallback } from 'react';
import { Briefcase, ShoppingCart, Hammer, FileCheck } from 'lucide-react';
import PRCenter from '../acquisition/PRCenter';
import SolicitationWorkbench from '../acquisition/SolicitationWorkbench';
import ContractAwardCenter from '../acquisition/ContractAwardCenter';
import { acquisitionService } from '../../services/AcquisitionDataService';
import { useService } from '../../hooks/useService';

const AcquisitionView: React.FC = () => {
    const [tab, setTab] = useState<'PR' | 'Sols' | 'Awards'>('PR');
    const prs = useService(acquisitionService, () => acquisitionService.getPRs());
    const contracts = useService(acquisitionService, () => acquisitionService.getContracts());
    const sols = useService(acquisitionService, () => acquisitionService.getSolicitations());

    return (
        <div className="p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex justify-between items-end shrink-0">
                <div><h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3"><Briefcase size={28} className="text-rose-700" /> Procurement</h2><p className="text-xs text-zinc-500 font-medium">FAR/DFARS Compliance Lifecycle</p></div>
                <div className="flex bg-zinc-100 p-1 rounded-xl shadow-inner">
                    {['PR', 'Sols', 'Awards'].map(t => (
                        <button key={t} onClick={() => setTab(t as any)} className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${tab === t ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500'}`}>{t}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {tab === 'PR' && <PRCenter prs={prs} />}
                {tab === 'Sols' && <SolicitationWorkbench solicitations={sols} prs={prs} />}
                {tab === 'Awards' && <ContractAwardCenter contracts={contracts} />}
            </div>
        </div>
    );
};
export default AcquisitionView;
