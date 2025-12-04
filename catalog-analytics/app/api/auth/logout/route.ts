import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';
import { authConfig } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Destroy the session
    await destroySession();

    // Redirect to post-logout URI or base URL
    const redirectUri = authConfig.postLogoutRedirectUri || new URL(request.url).origin;
    return NextResponse.redirect(redirectUri);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
