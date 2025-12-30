
import React from 'react';
import { EncroachmentCase, EncroachmentTask, TaskStatus } from '../../types';
import { CheckSquare, Plus, Trash2, User, Clock, CheckCircle2, Circle } from 'lucide-react';

interface Props {
    encroachment: EncroachmentCase;
    onUpdate: (updated: EncroachmentCase) => void;
}

const EncroachmentTaskList: React.FC<Props> = ({ encroachment, onUpdate }) => {
    const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
        const updatedTasks = encroachment.tasks.map(t => 
            t.id === taskId ? { ...t, status: newStatus } : t
        );
        onUpdate({ 
            ...encroachment, 
            tasks: updatedTasks,
            auditLog: [...encroachment.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'RE_SPECIALIST',
                action: 'Task Status Updated',
                details: `Task ${taskId} moved to ${newStatus}.`
            }]
        });
    };

    const removeTask = (id: string) => {
        onUpdate({ 
            ...encroachment, 
            tasks: encroachment.tasks.filter(t => t.id !== id),
            auditLog: [...encroachment.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'RE_SPECIALIST',
                action: 'Task Excised',
                details: `Task ${id} removed from investigative plan.`
            }]
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            {encroachment.tasks.map(task => (
                <div key={task.id} className="p-6 bg-white border border-zinc-200 rounded-[32px] flex flex-col md:flex-row justify-between items-center shadow-sm group hover:border-rose-300 transition-all">
                    <div className="flex items-center gap-6 flex-1 w-full">
                        <div className={`p-3 rounded-2xl shadow-inner ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-zinc-50 text-zinc-400 border border-zinc-100'}`}>
                            {task.status === 'Completed' ? <CheckCircle2 size={22}/> : <Circle size={22}/>}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">{task.id}</span>
                                <p className={`text-sm font-bold ${task.status === 'Completed' ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>{task.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase">
                                <span className="flex items-center gap-1.5"><User size={12}/> Assigned: {task.assignedTo}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        <select 
                            className="text-[10px] font-bold uppercase bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl outline-none focus:border-zinc-900 transition-all w-full md:w-auto"
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        >
                            <option>Assigned</option>
                            <option>In-Progress</option>
                            <option>Completed</option>
                            <option>Closed</option>
                        </select>
                        <button 
                            onClick={() => removeTask(task.id)}
                            className="p-2.5 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Excise Task"
                        >
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
            ))}
            {encroachment.tasks.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-[40px] bg-white">
                    <CheckSquare size={32} className="mx-auto mb-2 opacity-10" />
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">No active tasks assigned to this case.</p>
                </div>
            )}
        </div>
    );
};

export default EncroachmentTaskList;
