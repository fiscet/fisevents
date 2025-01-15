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
      <div className="relative mb-4">
        <Image
          src={eventData.pageImage.url ?? '/img/logo.png'}
          alt={eventData.title + ' image'}
          width="1024"
          height="320"
          className="mx-auto"
        />
        <div className="absolute h-40 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-0"></div>
        <h1 className="absolute bottom-10 text-2xl font-bold text-white ml-2 z-10">
          {eventData.title}
        </h1>
      </div>
      <SubscribeAnchor
        anchorId="#event-attendant-form-container"
        label={dictionary.subscribe_button}
      />
      <div className="flex flex-col gap-6 items-center md:flex-row md:gap-1 md:items-stretch md:justify-between my-8">
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
            <span
              className={eventData.remainingPlaces <= 0 ? 'text-red-600' : ''}
            >
              {eventData.remainingPlaces} {dictionary.places_left}
            </span>
          </IconCard>
        )}
      </div>
      {eventData.location && (
        <IconText
          Icon={FaMapLocationDot}
          iconClassName="w-12 h-12"
          containerClassName="p-4 shadow-md hover:bg-slate-50 hover:shadow-sm mb-6"
        >
          {eventData.location}
        </IconText>
      )}

      <SubscribeAnchor
        anchorId="#event-attendant-form-container"
        label={dictionary.subscribe_button}
      />

      <div className="py-2">
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
