
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ERP_TCODES } from '../../constants';
import { ERPModule } from '../../types';

interface Props {
    activeModule: string | 'ALL';
    onSelectCommand: (code: string) => void;
}

const TCodeList: React.FC<Props> = ({ activeModule, onSelectCommand }) => {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200 flex justify-between items-center">
                <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Available Transactions</h3>
                <button className="text-[10px] text-blue-600 font-bold hover:underline">Manage Favorites</button>
            </div>
            <div className="divide-y divide-zinc-100">
                {ERP_TCODES.filter(tc => activeModule === 'ALL' || tc.module === activeModule).map(tc => (
                    <button key={tc.code} className="px-4 py-3 flex justify-between items-center hover:bg-zinc-50 transition-colors group w-full text-left" onClick={() => onSelectCommand(tc.code)}>
                            <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded group-hover:bg-zinc-200">{tc.code}</span>
                            <span className="text-xs text-zinc-600">{tc.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-zinc-400">{tc.module}</span>
                            {tc.riskLevel === 'High' && <ShieldCheck size={12} className="text-amber-500" />}
                            </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TCodeList;
