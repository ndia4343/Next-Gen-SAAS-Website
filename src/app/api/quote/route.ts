import { NextRequest, NextResponse } from 'next/server';
import { QuoteSchema } from '@/lib/types';
import { recordLeadSubmission } from '@/lib/db';
import { resolveGeoLocation } from '@/lib/geo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both multi-select services array and single service string
    const normalizedPayload = {
      ...body,
      selectedService:
        body.selectedService ||
        (Array.isArray(body.services) && body.services.length > 0
          ? body.services.join(', ')
          : 'Full-Stack Architecture'),
      projectScope:
        body.projectScope ||
        `[Monthly Volume: ${body.leadVolume || 'Unspecified'}] ${body.notes || 'Inbound scope inquiry via 3-step modal.'}`,
      timeline: body.timeline || 'Immediate',
    };

    const validatedData = QuoteSchema.parse(normalizedPayload);

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
