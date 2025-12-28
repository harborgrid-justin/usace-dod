import React, { useState, useEffect, useMemo } from 'react';
import { DisposalAction, RealPropertyAsset } from '../../types';
import Modal from '../shared/Modal';
import { REMIS_THEME } from '../../constants';
import { remisService } from '../../services/RemisDataService';
import { Save, AlertTriangle, Building2 } from 'lucide-react';

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

    useEffect(() => {
        if (!isEditMode) {
            setEligibleAssets(remisService.getAssets().filter(a => a.status === 'Active'));
        }
    }, [isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assetId || proceeds === '') return;
        onSubmit(assetId, type, Number(proceeds));
    };

    return (
        <Modal title={isEditMode ? "Edit Disposal Logic" : "Declare Excess Real Property"} onClose={onClose} maxWidth="max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Inventory Record (RPUID)</label>
                        <select
                            value={assetId}
                            onChange={e => setAssetId(e.target.value)}
                            className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm bg-zinc-50 focus:bg-white focus:border-rose-400 focus:ring-1 focus:ring-rose-200 transition-all outline-none"
                            required
                            disabled={isEditMode}
                        >
                            <option value="">Select a validated asset...</option>
                            {isEditMode && <option value={assetId}>{assetId}</option>}
                            {eligibleAssets.map(a => <option key={a.rpuid} value={a.rpuid}>{a.rpuid} - {a.rpaName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Authorized Method</label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value as any)}
                            className="w-full mt-1 border border-zinc-200 rounded-xl p-3 text-sm bg-zinc-50 focus:bg-white focus:border-rose-400 focus:ring-1 focus:ring-rose-200 transition-all outline-none"
                        >
                            <option>Public Sale</option>
                            <option>Federal Transfer</option>
                            <option>PBC</option>
                            <option>Exchange</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Est. Proceeds (Market Fair Value)</label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono italic text-xs">$</span>
                            <input
                                type="number"
                                value={proceeds}
                                onChange={e => setProceeds(Number(e.target.value))}
                                className="w-full border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-sm font-mono font-bold focus:border-rose-400 focus:ring-1 focus:ring-rose-200 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-800 text-[10px] leading-relaxed italic">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>Statutory Note: A "Report of Excess" (ROE) triggers GSA screening per FMR Vol 12. Changes in status will be audited.</span>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 border border-zinc-200 rounded-xl text-xs font-bold uppercase text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" className={`px-6 py-2.5 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-emerald-900/10 ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Save size={14} className="inline mr-2" /> {isEditMode ? 'Update Action' : 'Initiate ROE'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default DisposalActionForm;