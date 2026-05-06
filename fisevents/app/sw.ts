/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import {
  Serwist,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
  CacheFirst,
  ExpirationPlugin,
} from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.mode === 'navigate',
      handler: new NetworkFirst({
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24,
          }),
        ],
      }),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }) =>
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/_next/image'),
      handler: new CacheFirst({
        cacheName: 'next-static',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          }),
        ],
      }),
    },
    {
      matcher: ({ url }) => url.hostname === 'cdn.sanity.io',
      handler: new StaleWhileRevalidate({
        cacheName: 'sanity-images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          }),
        ],
      }),
    },
    {
      matcher: ({ url }) => url.hostname === 'lh3.googleusercontent.com',
      handler: new StaleWhileRevalidate({
        cacheName: 'google-avatars',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          }),
        ],
      }),
    },
    {
      matcher: ({ request }) =>
        ['style', 'script', 'worker'].includes(request.destination),
      handler: new StaleWhileRevalidate({
        cacheName: 'static-resources',
      }),
    },
    {
      matcher: ({ request }) =>
        ['image', 'font'].includes(request.destination),
      handler: new StaleWhileRevalidate({
        cacheName: 'assets',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          }),
        ],
      }),
    },
  ],
  fallbacks: {
    entries: [],
  },
});

serwist.addEventListeners();

void defaultCache;
