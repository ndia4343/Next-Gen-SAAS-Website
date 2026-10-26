import { NextResponse } from 'next/server';
import { QuoteSchema } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = QuoteSchema.parse(body);

    // Production log: Connect to Resend, Slack webhook, or Postgres
    console.log('[ZAVIAN LABS Lead Capture]:', validatedData);

    return NextResponse.json({
      success: true,
      message: 'Scope received. A ZAVIAN LABS lead architect will contact you within 4 hours.',
      inquiryId: `ZAV-${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, errors: err.errors || 'Validation failure' },
      { status: 400 }
    );
  }
}
