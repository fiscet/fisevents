import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.cli';
import { sendMail } from '@/lib/send-mail';
import { getEmailDictionary } from '@/lib/i18n.utils';
import { applyTemplate } from '@/lib/email-template';
import { getPublicEventSlug, getPublicEventUrl } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';

type ReminderEvent = {
  _id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  talkTo?: string;
  publicSlug: string;
  companyName: string;
  organizationSlug: string;
  attendants?: Array<{
    _key: string;
    fullName?: string;
    email?: string;
  }>;
};

const DEFAULT_LANG: Locale = 'it';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.CRON_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const events = await sanityClient.fetch<ReminderEvent[]>(
    `*[_type == "occurrence"
      && active == true
      && !defined(reminderSentAt)
      && startDate >= $nowIso
      && startDate <= $windowEndIso
    ] {
      _id,
      title,
      startDate,
      endDate,
      location,
      talkTo,
      publicSlug,
      "companyName": createdByUser->companyName,
      "organizationSlug": createdByUser->slug.current,
      attendants[] { _key, fullName, email }
    }`,
    { nowIso: now.toISOString(), windowEndIso: in24h.toISOString() }
  );

  const results: Array<{
    eventId: string;
    sent: number;
    skipped: number;
    error?: string;
  }> = [];

  const emailDict = await getEmailDictionary(DEFAULT_LANG);
  const reminderDict = emailDict.event_attendant.reminder;

  for (const ev of events) {
    try {
      const attendants = (ev.attendants ?? []).filter((a) => !!a.email);
      if (!attendants.length) {
        await sanityClient
          .patch(ev._id)
          .set({ reminderSentAt: new Date().toISOString() })
          .commit();
        results.push({ eventId: ev._id, sent: 0, skipped: 0 });
        continue;
      }

      const publicSlug = getPublicEventSlug(ev.publicSlug, ev.organizationSlug);
      const publicUrl = getPublicEventUrl(publicSlug);

      let sent = 0;
      let skipped = 0;

      for (const a of attendants) {
        const vars = {
          attendant_name: a.fullName ?? '',
          event_title: ev.title,
          public_url: publicUrl,
          location: ev.location ?? '--',
          talk_to: ev.talkTo ?? '--',
          start_date: new Date(ev.startDate).toLocaleString(),
          end_date: ev.endDate ? new Date(ev.endDate).toLocaleString() : '--',
          company_name: ev.companyName ?? '',
        };

        try {
          await sendMail({
            sendTo: a.email!,
            subject: applyTemplate(reminderDict.subject, vars),
            text: applyTemplate(reminderDict.body_txt, vars),
            html: applyTemplate(reminderDict.body_html, vars),
          });
          sent++;
        } catch (err) {
          console.error(`Reminder failed for ${a.email} on ${ev._id}:`, err);
          skipped++;
        }
      }

      await sanityClient
        .patch(ev._id)
        .set({ reminderSentAt: new Date().toISOString() })
        .commit();

      results.push({ eventId: ev._id, sent, skipped });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Reminder job failed for event ${ev._id}:`, err);
      results.push({ eventId: ev._id, sent: 0, skipped: 0, error: message });
    }
  }

  return NextResponse.json({ checked: events.length, results });
}
