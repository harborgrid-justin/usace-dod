
import React, { useState, useCallback, Suspense, useTransition } from 'react';
import { NavigationTab, AgencyContext } from './types';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ToastProvider } from './components/shared/ToastContext';
import ActiveViewRouter from './components/routing/ActiveViewRouter';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [agency, setAgency] = useState<AgencyContext>('ARMY_GFEBS');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedContingencyOpId, setSelectedContingencyOpId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const navigateToTab = useCallback((tab: NavigationTab) => {
    startTransition(() => setActiveTab(tab));
  }, []);

  return (
    <ToastProvider>
      <div className={`flex h-screen bg-zinc-50 overflow-hidden ${isPending ? 'opacity-80 grayscale-[0.2]' : ''}`}>
        <Sidebar 
          activeTab={activeTab} setActiveTab={navigateToTab} 
          agency={agency} setAgency={(a) => startTransition(() => setAgency(a))}
          isSidebarOpen={true} isMobileMenuOpen={false} setMobileMenuOpen={() => {}}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header activeTab={activeTab} agency={agency} setMobileMenuOpen={() => {}} notificationsOpen={false} setNotificationsOpen={() => {}} />
          <main className="flex-1 overflow-hidden relative">
            <ErrorBoundary>
              <Suspense fallback={<div className="p-8 text-xs font-bold uppercase">Resolving Domain...</div>}>
                <ActiveViewRouter 
                  tab={activeTab} agency={agency}
                  projectId={selectedProjectId} setProjectId={setSelectedProjectId}
                  threadId={selectedThreadId} setThreadId={setSelectedThreadId}
                  opId={selectedContingencyOpId} setOpId={setSelectedContingencyOpId}
                  navigate={navigateToTab}
                />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;
