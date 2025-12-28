
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ShieldAlert, MapPin, Edit2, Save } from 'lucide-react';
import { EncroachmentCase } from '../../types';
import { REMIS_THEME } from '../../constants';
import EncroachmentTaskList from './EncroachmentTaskList';

interface Props {
    encroachment: EncroachmentCase;
    onBack: () => void;
    onUpdate: (updated: EncroachmentCase) => void;
}

const EncroachmentDetail: React.FC<Props> = ({ encroachment, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Details' | 'Tasks'>('Details');
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 animate-in slide-in-from-right-2">
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 shrink-0 shadow-sm z-10">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase"><ArrowLeft size={16}/> Back</button>
                    <div className="px-3 py-1 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">
                        {encroachment.status}
                    </div>
                </div>
                <div className="flex gap-8">
                    {['Details', 'Tasks'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t as any)} className={`pb-2 text-xs font-bold uppercase ${activeTab === t ? 'border-b-2 border-zinc-900 text-zinc-900' : 'text-zinc-400'}`}>{t}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'Details' && (
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                        <h4 className="text-sm font-bold mb-4 uppercase tracking-widest">Case Narrative</h4>
                        <p className="text-sm text-zinc-600 leading-relaxed">{encroachment.description}</p>
                    </div>
                )}
                {activeTab === 'Tasks' && <EncroachmentTaskList encroachment={encroachment} onUpdate={onUpdate} />}
            </div>
        </div>
    );
};
export default EncroachmentDetail;
