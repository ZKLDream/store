# 云函数获取水果数据 - Product Requirement Document

## Overview

* **Summary**: 将小程序中的静态水果数据 `fruitsData` 改为从微信云函数 `fruitFunctions` 的 `selectRecord` 接口动态获取

* **Purpose**: 实现水果数据的云端存储和动态加载，支持数据的动态更新和管理

* **Target Users**: 水果店小程序用户

## Goals

* 将静态水果数据改为从云函数获取

* 保持现有功能不变（首页展示、分类筛选等）

* 添加加载状态和错误处理

## Non-Goals (Out of Scope)

* 不修改云函数代码（已部署好）

* 不实现水果数据的编辑功能

* 不实现用户认证功能

## Background & Context

* 现有代码中水果数据存储在 `src/data/fruits.ts` 中

* 微信云函数 `fruitFunctions` 已部署，包含 `selectRecord` 接口

* 云函数返回的数据结构需要与现有 `Fruit` 类型兼容

## Functional Requirements

* **FR-1**: 首页从云函数加载水果数据

* **FR-2**: 显示数据加载状态

* **FR-3**: 处理加载失败时显示错误提示

* **FR-4**: 保持分类列表从云函数数据动态生成

## Non-Functional Requirements

* **NFR-1**: 数据加载时间不超过 3 秒

* **NFR-2**: 错误提示清晰易懂

* **NFR-3**: 代码结构清晰，易于维护

## Constraints

* **Technical**: 必须使用微信云开发 SDK

* **Business**: 云函数名称为 `fruitFunctions`

* **Dependencies**: 微信云开发环境已配置

## Assumptions

* 云函数返回的数据格式与现有 `Fruit` 类型兼容

* 云函数已正确配置并可正常调用

* 用户已在微信开发者工具中开通云开发

## Acceptance Criteria

### AC-1: 首页从云函数加载数据

* **Given**: 用户打开首页

* **When**: 页面加载完成

* **Then**: 水果数据从云函数 `fruitFunctions` 的 `selectRecord` 接口获取

* **Verification**: `programmatic`

* **Notes**: 使用 `wx.cloud.callFunction` 调用

### AC-2: 显示加载状态

* **Given**: 用户打开首页

* **When**: 数据正在加载中

* **Then**: 页面显示加载状态提示

* **Verification**: `human-judgment`

### AC-3: 处理加载失败

* **Given**: 云函数调用失败

* **When**: 用户打开首页

* **Then**: 显示错误提示信息

* **Verification**: `human-judgment`

### AC-4: 分类列表动态生成

* **Given**: 云函数返回水果数据

* **When**: 数据加载完成

* **Then**: 分类列表从返回的数据中动态生成

* **Verification**: `programmatic`

### AC-5: 保持现有功能

* **Given**: 数据加载成功

* **When**: 用户进行操作

* **Then**: 所有现有功能（分类切换、加入清单等）正常工作

* **Verification**: `human-judgment`

## Open Questions

* [ ] 云函数返回的数据字段是否与现有 `Fruit` 类型完全一致？,完全一致

* [ ] 是否需要处理云函数返回数据的字段映射？字段完全一致

