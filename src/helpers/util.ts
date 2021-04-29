import type { Node, PlainObject } from '../common/interfaces'

export function isObject(value: unknown): value is PlainObject {
  return value !== null && typeof value === 'object'
}

export function isNode(value: unknown): value is Node {
  return isObject(value) && '__id__' in value && '__parent__' in value
}

export function isRootObject(obj: any) {
  const proto = Object.getPrototypeOf(obj)
  return proto === null || proto.__proto__ === null
}
