import type { StorageLike } from '@backdrop/shared'

/**
 * uni.getStorageSync 对缺失的 key 返回 ''，需还原成 StorageLike 约定的 null。
 */
export const uniStorage: StorageLike = {
  getItem: (key) => {
    const value = uni.getStorageSync(key)
    return typeof value === 'string' && value !== '' ? value : null
  },
  setItem: (key, value) => uni.setStorageSync(key, value),
}
