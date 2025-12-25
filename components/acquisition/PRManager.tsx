
import React, { useState, useTransition } from 'react';
import { ShoppingCart, Plus, Search } from 'lucide-react';
import { PurchaseRequest } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import PRForm from './PRForm';

interface Props {
    prs: PurchaseRequest[];
    onUpdate: (prs: PurchaseRequest[]) => void;
}

const PRManager: React.FC<Props> = ({ prs, onUpdate }) => {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        startTransition(() => {
            setSearchTerm(e.target.value);
        });
    };

    const filteredPRs = prs.filter(pr => 
        pr.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pr.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (newPR: PurchaseRequest) => {
        onUpdate([newPR, ...prs]);
        setView('list');
    };

    if (view === 'create') {
        return <PRForm onCancel={() => setView('list')} onSubmit={handleCreate} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex gap-4 items-center w-full sm:w-auto">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ShoppingCart size={20}/></div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Purchase Requests (PR&C)</h3>
                        <p className="text-xs text-zinc-500">Commitment Management (ENG Form 93)</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input 
                            type="text" 
                            placeholder="Search PRs..." 
                            value={inputValue}
                            onChange={handleSearchChange}
                            className="pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 w-full"
                        />
                    </div>
                    <button onClick={() => setView('create')} className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800 transition-colors whitespace-nowrap">
                        <Plus size={14}/> New PR
                    </button>
                </div>
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {filteredPRs.map(pr => (
                    <div key={pr.id} className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-50 px-2 py-1 rounded">{pr.id}</span>
                            <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${
                                pr.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                pr.status === 'Pending Funds' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-zinc-100 text-zinc-600 border-zinc-200'
                            }`}>{pr.status}</span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900 mb-1">{pr.description}</h4>
                        <p className="text-xs text-zinc-500 mb-4">Req: {pr.requester} • {pr.date}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Est. Amount</span>
                            <span className="text-sm font-mono font-bold text-zinc-900">{formatCurrency(pr.amount)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PRManager;
