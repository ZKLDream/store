# Taro 原生混编方案（官方文档版）

## 根据 Taro 官方文档 https://docs.taro.zone/docs/hybrid

## 核心思路

Taro 支持使用小程序原生的页面、组件和插件！

## 正确的实现方案

### 方案：使用 Taro 原生混编

根据官方文档，我们只需要：

1. **在 app 配置中，设置好原生页面的路由**
2. **原生页面放在 src/native/ 目录下（或其他约定目录）**
3. **不需要复杂的 webpack 排除配置**

## 推荐的目录结构

```
项目根目录/
├── src/
│   ├── native/             ← 新增：原生页面和组件目录
│   │   ├── agent-ui/      ← agent-ui 组件
│   │   └── ai-chat/       ← ai-chat 原生页面
│   │       ├── index.js
│   │       ├── index.json
│   │       ├── index.wxml
│   │       └── index.wxss
│   └── pages/
│       ├── home/
│       ├── cart/
│       └── profile/
│           └── ...
└── app.config.ts         ← 修改：添加原生页面路由
```

## 实施步骤

### 1. 创建 src/native 目录
- 将 agent-ui 移动到 src/native/agent-ui
- 将 ai-chat 移动到 src/native/ai-chat

### 2. 修改 app.config.ts
在 pages 数组中添加：
```typescript
pages: [
  'pages/home/index',
  'pages/cart/index',
  'pages/profile/index',
  'native/ai-chat/index'  // 原生页面路由
]
```

### 3. 修改 ai-chat 原生页面的配置
修改 ai-chat/index.json 中的组件引用路径，从 `/agent-ui/index` 改为 `/src/native/agent-ui/index`

## 优势

- 完全符合 Taro 官方文档的原生混编方式
- 不需要复杂的 webpack 排除配置
- 不需要复杂的 copy 插件
- Taro 会自动处理原生页面和组件

## 风险

- 项目将不再具备多端转换的能力（只能在微信小程序运行）
- 但这是使用原生组件的必要代价
