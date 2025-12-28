
import React, { useState } from 'react';
import { Cpu, GitBranch, Play } from 'lucide-react';
import RuleLibrarySidebar from '../rules/RuleLibrarySidebar';
import DecisionExpertArea from '../rules/DecisionExpertArea';
import PolicySimulatorArea from '../rules/PolicySimulatorArea';

const RulesEngineView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'decision' | 'simulator'>('decision');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto">
            <div className="flex justify-between items-end shrink-0">
                <div><h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3"><Cpu size={24} className="text-zinc-400" /> Policy Logic Engine</h2><p className="text-xs text-zinc-500">Automated Decision Support</p></div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('decision')} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === 'decision' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}><GitBranch size={14} className="inline mr-2"/> Decision Expert</button>
                    <button onClick={() => setActiveTab('simulator')} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === 'simulator' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}><Play size={14} className="inline mr-2"/> Simulator</button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
                <div className="lg:col-span-4 h-full overflow-hidden"><RuleLibrarySidebar searchTerm={searchTerm} onSearch={setSearchTerm} /></div>
                <div className="lg:col-span-8 h-full overflow-hidden">
                    {activeTab === 'decision' ? <DecisionExpertArea /> : <PolicySimulatorArea />}
                </div>
            </div>
        </div>
    );
};
export default RulesEngineView;
