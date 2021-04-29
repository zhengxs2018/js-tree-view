import { deepStrictEqual, ok } from 'power-assert'

import { Manager, Node, toRawList } from '../src'

import { loadJSON } from './fixtures/fs'

describe('test manager.js', function () {
  it('test manager#default', function () {
    const manager = new Manager({
      root: '0',
      data: loadJSON('data') as Node[]
    })

    deepStrictEqual(manager.getView('default')?.data, loadJSON('data'), '数据不一致')
  })

  it('test manager#createView', function () {
    const manager = new Manager({
      root: '0',
      data: loadJSON('data') as Node[]
    })

    // 创建视图
    const caiDanView = manager.createView('caiDanWH')
    ok(manager.hasView('caiDanWH'), '视图未创建')

    // 获取默认视图数据
    const defaultView = manager.getView('default')

    // 读区数据
    caiDanView.load(defaultView?.search('菜单维护') as Node[] || [])

    // 判断数据是否一致
    deepStrictEqual(toRawList(caiDanView.data), loadJSON('caiDanWH'), '数据不一致')
  })
})
