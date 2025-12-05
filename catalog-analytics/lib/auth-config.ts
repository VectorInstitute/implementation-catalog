import type { AuthConfig } from '@vector-institute/aieng-auth-core';

// Allow builds in CI/build environments with placeholder values
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
const isCI = process.env.CI === 'true';

const clientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || (isBuild || isCI ? 'build-placeholder' : '');
const clientSecret =
  process.env.GOOGLE_CLIENT_SECRET || (isBuild || isCI ? 'build-placeholder' : '');
const sessionSecret =
  process.env.SESSION_SECRET || (isBuild || isCI ? 'build-placeholder-32-chars-minimum!!' : '');

// Only throw errors in actual runtime (not during build)
if (!isBuild && !isCI) {
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is required');
  }
  if (!clientSecret) {
    throw new Error('GOOGLE_CLIENT_SECRET is required');
  }
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET is required');
  }
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
const basePath = '/analytics';

export const authConfig: AuthConfig = {
  clientId,
  clientSecret,
  redirectUri: process.env.REDIRECT_URI || `${appUrl}${basePath}/api/auth/callback`,
  postLogoutRedirectUri: `${appUrl}${basePath}`,
  allowedDomains: process.env.ALLOWED_DOMAINS?.split(','),
};
