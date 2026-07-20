import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPI } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const category = request.nextUrl.searchParams.get('category') || 'general';

  try {
    // Mock community posts - in production, would query CommunityPost model
    const posts = [
      {
        id: '1',
        title: 'Best practices for secure coding',
        content: 'What are the top things to keep in mind when writing secure code?',
        author: 'Jane Developer',
        replies: 12,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'general',
        views: 234
      },
      {
        id: '2',
        title: 'Network security tips for 2025',
        content: 'Share your best tips for network security in the new year',
        author: 'John Admin',
        replies: 8,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'networking',
        views: 156
      },
      {
        id: '3',
        title: 'Understanding cryptographic algorithms',
        content: 'Can someone explain the differences between symmetric and asymmetric encryption?',
        author: 'Alice Security',
        replies: 15,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'cryptography',
        views: 312
      },
      {
        id: '4',
        title: 'OWASP Top 10 - 2024 Update',
        content: 'Discussion about the latest OWASP vulnerabilities',
        author: 'Bob WebDev',
        replies: 22,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'web-security',
        views: 456
      }
    ];

    const filteredPosts = category === 'general' ? posts : posts.filter(p => p.category === category);

    return NextResponse.json({ posts: filteredPosts });
  } catch (error) {
    console.error('Community error:', error);
    return NextResponse.json({ error: 'Failed to fetch community posts' }, { status: 500 });
  }
}
