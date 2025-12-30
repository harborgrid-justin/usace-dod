
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Network } from 'lucide-react';

const SystemHeartbeat: React.FC = () => {
    const [stats, setStats] = useState({ cpu: 12, mem: 44, latency: 0.04 });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats({
                cpu: 10 + Math.floor(Math.random() * 5),
                mem: 40 + Math.floor(Math.random() * 8),
                latency: 0.02 + (Math.random() * 0.05)
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-8 px-6 py-2 bg-zinc-900/50 border-x border-zinc-800 h-full">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                    <Cpu size={10} className="text-zinc-500" />
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Process Load</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.cpu}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">{stats.cpu}%</span>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                    <Database size={10} className="text-zinc-500" />
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">HANA MEM</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${stats.mem}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-400">{stats.mem}%</span>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                    <Network size={10} className="text-zinc-500" />
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">OData Latency</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">{stats.latency.toFixed(3)}ms</span>
            </div>
        </div>
    );
};

export default SystemHeartbeat;
