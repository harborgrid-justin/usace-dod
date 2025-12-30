import { AEAHistoryEvent, Distribution } from './financial';

export type FundControlLevel = 'Apportionment' | 'Allotment' | 'Allocation' | 'Suballocation' | 'Suballotment';

export interface FundControlNode {
    id: string;
    parentId: string | null;
    name: string;
    level: FundControlLevel;
    totalAuthority: number;
    amountDistributed: number;
    amountCommitted: number;
    amountObligated: number;
    amountExpended: number;
    isCMA: boolean;
    children: FundControlNode[];
    history: AEAHistoryEvent[];
}

export interface Appropriation {
    id: string;
    commandId: string;
    name: string;
    totalAuthority: number;
    obligated: number;
    distributions: Distribution[];
}

export type TransferAuthorityType = 'General Transfer Authority (GTA)' | 'Congressionally Directed' | 'Working Capital Fund' | 'MilCon' | 'Functional (10 USC 125)' | 'Inter-Agency (31 USC 1531)';

export type TransferStage = 'Proposal' | 'SecDef Determination' | 'OMB Approval' | 'Reprogramming (DD 1415)' | 'Congressional Notification' | 'Treasury NET (SF 1151)' | 'Completed';

export interface TransferAction {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    authorityType: TransferAuthorityType;
    legalCitation: string;
    justification: string;
    isHigherPriority?: boolean;
    isUnforeseen?: boolean;
    currentStage: TransferStage;
    dates: { initiated: string; completed?: string };
    documents: { dd1415?: string; sf1151?: string };
}