# 优化清单同步体验计划

## 仓库研究结论

当前问题：

* 每次修改清单（点击加号、修改售价、成本）都会立即更新云端

* 用户需要等待云端响应，体验不够流畅

优化方案：

1. 修改清单时只更新本地 state 和本地存储
2. 在结算按钮左边增加一个"上传"按钮
3. 只有点击"上传"按钮时，才同步到云端
4. 上传完成后显示提示

## 需要修改的文件

1. `src/store/AppContext.tsx` - 修改更新逻辑，添加上传功能
2. `src/pages/cart/index.tsx` - 在结算按钮左边添加上传按钮
3. `src/components/CartItem/index.tsx` - 简化组件，移除异步等待逻辑

## 修改步骤

### 步骤 1: 修改 AppContext.tsx

* `updateListItemQuantity` - 只更新本地，不同步云端

* `updateListItemPrice` - 只更新本地，不同步云端

* `updateListItemCostPrice` - 只更新本地，不同步云端

* `addToList` - 只更新本地，不同步云端

* `removeFromList` - 只更新本地，不同步云端

* `clearList` - 只更新本地，不同步云端

* 新增 `uploadListToCloud()` - 专门用来上传到云端

### 步骤 2: 修改 cart 页面

* 导入 `uploadListToCloud`

* 在结算按钮左边添加"上传"按钮

* 点击上传时调用 `uploadListToCloud`

* 显示上传状态和成功/失败提示

### 步骤 3: 修改 CartItem 组件

* 移除 `isSaving` 状态

* 移除所有异步等待逻辑

* 简化所有函数为同步

* 移除按钮禁用状态

## 功能特点

* ⚡ 修改清单时立即生效，无需等待

* ☁️ 主动点击"上传"按钮才同步到云端

* 📱 更好的用户体验

* ✅ 上传完成有提示反馈

## 注意事项

* 上传按钮只在清单有内容时显示

* 上传期间按钮禁用

* 上传成功/失败显示提示

* 结算功能不受影响

