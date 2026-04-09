# 修复 AI 聊天页面显示问题计划

## 问题分析
根目录的 `ai-chat` 文件夹里混入了 Taro 的文件（index.tsx, index.config.ts, index.module.scss），导致 Taro 编译时可能处理了这些文件。

## 修复方案

### 步骤 1：清理根目录 ai-chat 文件夹
- 从 `/ai-chat/` 中删除 Taro 文件：
  - index.tsx
  - index.config.ts
  - index.module.scss
- 只保留原生文件：
  - index.js
  - index.json
  - index.wxml
  - index.wxss

### 步骤 2：确保 Taro 配置正确
- 确认 `config/index.ts` 中的 copy 配置正确
- 确认复制路径是 `from: 'ai-chat'` → `to: 'dist/pages/ai-chat'`

### 步骤 3：验证 src/pages/ai-chat 是纯占位页面
- 确认 src/pages/ai-chat/index.tsx 不使用 agent-ui 标签
- 只显示简单的加载文字

## 预期结果
重新构建后，应该能看到 AI 助手界面，而不是"正在加载 AI 助手..."的占位页面。
