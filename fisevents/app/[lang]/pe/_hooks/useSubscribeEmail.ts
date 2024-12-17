'use client';

import { Locale } from "@/lib/i18n";
import { PublicRoutes } from "@/lib/routes";

export type SubscribeEmailProps = {
  eventId: string;
  companyName: string;
  eventTitle: string;
  emailDictionary: {
    subject: string;
    body_txt: string;
    body_html: string;
  };
};

export function useSubscribeEmail(
  {
    eventId,
    companyName,
    eventTitle,
    emailDictionary
  }: SubscribeEmailProps
) {
  const generateUnsubscribeLink = (lang: Locale, eventSlug: string, uuid: string, email: string): string => {
    if (typeof window !== 'undefined') {
      const host = window.location.protocol + '//' + window.location.host;
      const publicSlug = PublicRoutes.getBase();

      return `${host}/${lang}/${publicSlug}/unsuscribe?eventId=${eventId}&eventSlug=${eventSlug}&eventAttendantEmail=${email}&eventAttendantUuid=${uuid}`;
    }
    return '';
  };

  const prepareEmailSubject = (): string =>
    emailDictionary.subject.replace('%event_title%', eventTitle);

  const prepareEmailBodyTxt = (fullName: string, unsubscribeLink: string): string =>
    emailDictionary.body_txt
      .replaceAll('%attendant_name%', fullName)
      .replaceAll('%event_title%', eventTitle)
      .replaceAll('%unsubscribe_link%', unsubscribeLink)
      .replaceAll('%company_name%', companyName);

  const prepareEmailBodyHtml = (fullName: string, unsubscribeLink: string): string =>
    emailDictionary.body_html
      .replaceAll('%attendant_name%', fullName)
      .replaceAll('%event_title%', eventTitle)
      .replaceAll('%unsubscribe_link%', unsubscribeLink)
      .replaceAll('%company_name%', companyName);

  return { generateUnsubscribeLink, prepareEmailSubject, prepareEmailBodyTxt, prepareEmailBodyHtml };
}