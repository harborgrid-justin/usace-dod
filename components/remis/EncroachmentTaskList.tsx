
import React, { useState } from 'react';
import { EncroachmentCase, EncroachmentTask, TaskStatus } from '../../types';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

interface Props {
    encroachment: EncroachmentCase;
    onUpdate: (updated: EncroachmentCase) => void;
}

const EncroachmentTaskList: React.FC<Props> = ({ encroachment, onUpdate }) => {
    const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
        const updatedTasks = encroachment.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
        onUpdate({ ...encroachment, tasks: updatedTasks });
    };

    const removeTask = (id: string) => {
        onUpdate({ ...encroachment, tasks: encroachment.tasks.filter(t => t.id !== id) });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <CheckSquare size={16} /> Work Management
                </h4>
                <button className="p-2 bg-zinc-900 text-white rounded-lg"><Plus size={16}/></button>
            </div>
            {encroachment.tasks.map(task => (
                <div key={task.id} className="p-4 bg-white border border-zinc-200 rounded-2xl flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-sm font-bold text-zinc-800">{task.description}</p>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">Assigned: {task.assignedTo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            className="text-[10px] font-bold uppercase bg-zinc-100 p-2 rounded-lg"
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        >
                            <option>Assigned</option><option>In-Progress</option><option>Completed</option><option>Closed</option>
                        </select>
                        <button onClick={() => removeTask(task.id)} className="text-rose-500"><Trash2 size={14}/></button>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default EncroachmentTaskList;
