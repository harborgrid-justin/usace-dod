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
            case 'Dashboard':
                return <GLDashboard />;
            case 'COA':
                return <ChartOfAccountsManager />;
            case 'Journals':
                return <JournalEntry onSelectProject={onSelectProject} />;
            case 'Period Close':
                return <PeriodCloseManager />;
            case 'Reporting':
                return <GLReporting />;
            default:
                return <GLDashboard />;
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
        <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <BookUser size={24} className="text-rose-700" /> General Ledger
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Authoritative Financial Record (USSGL)</p>
                </div>
                
                <div className="flex bg-zinc-100 p-1 rounded-lg shadow-inner">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as GLTab)}
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
            
            <div className={`flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {renderContent()}
            </div>
        </div>
    );
};

export default GeneralLedgerView;