import type { Node } from '../common/interfaces'

export function filter(predicate: any) {
  function run(data: Node[]) {
    const result: Node[] = []

    data.forEach((node) => {
      const children = run(node.children || [])
      if (children.length > 0) {
        result.push(
          Object.create(node, {
            children: { value: children }
          })
        )
      } else if (predicate(node)) {
        result.push(
          Object.create(node, {
            children: { value: [] }
          })
        )
      }
    })

    return result
  }

  return run
}
