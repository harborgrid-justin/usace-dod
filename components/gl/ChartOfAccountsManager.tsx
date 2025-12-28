import React, { useState, useMemo, useDeferredValue } from 'react';
import { MOCK_USSGL_ACCOUNTS } from '../../constants';
import { Search, Shield, CheckCircle, AlertCircle, Link2, Filter, Database, Hash } from 'lucide-react';
import Badge from '../shared/Badge';

const ChartOfAccountsManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    const [combo, setCombo] = useState({ fund: '0100', org: 'S11100', program: '111000' });
    const [validationState, setValidationState] = useState<'IDLE' | 'VALID' | 'INVALID'>('IDLE');

    const categories = ['All', 'Asset', 'Liability', 'Net Position', 'Budgetary', 'Revenue', 'Expense'];

    const filteredAccounts = useMemo(() => {
        return MOCK_USSGL_ACCOUNTS.filter(acc => {
            const matchesSearch = acc.accountNumber.includes(deferredSearch) || acc.description.toLowerCase().includes(deferredSearch.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || acc.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [deferredSearch, categoryFilter]);

    const handleValidate = () => {
        // Mock validation logic against business rules
        const isValid = combo.fund === '0100' && combo.org === 'S11100';
        setValidationState(isValid ? 'VALID' : 'INVALID');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 h-full overflow-hidden animate-in fade-in">
            <div className="lg:col-span-8 flex flex-col bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative flex-1 w-full sm:w-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                            <input 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-rose-400 transition-all shadow-inner" 
                                placeholder="Search by USSGL account or title..."
                            />
                        </div>
                        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
                                        categoryFilter === cat ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
                            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                <th className="p-4">USSGL Account</th>
                                <th className="p-4">Normal Bal</th>
                                <th className="p-4">Statement Mapping</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredAccounts.map(acc => (
                                <tr key={acc.accountNumber} className="hover:bg-rose-50/20 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-100 rounded-xl text-zinc-500 group-hover:bg-rose-700 group-hover:text-white transition-all shadow-sm"><Hash size={14}/></div>
                                            <div>
                                                <p className="text-sm font-mono font-bold text-zinc-900">{acc.accountNumber}</p>
                                                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">{acc.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs font-bold text-zinc-700">{acc.normalBalance}</td>
                                    <td className="p-4 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{acc.financialStatement}</td>
                                    <td className="p-4 text-center">
                                        <Badge variant={acc.isActive ? 'success' : 'neutral'}>{acc.isActive ? 'Active' : 'Inactive'}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar pr-1">
                <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-2xl border border-zinc-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Shield size={64}/></div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <Shield size={16}/> String Validator
                    </h4>
                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Fund Code</label>
                            <input value={combo.fund} onChange={e => setCombo({...combo, fund: e.target.value})} className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-all shadow-inner" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Org (EROC)</label>
                            <input value={combo.org} onChange={e => setCombo({...combo, org: e.target.value})} className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-all shadow-inner" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Program Element</label>
                            <input value={combo.program} onChange={e => setCombo({...combo, program: e.target.value})} className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-xs font-mono focus:outline-none focus:border-emerald-500 transition-all shadow-inner" />
                        </div>
                    </div>
                    <button onClick={handleValidate} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
                        Test Logic String
                    </button>
                    
                    {validationState !== 'IDLE' && (
                        <div className={`mt-8 p-5 rounded-2xl flex items-start gap-4 border animate-in slide-in-from-top-2 ${
                            validationState === 'VALID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                            {validationState === 'VALID' ? <CheckCircle size={18} className="shrink-0 mt-0.5"/> : <AlertCircle size={18} className="shrink-0 mt-0.5"/>}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider">{validationState === 'VALID' ? 'Logical Compliance OK' : 'Validation Error'}</p>
                                <p className="text-[10px] mt-1.5 opacity-80 leading-relaxed font-medium">
                                    {validationState === 'VALID' 
                                        ? 'Account string matched against authoritative SFIS Table of Elements.' 
                                        : 'Segment mismatch detected between Fund and Organization. Action violates internal fund control policy RE-01.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Link2 size={16} className="text-blue-600"/> Treasury Tie-Points
                    </h4>
                    <div className="space-y-3">
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">FBWT vs SBR</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">BALANCED</span>
                        </div>
                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Exp vs Disb</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">MATCHED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartOfAccountsManager;