/**
 * 不依赖 @vueuse/shared：mp 是 @vueuse 9.13、web 是 15，跨端包引运行时依赖会版本歪斜。
 */
export function createGlobalState<S extends object>(stateFn: () => S): () => S {
  let state: S | undefined

  return () => (state ??= stateFn())
}
