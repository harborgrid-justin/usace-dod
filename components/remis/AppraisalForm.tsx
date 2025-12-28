import React, { useState, useEffect, useMemo } from 'react';
import { AppraisalRecord, AppraisalStandard, RealPropertyAsset } from '../../types';
import Modal from '../shared/Modal';
import { Save, AlertTriangle, ShieldCheck, Database, Landmark } from 'lucide-react';
import { remisService } from '../../services/RemisDataService';
import { REMIS_THEME } from '../../constants';

interface Props {
    onClose: () => void;
    onSubmit: (record: AppraisalRecord) => void;
}

const AppraisalForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const assets = remisService.getAssets();
    const [formData, setFormData] = useState<Partial<AppraisalRecord>>({
        status: 'Initiated',
        standard: 'Yellow Book (UASFLA)',
        valuationDate: new Date().toISOString().split('T')[0],
        limitingConditions: [],
        extraordinaryAssumptions: []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.assetId || !formData.appraiserName) return;

        const record: AppraisalRecord = {
            id: '', 
            assetId: formData.assetId,
            status: 'Initiated',
            standard: formData.standard as AppraisalStandard,
            valuationDate: formData.valuationDate!,
            appraiserName: formData.appraiserName!,
            appraiserQualifications: formData.appraiserQualifications || 'Certified General',
            purpose: formData.purpose || 'Statutory Fair Market Value Assessment',
            scope: formData.scope || 'Full Narrative Report',
            marketValue: Number(formData.marketValue) || 0,
            limitingConditions: formData.limitingConditions || [],
            extraordinaryAssumptions: formData.extraordinaryAssumptions || [],
            revisions: [],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'CurrentUser',
                action: 'Initialization',
                details: 'Valuation requirement established.'
            }]
        };
        onSubmit(record);
    };

    return (
        <Modal title="Initiate Appraisal Requirement" subtitle="Standard Record Establishment (Req 3.1)" onClose={onClose} maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl flex items-start gap-4">
                    <ShieldCheck size={24} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">Authoritative Standards (Yellow Book)</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">Establishing this record satisfies mandatory UASFLA reporting per 49 CFR Part 24. All protection protocols for PII and valuation data will be applied.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Target Asset (RPUID) *</label>
                        <select 
                            className="w-full border border-zinc-200 rounded-xl p-3 text-sm bg-white focus:border-rose-400 focus:ring-1 focus:ring-rose-200 outline-none transition-all"
                            value={formData.assetId || ''}
                            onChange={e => setFormData({...formData, assetId: e.target.value})}
                            required
                        >
                            <option value="">Select validated asset...</option>
                            {assets.map(a => <option key={a.rpuid} value={a.rpuid}>{a.rpuid} - {a.rpaName}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Valuation Date</label>
                        <input type="date" className="w-full border border-zinc-200 rounded-xl p-3 text-sm focus:border-rose-400 outline-none" value={formData.valuationDate} onChange={e => setFormData({...formData, valuationDate: e.target.value})} required />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Assigned Appraiser *</label>
                        <input className="w-full border border-zinc-200 rounded-xl p-3 text-sm focus:border-rose-400 outline-none" value={formData.appraiserName || ''} onChange={e => setFormData({...formData, appraiserName: e.target.value})} required placeholder="e.g. Sterling, James (MAI)"/>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Standard Method</label>
                        <select className="w-full border border-zinc-200 rounded-xl p-3 text-sm bg-white focus:border-rose-400 outline-none" value={formData.standard} onChange={e => setFormData({...formData, standard: e.target.value as any})}>
                            <option>Yellow Book (UASFLA)</option>
                            <option>USPAP</option>
                        </select>
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                    <Database size={100} className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity"/>
                    <div className="relative z-10 space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 text-emerald-400">
                             <Landmark size={18}/> Preliminary Fair Value Estimation
                        </h4>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">Estimated Market Value ($)</label>
                            <input 
                                type="number" 
                                className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-xl font-mono font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                value={formData.marketValue || ''}
                                onChange={e => setFormData({...formData, marketValue: Number(e.target.value)})}
                                placeholder="0.00"
                            />
                            <p className="text-[9px] text-zinc-500 mt-3 italic flex items-center gap-2">
                                <AlertTriangle size={12}/> Disclosure protection will be enforced automatically.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="submit" className={`px-8 py-3 text-white rounded-2xl text-[11px] font-bold uppercase shadow-xl transition-all active:scale-95 ${REMIS_THEME.classes.buttonPrimary}`}>
                        Commit Authoritative Record
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AppraisalForm;