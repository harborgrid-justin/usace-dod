import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Fix: Changed to extend React.Component explicitly to resolve 'Property state/props does not exist' errors.
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // Static method to update state so the next render shows the fallback UI
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Captures stack trace and additional error information
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("D-AFMP Critical Runtime Error:", error, errorInfo);
  }

  // Resets the error state to allow the user to try reloading the module
  handleTryAgain = () => {
    /* Fix: Ensured setState is correctly called on the instance */
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    /* Fix: State and Props are accessed via this */
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-500 p-8 text-center animate-in fade-in">
            <div className="p-4 bg-rose-50 rounded-full border border-rose-100 mb-6">
                <AlertTriangle size={32} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Module Encountered a Critical Error</h2>
            <p className="text-sm mt-2 max-w-md text-zinc-500">
                The requested module failed to initialize. This may be due to a network error or an internal authoritative data mismatch.
            </p>
            {this.state.error && (
                <div className="mt-4 p-3 bg-zinc-100 rounded-lg font-mono text-[10px] text-zinc-600 max-w-lg overflow-auto border border-zinc-200">
                    {this.state.error.message}
                </div>
            )}
            <button
                onClick={this.handleTryAgain}
                className="mt-8 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg"
            >
                Re-initialize Module
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
