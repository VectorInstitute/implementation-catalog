"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, Home } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();

  const basePath =
    process.env.NEXT_PUBLIC_BASE_PATH === "true"
      ? "/implementation-catalog"
      : "";

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path || pathname === basePath;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={`${basePath}/`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src={getAssetPath("vector-logo.svg")}
              alt="Vector Institute"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
            <span className="hidden sm:inline text-lg font-semibold text-gray-900 dark:text-white">
              Implementation Catalog
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              href={`${basePath}/`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/")
                  ? "bg-vector-teal text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href={`${basePath}/analytics`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/analytics")
                  ? "bg-vector-teal text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
