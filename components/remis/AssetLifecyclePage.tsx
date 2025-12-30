
import React, { useState } from 'react';
import { ArrowLeft, Building2, Save, History, CheckCircle2 } from 'lucide-react';
import { RealPropertyAsset } from '../../types';
import { REMIS_THEME } from '../../constants';
import LifecycleGeneral from './lifecycle/LifecycleGeneral';
import LifecycleFinancials from './lifecycle/LifecycleFinancials';
import LifecycleUtilization from './lifecycle/LifecycleUtilization';
import RemisAuditTrail from './RemisAuditTrail';
import { useToast } from '../shared/ToastContext';

interface Props {
    asset: RealPropertyAsset;
    onBack: () => void;
    onUpdate: (asset: RealPropertyAsset) => void;
}

const AssetLifecyclePage: React.FC<Props> = ({ asset, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('General');
    const [formData, setFormData] = useState<RealPropertyAsset>({ ...asset });
    const { addToast } = useToast();

    const handleSave = () => {
        const updatedAsset: RealPropertyAsset = {
            ...formData,
            auditLog: [...formData.auditLog, {
                timestamp: new Date().toISOString(),
                user: 'REMIS_SPECIALIST',
                action: 'Batch Attributes Update',
                details: 'Modified authoritative record via Lifecycle Workbench.'
            }]
        };
        onUpdate(updatedAsset);
        addToast('Fiduciary update complete.', 'success');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 overflow-hidden animate-in fade-in">
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 shrink-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase transition-all">
                        <ArrowLeft size={16}/> Back to Inventory
                    </button>
                    <button 
                        onClick={handleSave} 
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg flex items-center gap-2 active:scale-95 ${REMIS_THEME.classes.buttonPrimary}`}
                    >
                        <Save size={16}/> Save Protocol
                    </button>
                </div>
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-zinc-900 text-white rounded-3xl shadow-xl shrink-0"><Building2 size={32}/></div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{formData.rpaName}</h2>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border">RPUID: {formData.rpuid}</span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                <CheckCircle2 size={12}/> DATA SECURED
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 border-t border-zinc-100 pt-2 -mb-8 overflow-x-auto px-2 custom-scrollbar">
                    {['General', 'Financials', 'Utilization', 'History'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                                activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-6xl mx-auto pb-20">
                    {activeTab === 'General' && <LifecycleGeneral data={formData} onChange={setFormData} />}
                    {activeTab === 'Financials' && <LifecycleFinancials data={formData} />}
                    {activeTab === 'Utilization' && <LifecycleUtilization data={formData} />}
                    {activeTab === 'History' && (
                        <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm">
                            <div className="flex justify-between items-center mb-10 border-b border-zinc-50 pb-6">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-3">
                                    <History size={20} className="text-zinc-400"/> Authoritative Lifecycle Ledger
                                </h4>
                            </div>
                            <RemisAuditTrail log={formData.auditLog} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AssetLifecyclePage;
