
import React, { Suspense } from 'react';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ToastProvider } from './components/shared/ToastContext';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import ActiveViewRouter from './components/routing/ActiveViewRouter';

const AppInner: React.FC = () => {
  const { ui, navigation } = usePlatform();

  return (
    <div className="flex h-screen w-screen bg-zinc-50 overflow-hidden text-zinc-900">
      <Sidebar 
        isSidebarOpen={true} 
        isMobileMenuOpen={false} 
        setMobileMenuOpen={() => {}}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header 
            activeTab={ui.activeTab} 
            agency={ui.agency} 
            setMobileMenuOpen={() => {}} 
            notificationsOpen={false} 
            setNotificationsOpen={() => {}} 
        />
        <main className="flex-1 min-h-0 overflow-hidden relative">
          <ErrorBoundary>
            <Suspense fallback={<div className="p-8 text-xs font-bold uppercase animate-pulse flex items-center justify-center h-full">Resolving Fiduciary Domain...</div>}>
              <div className="h-full w-full overflow-hidden">
                  <ActiveViewRouter 
                    tab={ui.activeTab} 
                    agency={ui.agency}
                    projectId={navigation.projectId} 
                    setProjectId={navigation.setProjectId}
                    threadId={navigation.threadId} 
                    setThreadId={navigation.setThreadId}
                    opId={navigation.opId} 
                    setOpId={navigation.setOpId}
                    navigate={ui.setActiveTab}
                  />
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PlatformProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </PlatformProvider>
  );
};

export default App;
