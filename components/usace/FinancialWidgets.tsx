
import React, { useMemo, useState } from 'react';
import { DollarSign, PieChart, FileText, ArrowRight, Users, TrendingUp, Landmark, ArrowUpDown, AlertCircle, Clock } from 'lucide-react';
import { USACEProject } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';

export const CostShareWidget = ({ project }: { project: USACEProject }) => {
    if (!project.costShare) return null;

    // --- Opportunity 9: Memoized Chart Data ---
    const data = useMemo(() => [
        { name: 'Federal', value: project.costShare!.federalShare, color: '#e11d48' },
        { name: 'Non-Federal', value: project.costShare!.nonFederalShare, color: '#2563eb' }
    ], [project.costShare]);

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <PieChart size={14} className="text-zinc-400" /> Cost Share Agreement
            </h4>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie data={data} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">
                                {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-rose-700">Federal ({project.costShare.federalShare}%)</span>
                            <span className="font-mono text-zinc-500">Allocated</span>
                        </div>
                        <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-600" style={{ width: `${project.costShare.federalShare}%` }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-blue-700">{project.costShare.sponsorName} ({project.costShare.nonFederalShare}%)</span>
                            <span className="font-mono text-zinc-500">Contributed: {formatCurrency(project.costShare.totalContributed)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: `${(project.costShare.totalContributed / (project.financials.currentWorkingEstimate * (project.costShare.nonFederalShare/100))) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 text-right">Balance Due: {formatCurrency(project.costShare.balanceDue)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PRCList = ({ project }: { project: USACEProject }) => {
    const [sortOrder, setSortOrder] = useState<'date' | 'amount'>('date');

    const prcs = useMemo(() => {
        const list = [
            { id: 'PRC-001', desc: 'Concrete Supply - Phase 1', amount: 500000, status: 'Committed', date: '2023-10-15' },
            { id: 'PRC-002', desc: 'Engineering Services - Tetra Tech', amount: 120000, status: 'Obligated', date: '2023-11-01' },
            { id: 'PRC-003', desc: 'Site Security Q1', amount: 45000, status: 'Pending', date: '2024-01-20' },
            { id: 'PRC-004', desc: 'Env. Assessment', amount: 85000, status: 'Committed', date: '2023-12-05' }
        ];
        
        return list.sort((a, b) => {
            if (sortOrder === 'amount') return b.amount - a.amount;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [sortOrder]);

    return (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-zinc-400" /> Purchase Requests & Commitments (ENG 93)
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 font-bold hidden sm:inline">Total: {formatCurrency(project.financials.prc_committed)}</span>
                    <button onClick={() => setSortOrder(prev => prev === 'date' ? 'amount' : 'date')} className="p-1 hover:bg-zinc-200 rounded text-zinc-500" title="Toggle Sort">
                        <ArrowUpDown size={14}/>
                    </button>
                </div>
            </div>
            <div className="divide-y divide-zinc-100 flex-1 overflow-y-auto custom-scrollbar max-h-60">
                {prcs.map(prc => (
                    <div key={prc.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-800">{prc.id}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase ${
                                    prc.status === 'Obligated' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                    prc.status === 'Committed' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                    'bg-amber-50 border-amber-100 text-amber-700'
                                }`}>{prc.status}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{prc.desc}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(prc.amount)}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">{prc.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const FundingStreamVisualizer = ({ project }: { project: USACEProject }) => {
    // Opp 15: Funding Expiration Warning
    const currentYear = new Date().getFullYear();
    const expiryYear = currentYear + 1; // Mock
    const isExpiring = expiryYear <= currentYear + 1;

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Appropriation Flow</h4>
                {isExpiring && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100 animate-in fade-in">
                        <Clock size={10} /> Funds Expire Sept 30
                    </div>
                )}
            </div>
            
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 -z-10" />
                
                <div className="flex flex-col items-center bg-white px-2">
                    <div className="p-3 rounded-full bg-purple-50 text-purple-600 border border-purple-100 mb-2"><Landmark size={16}/></div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Approp</p>
                    <p className="text-xs font-mono font-bold text-zinc-900">{project.appropriation}</p>
                </div>
                
                <ArrowRight size={16} className="text-zinc-300" />

                <div className="flex flex-col items-center bg-white px-2">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-2"><DollarSign size={16}/></div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Programmed</p>
                    <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(project.financials.programmed)}</p>
                </div>

                <ArrowRight size={16} className="text-zinc-300" />

                <div className="flex flex-col items-center bg-white px-2">
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2"><FileText size={16}/></div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Obligated</p>
                    <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(project.financials.obligated)}</p>
                </div>
            </div>
        </div>
    );
};

export const LaborAnalysis = () => {
    // Opp 14: Overrun Detection logic
    const directLaborCost = 1200000;
    const directLaborBudget = 1100000; // Mock budget lower than cost
    const isOverrun = directLaborCost > directLaborBudget;

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <Users size={14} className="text-zinc-400"/> Labor Analysis (FTE)
                </h4>
                {isOverrun && (
                    <span className="text-[9px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold border border-rose-100 flex items-center gap-1">
                        <AlertCircle size={10}/> Over Budget
                    </span>
                )}
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 font-medium">Direct Labor</span>
                    <div className="text-right">
                        <span className={`block font-bold ${isOverrun ? 'text-rose-700' : 'text-zinc-900'}`}>{formatCurrency(directLaborCost)}</span>
                        <span className="text-[10px] text-zinc-400">12.5 FTE</span>
                    </div>
                </div>
                {/* Progress Bar for Labor */}
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full ${isOverrun ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${Math.min((directLaborCost / directLaborBudget) * 100, 100)}%`}}/>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 font-medium">District Overhead</span>
                    <div className="text-right">
                        <span className="block font-bold text-zinc-900">$240K</span>
                        <span className="text-[10px] text-zinc-400">20% Rate</span>
                    </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 font-medium">S&amp;A (Supervision &amp; Admin)</span>
                    <div className="text-right">
                        <span className="block font-bold text-zinc-900">$180K</span>
                        <span className="text-[10px] text-zinc-400">5.5% Flat</span>
                    </div>
                </div>
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase ${isOverrun ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                        <TrendingUp size={12}/> {isOverrun ? 'Cost Variance' : 'Within Budget'}
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-900">Total: $1.62M</span>
                </div>
            </div>
        </div>
    );
};
