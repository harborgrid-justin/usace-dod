
import React, { useState } from 'react';
import { ArrowLeft, Building2, Save, History, CheckCircle2 } from 'lucide-react';
import { RealPropertyAsset } from '../../types';
import { REMIS_THEME } from '../../constants';
import LifecycleGeneral from './lifecycle/LifecycleGeneral';
import LifecycleFinancials from './lifecycle/LifecycleFinancials';
import LifecycleUtilization from './lifecycle/LifecycleUtilization';
import RemisAuditTrail from './RemisAuditTrail';

const AssetLifecyclePage: React.FC<any> = ({ asset, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('General');
    const [formData, setFormData] = useState<RealPropertyAsset>(asset);

    return (
        <div className="flex flex-col h-full bg-zinc-50/50 overflow-hidden animate-in fade-in">
            <div className="bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 shrink-0 z-20 shadow-sm">
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase"><ArrowLeft size={16}/></button>
                    <button onClick={() => onUpdate(formData)} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg flex items-center gap-2 ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Save size={16}/> Save Protocol
                    </button>
                </div>
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-zinc-900 text-white rounded-3xl shrink-0"><Building2 size={32}/></div>
                    <div><h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{formData.rpaName}</h2><p className="text-sm text-zinc-500">RPUID: {formData.rpuid}</p></div>
                </div>
                <div className="flex gap-8 border-t border-zinc-100 pt-2 -mb-8 overflow-x-auto px-2">
                    {['General', 'Financials', 'Utilization', 'History'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-zinc-400'}`}>{tab}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'General' && <LifecycleGeneral data={formData} onChange={setFormData} />}
                {activeTab === 'Financials' && <LifecycleFinancials data={formData} />}
                {activeTab === 'Utilization' && <LifecycleUtilization data={formData} />}
                {activeTab === 'History' && <div className="bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm"><RemisAuditTrail log={formData.auditLog} /></div>}
            </div>
        </div>
    );
};
export default AssetLifecyclePage;
