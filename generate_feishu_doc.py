#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
from collections import defaultdict

# 读取CSV文件
csv_file = "/Users/bytedance/Desktop/1/1/testStore/水果价格表.csv"

# 按分类分组存储数据
fruit_by_category = defaultdict(list)
all_fruits = []

with open(csv_file, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        fruit = {
            'category': row['分类'],
            'name': row['水果名称'],
            'cost': float(row['成本价']),
            'price8': float(row['早上8点价格']),
            'price12': float(row['中午12点价格']),
            'price18': float(row['下午6点价格']),
            'profit8': float(row['早上8点利润']),
            'profit12': float(row['中午12点利润']),
            'profit18': float(row['下午6点利润']),
        }
        fruit_by_category[fruit['category']].append(fruit)
        all_fruits.append(fruit)

# 计算统计数据
total_fruits = len(all_fruits)
avg_profit8 = sum(f['profit8'] for f in all_fruits) / total_fruits
avg_profit12 = sum(f['profit12'] for f in all_fruits) / total_fruits
avg_profit18 = sum(f['profit18'] for f in all_fruits) / total_fruits

# 利润排行（按平均利润）
sorted_by_profit = sorted(all_fruits, key=lambda x: (x['profit8'] + x['profit12'] + x['profit18']) / 3, reverse=True)
top5_profit = sorted_by_profit[:5]

# 分类与emoji对应
category_emoji = {
    '常见水果': '🍌',
    '瓜类': '🍉',
    '热带水果': '🥭',
    '葡萄提子类': '🍇',
    '小果/盒装': '🫐',
    '其他': '🍍'
}

# 生成Markdown文档
md_file = "/Users/bytedance/Desktop/1/1/testStore/水果价格表_飞书文档.md"

with open(md_file, 'w', encoding='utf-8') as f:
    f.write("# 🍎 水果价格管理表\n\n")
    f.write("> 📋 本文档整理了水果店各水果的成本价、不同时段售价及利润信息，方便查看和管理。\n\n")
    f.write("---\n\n")
    
    # 数据概览
    f.write("## 📊 数据概览\n\n")
    f.write("| 指标 | 数值 |\n")
    f.write("|------|------|\n")
    f.write(f"| 水果总数 | {total_fruits} 种 |\n")
    f.write(f"| 平均利润（8点） | ¥{avg_profit8:.2f} |\n")
    f.write(f"| 平均利润（12点） | ¥{avg_profit12:.2f} |\n")
    f.write(f"| 平均利润（18点） | ¥{avg_profit18:.2f} |\n\n")
    
    # 利润排行
    f.write("### 🏆 利润 TOP 5\n\n")
    f.write("| 排名 | 水果名称 | 平均利润 | 8点利润 | 12点利润 | 18点利润 |\n")
    f.write("|------|---------|---------|--------|---------|---------|\n")
    for idx, fruit in enumerate(top5_profit, 1):
        avg_profit = (fruit['profit8'] + fruit['profit12'] + fruit['profit18']) / 3
        f.write(f"| {idx} | {fruit['name']} | ¥{avg_profit:.2f} | ¥{fruit['profit8']:.2f} | ¥{fruit['profit12']:.2f} | ¥{fruit['profit18']:.2f} |\n")
    f.write("\n")
    
    f.write("---\n\n")
    
    # 按分类展示
    for category, fruits in fruit_by_category.items():
        emoji = category_emoji.get(category, '🍎')
        f.write(f"## {emoji} {category}\n\n")
        
        f.write("| 水果名称 | 成本价 | 8点价格 | 12点价格 | 18点价格 | 8点利润 | 12点利润 | 18点利润 |\n")
        f.write("|---------|-------|--------|---------|---------|--------|---------|---------|\n")
        
        for fruit in fruits:
            f.write(f"| {fruit['name']} | ¥{fruit['cost']:.1f} | ¥{fruit['price8']:.1f} | ¥{fruit['price12']:.1f} | ¥{fruit['price18']:.1f} | ¥{fruit['profit8']:.1f} | ¥{fruit['profit12']:.1f} | ¥{fruit['profit18']:.1f} |\n")
        
        f.write("\n")
    
    # 使用说明
    f.write("---\n\n")
    f.write("## 📝 使用说明\n\n")
    f.write("1. **成本价**：水果的进货成本，当前默认设置为 ¥1.0\n")
    f.write("2. **时段价格**：\n")
    f.write("   - 早上8点价格：早市售价\n")
    f.write("   - 中午12点价格：午市售价\n")
    f.write("   - 下午6点价格：晚市售价\n")
    f.write("3. **利润计算**：利润 = 售价 - 成本价\n")
    f.write("4. **调整价格**：如需修改价格，请编辑原CSV文件后重新生成本文档\n\n")
    
    f.write("---\n\n")
    f.write("*📅 文档生成时间：2026-04-04*\n")

print(f"✅ 飞书文档已创建: {md_file}")
print("\n📋 您可以：")
print("1. 直接在飞书中导入此Markdown文件")
print("2. 或者复制内容直接粘贴到飞书文档")
print("3. 文档包含美观的表格、emoji和统计分析")
