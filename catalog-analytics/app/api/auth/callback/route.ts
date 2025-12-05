import { NextRequest, NextResponse } from 'next/server';
import { GoogleOAuthClient } from '@vector-institute/aieng-auth-core';
import { authConfig } from '@/lib/auth-config';
import { createSession } from '@/lib/session';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function getBaseUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request);

  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid_callback`);
    }

    // Verify state
    const cookieStore = await cookies();
    const storedState = cookieStore.get('oauth_state')?.value;
    if (state !== storedState) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid_state`);
    }

    // Get PKCE verifier
    const verifier = cookieStore.get('pkce_verifier')?.value;
    if (!verifier) {
      return NextResponse.redirect(`${baseUrl}/login?error=missing_verifier`);
    }

    // Exchange code for tokens
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: authConfig.redirectUri,
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      code_verifier: verifier,
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`);
    }

    const data = await response.json();
    const tokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type || 'Bearer',
      expiresIn: data.expires_in,
      scope: data.scope,
    };

    // Get user info
    const client = new GoogleOAuthClient(authConfig);
    const user = await client.getUserInfo(tokens.accessToken);

    // Validate domain if configured
    if (authConfig.allowedDomains && authConfig.allowedDomains.length > 0) {
      const domain = user.email?.split('@')[1];
      if (!domain || !authConfig.allowedDomains.includes(domain)) {
        return NextResponse.redirect(`${baseUrl}/login?error=unauthorized_domain`);
      }
    }

    // Create session
    await createSession(tokens, user);

    // Clean up temporary cookies and redirect to analytics
    const redirectResponse = NextResponse.redirect(`${baseUrl}/analytics`);
    redirectResponse.cookies.delete('pkce_verifier');
    redirectResponse.cookies.delete('oauth_state');

    return redirectResponse;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=authentication_failed`);
  }
}
