'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Locale } from '@/lib/i18n';
import { CreatorAdminRoutes } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { TiThMenu } from 'react-icons/ti';
import { GrClose } from 'react-icons/gr';
import Link from 'next/link';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import LogoutLink from '../../creator-admin/_components/LogoutLink/LogoutLink';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import AdminLink from './AdminLink';
import Logo from '@/components/Logo';

export type NavBarProps = {
  lang: Locale;
  isLoggedIn: boolean;
};

export function NavBar({ lang, isLoggedIn }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const d = useDictionary();

  return (
    <header role="banner" className="glass-nav fixed top-0 w-full z-50">
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto"
      >
        {/* Brand logo */}
        <Logo linkTo={`/${lang}`} />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={`/${lang}/how-it-works`}
            className="text-sm font-medium text-fe-on-surface-variant hover:text-fe-on-surface transition-colors"
          >
            {d.website.navbar.howItWorks}
          </Link>
          <Link
            href={`/${lang}/pricing`}
            className="text-sm font-medium text-fe-on-surface-variant hover:text-fe-on-surface transition-colors"
          >
            {d.website.navbar.pricing}
          </Link>
          <Link
            href={`/${lang}/contacts`}
            className="text-sm font-medium text-fe-on-surface-variant hover:text-fe-on-surface transition-colors"
          >
            {d.website.navbar.contacts}
          </Link>
        </div>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-6">
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
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${lang}/auth`}>{d.auth.login}</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href={`/${lang}/auth`}>Start for free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-fe-on-surface hover:bg-fe-surface-container-low transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <GrClose size={20} /> : <TiThMenu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-fe-outline-variant/10 bg-fe-surface-container-lowest px-6 py-4 flex flex-col gap-4"
        >
          <nav className="flex flex-col gap-1">
            <Link
              href={`/${lang}/how-it-works`}
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-fe-on-surface-variant hover:text-fe-on-surface py-2 transition-colors"
            >
              {d.website.navbar.howItWorks}
            </Link>
            <Link
              href={`/${lang}/pricing`}
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-fe-on-surface-variant hover:text-fe-on-surface py-2 transition-colors"
            >
              {d.website.navbar.pricing}
            </Link>
            <Link
              href={`/${lang}/contacts`}
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-fe-on-surface-variant hover:text-fe-on-surface py-2 transition-colors"
            >
              {d.website.navbar.contacts}
            </Link>
          </nav>
          <div className="flex justify-between items-center border-t border-fe-outline-variant/10 pt-3">
            <LocaleSwitcher curLang={lang} />
          </div>
          {isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <AdminLink
                label={d.website.navbar.admin}
                href={`/${lang}/${CreatorAdminRoutes.getBase()}`}
              />
              <LogoutLink label={d.auth.logout} onSignOut={signOut} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start"
              >
                <Link
                  href={`/${lang}/auth`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {d.auth.login}
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link
                  href={`/${lang}/auth`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start for free
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
