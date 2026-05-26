'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MessageAdder({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setSaving(true);
    await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, text }),
    });
    setText('');
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    setSaving(false);
    router.refresh();
  }

  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      <div className="field">
        <label>유유 메시지</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="바이어에게 전달할 내용을 입력하세요..."
          style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', font: 'inherit', resize: 'vertical', minHeight: 80 }}
        />
      </div>
      <button className="btn primary" onClick={submit} disabled={saving || !text.trim()} style={{ opacity: saving ? 0.5 : 1 }}>
        {done ? '전송 완료 ✓' : saving ? '전송 중...' : '메시지 전송 (유유)'}
      </button>
    </div>
  );
}
