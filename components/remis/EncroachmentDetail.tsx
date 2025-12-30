
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ShieldAlert, MapPin, Edit2, Save, Trash2, History, CheckCircle2, UserCheck, Gavel, Plus, Clock } from 'lucide-react';
import { EncroachmentCase, EncroachmentTask, TaskStatus } from '../../types';
import { REMIS_THEME } from '../../constants';
import { remisService } from '../../services/RemisDataService';
import EncroachmentTaskList from './EncroachmentTaskList';
import { useToast } from '../shared/ToastContext';
import RemisAuditTrail from './RemisAuditTrail';

interface Props {
    encroachment: EncroachmentCase;
    onBack: () => void;
    onUpdate: (updated: EncroachmentCase) => void;
}

const EncroachmentDetail: React.FC<Props> = ({ encroachment, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Details' | 'Tasks' | 'History'>('Details');
    const [isEditing, setIsEditing] = useState(false);
    const [editedDesc, setEditedDesc] = useState(encroachment.description);
    const { addToast } = useToast();

    const handleSaveDesc = () => {
        onUpdate({
            ...encroachment,
            description: editedDesc,
            auditLog: [...encroachment.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'RE_SPECIALIST',
                action: 'Narrative Updated',
                details: 'Modified case description for investigation clarity.'
            }]
        });
        setIsEditing(false);
        addToast('Narrative synchronized.', 'success');
    };

    const handleAddTask = () => {
        const newTask: EncroachmentTask = {
            id: `TASK-${Date.now().toString().slice(-4)}`,
            description: 'New Investigative Action Required',
            assignedTo: 'Unassigned',
            status: 'Assigned'
        };
        onUpdate({
            ...encroachment,
            tasks: [...encroachment.tasks, newTask],
            auditLog: [...encroachment.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'RE_SPECIALIST',
                action: 'Task Assigned',
                details: `Added new task: ${newTask.id}`
            }]
        });
        addToast('Investigative task appended.', 'info');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-2 overflow-hidden">
            <div className="bg-white border-b border-zinc-200 px-8 py-6 flex flex-col gap-6 shrink-0 shadow-sm z-10">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-all">
                        <ArrowLeft size={16}/> Back to Queue
                    </button>
                    <div className="flex gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${encroachment.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                            {encroachment.status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-rose-50 text-rose-700 rounded-3xl shadow-inner border border-rose-100 shrink-0"><ShieldAlert size={32}/></div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{encroachment.id}</h2>
                            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-medium">
                                <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded border">Asset: {encroachment.assetId}</span>
                                <span>Type: {encroachment.type}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm min-w-[250px]">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Assigned Official</p>
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-zinc-50 rounded-lg"><UserCheck size={16} className="text-zinc-400"/></div>
                             <span className="text-sm font-bold text-zinc-800">{encroachment.responsibleOfficial}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 border-t border-zinc-100 pt-4 -mb-6">
                    {(['Details', 'Tasks', 'History'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                                activeTab === tab ? 'border-rose-600 text-rose-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-6xl mx-auto space-y-8 pb-20">
                    {activeTab === 'Details' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
                            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm space-y-8">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                        <Edit2 size={18} className="text-zinc-400"/> Incident Narrative
                                    </h4>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-all"><Edit2 size={16}/></button>
                                    ) : (
                                        <button onClick={handleSaveDesc} className="p-2 text-emerald-600 hover:text-emerald-800 transition-all"><Save size={16}/></button>
                                    )}
                                </div>
                                {isEditing ? (
                                    <textarea 
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-3xl p-6 text-sm focus:bg-white focus:border-rose-500 outline-none transition-all h-48 leading-relaxed shadow-inner"
                                        value={editedDesc}
                                        onChange={e => setEditedDesc(e.target.value)}
                                    />
                                ) : (
                                    <p className="text-sm text-zinc-600 leading-relaxed font-serif indent-8">"{encroachment.description}"</p>
                                )}
                            </div>
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
                                    <div className="absolute top-0 right-0 p-8 opacity-5"><MapPin size={100} /></div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-rose-500">
                                        <MapPin size={16}/> Situs Locality
                                    </h4>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Coordinates</p>
                                        <p className="text-xs font-mono text-zinc-300">38.2527° N, 85.7585° W</p>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-medium">Located: {encroachment.locationDescription}</p>
                                </div>
                                <div className="p-8 bg-white border border-zinc-200 rounded-[32px] shadow-sm flex flex-col items-center justify-center text-center gap-4">
                                     <Gavel size={32} className="text-zinc-200"/>
                                     <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Enforcement Status</h5>
                                     <p className="text-xs text-zinc-600 font-medium">Pending District Counsel review for trespass litigation.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Tasks' && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={18} className="text-zinc-400"/> Operational Tasks
                                </h3>
                                <button 
                                    onClick={handleAddTask}
                                    className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-md flex items-center gap-2"
                                >
                                    <Plus size={14}/> Add Investigative Task
                                </button>
                            </div>
                            <EncroachmentTaskList encroachment={encroachment} onUpdate={onUpdate} />
                        </div>
                    )}

                    {activeTab === 'History' && (
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm">
                            <div className="flex justify-between items-center mb-10 border-b border-zinc-50 pb-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <History size={20} className="text-zinc-400"/> Fiduciary Forensic Trail
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                                    <ShieldAlert size={14}/> CASE ACTIVE
                                </div>
                            </div>
                            <RemisAuditTrail log={encroachment.auditLog} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EncroachmentDetail;
