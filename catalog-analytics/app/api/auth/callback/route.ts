import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getUserInfo } from '@vector-institute/aieng-auth-core';
import { authConfig } from '@/lib/auth-config';
import { createSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    // Verify state to prevent CSRF
    const storedState = request.cookies.get('oauth_state')?.value;
    if (!state || state !== storedState) {
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    // Get PKCE verifier from cookie
    const pkceVerifier = request.cookies.get('pkce_verifier')?.value;
    if (!pkceVerifier) {
      return NextResponse.json({ error: 'Missing PKCE verifier' }, { status: 400 });
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(
      code,
      authConfig.clientId,
      authConfig.clientSecret,
      authConfig.redirectUri,
      pkceVerifier
    );

    // Get user information
    const user = await getUserInfo(tokens.accessToken);

    // Check if user's email domain is allowed
    if (authConfig.allowedDomains && authConfig.allowedDomains.length > 0) {
      const emailDomain = user.email.split('@')[1];
      if (!authConfig.allowedDomains.includes(emailDomain)) {
        return NextResponse.json(
          { error: 'Access denied: Email domain not authorized' },
          { status: 403 }
        );
      }
    }

    // Create authenticated session
    await createSession(tokens, user);

    // Clear temporary cookies and redirect to analytics
    const response = NextResponse.redirect(new URL('/analytics', request.url));
    response.cookies.delete('pkce_verifier');
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      {
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
