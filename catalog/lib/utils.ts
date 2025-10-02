/**
 * Get the base path for the application
 * Returns '/implementation-catalog' in production (GitHub Pages)
 * Returns '' in development
 *
 * Note: This checks for the environment variable at build time.
 * Next.js replaces process.env.NEXT_PUBLIC_* at build time.
 */
export function getBasePath(): string {
  // Check if we're in production mode (GitHub Pages)
  // The NEXT_PUBLIC_BASE_PATH env var is set during build
  const isProduction = process.env.NEXT_PUBLIC_BASE_PATH === 'true';
  return isProduction ? '/implementation-catalog' : '';
}

/**
 * Get the full path for an asset, accounting for base path
 * @param path - The path to the asset (e.g., '/vector-logo.svg')
 * @returns The full path with base path prepended if in production
 */
export function getAssetPath(path: string): string {
  const basePath = getBasePath();
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
}
