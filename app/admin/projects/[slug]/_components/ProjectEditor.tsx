'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  project: {
    slug: string; previewVersion: string; previewUrl: string; prodUrl: string; status: string;
    devUrl: string; devBranch: string; repoUrl: string; vercelProjectId: string;
  }
}

export default function ProjectEditor({ project }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    previewVersion: project.previewVersion,
    previewUrl: project.previewUrl,
    prodUrl: project.prodUrl,
    devUrl: project.devUrl,
    devBranch: project.devBranch,
    repoUrl: project.repoUrl,
    vercelProjectId: project.vercelProjectId,
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [showExtended, setShowExtended] = useState(false);

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/projects/${project.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    setSaving(false);
    router.refresh();
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="field"><label>Preview 버전</label><input type="text" value={form.previewVersion} onChange={e => set('previewVersion', e.target.value)} /></div>
      <div className="field"><label>Preview URL</label><input type="text" value={form.previewUrl} onChange={e => set('previewUrl', e.target.value)} placeholder="https://..." /></div>
      <div className="field"><label>운영 URL</label><input type="text" value={form.prodUrl} onChange={e => set('prodUrl', e.target.value)} placeholder="https://..." /></div>

      <button
        className="btn"
        type="button"
        onClick={() => setShowExtended(v => !v)}
        style={{ fontSize: 12, padding: '6px 10px', marginTop: 4 }}
      >
        {showExtended ? '▲ 유유 연동 설정 닫기' : '▼ 유유 연동 설정 (GitHub · Vercel)'}
      </button>

      {showExtended && (
        <div style={{ display: 'grid', gap: 10, padding: '12px', borderRadius: 12, border: '1px solid var(--line-soft)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="label" style={{ fontSize: 11, color: 'var(--subtle)' }}>아래 항목은 유유 자동화 연동 시 사용됩니다. 지금은 비워도 됩니다.</div>
          <div className="field"><label>Dev URL (유유 작업 중인 URL)</label><input type="text" value={form.devUrl} onChange={e => set('devUrl', e.target.value)} placeholder="https://project-git-preview-xxx.vercel.app" /></div>
          <div className="field"><label>작업 브랜치</label><input type="text" value={form.devBranch} onChange={e => set('devBranch', e.target.value)} placeholder="preview" /></div>
          <div className="field"><label>GitHub Repo URL</label><input type="text" value={form.repoUrl} onChange={e => set('repoUrl', e.target.value)} placeholder="https://github.com/org/repo" /></div>
          <div className="field"><label>Vercel Project ID</label><input type="text" value={form.vercelProjectId} onChange={e => set('vercelProjectId', e.target.value)} placeholder="prj_xxxxxxxxxxxx" /></div>
        </div>
      )}

      <button className="btn primary" onClick={save} disabled={saving} style={{ opacity: saving ? 0.5 : 1, marginTop: 4 }}>
        {done ? '저장됨 ✓' : saving ? '저장 중...' : '저장'}
      </button>
    </div>
  );
}
