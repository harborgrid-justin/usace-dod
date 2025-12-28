
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { MOCK_BUSINESS_RULES } from '../../constants';

const RuleLibrarySidebar: React.FC<any> = ({ searchTerm, onSearch }) => {
    const rules = MOCK_BUSINESS_RULES.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest">Rule Library</h3>
                <button className="p-1.5 bg-zinc-900 text-white rounded"><Plus size={14} /></button>
            </div>
            <div className="p-4 border-b border-zinc-100"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input className="w-full pl-9 pr-3 py-2 bg-zinc-50 border rounded-lg text-xs" placeholder="Search logic..." value={searchTerm} onChange={e => onSearch(e.target.value)}/></div></div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {rules.map(r => (
                    <div key={r.id} className="p-3 border rounded-lg hover:bg-zinc-50 transition-all cursor-default">
                        <div className="flex justify-between items-start mb-1"><span className="text-xs font-bold text-zinc-900">{r.code}</span><span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{r.severity}</span></div>
                        <p className="text-xs text-zinc-600 line-clamp-1 font-medium">{r.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 truncate font-mono">{r.logicString}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default RuleLibrarySidebar;
