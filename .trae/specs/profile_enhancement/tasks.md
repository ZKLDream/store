# 个人中心页面功能增强 - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 在AppContext中添加头像和名字状态
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在AppContext中添加userAvatar和userName状态
  - 在storage工具中添加getUserProfile和setUserProfile方法
  - 默认头像用水果emoji，默认名字用"水果店老板"
  - 数据保存到本地存储
- **Acceptance Criteria Addressed**: [AC-1, AC-5]
- **Test Requirements**:
  - `human-judgement` TR-1.1: AppContext中有userAvatar和userName状态
  - `human-judgement` TR-1.2: storage中有getUserProfile和setUserProfile方法
  - `human-judgement` TR-1.3: 数据可以保存和读取
- **Notes**: 在初始化时从存储读取数据

## [ ] Task 2: 修改app.config.ts添加新页面路由
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在pages数组中添加sales-record-detail页面
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `human-judgement` TR-2.1: app.config.ts中有新页面路由
- **Notes**: 确保页面路径正确

## [ ] Task 3: 创建销售记录详情页
- **Priority**: P0
- **Depends On**: [Task 2]
- **Description**: 
  - 创建src/pages/sales-record-detail/index.tsx
  - 创建src/pages/sales-record-detail/index.config.ts
  - 创建src/pages/sales-record-detail/index.module.scss
  - 显示：日期、商品明细列表、总销售额、总利润
  - 使用Taro.getCurrentInstance().router.params获取记录ID
  - 从AppContext中查找对应的销售记录
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `human-judgement` TR-3.1: 页面文件已创建
  - `human-judgement` TR-3.2: 可以显示销售记录详情
  - `human-judgement` TR-3.3: 显示所有商品明细
  - `human-judgement` TR-3.4: 显示日期、总销售额、总利润
- **Notes**: 复用CartItem组件来显示商品明细

## [ ] Task 4: 重写个人中心页面
- **Priority**: P0
- **Depends On**: [Task 1, Task 3]
- **Description**: 
  - 添加个人信息区域：头像和名字
  - 添加销售记录列表
  - 销售记录显示：日期、总销售额、总利润
  - 点击销售记录使用Taro.navigateTo跳转到详情页
  - 销售记录按时间倒序排列
  - 移除原有的记账本信息、使用说明、功能特点等内容
  - 保留版本信息
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3]
- **Test Requirements**:
  - `human-judgement` TR-4.1: 显示头像和名字
  - `human-judgement` TR-4.2: 显示销售记录列表
  - `human-judgement` TR-4.3: 销售记录显示日期、总销售额、总利润
  - `human-judgement` TR-4.4: 点击销售记录可以跳转到详情页
  - `human-judgement` TR-4.5: 销售记录按时间倒序排列
- **Notes**: 使用卡片式设计，美观易用

## [ ] Task 5: 添加相关样式
- **Priority**: P1
- **Depends On**: [Task 4]
- **Description**: 
  - 更新个人中心页面样式
  - 添加销售记录详情页样式
  - 确保与整体风格一致（紫色主题、卡片式设计）
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-4]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 页面样式美观
  - `human-judgement` TR-5.2: 与整体风格一致
- **Notes**: 复用已有的样式变量和组件

## [ ] Task 6: 测试功能是否正常
- **Priority**: P0
- **Depends On**: [Task 1, Task 2, Task 3, Task 4, Task 5]
- **Description**: 
  - 测试个人信息显示
  - 测试销售记录列表显示
  - 测试销售记录点击跳转
  - 测试销售记录详情显示
  - 测试数据持久化
  - 构建项目确保没有错误
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-6.1: 项目构建成功
  - `human-judgement` TR-6.2: 所有功能正常工作
  - `human-judgement` TR-6.3: 数据持久化正常
- **Notes**: 全面测试所有功能
