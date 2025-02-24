import { FDefaultSession } from '@/types/custom.types';
import PrivacyCookiePolicyLink from './PrivacyCookiePolicyLink';
import ReportBugDialog from '@/app/[lang]/creator-admin/_components/ReportBug/ReportBugDialog';
import { NotificationProvider } from './Notification/NotificationContext';

export default function DefaultFooter({
  session,
  showBugReport = true
}: {
  session?: FDefaultSession;
  showBugReport?: boolean;
}) {
  return (
    <NotificationProvider>
      <footer className="flex flex-col md:flex-row justify-center items-center gap-3 bg-gray-100 text-gray-600 text-sm py-6">
        <p>&copy; {new Date().getFullYear()} FisEvents. All rights reserved.</p>
        <PrivacyCookiePolicyLink />
        {showBugReport && <ReportBugDialog session={session} />}
      </footer>
    </NotificationProvider>
  );
}
