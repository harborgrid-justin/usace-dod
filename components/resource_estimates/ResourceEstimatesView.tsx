
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BarChart3, FileSpreadsheet, Layers, FileText, Landmark, ShieldCheck } from 'lucide-react';
import REDashboard from './REDashboard';
import BudgetWorksheet from './BudgetWorksheet';
import POMBuilder from './POMBuilder';
import JSheetGenerator from './JSheetGenerator';
import { AgencyContext, BudgetLineItem, POMEntry, BusinessLine } from '../../types';
import { MOCK_POM_ENTRIES, MOCK_BUDGET_LINE_ITEMS } from '../../constants';

interface ResourceEstimatesViewProps {
    agency?: AgencyContext;
}

const ResourceEstimatesView: React.FC<ResourceEstimatesViewProps> = ({ agency }) => {
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Budget' | 'POM' | 'Exhibits'>('Dashboard');
    
    // Module State Store (Production Pattern: Local State as Source of Truth)
    const [budgetItems, setBudgetItems] = useState<BudgetLineItem[]>(MOCK_BUDGET_LINE_ITEMS as BudgetLineItem[]);
    const [pomEntries, setPomEntries] = useState<POMEntry[]>(MOCK_POM_ENTRIES);
    const [inflationRate, setInflationRate] = useState<number>(3.2);

    // Persistence Simulation (Log changes as if hitting an API)
    useEffect(() => {
        console.debug("[RE_ENGINE] State Updated. Syncing to D-AFMP Shared Memory...", { budgetItems, pomEntries });
    }, [budgetItems, pomEntries]);

    // Action Handlers
    const addBudgetItem = useCallback((item: BudgetLineItem) => {
        setBudgetItems(prev => [item, ...prev]);
    }, []);

    const deleteBudgetItem = useCallback((id: string) => {
        setBudgetItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updatePOM = useCallback((updatedEntries: POMEntry[]) => {
        setPomEntries(updatedEntries);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <REDashboard items={budgetItems} pom={pomEntries} />;
            case 'Budget':
                return (
                    <BudgetWorksheet 
                        items={budgetItems} 
                        onAdd={addBudgetItem} 
                        onDelete={deleteBudgetItem} 
                    />
                );
            case 'POM':
                return (
                    <POMBuilder 
                        entries={pomEntries} 
                        rate={inflationRate} 
                        onRateChange={setInflationRate} 
                        onUpdate={updatePOM} 
                    />
                );
            case 'Exhibits':
                return <JSheetGenerator items={budgetItems} pom={pomEntries} />;
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'Dashboard', icon: BarChart3, label: 'Execution Dashboard' },
        { id: 'Budget', icon: FileSpreadsheet, label: 'Budget Formulation' },
        { id: 'POM', icon: Layers, label: '5-Year Plan (POM)' },
        { id: 'Exhibits', icon: FileText, label: 'J-Sheets (Justification)' },
    ];

    const isOsd = agency === 'OSD_BRAC';

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 shrink-0">
                <div>
                    <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${isOsd ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}`}>
                            <BarChart3 size={24} />
                         </div>
                         <div>
                            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight leading-none">
                                {isOsd ? 'BRAC Program Cycle' : 'Resource Estimates (RE)'}
                            </h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                <ShieldCheck size={12} className="text-emerald-600"/>
                                {isOsd ? 'Cost to Complete • Cleanup • Caretaker' : 'Civil Works • Budget Defense • POM 26-30'}
                            </p>
                         </div>
                    </div>
                </div>
                
                <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                    <div className="flex bg-zinc-100 p-1 rounded-xl min-w-max shadow-inner border border-zinc-200/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                    activeTab === tab.id 
                                    ? (isOsd ? 'bg-white shadow-sm text-indigo-700 border border-indigo-100' : 'bg-white shadow-sm text-rose-700 border border-rose-100') 
                                    : 'text-zinc-500 hover:text-zinc-800'
                                }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white border border-zinc-200 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResourceEstimatesView;
