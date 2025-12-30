
import React, { useState, useEffect } from 'react';
import { FileText, LayoutDashboard, Settings } from 'lucide-react';
import { FADocument, WorkAllowance } from '../../types';
import { cwaService } from '../../services/CivilWorksDataService';
import CWA_Dashboard from '../cwa/CWA_Dashboard';
import CWA_Manager from '../cwa/CWA_Manager';

const CivilWorksAllowanceView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Management'>('Dashboard');
    const [fads, setFads] = useState<FADocument[]>(cwaService.getFADs());
    const [allowances, setAllowances] = useState<WorkAllowance[]>(cwaService.getAllowances());

    useEffect(() => {
        const unsubscribe = cwaService.subscribe(() => {
            setFads([...cwaService.getFADs()]);
            setAllowances([...cwaService.getAllowances()]);
        });
        return unsubscribe;
    }, []);

    const handleCreateFAD = (fad: FADocument) => {
        cwaService.addFAD(fad);
    };

    const handleCreateAllowance = (allowance: WorkAllowance) => {
        cwaService.addAllowance(allowance);
    };

    const handleUpdateAllowance = (allowance: WorkAllowance) => {
        cwaService.updateAllowance(allowance);
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 px-2">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <FileText size={24} className="text-rose-700" /> Civil Works Allowance
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">FAD Tracking & Work Allowance (WA) Issuance (ER 37-1-30)</p>
                </div>
                
                <div className="flex bg-zinc-100 p-1 rounded-lg shadow-inner">
                    <button 
                        onClick={() => setActiveTab('Dashboard')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                            activeTab === 'Dashboard' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        <LayoutDashboard size={14} /> Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('Management')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                            activeTab === 'Management' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        <Settings size={14} /> Manage Authority
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                {activeTab === 'Dashboard' ? (
                    <CWA_Dashboard fads={fads} allowances={allowances} />
                ) : (
                    <CWA_Manager 
                        fads={fads} 
                        allowances={allowances}
                        onCreateFAD={handleCreateFAD}
                        onCreateAllowance={handleCreateAllowance}
                        onUpdateAllowance={handleUpdateAllowance}
                    />
                )}
            </div>
        </div>
    );
};

export default CivilWorksAllowanceView;
