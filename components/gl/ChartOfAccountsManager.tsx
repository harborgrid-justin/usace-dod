
import React, { useState, useMemo } from 'react';
import { MOCK_USSGL_ACCOUNTS } from '../../constants';
import { USSGLAccount } from '../../types';
import { Search, Shield, CheckCircle, AlertCircle, Link2 } from 'lucide-react';

const ChartOfAccountsManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    
    // --- Validator State ---
    const [combo, setCombo] = useState({ fund: '0100', org: 'S11100', program: '111000' });
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [tiePointResult, setTiePointResult] = useState<'Pending' | 'Passed' | 'Failed'>('Pending');

    const filteredAccounts = useMemo(() => {
        return MOCK_USSGL_ACCOUNTS.filter(acc => {
            const matchesSearch = acc.accountNumber.includes(searchTerm) || acc.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'All' || acc.category === filter;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filter]);

    const handleValidate = () => {
        // Mock validation logic
        setIsValid(combo.fund === '0100' && combo.org === 'S11100');
    };

    const handleTiePointCheck = () => {
        setTiePointResult('Passed'); 
    };

    const segments = ['USSGL', 'Fund', 'Org', 'Program', 'Project', 'Cost Type', 'Customer'];
    const categories = ['All', 'Asset', 'Liability', 'Net Position', 'Budgetary', 'Revenue', 'Expense'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full overflow-y-auto custom-scrollbar">
            {/* Left: COA Structure & Validator */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">COA Structure</h4>
                    <div className="space-y-2">
                        {segments.map((seg, i) => (
                            <div key={seg} className="flex items-center gap-3 p-2 bg-white rounded border">
                                <span className="text-[10px] font-mono font-bold text-zinc-500 w-4">{i+1}</span>
                                <span className="text-sm font-semibold text-zinc-800">{seg}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield size={14}/> Combination Validator
                    </h4>
                    <div className="space-y-3 mb-4">
                        <input value={combo.fund} onChange={e => setCombo({...combo, fund: e.target.value})} className="w-full text-xs p-2 border rounded" placeholder="Fund"/>
                        <input value={combo.org} onChange={e => setCombo({...combo, org: e.target.value})} className="w-full text-xs p-2 border rounded" placeholder="Org"/>
                        <input value={combo.program} onChange={e => setCombo({...combo, program: e.target.value})} className="w-full text-xs p-2 border rounded" placeholder="Program"/>
                    </div>
                    <button onClick={handleValidate} className="w-full py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Validate</button>
                    {isValid !== null && (
                        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-bold border ${isValid ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            {isValid ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                            {isValid ? 'Valid Combination' : 'Invalid Combination'}
                        </div>
                    )}
                </div>
                 <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Link2 size={14}/> USSGL Tie-Point Validator
                    </h4>
                    <p className="text-xs text-zinc-500 mb-4">Verifies relational integrity between budgetary and proprietary accounts (e.g., FBWT vs SBR).</p>
                    <button onClick={handleTiePointCheck} className="w-full py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-800">Run Tie-Point Check</button>
                    {tiePointResult !== 'Pending' && (
                        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-bold border ${tiePointResult === 'Passed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            {tiePointResult === 'Passed' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                            {tiePointResult === 'Passed' ? 'All Tie-Points Validated' : 'Tie-Point Mismatch Detected'}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: USSGL Account List */}
            <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-xl p-6 flex flex-col">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">USSGL Account Master</h4>
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 py-2 border border-zinc-200 rounded-lg text-xs" placeholder="Search by number or description..."/>
                    </div>
                    <select value={filter} onChange={e => setFilter(e.target.value)} className="text-xs border border-zinc-200 rounded-lg bg-white">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-zinc-100/80 backdrop-blur-sm">
                            <tr className="border-b border-zinc-200">
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Account</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Status</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Normal Bal.</th>
                                <th className="p-2 text-[10px] font-bold text-zinc-400 uppercase">Statement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredAccounts.map(acc => (
                                <tr key={acc.accountNumber} className={!acc.isActive ? 'opacity-50' : ''}>
                                    <td className="p-2">
                                        <p className="text-sm font-mono font-bold text-zinc-800">{acc.accountNumber}</p>
                                        <p className="text-[10px] text-zinc-500">{acc.description}</p>
                                    </td>
                                    <td className="p-2">
                                        {!acc.isActive && <span className="text-[9px] font-bold uppercase bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded">Inactive</span>}
                                    </td>
                                    <td className="p-2 text-xs font-medium">{acc.normalBalance}</td>
                                    <td className="p-2 text-[10px] font-medium text-zinc-500">{acc.financialStatement}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChartOfAccountsManager;
