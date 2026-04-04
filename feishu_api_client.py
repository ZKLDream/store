#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json

class FeishuAPIClient:
    def __init__(self, app_id, app_secret):
        self.app_id = app_id
        self.app_secret = app_secret
        self.base_url = "https://open.feishu.cn"
        self.tenant_access_token = None
    
    def get_tenant_access_token(self):
        """获取 tenant_access_token"""
        url = f"{self.base_url}/open-apis/auth/v3/tenant_access_token/internal"
        payload = {
            "app_id": self.app_id,
            "app_secret": self.app_secret
        }
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get("code") == 0:
            self.tenant_access_token = data.get("tenant_access_token")
            return self.tenant_access_token
        else:
            raise Exception(f"获取token失败: {data}")
    
    def create_document(self, title="水果价格管理表", folder_token=None):
        """创建飞书文档"""
        if not self.tenant_access_token:
            self.get_tenant_access_token()
        
        url = f"{self.base_url}/open-apis/docx/v1/documents"
        headers = {
            "Authorization": f"Bearer {self.tenant_access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "title": title
        }
        
        if folder_token:
            payload["folder_token"] = folder_token
        
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()
        
        if data.get("code") == 0:
            document = data.get("data", {}).get("document")
            document_id = document.get("document_id")
            document_url = f"https://feishu.cn/docx/{document_id}"
            return {
                "document_id": document_id,
                "document_url": document_url,
                "title": document.get("title")
            }
        else:
            raise Exception(f"创建文档失败: {data}")
    
    def add_block(self, document_id, parent_block_id, children, index=0):
        """添加文档块"""
        if not self.tenant_access_token:
            self.get_tenant_access_token()
        
        url = f"{self.base_url}/open-apis/docx/v1/documents/{document_id}/blocks/{parent_block_id}/children"
        headers = {
            "Authorization": f"Bearer {self.tenant_access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "index": index,
            "children": children
        }
        
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()
        
        if data.get("code") == 0:
            return data.get("data")
        else:
            raise Exception(f"添加块失败: {data}")
    
    def set_document_permission(self, token, doc_type="docx"):
        """设置文档权限为组织内可访问"""
        if not self.tenant_access_token:
            self.get_tenant_access_token()
        
        url = f"{self.base_url}/open-apis/drive/v1/permissions/{token}/public"
        headers = {
            "Authorization": f"Bearer {self.tenant_access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "external_access": True,
            "security_entity": "anyone_can_view",
            "comment_entity": "anyone_can_view",
            "share_entity": "anyone",
            "link_share_entity": "tenant_readable",
            "invite_external": True
        }
        
        params = {"type": doc_type}
        
        response = requests.patch(url, headers=headers, json=payload, params=params)
        data = response.json()
        
        if data.get("code") == 0:
            return data.get("data")
        else:
            raise Exception(f"设置权限失败: {data}")
