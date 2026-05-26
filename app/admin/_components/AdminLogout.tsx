'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin');
  }

  return (
    <button className="btn ghost" onClick={handleLogout}>로그아웃</button>
  );
}
