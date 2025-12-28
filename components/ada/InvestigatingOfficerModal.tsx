import React, { useState } from 'react';
import { X, UserCheck, AlertTriangle, Shield, Check } from 'lucide-react';
import { InvestigatingOfficer } from '../../types';
import { MOCK_INVESTIGATING_OFFICERS } from '../../constants';
import Modal from '../shared/Modal';

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

    // FMR Vol 14 Ch 3: Validation logic
    if (!isTrainingValid(selectedIO.fiscalLawTrainingDate)) {
        setError('Ineligible Candidate: Required 3-year Fiscal Law certification has expired.');
        return;
    }

    if (selectedIO.organization === violationOrg) {
        setError('Conflict of Interest: IO must be external to the organization being investigated.');
        return;
    }

    onAppoint({
        ...selectedIO,
        dateAppointed: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <Modal title="Appoint Investigating Officer" subtitle="FMR Volume 14, Chapter 3 Appointment Control" onClose={onClose} maxWidth="max-w-lg">
        <div className="space-y-6">
            <p className="text-xs text-zinc-500 leading-relaxed">
                The Investigating Officer must be senior to the highest ranking individual potentially involved and have current Fiscal Law training.
            </p>
            
            <div className="max-h-64 overflow-y-auto custom-scrollbar border border-zinc-200 rounded-2xl divide-y divide-zinc-50 shadow-inner bg-zinc-50/50">
                {MOCK_INVESTIGATING_OFFICERS.map(io => {
                    const trainingValid = isTrainingValid(io.fiscalLawTrainingDate);
                    const isExternal = io.organization !== violationOrg;
                    const valid = trainingValid && isExternal;

                    return (
                        <button 
                            key={io.id} 
                            onClick={() => handleSelect(io)}
                            className={`w-full text-left p-4 hover:bg-white transition-all flex items-center justify-between group ${selectedIO?.id === io.id ? 'bg-white ring-1 ring-zinc-900 z-10' : ''}`}
                        >
                            <div>
                                <p className={`text-sm font-bold ${valid ? 'text-zinc-800' : 'text-zinc-400'}`}>{io.rank} {io.name}</p>
                                <p className="text-[10px] text-zinc-500 font-medium uppercase mt-0.5">{io.organization} • Training: {io.fiscalLawTrainingDate}</p>
                            </div>
                            {!valid && (
                                <div className="flex gap-1.5">
                                    {!trainingValid && <span className="text-[8px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-100">EXPIRED</span>}
                                    {!isExternal && <span className="text-[8px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-100">COI</span>}
                                </div>
                            )}
                            {valid && selectedIO?.id === io.id && <Check size={16} className="text-emerald-600" />}
                        </button>
                    );
                })}
            </div>

            {selectedIO && (
                <div className="bg-zinc-900 p-5 rounded-2xl text-white shadow-xl animate-in zoom-in duration-200">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Shield size={12} className="text-emerald-400"/> Qualification Verification
                    </h4>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <Check size={14} className="text-emerald-400"/>
                            <span className="text-zinc-200">Mandatory Fiscal Law Training Valid</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <Check size={14} className="text-emerald-400"/>
                            <span className="text-zinc-200">Organization Independence Verified</span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-xs font-bold animate-in slide-in-from-bottom-1">
                    <AlertTriangle size={16} className="shrink-0" />
                    <p className="leading-relaxed">{error}</p>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button onClick={onClose} className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                <button 
                    onClick={handleConfirm} 
                    disabled={!selectedIO}
                    className="px-8 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 disabled:opacity-30 flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                    <UserCheck size={16} /> Execute Appointment
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default InvestigatingOfficerModal;