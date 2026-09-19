import { createFavouritesStore } from '@backdrop/shared'
import { uniStorage } from '@/utils/storage'

export const useFavourites = createFavouritesStore(uniStorage)
