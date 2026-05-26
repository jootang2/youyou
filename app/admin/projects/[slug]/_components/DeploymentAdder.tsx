'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeploymentAdder({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ env: 'preview', status: 'success', title: '', version: '', trigger: '유유 자동 반영', duration: '', url: '' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  async function submit() {
    if (!form.title.trim()) return;
    setSaving(true);
    await fetch('/api/admin/deployments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, projectId }),
    });
    setForm({ env: 'preview', status: 'success', title: '', version: '', trigger: '유유 자동 반영', duration: '', url: '' });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    setSaving(false);
    router.refresh();
  }

  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="field">
          <label>환경</label>
          <select value={form.env} onChange={e => set('env', e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', font: 'inherit' }}>
            <option value="preview">preview</option>
            <option value="production">production</option>
          </select>
        </div>
        <div className="field">
          <label>상태</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', font: 'inherit' }}>
            <option value="success">성공</option>
            <option value="fail">실패</option>
          </select>
        </div>
      </div>
      <div className="field"><label>배포 제목</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="메인 배너 수정 배포" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="field"><label>버전</label><input type="text" value={form.version} onChange={e => set('version', e.target.value)} placeholder="preview-025" /></div>
        <div className="field"><label>소요 시간</label><input type="text" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="1분 20초" /></div>
      </div>
      <div className="field"><label>트리거</label><input type="text" value={form.trigger} onChange={e => set('trigger', e.target.value)} /></div>
      <div className="field"><label>URL (선택)</label><input type="text" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://... 또는 preview-xxx.internal" /></div>
      <button className="btn primary" onClick={submit} disabled={saving || !form.title.trim()} style={{ opacity: saving ? 0.5 : 1 }}>
        {done ? '등록 완료 ✓' : saving ? '등록 중...' : '배포 기록 등록'}
      </button>
    </div>
  );
}
