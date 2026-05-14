/**
 * Genera link "Aggiungi al calendario" per Google, Outlook e file .ics (Apple/generico).
 * Non richiede API esterne né autenticazione: sono URL template precompilati.
 */

export type CalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  /** ISO date string */
  startDate: string;
  /** ISO date string */
  endDate: string;
};

/** Formatta una data in UTC come YYYYMMDDTHHMMSSZ (formato richiesto da Google e ICS). */
function toUtcStamp(date: string): string {
  return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Rimuove la formattazione Markdown di base per ottenere testo semplice. */
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`~]/g, '')
    .replace(/\r?\n{2,}/g, '\n')
    .trim();
}

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toUtcStamp(event.startDate)}/${toUtcStamp(event.endDate)}`,
  });
  if (event.description) params.set('details', stripMarkdown(event.description));
  if (event.location) params.set('location', event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: new Date(event.startDate).toISOString(),
    enddt: new Date(event.endDate).toISOString(),
  });
  if (event.description) params.set('body', stripMarkdown(event.description));
  if (event.location) params.set('location', event.location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** Esegue l'escape dei caratteri speciali secondo lo standard ICS (RFC 5545). */
function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Genera il contenuto di un file .ics, usabile come data URI per il download. */
export function getIcsContent(event: CalendarEvent): string {
  const now = toUtcStamp(new Date().toISOString());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FisEvents//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${now}-${Math.random().toString(36).slice(2)}@fisevents`,
    `DTSTAMP:${now}`,
    `DTSTART:${toUtcStamp(event.startDate)}`,
    `DTEND:${toUtcStamp(event.endDate)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
  ];
  if (event.description) lines.push(`DESCRIPTION:${escapeIcs(stripMarkdown(event.description))}`);
  if (event.location) lines.push(`LOCATION:${escapeIcs(event.location)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

/** Data URI scaricabile per il file .ics (Apple Calendar e client generici). */
export function getIcsDataUri(event: CalendarEvent): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(getIcsContent(event))}`;
}
