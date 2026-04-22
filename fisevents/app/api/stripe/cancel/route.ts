import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') ?? 'it';
  const occurrenceId = searchParams.get('occurrenceId');

  const target = occurrenceId
    ? `/${lang}/creator-admin/event/${occurrenceId}?payment=cancelled`
    : `/${lang}/creator-admin/event?payment=cancelled`;

  return NextResponse.redirect(new URL(target, req.nextUrl.origin));
}
