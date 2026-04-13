import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { i18n, Locale } from '@/lib/i18n';
import './globals.css';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FisEvents',
  description: 'Manage your events',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
