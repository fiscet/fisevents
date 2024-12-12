import { EVENT_FILTERS } from '@/types/custom.types';

export type EventListFilterProps = {
  title: string;
  filter: typeof EVENT_FILTERS[number];
  filterText: { [index in typeof EVENT_FILTERS[number]]: string };
  setFilter: (filter: typeof EVENT_FILTERS[number]) => void;
};

export default function EventListFilter({
  title,
  filter,
  filterText,
  setFilter
}: EventListFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <div className="text-sm font-medium text-gray-900">{title}</div>
      <div className="flex gap-2 items-center">
        <div
          className={`${
            filter === 'all'
              ? 'bg-gray-200 text-gray-900 border-gray-300 '
              : 'border-gray-300 '
          }rounded-md py-1 px-2 text-sm font-medium cursor-pointer`}
          onClick={() => setFilter('all')}
        >
          {filterText.all}
        </div>
        <div
          className={`${
            filter === 'published'
              ? 'bg-gray-200 text-gray-900 border-gray-300 '
              : 'border-gray-300 '
          }rounded-md py-1 px-2 text-sm font-medium cursor-pointer`}
          onClick={() => setFilter('published')}
        >
          {filterText.published}
        </div>
        <div
          className={`${
            filter === 'unpublished'
              ? 'bg-gray-200 text-gray-900 border-gray-300 '
              : 'border-gray-300 '
          }rounded-md py-1 px-2 text-sm font-medium cursor-pointer`}
          onClick={() => setFilter('unpublished')}
        >
          {filterText.unpublished}
        </div>
      </div>
    </div>
  );
}
