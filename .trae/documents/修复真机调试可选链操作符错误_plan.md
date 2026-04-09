
# 修复真机调试可选链操作符错误

## 问题分析
真机调试时报错：`SyntaxError: Unexpected token .`，原因是使用了可选链操作符 `?.`，这在真机环境中不被支持。

## 影响文件
- `agent-ui/index.js` - 包含 5 处可选链操作符

## 修复方案
将所有可选链操作符 `?.` 替换为传统的条件判断写法：

### 需要修改的位置：
1. 第 255 行：`this.data.bot.voiceSettings?.enable`
2. 第 337 行：`this.data.bot.voiceSettings?.inputType`
3. 第 399 行：`this.data.bot.voiceSettings?.enable`
4. 第 2022 行：`this.data.bot.voiceSettings?.outputType`
5. 第 2082 行：`this.data.bot.voiceSettings?.enable`

### 替换规则：
- `obj?.prop` → `obj &amp;&amp; obj.prop`
- `obj?.prop?.subProp` → `obj &amp;&amp; obj.prop &amp;&amp; obj.prop.subProp`

## 风险评估
- 低风险：只做语法替换，不改变逻辑
- 确保替换后的代码功能完全一致
