import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSiteConfig, saveServerSiteConfig } from '@/lib/site-config-store';
import { SiteConfigSchema } from '@/types/site-config';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getServerSiteConfig();
    return NextResponse.json(
      { success: true, config },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('Error loading site config:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to load site configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Super Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const rawConfig = body?.config ?? body;
    const validated = SiteConfigSchema.parse(rawConfig);

    const saved = await saveServerSiteConfig(validated);

    // Revalidate all public & admin caches immediately
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');
    revalidatePath('/');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin', 'page');

    return NextResponse.json({
      success: true,
      message: 'Configuration published cleanly to live site.',
      config: saved,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid site configuration payload';
    console.error('Error saving site config:', err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
