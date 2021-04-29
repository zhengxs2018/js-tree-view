
import { View } from './src'

// 初始数据
const data = [
  {
    id: '132',
    parentId: '0',
    title: '系统设置'
  }
]

const view = new View({ root: '0' })

// 读取数据
view.read(data)

// search 内部调用的也是这个函数
const result = view.filter(function (node) {
  return node['title'] === '系统设置'
})

// @ts-ignore
// 输出原始数据
console.log(data[0].title)

// 修改原始数据
// @ts-ignore
data[0].title = '测试'

// 输出结果已经改变
// @ts-ignore
console.log(result[0].title)

// 修改输出结果
// @ts-ignore
result[0].title = "demo"

// 输出内容
// @ts-ignore
console.log(result[0].title)

// 输出原始数据
// @ts-ignore
console.log(data[0].title)
