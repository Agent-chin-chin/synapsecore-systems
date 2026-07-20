import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/services/blogService';
import { authenticateAPI } from '@/lib/apiAuth';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function isAdminUser(user: { role?: string } | null) {
  return user?.role === 'admin' || user?.role === 'Super Admin' || user?.role === 'Support Engineer';
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const post = await getPostById(params.id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = authenticateAPI(request);
    if (!user || !isAdminUser(user)) {
      return unauthorized();
    }

    const body = await request.json();
    const post = await updatePost(params.id, body);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = authenticateAPI(request);
    if (!user || !isAdminUser(user)) {
      return unauthorized();
    }

    await deletePost(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
