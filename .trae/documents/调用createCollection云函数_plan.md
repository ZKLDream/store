# 调用 createCollection 云函数计划

## 需求分析
在用户进入个人页时，调用 fruitSaveFunctions 云函数的 createCollection 接口创建数据表，如果表已存在则跳过。

## 现有代码分析
- 云函数名称：fruitSaveFunctions
- 接口：createCollection
- 云函数已处理表已存在的情况（catch 返回 success: true）

## 修改方案

### 1. 在 cloud.ts 中添加 createCollection 函数
- 新增 `createCollection` 函数
- 调用 fruitSaveFunctions 云函数
- 处理返回结果

### 2. 修改个人页，在进入时调用云函数
- 在 `profile/index.tsx` 中添加调用逻辑
- 在 useEffect 中调用 createCollection
- 添加加载状态或静默调用（不阻塞用户）

## 依赖项
无新增依赖，使用现有云开发 SDK

## 风险评估
- 低风险，仅添加云函数调用
- 不影响现有功能
- 云函数已处理表已存在的情况
