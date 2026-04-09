# 个人中心页面功能增强

## 需求分析
用户希望在个人中心页面：
1. 增加个人信息：一个头像和名字
2. 在个人信息下面增加销售记录列表
3. 点击销售记录可以进去看明细和历史
4. 每次点击结算生成一条明细（这个已经实现了）

## 当前代码结构
- Profile页面：显示记账本信息、使用说明、功能特点
- AppContext：已经有salesRecords状态，每次结算会生成记录
- SalesRecord类型：包含id、items、totalSales、totalProfit、date

## 实现方案

### 1. 修改Profile页面
- 移除原有的记账本信息卡片
- 添加个人信息区域：头像和名字
- 添加销售记录列表
- 销售记录显示：日期、总销售额、总利润
- 点击销售记录跳转到详情页

### 2. 创建销售记录详情页
- 创建新页面 `pages/sales-record-detail`
- 显示该条记录的所有商品明细
- 显示总销售额和总利润
- 显示日期

### 3. 添加头像和名字数据
- 在AppContext中添加头像和名字状态
- 使用本地存储保存
- 默认头像可以用水果图标或emoji
- 默认名字可以是"水果店老板"

### 4. 修改应用配置
- 在app.config.ts中添加新页面路由

## 文件修改/创建清单
1. `src/pages/profile/index.tsx` - 重写个人中心页面
2. `src/pages/sales-record-detail/index.tsx` - 新建销售记录详情页
3. `src/pages/sales-record-detail/index.config.ts` - 新建详情页配置
4. `src/pages/sales-record-detail/index.module.scss` - 新建详情页样式
5. `src/store/AppContext.tsx` - 添加头像和名字状态
6. `src/app.config.ts` - 添加新页面路由

## 实现步骤
1. 在AppContext中添加头像和名字状态
2. 修改app.config.ts添加新页面路由
3. 创建销售记录详情页
4. 重写个人中心页面
5. 添加相关样式
6. 测试功能是否正常

## 功能特性
- 个人信息：头像和名字（可自定义）
- 销售记录列表：按时间倒序显示
- 销售记录卡片：显示日期、总销售额、总利润
- 详情页：显示完整商品明细
- 数据持久化：头像、名字、销售记录都保存到本地存储
