
import React from 'react';
import { AgencyContext, NavigationTab } from '../../types';

interface Props {
  agency: AgencyContext;
  setAgency: (a: AgencyContext) => void;
  isOpen: boolean;
  setActiveTab: (t: NavigationTab) => void;
}

const SidebarAgencyStrip: React.FC<Props> = ({ agency, setAgency, isOpen, setActiveTab }) => {
  const AGENCIES = [
    { id: 'ARMY_GFEBS', label: 'Army (GFEBS)', color: 'bg-emerald-400' },
    { id: 'USACE_CEFMS', label: 'USACE (CEFMS)', color: 'bg-rose-50' },
    { id: 'USACE_REMIS', label: 'USACE (REMIS)', color: 'bg-emerald-600' },
    { id: 'OSD_BRAC', label: 'OSD (BRAC)', color: 'bg-indigo-500' },
    { id: 'OSD_HAP', label: 'OSD (HAP)', color: 'bg-teal-500' },
    { id: 'OSD_LGH', label: 'OSD (LGH)', color: 'bg-cyan-500' }
  ];

  const handleAgencyClick = (id: string) => {
    setAgency(id as AgencyContext);
    // Auto-navigate to primary tab for specialized agencies
    if (id === 'OSD_HAP') setActiveTab(NavigationTab.HAP_CASES);
    else if (id === 'OSD_LGH') setActiveTab(NavigationTab.LGH_PORTFOLIO);
    else if (id === 'OSD_BRAC') setActiveTab(NavigationTab.BRAC_DSS);
    else setActiveTab(NavigationTab.DASHBOARD);
  };

  return (
    <div className="px-3 mb-6">
      {isOpen && <h3 className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">Agency Context</h3>}
      <div className="flex flex-col gap-1">
        {AGENCIES.map(a => (
          <button 
            key={a.id}
            onClick={() => handleAgencyClick(a.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase ${agency === a.id ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            <div className={`w-2 h-2 rounded-full ${agency === a.id ? a.color : 'bg-zinc-300'}`} />
            {isOpen && <span className="truncate">{a.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SidebarAgencyStrip;
