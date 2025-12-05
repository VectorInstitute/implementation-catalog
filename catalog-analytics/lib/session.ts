import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { AuthTokens, User } from '@vector-institute/aieng-auth-core';

export interface SessionData {
  tokens: AuthTokens | null;
  user: User | null;
  isAuthenticated: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'aieng_catalog_analytics_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/analytics',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function createSession(tokens: AuthTokens, user: User): Promise<void> {
  const session = await getSession();
  session.tokens = tokens;
  session.user = user;
  session.isAuthenticated = true;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}
