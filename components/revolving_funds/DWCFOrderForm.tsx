
import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, DollarSign, Save } from 'lucide-react';
import { REMIS_THEME } from '../../constants';

interface Props {
    activityId: string;
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

const DWCFOrderForm: React.FC<Props> = ({ activityId, onCancel, onSubmit }) => {
    const [form, setForm] = useState({
        customer: '',
        description: '',
        totalAmount: 0,
        isAdvanceFunded: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...form,
            id: `DWO-${Date.now().toString().slice(-4)}`,
            dwcfActivityId: activityId,
            status: 'Accepted'
        });
    };

    return (
        <div className="flex flex-col h-full bg-white p-8 rounded-md border border-zinc-200 shadow-sm animate-in slide-in-from-right-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-6">
                <div>
                    <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Establish Customer Order</h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest">Activity: {activityId}</p>
                </div>
                <button onClick={onCancel} className="p-3 hover:bg-zinc-50 rounded-sm text-zinc-400 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200">
                    <ArrowLeft size={20} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Customer Entity</label>
                        <input 
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-sm p-3 text-sm font-bold focus:bg-white focus:border-zinc-400 transition-all outline-none" 
                            placeholder="e.g. ARMY, NAVY, GSA" 
                            required 
                            onChange={e => setForm({...form, customer: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Scope of Work</label>
                        <textarea 
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-sm p-3 text-sm font-medium h-32 resize-none focus:bg-white focus:border-zinc-400 transition-all outline-none" 
                            placeholder="Description of goods or services..." 
                            required 
                            onChange={e => setForm({...form, description: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">Order Ceiling ($)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                            <input 
                                type="number" 
                                className="w-full bg-white border border-zinc-200 rounded-sm py-3 pl-8 pr-3 text-lg font-mono font-bold text-zinc-900 focus:border-emerald-500 transition-all outline-none" 
                                required 
                                onChange={e => setForm({...form, totalAmount: Number(e.target.value)})} 
                            />
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-emerald-50 rounded-md border border-emerald-100 flex gap-4 text-xs items-start text-emerald-800 shadow-sm">
                    <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold uppercase tracking-wide mb-1">Authority Validation</p>
                        <p className="leading-relaxed opacity-90">FMR 11B Compliance: Order acceptance requires validated 10 U.S.C. 2208 authority. Ensure customer funding document (MIPR/Project Order) is attached.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-zinc-200 rounded-sm text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50 transition-all">Cancel</button>
                    <button type="submit" className={`px-8 py-2.5 text-white rounded-sm text-[10px] font-bold uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2 ${REMIS_THEME.classes.buttonPrimary}`}>
                        <Save size={16}/> Accept Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DWCFOrderForm;
