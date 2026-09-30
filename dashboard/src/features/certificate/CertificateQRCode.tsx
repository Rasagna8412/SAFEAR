import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export interface CertificateQRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export function CertificateQRCode({
  url,
  size = 128,
  className = ''
}: CertificateQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((dataUrl) => {
        if (isMounted) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (isMounted) setQrDataUrl(null);
      });

    return () => {
      isMounted = false;
    };
  }, [url, size]);

  if (!qrDataUrl) {
    return (
      <div
        className={`w-28 h-28 rounded-xl bg-slate-800 animate-pulse flex items-center justify-center text-[10px] text-slate-400 ${className}`}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <div className={`p-2 bg-white rounded-xl shadow-lg inline-block ${className}`}>
      <img
        src={qrDataUrl}
        alt="Public Verification QR Code"
        width={size}
        height={size}
        className="block rounded-lg"
      />
    </div>
  );
}
