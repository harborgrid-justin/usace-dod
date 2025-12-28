
import React from 'react';
import { User, Clock, Briefcase } from 'lucide-react';

const WorkOrderTracker: React.FC<{onSelect: (wo: any) => void}> = ({ onSelect }) => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-900">Work Order Tracking</h3>
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100"><Briefcase size={12} className="inline mr-1"/> Active: 2</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {['WO-24-1001', 'WO-24-1002'].map(id => (
                <div key={id} className="p-4 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all bg-white cursor-pointer" onClick={() => onSelect({id, description: 'Repair AHU-1 Belt', status: 'In Progress'})}>
                    <div className="flex items-center gap-3 mb-1"><span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border bg-blue-50 text-blue-700">Corrective</span><span className="text-xs font-mono font-bold">{id}</span></div>
                    <p className="text-sm font-medium">Repair AHU-1 Belt</p>
                    <div className="flex gap-4 mt-2 text-xs text-zinc-500"><span className="flex items-center gap-1"><User size={12}/> Tech A</span><span className="flex items-center gap-1"><Clock size={12}/> Due: 2024-03-15</span></div>
                </div>
            ))}
        </div>
    </div>
);
export default WorkOrderTracker;
