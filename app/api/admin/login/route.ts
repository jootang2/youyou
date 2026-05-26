import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { key } = await req.json().catch(() => ({}));
  if (!key || key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'invalid_key' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_auth', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8시간
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_auth');
  return res;
}
