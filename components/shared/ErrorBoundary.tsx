
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * ErrorBoundary
 * catch-all domain for handling runtime exceptions.
 */
// Use Component directly to ensure generic types are correctly associated with class members
class ErrorBoundary extends Component<Props, State> {
  // Explicit state declaration and initialization resolves property lookup issues such as 'state' and 'props'
  state: State = { 
    hasError: false, 
    errorMessage: '' 
  };

  static getDerivedStateFromError(error: any): State {
    const message = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Unknown domain execution error';
        
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("D-AFMP Critical Runtime Exception:", error, errorInfo);
  }

  handleTryAgain = () => {
    // setState is inherited from Component<Props, State>
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    // state is inherited from Component<Props, State> and correctly typed via generics
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 p-8 text-center animate-in fade-in">
          <div className="p-4 bg-rose-50 rounded-[24px] border border-rose-100 mb-6 shadow-sm">
            <AlertTriangle size={32} className="text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Module Initialization Error</h2>
          <p className="text-sm mt-3 max-w-md text-zinc-500 leading-relaxed font-medium">
            The platform encountered a protocol mismatch or an illegal instruction while rendering this domain.
          </p>
          
          <div className="mt-6 p-4 bg-white border border-zinc-200 rounded-2xl font-mono text-[11px] text-zinc-600 max-w-lg w-full overflow-auto shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-rose-600 font-bold uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              Runtime Trace
            </div>
            {this.state.errorMessage}
          </div>

          <button
            onClick={this.handleTryAgain}
            className="mt-8 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center gap-2 active:scale-95"
          >
            <RefreshCcw size={14} /> Re-Initialize Domain
          </button>
        </div>
      );
    }

    // props is inherited from Component<Props, State> and provides access to children
    return this.props.children;
  }
}

export default ErrorBoundary;
