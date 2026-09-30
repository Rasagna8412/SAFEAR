import { useAuth } from '../../services/auth/AuthContext';
import { UserRole } from '../../types/auth';
import { Wrench, Shield, UserCheck, X } from 'lucide-react';
import { useState } from 'react';

export function DevBanner() {
  const { user, loginAsDemo } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Security Gate: Strict role check - NEVER show dev mode switcher to non-admin users or public
  const isDevToolbarEnabled = typeof window !== 'undefined' && localStorage.getItem('safear_enable_admin_dev_toolbar') === 'true';
  if (!user || user.role !== 'Admin' || !isDevToolbarEnabled || isDismissed) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-3 py-1.5 text-xs text-amber-300 flex flex-wrap items-center justify-between gap-2 z-40">
      <div className="flex items-center gap-2 font-medium">
        <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-bold uppercase tracking-wider text-amber-400">ADMIN DIAGNOSTIC BAR</span>
        <span className="text-slate-400 hidden sm:inline">|</span>
        <span className="text-slate-300 hidden sm:inline">Authorized Administrator Only</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 hidden md:inline">Role Simulator:</span>
        {(['Worker', 'Trainer', 'Admin'] as UserRole[]).map((role) => {
          const isActive = user?.role === role;
          return (
            <button
              key={role}
              onClick={() => loginAsDemo(role)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400/50 hover:text-white'
              }`}
              title={`Switch to ${role} demo account`}
            >
              {role === 'Worker' && <UserCheck className="w-3 h-3 inline mr-1" />}
              {role === 'Trainer' && <Shield className="w-3 h-3 inline mr-1" />}
              {role === 'Admin' && <Wrench className="w-3 h-3 inline mr-1" />}
              {role}
            </button>
          );
        })}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-0.5 rounded"
          title="Hide Diagnostic Bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
