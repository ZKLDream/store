# 商品管理功能 - The Implementation Plan (Decomposed and Prioritized Task List)

## \[ ] Task 1: 在 cloud.ts 中添加商品管理的云函数调用

* **Priority**: P0

* **Depends On**: None

* **Description**:

  * 添加 updateFruit 函数 - 调用 fruitFunctions 的 updateRecord 接口

  * 添加 deleteFruit 函数 - 调用 fruitFunctions 的 deleteRecord 接口

  * 添加 uploadImage 函数 - 上传图片到云存储

* **Acceptance Criteria Addressed**: \[AC-6, AC-7, AC-8, AC-9]

* **Test Requirements**:

  * `programmatic` TR-1.1: 函数参数类型正确

  * `programmatic` TR-1.2: 返回值类型正确

  * `human-judgement` TR-1.3: 错误处理完整

* **Notes**: 参考 insertSalesRecord 和 getSalesRecordsFromCloud 的实现模式

## \[ ] Task 2: 修改 sales-record-list 页面，添加商品管理入口

* **Priority**: P0

* **Depends On**: None

* **Description**:

  * 在销售记录列表下方添加"商品管理"入口行

  * 添加点击事件，跳转到商品管理页面

* **Acceptance Criteria Addressed**: \[AC-1, AC-2]

* **Test Requirements**:

  * `human-judgement` TR-2.1: 入口行在个人页销售记录下方显示

  * `human-judgement` TR-2.2: 点击后正确跳转到商品管理页面

* **Notes**: 入口行样式需要与现有销售记录项保持一致

## \[ ] Task 3: 创建商品管理页面 (product-management)

* **Priority**: P0

* **Depends On**: None

* **Description**:

  * 创建页面目录和文件（index.tsx, index.config.ts, index.module.scss）

  * 实现商品列表展示

  * 添加点击商品行触发编辑弹窗的逻辑

* **Acceptance Criteria Addressed**: \[AC-3, AC-4]

* **Test Requirements**:

  * `human-judgement` TR-3.1: 页面能正确加载和显示商品列表

  * `human-judgement` TR-3.2: 点击商品行能弹出编辑弹窗

  * `programmatic` TR-3.3: 在 app.config.ts 中注册新页面

* **Notes**: 参考 sales-record-list 页面的实现风格

## \[ ] Task 4: 创建商品编辑弹窗组件

* **Priority**: P0

* **Depends On**: \[Task 1, Task 3]

* **Description**:

  * 实现弹窗组件，显示商品详细信息

  * ID字段显示但不可编辑

  * category、name、desc、price、costPrice 提供输入框

  * 实现图片上传功能

  * 实现保存和取消按钮

  * 实现删除功能（带确认提示）

* **Acceptance Criteria Addressed**: \[AC-5, AC-6, AC-7, AC-8, AC-9]

* **Test Requirements**:

  * `human-judgement` TR-4.1: ID字段不可编辑

  * `human-judgement` TR-4.2: 其他字段有输入框可以编辑

  * `human-judgement` TR-4.3: 图片可以上传和预览

  * `human-judgement` TR-4.4: 保存按钮能正确更新数据

  * `human-judgement` TR-4.5: 删除按钮有确认提示并能删除商品

* **Notes**: 使用 Taro 的 Modal 组件或自定义弹窗

## \[ ] Task 5: 集成和测试

* **Priority**: P1

* **Depends On**: \[Task 2, Task 4]

* **Description**:

  * 完整测试商品管理功能流程

  * 检查样式一致性

  * 验证错误处理

* **Acceptance Criteria Addressed**: \[AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9]

* **Test Requirements**:

  * `human-judgement` TR-5.1: 完整流程测试通过

  * `human-judgement` TR-5.2: 样式与现有页面一致

  * `human-judgement` TR-5.3: 错误情况有友好提示

* **Notes**: 在微信开发者工具中进行完整测试

