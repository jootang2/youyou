'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestAdder({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', desc: '' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!form.title.trim()) return;
    setSaving(true);
    await fetch('/api/admin/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, projectId }),
    });
    setForm({ title: '', desc: '' });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    setSaving(false);
    router.refresh();
  }

  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      <div className="field">
        <label>요청 제목</label>
        <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="메인 배너 문구 수정" />
      </div>
      <div className="field">
        <label>요청 내용</label>
        <input type="text" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="상세 내용 입력" />
      </div>
      <button className="btn primary" onClick={submit} disabled={saving || !form.title.trim()} style={{ opacity: saving ? 0.5 : 1 }}>
        {done ? '추가 완료 ✓' : saving ? '추가 중...' : '요청 추가'}
      </button>
    </div>
  );
}
