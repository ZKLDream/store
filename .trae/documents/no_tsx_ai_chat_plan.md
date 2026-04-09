# 无需 tsx 的 AI 聊天页面方案

## 目标
完全移除 src/pages/ai-chat 中的 tsx 占位页面，让根目录的 ai-chat 原生页面直接显示。

## 方案思路

### 方案 1：使用 Taro 自定义页面（推荐）
创建一个最简单的 Taro 页面，在编译后立即被根目录的 ai-chat 覆盖。

### 方案 2：修改 webpack 编译流程
在 webpack 编译完成后，自动执行复制命令覆盖 dist/pages/ai-chat。

### 方案 3：使用 Taro 的原生页面支持
利用 Taro 对原生页面的支持，让根目录的 ai-chat 直接被识别为页面。

## 当前架构
```
项目根目录/
├── agent-ui/              ← 根目录，原生组件
├── ai-chat/               ← 根目录，原生页面（完整正确）
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── src/
│   └── pages/
│       └── ai-chat/       ← 占位页面（可以简化或移除）
│           ├── index.tsx
│           └── index.config.ts
└── config/index.ts         ← 需要增强
```

## 推荐实施方案

### 步骤 1：简化 src/pages/ai-chat
让这个页面尽可能简单，避免产生不必要的编译输出。

### 步骤 2：修改 Taro 配置
在 config/index.ts 中添加 webpack 插件，在编译完成后自动复制覆盖。

### 步骤 3：验证
确保每次构建后，dist/pages/ai-chat 都是根目录的原生文件。
