import { useAuth } from '../services/auth/AuthContext';
import { useTranslation } from '../i18n/I18nContext';
import { WorkerDashboard } from '../features/dashboard/WorkerDashboard';
import { TrainerDashboard } from '../features/dashboard/TrainerDashboard';
import { AdminDashboard } from '../features/dashboard/AdminDashboard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Sparkles } from 'lucide-react';

export function HomePage() {
  const { user, loginAsDemo } = useAuth();
  const { t } = useTranslation();
  const role = user?.role || 'Worker';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Dev Quick Role Switcher Toolbar */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-slate-300">{t.activeRole}:</span>
          <Badge
            variant={role === 'Admin' ? 'warning' : role === 'Trainer' ? 'info' : 'mining'}
            size="sm"
          >
            {role === 'Admin' ? t.roleAdmin : role === 'Trainer' ? t.roleTrainer : t.roleWorker}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-500 font-mono uppercase">{t.switchRoleView}:</span>
          <Button
            variant={role === 'Worker' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => loginAsDemo('Worker')}
            className="text-xs py-1 px-2.5 h-7"
          >
            {t.demoLoginWorker}
          </Button>
          <Button
            variant={role === 'Trainer' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => loginAsDemo('Trainer')}
            className="text-xs py-1 px-2.5 h-7"
          >
            {t.demoLoginTrainer}
          </Button>
          <Button
            variant={role === 'Admin' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => loginAsDemo('Admin')}
            className="text-xs py-1 px-2.5 h-7"
          >
            {t.demoLoginAdmin}
          </Button>
        </div>
      </div>

      {/* Role-Specific Dynamic Dashboard View */}
      {role === 'Admin' && <AdminDashboard />}
      {role === 'Trainer' && <TrainerDashboard />}
      {role === 'Worker' && <WorkerDashboard />}
    </div>
  );
}

export default HomePage;
