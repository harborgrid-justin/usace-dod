
import React, { useMemo } from 'react';
import { DWCFAccount, DWCFActivity } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
    AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowRight } from 'lucide-react';

interface Props {
    accounts: DWCFAccount[];
    activities: DWCFActivity[];
    onSelectActivity: (activity: DWCFActivity) => void;
}

const KPICard = ({ label, value, icon: Icon, color, trend }: { label: string, value: string, icon: any, color: string, trend?: 'up' | 'down' }) => (
    <div className="bg-white p-6 rounded-md border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-sm ${color.replace('text-', 'bg-').replace('600', '50')}`}>
                <Icon size={20} className={color}/>
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[9px] font-bold uppercase bg-white border rounded-sm px-1.5 py-0.5 ${trend === 'up' ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'}`}>
                    {trend === 'up' ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                    <span>{trend === 'up' ? '+2.4%' : '-1.1%'}</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-mono font-bold text-zinc-900">{value}</p>
        </div>
    </div>
);

const DWCFDashboard: React.FC<Props> = ({ accounts, activities, onSelectActivity }) => {
    // Aggregations
    const totalCash = useMemo(() => accounts.reduce((sum, a) => sum + a.totalCashBalance, 0), [accounts]);
    const totalCollections = useMemo(() => activities.reduce((sum, a) => sum + a.collections, 0), [activities]);
    const totalDisbursements = useMemo(() => activities.reduce((sum, a) => sum + a.disbursements, 0), [activities]);
    const netPosition = totalCollections - totalDisbursements;

    // Mock Chart Data derived from props
    const activityPerformance = useMemo(() => activities.map(a => ({
        name: a.name.split(' ')[0], // Short name
        Collections: a.collections,
        Disbursements: a.disbursements,
        Net: a.collections - a.disbursements
    })), [activities]);

    const cashTrend = [
        { month: 'Oct', value: totalCash * 0.92 },
        { month: 'Nov', value: totalCash * 0.94 },
        { month: 'Dec', value: totalCash * 0.91 },
        { month: 'Jan', value: totalCash * 0.96 },
        { month: 'Feb', value: totalCash },
    ];

    return (
        <div className="space-y-6 animate-in fade-in h-full overflow-y-auto custom-scrollbar p-1">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard label="Total Cash Balance (FBwT)" value={formatCurrency(totalCash)} icon={Wallet} color="text-emerald-600" trend="up"/>
                <KPICard label="YTD Collections" value={formatCurrency(totalCollections)} icon={TrendingUp} color="text-blue-600" />
                <KPICard label="YTD Disbursements" value={formatCurrency(totalDisbursements)} icon={TrendingDown} color="text-rose-600" />
                <KPICard label="Net Operating Result (NOR)" value={formatCurrency(netPosition)} icon={DollarSign} color={netPosition >= 0 ? "text-emerald-600" : "text-amber-600"} />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Trend */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-md p-8 shadow-sm flex flex-col h-[400px]">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <TrendingUp size={16} className="text-zinc-400"/> Cash Solvency Trend (97X4930)
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashTrend}>
                                <defs>
                                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a', fontWeight: 'bold'}}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa'}} tickFormatter={(val) => `$${val/1e6}M`}/>
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', border: 'none', borderRadius: '4px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px'}}
                                    formatter={(val: number) => formatCurrency(val)}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Selection */}
                <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col h-[400px]">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Activity Groups</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {activities.map(activity => (
                            <button 
                                key={activity.id} 
                                onClick={() => onSelectActivity(activity)}
                                className="w-full text-left p-4 rounded-sm border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-zinc-800">{activity.name}</span>
                                    <ArrowRight size={14} className="text-zinc-300 group-hover:text-emerald-600 transition-colors"/>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-[9px] text-zinc-400 uppercase font-bold">Revenue</p>
                                        <p className="text-[10px] font-mono font-bold text-emerald-600">{formatCurrency(activity.collections)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-zinc-400 uppercase font-bold">Expense</p>
                                        <p className="text-[10px] font-mono font-bold text-rose-600">{formatCurrency(activity.disbursements)}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DWCFDashboard;
