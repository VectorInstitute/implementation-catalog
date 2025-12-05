/**
 * Get the full path for an asset
 * With basePath: '/analytics', assets are served at /analytics/*
 */
export function getAssetPath(path: string): string {
  const basePath = '/analytics';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
