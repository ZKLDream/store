# 水果店小程序 - Product Requirement Document

## Overview

- **Summary**: 开发一个水果店微信小程序的MVP版本，实现水果商品展示、购物车和订单管理功能
- **Purpose**: 帮助水果店老板快速搭建线上销售渠道，让顾客可以方便浏览水果、加入购物车并下单
- **Target Users**: 水果店顾客、水果店老板

## Goals

- 实现水果商品列表展示（图片、名称、描述、价格）
- 实现购物车功能（添加商品、查看购物车）
- 实现订单生成和订单列表功能
- 界面美观，参考用户提供的奶茶店小程序样式

## Non-Goals (Out of Scope)

- 不实现真实支付功能
- 不实现用户登录认证
- 不实现库存管理
- 不实现后台管理系统
- 不实现数据持久化（使用本地存储）

## Background & Context

- 用户有实体店水果价格数据（CSV格式）
- 用户提供了奶茶店小程序界面作为参考样式
- 使用Taro框架开发微信小程序，支持多端运行

## Functional Requirements

- **FR-1**: 商品列表展示
  - 展示水果分类
  - 展示每个水果的图片、名称、描述、价格
  - 支持加入购物车按钮
- **FR-2**: 购物车功能
  - 查看购物车商品
  - 修改商品数量
  - 删除购物车商品
  - 显示总价格
- **FR-3**: 订单功能
  - 从购物车生成订单
  - 查看订单列表
  - 显示订单详情

## Non-Functional Requirements

- **NFR-1**: 界面美观，与参考样式类似
- **NFR-2**: 响应式设计，适配不同屏幕尺寸
- **NFR-3**: 加载速度快，交互流畅

## Constraints

- **Technical**: 使用Taro框架开发微信小程序
- **Business**: MVP版本，功能简单实用
- **Dependencies**: Taro、React、微信小程序API

## Assumptions

- 用户已经有微信小程序账号
- 用户可以提供水果图片资源
- 使用本地存储存储购物车和订单数据

## Acceptance Criteria

### AC-1: 商品列表展示

- **Given**: 用户打开小程序
- **When**: 用户浏览商品列表
- **Then**: 可以看到水果分类、每个水果的图片、名称、描述、价格，以及加入购物车按钮
- **Verification**: `human-judgment`

### AC-2: 加入购物车

- **Given**: 用户在商品列表页面
- **When**: 用户点击某个水果的加入购物车按钮
- **Then**: 商品被添加到购物车，有视觉反馈
- **Verification**: `programmatic`

### AC-3: 查看购物车

- **Given**: 用户已经添加商品到购物车
- **When**: 用户进入购物车页面
- **Then**: 可以看到购物车中的商品列表、数量、价格和总价格
- **Verification**: `programmatic`

### AC-4: 生成订单

- **Given**: 用户在购物车页面
- **When**: 用户点击下单按钮，需要填入地址
- **Then**: 订单生成成功，并跳转到订单列表
- **Verification**: `programmatic`

### AC-5: 查看订单列表

- **Given**: 用户已经生成过订单
- **When**: 用户进入订单列表页面
- **Then**: 可以看到历史订单列表和订单详情
- **Verification**: `programmatic`

## Open Questions

- [ ] 水果图片资源从哪里获取？水果图片资源你先帮我用网络占位图
- [ ] 是否需要支持多规格选择？ 规格需要支持几斤这种

