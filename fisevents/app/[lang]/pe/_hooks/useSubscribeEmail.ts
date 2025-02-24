'use client';

import { Locale } from "@/lib/i18n";
import { PublicRoutes } from "@/lib/routes";
import { getPublicEventUrl } from "@/lib/utils";
import { PublicOccurrenceSingle } from "@/types/sanity.extended.types";

export type SubscribeEmailProps = {
  eventData: PublicOccurrenceSingle;
  emailDictionary: {
    subject: string;
    body_txt: string;
    body_html: string;
  };
};

export function useSubscribeEmail(
  {
    eventData,
    emailDictionary
  }: SubscribeEmailProps
) {
  const generateUnsubscribeLink = (lang: Locale, eventSlug: string, uuid: string, email: string): string => {
    if (typeof window !== 'undefined') {
      const host = window.location.protocol + '//' + window.location.host;
      const publicSlug = PublicRoutes.getBase();

      return `${host}/${lang}/${publicSlug}/unsuscribe?eventId=${eventData._id}&eventSlug=${eventSlug}&eventAttendantEmail=${email}&eventAttendantUuid=${uuid}`;
    }
    return '';
  };

  const publicUrl = getPublicEventUrl(eventData?.publicSlug);

  const prepareEmailSubject = (): string =>
    emailDictionary.subject.replace('%event_title%', eventData.title!);

  const prepareEmailBodyTxt = (fullName: string, unsubscribeLink: string): string =>
    emailDictionary.body_txt
      .replaceAll('%attendant_name%', fullName)
      .replaceAll('%event_title%', eventData.title!)
      .replaceAll('%unsubscribe_link%', unsubscribeLink)
      .replaceAll('%company_name%', eventData.companyName)
      .replaceAll('%public_url%', publicUrl)
      .replaceAll('%location%', eventData?.location || '--')
      .replaceAll('%talk_to%', eventData?.talkTo || '--')
      .replaceAll('%price%', eventData?.price || '--')
      .replaceAll('%currency%', eventData.currency || '')
      .replaceAll('%start_date%', new Date(eventData.startDate as string).toLocaleString())
      .replaceAll('%end_date%', new Date(eventData.endDate as string).toLocaleString());

  const prepareEmailBodyHtml = (fullName: string, unsubscribeLink: string): string =>
    emailDictionary.body_html
      .replaceAll('%attendant_name%', fullName)
      .replaceAll('%event_title%', eventData.title!)
      .replaceAll('%unsubscribe_link%', unsubscribeLink)
      .replaceAll('%company_name%', eventData.companyName)
      .replaceAll('%public_url%', publicUrl)
      .replaceAll('%location%', eventData?.location || '--')
      .replaceAll('%talk_to%', eventData?.talkTo || '--')
      .replaceAll('%price%', eventData?.price || '--')
      .replaceAll('%currency%', eventData.currency || '')
      .replaceAll('%start_date%', new Date(eventData.startDate as string).toLocaleString())
      .replaceAll('%end_date%', new Date(eventData.endDate as string).toLocaleString());

  return { generateUnsubscribeLink, prepareEmailSubject, prepareEmailBodyTxt, prepareEmailBodyHtml };
}