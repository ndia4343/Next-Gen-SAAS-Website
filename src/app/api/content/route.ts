import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteContent, updateSiteContent } from '@/lib/db';
import { WebsiteContentSchema } from '@/lib/types';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error: unknown) {
    console.error('Error fetching site content:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve site content' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Super Admin login required.' }, { status: 401 });
    }

    const body = await request.json();
    let toValidate = body;

    // Support section-specific updates { section: '...', data: ... }
    if (body.section && body.data) {
      const current = await getSiteContent();
      toValidate = {
        ...current,
        [body.section]: body.data,
      };
    }

    const validated = WebsiteContentSchema.parse(toValidate);
    const updated = await updateSiteContent(() => validated);

    // Instant live storefront cache invalidation
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');
    revalidatePath('/');
    revalidatePath('/admin', 'layout');
    revalidatePath('/admin', 'page');
    revalidatePath('/admin/branding', 'page');
    revalidatePath('/admin/header', 'page');
    revalidatePath('/admin/overview', 'page');
    revalidatePath('/admin/hero', 'page');
    revalidatePath('/admin/core-expertise', 'page');
    revalidatePath('/admin/project-support', 'page');
    revalidatePath('/admin/footer', 'page');
    revalidatePath('/admin/analytics', 'page');

    return NextResponse.json({
      success: true,
      message: 'Website content updated and storefront cache revalidated.',
      content: updated,
    });
  } catch (error: any) {
    console.error('Content update error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update content' },
      { status: 400 }
    );
  }
}
