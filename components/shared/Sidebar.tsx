import React, { useMemo, useTransition } from 'react';
import { 
  ShieldCheck, LayoutDashboard, BrainCircuit, Clock, ArrowRightLeft, Target, ShieldAlert,
  Landmark, ClipboardCheck, GitMerge, Server, Library, Wallet, RefreshCw, Scale, Globe, FileText, Gavel, RefreshCcw, Cpu,
  Construction, Castle, Grid, PieChart, Box, BookUser, TrendingDown, Users, Briefcase, Plane, UserCheck, HardHat, Shuffle, FileSignature, Building, Building2, Home, Key, MapPin, TreePine,
  X, Hammer, Map as MapIcon
} from 'lucide-react';
import { NavigationTab, AgencyContext } from '../../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  agency: AgencyContext;
  setAgency: (agency: AgencyContext) => void;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  agency, 
  setAgency, 
  isSidebarOpen, 
  isMobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const [isPending, startTransition] = useTransition();
  
  const navGroups = useMemo(() => {
    if (agency === 'USACE_REMIS') {
        return [
            {
                title: "REAL ESTATE DIVISION",
                items: [
                    { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'Portfolio Summary' },
                    { tab: NavigationTab.REAL_PROPERTY_ASSETS, icon: Building2, label: 'Inventory (RPUID)' },
                    { tab: NavigationTab.APPRAISALS, icon: Scale, label: 'Appraisal Workspace' },
                    { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Utilization Analytics' },
                    { tab: NavigationTab.GIS_MAP, icon: MapIcon, label: 'GIS Map' },
                ]
            },
            {
                title: "TRANSACTIONS",
                items: [
                    { tab: NavigationTab.OUTGRANTS_LEASES, icon: FileSignature, label: 'Outgrants & Revenue' },
                    { tab: NavigationTab.SOLICITATIONS, icon: Hammer, label: 'Solicitations' },
                    { tab: NavigationTab.RELOCATION, icon: Users, label: 'Relocation' },
                    { tab: NavigationTab.COST_SHARE, icon: PieChart, label: 'Cost Share Programs' },
                    { tab: NavigationTab.DISPOSALS, icon: Shuffle, label: 'Disposal Actions' },
                    { tab: NavigationTab.ACQUISITION, icon: Briefcase, label: 'Land Acquisition' },
                    { tab: NavigationTab.ENCROACHMENT, icon: ShieldAlert, label: 'Encroachment' },
                ]
            },
            {
                title: "ADMINISTRATION",
                items: [
                    { tab: NavigationTab.REMIS_ADMIN, icon: UserCheck, label: 'User Management' },
                    { tab: NavigationTab.COMPLIANCE, icon: ShieldCheck, label: 'Audit Readiness (CFI)' },
                    { tab: NavigationTab.REPORTS, icon: FileText, label: 'Enterprise Reports' },
                ]
            }
        ];
    }

    if (agency === 'USACE_CEFMS') {
        return [
            {
                title: "STRATEGIC",
                items: [
                    { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'HQ Executive View' },
                    { tab: NavigationTab.ERP_CORE, icon: Grid, label: 'CEFMS Modules' },
                    { tab: NavigationTab.USACE_PROJECTS, icon: Construction, label: 'P2 Project Lifecycle' },
                    { tab: NavigationTab.WWP, icon: Users, label: 'Scenario Planner' },
                    { tab: NavigationTab.LABOR_COSTING, icon: HardHat, label: 'Labor Costing' },
                ]
            },
            {
                title: "FINANCIAL OPS",
                items: [
                    { tab: NavigationTab.GENERAL_LEDGER, icon: BookUser, label: 'General Ledger' },
                    { tab: NavigationTab.EXPENSE_DISBURSE, icon: TrendingDown, label: 'Expense & Disburse' },
                    { tab: NavigationTab.COST_TRANSFERS, icon: Shuffle, label: 'Cost Transfers' },
                    { tab: NavigationTab.TRAVEL, icon: Plane, label: 'Travel Management' },
                    { tab: NavigationTab.ACQUISITION, icon: Briefcase, label: 'Contracting' },
                ]
            },
            {
                title: "CIVIL WORKS",
                items: [
                    { tab: NavigationTab.CIVIL_WORKS_ALLOWANCE, icon: Landmark, label: 'Authority (CWA)' },
                    { tab: NavigationTab.CDO_MANAGEMENT, icon: PieChart, label: 'CDO Management' },
                    { tab: NavigationTab.ASSET_LIFECYCLE, icon: Box, label: 'Asset Lifecycle' },
                    { tab: NavigationTab.REIMBURSABLES, icon: RefreshCcw, label: 'Reimbursables' },
                ]
            }
        ];
    }

    if (agency === 'OSD_HAP') {
      return [
        {
          title: "HOMEOWNERS ASSISTANCE",
          items: [
            { tab: NavigationTab.HAP_CASES, icon: Home, label: 'Case Management' },
            { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Strategic Analytics' },
          ]
        }
      ];
    }

    if (agency === 'OSD_LGH') {
      return [
        {
          title: "GOVERNMENT HOUSING",
          items: [
            { tab: NavigationTab.LGH_PORTFOLIO, icon: Key, label: 'Portfolio Monitor' },
            { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Strategic Analytics' },
          ]
        }
      ];
    }

    if (agency === 'OSD_BRAC') {
        return [
          {
            title: "DECISION SUPPORT",
            items: [
              { tab: NavigationTab.BRAC_DSS, icon: Building, label: 'BRAC Analysis' },
              { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Strategic Analytics' },
            ]
          }
        ];
    }

    return [
      {
        title: "STRATEGIC",
        items: [
          { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'Enterprise Dashboard' },
          { tab: NavigationTab.DIGITAL_THREAD, icon: GitMerge, label: 'Digital Thread' },
          { tab: NavigationTab.PPBE_CYCLE, icon: Clock, label: 'PPBE Cycle' },
          { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Strategic Analytics' },
        ]
      },
      {
        title: "EXECUTION",
        items: [
          { tab: NavigationTab.APPROPRIATIONS, icon: Landmark, label: 'Appropriations' },
          { tab: NavigationTab.ERP_CORE, icon: Server, label: 'ERP Core (GFEBS)' },
          { tab: NavigationTab.DISBURSEMENT, icon: ArrowRightLeft, label: 'Disbursement' },
          { tab: NavigationTab.OBLIGATIONS, icon: FileSignature, label: 'Obligation Management' },
          { tab: NavigationTab.CONTINGENCY_OPS, icon: Globe, label: 'Contingency Ops' },
        ]
      },
      {
        title: "AUDIT & COMPLIANCE",
        items: [
          { tab: NavigationTab.COMPLIANCE, icon: ClipboardCheck, label: 'FIAR Readiness' },
          { tab: NavigationTab.GAAP_AUDIT, icon: Scale, label: 'GAAP Audit' },
          { tab: NavigationTab.FBWT_RECONCILIATION, icon: Wallet, label: 'FBwT Reconciliation' },
          { tab: NavigationTab.RULES_ENGINE, icon: Cpu, label: 'Rules Engine' },
        ]
      }
    ];
  }, [agency]);

  const isOpen = isSidebarOpen || isMobileMenuOpen;

  const handleTabClick = (tab: NavigationTab) => {
    startTransition(() => {
      setActiveTab(tab);
      if (isMobileMenuOpen) setMobileMenuOpen(false);
    });
  };

  const handleAgencyClick = (newAgency: AgencyContext) => {
    startTransition(() => {
      setAgency(newAgency);
      // Automatically switch to appropriate tab for special OSD agencies
      if (newAgency === 'OSD_HAP') setActiveTab(NavigationTab.HAP_CASES);
      if (newAgency === 'OSD_LGH') setActiveTab(NavigationTab.LGH_PORTFOLIO);
      if (newAgency === 'OSD_BRAC') setActiveTab(NavigationTab.BRAC_DSS);
    });
  };

  return (
    <aside className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'} ${isOpen ? 'w-72' : 'w-[72px]'} h-full shrink-0 ${isPending ? 'opacity-80' : 'opacity-100'}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-100 bg-white shrink-0 gap-3">
             <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-1.5 rounded-lg shrink-0 ${agency === 'USACE_REMIS' ? 'bg-emerald-800' : 'bg-rose-900'}`}>
                  <TreePine size={18} className="text-white" />
                </div>
                {isOpen && <span className="font-bold text-sm tracking-tight text-zinc-900 leading-none truncate uppercase">D-AFMP</span>}
            </div>
            {isMobileMenuOpen && (
                <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1 text-zinc-400 hover:text-zinc-800">
                    <X size={20} />
                </button>
            )}
        </div>
        
        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          <div className="px-3 mb-6">
              {isOpen && <h3 className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">Agency Context</h3>}
              <div className="flex flex-col gap-1">
                  {[
                    { id: 'ARMY_GFEBS', label: 'Army (GFEBS)', color: 'bg-emerald-400' },
                    { id: 'USACE_CEFMS', label: 'USACE (CEFMS)', color: 'bg-rose-500' },
                    { id: 'USACE_REMIS', label: 'USACE (REMIS)', color: 'bg-emerald-600' },
                    { id: 'OSD_BRAC', label: 'OSD (BRAC)', color: 'bg-indigo-500' },
                    { id: 'OSD_HAP', label: 'OSD (HAP)', color: 'bg-teal-500' },
                    { id: 'OSD_LGH', label: 'OSD (LGH)', color: 'bg-cyan-500' }
                  ].map(a => (
                    <button 
                        key={a.id}
                        onClick={() => handleAgencyClick(a.id as AgencyContext)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase ${agency === a.id ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${agency === a.id ? a.color : 'bg-zinc-300'}`} />
                        {isOpen && <span className="truncate">{a.label}</span>}
                    </button>
                  ))}
              </div>
          </div>
          
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6 last:mb-0">
              {isOpen ? (
                <h3 className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">
                  {group.title}
                </h3>
              ) : (
                <div className="my-2 border-t border-zinc-100 mx-2" />
              )}
              <div className="space-y-0.5">
                {group.items.map(({ tab, icon: Icon, label }) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                        activeTab === tab 
                        ? 'bg-zinc-900 text-white font-semibold shadow-md border border-zinc-800' 
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <Icon 
                      size={18} 
                      strokeWidth={1.5} 
                      className={activeTab === tab ? 'text-white' : 'group-hover:text-zinc-700'} 
                    />
                    {isOpen && <span className="text-[11px] tracking-wide truncate">{label || tab}</span>}
                    
                    {!isOpen && activeTab === tab && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-zinc-900 rounded-l-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {isOpen && (
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-200 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-[10px]">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-zinc-900 truncate">Doe, Jane</p>
                        <p className="text-[9px] text-zinc-500 truncate">Budget Analyst</p>
                    </div>
                </div>
            </div>
        )}
    </aside>
  );
};

export default Sidebar;