import { FDefaultSession } from '@/types/custom.types';
import PrivacyCookiePolicyLink from './PrivacyCookiePolicyLink';
import ReportBugDialog from '@/app/[lang]/creator-admin/_components/ReportBug/ReportBugDialog';
import { NotificationProvider } from './Notification/NotificationContext';

export default function DefaultFooter({
  session,
  showBugReport = true,
}: {
  session?: FDefaultSession;
  showBugReport?: boolean;
}) {
  return (
    <NotificationProvider>
      <footer
        role="contentinfo"
        className="bg-fe-surface-container-low border-t border-fe-outline-variant/10 w-full"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <p className="text-xl font-headline font-extrabold tracking-tighter text-fe-primary">
            fisevents
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-fe-on-surface-variant">
            <p className="font-medium">
              &copy; {new Date().getFullYear()} FisEvents. All rights reserved.
            </p>
            <PrivacyCookiePolicyLink />
            {showBugReport && <ReportBugDialog session={session} />}
          </div>
        </div>
      </footer>
    </NotificationProvider>
  );
}
