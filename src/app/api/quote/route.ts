import { NextRequest, NextResponse } from 'next/server';
import { QuoteSchema } from '@/lib/types';
import { recordLeadSubmission } from '@/lib/db';
import { resolveGeoLocation } from '@/lib/geo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = QuoteSchema.parse(body);

    const geo = await resolveGeoLocation(req.headers);

    // Save lead with stitched telemetry
    const savedLead = await recordLeadSubmission({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      company: validatedData.company,
      selectedService: validatedData.selectedService,
      projectScope: validatedData.projectScope,
      timeline: validatedData.timeline,
      visitorId: validatedData.visitorId,
      ipAddress: geo.ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
    });

    console.log('[ZAVIAN LABS Lead Stitched & Persisted]:', savedLead);

    return NextResponse.json({
      success: true,
      message: 'Scope received. A ZAVIAN LABS lead architect will contact you within 4 hours.',
      inquiryId: savedLead.id,
      lead: savedLead,
    });
  } catch (err: any) {
    console.error('Quote error:', err);
    return NextResponse.json(
      { success: false, errors: err.errors || 'Validation failure' },
      { status: 400 }
    );
  }
}
