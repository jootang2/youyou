import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

function envPill(env: string) {
  if (env === 'production') return <span className="pill deploy-env-prod">production</span>;
  return <span className="pill deploy-env-preview">preview</span>;
}

function statusPill(status: string, label: string) {
  if (status === 'success') return <span className="pill success">{label}</span>;
  if (status === 'fail') return <span className="pill deploy-fail">{label}</span>;
  return <span className="pill waiting">{label}</span>;
}

export default async function DeploymentsPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    include: { deployments: { orderBy: { deployedAt: 'desc' } } },
  });

  if (!project) notFound();

  const prodCount = project.deployments.filter(d => d.env === 'production').length;
  const successCount = project.deployments.filter(d => d.status === 'success').length;
  const successRate = project.deployments.length > 0
    ? Math.round((successCount / project.deployments.length) * 100) + '%'
    : '-';

  const stats = [
    { label: '전체 배포', value: `${project.deployments.length}회` },
    { label: 'production 배포', value: `${prodCount}회` },
    { label: '성공률', value: successRate },
    { label: '마지막 배포', value: project.lastDeployTime },
  ];

  const pendingRequest = null; // 향후 DB 쿼리로 교체

  return (
    <main className="page-shell">
      <header className="topbar card">
        <div className="brand">
          <div className="brand-badge">Y</div>
          <div>
            <h1>Youyou Buyer Portal</h1>
            <p>deployments · {project.name}</p>
          </div>
        </div>
        <div className="crumbs">
          <span>Buyer Portal</span><span>›</span>
          <span>{project.name}</span><span>›</span>
          <span>배포 이력</span>
        </div>
        <div className="top-actions">
          <Link className="btn ghost" href={`/portal/${projectSlug}`}>대시보드로</Link>
          <Link className="btn" href={`/portal/${projectSlug}/chat`}>채팅 보기</Link>
        </div>
      </header>

      <div className="deploy-layout">
        <section className="deploy-main">
          <div className="card panel">
            <div className="section-title">
              <div>
                <h3>배포 이력</h3>
                <p>preview → production 순서로 기록된 전체 배포 목록</p>
              </div>
              <span className="pill">{project.deployments.length}건</span>
            </div>
            <div className="deploy-list">
              {project.deployments.map(dep => (
                <article key={dep.id} className="deploy-item">
                  <div className="deploy-meta-col">
                    <div className="deploy-date">{dep.deployedAt.toISOString().slice(0, 10)}</div>
                    <div className="deploy-time">{dep.deployedAt.toISOString().slice(11, 16)}</div>
                  </div>
                  <div className="deploy-connector">
                    <div className={`deploy-dot ${dep.status}`} />
                    <div className="deploy-line" />
                  </div>
                  <div className="deploy-content">
                    <div className="deploy-head">
                      <div className="deploy-title">{dep.title}</div>
                      <div className="deploy-pills">
                        {envPill(dep.env)}
                        {statusPill(dep.status, dep.statusLabel)}
                      </div>
                    </div>
                    <div className="deploy-info">
                      <span className="deploy-tag">commit {dep.version}</span>
                      <span className="deploy-tag">트리거: {dep.trigger}</span>
                      <span className="deploy-tag">소요: {dep.duration}</span>
                    </div>
                    {dep.url && <div className="deploy-url"><a className="link-chip" href={dep.url} target="_blank" rel="noopener noreferrer">{dep.url} ↗</a></div>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="deploy-sidebar">
          <div className="card sidebar-panel">
            <div className="sidebar-head"><h3 className="sidebar-title">배포 요약</h3></div>
            <div className="stats-grid">
              {stats.map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card sidebar-panel">
            <div className="sidebar-head">
              <h3 className="sidebar-title">운영 URL</h3>
              <span className="pill success">live</span>
            </div>
            <div className="side-card">
              <div className="label">현재 운영 중</div>
              <strong>{project.lastDeployCommit}</strong>
              <div className="link-row" style={{ marginTop: 8 }}>
                <a className="link-chip" href={project.prodUrl} target="_blank" rel="noopener noreferrer">{project.prodUrl} ↗</a>
              </div>
            </div>
          </div>

          <div className="card sidebar-panel">
            <div className="sidebar-head">
              <h3 className="sidebar-title">현재 Preview</h3>
              <span className="pill waiting">대기 중</span>
            </div>
            <div className="side-card">
              <div className="label">preview 버전</div>
              <strong>{project.previewVersion}</strong>
              <div className="link-row" style={{ marginTop: 8 }}>
                <Link className="btn primary" style={{ width: '100%', justifyContent: 'center' }} href={`/portal/${projectSlug}/chat`}>
                  채팅에서 승인하기
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
