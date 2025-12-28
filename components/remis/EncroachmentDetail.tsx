import React, { useState, useMemo } from 'react';
import { 
    ArrowLeft, ShieldAlert, MapPin, Calendar, User, 
    CheckSquare, Plus, FileText, Activity, Save, 
    Edit2, Clock, CheckCircle2, AlertTriangle, 
    ChevronRight, ChevronDown, Trash2, Database,
    Camera, MessageSquare, ShieldCheck, History, X
} from 'lucide-react';
import { EncroachmentCase, EncroachmentTask, WorkActivity, EncroachmentStatus, TaskStatus } from '../../types';
import Modal from '../shared/Modal';
import RemisAuditTrail from './RemisAuditTrail';
import { REMIS_THEME } from '../../constants';

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
    
    // Sub-navigation for Task Details
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        description: encroachment.description,
        responsibleOfficial: encroachment.responsibleOfficial,
        locationDescription: encroachment.locationDescription
    });

    const [activityText, setActivityText] = useState('');

    const handleAddTask = () => {
        if (!newTaskDesc || !newTaskAssignee) return;
        const newTask: EncroachmentTask = {
            id: `TASK-${Date.now().toString().slice(-4)}`,
            description: newTaskDesc,
            assignedTo: newTaskAssignee,
            status: 'Assigned',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            activities: []
        };
        onUpdate({
            ...encroachment,
            tasks: [...encroachment.tasks, newTask],
            auditLog: [...encroachment.auditLog, { 
                timestamp: new Date().toISOString(), 
                user: 'CurrentUser', 
                action: 'Task Generated', 
                details: `Task assigned to ${newTaskAssignee}: ${newTaskDesc}` 
            }]
        });
        setIsTaskModalOpen(false);
        setNewTaskDesc('');
        setNewTaskAssignee('');
    };

    const handleDeleteTask = (taskId: string) => {
        if (!confirm("Are you sure you want to remove this investigation task? This action is audited.")) return;
        const updatedTasks = encroachment.tasks.filter(t => t.id !== taskId);
        onUpdate({
            ...encroachment,
            tasks: updatedTasks,
            auditLog: [...encroachment.auditLog, { 
                timestamp: new Date().toISOString(), 
                user: 'CurrentUser', 
                action: 'Task Deleted', 
                details: `Task ${taskId} removed from case.` 
            }]
        });
        if (selectedTaskId === taskId) setSelectedTaskId(null);
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
    };

    const handleDeleteActivity = (taskId: string, activityId: string) => {
        const updatedTasks = encroachment.tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, activities: t.activities.filter(a => a.id !== activityId) };
            }
            return t;
        });
        onUpdate({ ...encroachment, tasks: updatedTasks });
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
            auditLog: [...encroachment.auditLog, { 
                timestamp: new Date().toISOString(), 
                user: 'CurrentUser', 
                action: 'Master Record Update', 
                details: 'Core case attributes modified by authorized user.' 
            }]
        });
        setIsEditing(false);
    };

    const taskStats = useMemo(() => {
        const total = encroachment.tasks.length;
        const closed = encroachment.tasks.filter(t => t.status === 'Closed' || t.status === 'Verified').length;
        return { total, closed, progress: total > 0 ? (closed / total) * 100 : 0 };
    }, [encroachment.tasks]);

    const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
        const colors = {
            'Assigned': 'bg-blue-50 text-blue-700 border-blue-100',
            'In-Progress': 'bg-amber-50 text-amber-700 border-amber-100',
            'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Blocked': 'bg-rose-50 text-rose-700 border-rose-100',
            'Verified': 'bg-purple-50 text-purple-700 border-purple-100',
            'Closed': 'bg-zinc-100 text-zinc-500 border-zinc-200'
        };
        // @ts-ignore
        return <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border whitespace-nowrap ${colors[status] || 'bg-zinc-100'}`}>{status}</span>;
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-2">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 shrink-0 shadow-sm z-10">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-all">
                        <ArrowLeft size={16}/> Back to Inventory
                    </button>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
                            <ShieldAlert size={14} className="text-rose-500"/> {encroachment.status}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-[24px] ${REMIS_THEME.classes.iconContainer} text-rose-600 shadow-inner border border-rose-100 shrink-0`}>
                            <ShieldAlert size={32}/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">{encroachment.id}</h2>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-2">
                                {encroachment.type} Breach • RPUID: <span className="font-mono text-zinc-900">{encroachment.assetId}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-white border border-zinc-200 rounded-[24px] p-5 shadow-sm min-w-[180px] text-center">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Discovery Date</p>
                            <p className="text-lg font-mono font-bold text-zinc-900">{encroachment.discoveryDate}</p>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-[24px] p-5 shadow-inner min-w-[180px] text-center">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Task Resolution</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-lg font-mono font-bold text-zinc-900">{taskStats.closed}/{taskStats.total}</span>
                                <div className="h-1.5 w-12 bg-zinc-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${taskStats.progress}%`}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-8 -mb-6">
                    {(['Details', 'Tasks', 'History'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] border-b-2 transition-all ${
                                activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    
                    {activeTab === 'Details' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><FileText size={140}/></div>
                                    <div className="flex justify-between items-center mb-8 border-b border-zinc-50 pb-4">
                                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                            <Database size={18} className="text-zinc-400"/> Case Narrative & Location
                                        </h4>
                                        <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-zinc-50 rounded-xl transition-all text-zinc-400 hover:text-zinc-900">
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Incident Description</label>
                                            {isEditing ? (
                                                <textarea 
                                                    value={editForm.description} 
                                                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-5 text-sm leading-relaxed focus:bg-white focus:border-rose-600 transition-all outline-none h-40"
                                                />
                                            ) : (
                                                <p className="text-base text-zinc-800 leading-relaxed indent-8 p-6 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
                                                    {encroachment.description}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-zinc-600">
                                                    <div className="p-2 bg-zinc-100 rounded-lg"><MapPin size={16}/></div>
                                                    <div>
                                                        <p className="text-[9px] font-bold text-zinc-400 uppercase">Situs Location</p>
                                                        {isEditing ? (
                                                            <input className="text-sm font-bold text-zinc-900 border-b border-zinc-200 outline-none w-full" value={editForm.locationDescription} onChange={e => setEditForm({...editForm, locationDescription: e.target.value})} />
                                                        ) : (
                                                            <p className="text-sm font-bold text-zinc-900">{encroachment.locationDescription}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-zinc-600">
                                                    <div className="p-2 bg-zinc-100 rounded-lg"><User size={16}/></div>
                                                    <div>
                                                        <p className="text-[9px] font-bold text-zinc-400 uppercase">Responsible Official</p>
                                                        {isEditing ? (
                                                            <input className="text-sm font-bold text-zinc-900 border-b border-zinc-200 outline-none w-full" value={editForm.responsibleOfficial} onChange={e => setEditForm({...editForm, responsibleOfficial: e.target.value})} />
                                                        ) : (
                                                            <p className="text-sm font-bold text-zinc-900">{encroachment.responsibleOfficial}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div className="flex items-end justify-end">
                                                    <button onClick={handleSaveEdits} className="px-8 py-3 bg-rose-700 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-800 shadow-xl transition-all active:scale-95 flex items-center gap-2">
                                                        <Save size={16}/> Save Changes
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] border border-zinc-800">
                                     <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                     <MapPin size={48} className="text-rose-500 mb-4 animate-bounce" />
                                     <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-center">GIS Context Preview</h4>
                                     <p className="text-[10px] text-zinc-500 mt-2 text-center uppercase tracking-widest font-bold">SDSVIE 4.0 Compliant Layer</p>
                                     <button className="mt-8 px-6 py-2.5 bg-white text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-xl">Launch GIS Workbench</button>
                                </div>
                                <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm">
                                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Camera size={16} className="text-zinc-400"/> Evidentiary Photos</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="aspect-square bg-zinc-100 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer group">
                                            <Plus size={20} className="group-hover:scale-110 transition-transform"/>
                                        </div>
                                        <div className="aspect-square bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-center text-[8px] font-bold text-zinc-400 uppercase text-center px-2">No Visual Evidence Uploaded</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Tasks' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
                            <div className="lg:col-span-4 flex flex-col bg-white border border-zinc-200 rounded-[40px] shadow-sm overflow-hidden min-h-[500px]">
                                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                        <CheckSquare size={16} className="text-zinc-400"/> Work Management
                                    </h4>
                                    <button onClick={() => setIsTaskModalOpen(true)} className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-lg">
                                        <Plus size={16}/>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                    {encroachment.tasks.map(task => (
                                        <div key={task.id} className="relative group">
                                            <button 
                                                onClick={() => setSelectedTaskId(task.id)}
                                                className={`w-full text-left p-4 rounded-3xl border transition-all ${
                                                    selectedTaskId === task.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.02] z-10' : 'bg-white border-zinc-200 hover:border-zinc-300'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <TaskStatusBadge status={task.status} />
                                                    <span className={`text-[9px] font-mono font-bold ${selectedTaskId === task.id ? 'text-zinc-500' : 'text-zinc-400'}`}>ID: {task.id.split('-').pop()}</span>
                                                </div>
                                                <p className="text-xs font-bold leading-tight mb-3 line-clamp-2">{task.description}</p>
                                                <div className={`flex justify-between items-center pt-3 border-t ${selectedTaskId === task.id ? 'border-white/10' : 'border-zinc-50'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center text-[8px] font-bold text-zinc-500 uppercase">{task.assignedTo.charAt(0)}</div>
                                                        <span className="text-[10px] font-medium">{task.assignedTo}</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono opacity-60">{task.dueDate}</span>
                                                </div>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                                                className="absolute -top-1 -right-1 p-1.5 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 hover:scale-110"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    {encroachment.tasks.length === 0 && (
                                        <div className="p-12 text-center text-zinc-400">
                                            <p className="text-xs font-bold uppercase tracking-widest">No Active Tasks</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                {selectedTaskId ? (
                                    <div className="bg-white border border-zinc-200 rounded-[40px] p-8 shadow-sm flex flex-col flex-1 animate-in slide-in-from-right-2">
                                        {encroachment.tasks.filter(t => t.id === selectedTaskId).map(task => (
                                            <div key={task.id} className="space-y-8 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start border-b border-zinc-50 pb-6">
                                                    <div>
                                                        <h5 className="text-xl font-bold text-zinc-900">{task.description}</h5>
                                                        <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Assigned To: {task.assignedTo} • Due: {task.dueDate}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <select 
                                                            className="text-[10px] font-bold uppercase bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-rose-200"
                                                            value={task.status}
                                                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)}
                                                        >
                                                            <option>Assigned</option>
                                                            <option>In-Progress</option>
                                                            <option>Completed</option>
                                                            <option>Blocked</option>
                                                            <option>Verified</option>
                                                            <option>Closed</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                                                    <div>
                                                        <h6 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <Activity size={14}/> Activity Log & Finite Details
                                                        </h6>
                                                        <div className="space-y-3">
                                                            {task.activities.map(act => (
                                                                <div key={act.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex gap-4 group/act">
                                                                    <div className="p-2 bg-white rounded-xl shadow-sm h-fit"><MessageSquare size={14} className="text-zinc-400"/></div>
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-center mb-1">
                                                                            <span className="text-[10px] font-bold text-zinc-900">{act.performedBy}</span>
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-[9px] font-mono text-zinc-400">{act.date}</span>
                                                                                <button onClick={() => handleDeleteActivity(task.id, act.id)} className="opacity-0 group-hover/act:opacity-100 transition-opacity text-rose-500">
                                                                                    <Trash2 size={12}/>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-xs text-zinc-600 leading-relaxed">{act.description}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-zinc-100 flex gap-2">
                                                    <input 
                                                        value={activityText}
                                                        onChange={e => setActivityText(e.target.value)}
                                                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-3 text-xs focus:bg-white focus:border-zinc-900 transition-all outline-none shadow-inner"
                                                        placeholder="Post activity update or note..."
                                                        onKeyDown={e => e.key === 'Enter' && handleLogActivity(task.id)}
                                                    />
                                                    <button onClick={() => handleLogActivity(task.id)} className="p-3 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 shadow-lg active:scale-95 transition-all">
                                                        <Plus size={20}/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 bg-zinc-50/50 border border-zinc-200 border-dashed rounded-[40px] flex flex-col items-center justify-center text-zinc-400 gap-4">
                                        <div className="p-8 bg-white rounded-full shadow-sm border border-zinc-100"><CheckSquare size={48} className="opacity-10"/></div>
                                        <p className="text-sm font-bold uppercase tracking-widest">Select a task for details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'History' && (
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm animate-in fade-in">
                            <div className="flex justify-between items-center mb-8 border-b border-zinc-50 pb-4">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <History size={18} className="text-zinc-400"/> Forensic Investigation Trail
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                    <ShieldCheck size={14}/> RECORD AUTHENTICATED
                                </div>
                            </div>
                            <RemisAuditTrail log={encroachment.auditLog} />
                        </div>
                    )}
                </div>
            </div>

            {isTaskModalOpen && (
                <Modal title="Establish Investigation Task" subtitle="FMR Compliant Workflow Step" onClose={() => setIsTaskModalOpen(false)}>
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                            <Clock size={18} className="text-blue-600 shrink-0 mt-0.5"/>
                            <p className="text-xs text-blue-800 leading-relaxed">Investigation tasks are audited. Ensure descriptions contain sufficient regulatory context for the assigned official.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Task Rationale / Requirement</label>
                                <textarea 
                                    value={newTaskDesc} 
                                    onChange={e => setNewTaskDesc(e.target.value)} 
                                    className="w-full mt-1.5 border border-zinc-200 rounded-2xl p-4 text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 transition-all outline-none resize-none h-32"
                                    placeholder="e.g. Conduct field survey of North boundary..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Responsible Agent / Specialist</label>
                                <input 
                                    type="text" 
                                    value={newTaskAssignee} 
                                    onChange={e => setNewTaskAssignee(e.target.value)} 
                                    className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 transition-all outline-none"
                                    placeholder="Name or Service Code"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-6 border-t border-zinc-100 gap-3">
                            <button onClick={() => setIsTaskModalOpen(false)} className="px-6 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold uppercase text-zinc-500 hover:bg-zinc-50 transition-all">Cancel</button>
                            <button onClick={handleAddTask} className="px-8 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 shadow-xl transition-all active:scale-95">Commit Task</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default EncroachmentDetail;
