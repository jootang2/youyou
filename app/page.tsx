'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEnter() {
    if (!key.trim() || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError('유효하지 않은 access key입니다. 다시 확인해 주세요.');
        return;
      }
      router.push(`/portal/${data.slug}`);
    } catch {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="access-frame">
        <div className="card showcase">
          <div className="brandbar">
            <div className="brand">
              <div className="brand-badge">Y</div>
              <div>
                <h1>Youyou Buyer Portal</h1>
                <p>buyer access · preview review · approved deploy</p>
              </div>
            </div>
          </div>

          <div className="showcase-copy">
            <div className="eyebrow">바이어 전용 진입 화면</div>
            <h2>키를 입력하고 내 프로젝트 관리 페이지로 바로 들어갑니다.</h2>
            <p className="lead">
              바이어는 각자 발급받은 access key로 자기 프로젝트에만 접근합니다. 요청, preview 확인,
              승인 배포 이력이 모두 바이어별로 분리되어 관리됩니다.
            </p>

            <div className="signal-grid">
              <div className="signal">
                <strong>Buyer scoped</strong>
                <span>한 바이어는 자기 프로젝트만 보고, 다른 프로젝트에는 접근하지 않습니다.</span>
              </div>
              <div className="signal">
                <strong>Preview first</strong>
                <span>수정 요청은 먼저 preview에 반영되고, 확인 후에만 production 배포가 가능합니다.</span>
              </div>
              <div className="signal">
                <strong>Action history</strong>
                <span>요청 생성, 유유 응답, 승인, 배포 결과가 모두 기록됩니다.</span>
              </div>
              <div className="signal">
                <strong>Low friction</strong>
                <span>복잡한 로그인 대신 바로 키를 입력해 빠르게 진입할 수 있습니다.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card auth-panel">
          <div className="auth-shell">
            <div className="auth-top">
              <div className="eyebrow">Secure project access</div>
              <h3>프로젝트 access key를 입력해 주세요.</h3>
              <p>발급받은 key를 입력하면 해당 프로젝트 포털로 이동합니다.</p>
            </div>

            <div className="form-card">
              <div className="field">
                <label htmlFor="access-key">Access key</label>
                <input
                  id="access-key"
                  type="text"
                  value={key}
                  onChange={e => { setKey(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleEnter()}
                  autoComplete="off"
                />
                {error
                  ? <div className="helper" style={{ color: '#f87171' }}>{error}</div>
                  : <div className="helper">발급받은 key를 그대로 입력해 주세요.</div>
                }
              </div>

              <div className="actions">
                <button
                  className="btn primary"
                  onClick={handleEnter}
                  disabled={!key.trim() || loading}
                  style={{ opacity: (!key.trim() || loading) ? 0.5 : 1, cursor: loading ? 'wait' : 'pointer' }}
                >
                  {loading ? '확인 중...' : '프로젝트 포털로 들어가기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
