import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder for the events data table while its chunk/data loads. */
export default function EventListSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4" aria-hidden="true">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border border-fe-outline-variant/20 px-4 py-3"
          >
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24 hidden sm:block" />
            <Skeleton className="h-4 w-16 hidden md:block" />
            <Skeleton className="h-8 w-8 rounded-md shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
