"use client";

import { useEffect } from "react";

interface PagefindUIOptions {
  element: HTMLElement;
  showSubResults: boolean;
  showImages: boolean;
  excerptLength: number;
  placeholder: string;
  basePath?: string;
}

declare global {
  interface Window {
    PagefindUI?: new (options: PagefindUIOptions) => void;
  }
}

export default function SearchBar() {
  useEffect(() => {
    // Find the hero-search container and render Pagefind there
    const heroSearchContainer = document.getElementById("hero-search");

    // Detect base path from the current page URL
    // If we're on GitHub Pages, the path will be /implementation-catalog/...
    const currentPath = window.location.pathname;
    const basePath = currentPath.startsWith('/implementation-catalog') ? '/implementation-catalog' : '';

    if (typeof window !== "undefined" && heroSearchContainer) {
      // Load Pagefind CSS dynamically
      const loadPagefindCSS = () => {
        if (!document.querySelector('link[href*="pagefind-ui.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          // Use basePath for CSS since it's loaded dynamically
          link.href = `${basePath}/_pagefind/pagefind-ui.css`;
          document.head.appendChild(link);
        }
      };

      // Wait for Pagefind to load
      const checkPagefind = setInterval(() => {
        if (window.PagefindUI) {
          clearInterval(checkPagefind);
          loadPagefindCSS();
          const config: PagefindUIOptions = {
            element: heroSearchContainer,
            showSubResults: true,
            showImages: false,
            excerptLength: 15,
            placeholder: "Search implementations...",
          };

          // Only add basePath if it's not empty
          if (basePath) {
            config.basePath = basePath;
          }

          new window.PagefindUI(config);
        }
      }, 100);

      // Clear interval after 5 seconds if Pagefind doesn't load
      setTimeout(() => {
        clearInterval(checkPagefind);
        // If Pagefind didn't load, show placeholder
        if (!window.PagefindUI && heroSearchContainer && heroSearchContainer.children.length === 0) {
          heroSearchContainer.innerHTML = `
            <div class="relative">
              <input
                type="text"
                placeholder="Search implementations... (build required)"
                disabled
                class="w-full px-12 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          `;
        }
      }, 5000);

      return () => clearInterval(checkPagefind);
    }
  }, []);

  // This component doesn't render anything visible - it just initializes Pagefind
  return null;
}
