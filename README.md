# @zhengxs/js.tree

[![lang](https://img.shields.io/badge/lang-typescript-informational)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

一个专门处理树数据的 JavaScript 库。

## 树视图

### 添加数据

```js
import { View } from '@zhengxs/js.tree'

const view = new View({
  root: '0', // 根ID
  // 如果关系字段不是默认的，可以手动修改 key 名称
  // idKey: 'id',
  // parentKey: 'parentId',
  searchKeys: ['title'] // 调用 search 时匹配的属性列表
})

// 读取数据
view.read([
  {
    id: '132',
    parentId: '0',
    title: '系统设置'
  },
  {
    id: '132001',
    parentId: '132',
    title: '权限管理'
  },
  ...more
])

// 如果本身就是树结构的数据也支持
// 通过 load 传递给 view
view.load(treeData) // 注意和 read 方法互斥

// 获取数结构的数据
view.data
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置',
//     children: [
//       {
//         id: '132001',
//         parentId: '132',
//         title: '权限管理'
//       }
//     ]
//   },
//   ...more
// ]
```

### 搜索

```js
// 模糊搜索，采用 indexOf 匹配
view.search('系统')
// ->
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置',
//     children: [...]
//   }
// ]

// 精确搜索，使用 ===
view.search('系统', { exact: true })
// ->
// []

// 精确搜索，使用 ===
view.search('系统设置', { exact: true })
// ->
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置',
//     children: [...]
//   }
// ]

// 扁平化结果
view.search('系统设置', { flat: true })
// ->
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置'
//   },
//   ...more
// ]
```

### 过滤

```js
// search 内部调用的也是这个函数
view.filter(function (node) {
  return node.title === '系统设置'
})
// ->
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置',
//     children: [...]
//   }
// ]

// 扁平化结果
view.filter(function (node) {
  return node.title === '系统设置'
}, true)
// ->
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置'
//   },
//   ...more
// ]
```

### 获取上级元素

类 jquery 的行为

```js
// 传递子节点ID
view.parent('132001')
// ->
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置',
//     children: [...]
//   }
// ]
```

### 获取所有的上级直到顶级

类 jquery 的行为

```js
// 传递子节点ID
view.parents('132001')
// ->
// [{ title: '系统设置', }]
```

### 其他

- find - 查找某一个节点，找到第一个就停止
- match - 匹配一个或多个节点，使用 `lodash/matches` 进行匹配

## 多视图管理

多视图模式主要是为了划分作用域，让操作限制在某一个或几个节点内。

```js
import { Manager } from '@zhengxs/js.tree'

const manager = new Manager({
  root: '0' // 共享所有视图的配置
})

// 创建视图，返回的就是视图的类
const defaultView = manager.createView('default')

// 读取数据
defaultView.read(data)

// 创建系统节点树
const sysView = manager.createView('sys', {
  data: defaultView.search('系统')
})

// 这里的数据不再是完整的，而且搜索过滤仅限制在子视图内
sysView.data
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置',
//     children: [
//       {
//         id: '132001',
//         parentId: '132',
//         title: '权限管理'
//       }
//     ]
//   }
// ]
```

## 注意事项

搜索过滤出的数据都是通过 `Object.create` 创建，也就是修改初始数据，那所有的数据都会变化，但修改过滤出的数据，初始数据不会变化。

### 过滤

```js
import { View } from '@zhengxs/js.tree'

// 初始数据
const data = [
  {
    id: '132',
    parentId: '0',
    title: '系统设置'
  },
  ...more
]

const view = new View({ root: '0' })

// 读取数据
view.read(data)

// search 内部调用的也是这个函数
const result = view.filter(function (node) {
  return node.title === '系统设置'
})
// ->
// [
//   {
//     id: '132',
//     parentId: '0',
//     title: '系统设置',
//     children: [...]
//   },
//   ...more
// ]

// 输出原始数据
console.log(data[0].title)
// -> 系统设置

// 修改原始数据
data[0].title = '测试'

// 输出结果已经改变
console.log(result[0].title)
// -> 测试

// 修改查询结果
result[0].title = "demo"

// 输出内容
console.log(result[0].title)
// -> demo

// 输出原始数据
console.log(data[0].title)
// -> 测试
```

## License

- MIT
