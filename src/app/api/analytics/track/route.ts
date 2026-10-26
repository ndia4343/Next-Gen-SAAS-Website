import { NextRequest, NextResponse } from 'next/server';
import { recordVisitorTelemetry } from '@/lib/db';
import { resolveGeoLocation } from '@/lib/geo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { visitorId, currentPage, referrer, deviceType, browser } = body;

    if (!visitorId) {
      return NextResponse.json({ success: false, error: 'Missing visitorId' }, { status: 400 });
    }

    const geo = await resolveGeoLocation(request.headers);

    const telemetry = await recordVisitorTelemetry({
      visitorId,
      ipAddress: geo.ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      currentPage: currentPage || '/',
      referrer: referrer || 'Direct',
      deviceType: (deviceType as 'Desktop' | 'Mobile' | 'Tablet') || 'Desktop',
      browser: browser || 'Unknown',
    });

    return NextResponse.json({ success: true, telemetry });
  } catch (error: unknown) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 });
  }
}
