import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuditLogs } from '@/lib/db';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = await getAdminAuditLogs();
  return NextResponse.json({ success: true, logs });
}
