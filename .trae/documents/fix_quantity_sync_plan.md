# 修复输入斤数同步问题

## 问题分析
用户输入8斤，但清单中增加的还是1斤。问题根源在于：
- `ProductCard`组件正确传递了用户输入的斤数
- 但`AppContext`的`addToList`函数中，quantity固定设置为1，没有使用输入的值

## 当前代码问题
在`AppContext.tsx`中：
1. 当商品已存在时，quantity + 1
2. 当商品不存在时，quantity = 1
3. 没有使用用户实际输入的斤数

## 修复方案

### 1. 修改ProductCard组件
- 将用户输入的斤数作为quantity传递
- 更新`onAddToList`的参数接口

### 2. 修改AppContext
- 修改`addToList`函数，增加quantity参数
- 使用传入的quantity，而不是固定为1
- 如果商品已存在，累加quantity

### 3. 修改HomePage
- 更新调用逻辑，传递quantity参数

## 文件修改清单
1. `src/components/ProductCard/index.tsx` - 更新参数传递
2. `src/store/AppContext.tsx` - 修改addToList函数
3. `src/pages/home/index.tsx` - 更新调用

## 实现步骤
1. 修改AppContext的addToList函数，增加quantity参数
2. 修改ProductCard，传递quantity
3. 修改HomePage，传递quantity
4. 测试功能是否正常
