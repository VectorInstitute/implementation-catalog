import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vector Catalog Analytics",
  description: "Repository Analytics for Vector Institute Implementation Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
