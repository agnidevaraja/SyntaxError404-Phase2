import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleFullReset = () => {
    try {
      localStorage.removeItem('outstand_diagnostic_submission');
      localStorage.removeItem('outstand_economics_diagnostic_submission');
      localStorage.removeItem('outstand_auth_role');
      localStorage.removeItem('outstand_facilitator_subject');
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {this.props.fallbackTitle || 'Unexpected View State Encountered'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The application intercepted a runtime display error. You can recover immediately by refreshing the view or resetting cached diagnostic state below.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto max-h-36">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1 font-sans">
                  Diagnostic Telemetry:
                </span>
                {import.meta.env.DEV
                  ? (this.state.error.message || String(this.state.error))
                  : 'An unexpected application exception occurred. Full error telemetry has been captured.'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Recovering View</span>
              </button>

              <button
                onClick={this.handleFullReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-750 text-white font-bold text-xs rounded-xl border border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Reset Diagnostic Cache & Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
