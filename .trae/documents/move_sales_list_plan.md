# 销售记录列表移动到单独页面

## 需求分析
用户希望：
1. 个人页面只显示介绍和入口，不直接显示销售记录列表
2. 创建单独的销售记录列表页面
3. 个人页面有一个入口可以点击进入销售记录列表页面

## 实现方案

### 1. 创建销售记录列表页面
- 创建新页面 `pages/sales-record-list`
- 显示销售记录列表（现在个人页面的内容）
- 点击记录跳转到详情页

### 2. 重写个人页面
- 只显示个人信息（头像、名字）
- 添加一个"销售记录"入口卡片
- 点击入口跳转到销售记录列表页面
- 保留版本信息

### 3. 修改应用配置
- 在app.config.ts中添加sales-record-list页面路由

### 4. 更新相关页面
- 确保跳转逻辑正确

## 文件修改/创建清单
1. `src/app.config.ts` - 添加sales-record-list页面路由
2. `src/pages/sales-record-list/index.tsx` - 新建销售记录列表页面
3. `src/pages/sales-record-list/index.config.ts` - 新建列表页配置
4. `src/pages/sales-record-list/index.module.scss` - 新建列表页样式
5. `src/pages/profile/index.tsx` - 重写个人页面，添加入口

## 实现步骤
1. 修改app.config.ts添加新页面路由
2. 创建销售记录列表页面
3. 重写个人页面，添加入口
4. 测试跳转是否正常
5. 构建项目确保没有错误
