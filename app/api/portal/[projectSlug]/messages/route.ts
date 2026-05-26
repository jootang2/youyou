import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  const { text } = await req.json().catch(() => ({}));

  if (!text?.trim()) return NextResponse.json({ error: 'missing_text' }, { status: 400 });

  const project = await prisma.project.findUnique({ where: { slug: projectSlug }, select: { id: true } });
  if (!project) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const message = await prisma.message.create({
    data: { projectId: project.id, type: 'buyer', text: text.trim() },
  });

  return NextResponse.json(message);
}
