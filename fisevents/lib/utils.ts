import { type ClassValue, clsx } from "clsx";
import { Regex } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pickerDateToIsoString = (date: Date | string | undefined) => {
  if (!date) {
    return '';
  }

  if (typeof date == 'string') {
    // Coming from the picker
    if (date.length == 16) {
      return date;
    }
    // Complete ISO with milliseconds and timezone Z
    if (date.length > 16) {
      const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/;

      if (isoDateRegex.test(date)) {
        return date.substring(0, 16);
      }
      // Somehow invalid format
      return '';
    }
  }

  return (date as Date).toISOString().substring(0, 16);
};

export const toIsoString = (date: Date) => {
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
