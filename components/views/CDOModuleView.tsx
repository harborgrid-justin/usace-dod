
import React, { useState } from 'react';
import { PieChart, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { MOCK_CDO_POOLS, MOCK_CDO_TRANSACTIONS } from '../../constants';
import CDOOverview from '../cdo/CDOOverview';
import CDORateManager from '../cdo/CDORateManager';
import CDOCostCapture from '../cdo/CDOCostCapture';
import CDOBudgetManager from '../cdo/CDOBudgetManager';

const CDOModuleView: React.FC<any> = ({ onSelectProject }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [pools, setPools] = useState(MOCK_CDO_POOLS);
    const [transactions, setTransactions] = useState(MOCK_CDO_TRANSACTIONS);

    const tabs = [
        { id: 'Overview', icon: BarChart3 }, { id: 'Rate Mgmt', icon: Activity },
        { id: 'Cost Capture', icon: DollarSign }, { id: 'Budgeting', icon: PieChart }
    ];

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 px-2">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                        <PieChart size={28} className="text-rose-700" /> CDO Overhead
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5">
                        Indirect Cost Management • Service Center Pools
                    </p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-md shadow-inner overflow-x-auto custom-scrollbar">
                    {tabs.map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => setActiveTab(t.id)} 
                            className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                                activeTab === t.id ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            <t.icon size={12} />
                            {t.id}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
                {activeTab === 'Overview' && <CDOOverview pools={pools} />}
                {activeTab === 'Rate Mgmt' && <CDORateManager pools={pools} onUpdateRate={(id, r) => setPools(pools.map(p => p.id === id ? {...p, currentRate: r} : p))} />}
                {activeTab === 'Cost Capture' && <CDOCostCapture transactions={transactions} onAddTransaction={tx => setTransactions([tx, ...transactions])} onSelectProject={onSelectProject} />}
                {activeTab === 'Budgeting' && <CDOBudgetManager pools={pools} onUpdateBudget={(id, b) => setPools(pools.map(p => p.id === id ? {...p, fyBudget: b} : p))} />}
            </div>
        </div>
    );
};
export default CDOModuleView;
