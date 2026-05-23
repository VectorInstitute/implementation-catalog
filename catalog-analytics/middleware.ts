import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/analytics/login",
  "/analytics/login/",
  "/analytics/api/auth/",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users to login before any rendering starts.
  // This must happen in middleware (not page.tsx) because reading headers()
  // in the root layout starts the streaming response; any redirect called
  // from a page component after that becomes a client-side RSC redirect
  // with no HTML — rendering a blank page for users without JS hydrated.
  if (!isPublicPath(pathname)) {
    const sessionCookie = request.cookies.get("aieng_catalog_analytics_session");
    if (!sessionCookie) {
      const loginUrl = new URL("/analytics/login/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' lets scripts loaded by the nonce-tagged script run without
    // needing their own nonce — required for Next.js module graph to work.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      // Run on all routes except Next.js internals and static public files.
      source: "/((?!_next/static|_next/image|favicon.ico|data/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
