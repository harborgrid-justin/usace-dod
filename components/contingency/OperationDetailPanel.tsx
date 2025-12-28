
import React, { useState } from 'react';
import OperationOverview from './OperationOverview';
import FundingOversightView from './FundingOversightView';
import CostDetermination from './CostDetermination';
import BudgetJustification from './BudgetJustification';

const OperationDetailPanel: React.FC<any> = ({ operation, onSelectThread }) => {
    const [tab, setTab] = useState('Overview');
    const TABS = ['Overview', 'Funding', 'Cost Collection', 'Justification'];

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/30 flex flex-col gap-6">
                <div><h3 className="text-lg font-bold text-zinc-900 uppercase">{operation.name}</h3><p className="text-xs text-zinc-500 font-mono tracking-widest">{operation.id} • {operation.executeOrderRef}</p></div>
                <div className="flex gap-4 border-t border-zinc-200 pt-4 -mb-6 overflow-x-auto">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${tab === t ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400'}`}>{t}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
                {tab === 'Overview' && <OperationOverview operation={operation} onSelectThread={onSelectThread} />}
                {tab === 'Funding' && <FundingOversightView operation={operation} />}
                {tab === 'Cost Collection' && <CostDetermination operation={operation} />}
                {tab === 'Justification' && <BudgetJustification operation={operation} />}
            </div>
        </div>
    );
};
export default OperationDetailPanel;
