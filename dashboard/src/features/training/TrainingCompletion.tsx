import { useState, useEffect } from 'react';
import { TrainingSession } from '../../types/trainingEngine';
import { CertificateRecord, CertificateStatus } from '../../types/certificate';
import { trainingResultRepository, TrainingResultRecord } from '../../services/repositories/trainingResultRepository';
import { certificateService } from '../../services/certificate/certificateService';
import { CertificateCard } from '../certificate/CertificateCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Award,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  RefreshCw,
  Database,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';

export interface TrainingCompletionProps {
  session: TrainingSession;
  scenarioTitle: string;
  onRestart: () => void;
  className?: string;
}

export function TrainingCompletion({
  session,
  scenarioTitle,
  onRestart,
  className = ''
}: TrainingCompletionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scoreState = session.scoreState;
  const finalScore = scoreState?.currentScore ?? 100;
  const isPassed = finalScore >= 70;

  const [persistStatus, setPersistStatus] = useState<'IDLE' | 'SAVING' | 'SAVED' | 'ERROR'>('SAVING');
  const [persistError, setPersistError] = useState<string | null>(null);
  const [savedRecord, setSavedRecord] = useState<TrainingResultRecord | null>(null);

  // Blockchain Certificate State
  const [certStatus, setCertStatus] = useState<CertificateStatus>('ELIGIBLE');
  const [issuedCertificate, setIssuedCertificate] = useState<CertificateRecord | null>(null);
  const [certError, setCertError] = useState<string | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);

  const saveResultToFirestore = async () => {
    setPersistStatus('SAVING');
    setPersistError(null);
    try {
      const record = await trainingResultRepository.saveResult(session);
      setSavedRecord(record);
      setPersistStatus('SAVED');
    } catch (err: any) {
      setPersistStatus('ERROR');
      setPersistError(err.message || 'Failed to persist training result to Cloud Firestore.');
    }
  };

  useEffect(() => {
    saveResultToFirestore();
  }, [session]);

  const handleIssueCertificate = async () => {
    if (!savedRecord || !isPassed) return;

    setIsIssuing(true);
    setCertStatus('GENERATING');
    setCertError(null);

    try {
      setCertStatus('REGISTERING');
      const recipient = user?.name ? user.name.replace(/\s*\([^)]*\)/g, '') : 'Rasagna';
      const { certificate } = await certificateService.issueCertificate(savedRecord, {
        recipientName: recipient,
        courseName: scenarioTitle,
        scenarioId: session.scenarioId,
        courseId: 'mining-safety-01'
      });

      setIssuedCertificate(certificate);
      setCertStatus('ISSUED');
    } catch (err: any) {
      setCertStatus('FAILED');
      setCertError(err.message || 'Blockchain certificate registration failed.');
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div
      className={`max-w-2xl mx-auto bg-slate-900/95 backdrop-blur-md border-2 ${
        isPassed ? 'border-emerald-500/80' : 'border-amber-500/80'
      } rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200 pointer-events-auto ${className}`}
    >
      {/* Trophy / Score Header */}
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl border-2 shadow-xl mb-2 ${
          isPassed
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20'
            : 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-amber-500/20'
        }`}
      >
        <Award className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant={isPassed ? 'success' : 'warning'} size="md">
            {isPassed ? 'Compliance Standard Met' : 'Remediation Recommended'}
          </Badge>
          <span className="text-xs font-mono font-bold text-slate-400">
            Pass Threshold: &ge;70%
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">{scenarioTitle}</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          {isPassed
            ? 'Congratulations! You have satisfied occupational safety competency requirements for this excavation chamber scenario.'
            : 'Review the deducted penalties below and restart the drill to achieve standard certification threshold.'}
        </p>
      </div>

      {/* Cloud Firestore Persistence Status Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Persistence Layer: Cloud Firestore</span>
          </span>

          {persistStatus === 'SAVING' && (
            <span className="text-amber-400 flex items-center gap-1 font-semibold">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Saving result...</span>
            </span>
          )}
          {persistStatus === 'SAVED' && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Result Saved (ID: {savedRecord?.resultId.slice(0, 14)}...)</span>
            </span>
          )}
          {persistStatus === 'ERROR' && (
            <span className="text-red-400 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Save Failed</span>
            </span>
          )}
        </div>

        {persistStatus === 'ERROR' && (
          <div className="flex items-center justify-between gap-3 pt-1 text-red-300">
            <p className="text-[11px]">{persistError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={saveResultToFirestore}
              leftIcon={<RefreshCw className="w-3 h-3" />}
              className="text-xs border-red-700 text-red-200"
            >
              Retry Save
            </Button>
          </div>
        )}
      </div>

      {/* Blockchain Certificate Issuance Section (When Passed >= 70%) */}
      {isPassed && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-left">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Blockchain Certificate Registry
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  Smart Contract: CertificateRegistry.sol (0x5FbDB23...80aa3)
                </p>
              </div>
            </div>

            <Badge variant={certStatus === 'ISSUED' ? 'success' : 'mining'} size="sm">
              {certStatus}
            </Badge>
          </div>

          {certStatus === 'ISSUED' && issuedCertificate ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between gap-2 flex-wrap">
                <span>
                  Certificate <strong>{issuedCertificate.certificateId}</strong> registered on-chain.
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/verify/${issuedCertificate.certificateId}`)}
                  leftIcon={<ExternalLink className="w-3.5 h-3.5 text-amber-400" />}
                  className="text-xs"
                >
                  Verify On-Chain
                </Button>
              </div>
              <CertificateCard certificate={issuedCertificate} />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-300">
                Generate a tamper-proof cryptographic credential registered permanently on the Ethereum blockchain.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleIssueCertificate}
                disabled={isIssuing || persistStatus !== 'SAVED'}
                leftIcon={
                  isIssuing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Award className="w-3.5 h-3.5" />
                  )
                }
                className="shrink-0"
              >
                {isIssuing ? 'Registering On-Chain...' : 'Issue On-Chain Certificate'}
              </Button>
            </div>
          )}

          {certError && (
            <p className="text-xs text-red-400 pt-1 font-semibold">{certError}</p>
          )}
        </div>
      )}

      {/* Main Score KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Card className="p-3 bg-slate-950 border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Final Score</span>
          <p
            className={`text-2xl sm:text-3xl font-black font-mono ${
              isPassed ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {finalScore}%
          </p>
          <p className="text-[10px] text-slate-400">Initial: 100%</p>
        </Card>

        <Card className="p-3 bg-slate-950 border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Correct Actions</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {scoreState?.correctActions ?? 0}
          </p>
          <p className="text-[10px] text-slate-400">0 penalty</p>
        </Card>

        <Card className="p-3 bg-slate-950 border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Violations</span>
          <p className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
            {(scoreState?.unsafeActions ?? 0) + (scoreState?.incorrectActions ?? 0)}
          </p>
          <p className="text-[10px] text-slate-400">Unsafe/Incorrect</p>
        </Card>

        <Card className="p-3 bg-slate-950 border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Deducted</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            -{scoreState?.totalPenalties ?? 0}
          </p>
          <p className="text-[10px] text-slate-400">Points</p>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="outline"
          size="md"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={onRestart}
          className="w-full sm:w-auto"
        >
          Restart Scenario Drill
        </Button>
        <Button
          variant="primary"
          size="md"
          leftIcon={<BookOpen className="w-4 h-4" />}
          onClick={() => navigate('/courses')}
          className="w-full sm:w-auto"
        >
          Return to Course Catalog
        </Button>
      </div>
    </div>
  );
}
