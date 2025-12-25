
import React, { useState } from 'react';
import { Gavel, AlertTriangle, Layers, FileWarning } from 'lucide-react';
import FundControlTree from '../ada/FundControlTree';
import ViolationManager from '../ada/ViolationManager';
import { AgencyContext } from '../../types';

interface FundsControlViewProps {
  agency: AgencyContext;
}

const FundsControlView: React.FC<FundsControlViewProps> = ({ agency }) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'violations'>('hierarchy');

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
                <Gavel size={24} className="text-zinc-400" /> Administrative Control of Funds
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1">DoD FMR Vol 14 Compliance • 31 U.S.C. § 1517 Enforcement</p>
        </div>
        <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
            <div className="flex bg-zinc-100 p-1 rounded-lg min-w-max">
                <button 
                    onClick={() => setActiveTab('hierarchy')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'hierarchy' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                    <Layers size={14} /> Fund Hierarchy
                </button>
                <button 
                    onClick={() => setActiveTab('violations')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'violations' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                    <FileWarning size={14} /> ADA Violations
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
        {activeTab === 'hierarchy' ? <FundControlTree /> : <ViolationManager />}
      </div>
    </div>
  );
};

export default FundsControlView;
