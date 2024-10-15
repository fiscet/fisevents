'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceList } from '@/types/sanity.extended.types';
import DataTable, { TableColumn } from 'react-data-table-component';
import PublishedIcon from '../components/PublishedIcon';
import PublishableIcon from '../components/PublishableIcon';
import NumAttendants from '../components/NumAttendants';
import EventListFilter from '../components/EventListFilter';
import { CreatorAdminRoutes } from '@/lib/routes';
import UtilityBar from '../../components/UtilityBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function getColumns(
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['events']
) {
  const columns = [
    {
      name: dictionary.is_published,
      cell: (row) => {
        const isPublished =
          Date.parse(row.publicationStartDate!) <= Date.now() &&
          Date.parse(row.endDate!) > Date.now();

        return <PublishedIcon isPublished={isPublished} inset="4px" />;
      },
      width: '120px',
      center: 'true',
      hide: 640
    },
    {
      name: dictionary.title,
      selector: (row) => row.title,
      cell: (row) => (
        <div>
          <div className="pt-1">{row.title}</div>
          <div className="flex gap-3 py-2 sm:hidden">
            <PublishedIcon isPublished={true} inset="4px" />
            <NumAttendants num={row.numAttendants} />
            <PublishableIcon isPublishable={!!row.active} />
          </div>
        </div>
      ),
      sortable: true
    },
    {
      name: dictionary.active,
      selector: (row) => row.active,
      cell: (row) => <PublishableIcon isPublishable={!!row.active} />,
      center: 'true',
      sortable: true,
      hide: 640
    },
    {
      name: dictionary.numAttendants,
      selector: (row) => row.numAttendants,
      cell: (row) => <NumAttendants num={row.numAttendants} />,
      width: '120px',
      center: 'true',
      hide: 640
    },
    {
      name: dictionary.publicationStartDate,
      selector: (row) => row.publicationStartDate,
      format: (row) =>
        new Date(row.publicationStartDate as string).toLocaleString(),
      hide: 'md',
      sortable: true
    },
    {
      name: dictionary.startDate,
      selector: (row) => row.startDate,
      format: (row) => new Date(row.startDate as string).toLocaleString(),
      hide: 'md',
      sortable: true
    },
    {
      name: dictionary.endDate,
      selector: (row) => row.endDate,
      format: (row) => new Date(row.endDate as string).toLocaleString(),
      hide: 'md',
      sortable: true
    }
  ] as TableColumn<OccurrenceList>[];

  return columns;
}

export type EventListProps = {
  eventListData: OccurrenceList[];
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['events'];
};

export default function EventList({
  eventListData,
  dictionary
}: EventListProps) {
  const router = useRouter();

  const [filter, setFilter] = useState<'all' | 'active' | 'published'>('all');

  const filterEvents = (events: OccurrenceList[]) => {
    if (filter === 'all') return events;

    const now = Date.now();

    return events.filter((event) => {
      const isActive = event.active;
      const isPublished =
        Date.parse(event.publicationStartDate!) <= now &&
        Date.parse(event.endDate!) > now;

      return filter === 'active' ? isActive : isPublished;
    });
  };

  const handleOpenSingleEvent = (id: string) => {
    router.push(`/${CreatorAdminRoutes.getItem('event')}/${id}`);
  };

  return (
    <div>
      <UtilityBar
        leftElements={
          <EventListFilter
            title={dictionary.filters}
            filter={filter}
            filterText={{
              all: dictionary.all,
              active: dictionary.active,
              published: dictionary.published
            }}
            setFilter={setFilter}
          />
        }
        rightElements={
          <Button asChild>
            <Link href={CreatorAdminRoutes.getItem('event')}>
              {dictionary.new_event}
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={getColumns(dictionary)}
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
