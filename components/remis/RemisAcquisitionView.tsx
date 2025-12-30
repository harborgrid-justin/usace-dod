
import React, { useState } from 'react';
import { Briefcase, ShoppingCart, Hammer, Gavel, ShieldCheck, Database } from 'lucide-react';
import LandPRCenter from './acquisition/LandPRCenter';
import LandSolicitationWorkbench from './acquisition/LandSolicitationWorkbench';
import LandContractAwardCenter from './acquisition/LandContractAwardCenter';
import { REMIS_THEME } from '../../constants/theme';
import FiduciaryBadge from '../shared/FiduciaryBadge';

const RemisAcquisitionView: React.FC = () => {
    const [tab, setTab] = useState<'PR' | 'Solicitations' | 'Awards'>('PR');

    const tabs = [
        { id: 'PR', label: 'Requirements', icon: ShoppingCart },
        { id: 'Solicitations', label: 'Market Logic', icon: Gavel },
        { id: 'Awards', label: 'Award Center', icon: Hammer }
    ];

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-full mx-auto overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0 px-2">
                <div className="min-w-0">
                    <h2 className={REMIS_THEME.typography.h2}>
                        <Briefcase size={28} className="text-emerald-700 inline-block mr-3 -mt-1" /> 
                        Land Acquisition
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                        49 CFR Part 24 • Uniform Act Compliance • <span className="text-emerald-600 font-bold">REMIS INTEGRATED</span>
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                    <div className="hidden md:flex gap-2">
                        <FiduciaryBadge variant="dark" icon>FEDERAL ACQUISITION</FiduciaryBadge>
                    </div>
                    <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner overflow-x-auto w-full sm:w-auto">
                        {tabs.map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => setTab(t.id as any)} 
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                    tab === t.id ? 'bg-white shadow-sm text-emerald-800 border border-emerald-100' : 'text-zinc-500 hover:text-zinc-800'
                                }`}
                            >
                                <t.icon size={14}/> {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex-1 bg-white border border-zinc-200 rounded-[40px] shadow-sm overflow-hidden flex flex-col min-h-0 relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none rotate-12">
                    <Database size={240} />
                </div>
                {tab === 'PR' && <LandPRCenter />}
                {tab === 'Solicitations' && <LandSolicitationWorkbench />}
                {tab === 'Awards' && <LandContractAwardCenter />}
            </div>
        </div>
    );
};

export default RemisAcquisitionView;
