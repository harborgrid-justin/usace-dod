
import React, { useState } from 'react';
import { FileCheck, Search, Plus } from 'lucide-react';
import { Contract } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import ContractForm from './ContractForm';
import Badge from '../shared/Badge';

interface Props {
    contracts: Contract[];
    onUpdate: (contracts: Contract[]) => void;
}

const ContractManager: React.FC<Props> = ({ contracts, onUpdate }) => {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContracts = contracts.filter(c => 
        c.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = contracts.filter(c => c.status === 'Active').length;
    const totalObligated = contracts.reduce((sum, c) => sum + c.value, 0);

    const handleCreate = (newContract: Contract) => {
        onUpdate([newContract, ...contracts]);
        setView('list');
    };

    if (view === 'create') {
        return <ContractForm onCancel={() => setView('list')} onSubmit={handleCreate} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Active Solicitations</h4>
                    <p className="text-2xl font-mono font-bold text-zinc-900">{activeCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Pending Awards</h4>
                    <p className="text-2xl font-mono font-bold text-blue-600">4</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Obligated (FY)</h4>
                    <p className="text-2xl font-mono font-bold text-emerald-600">{formatCurrency(totalObligated)}</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FileCheck size={16} className="text-zinc-400"/>
                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Contract Ledger</h3>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                type="text" 
                                placeholder="Search contracts..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 w-64"
                            />
                        </div>
                        <button onClick={() => setView('create')} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors">
                            <Plus size={12}/> New Award
                        </button>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-100">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contract Number</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vendor</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Value</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filteredContracts.map(c => (
                            <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="p-4 text-xs font-mono font-bold text-zinc-800">{c.id}</td>
                                <td className="p-4 text-xs font-medium text-zinc-700">{c.vendor}</td>
                                <td className="p-4 text-xs text-zinc-500">{c.type}</td>
                                <td className="p-4 text-xs font-mono font-bold text-zinc-900 text-right">{formatCurrency(c.value)}</td>
                                <td className="p-4">
                                    <Badge variant={
                                        c.status === 'Active' ? 'success' :
                                        c.status === 'Terminated' || c.status === 'Canceled' ? 'danger' :
                                        'neutral'
                                    }>{c.status}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContractManager;
