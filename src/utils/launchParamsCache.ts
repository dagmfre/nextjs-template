// Cache the initial hash before SPA routing modifies it.
let cachedHash: string | null = null;

export function getInitialHash(): string {
  if (cachedHash === null && typeof window !== 'undefined') {
    cachedHash = window.location.hash.slice(1);
  }

  return cachedHash || '';
}

export function resetHashCache(): void {
  cachedHash = null;
}
