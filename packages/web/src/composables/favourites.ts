import type { StorageLike } from '@backdrop/shared'
import { createFavouritesStore } from '@backdrop/shared'

const localStorageAdapter: StorageLike = {
  getItem: key => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
}

export const useFavourites = createFavouritesStore(localStorageAdapter)
