
import React, { useState } from 'react';
import { Play, Activity, RotateCcw } from 'lucide-react';
import { Asset } from '../../types';
import { IntegrationOrchestrator } from '../../services/IntegrationOrchestrator';

interface Props {
    assets: Asset[];
}

const AssetBatchProcessor: React.FC<Props> = ({ assets }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const runBatchProcess = () => {
        setIsProcessing(true);
        setProgress(0);
        setLogs(['[START] Quarterly Ownership Cost Processing Initiated.']);

        const inServiceAssets = assets.filter(a => a.status === 'In Service');
        const totalSteps = inServiceAssets.length;
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < totalSteps) {
                const asset = inServiceAssets[currentStep];
                
                // Integration #6: Generate Depreciation Journal
                const glEntry = IntegrationOrchestrator.generateDepreciationJournal(asset);
                
                setLogs(prev => [...prev, `[INFO] Processing Asset ${asset.id} (${asset.name})...`]);
                setLogs(prev => [...prev, `  - Calculating Depreciation ($${glEntry.totalAmount.toFixed(2)})... OK`]);
                setLogs(prev => [...prev, `  - Posting to GL (Doc: ${glEntry.id})... OK`]);
                
                if (asset.pripAuthorized) setLogs(prev => [...prev, `  - Calculating Plant Increment... OK`]);
                if (asset.type === 'Revolving Fund') setLogs(prev => [...prev, `  - Calculating Insurance Surcharge... OK`]);
                currentStep++;
                setProgress(Math.round((currentStep / totalSteps) * 100));
            } else {
                clearInterval(interval);
                setLogs(prev => [...prev, `[SUCCESS] All ownership costs posted to GL. Process complete.`]);
                setIsProcessing(false);
            }
        }, 300);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center h-fit lg:h-full">
                <div className="p-4 bg-zinc-50 rounded-full mb-4 border border-zinc-200"><Play size={32} className="text-zinc-500"/></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Quarterly Batch Processing</h3>
                <p className="text-sm text-zinc-500 max-w-md mb-6">Execute batch job to calculate and post depreciation, plant increment, and insurance for all 'In Service' assets for the current fiscal quarter.</p>
                <button onClick={runBatchProcess} disabled={isProcessing} className="w-full max-w-xs py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-200 disabled:bg-zinc-300">
                    {isProcessing ? <Activity size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                    {isProcessing ? `Processing... ${progress}%` : 'Execute Q3-2024 Batch'}
                </button>
            </div>
            <div className="bg-zinc-900 rounded-xl shadow-lg p-4 flex flex-col overflow-hidden text-white font-mono text-[10px] min-h-[300px]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-700"><span className="text-zinc-400">cefms_ownership_cost.log</span><button onClick={() => setLogs([])} className="text-zinc-500 hover:text-white"><RotateCcw size={12}/></button></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                    {logs.map((log, i) => (<p key={i} className={`${log.includes('[SUCCESS]') ? 'text-emerald-400' : log.includes('[START]') ? 'text-amber-400' : 'text-zinc-400'}`}>{log}</p>))}
                </div>
            </div>
        </div>
    );
};

export default AssetBatchProcessor;
