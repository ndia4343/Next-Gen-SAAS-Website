import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Super Admin login required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || (file.name.endsWith('.svg') ? 'image/svg+xml' : 'image/png');
    const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

    let relativeUrl = '';
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);
      relativeUrl = `/uploads/${safeName}`;
    } catch (fsErr) {
      // In read-only serverless environments (e.g. Vercel), fallback seamlessly to base64 Data URI
      console.warn('Filesystem write skipped in serverless environment, falling back to base64 Data URI:', fsErr);
    }

    return NextResponse.json({
      success: true,
      url: relativeUrl || base64Data,
      dataUrl: base64Data,
      filename: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}
