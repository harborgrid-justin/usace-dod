
import React from 'react';
import { DollarSign, Share2, List, Ruler, Hammer, Landmark, FileText } from 'lucide-react';

export const PROJECT_TABS = [
    { id: 'Financials', icon: DollarSign, label: 'Financials' },
    { id: 'Trace', icon: Share2, label: 'Deep Trace (20)' },
    { id: 'WI', icon: List, label: 'Work Items (WBS)' },
    { id: 'PM', icon: Ruler, label: 'Proj Mgmt' },
    { id: 'Contracting', icon: Hammer, label: 'Contracting' },
    { id: 'Real Estate', icon: Landmark, label: 'Real Estate' },
    { id: 'Reports', icon: FileText, label: 'Reports (ENG 93)' }
];

interface Props {
    activeTab: string;
    onTabChange: (id: any) => void;
    collapsed?: boolean;
}

export const ProjectTabList: React.FC<Props> = ({ activeTab, onTabChange, collapsed }) => (
    <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        {PROJECT_TABS.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase transition-all ${
                    activeTab === tab.id 
                    ? 'bg-rose-50 text-rose-700 border-r-2 border-rose-700' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 border-r-2 border-transparent'
                }`}
            >
                <tab.icon size={16} />
                {!collapsed && <span className="hidden md:inline">{tab.label}</span>}
            </button>
        ))}
    </div>
);
