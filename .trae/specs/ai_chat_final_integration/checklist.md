# AI 聊天功能最终集成方案 - 验证清单

- [x] agent-ui 组件已移动到 src/components/agent-ui/ 目录
- [x] src/components/agent-ui/ 目录下存在 customWrapper.js
- [x] src/components/agent-ui/ 目录下存在 props.js
- [x] props.js 包含所有必要的属性配置（chatMode, showBotAvatar, agentConfig, modelConfig, envShareConfig）
- [x] AI 聊天页面已创建（src/pages/ai-chat/）
- [x] AI 聊天页面的 index.tsx 正确使用 &lt;agent-ui&gt; 标签
- [x] AI 聊天页面的 index.config.ts 正确配置 usingComponents
- [x] app.config.ts 中已添加 pages/ai-chat/index 路由
- [x] 个人页面商品管理下方已显示 AI 入口卡片
- [x] AI 入口卡片样式与现有入口卡片一致
- [x] 点击 AI 入口能正确跳转到 AI 聊天页面
- [ ] 构建项目无 "Unexpected token 'export'" 错误
- [ ] 构建项目无 "Cannot use import statement outside a module" 错误
- [ ] AI 聊天页面能正常显示 agent-ui 组件界面
- [ ] agent-ui 组件的配置参数正确设置
