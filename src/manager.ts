import type { Node } from './common/interfaces'
import { View, ViewOptions } from './view'

export class Manager {
  // 配置项
  options: Omit<ViewOptions, 'data'>

  // 视图列表
  views: Record<string, View> = {}

  constructor(options: ViewOptions = {}) {
    this.options = options

    // 如果存在初始数据就创建默认视图
    const data: Node[] = options.data || []
    if (data && data.length > 0) {
      delete options.data
      this.createView('default', { data })
    }
  }
  /**
   * 创建新视图
   *
   * @param name  视图名称
   * @param data  视图数据
   * @returns
   */
  createView(name: string, extra?: ViewOptions): View {
    const view = new View({ ...this.options, ...extra })
    this.views[name] = view
    return view
  }

  /**
   * 获取视图
   *
   * @param name  视图名称
   * @returns
   */
  getView(name: string): View | undefined {
    return this.hasView(name) ? this.views[name] : undefined
  }

  /**
   * 获取视图
   *
   * @param name  视图名称
   * @returns
   */
  hasView(name: string): boolean {
    return this.views.hasOwnProperty(name)
  }
}
