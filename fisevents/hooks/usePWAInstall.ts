'use client';

import { useEffect, useState, useCallback } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type Platform = 'android' | 'ios' | 'desktop' | 'unsupported';

const DISMISS_KEY = 'fe_pwa_install_dismissed_at';
const DISMISS_DAYS = 30;

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'unsupported';
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const isAndroid = /Android/.test(ua);
  if (isIOS) return 'ios';
  if (isAndroid) return 'android';
  return 'desktop';
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function wasRecentlyDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const ts = window.localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  const dismissedAt = parseInt(ts, 10);
  if (Number.isNaN(dismissedAt)) return false;
  const ageDays = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return ageDays < DISMISS_DAYS;
}

export function usePWAInstall() {
  const [platform, setPlatform] = useState<Platform>('unsupported');
  const [installed, setInstalled] = useState(false);
  const [canPromptAndroid, setCanPromptAndroid] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredEvent, setDeferredEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isStandalone());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setCanPromptAndroid(true);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (installed) return;
    if (wasRecentlyDismissed()) return;

    const timer = window.setTimeout(() => {
      if (platform === 'ios' || canPromptAndroid) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => window.clearTimeout(timer);
  }, [platform, canPromptAndroid, installed]);

  const triggerInstall = useCallback(async () => {
    if (!deferredEvent) return false;
    await deferredEvent.prompt();
    const choice = await deferredEvent.userChoice;
    setDeferredEvent(null);
    setCanPromptAndroid(false);
    setShowPrompt(false);
    return choice.outcome === 'accepted';
  }, [deferredEvent]);

  const dismiss = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }
    setShowPrompt(false);
  }, []);

  const open = useCallback(() => {
    if (installed) return;
    if (platform === 'ios' || canPromptAndroid) {
      setShowPrompt(true);
    }
  }, [installed, platform, canPromptAndroid]);

  return {
    platform,
    installed,
    showPrompt,
    canInstallAndroid: canPromptAndroid,
    triggerInstall,
    dismiss,
    open,
  };
}
