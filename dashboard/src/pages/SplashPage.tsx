import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Auto-navigate after 2.5s if not clicked
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          navigate('/home');
        } else {
          navigate('/login');
        }
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  const handleContinue = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Brand Logo */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-2xl shadow-amber-500/20 border-2 border-amber-300">
          <ShieldAlert className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Safe<span className="text-amber-400">AR</span>
          </h1>
          <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-400">
            Industrial Safety Training Platform
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4 text-left">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Interactive 3D Hazard Simulation</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mandatory PPE Verification Checkpoints</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Virtual 5-Step Lockout/Tagout (LOTO)</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Blockchain-Verifiable Training Certificates</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={handleContinue}
          >
            {isAuthenticated ? 'Enter Home Dashboard' : 'Get Started & Login'}
          </Button>

          <p className="text-[11px] text-slate-500 font-mono">
            Auto-advancing in 3s... or tap above
          </p>
        </div>
      </div>
    </div>
  );
}
