import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, MapPin, Calendar, User, CheckSquare, Plus, FileText, Activity, Save, Edit2 } from 'lucide-react';
import { EncroachmentCase, EncroachmentTask, WorkActivity, EncroachmentStatus, TaskStatus } from '../../types';
import Modal from '../shared/Modal';

interface Props {
    encroachment: EncroachmentCase;
    onBack: () => void;
    onUpdate: (updated: EncroachmentCase) => void;
}

const EncroachmentDetail: React.FC<Props> = ({ encroachment, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Details' | 'Tasks' | 'History'>('Details');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        description: encroachment.description,
        responsibleOfficial: encroachment.responsibleOfficial,
        locationDescription: encroachment.locationDescription
    });

    // Activity Log State
    const [activityText, setActivityText] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const handleAddTask = () => {
        if (!newTaskDesc || !newTaskAssignee) return;
        const newTask: EncroachmentTask = {
            id: `T-${Date.now()}`,
            description: newTaskDesc,
            assignedTo: newTaskAssignee,
            status: 'Assigned',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            activities: []
        };
        onUpdate({
            ...encroachment,
            tasks: [...encroachment.tasks, newTask],
            auditLog: [...encroachment.auditLog, { timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Task Created', details: newTaskDesc }]
        });
        setIsTaskModalOpen(false);
        setNewTaskDesc('');
        setNewTaskAssignee('');
    };

    const handleLogActivity = (taskId: string) => {
        if (!activityText) return;
        const newActivity: WorkActivity = {
            id: `ACT-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: activityText,
            performedBy: 'CurrentUser'
        };

        const updatedTasks = encroachment.tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, activities: [newActivity, ...t.activities] };
            }
            return t;
        });

        onUpdate({ ...encroachment, tasks: updatedTasks });
        setActivityText('');
        setSelectedTaskId(null);
    };

    const handleStatusChange = (newStatus: EncroachmentStatus) => {
        onUpdate({
            ...encroachment,
            status: newStatus,
            auditLog: [...encroachment.auditLog, { timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Status Change', details: newStatus }]
        });
    };

    const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
        const updatedTasks = encroachment.tasks.map(t => 
            t.id === taskId ? { ...t, status: newStatus } : t
        );
        onUpdate({ ...encroachment, tasks: updatedTasks });
    };

    const handleSaveEdits = () => {
        onUpdate({
            ...encroachment,
            description: editForm.description,
            responsibleOfficial: editForm.responsibleOfficial,
            locationDescription: editForm.locationDescription,
            auditLog: [...encroachment.auditLog, { timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Case Updated', details: 'Updated details' }]
        });
        setIsEditing(false);
    };

    const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
        const colors = {
            'Assigned': 'bg-blue-50 text-blue-700',
            'In-Progress': 'bg-amber-50 text-amber-700',
            'Completed': 'bg-emerald-50 text-emerald-700',
            'Blocked': 'bg-rose-50 text-rose-700',
            'Verified': 'bg-purple-50 text-purple-700',
            'Closed': 'bg-zinc-100 text-zinc-500'
        };
        // @ts-ignore
        return <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${colors[status] || 'bg-zinc-100'}`}>{status}</span>;
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-4 flex flex-col gap-4 flex-shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase w-fit">
                    <ArrowLeft size={14}/> Back to List
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 shrink-0">
                            <ShieldAlert size={24}/>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-xl font-bold text-zinc-900">{encroachment.id}</h2>
                                <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 border border-zinc-200 uppercase">{encroachment.status}</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 truncate">{encroachment.type} • {encroachment.locationDescription}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Discovery Date</p>
                            <p className="text-sm font-mono font-bold text-zinc-900">{encroachment.discoveryDate}</p>
                         </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6 border-b border-zinc-200 bg-white flex gap-6">
                <button onClick={() => setActiveTab('Details')} className={`py-3 text-sm font-bold border-b-2 ${activeTab === 'Details' ? 'border-zinc-800 text-zinc-800' : 'border-transparent text-zinc-400'}`}>Details</button>
                <button onClick={() => setActiveTab('Tasks')} className={`py-3 text-sm font-bold border-b-2 ${activeTab === 'Tasks' ? 'border-zinc-800 text-zinc-800' : 'border-transparent text-zinc-400'}`}>Tasks</button>
                <button onClick={() => setActiveTab('History')} className={`py-3 text-sm font-bold border-b-2 ${activeTab === 'History' ? 'border-zinc-800 text-zinc-800' : 'border-transparent text-zinc-400'}`}>History</button>
            </div>


            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                {activeTab === 'Details' && (
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={14} className="text-zinc-400"/> Case Information
                            </h4>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-zinc-400 hover:text-zinc-600">
                                    <Edit2 size={14}/>
                                </button>
                            ) : (
                                <button onClick={handleSaveEdits} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-[10px] font-bold uppercase">
                                    <Save size={14}/> Save Changes
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Description</label>
                                    {isEditing ? (
                                        <textarea 
                                            value={editForm.description} 
                                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                                            className="w-full mt-1 border rounded p-2 text-sm bg-zinc-50 h-24"
                                        />
                                    ) : (
                                        <p className="text-sm text-zinc-800 bg-zinc-50 p-3 rounded-lg border border-zinc-100 leading-relaxed mt-1">
                                            {encroachment.description}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                                        <MapPin size={14} className="text-zinc-400"/>
                                        {isEditing ? (
                                            <input 
                                                value={editForm.locationDescription} 
                                                onChange={e => setEditForm({...editForm, locationDescription: e.target.value})}
                                                className="border rounded p-1 text-xs w-full"
                                            />
                                        ) : (
                                            <span>{encroachment.locationDescription}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                                        <User size={14} className="text-zinc-400"/>
                                        {isEditing ? (
                                            <input 
                                                value={editForm.responsibleOfficial} 
                                                onChange={e => setEditForm({...editForm, responsibleOfficial: e.target.value})}
                                                className="border rounded p-1 text-xs w-full"
                                                placeholder="Responsible Official"
                                            />
                                        ) : (
                                            <span>POC: {encroachment.responsibleOfficial}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-100 rounded-lg flex items-center justify-center min-h-[150px] border-2 border-dashed border-zinc-200">
                                <span className="text-xs font-bold text-zinc-400 flex items-center gap-2"><MapPin size={16}/> GIS Map Context</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Tasks' && (
                     <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                         <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                <CheckSquare size={14} className="text-zinc-400"/> Work Management Tasks
                            </h4>
                            <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-1 text-[10px] font-bold uppercase bg-zinc-900 text-white px-3 py-1.5 rounded hover:bg-zinc-800">
                                <Plus size={12}/> Add Task
                            </button>
                        </div>
                     </div>
                )}
                
                {activeTab === 'History' && (
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Audit History</h4>
                    </div>
                )}

            </div>

            {isTaskModalOpen && (
                <Modal title="Add Encroachment Task" onClose={() => setIsTaskModalOpen(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Description</label>
                            <input type="text" value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Assignee</label>
                            <input type="text" value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)} className="w-full mt-1 border rounded p-2 text-sm" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={handleAddTask} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase">Add Task</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default EncroachmentDetail;
