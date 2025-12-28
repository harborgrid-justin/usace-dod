import React, { useState, useEffect } from 'react';
import { RelocationCase, RealPropertyAsset } from '../../types';
import { REMIS_THEME } from '../../constants';
import { remisService } from '../../services/RemisDataService';
import PageWithHeader from '../shared/PageWithHeader';

interface Props {
    onClose: () => void;
    onSubmit: (c: RelocationCase) => void;
}

const RelocationCaseForm: React.FC<Props> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<RelocationCase>>({
        status: 'Initiated',
        eligibilityStatus: 'Pending',
        initiationDate: new Date().toISOString().split('T')[0]
    });
    const [assets, setAssets] = useState<RealPropertyAsset[]>([]);

    useEffect(() => {
        setAssets(remisService.getAssets());
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { assetId, displacedPersonName, displacedEntityType, initiationDate } = formData;
        if (!assetId || !displacedPersonName || !displacedEntityType || !initiationDate) return;

        const newCase: RelocationCase = {
            id: `REL-${Date.now().toString().slice(-5)}`,
            assetId,
            displacedPersonName,
            displacedEntityType,
            eligibilityStatus: 'Pending',
            status: 'Initiated',
            initiationDate,
            benefits: [],
            auditLog: [{
                timestamp: new Date().toISOString(),
                user: 'REMIS_MGR',
                action: 'Case Initiated'
            }],
            linkedRecords: {}
        };
        onSubmit(newCase);
    };

    return (
        <PageWithHeader title="Initiate New Relocation Case" onBack={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Displacing Asset (RPUID)</label>
                    <select
                        className="w-full mt-1 border rounded p-2 text-sm bg-white"
                        required
                        value={formData.assetId || ''}
                        onChange={e => setFormData({ ...formData, assetId: e.target.value })}
                    >
                        <option value="">Select Asset...</option>
                        {assets.map(a => <option key={a.rpuid} value={a.rpuid}>{a.rpuid} - {a.rpaName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Displaced Person/Entity Name</label>
                    <input
                        className="w-full mt-1 border rounded p-2 text-sm"
                        value={formData.displacedPersonName || ''}
                        onChange={e => setFormData({ ...formData, displacedPersonName: e.target.value })}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Entity Type</label>
                        <select
                            className="w-full mt-1 border rounded p-2 text-sm bg-white"
                            value={formData.displacedEntityType || ''}
                            onChange={e => setFormData({ ...formData, displacedEntityType: e.target.value as any })}
                            required
                        >
                            <option value="">Select...</option>
                            <option>Individual</option>
                            <option>Business</option>
                            <option>Non-Profit</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Initiation Date</label>
                        <input
                            type="date"
                            className="w-full mt-1 border rounded p-2 text-sm"
                            value={formData.initiationDate || ''}
                            onChange={e => setFormData({ ...formData, initiationDate: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button type="submit" className={`px-4 py-2 text-white rounded-lg text-xs font-bold uppercase ${REMIS_THEME.classes.buttonPrimary}`}>
                        Create Case
                    </button>
                </div>
            </form>
        </PageWithHeader>
    );
};

export default RelocationCaseForm;
