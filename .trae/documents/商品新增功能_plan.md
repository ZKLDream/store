# 商品新增功能计划

## 仓库研究结论

需要在商品管理页面添加新增商品功能，使用 fruitFunctions 云函数的 insertRecord 能力。

## 需要修改的文件

1. `src/utils/cloud.ts` - 添加 insertFruit 函数
2. `src/pages/product-management/index.tsx` - 添加新增按钮和新增功能逻辑
3. `src/pages/product-management/index.module.scss` - 添加新增按钮样式（如果需要）

## 修改步骤

### 步骤 1: 在 cloud.ts 中添加 insertFruit 函数
在 `src/utils/cloud.ts` 中：
- 添加 `insertFruit` 函数
- 调用 fruitFunctions 云函数的 insertRecord 接口
- 传入商品数据（category, name, desc, price, costPrice, image）
- 返回新增结果

### 步骤 2: 在商品管理页面添加新增按钮
在 `src/pages/product-management/index.tsx` 中：
- 在商品列表标题旁边添加"新增商品"按钮
- 添加 `isAdding` state 来区分是编辑还是新增
- 修改弹窗标题，根据 `isAdding` 显示"新增商品"或"编辑商品"
- 在新增模式下，ID 字段显示为"自动生成"

### 步骤 3: 添加新增商品功能逻辑
在 `src/pages/product-management/index.tsx` 中：
- 添加 `handleAddProduct` 函数，打开新增模式弹窗
- 修改 `handleSave` 函数，根据 `isAdding` 调用 insertFruit 或 updateFruit
- 新增成功后，将新商品添加到 products 列表
- 新增成功后，关闭弹窗并显示成功提示

### 步骤 4: 调整弹窗按钮
在新增模式下：
- 隐藏"删除"按钮
- 显示"取消"和"新增"按钮

## 依赖和注意事项

1. 云函数 insertRecord 会自动生成 id，新增时不需要传入 id
2. 新增商品时，需要确保所有必填字段都填写了
3. 可以添加表单验证
4. 新增成功后刷新列表

## 风险处理

1. 如果新增失败，显示友好的错误提示
2. 新增时不显示删除按钮，避免误操作
