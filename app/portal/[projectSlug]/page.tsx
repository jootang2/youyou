import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ProjectDashboardPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    include: {
      requests: { orderBy: { createdAt: 'asc' } },
      messages: { orderBy: { createdAt: 'asc' }, take: 10 },
    },
  });

  if (!project) notFound();

  const previewMessages = project.messages.slice(1, 6);

  return (
    <main className="page-shell">
      <header className="topbar card">
        <div className="brand">
          <div className="brand-badge">Y</div>
          <div>
            <h1>Youyou Buyer Portal</h1>
            <p>project dashboard · preview review · approved deploy</p>
          </div>
        </div>
        <div className="crumbs">
          <span>Buyer Portal</span>
          <span>›</span>
          <span>{project.name}</span>
        </div>
        <div className="top-actions">
          <Link className="btn ghost" href="/">다른 프로젝트로 이동</Link>
          <Link className="btn" href={`/portal/${project.slug}/chat`}>채팅 보기</Link>
          <a className="btn primary" href="#preview">Preview 확인</a>
        </div>
      </header>

      <section className="hero-grid">
        <div className="card hero-main">
          <div>
            <div className="eyebrow">buyer scoped dashboard</div>
            <h2>내 프로젝트 상태와 최근 요청 흐름을 한눈에 확인합니다.</h2>
            <p className="lead">
              운영 URL, preview 링크, 최근 요청 상태, 최근 배포 결과, 유유와의 진행 흐름을 빠르게 파악할 수 있도록 구성했습니다.
            </p>
            <div className="hero-meta">
              <div className="metric">
                <strong>{String(project.openRequests).padStart(2, '0')}</strong>
                <span>현재 열린 요청</span>
              </div>
              <div className="metric">
                <strong>{String(project.pendingApproval).padStart(2, '0')}</strong>
                <span>배포 승인 대기</span>
              </div>
              <div className="metric">
                <strong>{project.lastDeployTime}</strong>
                <span>마지막 production 배포</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="card hero-side">
          <div className="side-card">
            <div className="label">프로젝트명</div>
            <strong>{project.name}</strong>
            <div className="pill-row">
              <span className="pill">buyer: {project.buyer}</span>
              <span className="pill success">{project.status}</span>
            </div>
          </div>
          <div className="side-card">
            <div className="label">운영 URL</div>
            <div className="link-row">
              <a className="link-chip" href={project.prodUrl} target="_blank" rel="noopener noreferrer">{project.prodUrl} ↗</a>
            </div>
          </div>
          <div className="side-card" id="preview">
            <div className="label">현재 preview</div>
            <strong>{project.previewVersion}</strong>
            <div className="link-row">
              <a className="link-chip" href={project.previewUrl} target="_blank" rel="noopener noreferrer">{project.previewUrl} ↗</a>
            </div>
          </div>
          <div className="side-card">
            <div className="label">최근 배포 상태</div>
            <div className="pill-row">
              <span className="pill success">production success</span>
              <span className="pill">commit {project.lastDeployCommit}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="content-grid">
        <div className="card panel">
          <div className="section-title">
            <div>
              <h3>최근 요청</h3>
              <p>수정 요청부터 preview 준비, 승인 대기까지의 현재 진행 상황</p>
            </div>
          </div>
          <div className="request-list">
            {project.requests.map((req, i) => (
              <article key={req.id} className={`request-item${i > 0 ? ' compact-mobile' : ''}`}>
                <div className="request-head">
                  <div className="request-title">{req.title}</div>
                  <span className={`pill ${req.status}`}>{req.statusLabel}</span>
                </div>
                <div className="request-body">{req.desc}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="card panel chat-preview">
          <div className="section-title">
            <div>
              <h3>유유와 채팅 미리보기</h3>
              <p>전체 채팅 페이지 진입 전 최근 흐름만 요약해서 보여줍니다.</p>
            </div>
            <span className="pill success">online</span>
          </div>
          <div className="chat-list">
            {previewMessages.map((msg, i) => (
              <div key={msg.id} className={`bubble ${msg.type}${i >= 3 ? ' optional-mobile' : ''}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="actions-row">
            <Link className="btn primary" href={`/portal/${project.slug}/chat`}>전체 채팅 보기</Link>
            <Link className="btn" href={`/portal/${project.slug}/deployments`}>배포 이력 보기</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
