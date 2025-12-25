
import React, { useMemo } from 'react';
import { 
  ShieldCheck, LayoutDashboard, BrainCircuit, Clock, ArrowRightLeft, Target, ShieldAlert,
  Landmark, ClipboardCheck, GitMerge, Server, Library, Wallet, RefreshCw, Scale, Globe, FileText, Gavel, RefreshCcw, Cpu,
  Construction, Castle, Grid, PieChart, Box, BookUser, TrendingDown, Users, Briefcase, Plane, UserCheck, HardHat, Shuffle, FileSignature, Building, Building2, Home, Key, MapPin
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

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, agency, setAgency, isSidebarOpen, isMobileMenuOpen, setMobileMenuOpen }) => {
  
  // Dynamic Navigation Groups based on Agency
  const navGroups = useMemo(() => {
    if (agency === 'OSD_BRAC') {
        return [
            {
                title: "OSD PROGRAM OFFICE",
                items: [
                    { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'BRAC Dashboard' },
                    { tab: NavigationTab.BRAC_DSS, icon: MapPin, label: 'Decision Support (DSS)' },
                    { tab: NavigationTab.PPBE_CYCLE, icon: Target, label: 'Program Cycle (PPBE)' },
                    { tab: NavigationTab.APPROPRIATIONS, icon: Landmark, label: 'Appropriation Status' },
                    { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Closure Analytics' },
                ]
            },
            {
                title: "REAL PROPERTY",
                items: [
                    { tab: NavigationTab.ASSET_LIFECYCLE, icon: Building2, label: 'Asset Disposal (Real Prop)' },
                    { tab: NavigationTab.REIMBURSABLES, icon: RefreshCcw, label: 'Economic Adjustment' },
                ]
            },
            {
                title: "FINANCIAL CONTROLS",
                items: [
                    { tab: NavigationTab.ADMIN_CONTROL, icon: Gavel, label: 'Funds Control (1517)' },
                    { tab: NavigationTab.OBLIGATIONS, icon: FileSignature, label: 'Obligations' },
                    { tab: NavigationTab.DISBURSEMENT, icon: ArrowRightLeft, label: 'Treasury Outlays' },
                    { tab: NavigationTab.COMPLIANCE, icon: ShieldAlert, label: 'Audit Readiness' },
                ]
            }
        ];
    }

    if (agency === 'OSD_HAP') {
        return [
            {
                title: "Homeowners Assistance",
                items: [
                    { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'Program Dashboard' },
                    { tab: NavigationTab.HAP_CASES, icon: Users, label: 'Applicant Cases' },
                    { tab: NavigationTab.ASSET_LIFECYCLE, icon: Home, label: 'Property Inventory' },
                    { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Market Analytics' },
                ]
            },
            {
                title: "Financials",
                items: [
                    { tab: NavigationTab.APPROPRIATIONS, icon: Landmark, label: 'Fund Status (0517)' },
                    { tab: NavigationTab.OBLIGATIONS, icon: FileSignature, label: 'Benefit Obligations' },
                    { tab: NavigationTab.DISBURSEMENT, icon: ArrowRightLeft, label: 'Payments' },
                    { tab: NavigationTab.ADMIN_CONTROL, icon: Gavel, label: 'Funds Control' },
                ]
            }
        ];
    }

    if (agency === 'OSD_LGH') {
        return [
            {
                title: "Leased Housing",
                items: [
                    { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'Portfolio Dashboard' },
                    { tab: NavigationTab.LGH_PORTFOLIO, icon: Building, label: 'Lease Portfolio' },
                    { tab: NavigationTab.ASSET_LIFECYCLE, icon: Key, label: 'Property Mgmt' },
                ]
            },
            {
                title: "Financials",
                items: [
                    { tab: NavigationTab.APPROPRIATIONS, icon: Landmark, label: 'Appropriations' },
                    { tab: NavigationTab.OBLIGATIONS, icon: FileSignature, label: 'Lease Obligations' },
                    { tab: NavigationTab.DISBURSEMENT, icon: ArrowRightLeft, label: 'Rent Payments' },
                    { tab: NavigationTab.COMPLIANCE, icon: ShieldAlert, label: 'Audit Readiness' },
                ]
            }
        ];
    }

    if (agency === 'USACE_CEFMS') {
        return [
            {
              title: "Engineer Command",
              items: [
                { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
                { tab: NavigationTab.USACE_PROJECTS, icon: Construction, label: 'Projects & Work Items (WI)' },
                { tab: NavigationTab.SYSTEM_ADMIN, icon: UserCheck, label: 'Admin & Approval (SA/AX)' },
                { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Intelligence' },
              ]
            },
            {
              title: "PROGRAM EXECUTION",
              items: [
                { tab: NavigationTab.WWP, icon: Users, label: 'Workforce & HR (WWP/HR)'},
                { tab: NavigationTab.LABOR_COSTING, icon: HardHat, label: 'Labor Costing (LC)'},
                { tab: NavigationTab.PPBE_CYCLE, icon: Target, label: 'Resource Estimates (RE)' },
                { tab: NavigationTab.ACQUISITION, icon: Briefcase, label: 'Acquisition (PR/CI)' },
                { tab: NavigationTab.REVOLVING_FUNDS, icon: RefreshCw, label: 'Revolving Fund (RF)' },
                { tab: NavigationTab.APPROPRIATIONS, icon: Landmark, label: 'Fund Distribution' },
                { tab: NavigationTab.REIMBURSABLES, icon: RefreshCcw, label: 'Reimbursables' },
              ]
            },
            {
              title: "FINANCIAL OPERATIONS",
              items: [
                { tab: NavigationTab.GENERAL_LEDGER, icon: BookUser, label: 'General Ledger (GL)'},
                { tab: NavigationTab.EXPENSE_DISBURSE, icon: TrendingDown, label: 'Disburse & Pay (DP)'},
                { tab: NavigationTab.OBLIGATIONS, icon: FileSignature, label: 'Obligations (CO)'},
                { tab: NavigationTab.COST_TRANSFERS, icon: Shuffle, label: 'Cost Transfers'},
                { tab: NavigationTab.TRAVEL, icon: Plane, label: 'Travel (TO/TV)' },
                { tab: NavigationTab.CIVIL_WORKS_ALLOWANCE, icon: FileText, label: 'Civil Works Allowance' },
                { tab: NavigationTab.CDO_MANAGEMENT, icon: PieChart, label: 'Dept Overhead (CD)' },
                { tab: NavigationTab.ASSET_LIFECYCLE, icon: Box, label: 'Inv & Assets (IA/MA)' },
                { tab: NavigationTab.ERP_CORE, icon: Grid, label: 'Module Inventory' },
                { tab: NavigationTab.DISBURSEMENT, icon: ArrowRightLeft, label: 'Treasury Interface' },
                { tab: NavigationTab.FBWT_RECONCILIATION, icon: Scale, label: 'Treasury Recon' },
                { tab: NavigationTab.CONTINGENCY_OPS, icon: Globe, label: 'Emergency Ops' },
              ]
            },
            {
              title: "CONTROL & AUDIT",
              items: [
                { tab: NavigationTab.ADMIN_CONTROL, icon: Gavel, label: 'Funds Control (ADA)' },
                { tab: NavigationTab.COMPLIANCE, icon: ShieldAlert, label: 'Audit Readiness' },
                { tab: NavigationTab.GOVERNANCE, icon: Library, label: 'FMR Library' },
              ]
            }
        ];
    }
    // Default GFEBS
    return [
        {
          title: "Command Center",
          items: [
            { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard },
            { tab: NavigationTab.ANALYTICS, icon: BrainCircuit },
            { tab: NavigationTab.DIGITAL_THREAD, icon: GitMerge },
            { tab: NavigationTab.RULES_ENGINE, icon: Cpu },
          ]
        },
        {
          title: "Strategy & Budget",
          items: [
            { tab: NavigationTab.PPBE_CYCLE, icon: Target },
            { tab: NavigationTab.O_AND_M_APPROPRIATIONS, icon: FileText },
            { tab: NavigationTab.APPROPRIATIONS, icon: Clock },
            { tab: NavigationTab.GOVERNANCE, icon: Landmark },
          ]
        },
        {
          title: "Financial Operations",
          items: [
            { tab: NavigationTab.ERP_CORE, icon: Server },
            { tab: NavigationTab.REIMBURSABLES, icon: RefreshCcw },
            { tab: NavigationTab.REVOLVING_FUNDS, icon: RefreshCw },
            { tab: NavigationTab.OBLIGATIONS, icon: FileSignature },
            { tab: NavigationTab.DISBURSEMENT, icon: ArrowRightLeft },
            { tab: NavigationTab.FBWT_RECONCILIATION, icon: Scale },
            { tab: NavigationTab.CONTINGENCY_OPS, icon: Globe },
          ]
        },
        {
          title: "Control & Audit",
          items: [
            { tab: NavigationTab.ADMIN_CONTROL, icon: Gavel },
            { tab: NavigationTab.DEPOSIT_LIABILITIES, icon: Library },
            { tab: NavigationTab.CASH_OUTSIDE_TREASURY, icon: Wallet },
            { tab: NavigationTab.COMPLIANCE, icon: ShieldAlert },
            { tab: NavigationTab.GAAP_AUDIT, icon: ClipboardCheck },
          ]
        }
      ];
  }, [agency]);

  const getHeaderIcon = () => {
      if (agency === 'USACE_CEFMS') return <Castle size={18} className="text-white" />;
      if (agency === 'OSD_BRAC') return <Building2 size={18} className="text-white" />;
      if (agency === 'OSD_HAP') return <Home size={18} className="text-white" />;
      if (agency === 'USACE_HAPMIS') return <Home size={18} className="text-white" />;
      if (agency === 'OSD_LGH') return <Key size={18} className="text-white" />;
      return <ShieldCheck size={18} className="text-white" />;
  };

  const getHeaderColor = () => {
      if (agency === 'USACE_CEFMS') return 'bg-rose-700';
      if (agency === 'OSD_BRAC') return 'bg-indigo-700';
      if (agency === 'OSD_HAP') return 'bg-teal-700';
      if (agency === 'USACE_HAPMIS') return 'bg-orange-700';
      if (agency === 'OSD_LGH') return 'bg-cyan-700';
      return 'bg-zinc-900';
  };

  const getSentinelName = () => {
      if (agency === 'USACE_CEFMS') return 'USACE Sentinel';
      if (agency === 'OSD_BRAC') return 'BRAC Sentinel';
      if (agency === 'OSD_HAP') return 'HAP Sentinel';
      if (agency === 'USACE_HAPMIS') return 'HAPMIS Sentinel';
      if (agency === 'OSD_LGH') return 'Housing Sentinel';
      return 'G-8 Sentinel';
  };

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 bg-white shrink-0 gap-3">
        <div className={`p-1.5 rounded-lg ${getHeaderColor()}`}>
          {getHeaderIcon()}
        </div>
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-zinc-900 leading-none">D-AFMP</span>
            <span className="text-[9px] font-medium text-zinc-400 tracking-wider uppercase mt-0.5">
                {getSentinelName()}
            </span>
          </div>
        )}
      </div>
      
      {/* Agency Switcher */}
      {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="px-4 py-4">
              <div className="p-1 bg-zinc-100 rounded-lg flex flex-col gap-1">
                  <button 
                    onClick={() => { setAgency('ARMY_GFEBS'); setActiveTab(NavigationTab.DASHBOARD); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${agency === 'ARMY_GFEBS' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                      <ShieldCheck size={12}/> Dept of Army (GFEBS)
                  </button>
                  <button 
                    onClick={() => { setAgency('USACE_CEFMS'); setActiveTab(NavigationTab.DASHBOARD); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${agency === 'USACE_CEFMS' ? 'bg-white shadow-sm text-rose-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                      <Castle size={12}/> USACE (CEFMS)
                  </button>
                  <button 
                    onClick={() => { setAgency('OSD_BRAC'); setActiveTab(NavigationTab.DASHBOARD); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${agency === 'OSD_BRAC' ? 'bg-white shadow-sm text-indigo-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                      <Building2 size={12}/> OSD (BRAC)
                  </button>
                  <button 
                    onClick={() => { setAgency('OSD_HAP'); setActiveTab(NavigationTab.DASHBOARD); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${agency === 'OSD_HAP' ? 'bg-white shadow-sm text-teal-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                      <Home size={12}/> OSD (HAP)
                  </button>
                  <button 
                    onClick={() => { setAgency('OSD_LGH'); setActiveTab(NavigationTab.DASHBOARD); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${agency === 'OSD_LGH' ? 'bg-white shadow-sm text-cyan-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                      <Key size={12}/> OSD (LGH)
                  </button>
              </div>
          </div>
      )}

      <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, groupIndex) => (
          <div key={group.title} className="mb-6 last:mb-0">
            {(isSidebarOpen || isMobileMenuOpen) ? (
              <h3 className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{group.title}</h3>
            ) : (
              <div className="my-2 border-t border-zinc-100 mx-2" />
            )}
            <div className="space-y-0.5">
              {group.items.map(({ tab, icon: Icon, label }) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); if (isMobileMenuOpen) setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    activeTab === tab 
                      ? (agency === 'USACE_CEFMS' ? 'bg-rose-50 text-rose-900 font-semibold shadow-sm border border-rose-100' : 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm border border-zinc-200/50')
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                  title={!isSidebarOpen ? (label || tab) : undefined}
                >
                  <Icon size={16} strokeWidth={1.5} className={`shrink-0 ${activeTab === tab ? (agency === 'USACE_CEFMS' ? 'text-rose-700' : 'text-zinc-900') : 'group-hover:text-zinc-700'}`} />
                  {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[11px] tracking-wide truncate">{label || tab}</span>}
                  
                  {/* Active Indicator */}
                  {!isSidebarOpen && !isMobileMenuOpen && activeTab === tab && (
                    <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${agency === 'USACE_CEFMS' ? 'bg-rose-600' : 'bg-zinc-900'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/30">
         {(isSidebarOpen || isMobileMenuOpen) ? (
            <div className="text-[9px] text-zinc-400 text-center font-mono">
               SEC: UNCLASSIFIED//FOUO
            </div>
         ) : (
            <div className="flex justify-center">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
            </div>
         )}
      </div>
    </>
  );

  return (
    <>
      <aside className={`hidden md:flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white border-r border-zinc-100 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'bg-zinc-900/20 backdrop-blur-sm' : 'pointer-events-none opacity-0'}`} onClick={() => setMobileMenuOpen(false)}>
        <div className={`absolute top-0 left-0 h-full w-64 bg-white border-r border-zinc-100 shadow-2xl transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
