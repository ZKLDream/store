# AI 聊天功能最终集成方案 - 实现计划

## [x] Task 1: 将 agent-ui 组件移到 src/components/agent-ui/
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 将 agent-ui 从项目根目录移动到 `src/components/agent-ui/`
  - 确保所有子组件和资源文件都正确移动
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-1.1: agent-ui 组件在 `src/components/agent-ui/` 目录下
  - `programmatic` TR-1.2: 所有子组件和资源文件都存在

## [x] Task 2: 创建 Taro 自定义原生组件包装器
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 在 `src/components/agent-ui/` 目录下创建 `customWrapper.js`
  - 在 `src/components/agent-ui/` 目录下创建 `props.js`
  - 配置组件的所有必要属性
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `programmatic` TR-2.1: customWrapper.js 存在
  - `programmatic` TR-2.2: props.js 存在且包含所有必要属性

## [x] Task 3: 创建 AI 聊天页面
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 在 `src/pages/ai-chat/` 目录下创建页面文件
  - index.tsx - 使用 &lt;agent-ui&gt; 标签
  - index.config.ts - 配置页面和 usingComponents
  - index.module.scss - 页面样式
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `programmatic` TR-3.1: AI 聊天页面文件存在
  - `programmatic` TR-3.2: 页面中正确使用 agent-ui 组件

## [x] Task 4: 在 app.config.ts 中添加路由
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 在 `src/app.config.ts` 的 pages 数组中添加 `pages/ai-chat/index`
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `programmatic` TR-4.1: app.config.ts 中包含 AI 聊天页面路由

## [x] Task 5: 在个人页面添加 AI 入口
- **Priority**: P0
- **Depends On**: Task 4
- **Description**: 
  - 在个人页面商品管理下方新增 AI 入口卡片
  - 使用与现有入口卡片一致的样式
  - 添加点击跳转到 AI 聊天页面的功能
- **Acceptance Criteria Addressed**: [AC-3, AC-4]
- **Test Requirements**:
  - `human-judgement` TR-5.1: AI 入口卡片在商品管理下方正确显示
  - `human-judgement` TR-5.2: 点击 AI 入口能正确跳转到 AI 聊天页面

## [x] Task 6: 验证无 ES6 模块语法错误
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5
- **Description**: 
  - 运行构建命令
  - 检查是否有 "Unexpected token 'export'" 或 "Cannot use import statement outside a module" 错误
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `programmatic` TR-6.1: 构建成功，无 ES6 模块语法错误
- **Notes**: 这是最关键的验证点
