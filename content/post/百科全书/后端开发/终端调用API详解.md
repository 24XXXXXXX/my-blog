---
title: "终端调用 API 详解"
description: "详细介绍如何在 Linux、Windows CMD 和 PowerShell 中通过终端调用 REST API，包括 GET、POST、PUT、DELETE 等各种 HTTP 方法的使用"
keywords: "API,REST,curl,PowerShell,HTTP,JSON,认证,请求头"

date: 2026-03-27T15:00:00+08:00
lastmod: 2026-03-27T15:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - API
  - REST
  - HTTP
  - curl
  - PowerShell
  - Linux
  - Windows
---

本文详细介绍如何在 Linux、Windows CMD 和 PowerShell 中通过终端调用 REST API，包括各种 HTTP 方法、认证方式、请求头设置和响应处理。

<!--more-->

## 一、API 基础知识

### 1.1 什么是 API

API（Application Programming Interface，应用程序编程接口）是不同软件系统之间进行通信的接口。REST API 是基于 HTTP 协议的 API 设计风格。

### 1.2 HTTP 方法

```
GET     - 获取资源（查询数据）
POST    - 创建资源（提交数据）
PUT     - 更新资源（完整更新）
PATCH   - 部分更新资源
DELETE  - 删除资源
HEAD    - 获取响应头（不返回内容）
OPTIONS - 获取支持的方法
```

### 1.3 HTTP 状态码

```
2xx - 成功
  200 OK              - 请求成功
  201 Created         - 创建成功
  204 No Content      - 成功但无返回内容

3xx - 重定向
  301 Moved Permanently  - 永久重定向
  302 Found             - 临时重定向

4xx - 客户端错误
  400 Bad Request       - 请求错误
  401 Unauthorized      - 未授权
  403 Forbidden         - 禁止访问
  404 Not Found         - 资源不存在

5xx - 服务器错误
  500 Internal Server Error  - 服务器内部错误
  502 Bad Gateway           - 网关错误
  503 Service Unavailable   - 服务不可用
```

### 1.4 常见数据格式

```json
// JSON（最常用）
{
  "name": "John",
  "age": 25,
  "email": "john@example.com"
}

// XML
<?xml version="1.0"?>
<user>
  <name>John</name>
  <age>25</age>
</user>

// Form Data（表单数据）
name=John&age=25&email=john@example.com
```

---

## 二、Linux 中调用 API（使用 curl）

### 2.1 GET 请求

#### 基本 GET 请求

```bash
# 最简单的 GET 请求
curl https://api.example.com/users
# curl: 命令名称
# https://api.example.com/users: API 端点 URL

# 带查询参数的 GET 请求
curl "https://api.example.com/users?page=1&limit=10"
# ?page=1&limit=10: 查询参数
# page=1: 第 1 页
# limit=10: 每页 10 条

# 使用 -G 和 --data-urlencode（自动编码）
curl -G https://api.example.com/search \
  --data-urlencode "q=hello world" \
  --data-urlencode "type=user"
# -G: 使用 GET 方法
# --data-urlencode: URL 编码参数
# "q=hello world": 搜索关键词（空格会被编码为 %20）
```

#### 显示详细信息

```bash
# 显示响应头和内容
curl -i https://api.example.com/users
# -i: 包含响应头（include）

# 只显示响应头
curl -I https://api.example.com/users
# -I: 只显示响应头（HEAD 请求）

# 显示详细的请求和响应过程
curl -v https://api.example.com/users
# -v: 详细模式（verbose）
# 显示：请求头、响应头、SSL 握手等

# 显示更详细的调试信息
curl --trace output.txt https://api.example.com/users
# --trace: 保存详细日志到文件
# output.txt: 日志文件名
```

#### 格式化 JSON 响应

```bash
# 使用 jq 格式化 JSON
curl https://api.example.com/users | jq '.'
# |: 管道，将 curl 输出传给 jq
# jq: JSON 处理工具
# '.': 格式化整个 JSON

# 提取特定字段
curl https://api.example.com/users | jq '.data[0].name'
# .data[0].name: 提取第一个用户的名字

# 使用 python 格式化（如果没有 jq）
curl https://api.example.com/users | python -m json.tool
# python -m json.tool: Python 的 JSON 格式化工具
```

### 2.2 POST 请求

#### 发送 JSON 数据

```bash
# 基本 POST 请求（发送 JSON）
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","age":25,"email":"john@example.com"}'
# -X POST: 指定 HTTP 方法为 POST
# -H "Content-Type: application/json": 设置请求头
#   Content-Type: 内容类型
#   application/json: JSON 格式
# -d '{"name":"John",...}': 发送的数据（data）
#   单引号内是 JSON 字符串

# 从文件读取 JSON 数据
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @user.json
# @user.json: 从文件读取数据
# @: 表示从文件读取

# 多行 JSON（使用 heredoc）
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "name": "John",
  "age": 25,
  "email": "john@example.com",
  "address": {
    "city": "New York",
    "country": "USA"
  }
}
EOF
# @-: 从标准输入读取
# << 'EOF': heredoc 语法
# EOF: 结束标记
```

#### 发送表单数据

```bash
# 发送 URL 编码的表单数据
curl -X POST https://api.example.com/login \
  -d "username=john" \
  -d "password=secret123"
# -d "username=john": 表单字段
# 多个 -d 会自动用 & 连接
# Content-Type 自动设置为 application/x-www-form-urlencoded

# 或使用一行
curl -X POST https://api.example.com/login \
  -d "username=john&password=secret123"

# 发送 multipart/form-data（文件上传）
curl -X POST https://api.example.com/upload \
  -F "file=@document.pdf" \
  -F "description=My Document" \
  -F "category=work"
# -F: 表单字段（form）
# file=@document.pdf: 上传文件
# @document.pdf: 文件路径
# description=My Document: 文本字段
```

### 2.3 PUT 请求

```bash
# 更新资源（完整更新）
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated","age":26,"email":"john.new@example.com"}'
# -X PUT: PUT 方法
# /users/123: 资源 ID
# 完整的资源数据

# 从文件更新
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d @updated_user.json
```

### 2.4 PATCH 请求

```bash
# 部分更新资源
curl -X PATCH https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"age":26}'
# -X PATCH: PATCH 方法
# 只发送需要更新的字段

# 更新多个字段
curl -X PATCH https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"age":26,"email":"newemail@example.com"}'
```

### 2.5 DELETE 请求

```bash
# 删除资源
curl -X DELETE https://api.example.com/users/123
# -X DELETE: DELETE 方法
# /users/123: 要删除的资源 ID

# 带认证的删除
curl -X DELETE https://api.example.com/users/123 \
  -H "Authorization: Bearer token123"

# 删除并显示响应
curl -X DELETE https://api.example.com/users/123 -v
# -v: 显示详细信息
```

### 2.6 设置请求头

```bash
# 单个请求头
curl https://api.example.com/users \
  -H "Authorization: Bearer token123"
# -H: 添加请求头（Header）
# "Authorization: Bearer token123": 认证令牌

# 多个请求头
curl https://api.example.com/users \
  -H "Authorization: Bearer token123" \
  -H "Accept: application/json" \
  -H "User-Agent: MyApp/1.0" \
  -H "X-Custom-Header: value"
# Accept: 接受的响应格式
# User-Agent: 客户端标识
# X-Custom-Header: 自定义头部

# 常用请求头
curl https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Accept-Language: zh-CN,en" \
  -H "Cache-Control: no-cache"
# Content-Type: 请求内容类型
# Accept-Language: 接受的语言
# Cache-Control: 缓存控制
```

### 2.7 认证方式

#### Bearer Token 认证

```bash
# 使用 Bearer Token
curl https://api.example.com/protected \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# Bearer: 认证类型
# eyJhbGci...: JWT 令牌

# 从环境变量读取 Token
export API_TOKEN="your_token_here"
curl https://api.example.com/protected \
  -H "Authorization: Bearer $API_TOKEN"
# $API_TOKEN: 环境变量
```

#### Basic 认证

```bash
# 使用 -u 参数
curl -u username:password https://api.example.com/protected
# -u: 用户认证（user）
# username:password: 用户名和密码
# 自动编码为 Base64 并添加到 Authorization 头

# 手动设置 Basic 认证头
curl https://api.example.com/protected \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)"
# echo -n: 不输出换行符
# base64: Base64 编码
# $(): 命令替换
```

#### API Key 认证

```bash
# 在请求头中传递 API Key
curl https://api.example.com/data \
  -H "X-API-Key: your_api_key_here"
# X-API-Key: 自定义头部名称（根据 API 文档）

# 在查询参数中传递
curl "https://api.example.com/data?api_key=your_api_key_here"
# api_key: 查询参数名称
```

#### OAuth 2.0

```bash
# 获取访问令牌
curl -X POST https://oauth.example.com/token \
  -d "grant_type=client_credentials" \
  -d "client_id=your_client_id" \
  -d "client_secret=your_client_secret"
# grant_type: 授权类型
# client_credentials: 客户端凭证模式

# 使用访问令牌
ACCESS_TOKEN="obtained_access_token"
curl https://api.example.com/protected \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 2.8 处理响应

```bash
# 保存响应到文件
curl https://api.example.com/users -o response.json
# -o response.json: 输出到文件（output）

# 只保存响应体（不显示进度）
curl -s https://api.example.com/users > response.json
# -s: 静默模式（silent）
# >: 重定向到文件

# 保存响应头到文件
curl -D headers.txt https://api.example.com/users
# -D headers.txt: 保存响应头（dump header）

# 获取 HTTP 状态码
curl -s -o /dev/null -w "%{http_code}" https://api.example.com/users
# -o /dev/null: 丢弃响应体
# -w "%{http_code}": 输出状态码（write-out）
# %{http_code}: 状态码变量

# 获取响应时间
curl -s -o /dev/null -w "Time: %{time_total}s\n" https://api.example.com/users
# %{time_total}: 总时间

# 提取 JSON 字段
curl -s https://api.example.com/users | jq -r '.data[0].name'
# -r: 原始输出（不带引号）
# .data[0].name: JSON 路径
```

---

## 三、Windows CMD 中调用 API

### 3.1 使用 PowerShell 命令

CMD 本身不支持 HTTP 请求，需要调用 PowerShell。

```cmd
REM GET 请求
powershell -Command "Invoke-RestMethod -Uri 'https://api.example.com/users'"
REM powershell: 调用 PowerShell
REM -Command: 执行命令
REM "...": PowerShell 命令（用引号包裹）
REM Invoke-RestMethod: PowerShell 的 REST API 命令

REM POST 请求（发送 JSON）
powershell -Command "$body = @{name='John';age=25} | ConvertTo-Json; Invoke-RestMethod -Uri 'https://api.example.com/users' -Method POST -Body $body -ContentType 'application/json'"
REM @{name='John';age=25}: PowerShell 哈希表
REM ConvertTo-Json: 转换为 JSON
REM -Method POST: POST 方法
REM -Body $body: 请求体
REM -ContentType: 内容类型

REM 保存响应到文件
powershell -Command "Invoke-RestMethod -Uri 'https://api.example.com/users' | ConvertTo-Json | Out-File response.json"
REM Out-File: 输出到文件
```

### 3.2 使用 curl（Windows 10 1803+）

Windows 10 1803 及以上版本内置了 curl。

```cmd
REM GET 请求
curl https://api.example.com/users

REM POST 请求
curl -X POST https://api.example.com/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John\",\"age\":25}"
REM ^: CMD 的行继续符
REM \": 转义双引号

REM 使用文件
curl -X POST https://api.example.com/users ^
  -H "Content-Type: application/json" ^
  -d @user.json

REM 带认证
curl https://api.example.com/protected ^
  -H "Authorization: Bearer token123"
```

---

## 四、Windows PowerShell 中调用 API

### 4.1 Invoke-RestMethod（推荐）

Invoke-RestMethod 自动解析 JSON/XML 响应。

#### GET 请求

```powershell
# 基本 GET 请求
Invoke-RestMethod -Uri "https://api.example.com/users"
# Invoke-RestMethod: 命令名称
# -Uri: 目标 URL
# 自动解析 JSON 并返回 PowerShell 对象

# 简写形式
irm "https://api.example.com/users"
# irm: Invoke-RestMethod 的别名

# 带查询参数
$params = @{
    page = 1
    limit = 10
    sort = "name"
}
$query = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"
Invoke-RestMethod -Uri "https://api.example.com/users?$query"
# @{}: 哈希表
# GetEnumerator(): 获取枚举器
# ForEach-Object: 遍历
# -join "&": 用 & 连接

# 或使用 -Body（自动转换为查询参数）
$params = @{
    page = 1
    limit = 10
}
Invoke-RestMethod -Uri "https://api.example.com/users" -Method GET -Body $params
# -Body: 查询参数（GET 请求时）
```

#### POST 请求

```powershell
# 发送 JSON 数据
$body = @{
    name = "John"
    age = 25
    email = "john@example.com"
} | ConvertTo-Json
# @{}: 哈希表
# ConvertTo-Json: 转换为 JSON 字符串

Invoke-RestMethod -Uri "https://api.example.com/users" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
# `: PowerShell 的行继续符
# -Method POST: POST 方法
# -Body: 请求体
# -ContentType: 内容类型

# 嵌套对象
$body = @{
    name = "John"
    age = 25
    address = @{
        city = "New York"
        country = "USA"
    }
    tags = @("developer", "admin")
} | ConvertTo-Json -Depth 10
# -Depth 10: JSON 深度（默认 2）
# @(): 数组

# 从文件读取
$body = Get-Content user.json -Raw
Invoke-RestMethod -Uri "https://api.example.com/users" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
# Get-Content: 读取文件
# -Raw: 作为单个字符串读取
```

#### PUT 和 PATCH 请求

```powershell
# PUT 请求（完整更新）
$body = @{
    name = "John Updated"
    age = 26
    email = "john.new@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.example.com/users/123" `
    -Method PUT `
    -Body $body `
    -ContentType "application/json"

# PATCH 请求（部分更新）
$body = @{
    age = 26
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.example.com/users/123" `
    -Method PATCH `
    -Body $body `
    -ContentType "application/json"
```

#### DELETE 请求

```powershell
# 删除资源
Invoke-RestMethod -Uri "https://api.example.com/users/123" -Method DELETE

# 带认证的删除
$headers = @{
    "Authorization" = "Bearer token123"
}
Invoke-RestMethod -Uri "https://api.example.com/users/123" `
    -Method DELETE `
    -Headers $headers
```

### 4.2 设置请求头

```powershell
# 单个请求头
$headers = @{
    "Authorization" = "Bearer token123"
}
Invoke-RestMethod -Uri "https://api.example.com/users" -Headers $headers
# @{}: 哈希表
# "Authorization" = "Bearer token123": 键值对

# 多个请求头
$headers = @{
    "Authorization" = "Bearer token123"
    "Accept" = "application/json"
    "User-Agent" = "MyApp/1.0"
    "X-Custom-Header" = "value"
}
Invoke-RestMethod -Uri "https://api.example.com/users" -Headers $headers

# 动态添加请求头
$headers = @{}
$headers.Add("Authorization", "Bearer token123")
$headers.Add("Accept", "application/json")
# Add(): 添加键值对方法
```

### 4.3 认证方式

#### Bearer Token 认证

```powershell
# 使用 Bearer Token
$token = "your_token_here"
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "https://api.example.com/protected" -Headers $headers

# 从环境变量读取
$env:API_TOKEN = "your_token_here"
$headers = @{
    "Authorization" = "Bearer $env:API_TOKEN"
}
Invoke-RestMethod -Uri "https://api.example.com/protected" -Headers $headers
```

#### Basic 认证

```powershell
# 使用 -Credential 参数
$credential = Get-Credential
Invoke-RestMethod -Uri "https://api.example.com/protected" -Credential $credential
# Get-Credential: 弹出对话框获取凭据

# 手动创建凭据
$username = "john"
$password = "secret123"
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)
Invoke-RestMethod -Uri "https://api.example.com/protected" -Credential $credential
# ConvertTo-SecureString: 转换为安全字符串
# -AsPlainText: 明文输入
# -Force: 强制执行
# PSCredential: 凭据对象

# 手动设置 Basic 认证头
$username = "john"
$password = "secret123"
$base64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    "Authorization" = "Basic $base64"
}
Invoke-RestMethod -Uri "https://api.example.com/protected" -Headers $headers
# [Convert]::ToBase64String: Base64 编码
# [Text.Encoding]::ASCII.GetBytes: 转换为字节数组
```

#### API Key 认证

```powershell
# 在请求头中传递
$headers = @{
    "X-API-Key" = "your_api_key_here"
}
Invoke-RestMethod -Uri "https://api.example.com/data" -Headers $headers

# 在查询参数中传递
$params = @{
    api_key = "your_api_key_here"
}
Invoke-RestMethod -Uri "https://api.example.com/data" -Body $params
```

### 4.4 处理响应

```powershell
# 获取响应对象
$response = Invoke-RestMethod -Uri "https://api.example.com/users"
# $response: PowerShell 对象（自动解析 JSON）

# 访问响应数据
$response.data
$response.data[0].name
$response.data | Where-Object { $_.age -gt 25 }
# Where-Object: 过滤对象
# $_.age -gt 25: 年龄大于 25

# 保存响应到文件
$response = Invoke-RestMethod -Uri "https://api.example.com/users"
$response | ConvertTo-Json -Depth 10 | Out-File response.json
# ConvertTo-Json: 转换为 JSON
# Out-File: 输出到文件

# 格式化输出
$response | ConvertTo-Json -Depth 10
# -Depth 10: JSON 深度

# 提取特定字段
$names = $response.data | Select-Object -ExpandProperty name
# Select-Object: 选择属性
# -ExpandProperty: 展开属性值
```

### 4.5 Invoke-WebRequest（更底层）

Invoke-WebRequest 提供更多控制，返回完整的响应对象。

```powershell
# 基本请求
$response = Invoke-WebRequest -Uri "https://api.example.com/users"
# 返回完整的响应对象

# 访问响应内容
$response.Content          # 响应体（字符串）
$response.StatusCode       # HTTP 状态码
$response.StatusDescription # 状态描述
$response.Headers          # 响应头
$response.RawContent       # 原始响应

# 解析 JSON 响应
$data = $response.Content | ConvertFrom-Json
# ConvertFrom-Json: 将 JSON 字符串转换为对象

# POST 请求
$body = @{
    name = "John"
    age = 25
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://api.example.com/users" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$data = $response.Content | ConvertFrom-Json

# 获取响应头
$response.Headers["Content-Type"]
$response.Headers["X-RateLimit-Remaining"]
```

### 4.6 错误处理

```powershell
# 使用 try-catch
try {
    $response = Invoke-RestMethod -Uri "https://api.example.com/users"
    Write-Host "Success: $($response.data.Count) users found"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}
# try: 尝试执行
# catch: 捕获异常
# $_.Exception: 异常对象
# Write-Host: 输出到控制台

# 检查状态码
$response = Invoke-WebRequest -Uri "https://api.example.com/users"
if ($response.StatusCode -eq 200) {
    Write-Host "Success"
    $data = $response.Content | ConvertFrom-Json
} else {
    Write-Host "Failed with status code: $($response.StatusCode)"
}

# 自定义错误处理
try {
    $response = Invoke-RestMethod -Uri "https://api.example.com/users" -ErrorAction Stop
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorMessage = $_.Exception.Message
    
    switch ($statusCode) {
        400 { Write-Host "Bad Request: $errorMessage" }
        401 { Write-Host "Unauthorized: Please check your credentials" }
        404 { Write-Host "Not Found: Resource does not exist" }
        500 { Write-Host "Server Error: $errorMessage" }
        default { Write-Host "Error $statusCode: $errorMessage" }
    }
}
# switch: 多条件判断
# -ErrorAction Stop: 遇到错误时停止
```

---

## 五、实用场景示例

### 5.1 用户管理 API

#### Linux (curl)

```bash
# 获取所有用户
curl https://api.example.com/users

# 获取单个用户
curl https://api.example.com/users/123

# 创建用户
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }'

# 更新用户
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{
    "name": "John Updated",
    "email": "john.new@example.com"
  }'

# 删除用户
curl -X DELETE https://api.example.com/users/123 \
  -H "Authorization: Bearer token123"

# 搜索用户
curl -G https://api.example.com/users/search \
  --data-urlencode "q=john" \
  --data-urlencode "role=admin" \
  -H "Authorization: Bearer token123"
```

#### PowerShell

```powershell
# 获取所有用户
$users = Invoke-RestMethod -Uri "https://api.example.com/users"

# 获取单个用户
$user = Invoke-RestMethod -Uri "https://api.example.com/users/123"

# 创建用户
$headers = @{
    "Authorization" = "Bearer token123"
}
$body = @{
    name = "John Doe"
    email = "john@example.com"
    role = "admin"
} | ConvertTo-Json

$newUser = Invoke-RestMethod -Uri "https://api.example.com/users" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"

# 更新用户
$body = @{
    name = "John Updated"
    email = "john.new@example.com"
} | ConvertTo-Json

$updatedUser = Invoke-RestMethod -Uri "https://api.example.com/users/123" `
    -Method PUT `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"

# 删除用户
Invoke-RestMethod -Uri "https://api.example.com/users/123" `
    -Method DELETE `
    -Headers $headers

# 搜索用户
$params = @{
    q = "john"
    role = "admin"
}
$results = Invoke-RestMethod -Uri "https://api.example.com/users/search" `
    -Body $params `
    -Headers $headers
```

### 5.2 文件上传

#### Linux (curl)

```bash
# 上传单个文件
curl -X POST https://api.example.com/upload \
  -H "Authorization: Bearer token123" \
  -F "file=@document.pdf" \
  -F "description=Important Document"
# -F: multipart/form-data
# file=@document.pdf: 文件字段

# 上传多个文件
curl -X POST https://api.example.com/upload \
  -H "Authorization: Bearer token123" \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  -F "files=@file3.pdf"

# 上传并指定文件名
curl -X POST https://api.example.com/upload \
  -F "file=@document.pdf;filename=renamed.pdf"
# ;filename=renamed.pdf: 指定上传后的文件名
```

#### PowerShell

```powershell
# 上传单个文件（PowerShell 7+）
$headers = @{
    "Authorization" = "Bearer token123"
}
$filePath = "C:\Documents\document.pdf"
$form = @{
    file = Get-Item -Path $filePath
    description = "Important Document"
}

Invoke-RestMethod -Uri "https://api.example.com/upload" `
    -Method POST `
    -Headers $headers `
    -Form $form
# -Form: multipart/form-data（PowerShell 7+）

# PowerShell 5.1 方法
$boundary = [System.Guid]::NewGuid().ToString()
$filePath = "C:\Documents\document.pdf"
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$fileName = [System.IO.Path]::GetFileName($filePath)

$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
    "Content-Type: application/pdf",
    "",
    [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
    "--$boundary--"
)
$body = $bodyLines -join "`r`n"

Invoke-RestMethod -Uri "https://api.example.com/upload" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer token123"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    } `
    -Body $body
```

### 5.3 分页查询

#### Linux (curl)

```bash
# 获取第一页
curl "https://api.example.com/users?page=1&limit=10"

# 循环获取所有页
page=1
while true; do
  response=$(curl -s "https://api.example.com/users?page=$page&limit=10")
  echo "$response" | jq '.'
  
  # 检查是否还有更多数据
  has_more=$(echo "$response" | jq -r '.has_more')
  if [ "$has_more" != "true" ]; then
    break
  fi
  
  page=$((page + 1))
done
# while true: 无限循环
# $((page + 1)): 算术运算
```

#### PowerShell

```powershell
# 获取第一页
$page = 1
$limit = 10
$allUsers = @()

do {
    $params = @{
        page = $page
        limit = $limit
    }
    
    $response = Invoke-RestMethod -Uri "https://api.example.com/users" -Body $params
    $allUsers += $response.data
    
    $page++
} while ($response.has_more)

Write-Host "Total users: $($allUsers.Count)"
# do...while: 循环
# +=: 追加到数组
```

### 5.4 批量操作

#### Linux (curl)

```bash
# 批量创建用户
cat users.json | jq -c '.[]' | while read user; do
  curl -X POST https://api.example.com/users \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer token123" \
    -d "$user"
  sleep 0.5  # 避免请求过快
done
# jq -c '.[]': 每行一个 JSON 对象
# sleep 0.5: 延迟 0.5 秒

# 批量删除用户
for id in 101 102 103 104 105; do
  curl -X DELETE https://api.example.com/users/$id \
    -H "Authorization: Bearer token123"
done
```

#### PowerShell

```powershell
# 批量创建用户
$users = Get-Content users.json | ConvertFrom-Json
$headers = @{
    "Authorization" = "Bearer token123"
}

foreach ($user in $users) {
    $body = $user | ConvertTo-Json
    try {
        $result = Invoke-RestMethod -Uri "https://api.example.com/users" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -ContentType "application/json"
        Write-Host "Created user: $($result.id)"
    } catch {
        Write-Host "Failed to create user: $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 500
}
# Start-Sleep: 延迟
# -Milliseconds 500: 500 毫秒

# 批量删除用户
$ids = 101..105
foreach ($id in $ids) {
    try {
        Invoke-RestMethod -Uri "https://api.example.com/users/$id" `
            -Method DELETE `
            -Headers $headers
        Write-Host "Deleted user: $id"
    } catch {
        Write-Host "Failed to delete user $id"
    }
}
```

### 5.5 OAuth 2.0 认证流程

#### Linux (curl)

```bash
# 1. 获取访问令牌
TOKEN_RESPONSE=$(curl -X POST https://oauth.example.com/token \
  -d "grant_type=client_credentials" \
  -d "client_id=your_client_id" \
  -d "client_secret=your_client_secret")

# 2. 提取访问令牌
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

# 3. 使用访问令牌调用 API
curl https://api.example.com/protected \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 完整脚本
#!/bin/bash
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
TOKEN_URL="https://oauth.example.com/token"
API_URL="https://api.example.com/protected"

# 获取令牌
TOKEN_RESPONSE=$(curl -s -X POST $TOKEN_URL \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" == "null" ]; then
  echo "Failed to get access token"
  exit 1
fi

# 调用 API
curl $API_URL -H "Authorization: Bearer $ACCESS_TOKEN"
```

#### PowerShell

```powershell
# 1. 获取访问令牌
$tokenUrl = "https://oauth.example.com/token"
$body = @{
    grant_type = "client_credentials"
    client_id = "your_client_id"
    client_secret = "your_client_secret"
}

$tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method POST -Body $body
$accessToken = $tokenResponse.access_token

# 2. 使用访问令牌调用 API
$headers = @{
    "Authorization" = "Bearer $accessToken"
}
$data = Invoke-RestMethod -Uri "https://api.example.com/protected" -Headers $headers

# 完整函数
function Get-ApiData {
    param(
        [string]$ClientId,
        [string]$ClientSecret,
        [string]$TokenUrl,
        [string]$ApiUrl
    )
    
    # 获取令牌
    $body = @{
        grant_type = "client_credentials"
        client_id = $ClientId
        client_secret = $ClientSecret
    }
    
    try {
        $tokenResponse = Invoke-RestMethod -Uri $TokenUrl -Method POST -Body $body
        $accessToken = $tokenResponse.access_token
        
        # 调用 API
        $headers = @{
            "Authorization" = "Bearer $accessToken"
        }
        $data = Invoke-RestMethod -Uri $ApiUrl -Headers $headers
        
        return $data
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
        return $null
    }
}

# 使用
$data = Get-ApiData `
    -ClientId "your_client_id" `
    -ClientSecret "your_client_secret" `
    -TokenUrl "https://oauth.example.com/token" `
    -ApiUrl "https://api.example.com/protected"
```

---

## 六、高级技巧

### 6.1 速率限制处理

#### Linux (curl)

```bash
# 检查速率限制
response=$(curl -i https://api.example.com/users)
rate_limit=$(echo "$response" | grep -i "X-RateLimit-Remaining" | cut -d' ' -f2)
echo "Remaining requests: $rate_limit"

# 自动处理速率限制
make_request() {
  response=$(curl -i -s "$1")
  rate_limit=$(echo "$response" | grep -i "X-RateLimit-Remaining" | cut -d' ' -f2)
  
  if [ "$rate_limit" -lt 10 ]; then
    echo "Rate limit low, waiting..."
    sleep 60
  fi
  
  echo "$response"
}
```

#### PowerShell

```powershell
# 检查速率限制
$response = Invoke-WebRequest -Uri "https://api.example.com/users"
$rateLimit = $response.Headers["X-RateLimit-Remaining"]
Write-Host "Remaining requests: $rateLimit"

# 自动处理速率限制
function Invoke-ApiWithRateLimit {
    param([string]$Uri)
    
    $response = Invoke-WebRequest -Uri $Uri
    $rateLimit = [int]$response.Headers["X-RateLimit-Remaining"]
    
    if ($rateLimit -lt 10) {
        Write-Host "Rate limit low, waiting 60 seconds..."
        Start-Sleep -Seconds 60
    }
    
    return $response.Content | ConvertFrom-Json
}
```

### 6.2 重试机制

#### Linux (curl)

```bash
# 简单重试
max_retries=3
retry_count=0

while [ $retry_count -lt $max_retries ]; do
  response=$(curl -s -w "%{http_code}" https://api.example.com/users)
  http_code="${response: -3}"
  
  if [ "$http_code" == "200" ]; then
    echo "Success"
    break
  else
    retry_count=$((retry_count + 1))
    echo "Retry $retry_count/$max_retries"
    sleep 2
  fi
done
```

#### PowerShell

```powershell
# 重试函数
function Invoke-ApiWithRetry {
    param(
        [string]$Uri,
        [int]$MaxRetries = 3,
        [int]$RetryDelay = 2
    )
    
    $retryCount = 0
    
    while ($retryCount -lt $MaxRetries) {
        try {
            $response = Invoke-RestMethod -Uri $Uri -ErrorAction Stop
            return $response
        } catch {
            $retryCount++
            if ($retryCount -lt $MaxRetries) {
                Write-Host "Retry $retryCount/$MaxRetries after $RetryDelay seconds..."
                Start-Sleep -Seconds $RetryDelay
            } else {
                throw "Failed after $MaxRetries retries: $($_.Exception.Message)"
            }
        }
    }
}

# 使用
$data = Invoke-ApiWithRetry -Uri "https://api.example.com/users" -MaxRetries 5
```

### 6.3 并发请求

#### Linux (curl)

```bash
# 使用 & 后台执行
for i in {1..5}; do
  curl -s https://api.example.com/users/$i > user_$i.json &
done
wait  # 等待所有后台任务完成
# &: 后台执行
# wait: 等待所有后台进程

# 使用 xargs 并行
echo {1..10} | xargs -n 1 -P 5 -I {} curl -s https://api.example.com/users/{} -o user_{}.json
# -n 1: 每次传递 1 个参数
# -P 5: 并行 5 个进程
# -I {}: 占位符
```

#### PowerShell

```powershell
# PowerShell 7+ 并行
$ids = 1..10
$results = $ids | ForEach-Object -Parallel {
    Invoke-RestMethod -Uri "https://api.example.com/users/$_"
} -ThrottleLimit 5
# -Parallel: 并行执行
# -ThrottleLimit 5: 最多 5 个并行任务

# PowerShell 5.1 使用 Jobs
$ids = 1..10
$jobs = $ids | ForEach-Object {
    Start-Job -ScriptBlock {
        param($id)
        Invoke-RestMethod -Uri "https://api.example.com/users/$id"
    } -ArgumentList $_
}

$results = $jobs | Wait-Job | Receive-Job
$jobs | Remove-Job
# Start-Job: 启动后台作业
# Wait-Job: 等待作业完成
# Receive-Job: 获取作业结果
# Remove-Job: 删除作业
```

### 6.4 缓存响应

#### Linux (curl)

```bash
# 简单文件缓存
CACHE_FILE="cache_users.json"
CACHE_TIME=3600  # 1 小时

if [ -f "$CACHE_FILE" ]; then
  file_age=$(($(date +%s) - $(stat -c %Y "$CACHE_FILE")))
  if [ $file_age -lt $CACHE_TIME ]; then
    echo "Using cached data"
    cat "$CACHE_FILE"
    exit 0
  fi
fi

# 获取新数据并缓存
curl -s https://api.example.com/users > "$CACHE_FILE"
cat "$CACHE_FILE"
```

#### PowerShell

```powershell
# 缓存函数
function Get-ApiDataWithCache {
    param(
        [string]$Uri,
        [string]$CacheFile = "cache.json",
        [int]$CacheMinutes = 60
    )
    
    if (Test-Path $CacheFile) {
        $cacheAge = (Get-Date) - (Get-Item $CacheFile).LastWriteTime
        if ($cacheAge.TotalMinutes -lt $CacheMinutes) {
            Write-Host "Using cached data"
            return Get-Content $CacheFile | ConvertFrom-Json
        }
    }
    
    Write-Host "Fetching fresh data"
    $data = Invoke-RestMethod -Uri $Uri
    $data | ConvertTo-Json -Depth 10 | Out-File $CacheFile
    return $data
}

# 使用
$users = Get-ApiDataWithCache -Uri "https://api.example.com/users" -CacheMinutes 30
```

### 6.5 日志记录

#### Linux (curl)

```bash
# 记录请求日志
LOG_FILE="api_requests.log"

log_request() {
  local method=$1
  local url=$2
  local status=$3
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] $method $url - Status: $status" >> "$LOG_FILE"
}

# 发送请求并记录
response=$(curl -s -w "%{http_code}" -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John"}')

http_code="${response: -3}"
log_request "POST" "https://api.example.com/users" "$http_code"
```

#### PowerShell

```powershell
# 日志函数
function Write-ApiLog {
    param(
        [string]$Method,
        [string]$Uri,
        [int]$StatusCode,
        [string]$LogFile = "api_requests.log"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Method $Uri - Status: $StatusCode"
    Add-Content -Path $LogFile -Value $logEntry
}

# 使用
try {
    $response = Invoke-WebRequest -Uri "https://api.example.com/users" -Method POST -Body $body
    Write-ApiLog -Method "POST" -Uri "https://api.example.com/users" -StatusCode $response.StatusCode
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-ApiLog -Method "POST" -Uri "https://api.example.com/users" -StatusCode $statusCode
}
```

---

## 七、常见问题和解决方案

### 7.1 CORS 错误

CORS（跨域资源共享）错误通常发生在浏览器中，终端工具不受影响。

```bash
# 终端请求不受 CORS 限制
curl https://api.example.com/users
# 正常工作

# 如果 API 需要特定的 Origin 头
curl https://api.example.com/users \
  -H "Origin: https://example.com"
```

### 7.2 SSL 证书错误

#### Linux (curl)

```bash
# 忽略证书验证（不安全，仅用于测试）
curl -k https://self-signed.example.com/api
# -k: 不验证 SSL 证书（insecure）

# 指定 CA 证书
curl --cacert /path/to/ca-cert.pem https://api.example.com

# 使用系统 CA 证书
curl --capath /etc/ssl/certs https://api.example.com
```

#### PowerShell

```powershell
# 忽略证书验证（不安全）
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
Invoke-RestMethod -Uri "https://self-signed.example.com/api"

# PowerShell 7+ 使用 -SkipCertificateCheck
Invoke-RestMethod -Uri "https://self-signed.example.com/api" -SkipCertificateCheck
```

### 7.3 超时问题

#### Linux (curl)

```bash
# 设置连接超时
curl --connect-timeout 10 https://api.example.com/users
# --connect-timeout 10: 连接超时 10 秒

# 设置总超时
curl --max-time 30 https://api.example.com/users
# --max-time 30: 总时间不超过 30 秒

# 同时设置
curl --connect-timeout 10 --max-time 60 https://api.example.com/users
```

#### PowerShell

```powershell
# 设置超时
Invoke-RestMethod -Uri "https://api.example.com/users" -TimeoutSec 30
# -TimeoutSec 30: 超时 30 秒

# 处理超时异常
try {
    $response = Invoke-RestMethod -Uri "https://api.example.com/users" -TimeoutSec 10
} catch [System.Net.WebException] {
    if ($_.Exception.Message -like "*timeout*") {
        Write-Host "Request timed out"
    }
}
```

### 7.4 编码问题

#### Linux (curl)

```bash
# 发送 UTF-8 编码的数据
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"name":"张三","city":"北京"}'

# URL 编码
curl -G https://api.example.com/search \
  --data-urlencode "q=你好世界"
# --data-urlencode: 自动 URL 编码
```

#### PowerShell

```powershell
# PowerShell 默认使用 UTF-8
$body = @{
    name = "张三"
    city = "北京"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.example.com/users" `
    -Method POST `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
    -ContentType "application/json; charset=utf-8"
# [System.Text.Encoding]::UTF8.GetBytes: 转换为 UTF-8 字节
```

### 7.5 大文件下载

#### Linux (curl)

```bash
# 下载大文件并显示进度
curl -# -L -o largefile.iso https://example.com/largefile.iso
# -#: 显示进度条
# -L: 跟随重定向

# 断点续传
curl -C - -o largefile.iso https://example.com/largefile.iso
# -C -: 自动继续下载

# 限速下载
curl --limit-rate 1M -o largefile.iso https://example.com/largefile.iso
# --limit-rate 1M: 限速 1MB/s
```

#### PowerShell

```powershell
# 使用 BITS（支持断点续传）
Start-BitsTransfer -Source "https://example.com/largefile.iso" `
    -Destination "largefile.iso" `
    -DisplayName "Downloading ISO" `
    -Description "Please wait..."

# 使用 Invoke-WebRequest（显示进度）
$ProgressPreference = 'Continue'
Invoke-WebRequest -Uri "https://example.com/largefile.iso" -OutFile "largefile.iso"
```

---

## 八、最佳实践

### 8.1 安全建议

```bash
# 1. 不要在命令行中明文传递密码
# 错误
curl -u username:password https://api.example.com

# 正确：使用环境变量
export API_TOKEN="your_token"
curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com

# 2. 使用 HTTPS
curl https://api.example.com  # 正确
curl http://api.example.com   # 不安全

# 3. 验证 SSL 证书
curl https://api.example.com  # 默认验证
curl -k https://api.example.com  # 不验证（不推荐）

# 4. 限制日志中的敏感信息
# 不要记录完整的请求和响应
```

### 8.2 性能优化

```bash
# 1. 使用 HTTP/2
curl --http2 https://api.example.com/users

# 2. 启用压缩
curl --compressed https://api.example.com/users
# --compressed: 请求压缩响应

# 3. 复用连接
curl --keepalive-time 60 https://api.example.com/users

# 4. 并行请求
# 使用 xargs 或后台任务

# 5. 缓存响应
# 实现本地缓存机制
```

### 8.3 错误处理

```bash
# 1. 检查 HTTP 状态码
http_code=$(curl -s -o /dev/null -w "%{http_code}" https://api.example.com/users)
if [ "$http_code" != "200" ]; then
  echo "Error: HTTP $http_code"
  exit 1
fi

# 2. 使用 try-catch（PowerShell）
try {
    $response = Invoke-RestMethod -Uri "https://api.example.com/users"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# 3. 实现重试机制
# 见 6.2 节

# 4. 记录错误日志
# 见 6.5 节
```

### 8.4 代码组织

```bash
# 1. 使用函数封装
api_get() {
  local endpoint=$1
  curl -s -H "Authorization: Bearer $API_TOKEN" \
    "https://api.example.com$endpoint"
}

# 使用
users=$(api_get "/users")

# 2. 配置文件
# config.sh
API_BASE_URL="https://api.example.com"
API_TOKEN="your_token"

# 3. 模块化
# api_client.sh
source config.sh
source functions.sh
```

```powershell
# 1. 使用函数
function Invoke-Api {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    $headers = @{
        "Authorization" = "Bearer $env:API_TOKEN"
    }
    
    $params = @{
        Uri = "$env:API_BASE_URL$Endpoint"
        Method = $Method
        Headers = $headers
    }
    
    if ($Body) {
        $params.Body = $Body | ConvertTo-Json
        $params.ContentType = "application/json"
    }
    
    return Invoke-RestMethod @params
}

# 使用
$users = Invoke-Api -Endpoint "/users"

# 2. 使用模块
# ApiClient.psm1
# 导出函数供其他脚本使用
```

---

## 九、总结

### 9.1 工具选择

- **Linux**: curl（功能强大，广泛使用）
- **Windows CMD**: 调用 PowerShell 或使用 curl（Windows 10+）
- **PowerShell**: Invoke-RestMethod（推荐）或 Invoke-WebRequest

### 9.2 快速参考

#### Linux (curl)

```bash
# GET
curl https://api.example.com/users

# POST
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John"}'

# PUT
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# DELETE
curl -X DELETE https://api.example.com/users/123

# 认证
curl -H "Authorization: Bearer token" https://api.example.com/protected
```

#### PowerShell

```powershell
# GET
Invoke-RestMethod -Uri "https://api.example.com/users"

# POST
$body = @{name="John"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.example.com/users" -Method POST -Body $body -ContentType "application/json"

# PUT
$body = @{name="John Updated"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.example.com/users/123" -Method PUT -Body $body -ContentType "application/json"

# DELETE
Invoke-RestMethod -Uri "https://api.example.com/users/123" -Method DELETE

# 认证
$headers = @{"Authorization"="Bearer token"}
Invoke-RestMethod -Uri "https://api.example.com/protected" -Headers $headers
```

### 9.3 学习资源

- curl 文档: https://curl.se/docs/
- PowerShell 文档: https://docs.microsoft.com/powershell/
- REST API 设计: https://restfulapi.net/
- HTTP 协议: https://developer.mozilla.org/en-US/docs/Web/HTTP

### 相关文档

- [终端网络请求和软件包下载](./终端网络请求和软件包下载.md)
- [Linux 环境变量和 echo 命令](./Linux环境变量和echo命令.md)
- [命令行参数详解](./命令行参数详解.md)

---

通过掌握终端调用 API 的方法，你可以高效地进行 API 测试、自动化脚本开发和系统集成。建议根据实际需求选择合适的工具，并遵循最佳实践确保安全性和可维护性。
