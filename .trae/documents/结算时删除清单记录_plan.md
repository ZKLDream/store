# 结算时删除清单记录计划

## 仓库研究结论

当前功能：
- 结算时调用 `createSalesRecord()` 创建销售记录
- 然后调用 `clearList()` 清空本地清单
- 需要在结算成功后，调用 fruitBeforeFunctions 的 deleteRecord 删除云端清单

需要修改：
1. 在 cloud.ts 中添加 `deleteBeforeListRecord()` 函数
2. 在 AppContext.tsx 中修改 `createSalesRecord()`，结算成功后删除云端清单

## 需要修改的文件

1. `src/utils/cloud.ts` - 添加删除清单记录的云函数调用
2. `src/store/AppContext.tsx` - 修改 createSalesRecord，结算成功后删除云端清单

## 修改步骤

### 步骤 1: 在 cloud.ts 中添加删除清单记录函数
在 `src/utils/cloud.ts` 中：
- 新增 `deleteBeforeListRecord()` 函数
- 调用 fruitBeforeFunctions 的 deleteRecord 接口
- 传入云端清单记录的 _id

### 步骤 2: 修改 AppContext.tsx 的 createSalesRecord 函数
在 `src/store/AppContext.tsx` 中：
- 修改 `createSalesRecord()` 函数
- 在结算成功后，先获取云端清单记录
- 如果有记录，调用删除接口
- 然后清空本地清单

## 注意事项

- 删除云端清单只在结算成功后执行
- 需要先获取云端记录的 _id 才能删除
- 删除失败不影响本地清单清空
- 确保销售记录先创建成功，再删除清单
