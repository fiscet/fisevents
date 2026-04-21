import { EVENT_FILTERS } from '@/types/custom.types';
import { cn } from '@/lib/utils';

export type EventListFilterProps = {
  title: string;
  filter: (typeof EVENT_FILTERS)[number];
  filterText: { [index in (typeof EVENT_FILTERS)[number]]: string };
  setFilter: (filter: (typeof EVENT_FILTERS)[number]) => void;
};

type EventListFilterItemProps = {
  filter: (typeof EVENT_FILTERS)[number];
  label: string;
  isActive: boolean;
  setFilter: (flt: (typeof EVENT_FILTERS)[number]) => void;
};

export default function EventListFilter({
  title,
  filter,
  filterText,
  setFilter,
}: EventListFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
      <span className="text-sm font-label font-semibold text-fe-on-surface-variant uppercase tracking-widest">
        {title}
      </span>
      <div className="flex items-center gap-1">
        <EventListFilterItem
          filter="all"
          setFilter={setFilter}
          label={filterText.all}
          isActive={filter === 'all'}
        />
        <EventListFilterItem
          filter="published"
          setFilter={setFilter}
          label={filterText.published}
          isActive={filter === 'published'}
        />
        <EventListFilterItem
          filter="registrations_open"
          setFilter={setFilter}
          label={filterText.registrations_open}
          isActive={filter === 'registrations_open'}
        />
        <EventListFilterItem
          filter="finished"
          setFilter={setFilter}
          label={filterText.finished}
          isActive={filter === 'finished'}
        />
      </div>
    </div>
  );
}

function EventListFilterItem({
  filter,
  label,
  isActive,
  setFilter,
}: EventListFilterItemProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-xl py-1.5 px-3 text-sm font-medium cursor-pointer transition-colors',
        isActive
          ? 'bg-fe-primary text-fe-on-primary'
          : 'text-fe-on-surface-variant hover:text-fe-on-surface hover:bg-fe-surface-container-low'
      )}
      onClick={() => setFilter(filter)}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
