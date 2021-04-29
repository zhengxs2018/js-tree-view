import { deepStrictEqual } from 'power-assert'

import { View, Row, Node, toRawList } from '../src'

import { loadJSON } from './fixtures/fs'

describe('test view.js', function () {
  it('test view.options.data', function () {
    const view = new View({
      root: '0',
      data: loadJSON('data') as Node[]
    })

    deepStrictEqual(view.data, loadJSON('data'), '数据不一致')
  })

  it('test view#read', function () {
    const view = new View({
      root: '0',
      idKey: 'id',
      parentKey: 'parentId'
    })

    // 转成数结构
    view.read(loadJSON('menu') as Row[])

    deepStrictEqual(view.data, loadJSON('data'), '数据不一致')
  })

  it('test view#load', function () {
    const view = new View({ root: '0' })

    // 转成数结构
    view.load(loadJSON('data') as Node[])

    deepStrictEqual(view.data, loadJSON('data'), '数据不一致')
  })

  it('test view#search', function () {
    const view = new View({
      root: '0',
      data: loadJSON('data') as Node[]
    })

    deepStrictEqual(toRawList(view.search('菜单维护') as Node[]), loadJSON('caiDanWH'), '数据不一致')
  })
})
