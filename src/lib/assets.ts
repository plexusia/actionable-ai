/** Prefix public asset paths for GitHub Pages subpaths (import.meta.env.BASE_URL). */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${normalized}`;
}
