
import React, { useState, useTransition, useCallback, useMemo } from 'react';
import { Users, LayoutDashboard, Brain, BarChart3, Settings, UserCircle2 } from 'lucide-react';
import WWPDashboard from '../wwp/WWPDashboard';
import ScenarioPlanner from '../wwp/ScenarioPlanner';
import WWPReports from '../wwp/WWPReports';
import WWPConfig from '../wwp/WWPConfig';
import PersonnelRoster from '../wwp/PersonnelRoster';

import {
    WorkforceScenario, WorkloadItem, WorkforcePlan, LaborRate, LaborStandard
} from '../../types';
import { useWWPData } from '../../hooks/useDomainData';
import { wwpService } from '../../services/WWPDataService';

const WWPView: React.FC<{ onSelectProject: (id: string) => void }> = ({ onSelectProject }) => {
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Planner' | 'HR' | 'Reports' | 'Config'>('Dashboard');
    const [isPending, startTransition] = useTransition();

    // Standardized States from Hook
    const { scenarios, workloadItems, workforcePlans, laborRates, laborStandards } = useWWPData();

    const handleTabChange = useCallback((id: string) => {
        startTransition(() => {
            setActiveTab(id as any);
        });
    }, []);

    const handleUpdateWorkload = useCallback((updatedItem: WorkloadItem) => {
        wwpService.updateWorkloadItem(updatedItem);
    }, []);

    const handleUpdateWorkforce = useCallback((updatedPlan: WorkforcePlan) => {
        wwpService.updateWorkforcePlan(updatedPlan);
    }, []);

    const handleUpdateScenario = useCallback((updatedScenario: WorkforceScenario) => {
        wwpService.updateScenario(updatedScenario);
    }, []);
    
    const handleCreateScenario = useCallback((newScenario: WorkforceScenario) => {
        wwpService.addScenario(newScenario);
    }, []);

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

    const tabs = useMemo(() => [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'Planner', label: 'Scenario Planner', icon: Brain },
        { id: 'HR', label: 'Personnel (HR)', icon: UserCircle2 },
        { id: 'Reports', label: 'Reporting', icon: BarChart3 },
        { id: 'Config', label: 'Configuration', icon: Settings },
    ], []);

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-full mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Users size={24} className="text-rose-700" /> Workload & Workforce
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Strategic Manpower Forecasting</p>
                </div>

                <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto custom-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
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

            <div className={`flex-1 min-h-0 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {renderContent()}
            </div>
        </div>
    );
};

export default WWPView;
