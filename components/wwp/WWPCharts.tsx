import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatting';

interface Props {
  data: any[];
}

const WWPCharts: React.FC<Props> = ({ data }) => (
  <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
    <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Supply vs Demand Analysis</h3>
        <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase"><div className="w-2.5 h-2.5 bg-zinc-200 rounded-sm" /> Required</div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase"><div className="w-2.5 h-2.5 bg-rose-600 rounded-sm" /> Planned</div>
        </div>
    </div>
    <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="Demand" fill="#e4e4e7" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="Supply" fill="#be123c" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  </div>
);
export default WWPCharts;