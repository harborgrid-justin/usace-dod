
import React, { useMemo } from 'react';
import { 
  ShieldCheck, Banknote, TrendingUp, GitMerge, ArrowUpRight, Clock, Activity, Landmark, Zap, Server
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';
import { NavigationTab, AgencyContext } from '../../types';
import { MOCK_EXECUTION_DATA, REMIS_THEME } from '../../constants';
import CommandersBriefing from '../dashboard/CommandersBriefing';
import SystemHeartbeat from '../erp/SystemHeartbeat';
import SegmentVisualizer from '../erp/SegmentVisualizer';

interface DashboardViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  agency: AgencyContext;
}

const StatCard: React.FC<{label: string, value: string, icon: React.ElementType, subText?: string, colorClass: string, onClick: () => void}> = React.memo(({label, value, icon: Icon, subText, colorClass, onClick}) => (
    <button onClick={onClick} className="bg-white border border-zinc-200 p-5 rounded-sm hover:border-zinc-400 hover:shadow-md transition-all group text-left w-full active:scale-[0.98] relative overflow-hidden flex flex-col justify-between min-h-[140px]">
       <div className="flex justify-between items-start mb-4">
           <div className={`p-2 rounded-sm bg-zinc-50 border border-zinc-100 ${colorClass} group-hover:scale-105 transition-transform shadow-inner shrink-0`}><Icon size={18} strokeWidth={2} /></div>
           <ArrowUpRight size={12} className="text-zinc-300 group-hover:text-zinc-900 transition-colors shrink-0" />
       </div>
       <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1 truncate">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-mono font-bold text-zinc-900 tabular-nums">{value}</p>
            {subText && <span className="text-[8px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100 shadow-sm whitespace-nowrap">{subText}</span>}
          </div>
       </div>
    </button>
));

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, agency }) => {
  const chartData = useMemo(() => MOCK_EXECUTION_DATA, []);
  
  const dashboardStats = useMemo(() => ({
    budgetAuthority: "$185.0B",
    executionRate: "89.2%",
    fiarScore: "GOLD",
    systemSync: "100%",
    alerts: 2
  }), []);

  return (
    <div className="p-6 space-y-6 animate-in h-full flex flex-col overflow-y-auto custom-scrollbar bg-zinc-50/50 surface-grid">
      
      {/* Enterprise Executive HUD */}
      <div className="bg-[#09090b] rounded-md shadow-2xl border border-zinc-800 overflow-hidden shrink-0 group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent pointer-events-none" />
          <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
              <div className="flex items-center gap-5 min-w-0">
                  <div className="w-12 h-12 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform shrink-0">
                      <Zap size={24} className="text-emerald-500" fill="currentColor" />
                  </div>
                  <div className="min-w-0">
                      <h2 className="text-xl font-black text-white uppercase tracking-tight truncate leading-none">Fiscal Command</h2>
                      <div className="flex items-center gap-3 mt-2 whitespace-nowrap overflow-hidden">
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Clock size={10}/> FY 2024 P-05
                          </span>
                          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)] shrink-0" />
                          <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest truncate">Node: GFEBS_S4_HANA</span>
                      </div>
                  </div>
              </div>

              <div className="hidden lg:block border-l border-zinc-800 h-12 shrink-0" />

              <div className="flex-1 hidden xl:block px-8 min-w-0">
                   <SystemHeartbeat />
              </div>

              <div className="flex gap-3 shrink-0">
                  <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-sm text-center shadow-inner group/score hover:border-emerald-500/30 transition-all">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fiduciary Status</p>
                      <p className="text-sm font-black text-emerald-500 tracking-widest">F-1 READY</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Strategic Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <StatCard label="Total Authority" value="$185.0B" icon={Banknote} colorClass="text-zinc-900" subText="+2.4%" onClick={() => setActiveTab(NavigationTab.APPROPRIATIONS)} />
          <StatCard label="Execution Pace" value="89.2%" icon={TrendingUp} colorClass="text-emerald-700" subText="On Target" onClick={() => setActiveTab(NavigationTab.PPBE_CYCLE)} />
          <StatCard label="FIAR Score" value="GOLD" icon={ShieldCheck} colorClass="text-blue-700" subText="Certified" onClick={() => setActiveTab(NavigationTab.COMPLIANCE)} />
          <StatCard label="Logic Integrity" value="62/62" icon={GitMerge} colorClass="text-indigo-700" subText="Validated" onClick={() => setActiveTab(NavigationTab.DIGITAL_THREAD)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
         <div className="xl:col-span-8 space-y-6 flex flex-col h-full min-h-0">
            {/* Main execution monitor */}
            <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col flex-1 min-h-[400px] relative overflow-hidden group/chart">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 shrink-0 relative z-10 gap-4">
                    <div className="min-w-0">
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Global Burn Velocity</h3>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1 tracking-widest">Auth Ceiling vs Actual Outlays (FY24)</p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                        <div className="flex items-center gap-1.5 text-[8px] font-black text-zinc-400 uppercase tracking-widest"><div className="w-2 h-2 bg-zinc-100 rounded-sm border border-zinc-200" /> Planned</div>
                        <div className="flex items-center gap-1.5 text-[8px] font-black text-zinc-900 uppercase tracking-widest"><div className="w-2 h-2 bg-zinc-900 rounded-sm" /> Actual</div>
                    </div>
                </div>
                
                <div className="flex-1 w-full min-h-0 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold', fill: '#a1a1aa'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#a1a1aa'}} tickFormatter={(v) => `$${v}B`} />
                            <Tooltip 
                                cursor={{fill: 'rgba(0,0,0,0.01)'}}
                                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)', color: '#fff', padding: '8px', fontSize: '11px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="planned" fill="#f4f4f5" radius={[2, 2, 0, 0]} barSize={24} />
                            <Bar dataKey="actual" radius={[2, 2, 0, 0]} barSize={24}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.actual > entry.planned ? '#059669' : '#18181b'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="shrink-0 min-w-0">
                <SegmentVisualizer />
            </div>
         </div>

         <div className="xl:col-span-4 flex flex-col gap-6 h-full min-h-0">
            <div className="flex-1 min-h-0">
                <CommandersBriefing stats={dashboardStats} />
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm shrink-0">
                 <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Server size={14} className="text-rose-700" /> Agency Sync Registry
                 </h4>
                 <div className="space-y-4">
                    {[
                        { name: 'GFEBS_S4_HANA', status: 'Active', lag: '0.04ms', health: 100 },
                        { name: 'USACE_CEFMS_V2', status: 'Active', lag: '0.12ms', health: 98 },
                        { name: 'OSD_REMIS_PLATFORM', status: 'Active', lag: '0.08ms', health: 100 }
                    ].map(node => (
                        <div key={node.name} className="flex justify-between items-center group cursor-pointer hover:translate-x-0.5 transition-all min-w-0">
                            <div className="space-y-0.5 min-w-0 flex-1 pr-4">
                                <p className="text-[10px] font-black text-zinc-900 group-hover:text-rose-700 transition-colors truncate">{node.name}</p>
                                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest truncate">{node.status} • {node.lag}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="w-12 bg-zinc-100 h-1 rounded-full overflow-hidden shadow-inner border border-zinc-200/50">
                                    <div className="h-full bg-emerald-500" style={{width: `${node.health}%`}} />
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
