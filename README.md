# 水果店记账本

基于 Taro + React 的微信小程序，为水果店提供便捷的销售记录、清单管理和利润计算功能。

## 功能特性

### 🏠 首页
- 商品分类展示（水果、蔬菜等）
- 商品卡片展示：图片、名称、价格、成本价
- 快速添加商品到清单
- 支持自定义数量和规格

### 📋 清单页面
- 实时清单管理：添加、删除、修改数量
- 动态价格调整：支持修改售价和成本价
- 实时统计：总销售额、总利润、商品数量
- 一键结算：自动生成销售记录
- 云端同步：支持将清单上传到云端

### 👤 个人页面
- 用户信息展示（头像、昵称）
- 销售记录列表：查看历史销售记录
- 销售记录详情：查看每笔订单的详细信息
- 商品管理：添加、编辑、删除商品信息
- AI 助手：智能对话、生成图片
- 小程序码：分享给客户扫码使用

### 🤖 AI 助手
- 智能对话：基于微信云开发的 AI 能力
- 图片生成：支持生成图片
- Markdown 渲染：支持富文本展示

## 技术栈

- **框架**: Taro 4.1.9
- **前端**: React 18 + TypeScript
- **样式**: Sass (SCSS)
- **状态管理**: Zustand + React Context
- **云服务**: 微信云开发
- **日期处理**: Day.js
- **AI 组件**: 微信小程序原生 agent-ui

## 项目结构

```
testStore/
├── agent-ui/           # 微信小程序原生 AI 组件
├── ai-chat/            # AI 聊天页面（原生）
├── config/             # Taro 配置文件
├── src/
│   ├── components/     # 公共组件
│   │   ├── CartItem/   # 购物车项组件
│   │   └── ProductCard/ # 商品卡片组件
│   ├── custom-tab-bar/ # 自定义底部导航
│   ├── data/           # 静态数据
│   ├── pages/          # 页面
│   │   ├── home/       # 首页
│   │   ├── cart/       # 清单页
│   │   ├── profile/    # 个人页
│   │   ├── product-management/ # 商品管理
│   │   ├── sales-record-list/   # 销售记录列表
│   │   └── sales-record-detail/ # 销售记录详情
│   ├── store/          # 状态管理
│   ├── styles/         # 全局样式
│   ├── types/          # TypeScript 类型定义
│   └── utils/          # 工具函数
├── package.json
└── tsconfig.json
```

## 快速开始

### 环境要求
- Node.js >= 14
- 微信开发者工具
- 微信小程序账号

### 安装依赖

```bash
npm install
```

### 配置云开发

1. 在微信开发者工具中开通云开发
2. 创建云环境
3. 修改 `src/store/AppContext.tsx` 中的云环境 ID：
   ```typescript
   Taro.cloud.init({
     env: 'your-env-id', // 替换为你的云环境 ID
     traceUser: true,
   });
   ```

### 开发

```bash
# 微信小程序开发
npm run dev:weapp
```

### 构建

```bash
# 微信小程序构建
npm run build:weapp
```

## 云函数

项目依赖以下云函数：

- `fruitFunctions`: 商品数据管理（增删改查）
- `fruitBeforeFunctions`: 清单数据管理
- `fruitSaveFunctions`: 销售记录管理
- `quickstartFunctions`: 用户信息、小程序码生成

## 数据存储

- **本地存储**: 使用 Taro Storage API 存储清单、销售记录
- **云端存储**: 微信云数据库存储商品信息、销售记录
- **云存储**: 存储商品图片、小程序码

## 注意事项

1. **原生混编**: 项目使用 Taro 原生混编功能，agent-ui 和 ai-chat 放在项目根目录，通过 copy 配置复制到 dist
2. **云开发**: 需要先开通微信云开发并配置云环境
3. **多端限制**: 由于使用了微信小程序原生组件，项目仅支持微信小程序

## 版本

1.0.0

## License

MIT
