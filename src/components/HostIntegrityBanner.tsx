import React, { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, ShieldAlert } from 'lucide-react';
import { isHostAuthorized, logHostIntegrityCheck } from '../lib/hostIntegrityGuard';

export const HostIntegrityBanner: React.FC = () => {
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [hostname, setHostname] = useState('');

  useEffect(() => {
    const authorized = isHostAuthorized();
    logHostIntegrityCheck();

    if (!authorized) {
      setIsUnauthorized(true);
      setHostname(window.location.hostname || 'desconhecido');
    }
  }, []);

  if (!isUnauthorized) {
    return null;
  }

  return (
    <>
      {/* Top Banner Alert on Unauthorized Mirrors */}
      <aside
        role="alert"
        aria-live="assertive"
        className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white border-b-2 border-red-500 shadow-2xl px-4 py-3 text-xs md:text-sm font-mono backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-red-300 uppercase tracking-wide">
                Espelho Não Autorizado / Unauthorized Mirror:
              </span>{' '}
              <span className="text-zinc-200">
                Este domínio (<code className="text-red-200 underline">{hostname}</code>) é uma cópia não autorizada.
                O portfólio, código e modelos de IA foram desenvolvidos por{' '}
                <strong className="text-white">Julio Cesar Reis Filho (@byte-od)</strong>.
              </span>
            </div>
          </div>
          <a
            href="https://byte-od.github.io"
            target="_self"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-400 text-black font-bold text-xs rounded transition-all shadow-md hover:scale-105"
          >
            Acessar Original Autorizado
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* Floating Watermark Badge on Unauthorized Clones */}
      <div className="fixed bottom-4 left-4 z-[9999] pointer-events-auto bg-black/90 border border-red-500/80 px-3 py-2 rounded shadow-2xl text-[11px] font-mono text-zinc-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        <span>
          Cópia não autorizada de{' '}
          <a
            href="https://byte-od.github.io"
            className="text-[#adff2f] hover:underline font-semibold"
          >
            byte-od.github.io
          </a>
        </span>
      </div>
    </>
  );
};
