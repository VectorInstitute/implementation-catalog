/**
 * Get the base path for the application
 * Returns '/implementation-catalog' in production (GitHub Pages)
 * Returns '' in development
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH === 'true' ? '/implementation-catalog' : '';
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
