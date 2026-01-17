import fs from "fs/promises"
import path from "path"
import os from "os"

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {
    // ignore
  }
}

async function getCacheDir(): Promise<string> {
  const primary = path.join(process.cwd(), ".cache")
  try {
    await ensureDir(primary)
    return primary
  } catch {
    // fall back to OS tmp if repo is read-only at runtime
  }
  const fallback = path.join(os.tmpdir(), "portfolio-cache")
  await ensureDir(fallback)
  return fallback
}

export async function readCache<T = unknown>(key: string, ttlMs: number): Promise<T | null> {
  try {
    const dir = await getCacheDir()
    const file = path.join(dir, `${key}.json`)
    const stat = await fs.stat(file)
    const ageMs = Date.now() - stat.mtimeMs
    if (ageMs > ttlMs) return null
    const raw = await fs.readFile(file, "utf8")
    const payload = JSON.parse(raw)
    return (payload?.data ?? null) as T | null
  } catch {
    return null
  }
}

export async function writeCache(key: string, data: unknown): Promise<void> {
  try {
    const dir = await getCacheDir()
    const file = path.join(dir, `${key}.json`)
    const payload = JSON.stringify({ savedAt: new Date().toISOString(), data })
    await fs.writeFile(file, payload, "utf8")
  } catch {
    // ignore write failures (e.g., read-only FS)
  }
}
