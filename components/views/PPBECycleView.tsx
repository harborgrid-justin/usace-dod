import React, { useState, useTransition, useMemo } from 'react';
import { 
  Clock, Target, Calendar, TrendingUp, ShieldCheck, 
  ChevronRight, ArrowUpRight, CheckCircle2, Activity
} from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { POM_PHASES, MOCK_EXECUTION_DATA } from '../../constants';
import ResourceEstimatesView from '../resource_estimates/ResourceEstimatesView';
import { AgencyContext } from '../../types';

interface PPBECycleViewProps {
    agency?: AgencyContext;
}

const PPBECycleView: React.FC<PPBECycleViewProps> = ({ agency }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  if (agency === 'USACE_CEFMS' || agency === 'OSD_BRAC') {
      return <ResourceEstimatesView agency={agency} />;
  }

  const chartData = useMemo(() => [
    { name: 'Sustainment', value: 45, color: '#be123c' },
    { name: 'Restoration', value: 30, color: '#4f46e5' },
    { name: 'Modernization', value: 25, color: '#10b981' }
  ], []);

  const handleStepClick = (index: number) => {
    startTransition(() => {
      setActiveStep(index);
    });
  };

  return (
    <div className={`p-4 sm:p-8 space-y-8 animate-in fade-in h-full overflow-y-auto custom-scrollbar pb-12 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
              <Calendar size={28} className="text-zinc-400" /> Strategic POM Workflow
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1">FY 2026-2030 POM Formulation</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {POM_PHASES.map((p, i) => (
             <button 
                key={i} 
                onClick={() => handleStepClick(i)}
                className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${
                  activeStep === i 
                  ? 'bg-zinc-900 border-zinc-800 text-white shadow-xl scale-[1.02] z-10' 
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
             >
                <div className="flex justify-between items-center mb-4">
                  <p className="font-mono text-xs font-bold text-zinc-400">FY {p.year}</p>
                  {p.status === 'Completed' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Activity size={16} className="text-blue-500 animate-pulse" />}
                </div>
                <h3 className="text-lg font-bold uppercase mb-4 tracking-tight">{p.phase}</h3>
                <div className={`h-1.5 w-full rounded-full overflow-hidden mb-3 ${activeStep === i ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                   <div className={`h-full transition-all duration-1000 ${activeStep === i ? 'bg-emerald-400' : 'bg-zinc-900'}`} style={{ width: `${p.progress}%` }} />
                </div>
             </button>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm flex flex-col h-[450px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-600" /> Execution Variance
                </h3>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_EXECUTION_DATA}>
                    <defs>
                      <linearGradient id="colorVar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                    <XAxis dataKey="month" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}B`} />
                    <Tooltip contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fill="url(#colorVar)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex-1 border border-zinc-800">
               <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                  <Target size={16}/> Priority Alignment
               </h3>
               <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={{fontSize: 10, fill: '#fff', fontWeight: 600}} width={80} axisLine={false} tickLine={false}/>
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                          {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               <button className="w-full mt-8 py-3 bg-white text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
                    Defend Program <ChevronRight size={14} />
               </button>
            </div>
          </div>
       </div>
    </div>
  );
};

export default PPBECycleView;