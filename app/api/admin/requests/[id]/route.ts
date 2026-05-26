import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['', 'waiting', 'success', 'done'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, statusLabel, hasAction } = await req.json().catch(() => ({}));

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 });
  }

  const existing = await prisma.request.findUnique({ where: { id }, select: { projectId: true } });
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const updated = await prisma.request.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(statusLabel !== undefined && { statusLabel }),
      ...(hasAction !== undefined && { hasAction }),
    },
  });

  const { projectId } = existing;
  const [openCount, approvalCount] = await Promise.all([
    prisma.request.count({ where: { projectId, status: { not: 'done' } } }),
    prisma.request.count({ where: { projectId, hasAction: true } }),
  ]);
  await prisma.project.update({
    where: { id: projectId },
    data: { openRequests: openCount, pendingApproval: approvalCount },
  });

  return NextResponse.json(updated);
}
