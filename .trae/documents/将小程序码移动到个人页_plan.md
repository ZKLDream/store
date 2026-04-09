# 将小程序码移动到个人页计划

## 仓库研究结论

需要将小程序码展示从商品管理页面移动到个人页，放在商品管理入口下面。

## 需要修改的文件

1. `src/pages/profile/index.tsx` - 在个人页添加小程序码展示
2. `src/pages/profile/index.module.scss` - 添加小程序码样式
3. `src/pages/product-management/index.tsx` - 从商品管理页面移除小程序码展示
4. `src/pages/product-management/index.module.scss` - 从小商品管理页面移除小程序码样式

## 修改步骤

### 步骤 1: 在个人页添加小程序码展示
在 `src/pages/profile/index.tsx` 中：
- 导入 `getMiniProgramCode` 函数
- 添加小程序码的 state（miniProgramCode 和 codeLoading）
- 在 useEffect 中调用 getMiniProgramCode 获取小程序码
- 在商品管理入口下方添加小程序码展示区域

### 步骤 2: 在个人页添加小程序码样式
在 `src/pages/profile/index.module.scss` 中：
- 添加小程序码展示区域的样式
- 复用商品管理页面的小程序码样式

### 步骤 3: 从商品管理页面移除小程序码
在 `src/pages/product-management/index.tsx` 中：
- 移除小程序码相关的 state
- 移除 loadMiniProgramCode 函数
- 移除小程序码展示区域

### 步骤 4: 从商品管理页面移除小程序码样式
在 `src/pages/product-management/index.module.scss` 中：
- 移除小程序码相关的样式

## 依赖和注意事项

1. 保持小程序码的功能不变，只是位置移动
2. 确保样式在两个页面都能正常工作
3. 保持调试信息，方便后续排查问题
