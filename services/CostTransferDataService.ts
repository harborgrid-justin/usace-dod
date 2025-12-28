import { CostTransfer } from '../types';

class CostTransferDataService {
    private transfers: CostTransfer[] = [];
    private listeners: Set<Function> = new Set();

    getTransfers(): CostTransfer[] { return this.transfers; }

    addTransfer(transfer: CostTransfer) {
        this.transfers = [transfer, ...this.transfers];
        this.notifyListeners();
    }

    updateTransfer(updatedTransfer: CostTransfer) {
        this.transfers = this.transfers.map(t => t.id === updatedTransfer.id ? updatedTransfer : t);
        this.notifyListeners();
    }

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const costTransferService = new CostTransferDataService();