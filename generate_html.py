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

# 利润排行
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

# 生成HTML
html_content = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍎 水果价格管理表</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 40px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .stat-card .number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-card .label {
            color: #666;
            margin-top: 8px;
        }
        
        .top-profit {
            padding: 30px;
            background: #fff3cd;
            margin: 0 30px;
            border-radius: 12px;
        }
        
        .top-profit h2 {
            color: #856404;
            margin-bottom: 20px;
        }
        
        .top-profit table {
            width: 100%;
        }
        
        .category-section {
            padding: 30px;
            border-bottom: 1px solid #eee;
        }
        
        .category-section:last-child {
            border-bottom: none;
        }
        
        .category-title {
            font-size: 1.5em;
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .profit-positive {
            color: #28a745;
            font-weight: bold;
        }
        
        .price {
            font-weight: 500;
        }
        
        .footer {
            padding: 30px;
            text-align: center;
            color: #666;
            background: #f8f9fa;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            
            table {
                font-size: 0.9em;
            }
            
            th, td {
                padding: 8px 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍎 水果价格管理表</h1>
            <p>本文档整理了水果店各水果的成本价、不同时段售价及利润信息</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="number">""" + str(total_fruits) + """</div>
                <div class="label">水果总数</div>
            </div>
            <div class="stat-card">
                <div class="number">¥""" + f"{avg_profit8:.2f}" + """</div>
                <div class="label">平均利润（8点）</div>
            </div>
            <div class="stat-card">
                <div class="number">¥""" + f"{avg_profit12:.2f}" + """</div>
                <div class="label">平均利润（12点）</div>
            </div>
            <div class="stat-card">
                <div class="number">¥""" + f"{avg_profit18:.2f}" + """</div>
                <div class="label">平均利润（18点）</div>
            </div>
        </div>
        
        <div class="top-profit" style="margin-top: 30px;">
            <h2>🏆 利润 TOP 5</h2>
            <table>
                <thead>
                    <tr>
                        <th>排名</th>
                        <th>水果名称</th>
                        <th>平均利润</th>
                        <th>8点利润</th>
                        <th>12点利润</th>
                        <th>18点利润</th>
                    </tr>
                </thead>
                <tbody>
"""

for idx, fruit in enumerate(top5_profit, 1):
    avg_profit = (fruit['profit8'] + fruit['profit12'] + fruit['profit18']) / 3
    html_content += f"""
                    <tr>
                        <td><strong>{idx}</strong></td>
                        <td>{fruit['name']}</td>
                        <td class="profit-positive">¥{avg_profit:.2f}</td>
                        <td class="profit-positive">¥{fruit['profit8']:.2f}</td>
                        <td class="profit-positive">¥{fruit['profit12']:.2f}</td>
                        <td class="profit-positive">¥{fruit['profit18']:.2f}</td>
                    </tr>
"""

html_content += """
                </tbody>
            </table>
        </div>
"""

for category, fruits in fruit_by_category.items():
    emoji = category_emoji.get(category, '🍎')
    html_content += f"""
        <div class="category-section">
            <h2 class="category-title">{emoji} {category}</h2>
            <table>
                <thead>
                    <tr>
                        <th>水果名称</th>
                        <th>成本价</th>
                        <th>8点价格</th>
                        <th>12点价格</th>
                        <th>18点价格</th>
                        <th>8点利润</th>
                        <th>12点利润</th>
                        <th>18点利润</th>
                    </tr>
                </thead>
                <tbody>
"""
    
    for fruit in fruits:
        html_content += f"""
                    <tr>
                        <td><strong>{fruit['name']}</strong></td>
                        <td>¥{fruit['cost']:.1f}</td>
                        <td class="price">¥{fruit['price8']:.1f}</td>
                        <td class="price">¥{fruit['price12']:.1f}</td>
                        <td class="price">¥{fruit['price18']:.1f}</td>
                        <td class="profit-positive">¥{fruit['profit8']:.1f}</td>
                        <td class="profit-positive">¥{fruit['profit12']:.1f}</td>
                        <td class="profit-positive">¥{fruit['profit18']:.1f}</td>
                    </tr>
"""
    
    html_content += """
                </tbody>
            </table>
        </div>
"""

html_content += """
        <div class="footer">
            <p>📅 文档生成时间：2026-04-04</p>
            <p style="margin-top: 10px; font-size: 0.9em;">💡 使用说明：成本价默认¥1.0，利润=售价-成本价</p>
        </div>
    </div>
</body>
</html>
"""

# 写入HTML文件
html_file = "/Users/bytedance/Desktop/1/1/testStore/水果价格表.html"
with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"✅ HTML网页已创建: {html_file}")
print("\n🎉 现在您可以直接双击这个HTML文件在浏览器中打开！")
print("📋 这个文件也可以发给别人查看，或者上传到任何托管平台生成在线链接")
