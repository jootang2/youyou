import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAuthorized(req: NextRequest) {
  const key = req.headers.get('x-youyou-key') ?? req.headers.get('x-admin-key');
  const validKey = process.env.YOUYOU_KEY ?? process.env.ADMIN_KEY;
  return key === validKey;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const updated = await prisma.message.update({
    where: { id },
    data: { processed: true },
  });

  return NextResponse.json({ ok: true, messageId: updated.id });
}
