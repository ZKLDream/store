# 个人中心页面功能增强 - Product Requirement Document

## Overview
- **Summary**: 为个人中心页面添加个人信息（头像和名字）、销售记录列表，以及销售记录详情页功能
- **Purpose**: 让用户可以查看个人信息、浏览销售记录历史、查看每次结算的商品明细
- **Target Users**: 水果店老板

## Goals
- [ ] 添加个人信息区域：头像和名字
- [ ] 添加销售记录列表功能
- [ ] 点击销售记录可以查看商品明细
- [ ] 头像、名字和销售记录数据持久化
- [ ] 页面美观、用户体验良好

## Non-Goals (Out of Scope)
- 不涉及复杂的用户登录系统
- 不涉及云端数据同步
- 不涉及多用户管理

## Background & Context
- 当前已有个人中心页面，显示记账本信息、使用说明等
- 结算功能已经实现，每次结算会生成销售记录
- 销售记录存储在AppContext的salesRecords状态中
- 使用本地存储进行数据持久化

## Functional Requirements
- **FR-1**: 个人中心页面显示用户头像和名字
- **FR-2**: 个人中心页面显示销售记录列表（按时间倒序）
- **FR-3**: 每个销售记录显示：日期、总销售额、总利润
- **FR-4**: 点击销售记录跳转到详情页
- **FR-5**: 详情页显示：日期、所有商品明细、总销售额、总利润
- **FR-6**: 头像、名字、销售记录数据保存到本地存储

## Non-Functional Requirements
- **NFR-1**: 页面加载速度快，响应流畅
- **NFR-2**: 数据持久化可靠，不丢失数据
- **NFR-3**: 页面设计美观，与整体风格一致
- **NFR-4**: 代码结构清晰，易于维护

## Constraints
- **Technical**: 使用Taro 4.x + React + TypeScript
- **Business**: 符合个人主体小程序审核要求
- **Dependencies**: 依赖现有的AppContext和storage工具

## Assumptions
- 用户每次结算都会生成一条销售记录
- 销售记录按时间倒序排列
- 头像使用默认水果图标或emoji
- 名字默认使用"水果店老板"

## Acceptance Criteria

### AC-1: 个人信息显示
- **Given**: 用户打开个人中心页面
- **When**: 页面加载完成
- **Then**: 显示用户头像和名字
- **Verification**: `human-judgment`

### AC-2: 销售记录列表显示
- **Given**: 用户打开个人中心页面
- **When**: 页面加载完成
- **Then**: 显示销售记录列表，按时间倒序排列，每条记录显示日期、总销售额、总利润
- **Verification**: `human-judgment`

### AC-3: 销售记录点击跳转
- **Given**: 用户在个人中心页面看到销售记录列表
- **When**: 用户点击某条销售记录
- **Then**: 跳转到销售记录详情页
- **Verification**: `human-judgment`

### AC-4: 销售记录详情显示
- **Given**: 用户在销售记录详情页
- **When**: 页面加载完成
- **Then**: 显示该条记录的日期、所有商品明细、总销售额、总利润
- **Verification**: `human-judgment`

### AC-5: 数据持久化
- **Given**: 用户修改了头像/名字，或生成了新的销售记录
- **When**: 重启小程序
- **Then**: 头像、名字、销售记录数据保持不变
- **Verification**: `human-judgment`

## Open Questions
- [ ] 用户是否需要修改头像和名字的功能？
- [ ] 销售记录是否需要删除功能？
