import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';

// Safeguard for cached/broken component rendering
(window as any).isStripeAllowed = false;

import './i18n';
import { App } from './App';
import { APP_VERSION } from './types';
import { useAppStore } from './useAppStore';
import { TelemetryService } from './services/telemetryService';

// Tymczasowe obejście (Catching errors) dla Service Workera
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('SW registered successfully:', reg.scope);
      })
      .catch(err => {
        // Obsłuż błąd tak, aby aplikacja działała dalej bez trybu offline
        console.warn('Service Worker registration failed softly (App runs in online-only mode):', err);
      });
  });
}

// App initialization handled within App.tsx useEffect
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    console.log(`Christian Culture App v${APP_VERSION} Error. Please report.`); // Użycie APP_VERSION
    TelemetryService.logError(error, { errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-8 font-sans relative overflow-hidden" style={{fontFamily: 'sans-serif', backgroundColor: '#09090b', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div className="absolute inset-0 opacity-30" style={{background: 'radial-gradient(circle at top, rgba(197,160,89,0.3) 0%, transparent 70%)'}}></div>
          
          <div className="relative z-10 p-10 max-w-2xl w-full border border-[#C5A059]/30 rounded-3xl flex flex-col items-center text-center shadow-2xl" style={{backgroundColor: 'rgba(24, 24, 27, 0.4)', backdropFilter: 'blur(24px)'}}>
             <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-red-500/20" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)'}}>
               <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: '#ef4444'}}>
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             
             <h1 className="text-3xl font-black uppercase tracking-widest mb-4 drop-shadow-lg" style={{color: '#E2B859', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '900', fontSize: '24px'}}>Błąd Aplikacji</h1>
             
             <p className="text-zinc-400 mb-6 font-medium" style={{color: '#a1a1aa', marginBottom: '24px', fontWeight: '500'}}>
               Przepraszamy za błąd, cały czas pracujemy nad rozwojem platformy Christian Culture. Może chcesz nam w tym pomóc?
             </p>
             
             <a href="https://chat.whatsapp.com/KiNyDmllfyM8TI6xwDe7L2" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block',
                marginBottom: '24px',
                padding: '12px 32px', 
                backgroundColor: '#25D366', 
                color: '#fff', 
                textDecoration: 'none',
                borderRadius: '12px', 
                fontWeight: '900',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
             }}>
                Napisz do nas
             </a>
             
             <pre className="max-w-full overflow-auto text-left w-full" style={{
               backgroundColor: 'rgba(0,0,0,0.6)', 
               padding: '24px', 
               borderRadius: '16px', 
               color: '#ef4444', 
               fontSize: '12px',
               border: '1px solid rgba(63, 63, 70, 0.5)',
               marginBottom: '32px',
               whiteSpace: 'pre-wrap',
               fontFamily: 'monospace'
             }}>
               {this.state.error?.message || 'Nieznany błąd'}
             </pre>
             
             <button 
               onClick={() => window.location.reload()} 
               className="active:scale-95 transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] cursor-pointer"
               style={{
                 marginTop: '10px', 
                 padding: '16px 40px', 
                 backgroundColor: '#C5A059', 
                 color: '#000', 
                 border: 'none', 
                 borderRadius: '16px', 
                 cursor: 'pointer',
                 fontWeight: '900',
                 fontSize: '12px',
                 textTransform: 'uppercase',
                 letterSpacing: '1px'
               }}>
               Zrób to dla Jezusa – Otwórz ponownie
             </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);