import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Obligation, Expense } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { TrendingUp, TrendingDown, Hourglass, ShieldAlert, BarChart3 } from 'lucide-react';

interface Props {
    obligations: Obligation[];
    expenses: Expense[];
}

const KPICard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string, icon: React.ElementType, colorClass: string }) => (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${colorClass.replace('text-', 'bg-').replace('600', '50')} transition-colors group-hover:scale-110`}>
                <Icon size={20} className={colorClass} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Live</span>
        </div>
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">{title}</p>
            <p className="text-2xl font-mono font-bold text-zinc-900 tracking-tight">{value}</p>
        </div>
    </div>
);


const ExpenseDashboard: React.FC<Props> = ({ obligations, expenses }) => {
    const totalUlo = useMemo(() => obligations.reduce((sum, o) => sum + o.unliquidatedAmount, 0), [obligations]);
    const totalAccrued = useMemo(() => expenses.filter(e => e.status === 'Accrued').reduce((sum, e) => sum + e.amount, 0), [expenses]);
    const totalDisbursed = useMemo(() => obligations.reduce((sum, o) => sum + o.disbursedAmount, 0), [obligations]);
    
    const expenseStatusData = [
        { name: 'Pending Approval', value: expenses.filter(e => e.status === 'Pending Approval').length, color: '#f59e0b' },
        { name: 'Accrued Liability', value: expenses.filter(e => e.status === 'Accrued').length, color: '#4f46e5' },
        { name: 'Fully Disbursed', value: expenses.filter(e => e.status === 'Paid').length, color: '#10b981' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in h-full overflow-y-auto custom-scrollbar p-1 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard title="Unliquidated Obs (ULO)" value={formatCurrency(totalUlo)} icon={TrendingDown} colorClass="text-rose-600" />
                <KPICard title="Accrued Liabilities" value={formatCurrency(totalAccrued)} icon={Hourglass} colorClass="text-amber-600" />
                <KPICard title="FY24 Disbursements" value={formatCurrency(totalDisbursed)} icon={TrendingUp} colorClass="text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm flex flex-col h-[450px]">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={16} className="text-rose-700"/> High-Impact Liability Candidates</h3>
                            <p className="text-[10px] text-zinc-400 font-medium mt-1">Pending accruals with high ADA risk exposure.</p>
                        </div>
                    </div>
                    <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                        {expenses.filter(e => e.status === 'Pending Approval').map(exp => (
                             <div key={exp.id} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex justify-between items-center hover:bg-white hover:border-rose-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border border-zinc-100 group-hover:text-rose-700 transition-colors"><Hourglass size={16}/></div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-800">{exp.description}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase mt-0.5">{exp.id} • Age: 12d</p>
                                    </div>
                                </div>
                                <span className="text-base font-mono font-bold text-zinc-900">{formatCurrency(exp.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm flex flex-col h-[450px]">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-10 flex items-center gap-2"><BarChart3 size={16} className="text-rose-700"/> Lifecycle Mix</h3>
                     <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} stroke="none">
                                    {expenseStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-2">
                        {expenseStatusData.map(d => (
                            <div key={d.name} className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}/> {d.name}</div>
                                <span className="text-zinc-900">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseDashboard;