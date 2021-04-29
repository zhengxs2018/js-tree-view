import { join } from 'path'
import { readFileSync } from 'fs'

export function loadFile(filename: string) {
  return readFileSync(filename, 'utf-8')
}

export function loadJSON(name: string) {
  const filename = join(__dirname, '../data', name)
  return JSON.parse(readFileSync(require.resolve(filename), 'utf8'))
}
