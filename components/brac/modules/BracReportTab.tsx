
import React from 'react';
import { Lock, FileCheck } from 'lucide-react';

const BracReportTab: React.FC = () => (
    <div className="flex items-center justify-center h-full py-12 animate-in zoom-in duration-500">
        <div className="bg-zinc-900 p-12 rounded-md shadow-2xl text-center max-w-2xl border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="w-16 h-16 bg-rose-600/10 rounded-md flex items-center justify-center mx-auto mb-8 border border-rose-500/20"><Lock size={32} className="text-rose-500" /></div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Legislative Lock Control</h3>
            <p className="text-xs text-zinc-400 mt-4 mb-10 leading-relaxed px-8 font-medium">Affirming will freeze data and generate the statutory <span className="text-rose-400 font-bold">10 U.S.C. § 2687 Congressional Notification</span> package. This creates a permanent audit record.</p>
            <button className="w-full py-3.5 bg-white text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-100 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"><FileCheck size={16}/> Execute Fiduciary Lock</button>
        </div>
    </div>
);
export default BracReportTab;
