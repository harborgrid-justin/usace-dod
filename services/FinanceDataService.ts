
import { 
    DepositFundAccount, CIHOAccount, UMDRecord, NULORecord, 
    ContingencyOperation, OandMAppropriation, USSGLAccount 
} from '../types';
import { 
    MOCK_DEPOSIT_FUNDS, MOCK_LIABILITY_TRANSACTIONS, MOCK_CIHO_ACCOUNTS, 
    MOCK_CIHO_TRANSACTIONS, MOCK_FBWT_CASES, MOCK_FBWT_TRANSACTIONS, 
    MOCK_CONTINGENCY_OPERATIONS, MOCK_O_AND_M_APPROPRIATIONS, MOCK_USSGL_ACCOUNTS 
} from '../constants';

// Define transaction types if not global
export interface LiabilityTransaction { id: string; depositFundId: string; source: string; amount: number; description: string; status: string; }
export interface CihoTransaction { id: string; cihoAccountId: string; date: string; amount: number; description: string; }
export interface FbwtCase { id: string; type: string; tas: string; amount: number; age: number; status: string; linkedThreadId: string; }
export interface FbwtTransaction { id: string; type: string; tas: string; amount: number; date: string; }

class FinanceDataService {
    private depositFunds: DepositFundAccount[] = JSON.parse(JSON.stringify(MOCK_DEPOSIT_FUNDS));
    private liabilityTransactions: LiabilityTransaction[] = JSON.parse(JSON.stringify(MOCK_LIABILITY_TRANSACTIONS));
    private cihoAccounts: CIHOAccount[] = JSON.parse(JSON.stringify(MOCK_CIHO_ACCOUNTS));
    private cihoTransactions: CihoTransaction[] = JSON.parse(JSON.stringify(MOCK_CIHO_TRANSACTIONS));
    private fbwtCases: FbwtCase[] = JSON.parse(JSON.stringify(MOCK_FBWT_CASES));
    private fbwtTransactions: FbwtTransaction[] = JSON.parse(JSON.stringify(MOCK_FBWT_TRANSACTIONS));
    private contingencyOps: ContingencyOperation[] = JSON.parse(JSON.stringify(MOCK_CONTINGENCY_OPERATIONS));
    private oAndMAppropriations: OandMAppropriation[] = JSON.parse(JSON.stringify(MOCK_O_AND_M_APPROPRIATIONS));
    private ussglAccounts: USSGLAccount[] = JSON.parse(JSON.stringify(MOCK_USSGL_ACCOUNTS));
    
    private listeners = new Set<Function>();

    // --- Accessors ---
    getDepositFunds = () => this.depositFunds;
    getLiabilityTransactions = () => this.liabilityTransactions;
    getCihoAccounts = () => this.cihoAccounts;
    getCihoTransactions = () => this.cihoTransactions;
    getFbwtCases = () => this.fbwtCases;
    getFbwtTransactions = () => this.fbwtTransactions;
    getContingencyOps = () => this.contingencyOps;
    getOandMAppropriations = () => this.oAndMAppropriations;
    getUssglAccounts = () => this.ussglAccounts;

    // --- Mutators ---
    addDepositFund = (fund: DepositFundAccount) => { this.depositFunds = [...this.depositFunds, fund]; this.notify(); };
    addLiabilityTransaction = (tx: LiabilityTransaction) => { this.liabilityTransactions = [tx, ...this.liabilityTransactions]; this.notify(); };
    
    updateCihoAccount = (updated: CIHOAccount) => { 
        this.cihoAccounts = this.cihoAccounts.map(a => a.id === updated.id ? updated : a); 
        this.notify(); 
    };

    updateContingencyOp = (updated: ContingencyOperation) => {
        this.contingencyOps = this.contingencyOps.map(op => op.id === updated.id ? updated : op);
        this.notify();
    };

    addContingencyOp = (op: ContingencyOperation) => {
        this.contingencyOps = [op, ...this.contingencyOps];
        this.notify();
    };
    
    updateFbwtCase = (updated: FbwtCase) => {
        this.fbwtCases = this.fbwtCases.map(c => c.id === updated.id ? updated : c);
        this.notify();
    };

    // --- Subscription ---
    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const financeService = new FinanceDataService();
