# 云函数获取用户信息 - Product Requirement Document

## Overview
- **Summary**: 在个人页显示从 quickstartFunctions 云函数的 getOpenId 接口获取的用户信息
- **Purpose**: 从微信云函数获取用户的 openid 等信息并展示在个人页
- **Target Users**: 水果店小程序用户

## Goals
- 调用 quickstartFunctions 云函数的 getOpenId 接口
- 在个人页显示获取到的用户信息
- 保持现有功能不变

## Non-Goals (Out of Scope)
- 不修改云函数代码（已部署好）
- 不实现用户登录功能
- 不修改其他页面

## Background & Context
- 现有个人页显示本地存储的 userName
- quickstartFunctions 云函数已部署，包含 getOpenId 接口
- getOpenId 返回 openid、appid、unionid

## Functional Requirements
- **FR-1**: 个人页从云函数获取用户信息
- **FR-2**: 显示获取到的 openid（或部分信息）
- **FR-3**: 添加加载状态和错误处理

## Non-Functional Requirements
- **NFR-1**: 云函数调用在 3 秒内完成
- **NFR-2**: 错误提示清晰易懂
- **NFR-3**: 代码结构清晰，易于维护

## Constraints
- **Technical**: 必须使用微信云开发 SDK
- **Business**: 云函数名称为 quickstartFunctions
- **Dependencies**: 微信云开发环境已配置

## Assumptions
- 云函数 getOpenId 返回格式正确
- 云函数已正确配置并可正常调用
- 用户已在微信开发者工具中开通云开发

## Acceptance Criteria

### AC-1: 个人页从云函数获取用户信息
- **Given**: 用户打开个人页
- **When**: 页面加载完成
- **Then**: 调用 quickstartFunctions 云函数的 getOpenId 接口
- **Verification**: `programmatic`
- **Notes**: 使用 `wx.cloud.callFunction` 调用

### AC-2: 显示用户信息
- **Given**: 云函数返回用户信息
- **When**: 数据加载完成
- **Then**: 在个人页显示获取到的信息
- **Verification**: `human-judgment`

### AC-3: 显示加载状态
- **Given**: 用户打开个人页
- **When**: 数据正在加载中
- **Then**: 页面显示加载状态
- **Verification**: `human-judgment`

### AC-4: 处理加载失败
- **Given**: 云函数调用失败
- **When**: 用户打开个人页
- **Then**: 显示错误提示信息
- **Verification**: `human-judgment`

### AC-5: 保持现有功能
- **Given**: 数据加载成功
- **When**: 用户进行操作
- **Then**: 所有现有功能（销售记录入口等）正常工作
- **Verification**: `human-judgment`

## Open Questions
- [ ] 具体显示哪些信息？openid 的全部还是部分？
- [ ] 是否需要同时显示 appid 和 unionid？
