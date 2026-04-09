# AI 聊天功能集成 - 产品需求文档

## Overview
- **Summary**: 在水果店小程序中集成 agent-ui AI 组件，提供 AI 对话、生成图片等智能能力
- **Purpose**: 为用户提供智能助手服务，增强小程序的功能体验
- **Target Users**: 水果店小程序的所有用户

## Goals
- 在个人页面商品管理下方新增 AI 入口
- 点击 AI 入口后能正常显示 agent-ui 组件界面
- 支持 AI 对话、生成图片等核心能力
- 保持与现有小程序架构的兼容性

## Non-Goals (Out of Scope)
- 不修改 agent-ui 组件的核心逻辑
- 不添加新的 AI 功能（仅使用组件已有的能力）
- 不修改其他页面的功能

## Background & Context
- 项目已导入 agent-ui 组件到 `src/components/agent-ui/` 目录
- agent-ui 是微信小程序原生组件（使用 .wxml, .wxss, .js）
- 当前项目使用 Taro + React 框架
- 需要在个人页面新增入口并创建新的 AI 页面

## Functional Requirements
- **FR-1**: 在个人页面商品管理下方新增 AI 入口卡片
- **FR-2**: 点击 AI 入口卡片跳转到 AI 聊天页面
- **FR-3**: AI 聊天页面正常显示 agent-ui 组件
- **FR-4**: AI 组件支持对话、生成图片等能力

## Non-Functional Requirements
- **NFR-1**: AI 页面加载时间不超过 2 秒
- **NFR-2**: 保持与现有页面一致的视觉风格
- **NFR-3**: 支持返回上一页功能

## Constraints
- **Technical**: 必须使用 Taro 框架，agent-ui 是微信小程序原生组件
- **Business**: 保持小程序的核心功能（水果店记账）不受影响
- **Dependencies**: 依赖 agent-ui 组件和微信云开发 AI 能力

## Assumptions
- agent-ui 组件已正确配置并可以正常使用
- 微信云开发 AI 能力已开通并配置好
- 用户已授权小程序必要的权限

## Acceptance Criteria

### AC-1: 个人页面显示 AI 入口
- **Given**: 用户在个人页面
- **When**: 页面加载完成
- **Then**: 在商品管理下方看到 AI 入口卡片
- **Verification**: `human-judgment`

### AC-2: 点击 AI 入口跳转到 AI 页面
- **Given**: 用户在个人页面
- **When**: 点击 AI 入口卡片
- **Then**: 跳转到 AI 聊天页面
- **Verification**: `human-judgment`

### AC-3: AI 页面正常显示 agent-ui 组件
- **Given**: 用户在 AI 聊天页面
- **When**: 页面加载完成
- **Then**: 看到完整的 agent-ui 组件界面，包括对话输入框、历史记录等
- **Verification**: `human-judgment`

### AC-4: 支持 AI 对话功能
- **Given**: 用户在 AI 聊天页面
- **When**: 输入消息并发送
- **Then**: AI 正常响应并显示回复
- **Verification**: `human-judgment`

### AC-5: 支持返回上一页
- **Given**: 用户在 AI 聊天页面
- **When**: 点击返回按钮
- **Then**: 返回到个人页面
- **Verification**: `human-judgment`

## Open Questions
- [ ] agent-ui 组件的具体配置参数（如 botId、modelConfig 等）是什么？
- [ ] 是否需要配置微信云开发 AI 相关的环境变量？
- [ ] agent-ui 组件是否需要特殊的权限配置？
