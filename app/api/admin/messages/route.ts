import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { projectId, text } = await req.json().catch(() => ({}));
  if (!projectId || !text?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { projectId, type: 'agent', text: text.trim() },
  });

  return NextResponse.json(message);
}
