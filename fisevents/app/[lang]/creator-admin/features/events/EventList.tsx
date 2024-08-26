'use client';

import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceList } from '@/types/sanity.extended.types';
import DataTable, { Media, TableColumn } from 'react-data-table-component';
import PublishedIcon from '../../components/PublishedIcon';
import NumAttendants from '../../components/NumAttendants';
import { CreatorAdminRoutes } from '@/lib/routes';

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
          </div>
        </div>
      ),
      sortable: true
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

  const handleOpenSingleEvent = (id: string) => {
    router.push(`./${CreatorAdminRoutes.getItem('event')}/${id}`);
  };

  return (
    <DataTable
      columns={getColumns(dictionary)}
      data={eventListData}
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
      onRowClicked={(row) => handleOpenSingleEvent(row.slug?.current!)}
    />
  );
}
