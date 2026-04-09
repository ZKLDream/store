# 清单云端同步功能实现计划

## 仓库研究结论

当前问题：
- 清单（购物车）只存储在本地
- 程序崩溃后清单数据可以恢复（因为本地存储持久化）
- 换手机（同微信号）后清单数据无法恢复（因为只存在本地）

已部署的云函数：
- **fruitBeforeFunctions** - 用于存储清单数据
- 集合名格式：`fruitsbefore_${openid}`
- 提供方法：createCollection, selectRecord, updateRecord, insertRecord, deleteRecord

## 需要修改的文件

1. `src/utils/cloud.ts` - 添加清单相关的云函数调用
2. `src/utils/storage.ts` - 修改清单存储逻辑，支持云端同步
3. `src/store/AppContext.tsx` - 修改清单加载和保存为异步

## 修改步骤

### 步骤 1: 在 cloud.ts 中添加清单相关云函数调用
在 `src/utils/cloud.ts` 中：
- 添加 `createBeforeListCollection()` - 创建清单集合
- 添加 `getBeforeList()` - 获取清单数据
- 添加 `updateBeforeList()` - 更新清单数据

### 步骤 2: 修改 storage.ts，让清单支持云端同步
在 `src/utils/storage.ts` 中：
- 修改 `getList()` 为异步函数
- 修改 `setList()` 为异步函数
- 优先从云端获取清单，失败则降级到本地
- 保存时同时更新云端和本地

### 步骤 3: 修改 AppContext.tsx，处理异步清单
在 `src/store/AppContext.tsx` 中：
- 添加 `listLoading` 状态
- 修改 `useEffect` 中加载清单的逻辑为异步
- 所有修改清单的方法保持不变，但内部调用异步存储

## 数据结构

清单在云端的存储结构：
```json
{
  "id": 1,
  "items": [
    { 
      "id": 1, 
      "productId": 1, 
      "name": "香蕉", 
      "image": "...", 
      "spec": "500g", 
      "price": 3.5, 
      "costPrice": 1, 
      "quantity": 100 
    }
  ],
  "totalSales": 0,
  "totalProfit": 0,
  "date": "2026-04-08"
}
```

但我们可以简化，只存储 items 数组，或者使用第一个记录。

## 依赖和注意事项

1. 保持 API 接口不变，只修改内部实现
2. 清单数据较小，可以使用一个记录存储整个清单
3. 需要处理云端调用失败的降级方案
4. 确保与现有代码兼容

## 风险处理

1. 如果云端调用失败，降级到本地存储
2. 首次加载时创建清单集合
3. 确保现有功能不受影响
