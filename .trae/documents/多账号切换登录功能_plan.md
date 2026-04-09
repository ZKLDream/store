# 多账号切换登录功能计划

## 仓库研究结论

微信小程序的特性：
- 每个微信账号对应一个唯一的 openid
- 同一个小程序在不同微信账号下，openid 是不同的
- 小程序不能主动切换微信账号，只能由用户手动切换
- 云函数通过 `cloud.getWXContext()` 获取当前登录用户的 openid

需要实现：
- 点击头像显示操作菜单
- 提供"切换账号"选项
- 提示用户在微信中切换账号
- 切换后重新获取 openid 和数据

## 需要修改的文件

1. `src/store/AppContext.tsx` - 添加切换账号相关的状态和方法
2. `src/pages/profile/index.tsx` - 添加头像点击交互和操作菜单
3. `src/pages/profile/index.module.scss` - 添加菜单样式
4. `src/utils/cloud.ts` - 确保 openid 获取逻辑正确

## 修改步骤

### 步骤 1: 在 AppContext 中添加切换账号功能
在 `src/store/AppContext.tsx` 中：
- 添加 `currentOpenId` 状态
- 添加 `loadUserData` 方法 - 重新加载用户数据
- 添加 `handleSwitchAccount` 方法 - 处理切换账号逻辑
- 在 context 中暴露这些方法

### 步骤 2: 在个人页面添加头像点击和操作菜单
在 `src/pages/profile/index.tsx` 中：
- 添加头像可点击样式
- 添加 `showUserMenu` state 控制菜单显示
- 添加点击头像显示菜单的逻辑
- 菜单包含"切换账号"选项

### 步骤 3: 实现切换账号逻辑
在个人页面中：
- 点击"切换账号"时，显示提示，引导用户在微信中切换账号
- 用户切换微信账号后，重新进入小程序
- 重新获取 openid 和用户数据

### 步骤 4: 重新加载数据
- 切换账号后，重新加载商品数据和销售记录
- 确保数据与当前微信账号关联

### 步骤 5: 添加菜单样式
在 `src/pages/profile/index.module.scss` 中：
- 添加操作菜单样式
- 添加提示弹窗样式

## 依赖和注意事项

1. 微信小程序的 openid 是基于当前登录的微信账号
2. 切换账号需要用户手动在微信中操作
3. 不同账号的数据应该隔离存储
4. 重新加载数据时需要显示加载状态

## 风险处理

1. 如果获取 openid 失败，显示友好的错误提示
2. 确保数据加载的错误处理
3. 提供清晰的用户指引
