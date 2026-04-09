# AI 聊天功能最终集成方案 - 产品需求文档

## Overview

* **Summary**: 使用 Taro 自定义原生组件功能，将 agent-ui 微信小程序原生组件集成到 Taro 项目中

* **Purpose**: 为用户提供 AI 对话、生成图片等智能能力

* **Target Users**: 水果店小程序的所有用户

## Goals

* 使用 Taro 自定义原生组件的标准方式集成 agent-ui

* 在个人页面商品管理下方新增 AI 入口

* 点击 AI 入口后能正常显示 agent-ui 组件界面

* 支持 AI 对话、生成图片等核心能力

* 完全避免 ES6 模块语法错误

## Non-Goals (Out of Scope)

* 不修改 agent-ui 组件的核心逻辑

* 不添加新的 AI 功能（仅使用组件已有的能力）

* 不使用跳转页面的方式

## Background & Context

* agent-ui 是微信小程序原生组件（使用 .wxml, .wxss, .js）

* agent-ui 使用 ES6 模块语法（import/export）

* Taro 提供自定义原生组件功能，可以正确处理这种情况

* 需要在 `src/components/agent-ui/` 目录下创建 `customWrapper.js` 和 `props.js`

## Functional Requirements

* **FR-1**: 将 agent-ui 组件移到 `src/components/agent-ui/` 目录

* **FR-2**: 创建 Taro 自定义原生组件包装器（customWrapper.js 和 props.js）

* **FR-3**: 在个人页面商品管理下方新增 AI 入口卡片

* **FR-4**: 点击 AI 入口卡片跳转到 AI 聊天页面

* **FR-5**: AI 聊天页面使用 Taro 自定义原生组件方式显示 agent-ui

* **FR-6**: 在 app.config.ts 中添加 AI 聊天页面路由

## Non-Functional Requirements

* **NFR-1**: 完全避免 ES6 模块语法错误

* **NFR-2**: 保持与现有小程序架构的兼容性

* **NFR-3**: AI 页面加载时间不超过 2 秒

## Constraints

* **Technical**: 必须使用 Taro 自定义原生组件功能

* **Business**: 保持小程序的核心功能（水果店记账）不受影响

* **Dependencies**: 依赖 agent-ui 组件和微信云开发 AI 能力

## Assumptions

* agent-ui 组件已正确配置并可以正常使用

* 微信云开发 AI 能力已开通并配置好

* 用户已授权小程序必要的权限

* Taro 自定义原生组件功能可以正常工作

## Acceptance Criteria

### AC-1: agent-ui 组件正确放置在 src/components/agent-ui/

* **Given**: 项目结构

* **When**: 检查文件位置

* **Then**: agent-ui 组件在 `src/components/agent-ui/` 目录下

* **Verification**: `programmatic`

### AC-2: 存在 Taro 自定义原生组件包装器

* **Given**: agent-ui 组件目录

* **When**: 检查文件

* **Then**: 存在 `customWrapper.js` 和 `props.js`

* **Verification**: `programmatic`

### AC-3: 个人页面显示 AI 入口

* **Given**: 用户在个人页面

* **When**: 页面加载完成

* **Then**: 在商品管理下方看到 AI 入口卡片

* **Verification**: `human-judgment`

### AC-4: 点击 AI 入口跳转到 AI 页面

* **Given**: 用户在个人页面

* **When**: 点击 AI 入口卡片

* **Then**: 跳转到 AI 聊天页面

* **Verification**: `human-judgment`

### AC-5: AI 页面正常显示 agent-ui 组件

* **Given**: 用户在 AI 聊天页面

* **When**: 页面加载完成

* **Then**: 看到完整的 agent-ui 组件界面

* **Verification**: `human-judgment`

### AC-6: 无 ES6 模块语法错误

* **Given**: 项目构建

* **When**: 编译运行

* **Then**: 没有 "Unexpected token 'export'" 或 "Cannot use import statement outside a module" 错误

* **Verification**: `programmatic`

## Open Questions

* [ ] agent-ui 组件的具体配置参数（如 botId、modelConfig 等）是什么？先用占位，提示我要改

* [ ] 是否需要配置微信云开发 AI 相关的环境变量？先用占位，提示我要改

