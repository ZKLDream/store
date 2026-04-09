# 将销售记录存到云端计划

## 需求分析

将 storage.ts 中的 setSalesRecords 函数存储的数据替换为调用 fruitSaveFunctions 云函数的 insertRecord 接口存到云端，同时 getSalesRecords 也改为从云端读取。

## 现有代码分析

* 云函数名称：fruitSaveFunctions

* 接口：insertRecord 和 selectRecord

* SalesRecord 结构：id, items, totalSales, totalProfit, date

* 云函数 insertRecord 需要的字段：id, items, totalSales, totalProfit, date

## 修改方案

### 1. 在 cloud.ts 中添加云函数调用

* 新增 `insertSalesRecord` 函数 - 调用 insertRecord

* 新增 `getSalesRecordsFromCloud` 函数 - 调用 selectRecord

### 2. 修改 storage.ts

* 修改 `setSalesRecords` - 改为调用云函数 insertRecord

* 修改 `getSalesRecords` - 改为调用云函数 selectRecord

* 保留本地存储作为备份或缓存

### 3. 修改 AppContext.tsx

* 处理异步加载 salesRecords

* 添加加载状态

* 添加错误处理

## 数据格式注意事项

* 云函数 date 格式：YYYY-MM-DD（ISO格式）

* 当前代码 date 格式：toLocaleString('zh-CN')

* 需要统一日期格式

## 依赖项

无新增依赖，使用现有云开发 SDK

## 风险评估

* 中风险，需要处理异步加载

* 需要处理云函数调用失败的情况

* 建议保留本地存储作为降级方案

