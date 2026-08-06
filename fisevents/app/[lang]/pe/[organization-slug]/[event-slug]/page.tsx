import { getEventSingleBySlug, getEventStatusBySlug, getUserBySlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getAlternates } from '@/lib/seo';
import EventNotFound from '../../_components/EventNotFound';
import PublicEvent from '../../_components/PublicEvent';
import EventAttendantForm from '../../_features/EventAttendantContainer';
import { NotificationProvider } from '@/components/Notification/NotificationContext';
import { PublicRoutes } from '@/lib/routes';
import { Metadata } from 'next';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fisevents.com';

/**
 * Parses the GROQ-built price string ("<amount> <currency>", "<amount>" or "").
 * An empty string means a free event.
 */
function parsePrice(
  raw: string | undefined
): { price: string; priceCurrency?: string } | null {
  if (!raw || !raw.trim()) return { price: '0' };
  const [amount, currency] = raw.trim().split(/\s+/);
  if (!amount || Number.isNaN(Number(amount))) return null;
  return {
    price: amount,
    priceCurrency: currency && currency !== '-' ? currency : undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    lang: Locale;
    ['organization-slug']: string;
    ['event-slug']: string;
  }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const organizationSlug = resolvedParams['organization-slug'];
  const eventSlug = resolvedParams['event-slug'];
  const lang = resolvedParams.lang;
  const fullSlug = `${PublicRoutes.getBase()}/${organizationSlug}/${eventSlug}`;

  const eventData = await getEventSingleBySlug({ slug: fullSlug });
  if (!eventData) return {};

  const description = eventData.description
    ?.replace(/[#*_~`[\]]/g, '')
    .slice(0, 160);

  return {
    title: eventData.title,
    description,
    alternates: getAlternates(`/pe/${organizationSlug}/${eventSlug}`, lang),
    openGraph: {
      title: eventData.title ?? undefined,
      description: description ?? undefined,
      images: eventData.pageImage?.url
        ? [
            {
              url: eventData.pageImage.url,
              width: eventData.pageImage.dimensions?.width,
              height: eventData.pageImage.dimensions?.height,
            },
          ]
        : [],
      type: 'website',
    },
  };
}

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{
    lang: Locale;
    ['organization-slug']: string;
    ['event-slug']: string;
  }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const organizationSlug = resolvedParams['organization-slug'];
  const eventSlug = resolvedParams['event-slug'];
  const peSlug = PublicRoutes.getBase();
  const fullSlug = `${peSlug}/${organizationSlug}/${eventSlug}`;

  const [eventData, dict] = await Promise.all([
    getEventSingleBySlug({ slug: fullSlug }),
    getDictionary(lang),
  ]);

  if (!eventData) {
    const status = await getEventStatusBySlug({ slug: fullSlug });
    if (status) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-fe-on-surface">{status.title}</h1>
          <p className="text-fe-on-surface-variant max-w-md">
            {status.pendingPayment
              ? dict.public.event_pending_payment
              : dict.public.event_not_available}
          </p>
        </div>
      );
    }
    return <EventNotFound />;
  }

  const userData = await getUserBySlug({ slug: eventData.organizationSlug });

  const eventUrl = `${BASE_URL}/${lang}/pe/${organizationSlug}/${eventSlug}`;
  const parsedPrice = parsePrice(eventData?.price);
  const soldOut =
    typeof eventData?.maxSubscribers === 'number' &&
    eventData.maxSubscribers > 0 &&
    eventData.remainingPlaces <= 0;

  // The form stays visible when sold out — signing up there joins the
  // waitlist instead of a confirmed spot.
  const showForm = !!eventData && Date.parse(eventData.endDate!) >= Date.now();

  const jsonLd = eventData
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: eventData.title,
        description: eventData.description?.replace(/[#*_~`[\]]/g, '').slice(0, 500),
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        url: eventUrl,
        ...(eventData.location
          ? {
              eventAttendanceMode:
                'https://schema.org/OfflineEventAttendanceMode',
              location: { '@type': 'Place', name: eventData.location },
            }
          : {}),
        ...(eventData.pageImage?.url ? { image: eventData.pageImage.url } : {}),
        organizer: {
          '@type': 'Organization',
          name: eventData.companyName,
          url: `${BASE_URL}/${lang}/pe/${eventData.organizationSlug}`,
        },
        ...(parsedPrice
          ? {
              offers: {
                '@type': 'Offer',
                price: parsedPrice.price,
                ...(parsedPrice.priceCurrency
                  ? { priceCurrency: parsedPrice.priceCurrency }
                  : {}),
                availability: soldOut
                  ? 'https://schema.org/SoldOut'
                  : 'https://schema.org/InStock',
                url: eventUrl,
                ...(eventData.startDate
                  ? { validThrough: eventData.startDate }
                  : {}),
              },
            }
          : {}),
      }
    : null;

  return (
    <div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {eventData && organizationSlug === eventData.organizationSlug ? (
        <>
          <PublicEvent eventData={eventData} userData={userData} lang={lang} />

          {showForm && (
            <NotificationProvider>
              <EventAttendantForm
                lang={lang}
                eventData={eventData}
                eventSlug={eventSlug}
                isFull={soldOut}
              />
            </NotificationProvider>
          )}
        </>
      ) : (
        <EventNotFound />
      )}
    </div>
  );
}
