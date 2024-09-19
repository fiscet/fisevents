import { PublicOccurrenceSingle } from '@/types/sanity.extended.types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaRegMoneyBill1 } from 'react-icons/fa6';
import { FaMapLocationDot } from 'react-icons/fa6';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { Locale } from '@/lib/i18n';
import { Separator } from '@/components/ui/separator';
import StartEndDates from './StartEndDates';
import IconText from './IconText';
import { getDictionary } from '@/lib/i18n.utils';

export type PublicEventProps = {
  eventData: PublicOccurrenceSingle;
  lang: Locale;
};
export default async function PublicEvent({
  eventData,
  lang
}: PublicEventProps) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-center mt-5">{eventData.title}</h1>
      <div className="py-2">
        <Markdown remarkPlugins={[remarkGfm]}>{eventData.description}</Markdown>
      </div>
      <Separator className="my-4" />
      <StartEndDates
        startDate={eventData.startDate!}
        endDate={eventData.endDate!}
        lang={lang}
      />
      <Separator className="my-4" />
      <IconText Icon={FaMapLocationDot}>{eventData.location!}</IconText>
      <Separator className="my-4" />
      <IconText Icon={FaRegMoneyBill1}>{eventData.price}</IconText>
      <Separator className="my-4" />
      <IconText Icon={MdOutlineEmojiPeople}>
        {eventData.remainingPlaces} {dictionary.public.places_left}
      </IconText>
      <Separator className="my-4" />
    </div>
  );
}
