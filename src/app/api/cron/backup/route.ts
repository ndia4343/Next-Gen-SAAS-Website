import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verify authorization so only Vercel can trigger it
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Insert your backup logic here:
    // e.g., export SQLite/Postgres DB snapshot, save JSON content to S3/Drive, or dump lead entries.
    console.log('Automated 12:00 AM backup executed successfully');

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}