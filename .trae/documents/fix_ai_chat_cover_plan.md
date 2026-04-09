# 修复 AI 聊天页面覆盖问题

## 问题分析
- 根目录 `ai-chat/` 已有完整的原生页面文件
- 目前显示的是 `src/pages/ai-chat/index.tsx` 编译出来的占位页面
- 需要让根目录的 ai-chat 原生文件最终覆盖到 `dist/pages/ai-chat/`

## 当前架构
```
项目根目录/
├── agent-ui/              ← 根目录，纯原生组件
├── ai-chat/               ← 根目录，纯原生页面（完整正确）
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── src/
│   └── pages/
│       └── ai-chat/       ← Taro 占位页面（需要简化）
│           ├── index.tsx
│           └── index.config.ts
└── config/index.ts         ← copy 配置已有
```

## 修复步骤

### 1. 简化 src/pages/ai-chat/index.tsx
让占位页面尽可能简单，避免产生复杂的编译输出

### 2. 验证 copy 配置
确认 Taro 的 copy 配置正确：
- `from: 'ai-chat'` → `to: 'dist/pages/ai-chat'`
- `from: 'agent-ui'` → `to: 'dist/agent-ui'`

### 3. 清理构建缓存
确保重新构建时没有旧文件残留

## 预期结果
构建完成后，`dist/pages/ai-chat/` 目录下的内容应该是根目录 ai-chat 的原生文件，而不是 Taro 编译出来的文件。
