---
title: "Codex MCP 密钥补全与逐项验证清单"
description: "针对已经安装到 Codex 的 MCP 服务，系统梳理哪些已经可用、哪些仍依赖密钥或本地环境，并给出逐项补全与验证步骤"
keywords: "Codex,MCP,密钥,环境变量,GITHUB_PAT,RENDER_API_KEY,Sentry,Browserbase,Azure,Supabase,验证清单"

date: 2026-04-26T20:30:00+08:00
lastmod: 2026-04-26T20:30:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Codex
  - MCP
  - 环境变量
  - GitHub
  - Render
  - Sentry
  - Azure
  - Supabase
---

如果你已经把一批 `MCP` 装进 `Codex`，接下来最容易卡住的问题不是“会不会装”，而是：

- 哪些已经能直接用
- 哪些只是配置写进去了，但还缺密钥
- 哪些需要先装本地 CLI
- 哪些需要做一遍最小验证

这篇文章就是一份专门的补全清单。

<!--more-->

## 一、先说当前这台机器上的状态

截至 `2026-04-26`，我本机检查到你现在 `Codex` 里已经配置了这些 `MCP`：

```text
azure
browserbase
context7
playwright
sentry
shadcn
cloudflare
figma
github
linear
notion
openaiDeveloperDocs
render
stripe
supabase
```

同时我还检查到两个现实情况：

### 1.1 当前终端里没有看到这些环境变量

- `GITHUB_PAT`
- `RENDER_API_KEY`
- `SENTRY_ACCESS_TOKEN`
- `BROWSERBASE_API_KEY`
- `BROWSERBASE_PROJECT_ID`

这意味着：

- 相关 MCP 已经写进配置
- 但当前这个终端会话里还没有它们的运行凭据

### 1.2 本机还没有 `Azure CLI`

我本机执行 `az account show` 时，系统提示：

```text
az is not recognized
```

这意味着：

- `azure MCP` 已经配置好了
- 但如果你要真正使用它，本机还要先安装并登录 `Azure CLI`

---

## 二、把所有已安装 MCP 分成三类

## 2.1 已经基本可直接用的

这几类当前已经完成授权，或者本身不依赖额外密钥：

- `openaiDeveloperDocs`
- `context7`
- `playwright`
- `shadcn`
- `figma`
- `linear`
- `notion`
- `stripe`
- `cloudflare`

对这些来说，你现在最需要做的不是再配密钥，而是：

- 重启 `codex`
- 重开 `Cursor` 里的 `Codex` 会话
- 直接开始做功能级验证

## 2.2 已经写入配置，但还需要密钥

这几类目前最可能卡在凭据上：

- `github`
- `render`
- `browserbase`
- `sentry`

## 2.3 已经写入配置，但还需要本地环境或项目配置

这几类目前更像“已准备好入口，但还没补齐环境”：

- `azure`
- `supabase`

---

## 三、逐项补全指南

## 3.1 `github MCP`

### 当前状态

已写入 `Codex` 配置，使用：

```text
GITHUB_PAT
```

作为 bearer token 环境变量。

### 你要做什么

先在当前终端设置：

```powershell
$env:GITHUB_PAT = "你的 GitHub Token"
```

如果你想长期使用，可以把它写进你的 PowerShell 启动配置或系统环境变量。

### 怎么验证

先确认 `Codex` 看到它：

```powershell
codex mcp list
```

然后在 `Codex` 里发：

```text
请使用 GitHub MCP 读取当前仓库最近打开的 PR，并总结 review comments。
```

### 通过标准

- 能读到真实仓库 / PR / issue 信息
- 不是只给模板化回答

---

## 3.2 `render MCP`

### 当前状态

已写入配置，使用：

```text
RENDER_API_KEY
```

作为 bearer token。

### 你要做什么

在当前终端设置：

```powershell
$env:RENDER_API_KEY = "你的 Render API Key"
```

### 怎么验证

在 `Codex` 里发：

```text
请使用 Render MCP 列出我的服务，并总结它们的状态、最近部署和可能的异常点。
```

### 通过标准

- 能列出真实 Render 服务
- 能看到部署上下文，不是空泛建议

---

## 3.3 `browserbase MCP`

### 当前状态

MCP 已写入配置，但 `Browserbase` 通常还需要：

- `BROWSERBASE_API_KEY`
- `BROWSERBASE_PROJECT_ID`

### 你要做什么

在当前终端设置：

```powershell
$env:BROWSERBASE_API_KEY = "你的 Browserbase API Key"
$env:BROWSERBASE_PROJECT_ID = "你的 Browserbase Project ID"
```

如果你后面要长期用，建议把这两个变量写进稳定的环境管理方案里。

### 怎么验证

在 `Codex` 里发：

```text
请使用 Browserbase MCP 打开一个公开网页并截图，确认远程浏览器会话可用。
```

### 通过标准

- 能建立远程浏览器会话
- 能返回截图或页面分析

---

## 3.4 `sentry MCP`

### 当前状态

你已经把 `sentry MCP` 配好了，但它通常还需要至少：

- `SENTRY_ACCESS_TOKEN`

有些工作流里还会涉及额外 provider 配置，不过最小可用前提是 access token。

### 你要做什么

先在当前终端设置：

```powershell
$env:SENTRY_ACCESS_TOKEN = "你的 Sentry Access Token"
```

### 怎么验证

在 `Codex` 里发：

```text
请使用 Sentry MCP 查看最近的 production issue，并总结最近 24 小时最值得优先排查的错误。
```

### 通过标准

- 能读到真实 issue / event
- 能基于线上错误上下文回答

---

## 3.5 `azure MCP`

### 当前状态

你已经把 `azure MCP` 写进配置，但当前机器上还没有 `Azure CLI`。

### 你要做什么

先安装 Azure CLI，然后登录：

```powershell
az login
az account show
```

如果你们团队还有特定订阅、租户或 RBAC 要求，也要先走完。

### 怎么验证

在 `Codex` 里发：

```text
请使用 Azure MCP 列出我当前可访问的资源组，并总结每个资源组的用途。
```

### 通过标准

- 能看到真实 Azure 资源
- 说明本地认证链已经打通

---

## 3.6 `supabase MCP`

### 当前状态

`supabase MCP` 已经写入配置，但它的实际可用性往往还取决于：

- 你是否已登录或接通 Supabase 项目
- 项目级访问边界怎么配
- 是否开启只读模式

### 你要做什么

建议先去 Supabase 官方文档里确认你想采用的连接方式，并优先连开发环境。

同时，强烈建议你先把边界收紧，例如：

- 先用只读
- 先只连开发项目
- 不要直接把生产项目敞开给 AI

### 怎么验证

在 `Codex` 里发：

```text
请使用 Supabase MCP 查看当前项目的表结构，并总结主要数据实体之间的关系。
```

### 通过标准

- 能读到真实 schema
- 能围绕表、字段、关系给出结构化说明

---

## 四、已经授权的 MCP 也要做一轮最小验证

下面这些虽然已经能用了，但我仍然建议各跑一次最小验证：

### `figma`

```text
请使用 Figma MCP 读取这个设计稿链接，并总结页面结构、配色、层级和组件风格。
```

### `linear`

```text
请使用 Linear MCP 读取我最近分配的 issue，并整理需求、约束和实现步骤。
```

### `notion`

```text
请使用 Notion MCP 搜索我的项目规范文档，并总结出接口、设计和发布相关约束。
```

### `stripe`

```text
请使用 Stripe MCP 查看当前账号下最近的订阅或支付对象，并总结最常见的 billing 数据结构。
```

### `cloudflare`

```text
请使用 Cloudflare MCP 列出当前可访问的 zones 或项目资源，并总结主要用途。
```

---

## 五、最推荐的补全顺序

如果你不想一下子补太多，我建议按这个顺序来。

## 第一批：最容易立刻产生价值的

1. `GITHUB_PAT`
2. `RENDER_API_KEY`
3. `SENTRY_ACCESS_TOKEN`

原因很简单：

- GitHub 直接影响代码协作
- Render 直接影响部署查看
- Sentry 直接影响线上排障

## 第二批：浏览器和产品型能力增强

1. `BROWSERBASE_API_KEY`
2. `BROWSERBASE_PROJECT_ID`
3. `Supabase` 项目连接

## 第三批：企业云和平台能力

1. 安装 `Azure CLI`
2. `az login`
3. 配 Azure 访问边界

---

## 六、建议你怎么保存这些密钥

不要把长期密钥乱散在聊天记录和临时脚本里。

更稳的做法是：

- 临时测试：当前 PowerShell 会话里先设 `$env:...`
- 长期使用：放进系统环境变量、PowerShell 启动配置，或你自己的安全凭据管理方案

如果后面你要把这台机器长期作为 `Codex` 工作站，建议至少把下面这些统一管理：

- `GITHUB_PAT`
- `RENDER_API_KEY`
- `SENTRY_ACCESS_TOKEN`
- `BROWSERBASE_API_KEY`
- `BROWSERBASE_PROJECT_ID`

---

## 七、我对这份清单的最终建议

如果你现在已经把一大批 MCP 都装上了，真正重要的不是继续扩数量，而是把每一个高频 MCP 都补到“能稳定实战”的状态。

优先打透这条链：

```text
GitHub -> Render / Sentry -> Figma / Linear / Notion -> Playwright
```

当这条链真正可用时，`Codex` 才会从“工具很多”变成“工作流真的顺”。

---

## 参考来源

- OpenAI Codex MCP 文档：<https://developers.openai.com/codex/mcp>
- GitHub MCP Server：<https://github.com/github/github-mcp-server>
- Render MCP：<https://render.com/mcp>
- Browserbase MCP：<https://docs.browserbase.com/integrations/mcp/introduction>
- Sentry MCP：<https://github.com/getsentry/sentry-mcp>
- Azure MCP：<https://github.com/mcp/com.microsoft.azure>
- Supabase MCP：<https://supabase.com/mcp>
