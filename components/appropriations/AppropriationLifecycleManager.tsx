
import React, { useState, useMemo } from 'react';
import { Appropriation, Distribution, TransferAction } from '../../types';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import DistributionTable from './DistributionTable';
import DistributionForm from './DistributionForm';
import LifecycleTimeline from './LifecycleTimeline';
import TransferManager from './TransferManager';
import TransferRequestModal from './TransferRequestModal';
import { formatCurrency } from '../../utils/formatting';
import { fundsService } from '../../services/FundsDataService';

interface Props {
  appropriation: Appropriation;
  commandName: string;
  onBack: () => void;
  onSelectThread: (threadId: string) => void;
}

const AppropriationLifecycleManager: React.FC<Props> = ({ appropriation, commandName, onBack, onSelectThread }) => {
  // Use local state for immediate UI feedback, but sync with service
  const [distributions, setDistributions] = useState<Distribution[]>(appropriation.distributions);
  const [transfers, setTransfers] = useState<TransferAction[]>(fundsService.getTransfers());
  const [activeView, setActiveView] = useState<'distribution' | 'transfers'>('distribution');
  
  const [isDistFormOpen, setIsDistFormOpen] = useState(false);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);

  const distributedAmount = useMemo(() => 
    distributions.reduce((sum, dist) => sum + dist.amount, 0), 
    [distributions]
  );
  const remainingBalance = appropriation.totalAuthority - distributedAmount;
  const distributionPercentage = (distributedAmount / appropriation.totalAuthority) * 100;

  const handleAddDistribution = (newDistribution: Omit<Distribution, 'id' | 'date' | 'status'>) => {
    const newDist: Distribution = {
      ...newDistribution,
      id: `DIST-${String(distributions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved' // Auto-approve for demo flow to show effect immediately
    };
    
    // Commit to Service
    fundsService.addDistribution(appropriation.id, newDist);
    
    // Update local state
    setDistributions(prev => [...prev, newDist]);
    setIsDistFormOpen(false);
  };

  const handleAddTransfer = (data: Partial<TransferAction>) => {
      const newTransfer: TransferAction = {
          id: `TRF-2024-${String(transfers.length + 1).padStart(3, '0')}`,
          fromAccount: data.fromAccount || 'Unknown',
          toAccount: data.toAccount || 'Unknown',
          amount: data.amount || 0,
          authorityType: data.authorityType || 'General Transfer Authority (GTA)',
          legalCitation: 'Pending Citation',
          justification: data.justification || '',
          isHigherPriority: data.isHigherPriority,
          isUnforeseen: data.isUnforeseen,
          currentStage: 'Proposal',
          dates: { initiated: new Date().toISOString().split('T')[0] },
          documents: {}
      };
      
      // Commit to Service
      fundsService.addTransfer(newTransfer);

      // Update local state
      setTransfers(prev => [...prev, newTransfer]);
      setIsTransferFormOpen(false);
  };
  
  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-3 transition-colors uppercase tracking-wide">
            <ArrowLeft size={14} /> Back to Commands
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 uppercase tracking-tight leading-none">
            {commandName}: {appropriation.name}
          </h2>
        </div>
        <div className="flex gap-2">
            <div className="bg-zinc-100 p-1 rounded-lg flex gap-1">
                <button 
                    onClick={() => setActiveView('distribution')}
                    className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeView === 'distribution' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                    Distributions
                </button>
                <button 
                    onClick={() => setActiveView('transfers')}
                    className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeView === 'transfers' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                    Transfers
                </button>
            </div>
            <button 
                onClick={() => activeView === 'distribution' ? setIsDistFormOpen(true) : setIsTransferFormOpen(true)} 
                className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-sm"
            >
                <PlusCircle size={14}/>
                {activeView === 'distribution' ? 'New Distribution' : 'Propose Transfer'}
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left mb-6">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Authority</p>
            <p className="text-2xl font-mono font-bold text-zinc-900">{formatCurrency(appropriation.totalAuthority)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Distributed</p>
            <p className="text-2xl font-mono font-bold text-emerald-600">{formatCurrency(distributedAmount)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Remaining</p>
            <p className="text-2xl font-mono font-bold text-zinc-500">{formatCurrency(remainingBalance)}</p>
          </div>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
           <div className="h-full bg-emerald-500" style={{ width: `${distributionPercentage}%` }} />
        </div>
      </div>
      
      {activeView === 'distribution' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
            <DistributionTable distributions={distributions} onSelectThread={onSelectThread} />
            </div>
            <div className="lg:col-span-1">
            <LifecycleTimeline />
            </div>
        </div>
      ) : (
        <TransferManager transfers={transfers} />
      )}
      
      {isDistFormOpen && (
        <DistributionForm 
          onClose={() => setIsDistFormOpen(false)} 
          onSubmit={handleAddDistribution}
          remainingBalance={remainingBalance}
        />
      )}

      {isTransferFormOpen && (
          <TransferRequestModal
            onClose={() => setIsTransferFormOpen(false)}
            onSubmit={handleAddTransfer}
          />
      )}
    </div>
  );
};

export default AppropriationLifecycleManager;
