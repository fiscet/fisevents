import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PublicRoutes } from "./routes";
import { EventStatusType } from "@/types/custom.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { toDatetimeLocalFormat, legacyDateToDatetimeLocal } from './date-utils';

export const pickerDateToIsoString = (date: Date | string | undefined): string => {
  if (!date) return '';

  // Use the new robust date utility
  return toDatetimeLocalFormat(date);
};

import { fromDatetimeLocalToISO } from './date-utils';

export const toUserIsoString = (date: Date) => {
  // Convert to ISO string for storage (legacy compatibility)
  return date.toISOString();
};

export const slugify = (...args: (string | number)[]): string => {
  const value = args.join(' ');

  return value
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

export const getPublicEventSlug = (eventSlug: string, organizationSlug: string) => {
  if (!eventSlug || !organizationSlug || eventSlug.length === 0 || organizationSlug.length === 0) return '';

  const peSlug = PublicRoutes.getBase();

  return `${peSlug}/${organizationSlug}/${eventSlug}`;
};

export const getPublicEventUrl = (publicEventSlug?: string) => {
  if (!publicEventSlug || publicEventSlug.length === 0) return '';

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3003';

  return `${base}/${publicEventSlug}`;
};

export const checkIsValidUrl = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  const pattern = new RegExp(
    '^(https?:\\/\\/)' + // protocol (required)
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  return pattern.test(url);
};

export const getEventStatus = (startDate: string, endDate: string, publicationStartDate?: string): EventStatusType => {
  const now = Date.now();

  if (Date.parse(endDate) < now) {
    return 'finished';
  }

  if ((!publicationStartDate && Date.parse(startDate) >= now) || publicationStartDate && Date.parse(publicationStartDate) >= now) {
    return 'published';
  }

  return 'registrations_open';
};
