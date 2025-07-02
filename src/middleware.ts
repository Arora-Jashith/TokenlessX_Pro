import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and the current path is not /login or /signup
  // redirect the user to /login
  if (!session && !['/login', '/signup', '/auth/callback', '/auth/reset-password'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is signed in but email is not confirmed
  if (session && !session.user.email_confirmed_at && !['/auth/verify', '/auth/callback'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/verify', req.url));
  }

  // If user is signed in and the current path is /login or /signup
  // redirect the user to /dashboard
  if (session && ['/login', '/signup'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 