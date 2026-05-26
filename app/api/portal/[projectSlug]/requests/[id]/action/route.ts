import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string; id: string }> }
) {
  const { projectSlug, id } = await params;
  const { action } = await req.json().catch(() => ({}));

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { slug: projectSlug }, select: { id: true } });
  if (!project) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const isApprove = action === 'approve';

  await prisma.request.update({
    where: { id },
    data: {
      status: isApprove ? 'done' : '',
      statusLabel: isApprove ? 'done' : 'in progress',
      hasAction: false,
    },
  });

  const [openCount, approvalCount] = await Promise.all([
    prisma.request.count({ where: { projectId: project.id, status: { not: 'done' } } }),
    prisma.request.count({ where: { projectId: project.id, hasAction: true } }),
  ]);
  await prisma.project.update({
    where: { id: project.id },
    data: { openRequests: openCount, pendingApproval: approvalCount },
  });

  const msg = await prisma.message.create({
    data: {
      projectId: project.id,
      type: 'system',
      text: isApprove
        ? '바이어가 배포를 승인했습니다. production 배포를 진행합니다.'
        : '바이어가 수정을 요청했습니다. 요청 내용을 확인해 주세요.',
    },
  });

  return NextResponse.json({ ok: true, message: msg });
}
