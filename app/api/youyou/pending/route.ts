import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 유유 전용 인증: ADMIN_KEY 또는 나중에 추가할 YOUYOU_KEY
function isAuthorized(req: NextRequest) {
  const key = req.headers.get('x-youyou-key') ?? req.headers.get('x-admin-key');
  const validKey = process.env.YOUYOU_KEY ?? process.env.ADMIN_KEY;
  return key === validKey;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 미처리 바이어 메시지 조회 — 프로젝트 컨텍스트 포함
  const messages = await prisma.message.findMany({
    where: { type: 'buyer', processed: false },
    orderBy: { createdAt: 'asc' },
    include: {
      project: {
        include: {
          requests: { where: { status: { not: 'done' } }, orderBy: { createdAt: 'asc' } },
          messages: { orderBy: { createdAt: 'asc' }, take: 20 }, // 최근 대화 컨텍스트
        },
      },
    },
  });

  const pending = messages.map(msg => ({
    messageId: msg.id,
    sentAt: msg.createdAt,
    text: msg.text,
    project: {
      id: msg.project.id,
      slug: msg.project.slug,
      name: msg.project.name,
      buyer: msg.project.buyer,
      // 확장 연결 지점 — 나중에 값이 채워지면 유유가 자동으로 활용
      repoUrl: msg.project.repoUrl || null,           // TODO: GitHub repo URL
      vercelProjectId: msg.project.vercelProjectId || null,  // TODO: Vercel project ID
      devBranch: msg.project.devBranch,
      devUrl: msg.project.devUrl || null,
      previewUrl: msg.project.previewUrl,
      prodUrl: msg.project.prodUrl,
    },
    context: {
      recentMessages: msg.project.messages.map(m => ({
        type: m.type,
        text: m.text,
        createdAt: m.createdAt,
      })),
      openRequests: msg.project.requests.map(r => ({
        id: r.id,
        title: r.title,
        status: r.status,
        statusLabel: r.statusLabel,
      })),
    },
  }));

  return NextResponse.json({
    pending,
    total: pending.length,
    checkedAt: new Date().toISOString(),
  });
}
