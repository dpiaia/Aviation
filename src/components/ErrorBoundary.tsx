import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('flydiary_flights');
      localStorage.removeItem('flydiary_profile');
      localStorage.removeItem('flydiary_user');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
            <div className="w-16 h-16 bg-[#EC6726]/10 border border-[#EC6726]/30 rounded-full flex items-center justify-center mx-auto text-[#EC6726]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Ocorreu um erro ao carregar a aplicação
              </h1>
              <p className="text-sm text-slate-400">
                A aplicação encontrou uma falha inesperada durante a renderização do painel.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-left font-mono text-xs text-rose-400 overflow-x-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar Página
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#EC6726] hover:bg-[#d8581a] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#EC6726]/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Resetar Dados
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
