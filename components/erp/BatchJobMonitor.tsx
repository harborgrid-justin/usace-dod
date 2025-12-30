
import React from 'react';
import { Clock, RefreshCw, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import Badge from '../shared/Badge';

const BatchJobMonitor: React.FC = () => {
    const jobs = [
        { id: 'B_001', name: 'GL Reconciliation', progress: 100, status: 'Complete', time: '14:02:11' },
        { id: 'B_002', name: 'Interest Calc (PPA)', progress: 42, status: 'Running', time: '14:22:05' },
        { id: 'B_003', name: 'Treasury Feed (SF-1151)', progress: 10, status: 'Scheduled', time: '15:00:00' }
    ];

    return (
        <div className="bg-white border border-zinc-200 rounded-[32px] p-6 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} className="text-rose-700"/> ERP Background Engine
                </h3>
                <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-all"><RefreshCw size={14}/></button>
            </div>
            
            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {jobs.map(job => (
                    <div key={job.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl group hover:border-zinc-300 transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-zinc-800">{job.name}</p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase tracking-widest">JOB: {job.id}</p>
                            </div>
                            {job.status === 'Running' ? (
                                <RefreshCw size={14} className="text-blue-500 animate-spin" />
                            ) : job.status === 'Complete' ? (
                                <CheckCircle2 size={14} className="text-emerald-500" />
                            ) : (
                                <Play size={14} className="text-zinc-300" />
                            )}
                        </div>
                        
                        <div className="space-y-2 relative z-10">
                            <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className={`h-full transition-all duration-1000 ${job.status === 'Running' ? 'bg-blue-600' : 'bg-emerald-600'}`} 
                                    style={{ width: `${job.progress}%` }} 
                                />
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-bold">
                                <span className="text-zinc-400 uppercase tracking-widest">{job.status}</span>
                                <span className="text-zinc-900 font-mono">{job.progress}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full mt-6 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-zinc-800 transition-all active:scale-95">
                Manage Job Scheduler
            </button>
        </div>
    );
};

export default BatchJobMonitor;
