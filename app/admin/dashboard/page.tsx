import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminLogout from '../_components/AdminLogout';
import ProjectAdder from '../_components/ProjectAdder';

export default async function AdminDashboardPage() {
  const projects = await prisma.project.findMany({
    include: {
      _count: { select: { requests: true, accessKeys: true, deployments: true } },
      messages: {
        where: { type: 'buyer', processed: false },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="page-shell">
      <header className="topbar card">
        <div className="brand">
          <div className="brand-badge">Y</div>
          <div>
            <h1>Youyou Admin</h1>
            <p>운영자 관리 패널</p>
          </div>
        </div>
        <div className="top-actions">
          <AdminLogout />
        </div>
      </header>

      <div className="card panel" style={{ marginTop: 0 }}>
        <div className="section-title">
          <div>
            <h3>프로젝트 목록</h3>
            <p>전체 {projects.length}개 프로젝트</p>
          </div>
        </div>

        <ProjectAdder />

        <div className="request-list" style={{ marginTop: 16 }}>
          {projects.map(p => (
            <Link key={p.id} href={`/admin/projects/${p.slug}`} style={{ textDecoration: 'none' }}>
              <article className="request-item" style={{ cursor: 'pointer' }}>
                <div className="request-head">
                  <div className="request-title">{p.name}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {p.messages.length > 0 && (
                      <span className="pill waiting" style={{ fontWeight: 700 }}>💬 채팅 도착</span>
                    )}
                    <span className={`pill ${p.status === 'active' ? 'success' : ''}`}>{p.status}</span>
                  </div>
                </div>
                <div className="request-body">
                  buyer: {p.buyer} · 요청 {p._count.requests}건 · 키 {p._count.accessKeys}개 · 배포 {p._count.deployments}회
                </div>
                {p.messages.length > 0 && (
                  <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', fontSize: 13, color: 'var(--subtle)' }}>
                    바이어: {p.messages[0].text.length > 60 ? p.messages[0].text.slice(0, 60) + '...' : p.messages[0].text}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <span className="pill waiting">승인 대기 {p.pendingApproval}건</span>
                  <span className="pill">열린 요청 {p.openRequests}건</span>
                  <span className="deploy-tag" style={{ fontSize: 12, padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line-soft)', color: 'var(--subtle)' }}>마지막 배포 {p.lastDeployTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
