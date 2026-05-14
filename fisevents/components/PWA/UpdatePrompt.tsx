'use client';

import { useEffect, useState } from 'react';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const dictionary = useDictionary();
  const pwa = (dictionary as unknown as {
    pwa?: {
      update: { title: string; description: string; cta: string; dismiss: string };
    };
  }).pwa;

  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;

    const handleStateChange = (worker: ServiceWorker) => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        setWaitingWorker(worker);
        setShow(true);
      }
    };

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        registration = reg;

        if (reg.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(reg.waiting);
          setShow(true);
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () =>
            handleStateChange(newWorker)
          );
        });
      })
      .catch(() => {
        // SW registration failed silently
      });

    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      void registration;
    };
  }, []);

  if (!pwa || !show || !waitingWorker) return null;

  const apply = () => {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-md rounded-2xl bg-fe-on-surface text-white shadow-2xl p-4 md:left-auto md:right-4 animate-in slide-in-from-bottom-4 fade-in"
    >
      <button
        type="button"
        onClick={() => setShow(false)}
        aria-label={pwa.update.dismiss}
        className="absolute top-2 right-2 p-1 text-white/60 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{pwa.update.title}</h3>
          <p className="mt-1 text-xs text-white/80 leading-relaxed">
            {pwa.update.description}
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" onClick={apply}>
              {pwa.update.cta}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => setShow(false)}
            >
              {pwa.update.dismiss}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
