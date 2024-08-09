'use client';

import { Occurrence } from '@/types/sanity.types';
import DataTable, { TableColumn } from 'react-data-table-component';

const columns = [
  {
    name: 'Title',
    selector: (row) => row.title,
    sortable: true
  },
  {
    name: 'Start date',
    selector: (row) => row.startDate,
    format: (row) => new Date(row.startDate as string).toLocaleString(),
    sortable: true
  },
  {
    name: 'End date',
    selector: (row) => row.endDate,
    format: (row) => new Date(row.endDate as string).toLocaleString(),
    sortable: true
  },
  {
    name: 'Published from',
    selector: (row) => row.publicationStartDate,
    format: (row) =>
      new Date(row.publicationStartDate as string).toLocaleString(),
    sortable: true
  }
] as TableColumn<Partial<Occurrence>>[];

export default function EventList({
  eventListData
}: {
  eventListData: Partial<Occurrence>[];
}) {
  return (
    <DataTable
      columns={columns}
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
    />
  );
}
