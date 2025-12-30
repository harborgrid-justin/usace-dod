import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, ShieldAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * ErrorBoundary
 * Catch-all domain for handling runtime exceptions with technical precision.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: ''
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Unknown domain execution error';
        
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("D-AFMP Critical Runtime Exception:", error, errorInfo);
  }

  /**
   * Reset the boundary state to attempt recovery
   */
  handleTryAgain = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 p-8 text-center animate-in fade-in">
          <div className="p-3 bg-rose-50 rounded-md border border-rose-200 mb-6 shadow-sm">
            <AlertTriangle size={24} className="text-rose-600" />
          </div>
          <h2 className="text-lg font-black text-zinc-900 uppercase tracking-widest">Module Initialization Error</h2>
          <p className="text-xs mt-2 max-w-md text-zinc-500 font-mono">
            The platform encountered a protocol mismatch or an illegal instruction while rendering this domain.
          </p>
          
          <div className="mt-8 p-4 bg-white border border-zinc-200 rounded-md font-mono text-[10px] text-zinc-600 max-w-lg w-full overflow-auto shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold uppercase tracking-wider">
              <ShieldAlert size={12} />
              Runtime Trace
            </div>
            <div className="p-2 bg-zinc-50 rounded-sm border border-zinc-100 break-all">
                {this.state.errorMessage}
            </div>
          </div>

          <button
            onClick={this.handleTryAgain}
            className="mt-8 px-6 py-2.5 bg-zinc-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-md flex items-center gap-2 active:scale-95 border border-zinc-950"
          >
            <RefreshCcw size={14} /> Re-Initialize Domain
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;