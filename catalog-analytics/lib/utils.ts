/**
 * Get the full path for an asset
 * For Cloud Run deployment, no base path is needed
 */
export function getAssetPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
