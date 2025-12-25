import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("D-AFMP Module Error Catch:", error, errorInfo);
  }

  handleTryAgain = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-500 p-4 text-center">
            <AlertTriangle size={32} className="mb-4 text-rose-400" />
            <h2 className="text-lg font-bold text-zinc-700">Module Failed to Load</h2>
            <p className="text-sm mt-1">A critical error occurred in this section of the application.</p>
            <button
                onClick={this.handleTryAgain}
                className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase hover:bg-zinc-700 transition-colors"
            >
                Try Again
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;