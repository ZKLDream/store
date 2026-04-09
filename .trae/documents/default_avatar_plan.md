# 添加好看的默认头像

## 需求分析
用户希望个人页头像不是emoji，而是一个好看的图片头像。

## 当前代码结构
- storage.ts中DEFAULT_USER_PROFILE.avatar默认是'🍎'
- profile页面中如果没有userAvatar，显示emoji占位符

## 实现方案

### 1. 修改默认头像
- 在storage.ts中，将DEFAULT_USER_PROFILE.avatar改为一个好看的水果相关图片URL
- 使用text_to_image API生成一个好看的水果店老板头像
- 头像应该包含水果元素，与水果店主题相符

### 2. 更新Profile页面逻辑
- 保持现有的逻辑不变
- 如果有头像URL就显示，没有才显示emoji占位符

## 文件修改清单
1. `src/utils/storage.ts` - 修改DEFAULT_USER_PROFILE.avatar

## 实现步骤
1. 修改storage.ts中的默认头像为好看的图片URL
2. 构建项目确保没有错误
