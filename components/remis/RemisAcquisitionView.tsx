import React, { useState } from 'react';
import { Briefcase, ShoppingCart, Hammer, Gavel } from 'lucide-react';
import LandPRCenter from './acquisition/LandPRCenter';
import LandSolicitationWorkbench from './acquisition/LandSolicitationWorkbench';
import LandContractAwardCenter from './acquisition/LandContractAwardCenter';

const RemisAcquisitionView: React.FC = () => {
    const [tab, setTab] = useState<'PR' | 'Solicitations' | 'Awards'>('PR');

    const tabs = [
        { id: 'PR', label: 'Requirements (PR)', icon: ShoppingCart },
        { id: 'Solicitations', label: 'Market Logic', icon: Gavel },
        { id: 'Awards', label: 'Award Center', icon: Hammer }
    ];

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Briefcase size={28} className="text-emerald-700" /> Land Acquisition
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">49 CFR Part 24 • Statutory Procurement Pipeline</p>
                </div>
                <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner overflow-x-auto">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${tab === t.id ? 'bg-white shadow-sm text-emerald-800' : 'text-zinc-500 hover:text-zinc-800'}`}>
                            <t.icon size={14}/> {t.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-0">
                {tab === 'PR' && <LandPRCenter />}
                {tab === 'Solicitations' && <LandSolicitationWorkbench />}
                {tab === 'Awards' && <LandContractAwardCenter />}
            </div>
        </div>
    );
};

export default RemisAcquisitionView;