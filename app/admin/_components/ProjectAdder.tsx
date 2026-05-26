'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectAdder() {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [buyer, setBuyer] = useState('');
  const [prodUrl, setProdUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, name, buyer, prodUrl }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error === 'slug_taken' ? 'slug가 이미 사용 중입니다' : '필수 항목을 모두 입력해 주세요');
      return;
    }
    setOpen(false);
    setSlug(''); setName(''); setBuyer(''); setProdUrl('');
    router.refresh();
  }

  if (!open) {
    return (
      <div style={{ marginBottom: 16 }}>
        <button className="btn" onClick={() => setOpen(true)}>+ 프로젝트 추가</button>
      </div>
    );
  }

  return (
    <div className="card panel" style={{ marginBottom: 16 }}>
      <h4 style={{ marginBottom: 12, fontSize: 14 }}>새 프로젝트</h4>
      <div style={{ display: 'grid', gap: 8 }}>
        <input
          className="chat-input"
          placeholder="slug (예: my-project)"
          value={slug}
          onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
        />
        <input className="chat-input" placeholder="프로젝트명" value={name} onChange={e => setName(e.target.value)} />
        <input className="chat-input" placeholder="바이어 이름" value={buyer} onChange={e => setBuyer(e.target.value)} />
        <input className="chat-input" placeholder="운영 URL (https://...)" value={prodUrl} onChange={e => setProdUrl(e.target.value)} />
        {error && <div style={{ fontSize: 12, color: '#ef4444' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn primary" disabled={loading || !slug || !name || !buyer || !prodUrl} onClick={submit}>
            {loading ? '생성 중...' : '생성'}
          </button>
          <button className="btn ghost" onClick={() => setOpen(false)}>취소</button>
        </div>
      </div>
    </div>
  );
}
