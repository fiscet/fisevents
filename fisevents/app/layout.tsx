import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { i18n } from '@/lib/i18n';
import './globals.css';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FisEvents — Turn your expertise into an experience',
    template: '%s | FisEvents',
  },
  description:
    'The all-in-one platform for creators to schedule, sell, and manage their events.',
  metadataBase: new URL('https://fisevents.vercel.app'),
  icons: {
    icon: [
      { url: '/img/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/img/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'FisEvents',
    images: [
      {
        url: '/img/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FisEvents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} ${plusJakartaSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
