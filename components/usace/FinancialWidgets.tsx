import React from 'react';
import { DollarSign, Landmark, ArrowRight, Clock } from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';

export * from './CostShareWidget';
export * from './PRCList';

export const FundingStreamVisualizer: React.FC<{ project: USACEProject }> = ({ project }) => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Appropriation Flow</h4>
        <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
            <div className="flex flex-col items-center bg-white px-2">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600 border border-purple-100 mb-2"><Landmark size={16}/></div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">{project.appropriation}</p>
            </div>
            <ArrowRight size={16} className="text-zinc-300" />
            <div className="flex flex-col items-center bg-white px-2">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-2"><DollarSign size={16}/></div>
                <p className="text-xs font-mono font-bold">{formatCurrency(project.financials.programmed)}</p>
            </div>
            <ArrowRight size={16} className="text-zinc-300" />
            <div className="flex flex-col items-center bg-white px-2">
                <div className="p-3 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2"><Clock size={16}/></div>
                <p className="text-xs font-mono font-bold">{formatCurrency(project.financials.obligated)}</p>
            </div>
        </div>
    </div>
);