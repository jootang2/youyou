'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Request { id: string; title: string; status: string; statusLabel: string; hasAction: boolean }

const STATUS_OPTIONS = [
  { value: '', label: 'in progress' },
  { value: 'waiting', label: 'awaiting buyer reply' },
  { value: 'success', label: 'preview ready' },
  { value: 'done', label: 'done' },
];

export default function RequestManager({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setSaving(id);
    const label = STATUS_OPTIONS.find(o => o.value === status)?.label ?? status;
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, statusLabel: label }),
    });
    router.refresh();
    setSaving(null);
  }

  async function toggleAction(id: string, current: boolean) {
    setSaving(id);
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hasAction: !current }),
    });
    router.refresh();
    setSaving(null);
  }

  return (
    <div className="request-list" style={{ marginTop: 16 }}>
      {requests.map(req => (
        <article key={req.id} className="request-item">
          <div className="request-head">
            <div className="request-title">{req.title}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {req.hasAction && <span className="pill waiting">승인 요청 중</span>}
              <span className={`pill ${req.status}`}>{req.statusLabel}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`btn${req.status === opt.value ? ' primary' : ''}`}
                style={{ fontSize: 12, padding: '6px 10px', opacity: saving === req.id ? 0.5 : 1 }}
                disabled={saving === req.id || req.status === opt.value}
                onClick={() => updateStatus(req.id, opt.value)}
              >
                {opt.label}
              </button>
            ))}
            <button
              className={`btn${req.hasAction ? ' primary' : ''}`}
              style={{ fontSize: 12, padding: '6px 10px', opacity: saving === req.id ? 0.5 : 1, marginLeft: 'auto' }}
              disabled={saving === req.id}
              onClick={() => toggleAction(req.id, req.hasAction)}
            >
              {req.hasAction ? '승인 요청 OFF' : '승인 요청 ON'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
