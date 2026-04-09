# 云函数获取水果数据 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 创建云函数调用工具
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 `src/utils/cloud.ts` 文件
  - 封装微信云函数调用逻辑
  - 实现 `getFruitsData` 函数调用 `fruitFunctions` 的 `selectRecord` 接口
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-1.1: 可以成功调用 `wx.cloud.callFunction`
  - `programmatic` TR-1.2: 返回数据格式正确
  - `human-judgement` TR-1.3: 代码结构清晰，有错误处理
- **Notes**: 使用 Taro 的云开发 API

## [x] Task 2: 修改 fruits.ts 改为从云函数获取
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 修改 `src/data/fruits.ts`
  - 移除静态的 `fruitsData` 数组
  - 改为导出从云函数获取数据的函数
  - 保留 `specs` 数组不变
- **Acceptance Criteria Addressed**: [AC-1, AC-4]
- **Test Requirements**:
  - `programmatic` TR-2.1: 导出 `fetchFruitsData` 异步函数
  - `programmatic` TR-2.2: `categories` 从获取的数据中动态生成
  - `human-judgement` TR-2.3: 保持类型安全

## [x] Task 3: 修改首页支持异步加载
- **Priority**: P0
- **Depends On**: [Task 2]
- **Description**: 
  - 修改 `src/pages/home/index.tsx`
  - 添加 `useState` 管理加载状态和错误状态
  - 添加 `useEffect` 在组件挂载时调用云函数
  - 显示加载状态 UI
  - 显示错误状态 UI
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-5]
- **Test Requirements**:
  - `programmatic` TR-3.1: 有 `loading` 和 `error` 状态
  - `human-judgement` TR-3.2: 加载时显示加载提示
  - `human-judgement` TR-3.3: 失败时显示错误提示
  - `human-judgement` TR-3.4: 成功时正常显示水果列表

## [x] Task 4: 添加首页加载和错误样式
- **Priority**: P1
- **Depends On**: [Task 3]
- **Description**: 
  - 修改 `src/pages/home/index.module.scss`
  - 添加加载状态样式
  - 添加错误状态样式
  - 保持与现有设计风格一致
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `human-judgement` TR-4.1: 加载样式美观
  - `human-judgement` TR-4.2: 错误样式清晰
  - `human-judgement` TR-4.3: 与整体风格一致

## [x] Task 5: 测试和验证
- **Priority**: P0
- **Depends On**: [Task 3, Task 4]
- **Description**: 
  - 测试云函数调用是否正常
  - 测试加载状态显示
  - 测试错误状态显示
  - 测试分类列表动态生成
  - 测试所有现有功能正常工作
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4, AC-5]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 云函数调用成功
  - `human-judgement` TR-5.2: 所有功能正常工作
  - `human-judgement` TR-5.3: 用户体验流畅
