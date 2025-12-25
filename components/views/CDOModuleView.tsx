
import React, { useState } from 'react';
import { PieChart, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { MOCK_CDO_POOLS, MOCK_CDO_TRANSACTIONS } from '../../constants';
import { CDOCostPool, CDOTransaction } from '../../types';
import CDOOverview from '../cdo/CDOOverview';
import CDORateManager from '../cdo/CDORateManager';
import CDOCostCapture from '../cdo/CDOCostCapture';
import CDOBudgetManager from '../cdo/CDOBudgetManager';

interface CDOModuleViewProps {
    onSelectProject: (projectId: string) => void;
}

const CDOModuleView: React.FC<CDOModuleViewProps> = ({ onSelectProject }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Rate Mgmt' | 'Cost Capture' | 'Budgeting'>('Overview');
    
    // --- Centralized State ---
    const [transactions, setTransactions] = useState<CDOTransaction[]>(MOCK_CDO_TRANSACTIONS);
    const [pools, setPools] = useState<CDOCostPool[]>(MOCK_CDO_POOLS);

    // --- Actions ---

    // 1. Capture Cost: Adds transaction AND updates pool obligation
    const handleAddTransaction = (tx: CDOTransaction) => {
        setTransactions(prev => [tx, ...prev]);
        
        // Update the specific pool's obligated amount
        setPools(prevPools => prevPools.map(pool => {
            if (pool.functionName === tx.function) {
                return {
                    ...pool,
                    obligated: pool.obligated + tx.amount
                };
            }
            return pool;
        }));
    };

    // 2. Update Rate
    const handleUpdateRate = (id: string, newRate: number) => {
        setPools(prev => prev.map(p => p.id === id ? { ...p, currentRate: newRate, status: 'Pending Approval' } : p));
    };

    // 3. Update Budget
    const handleUpdateBudget = (id: string, newBudget: number) => {
        setPools(prev => prev.map(p => p.id === id ? { ...p, fyBudget: newBudget } : p));
    };

    const TABS = [
        { id: 'Overview', icon: BarChart3, label: 'Overview' },
        { id: 'Rate Mgmt', icon: Activity, label: 'Rate Mgmt' },
        { id: 'Cost Capture', icon: DollarSign, label: 'Cost Capture' },
        { id: 'Budgeting', icon: PieChart, label: 'Budgeting' },
    ];

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <PieChart size={24} className="text-rose-700" /> Consolidated Departmental Overhead
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Indirect Cost Management & Rate Distribution (USACE)</p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto custom-scrollbar">
                    {TABS.map((tab) => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id as any)} 
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            <tab.icon size={12} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                {activeTab === 'Overview' && <CDOOverview pools={pools} />}
                {activeTab === 'Rate Mgmt' && <CDORateManager pools={pools} onUpdateRate={handleUpdateRate} />}
                {activeTab === 'Cost Capture' && <CDOCostCapture transactions={transactions} onAddTransaction={handleAddTransaction} onSelectProject={onSelectProject} />}
                {activeTab === 'Budgeting' && <CDOBudgetManager pools={pools} onUpdateBudget={handleUpdateBudget} />}
            </div>
        </div>
    );
};

export default CDOModuleView;
