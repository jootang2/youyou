'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';

interface Message { id: string; type: string; text: string; createdAt: string }
interface Request { id: string; title: string; status: string; statusLabel: string; desc: string; hasAction: boolean }

export default function ChatPage({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = use(params);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [preview, setPreview] = useState({ version: '', url: '' });
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    function fetchData() {
      fetch(`/api/portal/${projectSlug}/chat-data`)
        .then(r => r.json())
        .then(d => {
          setMessages(d.messages ?? []);
          setRequests(d.requests ?? []);
          setPreview(d.preview ?? { version: '', url: '' });
          setDevUrl(d.devUrl ?? null);
          setProjectName(d.projectName ?? '');
        })
        .catch(() => {});
    }

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [projectSlug]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const res = await fetch(`/api/portal/${projectSlug}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const msg = await res.json();
    setMessages(prev => [...prev, msg]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') sendMessage();
  }

  async function handleAction(reqId: string, action: 'approve' | 'reject') {
    setActionLoading(reqId);
    await fetch(`/api/portal/${projectSlug}/requests/${reqId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const d = await fetch(`/api/portal/${projectSlug}/chat-data`).then(r => r.json());
    setMessages(d.messages ?? []);
    setRequests(d.requests ?? []);
    setActionLoading(null);
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <main className="page-shell">
      <header className="topbar card">
        <div className="brand">
          <div className="brand-badge">Y</div>
          <div>
            <h1>Youyou Buyer Portal</h1>
            <p>project chat · {projectName}</p>
          </div>
        </div>
        <div className="crumbs">
          <span>Buyer Portal</span><span>›</span>
          <span>{projectName}</span><span>›</span>
          <span>채팅</span>
        </div>
        <div className="top-actions">
          <Link className="btn ghost" href={`/portal/${projectSlug}`}>대시보드로</Link>
          <Link className="btn" href={`/portal/${projectSlug}/deployments`}>배포 이력</Link>
        </div>
      </header>

      <div className="chat-layout">
        <div className="chat-main card">
          <div className="chat-header">
            <div>
              <div className="eyebrow">live chat</div>
              <h3 className="chat-title">유유와 채팅</h3>
              <p className="chat-sub">수정 요청, preview 확인, 배포 승인을 여기서 진행합니다.</p>
            </div>
            <span className="pill success">● online</span>
          </div>
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message-row ${msg.type}`}>
                {msg.type === 'agent' && <div className="avatar">Y</div>}
                <div className="bubble-wrap">
                  <div className={`bubble ${msg.type}`}>{msg.text}</div>
                  <div className="msg-time">{formatTime(msg.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input-bar">
            <input
              className="chat-input"
              type="text"
              placeholder="수정 요청이나 확인 사항을 입력하세요..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn primary send-btn" disabled={!input.trim()} onClick={sendMessage}>
              전송
            </button>
          </div>
        </div>

        <aside className="chat-sidebar">
          <div className="card sidebar-panel">
            <div className="sidebar-head">
              <h3 className="sidebar-title">현재 요청</h3>
              <span className="pill">{requests.length}건</span>
            </div>
            <div className="request-list">
              {requests.map(req => (
                <article key={req.id} className="request-item">
                  <div className="request-head">
                    <div className="request-title">{req.title}</div>
                    <span className={`pill ${req.status}`}>{req.statusLabel}</span>
                  </div>
                  <div className="request-body">{req.desc}</div>
                  {req.hasAction && (
                    <div className="deploy-actions">
                      <button
                        className="btn primary"
                        disabled={actionLoading === req.id}
                        onClick={() => handleAction(req.id, 'approve')}
                      >배포 승인</button>
                      <button
                        className="btn"
                        disabled={actionLoading === req.id}
                        onClick={() => handleAction(req.id, 'reject')}
                      >수정 요청</button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
          {devUrl && (
            <div className="card sidebar-panel">
              <div className="sidebar-head">
                <h3 className="sidebar-title">유유 작업 중</h3>
                <span className="pill waiting">● 작업 중</span>
              </div>
              <div className="side-card">
                <div className="label" style={{ marginBottom: 6 }}>수정 사항을 먼저 확인해보세요.</div>
                <a className="btn primary" style={{ width: '100%', justifyContent: 'center' }} href={devUrl} target="_blank" rel="noopener noreferrer">
                  작업 중인 페이지 보기 ↗
                </a>
              </div>
            </div>
          )}
          {preview.version && (
            <div className="card sidebar-panel">
              <div className="sidebar-head">
                <h3 className="sidebar-title">현재 Preview</h3>
                <span className="pill success">ready</span>
              </div>
              <div className="side-card">
                <div className="label">preview 버전</div>
                <strong>{preview.version}</strong>
                <div className="link-row" style={{ marginTop: 8 }}>
                  <a className="link-chip" href={preview.url} target="_blank" rel="noopener noreferrer">{preview.url} ↗</a>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
