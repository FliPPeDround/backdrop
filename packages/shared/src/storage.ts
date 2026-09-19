/**
 * 最小持久化契约：web 传 localStorage，小程序传 uni.*StorageSync。
 */
export interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export const FAVOURITES_STORAGE_KEY = 'backdrop-favourites'

export function readIdList(storage: StorageLike, key: string): string[] {
  const raw = storage.getItem(key)
  if (!raw)
    return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed))
      return []
    return parsed.filter((item): item is string => typeof item === 'string')
  }
  catch {
    return []
  }
}

export function writeIdList(storage: StorageLike, key: string, ids: readonly string[]): void {
  storage.setItem(key, JSON.stringify([...ids]))
}
