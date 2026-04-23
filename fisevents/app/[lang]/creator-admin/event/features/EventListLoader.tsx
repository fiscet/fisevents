'use client';

import dynamic from 'next/dynamic';
import { EventListProps } from './EventList';
import Processing from '@/components/Processing';

const EventList = dynamic(() => import('./EventList'), {
  ssr: false,
  loading: () => <Processing />,
});

export default function EventListLoader(props: EventListProps & { orgSlug?: string }) {
  return <EventList {...props} />;
}
