import { matches } from 'lodash'

import type { ID, Row, Node } from './common/interfaces'

import { Finder, FinderOptions } from './finder'
import { Transform, TransformOptions } from './transform'

import { isNode } from './helpers/util'

export interface ViewOptions extends TransformOptions, FinderOptions {
  // pass
}

export class View extends Finder {
  /**
   * 转换器
   */
  transform: Transform

  constructor(options: ViewOptions = {}) {
    super(options)

    this.transform = new Transform(options)
    this.transform.load(this.data)
  }

  /**
   * 直接加载数结构数据，和 read 方法互斥
   *
   * @param data 树结构数据
   */
  load(data: Node[]): View {
    this.data = data
    this.transform.load(data)
    return this
  }

  /**
   * 读取并转化数据，和 load 方法互斥
   *
   * @param data 数据列表
   *
   * @returns 树结构数据
   */
  read(data: Row[]): Node[] {
    return (this.data = this.transform.read(data))
  }

  /**
   * 取得一个匹配元素的祖先节点的集合
   *
   * @param id        目标节点ID
   */
  parents(id: ID | Node): Node[] {
    const parents: Node[] = []
    const transform = this.transform

    let parent: Node | undefined = this.parent(id)
    while (parent) {
      parents.unshift(parent)
      parent = transform.get(parent.__parent__)
    }

    return parents
  }

  /**
   * 取得一个匹配元素的上级节点
   *
   * @param id        目标节点ID
   */
  parent(id: ID | Node): Node | undefined {
    const transform = this.transform
    const node = isNode(id) ? id : transform.get(id)
    if (node) {
      return transform.get(node.__parent__)
    }
  }

  /**
   * 匹配某一个数据
   *
   * @param source
   * @returns
   */
  match(source: unknown) {
    return this.find(matches(source))
  }

  /**
   * 查找某一个节点
   *
   * @param predicate
   */
  find(predicate: (node: Node) => boolean): Node | null {
    let result: Node | null = null

    this.transform.each((node) => {
      if (predicate(node)) {
        result = node
        return false
      }
    })

    return result
  }
}
