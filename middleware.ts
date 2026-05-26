import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin 보호
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const adminAuth = req.cookies.get('admin_auth')?.value;
    if (adminAuth !== 'ok') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Portal 보호
  if (pathname.startsWith('/portal/')) {
    const adminAuth = req.cookies.get('admin_auth')?.value;
    if (adminAuth === 'ok') return NextResponse.next(); // admin은 모든 포털 접근 허용

    const slugFromPath = pathname.split('/')[2];
    const portalAuth = req.cookies.get('portal_auth')?.value;
    if (!portalAuth || portalAuth !== slugFromPath) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
