
import React, { useState, useTransition, useMemo } from 'react';
import { 
  Clock, Target, Calendar, TrendingUp, ShieldCheck, 
  ChevronRight, ArrowUpRight, CheckCircle2, Activity, Database
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
    <div className={`p-4 sm:p-8 space-y-6 animate-in h-full flex flex-col bg-zinc-50/50 overflow-hidden transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
       <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 uppercase tracking-tight flex items-center gap-3">
              <Calendar size={28} className="text-rose-700" /> Strategic POM Workflow
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1">PPBE Cycle Management • FY 2026-2030 Formulation</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-zinc-200 shadow-sm">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Cycle</span>
             <span className="text-xs font-black text-zinc-900 uppercase">FY26 Formulation</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {POM_PHASES.map((p, i) => (
             <button 
                key={i} 
                onClick={() => handleStepClick(i)}
                className={`p-6 rounded-[32px] border transition-all text-left group relative overflow-hidden active:scale-95 ${
                  activeStep === i 
                  ? 'bg-zinc-900 border-zinc-800 text-white shadow-2xl scale-[1.02] z-10' 
                  : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                }`}
             >
                <div className="flex justify-between items-center mb-6">
                  <p className={`font-mono text-[10px] font-bold ${activeStep === i ? 'text-zinc-500' : 'text-zinc-400'}`}>FY {p.year}</p>
                  {p.status === 'Completed' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Activity size={16} className="text-blue-500 animate-pulse" />}
                </div>
                <h3 className="text-lg font-black uppercase mb-6 tracking-tighter leading-tight">{p.phase}</h3>
                <div className={`h-1 w-full rounded-full overflow-hidden mb-2 ${activeStep === i ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                   <div className={`h-full transition-all duration-1000 ${activeStep === i ? 'bg-emerald-400' : 'bg-zinc-900'}`} style={{ width: `${p.progress}%` }} />
                </div>
                <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest opacity-60">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                </div>
             </button>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
          <div className="lg:col-span-8 bg-white border border-zinc-200 p-10 rounded-[40px] shadow-sm flex flex-col h-full min-h-[400px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none rotate-12"><Activity size={240} /></div>
              <div className="flex justify-between items-center mb-10 shrink-0 relative z-10">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-600" /> Strategic Execution Variance
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase font-medium">Monthly Outlays vs Target Authorization</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase"><div className="w-2 h-2 rounded-full bg-zinc-100 border border-zinc-200"/> Target</div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-700 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"/> Actual</div>
                </div>
              </div>
              <div className="flex-1 w-full min-h-0 relative z-10">
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
                    <Tooltip contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={4} fill="url(#colorVar)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="bg-zinc-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-zinc-800 flex flex-col min-h-[350px]">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={120}/></div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-10 flex items-center gap-3 relative z-10">
                  <Target size={18}/> Allocation Priority Mix
               </h3>
               <div className="flex-1 w-full min-h-0 relative z-10 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -30 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" tick={{fontSize: 10, fill: '#fff', fontWeight: 600}} width={100} axisLine={false} tickLine={false}/>
                        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                          {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               <button className="w-full py-4 bg-white text-zinc-900 rounded-3xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-100 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 relative z-10">
                    Defend Program Authority <ArrowUpRight size={18} />
               </button>
            </div>
            
            <div className="bg-white border border-zinc-200 p-6 rounded-[32px] shadow-sm flex items-start gap-4">
                 <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-400 shadow-inner"><Database size={18}/></div>
                 <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">SNaP Sync</p>
                    <p className="text-xs font-bold text-zinc-800">Database reconciliation active.</p>
                    <p className="text-[9px] text-zinc-500 mt-1 font-medium leading-relaxed">Cross-referencing SELECT & PROMIS delta sets.</p>
                 </div>
            </div>
          </div>
       </div>
    </div>
  );
};

export default PPBECycleView;
