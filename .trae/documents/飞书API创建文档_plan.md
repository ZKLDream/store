# 飞书API创建在线文档计划

## 1. 理解需求
用户希望通过飞书开放平台API自动创建在线飞书文档，而不是本地Markdown文件。

## 2. 前置要求
需要用户提供飞书应用的认证信息：
- App ID（飞书应用 ID）
- App Secret（飞书应用密钥）

## 3. 需要创建的文件
- **新建** `feishu_api_client.py` - 飞书API客户端封装
- **新建** `create_online_doc.py` - 创建在线文档的主脚本
- **新建** `.env.example` - 环境变量示例文件

## 4. 实现步骤
1. 封装飞书API认证流程（获取 tenant_access_token）
2. 封装创建飞书文档的API调用
3. 将本地Markdown内容上传到飞书
4. 返回文档链接给用户

## 5. 飞书API流程
```
1. 获取 tenant_access_token
   POST /open-apis/auth/v3/tenant_access_token/internal
   
2. 创建飞书文档（多维表格或云文档）
   POST /open-apis/docx/v1/documents
   
3. 写入文档内容
   使用区块API添加内容
```

## 6. 考虑事项
- 需要用户先在飞书开放平台创建应用
- 需要配置应用权限（文档创建权限）
- 需要安全存储 App Secret，不要提交到代码仓库
- API调用有频率限制

## 7. 风险处理
- 如果API调用失败，提供清晰的错误信息
- 提供回退方案（手动粘贴Markdown内容）
