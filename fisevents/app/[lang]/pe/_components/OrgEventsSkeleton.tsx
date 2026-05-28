import { Skeleton } from '@/components/ui/skeleton';

/** Grid of card placeholders for the organization's public events page. */
export default function OrgEventsSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-8 w-56 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-fe-outline-variant/20 overflow-hidden"
          >
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full rounded-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
