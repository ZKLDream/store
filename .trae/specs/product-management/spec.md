# 商品管理功能 - Product Requirement Document

## Overview

* **Summary**: 在个人页销售记录下面增加一行，添加商品管理入口，实现商品列表查看、编辑、删除功能，支持图片上传

* **Purpose**: 提供便捷的商品管理功能，允许用户修改商品信息、上传图片、删除商品

* **Target Users**: 水果店店主和管理员

## Goals

* 在个人页销售记录下面增加一行，添加商品管理入口

* 实现商品列表的展示

* 实现商品编辑功能（弹窗形式）

* 支持图片上传

* 实现商品删除功能

* 商品ID不可编辑

## Non-Goals (Out of Scope)

* 商品批量操作

* 商品搜索和筛选

* 商品导入导出

## Background & Context

* 现有系统已有水果数据从云函数获取

* 销售记录列表页面已存在

* 需要通过 fruitFunctions 云函数进行商品数据的增删改操作

## Functional Requirements

* **FR-1**: 在个人页销售记录下方添加"商品管理"入口行

* **FR-2**: 点击商品管理入口跳转到商品管理页面

* **FR-3**: 商品管理页面逐行显示商品列表详细信息

* **FR-4**: 点击商品单行进入弹窗编辑商品信息

* **FR-5**: 商品ID在编辑时不可编辑

* **FR-6**: 支持上传商品图片

* **FR-7**: 提供商品删除功能

## Non-Functional Requirements

* **NFR-1**: 编辑弹窗响应迅速，加载时间 < 500ms

* **NFR-2**: 图片上传支持常见图片格式（jpg、png、webp）

* **NFR-3**: 删除操作有二次确认提示

## Constraints

* **Technical**: 使用 Taro 框架 + 微信小程序云开发

* **Business**: 需要通过 fruitFunctions 云函数操作数据

* **Dependencies**: 依赖 fruitFunctions 云函数提供商品数据的 CRUD 接口

  ```javascript
  insertRecord,deleteRecord,updateRecord,selectRecord 已实现
  ```

## insertRecordAssumptions

* fruitFunctions 云函数已提供商品数据的增删改查接口

* 云存储已配置用于图片上传

* 用户有商品编辑和删除的权限

## Acceptance Criteria

### AC-1: 商品管理入口显示

* **Given**: 用户在个人页销售记录下方

* **When**: 页面加载完成

* **Then**: 在个人页销售记录下方显示"商品管理"入口行

* **Verification**: `human-judgment`

### AC-2: 点击进入商品管理页面

* **Given**: 用户在个人页销售记录下方

* **When**: 点击"商品管理"入口

* **Then**: 跳转到商品管理页面

* **Verification**: `human-judgment`

### AC-3: 商品列表展示

* **Given**: 用户在商品管理页面

* **When**: 页面加载完成

* **Then**: 逐行显示所有商品的详细信息（id、category、name、desc、price、costPrice、image）

* **Verification**: `human-judgment`

### AC-4: 点击进入编辑弹窗

* **Given**: 用户在商品管理页面

* **When**: 点击某个商品行

* **Then**: 弹出编辑弹窗，显示该商品的详细信息

* **Verification**: `human-judgment`

### AC-5: ID不可编辑

* **Given**: 用户在商品编辑弹窗中

* **When**: 查看商品信息

* **Then**: 商品ID字段显示但不可编辑

* **Verification**: `human-judgment`

### AC-6: 其他字段可编辑

* **Given**: 用户在商品编辑弹窗中

* **When**: 尝试编辑商品信息

* **Then**: category、name、desc、price、costPrice 都有输入框可以编辑

* **Verification**: `human-judgment`

### AC-7: 图片上传功能

* **Given**: 用户在商品编辑弹窗中

* **When**: 点击图片区域

* **Then**: 可以选择并上传新的商品图片

* **Verification**: `human-judgment`

### AC-8: 保存编辑

* **Given**: 用户在商品编辑弹窗中修改了信息

* **When**: 点击保存按钮

* **Then**: 商品信息更新并保存到云端

* **Verification**: `programmatic`

### AC-9: 删除商品

* **Given**: 用户在商品编辑弹窗或商品列表中

* **When**: 点击删除按钮并确认

* **Then**: 商品从云端和列表中删除

* **Verification**: `programmatic`

## Open Questions

* [ ] fruitFunctions 云函数是否已提供商品数据的 updateRecord 和 deleteRecord 接口？已提供

* [ ] 云存储的路径配置是什么？用已有的fruitFunctions

* [ ] 商品删除是否需要二次确认弹窗？是

