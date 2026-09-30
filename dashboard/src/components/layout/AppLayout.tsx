import { ReactNode } from 'react';
import { Header } from './Header';
import { DevBanner } from './DevBanner';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Dev Mode Banner */}
      <DevBanner />

      {/* Main App Header */}
      <Header />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Industrial Safety Disclaimer Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-2 text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-slate-300">Safety Notice:</strong> SafeAR is a vocational training simulator and does not connect to or control live industrial machinery. Completion does not replace mandatory workplace safety protocols.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-medium shrink-0">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SafeAR v1.0.0 (Phase 1)</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
