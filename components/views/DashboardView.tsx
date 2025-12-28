import React, { useMemo, useCallback } from 'react';
import { ShieldCheck, Banknote, TrendingUp, GitMerge, Cpu, ArrowUpRight, Construction, Anchor, PieChart, Home, Leaf, Gavel, Users, Clock, Building, Key, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { NavigationTab, AgencyContext } from '../../types';
import { MOCK_EXECUTION_DATA } from '../../constants';

interface DashboardViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  agency: AgencyContext;
}

const StatCard: React.FC<{label: string, value: string, icon: React.ElementType, subText?: string, onClick: () => void}> = React.memo(({label, value, icon: Icon, subText, onClick}) => (
    <button onClick={onClick} className="bg-white border border-zinc-200/60 p-5 rounded-xl hover:border-zinc-300 transition-all group shadow-sm text-left w-full active:scale-[0.98]">
       <div className="flex justify-between items-start mb-4">
           <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-600 group-hover:text-zinc-900 transition-colors"><Icon size={16} /></div>
           <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-400 transition-colors" />
       </div>
       <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
       <div className="flex items-baseline gap-2">
         <p className="text-2xl font-semibold text-zinc-900 tracking-tight">{value}</p>
         {subText && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{subText}</span>}
       </div>
    </button>
));

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, agency }) => {
  const isUsace = agency === 'USACE_CEFMS';
  const isOsd = agency === 'OSD_BRAC';

  const chartData = useMemo(() => MOCK_EXECUTION_DATA, []);

  const handleStatClick = useCallback((tab: NavigationTab) => {
    setActiveTab(tab);
  }, [setActiveTab]);

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {isUsace ? (
            <>
                <StatCard label="Civil Works Program" value="$7.2B" icon={Construction} subText="+5.1% (IIJA)" onClick={() => handleStatClick(NavigationTab.APPROPRIATIONS)} />
                <StatCard label="Execution Velocity" value="92.4%" icon={TrendingUp} subText="Q4 Target" onClick={() => handleStatClick(NavigationTab.LABOR_COSTING)} />
                <StatCard label="Revolving Fund" value="$850M" icon={Anchor} subText="96X4902" onClick={() => handleStatClick(NavigationTab.REVOLVING_FUNDS)} />
                <StatCard label="P2 Project Linkage" value="100%" icon={GitMerge} subText="Synced" onClick={() => handleStatClick(NavigationTab.USACE_PROJECTS)} />
            </>
        ) : (
            <>
                <StatCard label="Budget Authority" value="$185.0B" icon={Banknote} subText="+2.4%" onClick={() => handleStatClick(NavigationTab.APPROPRIATIONS)} />
                <StatCard label="Execution Rate" value="89.2%" icon={TrendingUp} subText="On Track" onClick={() => handleStatClick(NavigationTab.PPBE_CYCLE)} />
                <StatCard label="FIAR Readiness" value="GOLD" icon={ShieldCheck} onClick={() => handleStatClick(NavigationTab.COMPLIANCE)} />
                <StatCard label="Logic Linkage" value="62/62" icon={GitMerge} subText="Secured" onClick={() => handleStatClick(NavigationTab.DIGITAL_THREAD)} />
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
         <div className="lg:col-span-2 bg-[#18181b] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group border border-zinc-800 flex flex-col">
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-lg font-medium text-white tracking-tight mb-1">Execution Velocity Matrix</h3>
                   <p className="text-zinc-400 text-xs font-medium">Real-time obligation vs plan analysis.</p>
                 </div>
                 <button onClick={() => handleStatClick(NavigationTab.ANALYTICS)} className="px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-[10px] font-bold hover:bg-zinc-200 transition-colors uppercase tracking-wide">Sentinel AI</button>
               </div>
               
               <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData} barSize={24}>
                        <XAxis dataKey="month" hide />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#27272a', border: 'none', borderRadius: '12px', color: '#fff' }}
                        />
                        <Bar dataKey="planned" fill="#3f3f46" radius={[4, 4, 4, 4]} />
                        <Bar dataKey="actual" radius={[4, 4, 4, 4]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.actual > entry.planned ? '#ef4444' : '#10b981'} />
                            ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-zinc-200/60 p-6 flex flex-col justify-between shadow-sm">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-zinc-50 rounded border border-zinc-100"><Cpu size={18} className="text-zinc-600"/></div>
                    <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">Authoritative Nodes</h4>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Latency', value: '0.8ms', status: 'Optimal' },
                        { label: 'Sync Status', value: '100%', status: 'Balanced' },
                        { label: 'Security Level', value: 'ILS-4', status: 'Secured' }
                    ].map(item => (
                        <div key={item.label} className="flex justify-between items-center pb-3 border-b border-dashed border-zinc-200">
                            <span className="text-xs text-zinc-500 font-medium">{item.label}</span>
                            <span className="text-xs font-mono text-zinc-900 font-bold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Logic Secured</span>
               </div>
               <p className="text-[11px] text-zinc-500 leading-relaxed">Integrated sub-ledgers validated by Sentinel-3 Engine.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;