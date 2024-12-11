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
import LogoutLink from '../../creator-admin/components/LogoutLink/LogoutLink';
import { useDictionary } from '@/app/contexts/DictionaryContext';

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
      <nav className="flex items-center container font-semibold relative">
        <div className="mr-auto">
          <Logo size={currentBreakpoint as LogoProps['size']} />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <GrClose size={24} /> : <TiThMenu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-10">
          <Link className="text-lg" href="#features">
            {d.website.navbar.features}
          </Link>
          <Link className="text-lg" href="#pricing">
            {d.website.navbar.pricing}
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                className="text-lg text-orange-600"
                href={`/${lang}/${CreatorAdminRoutes.getBase()}`}
              >
                Admin
              </Link>
              <LogoutLink label={d.auth.logout} onSignOut={signOut} />
            </>
          ) : (
            <Button asChild>
              <Link href={`${lang}/auth`}> {d.auth.login}</Link>
            </Button>
          )}
          <div>
            <LocaleSwitcher curLang={lang} />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 left-0 bg-background/95 mt-6 p-4 shadow-lg md:hidden flex flex-col gap-4">
            <Link className="text-lg" href="#features">
              {d.website.navbar.features}
            </Link>
            <Link className="text-lg" href="#pricing">
              {d.website.navbar.pricing}
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  className="text-lg text-orange-600"
                  href={`/${lang}/${CreatorAdminRoutes.getBase()}`}
                >
                  {d.website.navbar.admin}
                </Link>
                <LogoutLink
                  label={d.auth.logout}
                  onSignOut={signOut}
                />
              </>
            ) : (
              <Button asChild className="w-full">
                <Link href={`${lang}/auth`}> {d.auth.login}</Link>
              </Button>
            )}
            <div>
              <LocaleSwitcher curLang={lang} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
