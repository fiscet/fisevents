'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceList } from '@/types/sanity.extended.types';
import DataTable, { TableColumn } from 'react-data-table-component';
import EventStatusIcon from '../components/EventStatusIcon';
import NumAttendants from '../components/NumAttendants';
import EventListFilter from '../components/EventListFilter';
import { CreatorAdminRoutes } from '@/lib/routes';
import UtilityBar from '../../_components/UtilityBar';
import { Button } from '@/components/ui/button';
import { FiChevronRight, FiCopy } from 'react-icons/fi';
import Link from 'next/link';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { Locale } from '@/lib/i18n';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { getEventStatus } from '@/lib/utils';
import { EventFilterType } from '@/types/custom.types';

function PaymentBadge({ row, pendingLabel }: { row: OccurrenceList; pendingLabel: string }) {
  if (row.pendingPayment) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">{pendingLabel}</span>;
  }
  if (!row.active) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">Inactive</span>;
  }
  return null;
}

function getColumns(
  lang: Locale,
  d: Awaited<ReturnType<typeof getDictionary>>['creator_admin']['events'],
  pendingLabel: string,
  router: ReturnType<typeof import('next/navigation').useRouter>
) {
  const columns = [
    {
      name: d.status,
      cell: (row) => {
        return (
          <div className="flex flex-col gap-1 items-center">
            <EventStatusIcon
              status={getEventStatus(
                row.startDate!,
                row.endDate!,
                row.publicationStartDate
              )}
              inset="4px"
            />
            <PaymentBadge row={row} pendingLabel={pendingLabel} />
          </div>
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
            <EventStatusIcon
              status={getEventStatus(
                row.startDate!,
                row.endDate!,
                row.publicationStartDate
              )}
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
      cell: (row) => {
        return (
          <Link
            href={`/${lang}/${CreatorAdminRoutes.getItem('event')}/${row._id}?tab=attendants`}
            onClick={(e) => e.stopPropagation()}
            className="group flex items-center gap-1 hover:underline underline-offset-2"
          >
            <NumAttendants num={row.numAttendants} />
          </Link>
        );
      },
      width: '120px',
      center: 'true',
      hide: 640
    },
    {
      name: d.publicationStartDateShort,
      selector: (row) => row.publicationStartDate,
      format: (row) =>
        row.publicationStartDate
          ? new Date(row.publicationStartDate as string).toLocaleDateString()
          : '',
      hide: 'md',
      sortable: true
    },
    {
      name: d.startDate,
      selector: (row) => row.startDate,
      format: (row) => new Date(row.startDate as string).toLocaleDateString(),
      hide: 'md',
      sortable: true
    },
    {
      name: d.endDate,
      selector: (row) => row.endDate,
      format: (row) => new Date(row.endDate as string).toLocaleDateString(),
      hide: 'md',
      sortable: true
    },
    {
      name: '',
      cell: (row) => {
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${lang}/${CreatorAdminRoutes.getItem('event')}?from=${row._id}`);
              }}
              title={d.duplicate_event}
              className="p-1.5 rounded-lg border border-fe-outline-variant/30 text-fe-on-surface-variant hover:bg-fe-surface-container transition-colors"
            >
              <FiCopy className="w-3.5 h-3.5" />
            </button>
            <Link
              href={`/${lang}/${CreatorAdminRoutes.getItem('event')}/${row._id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-fe-outline-variant/30 text-xs font-medium text-fe-on-surface hover:bg-fe-surface-container transition-colors whitespace-nowrap"
            >
              {d.details} <FiChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      },
      width: '150px',
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
  const { events: d, attendants: att } = ca;

  const [filter, setFilter] = useState<EventFilterType>('all');

  const filterEvents = (events: OccurrenceList[]) => {
    if (filter === 'all') return events;

    const now = Date.now();

    return events.filter((event) => {
      switch (filter) {
        case 'finished':
          return Date.parse(event.endDate!) <= now;
        case 'published':
          return (
            (!event.publicationStartDate &&
              Date.parse(event.startDate!) >= now) ||
            (event.publicationStartDate &&
              Date.parse(event.publicationStartDate) >= now &&
              event.active &&
              Date.parse(event.endDate!) > now)
          );
        case 'registrations_open':
          return (
            (!event.publicationStartDate &&
              Date.parse(event.startDate!) <= now) ||
            (event.publicationStartDate &&
              Date.parse(event.publicationStartDate) <= now &&
              event.active &&
              Date.parse(event.endDate!) > now)
          );

        default:
          return false;
      }
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
              registrations_open: d.registrations_open,
              finished: d.finished
            }}
            setFilter={setFilter}
          />
        }
        rightElements={
          <Button asChild>
            <Link href={`/${curLang}/${CreatorAdminRoutes.getItem('event')}`}>
              {d.new_event}
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={getColumns(curLang, d, att.payment_pending, router)}
        data={filterEvents(eventListData)}
        pagination
        paginationComponentOptions={{ rowsPerPageText: d.rows_per_page, rangeSeparatorText: d.of }}
        responsive
        striped
        customStyles={{
          rows: {
            style: {
              '&:hover': {
                backgroundColor: 'hsl(var(--fe-surface-container))',
              },
            },
          },
          headCells: {
            style: {
              fontWeight: '600',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'hsl(var(--fe-on-surface-variant))',
            },
          },
        }}
        onRowClicked={(row) => handleOpenSingleEvent(row._id!)}
      />
    </div>
  );
}
