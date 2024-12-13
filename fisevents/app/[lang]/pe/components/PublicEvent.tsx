import {
  CurrentUser,
  PublicOccurrenceSingle
} from '@/types/sanity.extended.types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaRegMoneyBill1 } from 'react-icons/fa6';
import { FaMapLocationDot } from 'react-icons/fa6';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { Locale } from '@/lib/i18n';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import StartEndDates from './StartEndDates';
import IconText from './IconText';
import { getDictionary } from '@/lib/i18n.utils';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

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
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-center mt-5">{eventData.title}</h1>
      <div className="py-2">
        <Image
          src={eventData.pageImage.url ?? '/img/logo.png'}
          alt={eventData.title + ' image'}
          width="1024"
          height="320"
          className="mx-auto"
        />
      </div>
      <div className="py-2">
        <Markdown remarkPlugins={[remarkGfm]}>{eventData.description}</Markdown>
        <Separator className="my-4" />
      </div>

      <StartEndDates
        startDate={eventData.startDate!}
        endDate={eventData.endDate!}
        lang={lang}
      />

      {eventData.location && (
        <IconText Icon={FaMapLocationDot}>{eventData.location}</IconText>
      )}

      {eventData.price && (
        <IconText Icon={FaRegMoneyBill1}>{eventData.price}</IconText>
      )}
      {eventData.maxSubscribers && eventData.maxSubscribers > 0 && (
        <IconText
          Icon={MdOutlineEmojiPeople}
          containerClassName={
            eventData.remainingPlaces <= 0 ? 'text-red-600' : ''
          }
          iconClassName={eventData.remainingPlaces <= 0 ? 'text-red-600' : ''}
        >
          {eventData.remainingPlaces} {dictionary.public.places_left}
        </IconText>
      )}
      <div className="flex justify-end items-baseline">
        <Link
          href={userData.www ?? '#'}
          target={userData.www ? '_blank' : '_self'}
          className="flex flex-row items-center gap-x-2"
        >
          <span className="text-sm text-muted-foreground">
            {dictionary.public.organized_by} {userData.companyName}
          </span>
          {userData.logoUrl && (
            <Avatar className="w-12 h-12 rounded-full">
              <AvatarImage src={userData.logoUrl} />
            </Avatar>
          )}
        </Link>
      </div>
    </div>
  );
}
