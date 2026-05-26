// MVP 더미 데이터 — Phase 3 DB 연결 시 이 파일만 교체

export const PROJECT = {
  slug: 'glowskin-landing-renewal',
  name: 'GlowSkin Landing Renewal',
  buyer: 'glowskin',
  status: 'active' as const,
  prodUrl: 'https://glowskin.co.kr',
  previewVersion: 'banner-copy-v2',
  previewUrl: 'preview-glowskin-banner-v2.internal',
  lastDeployCommit: 'preview-024',
  lastDeployTime: '18:42',
  openRequests: 3,
  pendingApproval: 1,
};

export type RequestStatus = 'success' | 'waiting' | '';

export interface Request {
  id: number;
  title: string;
  status: RequestStatus;
  statusLabel: string;
  desc: string;
  hasAction: boolean;
}

export const REQUESTS: Request[] = [
  {
    id: 1,
    title: '메인 배너 문구 수정 및 CTA 정리',
    status: 'success',
    statusLabel: 'preview ready',
    desc: '문구와 CTA 정리 요청이 반영되었고, preview 링크에서 확인 가능합니다.',
    hasAction: true,
  },
  {
    id: 2,
    title: '시술 전후 섹션 순서 변경',
    status: 'waiting',
    statusLabel: 'awaiting buyer reply',
    desc: '새 preview 준비 중이며 production 배포는 아직 진행되지 않았습니다.',
    hasAction: false,
  },
  {
    id: 3,
    title: '가격표 카드 여백 조정',
    status: '',
    statusLabel: 'in progress',
    desc: '모바일에서 카드 폭과 여백을 조정하는 작업입니다.',
    hasAction: false,
  },
];

export type MessageType = 'agent' | 'buyer' | 'system';

export interface Message {
  id: number;
  type: MessageType;
  text: string;
  time: string;
}

export const MESSAGES: Message[] = [
  { id: 1, type: 'agent', text: '안녕하세요! GlowSkin 프로젝트 담당 유유입니다. 수정 요청이나 확인 사항이 있으시면 여기서 말씀해 주세요.', time: '14:02' },
  { id: 2, type: 'buyer', text: '메인 히어로 문구를 더 프리미엄하게 바꾸고 CTA를 상담 예약 중심으로 정리해줘.', time: '14:08' },
  { id: 3, type: 'agent', text: '요청 확인했습니다. 먼저 preview에 반영하고 링크를 전달드리겠습니다. 작업 시작할게요.', time: '14:09' },
  { id: 4, type: 'system', text: 'preview 준비 완료 → preview-glowskin-banner-v2.internal', time: '14:31' },
  { id: 5, type: 'buyer', text: '확인했어. 이 버전으로 배포해줘.', time: '14:44' },
  { id: 6, type: 'agent', text: '좋습니다. production 배포를 진행하고 완료 결과를 바로 남기겠습니다.', time: '14:44' },
  { id: 7, type: 'system', text: 'production 배포 완료 (commit preview-024) · 18:42', time: '18:42' },
  { id: 8, type: 'agent', text: '시술 전후 섹션 순서 변경 요청 확인했습니다. 새 preview 준비 중입니다. 잠시 기다려 주세요.', time: '20:15' },
  { id: 9, type: 'system', text: 'change request #2 접수 · 시술 전후 섹션 순서 변경', time: '20:16' },
];

// 대시보드 채팅 미리보기용 — 마지막 2개는 모바일에서 숨김
export const CHAT_PREVIEW: (Message & { optional?: boolean })[] = [
  MESSAGES[1],
  MESSAGES[2],
  MESSAGES[3],
  { ...MESSAGES[4], optional: true },
  { ...MESSAGES[5], optional: true },
];

export type DeployEnv = 'production' | 'preview';
export type DeployStatus = 'success' | 'fail' | 'pending';

export interface Deployment {
  id: number;
  env: DeployEnv;
  status: DeployStatus;
  statusLabel: string;
  version: string;
  title: string;
  trigger: string;
  date: string;
  time: string;
  duration: string;
  url: string;
}

export const DEPLOYMENTS: Deployment[] = [
  {
    id: 1,
    env: 'production',
    status: 'success',
    statusLabel: '배포 성공',
    version: 'preview-024',
    title: '메인 배너 문구 수정 및 CTA 정리',
    trigger: '바이어 승인',
    date: '2026-05-21',
    time: '18:42',
    duration: '1분 12초',
    url: 'https://glowskin.co.kr',
  },
  {
    id: 2,
    env: 'preview',
    status: 'success',
    statusLabel: '배포 성공',
    version: 'preview-024',
    title: '메인 배너 문구 수정 및 CTA 정리',
    trigger: '유유 자동 반영',
    date: '2026-05-21',
    time: '14:31',
    duration: '48초',
    url: 'preview-glowskin-banner-v2.internal',
  },
  {
    id: 3,
    env: 'preview',
    status: 'success',
    statusLabel: '배포 성공',
    version: 'preview-023',
    title: '히어로 섹션 레이아웃 조정',
    trigger: '유유 자동 반영',
    date: '2026-05-20',
    time: '11:05',
    duration: '52초',
    url: 'preview-glowskin-hero-v3.internal',
  },
  {
    id: 4,
    env: 'production',
    status: 'success',
    statusLabel: '배포 성공',
    version: 'preview-022',
    title: '히어로 섹션 레이아웃 조정',
    trigger: '바이어 승인',
    date: '2026-05-20',
    time: '16:20',
    duration: '1분 03초',
    url: 'https://glowskin.co.kr',
  },
  {
    id: 5,
    env: 'preview',
    status: 'fail',
    statusLabel: '배포 실패',
    version: 'preview-021',
    title: '가격표 섹션 디자인 변경 (실패)',
    trigger: '유유 자동 반영',
    date: '2026-05-19',
    time: '09:14',
    duration: '23초',
    url: '',
  },
  {
    id: 6,
    env: 'preview',
    status: 'success',
    statusLabel: '배포 성공',
    version: 'preview-020',
    title: 'footer 연락처 업데이트',
    trigger: '유유 자동 반영',
    date: '2026-05-18',
    time: '13:52',
    duration: '44초',
    url: 'preview-glowskin-footer-v1.internal',
  },
];

export const DEPLOY_STATS = [
  { label: '전체 배포', value: '24회' },
  { label: 'production 배포', value: '8회' },
  { label: '성공률', value: '96%' },
  { label: '마지막 배포', value: '18:42' },
];
