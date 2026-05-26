import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      requests: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!project) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  return NextResponse.json({
    messages: project.messages,
    requests: project.requests,
    preview: { version: project.previewVersion, url: project.previewUrl },
    devUrl: project.devUrl || null,
    projectName: project.name,
  });
}
