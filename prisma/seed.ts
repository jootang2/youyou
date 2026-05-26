import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import { createHash } from 'crypto';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const project = await prisma.project.upsert({
    where: { slug: 'glowskin-landing-renewal' },
    update: {},
    create: {
      slug: 'glowskin-landing-renewal',
      name: 'GlowSkin Landing Renewal',
      buyer: 'glowskin',
      status: 'active',
      prodUrl: 'https://glowskin.co.kr',
      previewVersion: 'banner-copy-v2',
      previewUrl: 'preview-glowskin-banner-v2.internal',
      lastDeployCommit: 'preview-024',
      lastDeployTime: '18:42',
      openRequests: 3,
      pendingApproval: 1,
    },
  });

  await prisma.accessKey.upsert({
    where: { keyHash: createHash('sha256').update('glow-2026-preview-key').digest('hex') },
    update: {},
    create: {
      keyHash: createHash('sha256').update('glow-2026-preview-key').digest('hex'),
      projectId: project.id,
    },
  });

  await prisma.request.createMany({
    skipDuplicates: true,
    data: [
      { projectId: project.id, title: '메인 배너 문구 수정 및 CTA 정리', status: 'success', statusLabel: 'preview ready', desc: '문구와 CTA 정리 요청이 반영되었고, preview 링크에서 확인 가능합니다.', hasAction: true },
      { projectId: project.id, title: '시술 전후 섹션 순서 변경', status: 'waiting', statusLabel: 'awaiting buyer reply', desc: '새 preview 준비 중이며 production 배포는 아직 진행되지 않았습니다.', hasAction: false },
      { projectId: project.id, title: '가격표 카드 여백 조정', status: '', statusLabel: 'in progress', desc: '모바일에서 카드 폭과 여백을 조정하는 작업입니다.', hasAction: false },
    ],
  });

  await prisma.message.createMany({
    data: [
      { projectId: project.id, type: 'agent', text: '안녕하세요! GlowSkin 프로젝트 담당 유유입니다. 수정 요청이나 확인 사항이 있으시면 여기서 말씀해 주세요.', createdAt: new Date('2026-05-21T14:02:00') },
      { projectId: project.id, type: 'buyer', text: '메인 히어로 문구를 더 프리미엄하게 바꾸고 CTA를 상담 예약 중심으로 정리해줘.', createdAt: new Date('2026-05-21T14:08:00') },
      { projectId: project.id, type: 'agent', text: '요청 확인했습니다. 먼저 preview에 반영하고 링크를 전달드리겠습니다. 작업 시작할게요.', createdAt: new Date('2026-05-21T14:09:00') },
      { projectId: project.id, type: 'system', text: 'preview 준비 완료 → preview-glowskin-banner-v2.internal', createdAt: new Date('2026-05-21T14:31:00') },
      { projectId: project.id, type: 'buyer', text: '확인했어. 이 버전으로 배포해줘.', createdAt: new Date('2026-05-21T14:44:00') },
      { projectId: project.id, type: 'agent', text: '좋습니다. production 배포를 진행하고 완료 결과를 바로 남기겠습니다.', createdAt: new Date('2026-05-21T14:44:30') },
      { projectId: project.id, type: 'system', text: 'production 배포 완료 (commit preview-024) · 18:42', createdAt: new Date('2026-05-21T18:42:00') },
      { projectId: project.id, type: 'agent', text: '시술 전후 섹션 순서 변경 요청 확인했습니다. 새 preview 준비 중입니다. 잠시 기다려 주세요.', createdAt: new Date('2026-05-21T20:15:00') },
      { projectId: project.id, type: 'system', text: 'change request #2 접수 · 시술 전후 섹션 순서 변경', createdAt: new Date('2026-05-21T20:16:00') },
    ],
  });

  await prisma.deployment.createMany({
    data: [
      { projectId: project.id, env: 'production', status: 'success', statusLabel: '배포 성공', version: 'preview-024', title: '메인 배너 문구 수정 및 CTA 정리', trigger: '바이어 승인', deployedAt: new Date('2026-05-21T18:42:00'), duration: '1분 12초', url: 'https://glowskin.co.kr' },
      { projectId: project.id, env: 'preview', status: 'success', statusLabel: '배포 성공', version: 'preview-024', title: '메인 배너 문구 수정 및 CTA 정리', trigger: '유유 자동 반영', deployedAt: new Date('2026-05-21T14:31:00'), duration: '48초', url: 'preview-glowskin-banner-v2.internal' },
      { projectId: project.id, env: 'preview', status: 'success', statusLabel: '배포 성공', version: 'preview-023', title: '히어로 섹션 레이아웃 조정', trigger: '유유 자동 반영', deployedAt: new Date('2026-05-20T11:05:00'), duration: '52초', url: 'preview-glowskin-hero-v3.internal' },
      { projectId: project.id, env: 'production', status: 'success', statusLabel: '배포 성공', version: 'preview-022', title: '히어로 섹션 레이아웃 조정', trigger: '바이어 승인', deployedAt: new Date('2026-05-20T16:20:00'), duration: '1분 03초', url: 'https://glowskin.co.kr' },
      { projectId: project.id, env: 'preview', status: 'fail', statusLabel: '배포 실패', version: 'preview-021', title: '가격표 섹션 디자인 변경 (실패)', trigger: '유유 자동 반영', deployedAt: new Date('2026-05-19T09:14:00'), duration: '23초', url: '' },
      { projectId: project.id, env: 'preview', status: 'success', statusLabel: '배포 성공', version: 'preview-020', title: 'footer 연락처 업데이트', trigger: '유유 자동 반영', deployedAt: new Date('2026-05-18T13:52:00'), duration: '44초', url: 'preview-glowskin-footer-v1.internal' },
    ],
  });

  console.log('Seed complete. Project:', project.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
