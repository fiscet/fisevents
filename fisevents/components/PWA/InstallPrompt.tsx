'use client';

import { useDictionary } from '@/app/contexts/DictionaryContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Share, Plus, X } from 'lucide-react';

export default function InstallPrompt() {
  const dictionary = useDictionary();
  const pwa = (dictionary as unknown as {
    pwa?: {
      install: {
        android: { title: string; description: string; cta: string; dismiss: string };
        ios: {
          title: string;
          intro: string;
          step1: string;
          step2: string;
          step3: string;
          close: string;
          remind_later: string;
        };
      };
    };
  }).pwa;

  const { platform, installed, showPrompt, canInstallAndroid, triggerInstall, dismiss } =
    usePWAInstall();

  if (!pwa || installed || !showPrompt) return null;

  if (platform === 'android' && canInstallAndroid) {
    return (
      <div
        role="dialog"
        aria-labelledby="pwa-install-title"
        className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-4 md:left-auto md:right-4 md:bottom-4 animate-in slide-in-from-bottom-4 fade-in"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={pwa.install.android.dismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-fe-surface-container-lowest flex items-center justify-center">
            <Download className="w-5 h-5 text-fe-on-surface" />
          </div>
          <div className="flex-1">
            <h3
              id="pwa-install-title"
              className="text-sm font-semibold text-gray-900"
            >
              {pwa.install.android.title}
            </h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              {pwa.install.android.description}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  void triggerInstall();
                }}
              >
                {pwa.install.android.cta}
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>
                {pwa.install.android.dismiss}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (platform === 'ios') {
    return (
      <Dialog
        open={showPrompt}
        onOpenChange={(open) => {
          if (!open) dismiss();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{pwa.install.ios.title}</DialogTitle>
            <DialogDescription>{pwa.install.ios.intro}</DialogDescription>
          </DialogHeader>

          <ol className="space-y-4 mt-2">
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-fe-surface-container-lowest flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <div className="flex-1 flex items-start gap-2">
                <Share className="shrink-0 w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-gray-700">{pwa.install.ios.step1}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-fe-surface-container-lowest flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <div className="flex-1 flex items-start gap-2">
                <Plus className="shrink-0 w-5 h-5 text-gray-700 mt-0.5" />
                <p className="text-sm text-gray-700">{pwa.install.ios.step2}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-fe-surface-container-lowest flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{pwa.install.ios.step3}</p>
              </div>
            </li>
          </ol>

          <DialogFooter className="mt-4 gap-2 sm:gap-2">
            <Button variant="ghost" onClick={dismiss}>
              {pwa.install.ios.remind_later}
            </Button>
            <Button onClick={dismiss}>{pwa.install.ios.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
