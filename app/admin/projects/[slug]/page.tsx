import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import RequestManager from './_components/RequestManager';
import RequestAdder from './_components/RequestAdder';
import KeyGenerator from './_components/KeyGenerator';
import DeploymentAdder from './_components/DeploymentAdder';
import ProjectEditor from './_components/ProjectEditor';
import MessageAdder from './_components/MessageAdder';

export default async function AdminProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      requests: { orderBy: { createdAt: 'asc' } },
      deployments: { orderBy: { deployedAt: 'desc' }, take: 10 },
      accessKeys: { orderBy: { createdAt: 'desc' } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!project) notFound();

  return (
    <main className="page-shell">
      <header className="topbar card">
        <div className="brand">
          <div className="brand-badge">Y</div>
          <div>
            <h1>Youyou Admin</h1>
            <p>프로젝트 관리 · {project.name}</p>
          </div>
        </div>
        <div className="crumbs">
          <Link href="/admin/dashboard" style={{ color: 'var(--muted)' }}>대시보드</Link>
          <span>›</span>
          <span>{project.name}</span>
        </div>
        <div className="top-actions">
          <Link className="btn ghost" href="/admin/dashboard">← 목록으로</Link>
          <Link className="btn" href={`/portal/${slug}`} target="_blank">바이어 뷰 ↗</Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 22 }}>

          {/* 요청 관리 */}
          <div className="card panel">
            <div className="section-title">
              <div><h3>요청 관리</h3><p>요청 상태를 변경하거나 새 요청을 추가합니다.</p></div>
              <span className="pill">{project.requests.length}건</span>
            </div>
            <RequestManager requests={project.requests} />
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line-soft)' }}>
              <div className="label" style={{ marginBottom: 4 }}>새 요청 추가</div>
              <RequestAdder projectId={project.id} />
            </div>
          </div>

          {/* 유유 메시지 전송 + 채팅 내역 */}
          <div className="card panel">
            <div className="section-title">
              <div><h3>채팅 내역</h3><p>바이어와 유유 사이의 전체 대화</p></div>
              <span className="pill">{project.messages.length}건</span>
            </div>
            <div style={{ display: 'grid', gap: 8, marginTop: 12, maxHeight: 360, overflowY: 'auto' }}>
              {project.messages.length === 0 && (
                <div className="request-body" style={{ textAlign: 'center', padding: '20px 0' }}>메시지가 없습니다.</div>
              )}
              {project.messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.type === 'buyer' ? 'flex-start' : msg.type === 'agent' ? 'flex-end' : 'center',
                }}>
                  {msg.type === 'system' ? (
                    <div style={{ fontSize: 11, color: 'var(--subtle)', padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line-soft)' }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div style={{ maxWidth: '80%' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>
                        {msg.type === 'buyer' ? '바이어' : '유유'} · {new Date(msg.createdAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{
                        padding: '8px 12px', borderRadius: 12, fontSize: 13,
                        background: msg.type === 'buyer' ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.15)',
                        border: `1px solid ${msg.type === 'buyer' ? 'var(--line)' : 'rgba(99,102,241,0.3)'}`,
                        color: 'var(--text)',
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-soft)' }}>
              <MessageAdder projectId={project.id} />
            </div>
          </div>

          {/* 배포 기록 추가 */}
          <div className="card panel">
            <div className="section-title">
              <div><h3>배포 기록 추가</h3><p>새 배포 이력을 등록합니다.</p></div>
            </div>
            <DeploymentAdder projectId={project.id} />
          </div>

          {/* 최근 배포 */}
          <div className="card panel">
            <div className="section-title">
              <div><h3>최근 배포</h3><p>최근 10건</p></div>
            </div>
            <div className="request-list" style={{ marginTop: 12 }}>
              {project.deployments.map(dep => (
                <div key={dep.id} className="request-item">
                  <div className="request-head">
                    <span className="request-title" style={{ fontSize: 13 }}>{dep.title}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className={`pill ${dep.env === 'production' ? 'deploy-env-prod' : 'deploy-env-preview'}`}>{dep.env}</span>
                      <span className={`pill ${dep.status === 'success' ? 'success' : 'deploy-fail'}`}>{dep.statusLabel}</span>
                    </div>
                  </div>
                  <div className="request-body" style={{ fontSize: 12 }}>
                    {dep.deployedAt.toISOString().slice(0, 16).replace('T', ' ')} · {dep.version} · {dep.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ display: 'grid', gap: 16 }}>
          {/* 프로젝트 정보 수정 */}
          <div className="card sidebar-panel">
            <div className="sidebar-head"><h3 className="sidebar-title">프로젝트 정보</h3></div>
            <ProjectEditor project={{
              slug: project.slug,
              previewVersion: project.previewVersion,
              previewUrl: project.previewUrl,
              prodUrl: project.prodUrl,
              status: project.status,
              devUrl: project.devUrl,
              devBranch: project.devBranch,
              repoUrl: project.repoUrl,
              vercelProjectId: project.vercelProjectId,
            }} />
          </div>

          {/* Access Key 발급 */}
          <div className="card sidebar-panel">
            <div className="sidebar-head">
              <h3 className="sidebar-title">Access Key</h3>
              <span className="pill">{project.accessKeys.length}개</span>
            </div>
            <KeyGenerator projectId={project.id} />
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {project.accessKeys.map(k => (
                <div key={k.id} className="side-card" style={{ padding: 10 }}>
                  <div className="label" style={{ fontSize: 11 }}>발급일 {k.createdAt.toISOString().slice(0, 10)}</div>
                  {k.expiresAt && <div className="label" style={{ fontSize: 11 }}>만료 {k.expiresAt.toISOString().slice(0, 10)}</div>}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
