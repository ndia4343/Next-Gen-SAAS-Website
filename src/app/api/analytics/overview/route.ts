import { NextRequest, NextResponse } from 'next/server';
import { getVisitorTelemetry, getLeadSubmissions } from '@/lib/db';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const visitors = await getVisitorTelemetry();
  const leads = await getLeadSubmissions();

  const uniqueVisitors = visitors.length;
  const totalVisits = visitors.reduce((acc, v) => acc + (v.visitCount || 1), 0);
  const avgVisitCount = uniqueVisitors > 0 ? (totalVisits / uniqueVisitors).toFixed(1) : '1.0';

  // Aggregate by Country/City
  const geoMap: Record<string, { city: string; region: string; country: string; count: number; lastSeen: string }> = {};
  for (const v of visitors) {
    const key = `${v.city}-${v.country}`;
    if (!geoMap[key]) {
      geoMap[key] = {
        city: v.city,
        region: v.region,
        country: v.country,
        count: v.visitCount || 1,
        lastSeen: v.lastVisitedAt,
      };
    } else {
      geoMap[key].count += v.visitCount || 1;
      if (new Date(v.lastVisitedAt) > new Date(geoMap[key].lastSeen)) {
        geoMap[key].lastSeen = v.lastVisitedAt;
      }
    }
  }

  const geoHeatmap = Object.values(geoMap).sort((a, b) => b.count - a.count);
  const activeRegionsCount = geoHeatmap.length;

  // Aggregate by Device Type
  const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  visitors.forEach((v) => {
    const d = v.deviceType || 'Desktop';
    deviceCounts[d] = (deviceCounts[d] || 0) + 1;
  });

  // Aggregate by Browser
  const browserCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    const b = v.browser || 'Unknown';
    browserCounts[b] = (browserCounts[b] || 0) + 1;
  });

  return NextResponse.json({
    metrics: {
      totalVisits,
      uniqueVisitors,
      avgVisitCount,
      totalLeads: leads.length,
      activeRegionsCount,
    },
    geoHeatmap,
    deviceBreakdown: deviceCounts,
    browserBreakdown: browserCounts,
    recentVisitors: visitors.slice(0, 30),
  });
}
