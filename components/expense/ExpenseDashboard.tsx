
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Obligation, Expense } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { TrendingUp, TrendingDown, Hourglass, ShieldAlert } from 'lucide-react';

interface Props {
    obligations: Obligation[];
    expenses: Expense[];
}

const KPICard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string, icon: React.ElementType, colorClass: string }) => (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '50')}`}>
                <Icon size={16} className={colorClass} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
                <p className="text-xl font-mono font-bold text-zinc-900">{value}</p>
            </div>
        </div>
    </div>
);


const ExpenseDashboard: React.FC<Props> = ({ obligations, expenses }) => {
    const totalUlo = obligations.reduce((sum, o) => sum + o.unliquidatedAmount, 0);
    const totalAccrued = expenses.filter(e => e.status === 'Accrued').reduce((sum, e) => sum + e.amount, 0);
    const totalDisbursed = obligations.reduce((sum, o) => sum + o.disbursedAmount, 0);
    
    const expenseStatusData = [
        { name: 'Pending', value: expenses.filter(e => e.status === 'Pending Approval').length, color: '#f59e0b' },
        { name: 'Accrued', value: expenses.filter(e => e.status === 'Accrued').length, color: '#3b82f6' },
        { name: 'Paid', value: expenses.filter(e => e.status === 'Paid').length, color: '#16a34a' }
    ];

    return (
        <div className="p-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard title="Unliquidated Obligations (ULO)" value={formatCurrency(totalUlo)} icon={TrendingDown} colorClass="text-rose-600" />
                <KPICard title="Accrued (Unpaid) Expenses" value={formatCurrency(totalAccrued)} icon={Hourglass} colorClass="text-amber-600" />
                <KPICard title="FY Total Disbursed" value={formatCurrency(totalDisbursed)} icon={TrendingUp} colorClass="text-emerald-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">High-Risk Expenses</h4>
                    <div className="space-y-2">
                        {expenses.filter(e => e.status === 'Accrued').slice(0, 2).map(exp => (
                             <div key={exp.id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert size={16} className="text-amber-500 shrink-0"/>
                                    <div>
                                        <p className="text-xs font-bold text-amber-800">{exp.description}</p>
                                        <p className="text-[10px] text-amber-600 font-mono">Accrued {exp.date}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-900">{formatCurrency(exp.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Expense Status</h4>
                     <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                    {expenseStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default ExpenseDashboard;
