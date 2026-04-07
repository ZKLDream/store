#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from feishu_api_client import FeishuAPIClient
import os

# 飞书应用凭证 - 请从环境变量或 .env 文件读取
APP_ID = os.getenv("FEISHU_APP_ID", "your_app_id_here")
APP_SECRET = os.getenv("FEISHU_APP_SECRET", "your_app_secret_here")

# 文档ID - 请从环境变量或配置文件读取
DOCUMENT_ID = os.getenv("FEISHU_DOCUMENT_ID", "your_document_id_here")

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
