
import React, { useState, useEffect } from 'react';
import { DisposalAction, RealPropertyAsset } from '../../types';
import Modal from '../shared/Modal';
import { REMIS_THEME } from '../../constants';
import { remisService } from '../../services/RemisDataService';
import { Save, AlertTriangle, Building2, Landmark, ShieldCheck, Database, ArrowRight, Shuffle } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSubmit: (assetId: string, type: DisposalAction['type'], proceeds: number) => void;
    initialData?: DisposalAction;
}

const DisposalActionForm: React.FC<Props> = ({ onClose, onSubmit, initialData }) => {
    const isEditMode = !!initialData;
    const [assetId, setAssetId] = useState(initialData?.assetId || '');
    const [type, setType] = useState<DisposalAction['type']>(initialData?.type || 'Public Sale');
    const [proceeds, setProceeds] = useState<number | ''>(initialData?.estimatedProceeds || '');
    const [eligibleAssets, setEligibleAssets] = useState<RealPropertyAsset[]>([]);
    
    // Checklist for statutory compliance
    const [checklist, setChecklist] = useState({
        isExcess: false,
        noFutureNeed: false,
        contaminationReview: false,
        mviCertified: false
    });

    useEffect(() => {
        if (!isEditMode) {
            setEligibleAssets(remisService.getAssets().filter(a => a.status === 'Active'));
        }
    }, [isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assetId || proceeds === '') return;
        if (!Object.values(checklist).every(Boolean)) {
            alert("Mandatory Screening Check: All compliance attributes must be verified.");
            return;
        }
        onSubmit(assetId, type, Number(proceeds));
    };

    return (
        <Modal title={isEditMode ? "Modify ROE Protocol" : "Establish Report of Excess (ROE)" } subtitle="FMR Vol 12, Chapter 6 Disposal Procedure" onClose={onClose}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in">
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl border border-zinc-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Shuffle size={140}/></div>
                        <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                             <ShieldCheck size={18}/> ROE Gatekeeper
                        </h4>
                        <div className="space-y-8 relative z-10">
                            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                                Declaration of excess property triggers mandatory screening via the GSA "X-Press" portal. All federal agencies will have 30 days to claim the asset before public sale procedures initiate.
                            </p>
                            <div className="space-y-4">
                                {Object.entries(checklist).map(([key, val]) => (
                                    <label key={key} className="flex items-center gap-4 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={val} 
                                            onChange={() => setChecklist(p => ({...p, [key]: !val}))} 
                                            className="w-5 h-5 rounded-lg border-2 border-white/20 bg-transparent text-emerald-500 focus:ring-0 transition-all"
                                        />
                                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${val ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-10">
                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Inventory Asset (RPUID) *</label>
                            <select
                                value={assetId}
                                onChange={e => setAssetId(e.target.value)}
                                className={`w-full border border-zinc-200 rounded-2xl p-4 text-sm font-bold bg-zinc-50/50 focus:bg-white transition-all outline-none shadow-inner ${REMIS_THEME.classes.inputFocus}`}
                                required
                                disabled={isEditMode}
                            >
                                <option value="">Select validated inventory record...</option>
                                {isEditMode && <option value={assetId}>{assetId}</option>}
                                {eligibleAssets.map(a => <option key={a.rpuid} value={a.rpuid}>{a.rpuid} - {a.rpaName}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Statutory Method</label>
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value as any)}
                                    className="w-full border border-zinc-200 rounded-2xl p-4 text-sm font-bold bg-zinc-50/50 focus:bg-white transition-all outline-none shadow-inner"
                                >
                                    <option>Public Sale</option>
                                    <option>Federal Transfer</option>
                                    <option>PBC (Public Benefit Conveyance)</option>
                                    <option>Exchange</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">Estimated Recoupment ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-zinc-400">$</span>
                                    <input
                                        type="number"
                                        value={proceeds}
                                        onChange={e => setProceeds(Number(e.target.value))}
                                        className="w-full border border-zinc-200 rounded-2xl p-4 pl-10 text-xl font-mono font-bold focus:border-rose-400 transition-all outline-none"
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex gap-5 items-start">
                            <AlertTriangle size={24} className="text-rose-600 mt-1 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-rose-900 uppercase tracking-tight">Financial Impact Notice</p>
                                <p className="text-[11px] text-rose-700 leading-relaxed mt-1 font-medium">Declaring excess requires a corresponding adjustment to the "Land & Improvements" or "Building" ledger. Automated accounting logic will trigger upon GSA finalization.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-10 border-t border-zinc-100">
                        <button type="button" onClick={onClose} className="px-8 py-3 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50">Cancel</button>
                        <button type="submit" className={`px-12 py-3 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-3 ${REMIS_THEME.classes.buttonPrimary}`}>
                            <Save size={18} /> {isEditMode ? 'Commit Record Correction' : 'Initiate Statutory Disposal'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default DisposalActionForm;
