import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060713] flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-2xl w-full glass p-8 rounded-3xl border border-red-500/20 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-red-400">Application Error</h2>
              <p className="text-slate-400 text-sm">Something went wrong while rendering this feature. Please try reloading or check the details below.</p>
            </div>
            
            {this.state.error && (
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 flex flex-col gap-3 font-mono text-xs text-red-300 overflow-x-auto max-h-[300px]">
                <p className="font-bold">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="whitespace-pre-wrap leading-relaxed opacity-85">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
            
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors mt-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
