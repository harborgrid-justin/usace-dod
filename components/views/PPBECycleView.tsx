
import React from 'react';
import { Clock, Target } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { POM_PHASES, MOCK_EXECUTION_DATA } from '../../constants';
import ResourceEstimatesView from '../resource_estimates/ResourceEstimatesView';
import { AgencyContext } from '../../types';

// Extend PPBE View to check context
interface PPBECycleViewProps {
    agency?: AgencyContext;
}

const PPBECycleView: React.FC<PPBECycleViewProps> = ({ agency }) => {
  // If USACE or OSD, return the Resource Estimates module view with specific branding
  if (agency === 'USACE_CEFMS' || agency === 'OSD_BRAC') {
      return <ResourceEstimatesView agency={agency} />;
  }

  // Default Army View (PPBE)
  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in max-w-[1600px] mx-auto h-full overflow-y-auto custom-scrollbar">
       <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight">Strategic POM View</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {POM_PHASES.map((p, i) => (
             <div key={i} className="bg-white p-6 rounded-xl border border-zinc-200 relative group overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:border-zinc-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-zinc-900 transition-opacity"><Clock size={48}/></div>
                <p className="text-zinc-400 font-mono text-sm font-bold mb-1">FY {p.year}</p>
                <h3 className="text-zinc-900 text-lg font-bold uppercase mb-4">{p.phase}</h3>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-3">
                   <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${p.progress}%` }} />
                </div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{p.status}</p>
             </div>
          ))}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
          <div className="bg-white border border-zinc-200 p-6 rounded-xl h-80 flex flex-col relative overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-6 z-10">Historical Variance</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_EXECUTION_DATA}>
                   <defs>
                     <linearGradient id="colorVar" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                   <XAxis dataKey="month" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#18181b', fontSize: '12px', fontWeight: 'bold' }}
                   />
                   <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVar)" />
                </AreaChart>
              </ResponsiveContainer>
          </div>
          <div className="bg-zinc-50 border border-dashed border-zinc-300 p-6 rounded-xl h-80 flex flex-col items-center justify-center">
             <Target size={32} className="text-zinc-300 mb-4" />
             <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">POM 26-30 Roadmap</p>
          </div>
       </div>
    </div>
  );
};

export default PPBECycleView;
