/**
 * ID 值类型
 */
export type ID = string | number

/**
 * 行对象
 *
 * @public
 */
export type Row = Record<ID, unknown>

/**
 * 普通对象
 */
export type PlainObject = Record<string | number | symbol, unknown>

export interface Node extends Row {
  __id__: ID
  __parent__: ID
  children: Node[]
}

export interface Resolve {
  (nodes: Record<ID, Node[]>): Node[]
}

export interface Exporter {
  rootId: ID
  resolve: Resolve
}
