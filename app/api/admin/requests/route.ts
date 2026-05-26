import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { projectId, title, desc } = await req.json().catch(() => ({}));
  if (!projectId || !title?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const request = await prisma.request.create({
    data: {
      projectId,
      title: title.trim(),
      desc: desc?.trim() ?? '',
      status: '',
      statusLabel: 'in progress',
      hasAction: false,
    },
  });

  const [openCount, approvalCount] = await Promise.all([
    prisma.request.count({ where: { projectId, status: { not: 'done' } } }),
    prisma.request.count({ where: { projectId, hasAction: true } }),
  ]);
  await prisma.project.update({
    where: { id: projectId },
    data: { openRequests: openCount, pendingApproval: approvalCount },
  });

  return NextResponse.json(request);
}
