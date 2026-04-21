import {
  CurrentUser,
  PublicOccurrenceSingle
} from '@/types/sanity.extended.types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaRegMoneyBill1 } from 'react-icons/fa6';
import { FaMapLocationDot } from 'react-icons/fa6';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { GrContact } from 'react-icons/gr';
import { Locale } from '@/lib/i18n';
import IconText from './IconText';
import { getDictionary } from '@/lib/i18n.utils';
import Image from 'next/image';
import StartEndDatesCard from './StartEndDatesCard';
import IconCard from './IconCard';
import OrganizedBy from './OrganizedBy';
import SubscribeAnchor from './SubscribeAnchor';

export type PublicEventProps = {
  eventData: PublicOccurrenceSingle;
  userData: Partial<CurrentUser>;
  lang: Locale;
};
export default async function PublicEvent({
  eventData,
  userData,
  lang
}: PublicEventProps) {
  const dictionary = (await getDictionary(lang)).public;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden mb-6">
        <Image
          src={eventData.pageImage.url ?? '/img/logo.png'}
          alt={eventData.title + ' image'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <h1 className="absolute bottom-5 left-5 right-5 text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">
          {eventData.title}
        </h1>
      </div>

      <SubscribeAnchor
        anchorId="#event-attendant-form-container"
        label={dictionary.subscribe_button}
      />

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 mb-8">
        <StartEndDatesCard
          startDate={eventData.startDate!}
          endDate={eventData.endDate!}
          lang={lang}
        />
        {eventData.price && (
          <IconCard Icon={FaRegMoneyBill1} title={dictionary.price}>
            {eventData.price}
          </IconCard>
        )}
        {eventData.talkTo && (
          <IconCard Icon={GrContact} title={dictionary.talk_to}>
            {eventData.talkTo}
          </IconCard>
        )}
        {eventData.maxSubscribers && eventData.maxSubscribers > 0 && (
          <IconCard Icon={MdOutlineEmojiPeople} title={dictionary.places_left}>
            <span className={eventData.remainingPlaces <= 0 ? 'text-fe-error font-semibold' : 'font-semibold'}>
              {eventData.remainingPlaces}
            </span>
            {' '}
            <span className="text-fe-on-surface-variant text-sm">{dictionary.places_left}</span>
          </IconCard>
        )}
      </div>

      {eventData.location && (
        <IconText
          Icon={FaMapLocationDot}
          iconClassName="w-5 h-5"
          containerClassName="px-4 py-3 rounded-xl bg-fe-surface-container border border-fe-outline-variant/20 mb-6 text-fe-on-surface"
        >
          {eventData.location}
        </IconText>
      )}

      {/* Description */}
      <div className="py-6 border-t border-fe-outline-variant/20 text-fe-on-surface leading-relaxed
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3
        [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2
        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2
        [&_p]:mb-3
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
        [&_a]:text-fe-primary [&_a]:underline
        [&_strong]:font-semibold
        [&_blockquote]:border-l-4 [&_blockquote]:border-fe-outline-variant [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-fe-on-surface-variant">
        <Markdown remarkPlugins={[remarkGfm]}>{eventData.description}</Markdown>
      </div>

      <OrganizedBy
        companyName={userData.companyName!}
        logoUrl={userData.logoUrl}
        www={userData.www}
        organizedByLabel={dictionary.organized_by}
      />
    </div>
  );
}
