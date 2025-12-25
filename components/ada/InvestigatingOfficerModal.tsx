
import React, { useState } from 'react';
import { X, UserCheck, AlertTriangle, Shield, Check } from 'lucide-react';
import { InvestigatingOfficer } from '../../types';
import { MOCK_INVESTIGATING_OFFICERS } from '../../constants';

interface Props {
  violationOrg: string;
  onClose: () => void;
  onAppoint: (io: InvestigatingOfficer) => void;
}

const InvestigatingOfficerModal: React.FC<Props> = ({ violationOrg, onClose, onAppoint }) => {
  const [selectedIO, setSelectedIO] = useState<InvestigatingOfficer | null>(null);
  const [error, setError] = useState<string>('');

  const isTrainingValid = (dateStr: string) => {
    const training = new Date(dateStr);
    const today = new Date();
    const diffYears = (today.getTime() - training.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return diffYears <= 3;
  };

  const handleSelect = (io: InvestigatingOfficer) => {
    setSelectedIO(io);
    setError('');
  };

  const handleConfirm = () => {
    if (!selectedIO) return;

    // Business Logic Validation per DoD FMR Vol 14 Ch 3
    if (!isTrainingValid(selectedIO.fiscalLawTrainingDate)) {
        setError('IO cannot be appointed: Fiscal Law training is expired (> 3 years).');
        return;
    }

    if (selectedIO.organization === violationOrg) {
        setError('Conflict of Interest: IO must be from an organization external to the activity being reviewed.');
        return;
    }

    onAppoint({
        ...selectedIO,
        dateAppointed: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                    <Shield size={18} /> Appoint Investigating Officer
                </h3>
                <button onClick={onClose}><X size={18} className="text-zinc-400 hover:text-zinc-800" /></button>
            </div>

            <div className="space-y-4 mb-6">
                <p className="text-xs text-zinc-500">Select a qualified officer from the pool. Candidates must meet independence and training requirements.</p>
                
                <div className="max-h-60 overflow-y-auto custom-scrollbar border border-zinc-100 rounded-lg divide-y divide-zinc-50">
                    {MOCK_INVESTIGATING_OFFICERS.map(io => {
                        const trainingValid = isTrainingValid(io.fiscalLawTrainingDate);
                        const isExternal = io.organization !== violationOrg;
                        const valid = trainingValid && isExternal;

                        return (
                            <button 
                                key={io.id} 
                                onClick={() => handleSelect(io)}
                                className={`w-full text-left p-3 hover:bg-zinc-50 transition-colors flex items-center justify-between ${selectedIO?.id === io.id ? 'bg-zinc-100' : ''}`}
                            >
                                <div>
                                    <p className={`text-sm font-bold ${valid ? 'text-zinc-800' : 'text-zinc-400'}`}>{io.rank} {io.name}</p>
                                    <p className="text-[10px] text-zinc-500">{io.organization} • Training: {io.fiscalLawTrainingDate}</p>
                                </div>
                                {!valid && (
                                    <div className="flex gap-1">
                                        {!trainingValid && <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">Expired</span>}
                                        {!isExternal && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Conflict</span>}
                                    </div>
                                )}
                                {valid && selectedIO?.id === io.id && <Check size={16} className="text-emerald-600" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedIO && (
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-6">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3">Qualification Check</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                            {isTrainingValid(selectedIO.fiscalLawTrainingDate) ? <Check size={14} className="text-emerald-500"/> : <X size={14} className="text-rose-500"/>}
                            <span className="text-zinc-700">Fiscal Law Training Current (3 Years)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            {selectedIO.organization !== violationOrg ? <Check size={14} className="text-emerald-500"/> : <X size={14} className="text-rose-500"/>}
                            <span className="text-zinc-700">External to Organization ({violationOrg})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            {!selectedIO.hasConflict ? <Check size={14} className="text-emerald-500"/> : <X size={14} className="text-rose-500"/>}
                            <span className="text-zinc-700">Free of Personal Impairments</span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-700 text-xs font-medium animate-in fade-in">
                    <AlertTriangle size={14} /> {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button onClick={onClose} className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                <button 
                    onClick={handleConfirm} 
                    disabled={!selectedIO}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <UserCheck size={14} /> Confirm Appointment
                </button>
            </div>
        </div>
    </div>
  );
};

export default InvestigatingOfficerModal;
