
import React, { useMemo } from 'react';
import { DWCFAccount, DWCFActivity } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
    AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

interface Props {
    accounts: DWCFAccount[];
    activities: DWCFActivity[];
}

const KPICard = ({ label, value, icon: Icon, color, trend }: { label: string, value: string, icon: any, color: string, trend?: 'up' | 'down' }) => (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-mono font-bold text-zinc-900 mt-1">{value}</p>
            </div>
            <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('600', '50')}`}>
                <Icon size={20} className={color}/>
            </div>
        </div>
        {trend && (
            <div className={`mt-3 flex items-center gap-1 text-[10px] font-bold uppercase ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend === 'up' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                <span>{trend === 'up' ? '+2.4% vs Plan' : '-1.1% vs Plan'}</span>
            </div>
        )}
    </div>
);

const DWCFDashboard: React.FC<Props> = ({ accounts, activities }) => {
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
        <div className="space-y-6 animate-in fade-in">
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
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Cash Solvency Trend (97X4930)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashTrend}>
                                <defs>
                                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `$${val/1e6}M`}/>
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px'}}
                                    formatter={(val: number) => formatCurrency(val)}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCash)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Performance */}
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Activity Performance</h3>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityPerformance} layout="vertical" margin={{left: 0}}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5"/>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} width={60} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px', borderRadius: '8px'}} formatter={(val: number) => formatCurrency(val)}/>
                                <Bar dataKey="Collections" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={8} />
                                <Bar dataKey="Disbursements" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 justify-center mt-4 text-[10px] uppercase font-bold text-zinc-500">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/> Collections</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"/> Disbursements</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DWCFDashboard;
