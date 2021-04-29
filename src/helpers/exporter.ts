import type { Exporter, Resolve, ID, Node } from '../common/interfaces'
import { ROOT_ID } from '../common/constants'

export function createExporter(rootId: ID | Resolve = ROOT_ID): Exporter {
  if (typeof rootId === 'function') {
    return { rootId: ROOT_ID, resolve: rootId }
  }

  const resolve: Resolve = (data: Record<ID, Node[]>) => {
    return data[rootId as ID] || []
  }

  return { rootId, resolve }
}
