# 修改上传按钮样式计划

## 需求分析

* 上传按钮样式和结算按钮大小一样

* 上传按钮换个背景颜色

## 当前状态分析

1. **上传按钮** (`src/pages/cart/index.module.scss:54-75`)

   * 高度: 96rpx

   * 背景: $color-bg-page (浅灰色)

   * 有边框

   * 文字颜色: $color-text-primary

2. **结算按钮** (`src/pages/cart/index.module.scss:100-115`)

   * 高度: 96rpx

   * 背景: 渐变紫色 (linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%))

   * 无边框

   * 文字颜色: $color-text-white

## 修改方案

1. **确认大小**：两个按钮高度已经都是 96rpx，宽度也要一致，不要一个宽一个窄
2. **更换上传按钮背景色**：使用绿色渐变背景（$color-success 相关），与结算按钮形成区分
3. **统一样式**：移除上传按钮的边框，文字改为白色

## 修改文件

* `src/pages/cart/index.module.scss`

## 具体修改

修改 `.uploadBtn` 样式类，使其：

* 背景使用绿色渐变

* 文字颜色改为白色

* 移除边框

* 保持高度 96rpx 与结算按钮一致

