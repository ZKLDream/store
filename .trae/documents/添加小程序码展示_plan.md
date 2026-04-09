# 在商品管理页面添加小程序码展示计划

## 仓库研究结论

需要在商品管理页面底部添加小程序码展示，使用 quickstartFunctions 云函数的 getMiniProgramCode 能力。

## 需要修改的文件

1. `src/utils/cloud.ts` - 添加 getMiniProgramCode 函数
2. `src/pages/product-management/index.tsx` - 添加小程序码展示区域和逻辑
3. `src/pages/product-management/index.module.scss` - 添加小程序码样式

## 修改步骤

### 步骤 1: 在 cloud.ts 中添加 getMiniProgramCode 函数

在 `src/utils/cloud.ts` 中：

* 添加 `getMiniProgramCode` 函数

* 调用 quickstartFunctions 云函数

* 返回小程序码的 fileID

### 步骤 2: 在商品管理页面添加小程序码展示

在 `src/pages/product-management/index.tsx` 中：

* 添加小程序码的 state（miniProgramCode 和 codeLoading）

* 在页面加载时调用 getMiniProgramCode 获取小程序码

* 在商品列表下方添加小程序码展示区域

* 添加加载状态

### 步骤 3: 添加小程序码样式

在 `src/pages/product-management/index.module.scss` 中：

* 添加小程序码展示区域的样式

* 添加加载状态样式

## 依赖和注意事项

1. 确保 quickstartFunctions 云函数已提供 getMiniProgramCode 能力
2. 小程序码可能需要一段时间生成，需要显示加载状态
3. 小程序码应该居中显示，大小适中
4. 可以添加长按保存功能

## 风险处理

1. 如果 getMiniProgramCode 调用失败，显示友好的错误提示
2. 确保小程序码图片能正确加载和显示

