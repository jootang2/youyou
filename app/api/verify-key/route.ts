import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const raw: string = (body.key ?? '').trim();
  if (!raw) return NextResponse.json({ error: 'missing_key' }, { status: 400 });

  const keyHash = createHash('sha256').update(raw).digest('hex');
  const accessKey = await prisma.accessKey.findUnique({
    where: { keyHash },
    include: { project: { select: { slug: true } } },
  });

  if (!accessKey) return NextResponse.json({ error: 'invalid_key' }, { status: 401 });
  if (accessKey.expiresAt && accessKey.expiresAt < new Date()) {
    return NextResponse.json({ error: 'expired_key' }, { status: 401 });
  }

  const slug = accessKey.project.slug;
  const res = NextResponse.json({ slug });
  res.cookies.set('portal_auth', slug, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24시간
  });
  return res;
}
