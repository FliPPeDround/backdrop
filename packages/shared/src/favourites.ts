import type { Ref } from 'vue'
import type { StorageLike } from './storage'
import { ref, watch } from 'vue'
import { createGlobalState } from './global-state'
import { FAVOURITES_STORAGE_KEY, readIdList, writeIdList } from './storage'

export interface FavouritesStore {
  ids: Ref<string[]>
  isFavourite: (id: string) => boolean
  toggleFavourite: (id: string) => void
}

export function createFavouritesStore(storage: StorageLike): () => FavouritesStore {
  return createGlobalState(() => {
    const ids = ref(readIdList(storage, FAVOURITES_STORAGE_KEY))

    watch(ids, next => writeIdList(storage, FAVOURITES_STORAGE_KEY, next), { deep: true })

    function isFavourite(id: string) {
      return ids.value.includes(id)
    }

    function toggleFavourite(id: string) {
      const next = new Set(ids.value)
      if (next.has(id))
        next.delete(id)
      else
        next.add(id)
      ids.value = [...next]
    }

    return { ids, isFavourite, toggleFavourite }
  })
}
