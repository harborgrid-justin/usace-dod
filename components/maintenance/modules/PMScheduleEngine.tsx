
import React from 'react';
import { CalendarClock, CheckCircle2, Clock } from 'lucide-react';

const PMScheduleEngine: React.FC = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <div><h3 className="text-lg font-bold text-zinc-900">Preventive Maintenance</h3><p className="text-xs text-zinc-500">Recurring service schedules and safety inspections.</p></div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase border border-emerald-100">98% Compliant</div>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {[
                { name: 'Quarterly AHU Filter Change', next: '2024-06-15', frequency: '90 Days' },
                { name: 'Annual Fire Alarm Recertification', next: '2024-11-01', frequency: '365 Days' }
            ].map((pm, i) => (
                <div key={i} className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-all flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400"><CalendarClock size={16}/></div>
                        <div><p className="text-sm font-bold text-zinc-900">{pm.name}</p><p className="text-[10px] text-zinc-400 font-mono">Interval: {pm.frequency}</p></div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Next Due</p>
                        <p className="text-xs font-mono font-bold text-zinc-900">{pm.next}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default PMScheduleEngine;
