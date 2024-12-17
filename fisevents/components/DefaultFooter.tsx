import { Locale } from '@/lib/i18n';
import PrivacyCookiePolicyLink from './PrivacyCookiePolicyLink';

export default function DefaultFooter({ lang }: { lang?: Locale }) {
  return (
    <footer className="flex justify-center items-center gap-x-2 bg-gray-100 text-gray-600 text-sm py-6">
      <p>&copy; {new Date().getFullYear()} FisEvents. All rights reserved.</p>
      <p>
        <PrivacyCookiePolicyLink />
      </p>
    </footer>
  );
}
