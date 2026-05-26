import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json().catch(() => ({}));

  const allowed = [
    'previewVersion', 'previewUrl', 'prodUrl', 'status', 'openRequests', 'pendingApproval',
    // 확장 필드 — 나중에 GitHub/Vercel 연결 시 활용
    'devUrl', 'devBranch', 'repoUrl', 'vercelProjectId',
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const updated = await prisma.project.update({ where: { slug }, data });
  return NextResponse.json(updated);
}
