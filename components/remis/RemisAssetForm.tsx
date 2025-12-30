
import React, { useState } from 'react';
import { RealPropertyAsset } from '../../types';
import PageWithHeader from '../shared/PageWithHeader';
import { Save, Database, MapPin, Bookmark } from 'lucide-react';
import { REMIS_THEME } from '../../constants';
import { useToast } from '../shared/ToastContext';

interface Props {
    onClose: () => void;
    onSubmit: (asset: RealPropertyAsset) => void;
    initialData?: RealPropertyAsset | null;
}

const CONTROLLED_CATCODES = ['61050', '21410', '85110', '44220'];

const RemisAssetForm: React.FC<Props> = ({ onClose, onSubmit, initialData }) => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<Partial<RealPropertyAsset>>(initialData || {
        status: 'Active',
        interestType: 'Fee',
        catcode: '61050',
        hasGeo: false,
        acquisitionDate: new Date().toISOString().split('T')[0],
        operationalStatus: 'Operational',
        missionDependency: 'Not Dependent',
        utilizationRate: 100,
        deferredMaintenance: 0,
        jurisdiction: 'Proprietary',
        accountableDistrict: 'LRL',
        custody: 'USACE',
        sourceSystem: 'REMIS_INTRA',
        originatingOrg: 'USACE-HQ'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.rpaName || !formData.installation) {
            addToast('Mandatory fields missing.', 'error');
            return;
        }

        const asset: RealPropertyAsset = {
            ...formData as RealPropertyAsset,
            rpuid: formData.rpuid || `RPUID-${Math.floor(100000 + Math.random() * 900000)}`,
            auditLog: initialData?.auditLog || [{ timestamp: new Date().toISOString(), user: 'CurrentUser', action: 'Record established' }],
            versionHistory: initialData?.versionHistory || []
        };
        onSubmit(asset);
        addToast(initialData ? 'Record synchronized.' : 'Authoritative Record Created.', 'success');
    };

    return (
        <PageWithHeader title={initialData ? "Update Inventory Record" : "Establish Authoritative Record"} onBack={onClose}>
            <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto pb-20 animate-in slide-in-from-bottom-2">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-md flex items-start gap-5 shadow-sm">
                    <Database size={24} className="text-emerald-600 mt-1 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-emerald-900 uppercase tracking-tight">DoDI 4165.14 Schema Validation</p>
                        <p className="text-xs text-emerald-700 leading-relaxed mt-1">Establishment of a Real Property Unique Identifier (RPUID) requires completion of all mandatory attributes to ensure enterprise-wide visibility.</p>
                    </div>
                </div>

                <section className="space-y-6">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3">
                        <Bookmark size={14}/> Part 1: Primary Identification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Asset Name (Authoritative) *</label>
                            <input className="w-full border border-zinc-200 rounded-sm p-3 text-sm focus:border-emerald-600 outline-none transition-all shadow-inner bg-zinc-50 focus:bg-white" value={formData.rpaName || ''} onChange={e => setFormData({...formData, rpaName: e.target.value})} required placeholder="e.g. Building 101 HQ"/>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Installation Code *</label>
                            <input className="w-full border border-zinc-200 rounded-sm p-3 text-sm font-mono focus:border-emerald-600 outline-none shadow-inner bg-zinc-50 focus:bg-white" value={formData.installation || ''} onChange={e => setFormData({...formData, installation: e.target.value})} required placeholder="e.g. KY014"/>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 pt-6 border-t border-zinc-100">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3">
                        <MapPin size={14}/> Part 2: Classification & Authority
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">CATCODE</label>
                            <select className="w-full border border-zinc-200 rounded-sm p-3 text-sm bg-white font-mono outline-none focus:ring-1 focus:ring-emerald-500" value={formData.catcode} onChange={e => setFormData({...formData, catcode: e.target.value})}>
                                {CONTROLLED_CATCODES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Interest Type</label>
                            <select className="w-full border border-zinc-200 rounded-sm p-3 text-sm bg-white outline-none focus:ring-1 focus:ring-emerald-500" value={formData.interestType} onChange={e => setFormData({...formData, interestType: e.target.value as any})}>
                                <option>Fee</option><option>Easement</option><option>Lease In</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Jurisdiction</label>
                            <select className="w-full border border-zinc-200 rounded-sm p-3 text-sm bg-white outline-none focus:ring-1 focus:ring-emerald-500" value={formData.jurisdiction} onChange={e => setFormData({...formData, jurisdiction: e.target.value as any})}>
                                <option>Proprietary</option><option>Exclusive</option><option>Concurrent</option>
                            </select>
                        </div>
                        <div>
                             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Record Status</label>
                             <div className={`px-4 py-2.5 rounded-sm border font-bold text-xs uppercase text-center shadow-inner ${formData.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                {formData.status}
                             </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-8 border-t border-zinc-100 gap-4">
                    <button type="button" onClick={onClose} className="px-6 py-3 border border-zinc-200 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50">Discard</button>
                    <button type="submit" className={`px-10 py-3 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-3 ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Save size={16}/> Publish to Authoritative Store
                    </button>
                </div>
            </form>
        </PageWithHeader>
    );
};

export default RemisAssetForm;
