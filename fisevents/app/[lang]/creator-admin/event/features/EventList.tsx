'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceList } from '@/types/sanity.extended.types';
import DataTable, { TableColumn } from 'react-data-table-component';
import PublishedIcon from '../components/PublishedIcon';
import NumAttendants from '../components/NumAttendants';
import EventListFilter from '../components/EventListFilter';
import { CreatorAdminRoutes } from '@/lib/routes';
import UtilityBar from '../../_components/UtilityBar';
import { Button } from '@/components/ui/button';
import { FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { Locale } from '@/lib/i18n';
import { useDictionary } from '@/app/contexts/DictionaryContext';

const isOngoing = (publicationStartDate: string, endDate: string) =>
  Date.parse(publicationStartDate) <= Date.now() &&
  Date.parse(endDate) > Date.now();

function getColumns(
  lang: Locale,
  d: Awaited<ReturnType<typeof getDictionary>>['creator_admin']['events']
) {
  const columns = [
    {
      name: d.ongoing,
      cell: (row) => {
        return (
          <PublishedIcon
            isOngoing={isOngoing(row.publicationStartDate!, row.endDate!)}
            inset="4px"
          />
        );
      },
      width: '120px',
      center: 'true',
      hide: 640
    },
    {
      name: d.title,
      selector: (row) => row.title,
      cell: (row) => (
        <div>
          <div className="pt-1">{row.title}</div>
          <div className="flex gap-3 py-2 sm:hidden">
            <PublishedIcon
              isOngoing={isOngoing(row.publicationStartDate!, row.endDate!)}
              inset="4px"
            />
            <NumAttendants num={row.numAttendants} />
          </div>
        </div>
      ),
      width: '350px',
      sortable: true
    },
    {
      name: d.numAttendants,
      selector: (row) => row.numAttendants,
      cell: (row) => <NumAttendants num={row.numAttendants} />,
      width: '120px',
      center: 'true',
      hide: 640
    },
    {
      name: d.publicationStartDate,
      selector: (row) => row.publicationStartDate,
      format: (row) =>
        row.publicationStartDate
          ? new Date(row.publicationStartDate as string).toLocaleString()
          : '',
      hide: 'md',
      sortable: true
    },
    {
      name: d.startDate,
      selector: (row) => row.startDate,
      format: (row) => new Date(row.startDate as string).toLocaleString(),
      hide: 'md',
      sortable: true
    },
    {
      name: d.endDate,
      selector: (row) => row.endDate,
      format: (row) => new Date(row.endDate as string).toLocaleString(),
      hide: 'md',
      sortable: true
    },
    {
      name: d.details,
      cell: (row) => {
        return (
          <div className="flex gap-2 items-center">
            <Link
              href={`/${lang}/${CreatorAdminRoutes.getItem('event')}/${
                row._id
              }`}
            >
              <FiChevronRight className="w-5 h-5 text-cyan-700" />
            </Link>
          </div>
        );
      },
      center: 'true'
    }
  ] as TableColumn<OccurrenceList>[];

  return columns;
}

export type EventListProps = {
  eventListData: OccurrenceList[];
};

export default function EventList({ eventListData }: EventListProps) {
  const router = useRouter();
  const curLang = useCurrentLang();

  const { creator_admin: ca } = useDictionary();
  const { events: d } = ca;

  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>(
    'all'
  );

  const filterEvents = (events: OccurrenceList[]) => {
    if (filter === 'all') return events;

    const now = Date.now();

    return events.filter((event) => {
      const isOngoing =
        Date.parse(event.publicationStartDate!) <= now &&
        Date.parse(event.endDate!) > now &&
        event.active;

      return filter === 'published' ? isOngoing : !isOngoing;
    });
  };

  const handleOpenSingleEvent = (id: string) => {
    router.push(`/${curLang}/${CreatorAdminRoutes.getItem('event')}/${id}`);
  };

  return (
    <div>
      <UtilityBar
        leftElements={
          <EventListFilter
            title={d.filters}
            filter={filter}
            filterText={{
              all: d.all,
              published: d.published,
              unpublished: d.unpublished
            }}
            setFilter={setFilter}
          />
        }
        rightElements={
          <Button asChild>
            <Link href={`/${CreatorAdminRoutes.getItem('event')}`}>
              {d.new_event}
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={getColumns(curLang, d)}
        data={filterEvents(eventListData)}
        pagination
        responsive
        striped
        customStyles={{
          rows: {
            style: {
              '&:hover': {
                cursor: 'pointer',
                backgroundColor: '#ffffee'
              }
            }
          }
        }}
        onRowClicked={(row) => handleOpenSingleEvent(row._id!)}
      />
    </div>
  );
}
