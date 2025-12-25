
import React, { useState, useMemo } from 'react';
import { 
    Grid, Search, Box, Database, FileText, Settings, 
    CreditCard, Users, Landmark, Wrench, ShieldCheck, 
    BarChart3, DollarSign, Activity,
    RefreshCw, List, 
    Lock, ShoppingCart, CheckCircle2, 
    Plane, Briefcase, FileSignature, HardHat
} from 'lucide-react';
import { NavigationTab } from '../../types';

// Define module categories for better organization
type Category = 'All' | 'Finance' | 'Budget' | 'Assets' | 'Cost' | 'Orders' | 'Admin' | 'Manpower';

interface CEFMSModule {
    code: string;
    name: string;
    category: Category;
    icon: React.ElementType;
    desc: string;
    targetTab?: NavigationTab;
}

const CEFMS_MODULES: CEFMSModule[] = ([
    { code: 'AX', name: 'Approve Transactions', category: 'Admin', icon: CheckCircle2, desc: 'Digital signature and approval workflow management.', targetTab: NavigationTab.SYSTEM_ADMIN },
    { code: 'CI', name: 'Contract Information', category: 'Orders', icon: FileSignature, desc: 'Contract awards, modifications, and clauses.', targetTab: NavigationTab.ACQUISITION },
    { code: 'CO', name: 'Commitments & Obligations', category: 'Finance', icon: Lock, desc: 'Fund reservation and formal obligation recording.', targetTab: NavigationTab.OBLIGATIONS },
    { code: 'DP', name: 'Disbursements & Payments', category: 'Finance', icon: DollarSign, desc: 'Treasury payments, EFTs, and check issuances.', targetTab: NavigationTab.DISBURSEMENT },
    { code: 'GL', name: 'General Ledger', category: 'Finance', icon: Database, desc: 'USSGL accounts, trial balances, and journal entries.', targetTab: NavigationTab.GENERAL_LEDGER },
    { code: 'HR', name: 'Human Resources', category: 'Manpower', icon: Users, desc: 'Personnel data, grades, and organization assignment.', targetTab: NavigationTab.WWP },
    { code: 'IA', name: 'Inventory & Assets', category: 'Assets', icon: Box, desc: 'Real property, personal property, and supply inventory.', targetTab: NavigationTab.ASSET_LIFECYCLE },
    { code: 'LC', name: 'Labor Costing', category: 'Cost', icon: HardHat, desc: 'Time & attendance and labor distribution to cost objects.', targetTab: NavigationTab.LABOR_COSTING },
    { code: 'MA', name: 'Maintenance', category: 'Assets', icon: Wrench, desc: 'Work orders, preventive maintenance, and repairs.', targetTab: NavigationTab.ASSET_LIFECYCLE },
    { code: 'PR', name: 'Purchase Requests', category: 'Orders', icon: ShoppingCart, desc: 'Requisitions, PR&C (ENG 93), and funds certification.', targetTab: NavigationTab.ACQUISITION },
    { code: 'RE', name: 'Resource Estimates', category: 'Budget', icon: BarChart3, desc: 'Project cost estimating and resource planning.', targetTab: NavigationTab.PPBE_CYCLE },
    { code: 'SA', name: 'System Administration', category: 'Admin', icon: Settings, desc: 'User access, security, and system parameters.', targetTab: NavigationTab.SYSTEM_ADMIN },
    { code: 'TO', name: 'Travel Orders', category: 'Finance', icon: Plane, desc: 'Travel authorizations (DD 1610) and advances.', targetTab: NavigationTab.TRAVEL },
    { code: 'TV', name: 'Travel Vouchers', category: 'Finance', icon: FileText, desc: 'Travel settlement vouchers (DD 1351-2).', targetTab: NavigationTab.TRAVEL },
    { code: 'WI', name: 'Work Items', category: 'Budget', icon: List, desc: 'Project work breakdown structure (WBS) and feature codes.', targetTab: NavigationTab.USACE_PROJECTS },
    { code: 'WM', name: 'Work Management', category: 'Admin', icon: Briefcase, desc: 'Job planning and execution.', targetTab: NavigationTab.USACE_PROJECTS },
    { code: 'RF', name: 'Revolving Fund', category: 'Finance', icon: RefreshCw, desc: 'DWCF management.', targetTab: NavigationTab.REVOLVING_FUNDS },
    { code: 'CD', name: 'Cost Distributables', category: 'Cost', icon: Activity, desc: 'Overhead and indirect cost pools.', targetTab: NavigationTab.CDO_MANAGEMENT }
] as CEFMSModule[]).sort((a, b) => a.code.localeCompare(b.code));

interface Props {
    onNavigate: (tab: NavigationTab) => void;
}

const CEFMSModulesView: React.FC<Props> = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');

    const filteredModules = useMemo(() => {
        return CEFMS_MODULES.filter(module => {
            const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) || module.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const categories: Category[] = ['All', 'Finance', 'Budget', 'Assets', 'Cost', 'Orders', 'Manpower', 'Admin'];

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                        <Grid size={24} className="text-rose-700" /> CEFMS Modules Inventory
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Functional Area Map (Codes 1-15)</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search code (e.g. AX, GL)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-medium w-full sm:w-64 focus:outline-none focus:border-zinc-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all whitespace-nowrap border ${
                            selectedCategory === cat 
                            ? 'bg-rose-700 text-white border-rose-700' 
                            : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 overflow-y-auto custom-scrollbar pb-6">
                {filteredModules.map((module, index) => (
                    <button 
                        key={index}
                        onClick={() => module.targetTab && onNavigate(module.targetTab)}
                        className="bg-white border border-zinc-200 rounded-xl p-4 text-left hover:border-rose-300 hover:shadow-md transition-all group flex flex-col h-32 active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-rose-50 transition-colors">
                                    <module.icon size={18} className="text-zinc-500 group-hover:text-rose-700" />
                                </div>
                                <span className="text-lg font-mono font-bold text-zinc-900 group-hover:text-rose-700">{module.code}</span>
                            </div>
                            <span className="text-[9px] font-bold uppercase text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
                                {module.category}
                            </span>
                        </div>
                        <h3 className="text-xs font-bold text-zinc-800 leading-snug line-clamp-1 mb-1">
                            {module.name}
                        </h3>
                        <p className="text-[10px] text-zinc-500 leading-tight line-clamp-2">{module.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CEFMSModulesView;
