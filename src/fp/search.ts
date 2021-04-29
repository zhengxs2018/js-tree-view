export type Predicate<T extends Record<string, unknown>> = (item: T) => boolean

/**
 * 精准搜索
 *
 * @param item  当前项
 * @param keys  指定的搜索的属性范围
 * @param query 搜索的值
 */
export function precisionSearch<T extends Record<string, unknown>>(
  item: T,
  keys: string[],
  query: unknown
): boolean {
  return keys.some((key) => item[key] === query)
}

/**
 * 模糊搜索
 *
 * @param item  当前项
 * @param keys  指定的搜索的属性范围
 * @param query 搜索的值
 */
export function fuzzySearch<T extends Record<string, unknown>>(
  item: T,
  keys: string[],
  query: string
): boolean {
  return keys.some((key) => String(item[key]).indexOf(query as string) > -1)
}

/**
 * 搜索函数
 *
 * @param keys   指定的搜索的属性范围
 * @param query  搜索的值
 * @param exact  匹配模式
 *
 * @returns 搜索函数
 *
 * @example 模糊搜索
 *
 * const list = [
 *   { name: "王牛" },
 *   { name: "赵海" }
 * ]
 *
 * const fuzzySearch = search(['name'])
 *
 * fuzzySearch(list, '王')
 * // => [{ name: "王牛" }]
 *
 * @example 精准搜索
 *
 * const list = [
 *   { name: "王牛" },
 *   { name: "赵海" }
 * ]
 *
 * const precisionSearch = search(['name'], true)
 *
 * precisionSearch(list, '王牛')
 * // => [{ name: "王牛" }]
 *
 * precisionSearch(list, '王')
 * // => []
 */
export function search<T extends Record<string, unknown>>(
  keys: string[],
  query: string,
  exact: boolean = false
): Predicate<T> {
  if (exact) {
    return (item: T) => precisionSearch<T>(item, keys, query)
  }
  return (item: T) => fuzzySearch<T>(item, keys, query)
}
