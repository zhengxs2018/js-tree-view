import { isNil, defaultTo } from 'lodash'

import type { ID, Row, Node, Exporter, Resolve } from './common/interfaces'

import { eachTree } from './helpers/tree'
import { createExporter } from './helpers/exporter'

export interface TransformOptions {
  /**
   * 行数据ID的属性名
   */
  idKey?: string

  /**
   * 上级ID的属性名
   */
  parentKey?: string

  /**
   * 顶级ID
   */
  root?: ID | Resolve
}

/**
 * 树转换
 */
export class Transform {
  /**
   * 行数据ID的属性名
   */
  private idKey: string

  /**
   * 上级ID的属性名
   */
  private parentKey: string

  /**
   * 顶级节点的值
   */
  private rootId: ID

  /**
   * 所有节点的对象
   */
  private nodes: Record<ID, Node> = {}

  /**
   * 包含所有层级的所有子节点
   */
  childNodes: Record<ID, Node[]> = {}

  /**
   * 顶级节点导出
   */
  private exporter: Exporter

  constructor(options: TransformOptions = {}) {
    this.idKey = defaultTo(options.idKey, 'id')
    this.parentKey = defaultTo(options.parentKey, 'parentId')
    this.exporter = createExporter(options.root)
    this.rootId = this.exporter.rootId
  }

  /**
   * 反解析数据
   *
   * @param data 树形结构数据
   */
  load(data: Node[]): Transform {
    // 每次转换都清空数据
    const nodes = (this.nodes = {} as Record<ID, Node>)
    const childNodes = (this.childNodes = {} as Record<ID, Node[]>)

    eachTree(data, (node) => {
      nodes[node.__id__] = node
      childNodes[node.__id__] = node.children || []
    })

    return this
  }

  /**
   * 读区并解析数据
   *
   * @param data 数据列表
   */
  read(data: Row[]): Node[] {
    // 每次转换都清空数据
    const nodes = (this.nodes = {} as Record<ID, Node>)
    const childNodes = (this.childNodes = {} as Record<ID, Node[]>)

    data.forEach((row, index) => {
      // 创建 node 对象
      const node: Node = this.createNode(row, index)

      // 获取
      const id = node.__id__
      const parentId = node.__parent__

      // 获取同级元素
      const siblings = childNodes[parentId]
      if (siblings) {
        siblings.push(node)
      } else {
        childNodes[parentId] = [node]
      }

      // 获取自己的子级
      const children = childNodes[id]
      if (children) {
        node.children = children
      } else {
        node.children = childNodes[id] = []
      }

      // 保存自身的引用
      nodes[id] = node
    })

    return this.exporter.resolve(childNodes)
  }

  /**
   * 根据ID获取节点
   *
   * @param id 节点ID
   */
  get(id: ID): Node | undefined {
    return this.nodes[id]
  }

  /**
   * 获取子级
   *
   * @param id 节点ID
   */
  getChildren(id: ID): Node[] {
    return this.childNodes[id] || []
  }

  each(predicate: (node: Node) => false | void) {
    for (const id in this.nodes) {
      const node = this.nodes[id] as Node
      if (predicate(node) === false) {
        break
      }
    }
  }

  /**
   * 创建 node 对象
   *
   * @param source   原始数据
   * @param index    数据在原列表的位置
   */
  private createNode(source: Row, index: number): Node {
    // 节点ID
    const id = source[this.idKey] as string
    if (isNil(id)) {
      throw new TypeError(
        `'id' is required in rows ${index}, except string or number, got ${typeof id}.`
      )
    }

    // 上级ID
    const parentId = defaultTo<string>(source[this.parentKey] as string, this.rootId as string)

    return Object.assign(source, {
      __id__: id,
      __parent__: parentId,
      children: []
    })
  }
}
