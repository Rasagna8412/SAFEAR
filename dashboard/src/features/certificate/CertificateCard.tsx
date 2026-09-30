import { CertificateRecord } from '../../types/certificate';
import { CertificateQRCode } from './CertificateQRCode';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface CertificateCardProps {
  certificate: CertificateRecord;
  className?: string;
}

export function CertificateCard({
  certificate,
  className = ''
}: CertificateCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const fullVerifyUrl = `${window.location.origin}${certificate.verificationUrl}`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.certificateHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-500/40 p-6 sm:p-10 shadow-2xl space-y-6 text-center text-white overflow-hidden ${className}`}
    >
      {/* Decorative Guilloche-style background glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Seal */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2 text-left">
          <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              SafeAR Certification Standard
            </h4>
            <p className="text-[10px] text-slate-400">On-Chain Verified Occupational Credential</p>
          </div>
        </div>

        <Badge variant="success" size="md">
          {certificate.status}
        </Badge>
      </div>

      {/* Title & Recipient */}
      <div className="space-y-3 py-2">
        <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
          This Certifies That
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-amber-300 tracking-tight">
          {certificate.recipientName}
        </h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Has successfully demonstrated occupational safety competency and protocol mastery in:
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {certificate.courseName}
        </h3>
      </div>

      {/* Score & Issue Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-left text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Final Score</span>
          <span className="font-mono text-base font-black text-emerald-400">
            {certificate.score}%
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Certificate ID</span>
          <span className="font-mono text-xs font-bold text-amber-300">
            {certificate.certificateId}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Issued Date</span>
          <span className="font-mono text-xs text-slate-300">
            {new Date(certificate.issuedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Blockchain Proof Pill & QR Code Section */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Award className="w-4 h-4" />
            <span>Ethereum Blockchain Integrity Proof</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 block font-mono">SHA-256 Digest:</span>
            <div className="flex items-center gap-2">
              <code className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate block max-w-[220px] sm:max-w-xs">
                {certificate.certificateHash}
              </code>
              <button
                onClick={handleCopyHash}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                title="Copy Hash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[10px] text-slate-400 block font-mono">Transaction Hash:</span>
            <code className="text-[10px] font-mono text-slate-400 truncate block max-w-[220px] sm:max-w-xs">
              {certificate.blockchainTransactionHash.slice(0, 24)}...
            </code>
          </div>
        </div>

        {/* Live Public Verification QR */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          <CertificateQRCode url={fullVerifyUrl} size={96} />
          <span className="text-[9px] font-mono text-slate-400">Scan to Verify</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/verify/${certificate.certificateId}`)}
          leftIcon={<ExternalLink className="w-4 h-4 text-amber-400" />}
          className="w-full sm:w-auto"
        >
          Open Public Verification
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<FileText className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Print / PDF Export
        </Button>
      </div>
    </div>
  );
}
