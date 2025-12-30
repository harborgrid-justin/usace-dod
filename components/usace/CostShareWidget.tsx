import React, { useMemo } from 'react';
import { PieChart, Cell, ResponsiveContainer, Pie } from 'recharts';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';

export const CostShareWidget: React.FC<{ project: USACEProject }> = ({ project }) => {
    if (!project.costShare) return null;
    const data = useMemo(() => [
        { name: 'Federal', value: project.costShare!.federalShare, color: '#e11d48' },
        { name: 'Non-Federal', value: project.costShare!.nonFederalShare, color: '#2563eb' }
    ], [project.costShare]);

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Cost Share Agreement</h4>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={data} innerRadius={25} outerRadius={40} dataKey="value">
                            {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie></PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between text-xs"><span className="font-bold text-rose-700">Federal ({project.costShare.federalShare}%)</span></div>
                    <div className="flex justify-between text-xs"><span className="font-bold text-blue-700">{project.costShare.sponsorName} ({project.costShare.nonFederalShare}%)</span></div>
                    <p className="text-[10px] text-zinc-400">Balance Due: {formatCurrency(project.costShare.balanceDue)}</p>
                </div>
            </div>
        </div>
    );
};