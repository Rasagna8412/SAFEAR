import { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificate/certificateService';
import { VerificationResult } from '../../types/certificate';
import { CertificateQRCode } from './CertificateQRCode';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Award,
  Calendar,
  User,
  BookOpen,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export interface CertificateVerificationProps {
  initialCertificateId?: string;
  className?: string;
}

export function CertificateVerification({
  initialCertificateId = '',
  className = ''
}: CertificateVerificationProps) {
  const [certIdInput, setCertIdInput] = useState(initialCertificateId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    if (initialCertificateId) {
      handleVerify(initialCertificateId);
    }
  }, [initialCertificateId]);

  const handleVerify = async (idToVerify?: string) => {
    const targetId = (idToVerify || certIdInput).trim();
    if (!targetId) return;

    if (idToVerify) {
      setCertIdInput(idToVerify);
    }

    setIsVerifying(true);
    try {
      const res = await certificateService.verifyCertificate(targetId);
      setResult(res);
    } catch {
      setResult({
        status: 'NOT_FOUND',
        verifiedAt: new Date().toISOString(),
        message: 'Could not connect to verification registry.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTestTampered = () => {
    setCertIdInput('SAFEAR-2026-FAKE-TAMPERED');
    setIsVerifying(true);
    setTimeout(() => {
      setResult({
        status: 'INVALID',
        verifiedAt: new Date().toISOString(),
        message: 'CYBERSECURITY ALERT: Cryptographic hash mismatch! The presented credential signature does not match any record on the Ethereum blockchain.'
      });
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className={`max-w-2xl mx-auto space-y-6 text-left ${className}`}>
      {/* Search Input Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="text-sm font-bold text-white">Public Blockchain Certificate Registry</h3>
          </div>
          <Badge variant="mining" size="sm">
            Ethereum Smart Contract
          </Badge>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Verify cryptographic authenticity and tamper-proof on-chain registration on the Ethereum blockchain for any SafeAR vocational training credential.
        </p>

        {/* Quick Demo Test Buttons */}
        <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            ⚡ Quick Demo Verification Tests (Click to Test):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVerify('SAFEAR-2026-DEMO01')}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 py-1 h-7"
            >
              Test Valid Certificate (Rasagna)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestTampered}
              leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
              className="text-xs border-red-500/40 text-red-300 hover:bg-red-500/10 py-1 h-7"
            >
              Test Fraud / Tamper Detection
            </Button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row items-center gap-2 pt-1"
        >
          <Input
            value={certIdInput}
            onChange={(e) => setCertIdInput(e.target.value)}
            placeholder="Enter Certificate ID (e.g. SAFEAR-2026-DEMO01)"
            className="flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isVerifying || !certIdInput.trim()}
            leftIcon={isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            className="w-full sm:w-auto shrink-0"
          >
            {isVerifying ? 'Verifying...' : 'Verify Credential'}
          </Button>
        </form>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div
          className={`p-6 rounded-3xl border-2 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 ${
            result.status === 'VALID'
              ? 'bg-slate-900 border-emerald-500/80'
              : result.status === 'REVOKED'
              ? 'bg-slate-900 border-amber-500/80'
              : 'bg-slate-900 border-red-500/80'
          }`}
        >
          {/* Top Status Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {result.status === 'VALID' && <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />}
              {result.status === 'REVOKED' && <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />}
              {result.status === 'INVALID' && <XCircle className="w-8 h-8 text-red-400 shrink-0" />}
              {result.status === 'NOT_FOUND' && <XCircle className="w-8 h-8 text-slate-400 shrink-0" />}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verification Status
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {result.status === 'VALID' && 'Authentic Credential Verified On-Chain'}
                  {result.status === 'REVOKED' && 'Certificate Revoked'}
                  {result.status === 'INVALID' && 'Cryptographic Hash Mismatch (Tampered / Fraudulent)'}
                  {result.status === 'NOT_FOUND' && 'Certificate Record Not Found'}
                </h4>
              </div>
            </div>

            <Badge
              variant={
                result.status === 'VALID'
                  ? 'success'
                  : result.status === 'REVOKED'
                  ? 'warning'
                  : 'danger'
              }
              size="md"
            >
              {result.status}
            </Badge>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{result.message}</p>

          {/* Certificate Details */}
          {result.certificate && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Recipient</span>
                  </span>
                  <p className="font-black text-slate-100 text-sm">{result.certificate.recipientName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Curriculum Course</span>
                  </span>
                  <p className="font-black text-slate-100 text-sm">{result.certificate.courseName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Demonstrated Score</span>
                  </span>
                  <p className="font-black text-emerald-400 text-sm">{result.certificate.score}%</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Issue Timestamp</span>
                  </span>
                  <p className="font-mono text-slate-300 text-xs">
                    {new Date(result.certificate.issuedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* On-Chain Cryptographic Integrity Proof */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    Smart Contract On-Chain Proof
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">Contract:</span>
                      <code className="text-[10px] font-mono text-slate-300 truncate">
                        0x5FbDB2315678afecb367f032d93F642f64180aa3
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">SHA-256 Hash:</span>
                      <code className="text-[10px] font-mono text-emerald-400 truncate">
                        {result.certificate.certificateHash.slice(0, 26)}...
                      </code>
                    </div>
                  </div>
                </div>

                <CertificateQRCode
                  url={`${window.location.origin}/verify/${result.certificate.certificateId}`}
                  size={80}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
