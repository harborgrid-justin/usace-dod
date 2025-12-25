
import React, { useState } from 'react';
import { Users, LayoutDashboard, Brain, BarChart3, Settings, UserCircle2 } from 'lucide-react';
import WWPDashboard from '../wwp/WWPDashboard';
import ScenarioPlanner from '../wwp/ScenarioPlanner';
import WWPReports from '../wwp/WWPReports';
import WWPConfig from '../wwp/WWPConfig';
import PersonnelRoster from '../wwp/PersonnelRoster';

import {
    WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard
} from '../../types';

import {
    MOCK_WWP_SCENARIOS, MOCK_WWP_WORKLOAD_ITEMS, MOCK_WWP_WORKFORCE_PLANS, MOCK_WWP_LABOR_RATES, MOCK_WWP_LABOR_STANDARDS
} from '../../constants';

const WWPView: React.FC<{ onSelectProject: (id: string) => void }> = ({ onSelectProject }) => {
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Planner' | 'HR' | 'Reports' | 'Config'>('Dashboard');

    // Centralized state for reactivity across the module
    const [scenarios, setScenarios] = useState<WorkforceScenario[]>(MOCK_WWP_SCENARIOS);
    const [workloadItems, setWorkloadItems] = useState<WorkloadItem[]>(MOCK_WWP_WORKLOAD_ITEMS);
    const [workforcePlans, setWorkforcePlans] = useState<WorkforcePlan[]>(MOCK_WWP_WORKFORCE_PLANS);
    const [laborRates, setLaborRates] = useState<LaborRate[]>(MOCK_WWP_LABOR_RATES);
    const [laborStandards, setLaborStandards] = useState<LaborStandard[]>(MOCK_WWP_LABOR_STANDARDS);

    const handleUpdateWorkload = (updatedItem: WorkloadItem) => {
        setWorkloadItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    };

    const handleUpdateWorkforce = (updatedPlan: WorkforcePlan) => {
        setWorkforcePlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    };

    const handleUpdateScenario = (updatedScenario: WorkforceScenario) => {
        setScenarios(prev => prev.map(s => s.id === updatedScenario.id ? updatedScenario : s));
    };
    
    const handleCreateScenario = (newScenario: WorkforceScenario) => {
        setScenarios(prev => [...prev, newScenario]);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <WWPDashboard
                    scenarios={scenarios}
                    workloadItems={workloadItems}
                    workforcePlans={workforcePlans}
                    laborRates={laborRates}
                    laborStandards={laborStandards}
                />;
            case 'Planner':
                return <ScenarioPlanner 
                    scenarios={scenarios}
                    allWorkloadItems={workloadItems}
                    allWorkforcePlans={workforcePlans}
                    laborRates={laborRates}
                    laborStandards={laborStandards}
                    onUpdateScenario={handleUpdateScenario}
                    onCreateScenario={handleCreateScenario}
                    onUpdateWorkload={handleUpdateWorkload}
                    onUpdateWorkforce={handleUpdateWorkforce}
                    onSelectProject={onSelectProject}
                />;
            case 'HR':
                return <PersonnelRoster />;
            case 'Reports':
                return <WWPReports />;
            case 'Config':
                return <WWPConfig laborRates={laborRates} laborStandards={laborStandards} />;
            default:
                return null;
        }
    };

    const TABS = [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'Planner', label: 'Scenario Planner', icon: Brain },
        { id: 'HR', label: 'Personnel (HR)', icon: UserCircle2 },
        { id: 'Reports', label: 'Reporting', icon: BarChart3 },
        { id: 'Config', label: 'Configuration', icon: Settings },
    ];

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-full mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Users size={24} className="text-rose-700" /> Workload & Workforce
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Strategic Manpower and Labor Cost Forecasting (WWP/HR)</p>
                </div>

                <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto custom-scrollbar">
                    {TABS.map(tab => (
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

            <div className="flex-1 min-h-0">
                {renderContent()}
            </div>
        </div>
    );
};

export default WWPView;
