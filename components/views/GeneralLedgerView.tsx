
import React, { useState, useTransition, useMemo, useCallback } from 'react';
import { BookUser, LayoutDashboard, ListTree, PenSquare, CalendarClock, BarChartHorizontal } from 'lucide-react';
import GLDashboard from '../gl/GLDashboard';
import ChartOfAccountsManager from '../gl/ChartOfAccountsManager';
import JournalEntry from '../gl/JournalEntry';
import PeriodCloseManager from '../gl/PeriodCloseManager';
import GLReporting from '../gl/GLReporting';

type GLTab = 'Dashboard' | 'COA' | 'Journals' | 'Period Close' | 'Reporting';

interface GeneralLedgerViewProps {
    onSelectProject: (projectId: string) => void;
}

const GeneralLedgerView: React.FC<GeneralLedgerViewProps> = ({ onSelectProject }) => {
    const [activeTab, setActiveTab] = useState<GLTab>('Dashboard');
    const [isPending, startTransition] = useTransition();

    const handleTabChange = useCallback((id: GLTab) => {
        startTransition(() => {
            setActiveTab(id);
        });
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return <GLDashboard />;
            case 'COA': return <ChartOfAccountsManager />;
            case 'Journals': return <JournalEntry onSelectProject={onSelectProject} />;
            case 'Period Close': return <PeriodCloseManager />;
            case 'Reporting': return <GLReporting />;
            default: return <GLDashboard />;
        }
    };
    
    const tabs = useMemo(() => [
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'COA', label: 'Chart of Accounts', icon: ListTree },
        { id: 'Journals', label: 'Journal Entries', icon: PenSquare },
        { id: 'Period Close', label: 'Period Close', icon: CalendarClock },
        { id: 'Reporting', label: 'Reporting', icon: BarChartHorizontal }
    ], []);

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0 px-2">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <BookUser size={28} className="text-zinc-800" /> General Ledger
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                        Authoritative Financial Record (USSGL) • Real-Time Sync
                    </p>
                </div>
                
                <div className="flex bg-zinc-100 p-1 rounded-md shadow-inner overflow-x-auto custom-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as GLTab)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                        >
                            <tab.icon size={12} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className={`flex-1 min-h-0 flex flex-col overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {renderContent()}
            </div>
        </div>
    );
};

export default GeneralLedgerView;
