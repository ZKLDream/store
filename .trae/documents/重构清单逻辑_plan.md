# 重构清单逻辑计划

## 仓库研究结论

当前状态：
- AppContext.tsx 中的清单操作已经是只更新本地的了
- storage.ts 的 getList 是优先从云端获取的
- storage.ts 的 setList 会同时更新本地和云端

重构目标：
1. 所有清单操作（加入清单、修改数量、修改售价、修改成本）只使用本地存储，不调用云函数
2. 只有点击上传按钮时才调用云函数，判断是创建还是更新
3. 清单展示逻辑优先使用本地存储，本地没有再从云端获取

## 需要修改的文件

1. `src/utils/storage.ts` - 重构清单存储逻辑
2. `src/store/AppContext.tsx` - 修改 uploadListToCloud 函数

## 修改步骤

### 步骤 1: 重构 storage.ts 的清单存储逻辑
在 `src/utils/storage.ts` 中：
- 重构 `getList()` - 优先从本地获取，本地没有再从云端获取
- 重构 `setList()` - 只更新本地，不更新云端
- 新增 `uploadListToCloud()` - 专门用来上传到云端，判断是创建还是更新

### 步骤 2: 修改 AppContext.tsx 的 uploadListToCloud 函数
在 `src/store/AppContext.tsx` 中：
- 修改 `uploadListToCloud()` - 调用 storage 新增的 uploadListToCloud 函数
- 移除 storage 的 setList 调用（因为不再需要）

## 详细逻辑

### getList() 逻辑
1. 先尝试从本地存储获取
2. 如果本地有数据，直接返回
3. 如果本地没有，尝试从云端获取
4. 云端获取成功后，同步到本地存储
5. 返回数据

### setList() 逻辑
1. 只更新本地存储
2. 不调用任何云函数

### uploadListToCloud() 逻辑
1. 获取当前清单数据
2. 先查询云端是否有清单记录
3. 如果有记录，调用 updateRecord 更新
4. 如果没有记录，调用 insertRecord 创建
5. 上传成功/失败显示提示

## 注意事项

- 所有清单操作完全本地化，响应更快
- 只有主动点击上传才同步云端
- 本地优先，云端兜底
- 确保现有功能不受影响
