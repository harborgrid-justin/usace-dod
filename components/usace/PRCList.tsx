import React from 'react';
import { FileText } from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';

export const PRCList: React.FC<{ project: USACEProject }> = ({ project }) => (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> ENG Form 93 Register
            </h4>
            <span className="text-[10px] font-mono text-zinc-500 font-bold">Total: {formatCurrency(project.financials.prc_committed)}</span>
        </div>
        <div className="divide-y divide-zinc-100 overflow-y-auto custom-scrollbar max-h-60">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                    <div><p className="text-xs font-bold text-zinc-800">PRC-24-00{i}</p><p className="text-[10px] text-zinc-500">Service Line Item</p></div>
                    <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(150000)}</p>
                </div>
            ))}
        </div>
    </div>
);