import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-black text-white font-mono">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Safety Hazard: Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The navigation coordinate or drill path you attempted to reach does not exist or has been relocated within the training facility.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => navigate('/home')}
        >
          Return to Home Dashboard
        </Button>
      </div>
    </div>
  );
}
