
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { remisService } from '../services/RemisDataService';
import { glService } from '../services/GLDataService';
import { fundsService } from '../services/FundsDataService';
import { acquisitionService } from '../services/AcquisitionDataService';
import { expenseDisburseService } from '../services/ExpenseDisburseDataService';
import { travelService } from '../services/TravelDataService';
import { cwaService } from '../services/CivilWorksDataService';
import { costTransferService } from '../services/CostTransferDataService';
import { NavigationTab, AgencyContext, UserRole } from '../types';

interface SystemStats {
    latency: number;
    syncStatus: '100% SYNC' | 'PARTIAL' | 'OFFLINE';
    nodeId: string;
}

interface PlatformUser {
    role: UserRole;
    name: string;
    id: string;
}

interface PlatformContextType {
    services: {
        remis: typeof remisService;
        gl: typeof glService;
        funds: typeof fundsService;
        acquisition: typeof acquisitionService;
        expense: typeof expenseDisburseService;
        travel: typeof travelService;
        cwa: typeof cwaService;
        costTransfer: typeof costTransferService;
    };
    ui: {
        activeTab: NavigationTab;
        setActiveTab: (tab: NavigationTab) => void;
        agency: AgencyContext;
        setAgency: (agency: AgencyContext) => void;
        fiscalYear: number;
        setFiscalYear: (fy: number) => void;
        postingPeriod: string;
        setPostingPeriod: (period: string) => void;
    };
    navigation: {
        projectId: string | null;
        setProjectId: (id: string | null) => void;
        threadId: string | null;
        setThreadId: (id: string | null) => void;
        opId: string | null;
        setOpId: (id: string | null) => void;
    };
    system: SystemStats;
    user: PlatformUser;
    setUser: (user: PlatformUser) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
    const [agency, setAgency] = useState<AgencyContext>('ARMY_GFEBS');
    const [fiscalYear, setFiscalYear] = useState(2024);
    const [postingPeriod, setPostingPeriod] = useState('05');
    
    // Entity selection state
    const [projectId, setProjectId] = useState<string | null>(null);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [opId, setOpId] = useState<string | null>(null);

    const [system, setSystem] = useState<SystemStats>({ latency: 0.04, syncStatus: '100% SYNC', nodeId: 'AUTH_NODE_01' });
    
    const [user, setUser] = useState<PlatformUser>({
        role: 'G-8_ADMIN',
        name: 'MG FINANCE',
        id: 'U-001'
    });

    // Telemetry Sync simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setSystem(prev => ({
                ...prev,
                latency: Number((0.02 + Math.random() * 0.05).toFixed(3))
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const value = useMemo(() => ({
        services: {
            remis: remisService,
            gl: glService,
            funds: fundsService,
            acquisition: acquisitionService,
            expense: expenseDisburseService,
            travel: travelService,
            cwa: cwaService,
            costTransfer: costTransferService
        },
        ui: {
            activeTab, setActiveTab,
            agency, setAgency,
            fiscalYear, setFiscalYear,
            postingPeriod, setPostingPeriod
        },
        navigation: {
            projectId, setProjectId,
            threadId, setThreadId,
            opId, setOpId
        },
        system,
        user,
        setUser
    }), [activeTab, agency, fiscalYear, postingPeriod, system, projectId, threadId, opId, user]);

    return (
        <PlatformContext.Provider value={value}>
            {children}
        </PlatformContext.Provider>
    );
};

export const usePlatform = () => {
    const context = useContext(PlatformContext);
    if (!context) throw new Error('usePlatform must be used within PlatformProvider');
    return context;
};
