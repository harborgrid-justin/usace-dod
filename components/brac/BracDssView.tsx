
import React, { useState, useMemo } from 'react';
import { Gavel } from 'lucide-react';
import BracAnalysisTab from './modules/BracAnalysisTab';
import BracComparisonTab from './modules/BracComparisonTab';
import BracTimelineTab from './modules/BracTimelineTab';
import BracReportTab from './modules/BracReportTab';
import { remisService } from '../../services/RemisDataService';
import { useService } from '../../hooks/useService';

const BracDssView: React.FC = () => {
    const installations = useService(remisService, () => remisService.getBracInstallations());
    const scenarios = useService(remisService, () => remisService.getBracScenarios());
    const [activeTab, setActiveTab] = useState('Analysis');
    const [scenarioId, setScenarioId] = useState(scenarios[0].id);

    const scenario = useMemo(() => scenarios.find(s => s.id === scenarioId)!, [scenarios, scenarioId]);
    const losing = installations.find(i => i.id === scenario.losingInstallationId)!;
    const gaining = installations.find(i => i.id === scenario.gainingInstallationId);

    return (
        <div className="p-8 space-y-6 animate-in h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-end shrink-0">
                <div><h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3"><Gavel size={24} className="text-indigo-700" /> BRAC Decision Support</h2><p className="text-xs text-zinc-500">10 U.S.C. § 2687 Analysis Engine</p></div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    {['Analysis', 'Comparison', 'Timeline', 'Report'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === t ? 'bg-white shadow-sm text-indigo-700' : 'text-zinc-500'}`}>{t}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'Analysis' && <BracAnalysisTab scenario={scenario} losing={losing} gaining={gaining} installations={installations} />}
                {activeTab === 'Comparison' && <BracComparisonTab installations={installations} />}
                {activeTab === 'Timeline' && <BracTimelineTab />}
                {activeTab === 'Report' && <BracReportTab />}
            </div>
        </div>
    );
};
export default BracDssView;
