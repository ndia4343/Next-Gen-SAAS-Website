import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { logAdminLogin } from '@/lib/db';
import { resolveGeoLocation } from '@/lib/geo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const geo = await resolveGeoLocation(request.headers);
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const nowIso = new Date().toISOString();

    const { valid, adminInfo } = verifyCredentials(email, password);

    if (!valid || !adminInfo) {
      // Record failed audit attempt
      await logAdminLogin({
        adminName: 'Unknown Attempt',
        adminEmail: email || 'unknown',
        adminPhone: 'N/A',
        loginAt: nowIso,
        ipAddress: geo.ip,
        city: geo.city,
        region: geo.region,
        country: geo.country,
        status: 'FAILED_ATTEMPT',
        userAgent,
      });

      return NextResponse.json(
        { success: false, error: 'Invalid Super Admin credentials.' },
        { status: 401 }
      );
    }

    // Record successful audit login
    await logAdminLogin({
      adminName: adminInfo.name,
      adminEmail: adminInfo.email,
      adminPhone: adminInfo.phone,
      loginAt: nowIso,
      ipAddress: geo.ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      status: 'SUCCESS',
      userAgent,
    });

    const token = await createAdminSessionToken(adminInfo);

    const response = NextResponse.json({
      success: true,
      admin: adminInfo,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
