#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from feishu_api_client import FeishuAPIClient

# 飞书应用凭证
APP_ID = "cli_a9253f2aaa225bd3"
APP_SECRET = "n84zYzU6RAfjpu6EOtZ0Fg3hTW84BE7x"

# 刚才创建的文档ID
DOCUMENT_ID = "YBZqdRURjoBVTQxNPWFc2j9pnWh"

def main():
    print("🔐 开始设置文档权限...")
    
    try:
        # 1. 初始化API客户端
        client = FeishuAPIClient(APP_ID, APP_SECRET)
        
        # 2. 获取tenant_access_token
        print("📋 获取访问凭证...")
        token = client.get_tenant_access_token()
        print(f"✅ Token获取成功")
        
        # 3. 设置文档权限
        print(f"🔐 设置文档权限 (ID: {DOCUMENT_ID})...")
        result = client.set_document_permission(
            token=DOCUMENT_ID,
            doc_type="docx"
        )
        
        print("✅ 权限设置成功！")
        print(f"\n📎 文档链接: https://feishu.cn/docx/{DOCUMENT_ID}")
        print("\n🎉 现在组织内的人都可以访问这个文档了！")
        
    except Exception as e:
        print(f"❌ 错误: {e}")

if __name__ == "__main__":
    main()
