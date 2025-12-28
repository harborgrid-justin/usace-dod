import React from 'react';
import { RealPropertyAsset } from '../../types';
import PageWithHeader from '../shared/PageWithHeader';
import { Trash2, Save, History, Landmark, MapPin } from 'lucide-react';
import RemisAuditTrail from './RemisAuditTrail';
import { formatCurrency } from '../../utils/formatting';

interface Props {
    asset: RealPropertyAsset;
    onBack: () => void;
    onUpdate: (asset: RealPropertyAsset) => void;
}

const RemisAssetDetail: React.FC<Props> = ({ asset, onBack, onUpdate }) => {
    return (
        <PageWithHeader title={asset.rpaName} subtitle={`RPUID: ${asset.rpuid}`} onBack={onBack}>
            <div className="space-y-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Core Accountability Attributes</h4>
                            <div className="grid grid-cols-2 gap-8">
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">CATCODE</p><p className="text-sm font-mono font-bold text-zinc-800">{asset.catcode}</p></div>
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Interest Type</p><p className="text-sm font-bold text-zinc-800">{asset.interestType}</p></div>
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Jurisdiction</p><p className="text-sm font-bold text-zinc-800">{asset.jurisdiction || 'Proprietary'}</p></div>
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Status</p><p className="text-sm font-bold text-emerald-600">{asset.status}</p></div>
                            </div>
                        </div>
                        <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                            <Landmark size={120} className="absolute -right-8 -bottom-8 opacity-5 rotate-12" />
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-emerald-400">Financial Performance</h4>
                            <div className="grid grid-cols-2 gap-8">
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Current Book Value</p><p className="text-2xl font-mono font-bold">{formatCurrency(asset.currentValue)}</p></div>
                                <div><p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Deferred Maintenance</p><p className="text-2xl font-mono font-bold text-rose-400">{formatCurrency(asset.deferredMaintenance)}</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm">
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2"><History size={16} className="text-zinc-400"/> Fiduciary History</h4>
                            <RemisAuditTrail log={asset.auditLog} />
                        </div>
                    </div>
                </div>
            </div>
        </PageWithHeader>
    );
};

export default RemisAssetDetail;