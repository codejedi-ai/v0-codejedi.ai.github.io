// Placeholder file - caching has been completely removed
// All caching functionality has been disabled

export async function readCache<T = unknown>(key: string, ttlMs: number): Promise<T | null> {
  // Caching is completely disabled
  return null;
}

export async function writeCache(key: string, data: unknown): Promise<void> {
  // Caching is completely disabled - do nothing
  return;
}
