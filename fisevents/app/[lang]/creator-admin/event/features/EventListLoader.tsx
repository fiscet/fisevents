'use client';

import dynamic from 'next/dynamic';
import { EventListProps } from './EventList';
import EventListSkeleton from '../components/EventListSkeleton';

const EventList = dynamic(() => import('./EventList'), {
  ssr: false,
  loading: () => <EventListSkeleton />,
});

export default function EventListLoader(props: EventListProps & { orgSlug?: string }) {
  return <EventList {...props} />;
}
