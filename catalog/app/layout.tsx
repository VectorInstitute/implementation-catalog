import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH === 'true' ? '/implementation-catalog' : '';

export const metadata: Metadata = {
  title: "Vector Institute Implementation Catalog",
  description: "A curated collection of high-quality AI implementations developed by researchers and engineers at the Vector Institute",
  keywords: ["AI", "Machine Learning", "Vector Institute", "Research", "Implementation", "Deep Learning"],
  authors: [{ name: "Vector Institute" }],
  openGraph: {
    title: "Vector Institute Implementation Catalog",
    description: "A curated collection of high-quality AI implementations",
    type: "website",
  },
  icons: {
    icon: `${basePath}/vector-logo.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased">
        {children}
        {/* Pagefind UI - loads after static build */}
        {/* Next.js automatically adds basePath from config, so just use relative path */}
        <Script src="/_pagefind/pagefind-ui.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
