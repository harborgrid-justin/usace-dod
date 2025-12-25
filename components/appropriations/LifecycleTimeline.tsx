import React from 'react';

const LifecycleTimeline: React.FC = () => {
  const events = [
    { name: 'Funds Received', date: '2023-10-01', status: 'Completed' },
    { name: 'Distribution Initiated', date: '2023-10-15', status: 'Completed' },
    { name: 'Mid-Year Review', date: '2024-04-01', status: 'Active' },
    { name: 'End-of-Year Close-Out', date: '2024-09-30', status: 'Upcoming' },
    { name: 'Funds Expired', date: '2029-09-30', status: 'Upcoming' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 h-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-6">Milestones</h3>
      <div className="relative pl-4">
        <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-zinc-100" />
        {events.map((event, index) => (
          <div key={index} className="relative mb-6 flex items-start last:mb-0">
            <div className={`absolute left-0 -translate-x-1/2 top-1.5 w-2.5 h-2.5 rounded-full border-[3px] bg-white z-10 ${
                event.status === 'Completed' ? 'border-emerald-500' : 
                event.status === 'Active' ? 'border-blue-500 animate-pulse' : 
                'border-zinc-300'
            }`}></div>
            <div className="pl-6">
              <p className={`font-semibold text-xs leading-none mb-1 ${
                event.status === 'Completed' ? 'text-zinc-800' : 
                event.status === 'Active' ? 'text-blue-600' :
                'text-zinc-400'
              }`}>{event.name}</p>
              <p className="text-[10px] text-zinc-400 font-mono">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifecycleTimeline;