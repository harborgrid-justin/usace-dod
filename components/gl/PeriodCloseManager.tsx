
import React, { useState, useTransition } from 'react';
import { Check, Circle, Clock, AlertTriangle, Shield, Calendar, Play, FileCheck, Landmark } from 'lucide-react';
import Badge from '../shared/Badge';

type TaskStatus = 'Pending' | 'In Progress' | 'Complete' | 'Error';

const PeriodCloseManager: React.FC = () => {
    const [activePeriod, setActivePeriod] = useState<'Month' | 'Quarter' | 'Year'>('Month');
    const [isPending, startTransition] = useTransition();
    
    const [tasks, setTasks] = useState({
        'Month': [
            { id: 'm1', name: 'Post Sub-ledger Batches (AP/AR)', status: 'Complete' as TaskStatus },
            { id: 'm2', name: 'Run Payroll Accruals', status: 'In Progress' as TaskStatus },
            { id: 'm3', name: 'Review Suspense Accounts', status: 'Pending' as TaskStatus },
            { id: 'm4', name: 'Finalize & Lock Period', status: 'Pending' as TaskStatus }
        ],
        'Quarter': [
            { id: 'q1', name: 'Reconcile FBWT', status: 'Complete' as TaskStatus },
            { id: 'q2', name: 'Run Depreciation & Ownership Costs', status: 'Complete' as TaskStatus },
            { id: 'q3', name: 'Perform UDO Review', status: 'Pending' as TaskStatus },
            { id: 'q4', name: 'Generate GTAS Edit Checks', status: 'Pending' as TaskStatus }
        ],
        'Year': [
            { id: 'y1', name: 'Execute Year-End Closing Entries', status: 'Pending' as TaskStatus },
            { id: 'y2', name: 'Calculate Balance Carry-Forward', status: 'Pending' as TaskStatus },
            { id: 'y3', name: 'Generate Opening Balances for FY+1', status: 'Pending' as TaskStatus }
        ]
    });

    const handleExecute = (taskId: string) => {
        startTransition(() => {
            const updated = { ...tasks };
            const task = updated[activePeriod].find(t => t.id === taskId);
            if (task) {
                task.status = 'In Progress';
                setTasks(updated);
                
                // Simulate authoritative process latency
                setTimeout(() => {
                    startTransition(() => {
                        const final = { ...tasks };
                        const t = final[activePeriod].find(i => i.id === taskId);
                        if (t) t.status = 'Complete';
                        setTasks(final);
                    });
                }, 1500);
            }
        });
    };

    return (
        <div className="p-8 h-full flex flex-col items-center bg-zinc-50/50 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h3 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center justify-center gap-3">
                        <Landmark size={32} className="text-rose-700"/> Accounting Period Close
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed">
                        Authoritative sequence for fiscal accountability. Ensure all sub-ledgers are reconciled before initiating final period lock and transmission to Treasury.
                    </p>
                    <div className="flex justify-center bg-white p-1.5 rounded-md border border-zinc-200 shadow-sm w-fit mx-auto">
                        {(['Month', 'Quarter', 'Year'] as const).map(p => (
                            <button 
                                key={p} 
                                onClick={() => setActivePeriod(p)} 
                                className={`px-6 py-2 rounded-sm text-xs font-bold uppercase transition-all ${
                                    activePeriod === p ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                            >
                                {p}-End
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-md p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-zinc-900 text-white rounded-md shadow-xl border border-zinc-800"><Calendar size={28}/></div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Status</p>
                            <h4 className="text-xl font-bold text-zinc-900">February 2024 (FY 2024 05)</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase">Open for Posting</span>
                            </div>
                        </div>
                    </div>
                    <button className="px-8 py-3 bg-rose-700 text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-200 flex items-center gap-3 transition-all active:scale-95">
                        <Shield size={18}/> Initiate Period Lock
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-4">
                        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fiduciary Task Sequence</h4>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">System Status</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {tasks[activePeriod].map(task => (
                            <div key={task.id} className="bg-white p-5 rounded-md border border-zinc-100 flex justify-between items-center group hover:border-rose-200 transition-all shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-sm transition-colors ${
                                        task.status === 'Complete' ? 'bg-emerald-50 text-emerald-600' : 
                                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-50 text-zinc-400'
                                    }`}>
                                        {task.status === 'Complete' ? <Check size={18}/> : 
                                         task.status === 'In Progress' ? <Clock size={18} className="animate-spin"/> : <Circle size={18}/>}
                                    </div>
                                    <div>
                                        <span className={`text-sm font-bold ${task.status === 'Complete' ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>{task.name}</span>
                                        <p className="text-[10px] text-zinc-400 mt-0.5 uppercase font-medium tracking-tighter">Standard Internal Control Requirement</p>
                                    </div>
                                </div>
                                <button 
                                    disabled={task.status === 'Complete' || isPending} 
                                    onClick={() => handleExecute(task.id)}
                                    className="px-5 py-2 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider disabled:bg-zinc-100 disabled:text-zinc-400 transition-all group-hover:scale-[1.02] flex items-center gap-2 shadow-md active:scale-95"
                                >
                                    <Play size={12} fill="currentColor"/> Execute
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {activePeriod === 'Year' && (
                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-md flex gap-4 text-amber-900 animate-in zoom-in duration-300">
                        <AlertTriangle size={24} className="shrink-0 mt-1" />
                        <div>
                            <h5 className="font-bold text-sm">Fiscal Year End Warning</h5>
                            <p className="text-xs leading-relaxed mt-1 font-medium">
                                Year-end close procedures involve permanent budgetary account reclassifications. Ensure all 4901 and 4902 series Tie-Points are reconciled before final execution to avoid Treasury mismatch alerts.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeriodCloseManager;
