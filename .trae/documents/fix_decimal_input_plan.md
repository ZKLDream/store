# 修复商品管理弹窗输入框小数输入问题

## 问题描述
商品管理弹出的编辑弹窗中，售价和成本价输入框不能流畅输入小数点，体验不如下单时的清单输入框。

## 根因分析
在 `src/pages/product-management/index.tsx` 中：
1. 输入框使用 `type="digit"`（这个是正确的，微信小程序支持小数点）
2. 但是在 `handleInputChange` 函数中，立即将输入值转换为 `Number(value)`
3. 当用户只输入小数点时，`Number('.')` 会变成 `0`，导致输入体验不流畅

## 解决方案
参考 CartItem 和 ProductCard 的实现方式，修改商品管理页面的输入处理逻辑：

1. 将价格和成本价的输入值先保存为字符串状态
2. 在保存时再转换为数字
3. 这样可以支持流畅的小数点输入体验

## 修改文件
- `src/pages/product-management/index.tsx`

## 具体修改
1. 修改 `handleInputChange` 函数，对于 price 和 costPrice 字段，先保存为字符串
2. 修改输入框的 value 属性，直接使用字符串值
3. 在保存时（handleSave）再将字符串转换为数字
