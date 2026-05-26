import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { projectId, env, status, statusLabel, version, title, trigger, duration, url } = body;

  if (!projectId || !env || !status || !title) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const deployment = await prisma.deployment.create({
    data: {
      projectId,
      env,
      status,
      statusLabel: statusLabel ?? (status === 'success' ? '배포 성공' : '배포 실패'),
      version: version ?? '',
      title,
      trigger: trigger ?? '수동',
      deployedAt: new Date(),
      duration: duration ?? '-',
      url: url ?? '',
    },
  });

  // 프로젝트 마지막 배포 시간 업데이트
  if (status === 'success' && env === 'production') {
    const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    await prisma.project.update({
      where: { id: projectId },
      data: { lastDeployCommit: version ?? '', lastDeployTime: time },
    });
  }

  return NextResponse.json(deployment);
}
