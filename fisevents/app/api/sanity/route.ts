import { sanityClient } from '@/lib/sanity.cli';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sanityClient.create(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 });
  }
}