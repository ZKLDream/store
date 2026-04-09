# 水果店记账本小程序 - 实现计划

## [ ] 任务 1: 修改应用配置和tabBar
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 修改app.config.ts，将tabBar从"首页、购物车、订单"改为"首页、清单、我的"
  - 更新自定义tabBar组件的图标和文字
  - 确保配置符合记账本模式
- **Acceptance Criteria Addressed**: AC-1, AC-6
- **Test Requirements**:
  - `programmatic` TR-1.1: app.config.ts配置正确，tabBar显示3个标签
  - `human-judgment` TR-1.2: tabBar图标和文字显示正确
- **Notes**: 确保tabBar图标使用合适的emoji，符合记账本主题

## [ ] 任务 2: 修改数据模型和类型定义
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**:
  - 修改types/index.ts，将购物车相关类型改为清单类型
  - 在水果数据中添加成本价字段
  - 定义销售记录相关类型
- **Acceptance Criteria Addressed**: AC-2, AC-4
- **Test Requirements**:
  - `programmatic` TR-2.1: 类型定义正确，包含成本价字段
  - `programmatic` TR-2.2: 水果数据结构包含成本价
- **Notes**: 成本价默认为1元，与用户之前的要求保持一致

## [ ] 任务 3: 修改首页商品展示
- **Priority**: P0
- **Depends On**: 任务 2
- **Description**:
  - 修改ProductCard组件，将"加入购物车"改为"加入清单"
  - 调整商品卡片样式
  - 确保水果信息正确显示
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgment` TR-3.1: 商品卡片显示正确，按钮文字改为"加入清单"
  - `programmatic` TR-3.2: 点击"加入清单"按钮能正确添加到清单
- **Notes**: 保持上下结构的卡片布局，确保视觉效果良好

## [ ] 任务 4: 改造购物车页面为清单页面
- **Priority**: P0
- **Depends On**: 任务 3
- **Description**:
  - 修改cart页面为清单页面
  - 添加销售数量、成本价、售价、利润显示
  - 实现清单管理功能（增减数量、删除）
  - 添加结算功能，计算总销售额和总利润
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 清单页面能正确显示水果销售数据
  - `programmatic` TR-4.2: 能正确计算每个水果的利润
  - `programmatic` TR-4.3: 结算功能能正确计算总销售额和总利润
- **Notes**: 移除原有的地址填写和订单创建功能，改为纯记账功能

## [ ] 任务 5: 创建个人中心页面
- **Priority**: P1
- **Depends On**: 任务 1
- **Description**:
  - 创建"我的"页面
  - 显示记账本基本信息
  - 提供使用说明
  - 显示版本信息
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgment` TR-5.1: 个人中心页面显示正确
  - `human-judgment` TR-5.2: 使用说明内容清晰
- **Notes**: 保持页面风格与整体设计一致

## [ ] 任务 6: 修改全局状态管理
- **Priority**: P0
- **Depends On**: 任务 2, 任务 3, 任务 4
- **Description**:
  - 修改AppContext.tsx，将购物车相关功能改为清单管理
  - 添加销售统计和盈利计算功能
  - 确保数据持久化正常工作
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-6.1: 清单数据能正确存储和读取
  - `programmatic` TR-6.2: 盈利计算逻辑正确
- **Notes**: 保持数据结构清晰，确保性能良好

## [ ] 任务 7: 调整样式和用户体验
- **Priority**: P1
- **Depends On**: 任务 3, 任务 4, 任务 5
- **Description**:
  - 调整整体样式，符合记账本主题
  - 优化用户交互体验
  - 确保响应式布局正常
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
- **Test Requirements**:
  - `human-judgment` TR-7.1: 界面美观，操作流畅
  - `human-judgment` TR-7.2: 响应式布局在不同设备上显示正常
- **Notes**: 保持紫色主题，确保视觉一致性

## [ ] 任务 8: 测试和验证
- **Priority**: P0
- **Depends On**: 任务 6, 任务 7
- **Description**:
  - 测试所有功能是否正常工作
  - 验证盈利计算是否正确
  - 确保小程序符合个人主体审核要求
- **Acceptance Criteria Addressed**: 所有AC
- **Test Requirements**:
  - `programmatic` TR-8.1: 所有功能测试通过
  - `human-judgment` TR-8.2: 界面和功能符合审核要求
- **Notes**: 重点测试盈利计算逻辑，确保数据准确性
