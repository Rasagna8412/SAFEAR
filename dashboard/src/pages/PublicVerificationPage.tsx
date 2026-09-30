import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificateService } from '../services/certificate/certificateService';
import { VerificationResult } from '../types/certificate';
import { CertificateCard } from '../features/certificate/CertificateCard';
import { CertificateVerification } from '../features/certificate/CertificateVerification';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, RefreshCw, Home } from 'lucide-react';

export function PublicVerificationPage() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (certificateId) {
      setIsLoading(true);
      certificateService
        .verifyCertificate(certificateId)
        .then((res) => setResult(res))
        .catch(() => {
          setResult({
            status: 'NOT_FOUND',
            verifiedAt: new Date().toISOString(),
            message: 'Failed to query blockchain certificate registry.'
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-start space-y-8">
      {/* Top Brand Header */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-wider">SAFEAR</h1>
            <p className="text-[10px] text-slate-400 font-mono">Public Verification Portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="mining" size="sm">
            Ethereum Testnet Registry
          </Badge>
          <Link to="/courses">
            <Button variant="ghost" size="sm" leftIcon={<Home className="w-4 h-4" />}>
              Catalog
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl space-y-8">
        {isLoading ? (
          <div className="p-12 text-center space-y-3 bg-slate-900 rounded-3xl border border-slate-800">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-200">
              Querying on-chain cryptographic proofs from CertificateRegistry.sol...
            </p>
          </div>
        ) : result && result.certificate ? (
          <div className="space-y-6">
            <CertificateCard certificate={result.certificate} />
          </div>
        ) : (
          <CertificateVerification initialCertificateId={certificateId || ''} />
        )}
      </main>
    </div>
  );
}
