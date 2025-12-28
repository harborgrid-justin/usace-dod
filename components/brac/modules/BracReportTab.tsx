
import React from 'react';
import { Lock, FileCheck } from 'lucide-react';

const BracReportTab: React.FC = () => (
    <div className="flex items-center justify-center h-full py-12 animate-in zoom-in duration-500">
        <div className="bg-zinc-900 p-12 rounded-[50px] shadow-3xl text-center max-w-2xl border border-white/10 overflow-hidden relative">
            <div className="w-20 h-20 bg-rose-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20"><Lock size={40} className="text-rose-500" /></div>
            <h3 className="text-3xl font-bold text-white tracking-tight">Legislative Lock Control</h3>
            <p className="text-sm text-zinc-400 mt-4 mb-10 leading-relaxed px-8">Affirming will freeze data and generate the statutory <span className="text-rose-400 font-bold">10 U.S.C. § 2687 Congressional Notification</span> package.</p>
            <button className="w-full py-4 bg-white text-zinc-900 rounded-3xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-zinc-100 flex items-center justify-center gap-3 transition-all active:scale-95"><FileCheck size={20}/> Execute Fiduciary Lock</button>
        </div>
    </div>
);
export default BracReportTab;
