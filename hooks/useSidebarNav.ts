
import { useMemo } from 'react';
import { 
  LayoutDashboard, BrainCircuit, Clock, GitMerge, Landmark, 
  Server, ArrowRightLeft, FileSignature, Globe, ClipboardCheck, 
  Scale, Wallet, Cpu, Building2, Map as MapIcon, 
  FileSignature as FileSig, Hammer, Users, PieChart, Briefcase, 
  ShieldAlert, UserCheck, FileText, Grid, Construction, HardHat, 
  BookUser, TrendingDown, Shuffle, Plane, Box, RefreshCcw, Home, Key, MapPin, ListPlus
} from 'lucide-react';
import { NavigationTab, AgencyContext } from '../types';

export const useSidebarNav = (agency: AgencyContext) => {
  return useMemo(() => {
    // REMIS Functional Stack
    if (agency === 'USACE_REMIS') {
      return [
        {
          title: "REAL ESTATE OPS",
          items: [
            { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'Portfolio Summary' },
            { tab: NavigationTab.REAL_PROPERTY_ASSETS, icon: Building2, label: 'Inventory (RPUID)' },
            { tab: NavigationTab.REMIS_REQUIREMENTS, icon: ListPlus, label: 'Requirements' },
            { tab: NavigationTab.APPRAISALS, icon: Scale, label: 'Appraisal Center' },
            { tab: NavigationTab.OUTGRANTS_LEASES, icon: FileSig, label: 'Outgrants & Leases' },
          ]
        },
        {
          title: "COMPLIANCE & SPATIAL",
          items: [
            { tab: NavigationTab.GIS_MAP, icon: MapIcon, label: 'Spatial Intel' },
            { tab: NavigationTab.ENCROACHMENT, icon: ShieldAlert, label: 'Encroachment' },
            { tab: NavigationTab.RELOCATION, icon: Users, label: 'Relocation' },
            { tab: NavigationTab.COST_SHARE, icon: PieChart, label: 'Cost Share' },
          ]
        },
        {
          title: "MANAGEMENT",
          items: [
            { tab: NavigationTab.DISPOSALS, icon: Shuffle, label: 'Disposals' },
            { tab: NavigationTab.SOLICITATIONS, icon: Hammer, label: 'Market Logic' },
            { tab: NavigationTab.REPORTS, icon: FileText, label: 'Reports' },
          ]
        }
      ];
    }

    // CEFMS Functional Stack
    if (agency === 'USACE_CEFMS') {
      return [
        {
          title: "PROJECT LIFECYCLE",
          items: [
            { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'HQ Dashboard' },
            { tab: NavigationTab.USACE_PROJECTS, icon: Construction, label: 'P2 Management' },
            { tab: NavigationTab.CIVIL_WORKS_ALLOWANCE, icon: FileText, label: 'CWA Allowance' },
          ]
        },
        {
          title: "FINANCIAL CONTROL",
          items: [
            { tab: NavigationTab.GENERAL_LEDGER, icon: BookUser, label: 'General Ledger' },
            { tab: NavigationTab.OBLIGATIONS, icon: FileSignature, label: 'Obligations' },
            { tab: NavigationTab.EXPENSE_DISBURSE, icon: TrendingDown, label: 'Expense & Disburse' },
            { tab: NavigationTab.LABOR_COSTING, icon: HardHat, label: 'Labor Costing' },
          ]
        },
        {
          title: "RESOURCES",
          items: [
            { tab: NavigationTab.WWP, icon: Users, label: 'Scenario Planner' },
            { tab: NavigationTab.CDO_MANAGEMENT, icon: PieChart, label: 'CDO Overhead' },
            { tab: NavigationTab.REVOLVING_FUNDS, icon: RefreshCcw, label: 'Revolving Funds' },
            { tab: NavigationTab.ASSET_LIFECYCLE, icon: Box, label: 'Asset Lifecycle' },
          ]
        }
      ];
    }

    // OSD Enterprise Apps
    if (agency.startsWith('OSD_')) {
      return [
        {
          title: "OSD ENTERPRISE",
          items: [
            { tab: NavigationTab.BRAC_DSS, icon: Landmark, label: 'BRAC Support' },
            { tab: NavigationTab.HAP_CASES, icon: Home, label: 'HAP Case Mgmt' },
            { tab: NavigationTab.LGH_PORTFOLIO, icon: Key, label: 'LGH Portfolio' },
          ]
        }
      ];
    }

    // Default GFEBS Stack
    return [
      {
        title: "FISCAL COMMAND",
        items: [
          { tab: NavigationTab.DASHBOARD, icon: LayoutDashboard, label: 'Executive HUD' },
          { tab: NavigationTab.ANALYTICS, icon: BrainCircuit, label: 'Sentinel AI' },
          { tab: NavigationTab.PPBE_CYCLE, icon: Clock, label: 'PPBE Lifecycle' },
        ]
      },
      {
        title: "CORE LEDGER",
        items: [
          { tab: NavigationTab.APPROPRIATIONS, icon: Landmark, label: 'Appropriations' },
          { tab: NavigationTab.ERP_CORE, icon: Server, label: 'ERP S/4 HANA' },
          { tab: NavigationTab.DISBURSEMENT, icon: ArrowRightLeft, label: 'Disbursement' },
          { tab: NavigationTab.DIGITAL_THREAD, icon: GitMerge, label: 'Fiduciary Trace' },
        ]
      },
      {
        title: "GOVERNANCE",
        items: [
          { tab: NavigationTab.GAAP_AUDIT, icon: ClipboardCheck, label: 'GAAP Audit' },
          { tab: NavigationTab.FBWT_RECONCILIATION, icon: Scale, label: 'FBWT Reconciliation' },
          { tab: NavigationTab.RULES_ENGINE, icon: Cpu, label: 'Logic Engine' },
        ]
      }
    ];
  }, [agency]);
};
