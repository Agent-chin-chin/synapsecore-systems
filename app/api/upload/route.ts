import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { uploadFile } from '@/lib/storage/s3';
import { verifyCsrfToken } from '@/lib/csrf';

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/zip'
];
const maxFileSize = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requireRole(user, 'Super Admin', 'Support Engineer', 'Client/User')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const csrfToken = request.headers.get('x-csrf-token') || '';
    const csrfCookie = request.cookies.get('csrfToken')?.value || '';
    if (!verifyCsrfToken(csrfToken, csrfCookie)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: `File type ${file.type} is not allowed` }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadFile(buffer, file.name, file.type, {
      uploadedBy: user.email || 'unknown',
      userId: user.id
    });

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        fileUrl: uploadResult.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        metadata: {
          key: uploadResult.key,
          uploadedBy: user.email || 'unknown',
          userId: user.id
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
