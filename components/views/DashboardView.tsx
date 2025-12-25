
import React from 'react';
import { ShieldCheck, Banknote, TrendingUp, GitMerge, Cpu, ArrowUpRight, Construction, Anchor, PieChart, Home, Leaf, Gavel, Users, Clock, Building, Key, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { NavigationTab, AgencyContext } from '../../types';
import { MOCK_EXECUTION_DATA } from '../../constants';

interface DashboardViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  agency: AgencyContext;
}

const StatCard: React.FC<{label: string, value: string, icon: React.ElementType, subText?: string, onClick: () => void}> = ({label, value, icon: Icon, subText, onClick}) => (
    <button onClick={onClick} className="bg-white border border-zinc-200/60 p-5 rounded-xl hover:border-zinc-300 transition-all group shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] text-left w-full">
       <div className="flex justify-between items-start mb-4">
           <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:text-zinc-900 transition-colors"><Icon size={16} /></div>
           <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-400 transition-colors" />
       </div>
       <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
       <div className="flex items-baseline gap-2">
         <p className="text-2xl font-semibold text-zinc-900 tracking-tight">{value}</p>
         {subText && <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">{subText}</span>}
       </div>
    </button>
);

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, agency }) => {
  const isUsace = agency === 'USACE_CEFMS';
  const isOsd = agency === 'OSD_BRAC';
  const isHap = agency === 'OSD_HAP';
  const isLgh = agency === 'OSD_LGH';
  const isHapmis = agency === 'USACE_HAPMIS';

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {isUsace ? (
            <>
                <StatCard label="Civil Works Program" value="$7.2B" icon={Construction} subText="+5.1% (IIJA)" onClick={() => setActiveTab(NavigationTab.APPROPRIATIONS)} />
                <StatCard label="Execution (Labor)" value="92.4%" icon={TrendingUp} subText="Q4 Target Met" onClick={() => setActiveTab(NavigationTab.LABOR_COSTING)} />
                <StatCard label="Revolving Fund (96X4902)" value="$850M" icon={Anchor} subText="Liquid" onClick={() => setActiveTab(NavigationTab.REVOLVING_FUNDS)} />
                <StatCard label="P2 Project Linkage" value="100%" icon={GitMerge} subText="CEFMS Synced" onClick={() => setActiveTab(NavigationTab.USACE_PROJECTS)} />
            </>
        ) : isOsd ? (
            <>
                <StatCard label="Closure Fund (0516)" value="$450M" icon={Banknote} subText="Auth: PL 101-510" onClick={() => setActiveTab(NavigationTab.APPROPRIATIONS)} />
                <StatCard label="Real Property Disposal" value="85%" icon={Home} subText="3 Sites Remaining" onClick={() => setActiveTab(NavigationTab.ASSET_LIFECYCLE)} />
                <StatCard label="Env. Restoration" value="$150M" icon={Leaf} subText="Active Cleanup" onClick={() => setActiveTab(NavigationTab.PPBE_CYCLE)} />
                <StatCard label="Funds Control" value="No ADA" icon={Gavel} subText="100% Compliant" onClick={() => setActiveTab(NavigationTab.ADMIN_CONTROL)} />
            </>
        ) : (
            <>
                <StatCard label="Budget Authority" value="$185.0B" icon={Banknote} subText="+2.4%" onClick={() => setActiveTab(NavigationTab.APPROPRIATIONS)} />
                <StatCard label="Execution Velocity" value="89.2%" icon={TrendingUp} subText="On Track" onClick={() => setActiveTab(NavigationTab.PPBE_CYCLE)} />
                <StatCard label="FIAR Readiness" value="GOLD" icon={ShieldCheck} onClick={() => setActiveTab(NavigationTab.COMPLIANCE)} />
                <StatCard label="Thread Linkage" value="62/62" icon={GitMerge} subText="100% Integrity" onClick={() => setActiveTab(NavigationTab.DIGITAL_THREAD)} />
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
         <div className="lg:col-span-2 bg-[#18181b] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group border border-zinc-800 flex flex-col min-h-[300px]">
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none ${isHap ? 'bg-teal-500/10' : isOsd ? 'bg-indigo-500/5' : isLgh ? 'bg-cyan-500/10' : isHapmis ? 'bg-orange-500/10' : 'bg-blue-500/5'}`} />
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-lg font-medium text-white tracking-tight mb-1">Financial Execution Pulse</h3>
                   <p className="text-zinc-400 text-xs font-medium">Real-time obligation vs plan analysis across all commands.</p>
                 </div>
                 <button onClick={() => setActiveTab(NavigationTab.ANALYTICS)} className="px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-[10px] font-bold hover:bg-zinc-200 transition-colors uppercase tracking-wide">AI Insights</button>
               </div>
               
               <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={MOCK_EXECUTION_DATA} barSize={24}>
                        <XAxis dataKey="month" hide />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Bar dataKey="planned" fill="#3f3f46" radius={[4, 4, 4, 4]} name="Planned" />
                        <Bar dataKey="actual" radius={[4, 4, 4, 4]} name="Obligated">
                            {MOCK_EXECUTION_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.actual > entry.planned ? '#ef4444' : '#10b981'} />
                            ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-zinc-200/60 p-6 flex flex-col justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] min-h-[300px]">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-zinc-50 rounded border border-zinc-100"><Cpu size={18} className="text-zinc-600"/></div>
                    <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">System Health</h4>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-dashed border-zinc-200">
                        <span className="text-xs text-zinc-500 font-medium">Latency</span>
                        <span className="text-xs font-mono text-emerald-600 font-bold">0.8ms</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-dashed border-zinc-200">
                        <span className="text-xs text-zinc-500 font-medium">Daily Outlays</span>
                        <span className="text-xs font-mono text-zinc-800">$42.5M</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-dashed border-zinc-200">
                        <span className="text-xs text-zinc-500 font-medium">Audit Nodes</span>
                        <span className="text-xs font-mono text-zinc-800">12/12</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sentinel Ready</span>
               </div>
               <p className="text-[11px] text-zinc-500 leading-relaxed">All sub-ledgers synchronized. Intelligence engine monitoring for ADA risk and PPA interest penalties.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
