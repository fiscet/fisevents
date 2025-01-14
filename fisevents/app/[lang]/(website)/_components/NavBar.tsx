'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useCurrentBreakpoint } from '@/hooks/useCurrentBreakpoint';
import { Locale } from '@/lib/i18n';
import { CreatorAdminRoutes } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import Logo, { LogoProps } from '@/components/Logo';
import { TiThMenu } from 'react-icons/ti';
import { GrClose } from 'react-icons/gr';
import Link from 'next/link';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import LogoutLink from '../../creator-admin/_components/LogoutLink/LogoutLink';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import AdminLink from './AdminLink';

export type NavBarProps = {
  lang: Locale;
  isLoggedIn: boolean;
};

export function NavBar({ lang, isLoggedIn }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const d = useDictionary();
  const currentBreakpoint = useCurrentBreakpoint();

  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center justify-between container font-semibold relative">
        <div className="flex-grow w-1/3">
          <Logo size={currentBreakpoint as LogoProps['size']} />
        </div>

        {/* Desktop Login button */}
        {!isLoggedIn && (
          <div className="hidden md:block text-center flex-grow w-1/3">
            <Button size="lg" asChild>
              <Link href={`/${lang}/auth`}> {d.auth.login}</Link>
            </Button>
          </div>
        )}

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <GrClose size={24} /> : <TiThMenu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex justify-end items-center gap-x-10 flex-grow w-1/3">
          {/* <Link className="text-lg" href="/#features">
            {d.website.navbar.features}
          </Link>
          <Link className="text-lg" href="/#pricing">
            {d.website.navbar.pricing}
          </Link> */}
          <LocaleSwitcher curLang={lang} />
          {isLoggedIn && (
            <>
              <AdminLink
                label={d.website.navbar.admin}
                href={`/${lang}/${CreatorAdminRoutes.getBase()}`}
              />
              <LogoutLink label={d.auth.logout} onSignOut={signOut} />
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 left-0 bg-background/95 mt-6 p-4 shadow-lg md:hidden flex flex-col gap-4">
            {/* <Link className="text-lg" href="/#features">
              {d.website.navbar.features}
            </Link>
            <Link className="text-lg" href="/#pricing">
              {d.website.navbar.pricing}
            </Link> */}
            <div className="flex justify-between items-center">
              <LocaleSwitcher curLang={lang} />
              {isLoggedIn ? (
                <>
                  <AdminLink
                    label={d.website.navbar.admin}
                    href={`/${lang}/${CreatorAdminRoutes.getBase()}`}
                  />
                  <LogoutLink label={d.auth.logout} onSignOut={signOut} />
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/${lang}/auth`}> {d.auth.login}</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
