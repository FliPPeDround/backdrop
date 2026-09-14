export const useFavourites = createGlobalState(() => {
  const ids = useStorage<string[]>('backdrop-favourites', [])

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
