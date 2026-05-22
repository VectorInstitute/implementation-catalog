import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Vector Catalog Analytics",
  description: "Repository Analytics for Vector Institute Implementation Catalog",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading headers() opts the entire app out of Next.js prerender cache so
  // that the nonce from middleware is applied fresh to every inline script.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <body className="antialiased" nonce={nonce}>
        {children}
      </body>
    </html>
  );
}
