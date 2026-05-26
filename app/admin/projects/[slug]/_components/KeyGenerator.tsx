'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KeyGenerator({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [generatedKey, setGeneratedKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setGeneratedKey('');
    const res = await fetch('/api/admin/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    });
    const data = await res.json();
    setGeneratedKey(data.key);
    setLoading(false);
    router.refresh();
  }

  async function copy() {
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <button className="btn primary" onClick={generate} disabled={loading} style={{ opacity: loading ? 0.5 : 1 }}>
        {loading ? '생성 중...' : '새 Key 발급'}
      </button>
      {generatedKey && (
        <div className="side-card" style={{ padding: 12 }}>
          <div className="label" style={{ marginBottom: 6 }}>발급된 Key — 지금만 확인 가능</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', color: 'var(--success)' }}>
            {generatedKey}
          </div>
          <button className="btn" style={{ marginTop: 8, fontSize: 12 }} onClick={copy}>
            {copied ? '복사됨 ✓' : '복사'}
          </button>
        </div>
      )}
    </div>
  );
}
