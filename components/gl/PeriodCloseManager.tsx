
import React, { useState } from 'react';
import { Check, Circle, Clock, AlertTriangle, Shield, Calendar } from 'lucide-react';

type TaskStatus = 'Pending' | 'In Progress' | 'Complete' | 'Error';

const PeriodCloseManager: React.FC = () => {
    const [activePeriod, setActivePeriod] = useState<'Month' | 'Quarter' | 'Year'>('Month');
    
    // Mock task state
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

    const TaskItem = ({ name, status }: { name: string, status: TaskStatus }) => {
        const icons = {
            'Pending': <Circle size={16} className="text-zinc-300"/>,
            'In Progress': <Clock size={16} className="text-blue-500 animate-spin"/>,
            'Complete': <Check size={16} className="text-emerald-500"/>,
            'Error': <AlertTriangle size={16} className="text-rose-500"/>
        };
        const textClass = status === 'Complete' ? 'text-zinc-400 line-through' : 'text-zinc-800';

        return (
            <div className="flex justify-between items-center p-4 border border-zinc-100 rounded-lg bg-white group hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                    {icons[status]}
                    <span className={`text-sm font-medium ${textClass}`}>{name}</span>
                </div>
                <button disabled={status === 'Complete'} className="px-3 py-1 bg-zinc-900 text-white rounded-md text-[10px] font-bold uppercase disabled:bg-zinc-300">
                    Execute
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-6 h-full flex flex-col items-center">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Accounting Period Close</h3>
                    <div className="flex justify-center bg-zinc-100 p-1 rounded-lg">
                        {(['Month', 'Quarter', 'Year'] as const).map(p => (
                            <button key={p} onClick={() => setActivePeriod(p)} className={`px-4 py-1.5 rounded text-xs font-bold uppercase ${activePeriod === p ? 'bg-white shadow-sm' : 'text-zinc-500'}`}>
                                {p}-End
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-zinc-500"/>
                            <div>
                                <h4 className="text-sm font-bold text-zinc-900">Current Period: FEB 2024</h4>
                                <p className="text-xs text-zinc-500">Status: OPEN</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-rose-700 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-rose-600 shadow-lg shadow-rose-100">
                            <Shield size={14}/> Close Period
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {tasks[activePeriod].map(task => <TaskItem key={task.id} {...task} />)}
                    {activePeriod === 'Year' && (
                         <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                            <strong>Note:</strong> Year-end close procedures are irreversible and require dual-approval from both Finance and Resource Management leads.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PeriodCloseManager;
