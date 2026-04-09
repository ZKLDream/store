# 修复云数据库 \_id 字段支持计划

## 仓库研究结论

当前问题：

1. `Fruit` 和 `SalesRecord` 类型定义中缺少微信云数据库自动生成的 `_id` 字段
2. `updateFruit` 函数当前传入单个 Fruit 对象，但云函数期望接收数组
3. `deleteFruit` 函数当前使用 `id` 字段，但云函数期望使用 `_id` 字段
4. id和_id是同时存在的，id是我自定义的id，\__id是微信云数据库自动生成的字段,需要同时保留

## 需要修改的文件

1. `src/types/index.ts` - 更新类型定义
2. `src/utils/cloud.ts` - 修改 updateFruit 和 deleteFruit 函数
3. `src/pages/product-management/index.tsx` - 更新产品管理页面使用 \_id 字段

## 修改步骤

### 步骤 1: 更新类型定义

在 `src/types/index.ts` 中：

* 给 `Fruit` 接口添加可选的 `_id?: string` 字段

* 给 `SalesRecord` 接口添加可选的 `_id?: string` 字段

### 步骤 2: 修改 updateFruit 函数

在 `src/utils/cloud.ts` 中：

* 修改 `updateFruit` 参数从接收单个 `Fruit` 改为接收 `Fruit[]` 数组

* 更新云函数调用参数格式

### 步骤 3: 修改 deleteFruit 函数

在 `src/utils/cloud.ts` 中：

* 修改 `deleteFruit` 参数从接收 `number` 改为接收 `string` (\_id)

* 更新云函数调用使用 `_id` 字段

### 步骤 4: 更新产品管理页面

在 `src/pages/product-management/index.tsx` 中：

* 更新保存逻辑，传入数组格式

* 更新删除逻辑，使用 \_id 字段

* 确保正确处理 \_id 字段

## 依赖和注意事项

1. 保持向后兼容，\_id 字段设为可选
2. 更新现有代码中使用 id 的地方需要同时兼容 id 和 \_id
3. 确保 product-management 页面需要正确保存和传递 \_id 字段
4. product-management 页面需要更新使用 \_id 进行删除操作

## 风险处理

1. 如果云函数返回的数据格式需要正确解析 \_id 字段
2. 现有代码中使用 id 的地方需要确保不会因为缺少 \_id 而出错
3. product-management 页面需要正确处理 \_id 字段的显示和传递

