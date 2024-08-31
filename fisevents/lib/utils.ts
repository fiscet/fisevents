import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pickerDateToIsoString = (date: Date | string | undefined): string => {
  if (!date) return '';

  if (typeof date === 'string') {
    // Regex to match both short and complete ISO date formats
    const isoShortDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
    const isoCompleteDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/;

    if (isoShortDateRegex.test(date)) return date;
    if (isoCompleteDateRegex.test(date)) return date.substring(0, 16);

    return '';
  }

  return date instanceof Date ? date.toISOString().substring(0, 16) : '';
};

export const toUserIsoString = (date: Date) => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num: number) {
      return (num < 10 ? '0' : '') + num;
    };

  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    dif + pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' + pad(Math.abs(tzo) % 60);
};

export const slugify = (...args: (string | number)[]): string => {
  const value = args.join(' ');

  return value
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-'); // separator
};