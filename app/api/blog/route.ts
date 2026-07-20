import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/services/blogService';
import { authenticateAPI } from '@/lib/apiAuth';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function isAdminUser(user: { role?: string } | null) {
  return user?.role === 'admin' || user?.role === 'Super Admin' || user?.role === 'Support Engineer';
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user || !isAdminUser(user)) {
      return unauthorized();
    }

    const body = await request.json();
    const post = await createPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
