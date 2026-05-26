import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash, randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  const { projectId, expiresAt } = await req.json().catch(() => ({}));
  if (!projectId) return NextResponse.json({ error: 'missing_projectId' }, { status: 400 });

  const rawKey = randomBytes(16).toString('hex');
  const keyHash = createHash('sha256').update(rawKey).digest('hex');

  await prisma.accessKey.create({
    data: {
      keyHash,
      projectId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  // rawKey는 이 응답에서만 노출 — DB에는 저장 안 됨
  return NextResponse.json({ key: rawKey });
}
