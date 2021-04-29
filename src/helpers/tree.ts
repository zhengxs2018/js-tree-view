import { forEach } from 'lodash'

import type { Node, Row } from '../common/interfaces'

import { isRootObject } from './util'

/**
 * 获取节点的所有内容
 *
 * @public
 *
 * @param node
 */
export function toRow(node: Node): Row {
  const data: Row = isRootObject(node)
    ? { ...node } // 浅拷贝
    : Object.assign({}, Object.getPrototypeOf(node), node)

  // 去除特征值
  delete data['__id__']
  delete data['__parent__']
  delete data['children']

  return data
}

/**
 * 将树节点对象转成普通对象
 *
 * @public
 *
 * @param node 树节点对象
 * @returns    普通对象
 */
export function toRaw(node: Node): Row {
  const children = node.children || []
  if (children.length === 0) return toRow(node)

  return Object.assign(toRow(node), {
    children: toRawList(children)
  })
}

/**
 *
 * @public
 *
 * @param data
 * @returns
 */
export function toRawList(data: Node[]): Row[] {
  return data.map(toRaw)
}

/**
 * 遍历树结构数据
 *
 * @public
 *
 * @param data
 * @param iteratee
 * @param childKey
 */
export function eachTree(
  data: Node[],
  iteratee: (node: Node, index: number, parents: Node[]) => void | boolean,
  childKey: string = 'children'
) {
  function recursive(nodes: Node[], parents: Node[]) {
    forEach((node: Node, index: number) => {
      const flag = iteratee(node, index, nodes)

      // 如果布尔值那就是跳过或停止循环
      if (flag === false || flag === true) {
        return flag
      }

      const children = (node[childKey] as Node[]) || []
      return recursive(children, parents.concat(node))
    })
  }

  recursive(data, [])
}

/**
 * 将树结构数据转成行数据
 *
 * @public
 *
 * @param data
 */
export function flatTree(data: Node[]): Row[] {
  const nodes: Row[] = []

  eachTree(data, (node) => {
    nodes.push(toRow(node))
  })

  return nodes
}
