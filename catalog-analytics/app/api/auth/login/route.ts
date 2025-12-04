import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth-config';
import { generatePKCE } from '@vector-institute/aieng-auth-core';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Generate PKCE for secure OAuth flow
    const pkce = await generatePKCE();

    // Build Google OAuth authorization URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', authConfig.clientId);
    authUrl.searchParams.set('redirect_uri', authConfig.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('code_challenge', pkce.challenge);
    authUrl.searchParams.set('code_challenge_method', pkce.method);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    const state = crypto.randomUUID();
    authUrl.searchParams.set('state', state);

    // Store PKCE verifier and state in httpOnly cookies
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set('pkce_verifier', pkce.verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 });
  }
}
