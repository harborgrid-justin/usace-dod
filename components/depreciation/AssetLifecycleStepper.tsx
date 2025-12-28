import React from 'react';
import { AssetLifecycleStatus } from '../../types';
import { Check } from 'lucide-react';

interface Props {
    currentStatus: AssetLifecycleStatus;
}

const LIFECYCLE_STAGES: AssetLifecycleStatus[] = ['Planning', 'Acquisition', 'CIP', 'In Service', 'Modification', 'Disposal'];

const AssetLifecycleStepper: React.FC<Props> = ({ currentStatus }) => {
    const currentIndex = LIFECYCLE_STAGES.indexOf(currentStatus);

    return (
        <div className="overflow-x-auto custom-scrollbar pb-2">
            <div className="relative flex justify-between items-start text-center p-4 min-w-[500px]">
                {/* Connecting Line */}
                <div className="absolute top-3 left-10 right-10 h-0.5 bg-zinc-200 -z-10" />

                {LIFECYCLE_STAGES.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={stage} className="flex flex-col items-center gap-2 w-20 z-10 bg-zinc-50/50 px-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                ${isCompleted ? 'bg-rose-600 border-rose-600 text-white' : ''}
                                ${isCurrent ? 'bg-white border-rose-600' : ''}
                                ${!isCompleted && !isCurrent ? 'bg-white border-zinc-300' : ''}
                            `}>
                                {isCompleted && <Check size={14} />}
                                {isCurrent && <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider leading-tight
                                ${isCurrent ? 'text-rose-700' : 'text-zinc-400'}
                            `}>{stage}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssetLifecycleStepper;