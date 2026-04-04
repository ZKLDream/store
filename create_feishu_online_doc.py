#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from feishu_api_client import FeishuAPIClient

# 飞书应用凭证
APP_ID = "cli_a9253f2aaa225bd3"
APP_SECRET = "n84zYzU6RAfjpu6EOtZ0Fg3hTW84BE7x"

# 读取本地Markdown文件内容
with open("/Users/bytedance/Desktop/1/1/testStore/水果价格表_飞书文档.md", "r", encoding="utf-8") as f:
    markdown_content = f.read()

def main():
    print("🚀 开始创建飞书在线文档...")
    
    try:
        # 1. 初始化API客户端
        client = FeishuAPIClient(APP_ID, APP_SECRET)
        
        # 2. 获取tenant_access_token
        print("📋 获取访问凭证...")
        token = client.get_tenant_access_token()
        print(f"✅ Token获取成功")
        
        # 3. 创建文档
        print("📄 创建文档...")
        doc_info = client.create_document(title="🍎 水果价格管理表")
        document_id = doc_info["document_id"]
        document_url = doc_info["document_url"]
        
        print(f"✅ 文档创建成功！")
        print(f"\n📎 文档链接: {document_url}")
        print(f"📋 文档ID: {document_id}")
        
        # 4. 添加文档内容（文本块）
        print("\n📝 添加文档内容...")
        
        # 将Markdown内容拆分成段落
        lines = markdown_content.split("\n")
        
        # 构建文本块
        children = []
        for line in lines:
            if line.strip():
                children.append({
                    "block_type": 2,
                    "text": {
                        "elements": [
                            {
                                "text_run": {
                                    "content": line
                                }
                            }
                        ]
                    }
                })
        
        # 添加内容到文档
        if children:
            client.add_block(
                document_id=document_id,
                parent_block_id=document_id,
                children=children
            )
            print("✅ 内容添加成功！")
        
        print("\n🎉 完成！请使用上面的链接访问您的在线文档。")
        print("💡 提示：您可能需要先在飞书开放平台为应用配置文档权限")
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        print("\n💡 可能的原因：")
        print("1. 应用没有配置文档创建权限")
        print("2. App ID 或 App Secret 不正确")
        print("3. 需要在飞书开放平台发布应用")

if __name__ == "__main__":
    main()
