import { Skeleton } from '@/components/ui/skeleton';

/** Mirrors the layout of PublicEvent so the page shell appears instantly. */
export default function PublicEventSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      {/* Hero */}
      <Skeleton className="w-full h-56 sm:h-72 md:h-80 rounded-2xl mb-6" />

      {/* CTA row */}
      <div className="flex flex-wrap items-center gap-3 mt-2 mb-10">
        <Skeleton className="h-11 w-40 rounded-full" />
        <Skeleton className="h-11 w-44 rounded-full" />
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Location bar */}
      <Skeleton className="h-12 rounded-xl mb-6" />

      {/* Description */}
      <div className="py-6 border-t border-fe-outline-variant/20 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Organized by */}
      <div className="flex items-center gap-3 mt-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}
