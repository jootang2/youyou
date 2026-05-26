'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!key.trim() || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) { setError('유효하지 않은 admin key입니다.'); return; }
      router.push('/admin/dashboard');
    } catch {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell" style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card auth-panel" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div className="auth-shell">
          <div className="auth-top">
            <div className="brand" style={{ marginBottom: 20 }}>
              <div className="brand-badge">Y</div>
              <div>
                <h1 style={{ fontSize: 15 }}>Youyou Admin</h1>
                <p style={{ color: 'var(--muted)', fontSize: 13 }}>운영자 전용 관리 패널</p>
              </div>
            </div>
            <div className="eyebrow">Admin access</div>
            <h3>Admin key를 입력해 주세요.</h3>
          </div>
          <div className="form-card">
            <div className="field">
              <label htmlFor="admin-key">Admin key</label>
              <input
                id="admin-key"
                type="password"
                value={key}
                onChange={e => { setKey(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
              {error && <div className="helper" style={{ color: '#f87171' }}>{error}</div>}
            </div>
            <div className="actions">
              <button
                className="btn primary"
                onClick={handleLogin}
                disabled={!key.trim() || loading}
                style={{ opacity: (!key.trim() || loading) ? 0.5 : 1 }}
              >
                {loading ? '확인 중...' : '관리 패널 진입'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
