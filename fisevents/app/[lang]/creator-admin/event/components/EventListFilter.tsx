import { EVENT_FILTERS } from '@/types/custom.types';

export type EventListFilterProps = {
  title: string;
  filter: typeof EVENT_FILTERS[number];
  filterText: { [index in typeof EVENT_FILTERS[number]]: string };
  setFilter: (filter: typeof EVENT_FILTERS[number]) => void;
};

type EventListFilterItemProps = {
  filter: typeof EVENT_FILTERS[number];
  label: string;
  isActive: boolean;
  setFilter: (flt: typeof EVENT_FILTERS[number]) => void;
};

export default function EventListFilter({
  title,
  filter,
  filterText,
  setFilter
}: EventListFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-x-2 items-center">
      <div className="text-sm font-medium text-gray-900">{title}</div>
      <div className="flex items-center">
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
  setFilter
}: EventListFilterItemProps) {
  return (
    <div
      className={`${
        isActive
          ? 'bg-gray-200 text-blue-600 border-gray-300 '
          : 'text-blue-400 hover:text-blue-500 hover:bg-gray-100'
      } rounded-md py-1 px-2 text-sm font-medium cursor-pointer`}
      onClick={() => setFilter(filter)}
    >
      {label}
    </div>
  );
}
