import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { i18n, Locale } from '@/lib/i18n';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FisEvents',
  description: 'Manage your events'
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
