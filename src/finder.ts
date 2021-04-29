import { search, Predicate } from './fp/search'
import { filter } from './fp/filter'

import { flatTree } from './helpers/tree'

import type { Node, Row } from './common/interfaces'

export interface FinderOptions {
  /**
   * 数据列表
   */
  data?: Node[]

  /**
   * 搜索的字段范围
   */
  searchKeys?: string[]
}

export interface SearchOptions {
  /**
   * 搜索的范围
   */
  keys: string[]
  /**
   * 精确查询
   */
  exact?: boolean
  /**
   * 扁平化输出
   */
  flat?: boolean
}

export type Result<T> = T extends true ? Node[] : Row[]

export class Finder {
  /**
   * 搜索的字段范围，默认：['title']
   */
  searchKeys: string[]

  /**
   * 树数据
   */
  data: Node[]

  constructor(options: FinderOptions) {
    this.data = options.data || []
    this.searchKeys = options.searchKeys || ['title']
  }

  /**
   * 搜索内容
   *
   * @param query   查询的内容
   * @param options
   * @param options.flat  扁平化输出
   * @param options.keys  搜索的范围
   * @param options.exact  精确查询
   *
   * @returns 搜索结果
   */
  search(query: string, options: Partial<SearchOptions> = {}): Result<typeof options['flat']> {
    const keys = options.keys || this.searchKeys
    const predicate = search(keys, query, options.exact)
    return this.filter(predicate, options.flat)
  }

  /**
   * 过虑内容
   *
   * @param query   查询的内容
   * @param flat  扁平化输出
   *
   * @returns 过滤结果
   */
  filter(predicate: Predicate<Node>, flat: boolean = false): Result<typeof flat> {
    const result = filter(predicate)(this.data)
    return flat ? flatTree(result) : result
  }
}
