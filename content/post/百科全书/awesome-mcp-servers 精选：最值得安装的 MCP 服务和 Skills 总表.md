---
title: "awesome-mcp-servers 精选：最值得安装的 MCP 服务和 Skills 总表"
description: "基于 awesome-mcp-servers、官方文档与官方仓库，系统整理最值得在 Codex 中安装的 MCP 服务和 Skills，并附上分类清单、安装方式与使用建议"
keywords: "awesome-mcp-servers,Codex,MCP,Skills,OpenAI,Playwright,Context7,Figma,GitHub,Linear,Notion,Stripe,Cloudflare"

date: 2026-04-26T19:10:00+08:00
lastmod: 2026-04-26T19:10:00+08:00

math: false
mermaid: true

categories:
  - 百科全书
tags:
  - MCP
  - Skills
  - Codex
  - Cursor
  - PowerShell
  - AI 工程化
  - 实战教程
---

`awesome-mcp-servers` 这个项目很有价值，但它的定位是 **收录目录**，不是“装机单”。

也就是说，它非常适合拿来发现生态，但不适合直接照着全装。

如果你真的在 `Codex CLI`、`Cursor` 里的 `Codex - OpenAI's coding agent` 插件中长期使用 `MCP` 和 `Skills`，更合理的做法是：

- 优先安装官方或长期维护的实现
- 优先安装和你工作流直接相关的服务
- 优先安装能和 `Codex` 配合得最顺的那一批

这篇文章就是按这个思路来写的：**不是把目录抄一遍，而是把真正值得装的 MCP 和 Skills 系统筛出来。**

<!--more-->

## 一、先说结论

如果你主要把 `Codex` 用在：

- 编程
- 前端开发
- 查最新文档
- 看设计稿
- 跑浏览器自动化
- 管 GitHub / Linear / Notion
- 云平台与运维

那么最值得优先安装的 `MCP`，我建议先看这 14 个：

```text
1. openaiDeveloperDocs
2. context7
3. playwright
4. github
5. linear
6. figma
7. shadcn
8. notion
9. browserbase
10. stripe
11. cloudflare
12. render
13. sentry
14. azure
```

最值得优先安装的 `Skills`，我建议先看这 20 个：

```text
系统级：
openai-docs
imagegen
skill-installer
skill-creator
plugin-creator

前端 / 设计：
figma
figma-implement-design
figma-generate-design
playwright
playwright-interactive

协作 / 项目：
gh-address-comments
linear
notion-knowledge-capture
notion-research-documentation
notion-spec-to-implementation

运维 / 安全 / 交付：
security-best-practices
cloudflare-deploy
render-deploy
vercel-deploy
netlify-deploy
```

如果你只想先装一个最小高价值组合，我建议直接上这套：

```text
MCP:
openaiDeveloperDocs + context7 + playwright + github + linear + figma + shadcn

Skills:
openai-docs + figma + figma-implement-design + playwright + gh-address-comments + linear
```

---

## 二、这篇文章的筛选标准

我不是按“收录量”筛，而是按下面几个标准筛：

- 来自官方文档、官方仓库，或者生态中被广泛使用
- 对 `Codex` 这类编码 Agent 有实战价值
- 能明显提升编程、设计、协作、部署或运维效率
- 在 `Windows + PowerShell + Codex CLI + Cursor Codex 插件` 这套环境里可落地

同时我也明确排掉了几类东西：

- 纯 demo 性质、维护很弱的 MCP
- 很窄、很冷门、和主流开发工作流无关的 MCP
- 安装成本太高，但收益不明显的 MCP

所以这篇是 **“值得安装总表”**，不是 **“MCP 全宇宙百科”**。

---

## 三、先讲 Codex 里的安装基本功

## 3.1 MCP 在 Codex 里怎么装

你这台机器已经确认支持这些命令：

```powershell
codex mcp add
codex mcp list
codex mcp get
codex mcp login
codex mcp logout
codex mcp remove
```

最常见的两种安装方式如下。

### 远程 MCP

```powershell
codex mcp add <name> --url <mcp-url>
```

如果它支持 OAuth，再登录：

```powershell
codex mcp login <name>
```

### 本地 stdio MCP

```powershell
codex mcp add <name> -- npx <package>
```

如果要带环境变量：

```powershell
codex mcp add <name> --env KEY=VALUE --env KEY2=VALUE2 -- npx <package>
```

## 3.2 Skills 在 Codex 里怎么装

`Skills` 和 `MCP` 不一样。

- `MCP` 解决的是“把外部能力接进来”
- `Skills` 解决的是“让 Agent 更会按套路完成某类工作”

OpenAI 官方 skills 仓库说明得很明确：

- `.system` 技能通常随 Codex 自带
- curated / experimental skills 可以通过 `skill-installer` 安装

在 `Codex` 会话里直接输入：

```text
$skill-installer playwright
```

或者：

```text
$skill-installer figma
```

安装完成后重启 `Codex` 即可。

---

## 四、从 awesome-mcp-servers 里筛出来的高价值 MCP 总表

下面这部分是正文重点。

## 4.1 文档与知识类 MCP

### `openaiDeveloperDocs`

用途：

- 查 OpenAI 官方文档
- 查最新 Responses API / Codex / Tools / Skills 用法

为什么值得装：

- 你只要写 OpenAI 相关集成，它几乎就是常驻工具
- 直接减少“模型靠记忆答老版本文档”的问题

安装：

```powershell
codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp
```

推荐指数：`必装`

### `context7`

用途：

- 给 AI 补最新版库文档
- 对 React、Next.js、Vue、FastAPI、LangChain、Supabase 等尤其有用

为什么值得装：

- 在所有“代码文档型 MCP”里，它的投入产出比非常高
- 对“AI 写代码但 API 用错版本”这个痛点帮助很大

安装：

```powershell
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

推荐指数：`必装`

### `notion`

用途：

- 让 AI 读写你的 Notion 工作区
- 做文档、PRD、知识库、会议纪要、研究资料整理

为什么值得装：

- 对产品、文档、研究、项目管理的价值很高
- 在知识型工作流里非常强

安装：

```powershell
codex mcp add notion --url https://mcp.notion.com/mcp
codex mcp login notion
```

推荐指数：`高`

---

## 4.2 前端、设计与浏览器类 MCP

### `figma`

用途：

- 读取设计稿
- 把设计稿上下文直接带进代码实现
- 设计到代码的桥梁

为什么值得装：

- 对 AI 前端开发尤其关键
- 没有设计上下文，AI 很容易“像在猜设计”

安装：

```powershell
codex mcp add figma --url https://mcp.figma.com/mcp
codex mcp login figma
```

推荐指数：`必装`

### `shadcn`

用途：

- 让 AI 直接使用 `shadcn/ui` 组件生态
- 更快生成成熟页面块、组件、布局

为什么值得装：

- 对 React / Next.js / Tailwind 工作流价值极高
- 它的意义不是“页面更花”，而是“页面更像成熟产品”

安装：

```powershell
codex mcp add shadcn -- npx shadcn@latest mcp
```

推荐指数：`必装`

### `playwright`

用途：

- 浏览器自动化
- 页面截图
- UI 验收
- 表单流程检查

为什么值得装：

- 对前端开发和回归测试都是高价值
- `Codex` 有了它，才真正具备“实现后自查”的能力

安装：

```powershell
codex mcp add playwright -- npx @playwright/mcp@latest
```

推荐指数：`必装`

### `browserbase`

用途：

- 云端浏览器自动化
- 更稳定的远程浏览器流程
- 复杂网页操作和数据提取

为什么值得装：

- 当你发现本机 Playwright 不够、需要更稳定的云端浏览器时，它就很值
- 对复杂网站、反爬、长流程自动化更有优势

安装，优先本地 stdio 方式：

```powershell
codex mcp add browserbase --env BROWSERBASE_API_KEY=你的Key --env BROWSERBASE_PROJECT_ID=你的ProjectId -- npx @browserbasehq/mcp-server-browserbase
```

推荐指数：`中高`

---

## 4.3 代码托管、项目协作类 MCP

### `github`

用途：

- 读仓库、PR、issue、Actions、release
- 把 GitHub 上的协作上下文直接带进 Codex

为什么值得装：

- 对真实开发工作流价值极高
- 本地代码 + GitHub 讨论 + PR 反馈，三者终于能合一

安装：

```powershell
$env:GITHUB_PAT = "你的 GitHub Token"
codex mcp add github --url https://api.githubcopilot.com/mcp/ --bearer-token-env-var GITHUB_PAT
```

推荐指数：`必装`

### `linear`

用途：

- 读写 issue、project、comment
- 让 AI 直接对接需求流转

为什么值得装：

- 如果团队用 Linear，它几乎就是必装
- 它能把“需求上下文”真正带进编码过程

安装：

```powershell
codex mcp add linear --url https://mcp.linear.app/mcp
codex mcp login linear
```

推荐指数：`高`

### `slack`

用途：

- 搜索消息
- 读取线程
- 发消息
- 让 AI 接入团队日常沟通上下文

为什么值得装：

- 如果你团队很多真实决策都发生在 Slack 里，它的价值会非常大

但这里要说明一个现实问题：

- Slack 官方已经明确提供了 MCP server
- 也提供了与 Cursor、Claude 等伙伴工具的接入
- 但截至我这次整理时，我没有看到像 `Linear`、`Notion`、`Figma` 那样清晰、面向 `Codex` 的独立命令行安装说明

所以我的建议是：

- 先把它列为第二批值得接入的 MCP
- 等 Slack 官方补齐更明确的 `Codex` 文档，或者你们团队实际需要时再上

推荐指数：`中高`

---

## 4.4 云平台、运维、监控类 MCP

### `cloudflare`

用途：

- 管理 Workers、KV、R2、D1、监控、日志、Browser Rendering 等

为什么值得装：

- 如果你项目部署在 Cloudflare 生态，它非常值
- Cloudflare 现在官方 MCP 能力已经很完整

安装，远程 HTTP：

```powershell
codex mcp add cloudflare --url "https://mcp.cloudflare.com/mcp?codemode=false"
codex mcp login cloudflare
```

推荐指数：`高`

### `render`

用途：

- 管理 Render 服务、日志、metrics、数据库

为什么值得装：

- 如果你用 Render，它会比单纯看控制台更高效
- 尤其适合排障和读 metrics

安装：

```powershell
$env:RENDER_API_KEY = "你的 Render API Key"
codex mcp add render --url https://mcp.render.com/mcp --bearer-token-env-var RENDER_API_KEY
```

推荐指数：`高`

### `sentry`

用途：

- 查 issue、event、error、trace、performance
- 辅助调试线上问题

为什么值得装：

- 这类“监控上下文”是 AI 调试里非常缺的一块
- 如果你们线上用 Sentry，它价值很高

官方仓库给出的本地 stdio 方式如下：

```powershell
codex mcp add sentry --env SENTRY_ACCESS_TOKEN=你的Token --env EMBEDDED_AGENT_PROVIDER=openai --env OPENAI_API_KEY=你的OpenAIKey -- npx @sentry/mcp-server@latest
```

推荐指数：`中高`

### `azure`

用途：

- 让 AI 直接和 Azure 服务交互
- 适合企业云环境

为什么值得装：

- 如果你们部署在 Azure，它非常值得
- 如果你不在 Azure 上，优先级就会明显下降

安装：

```powershell
codex mcp add azure -- npx -y @azure/mcp@latest
```

推荐指数：`按需`

---

## 4.5 业务与支付类 MCP

### `stripe`

用途：

- 查 Stripe 文档
- 管理客户、订阅、发票、支付链接等

为什么值得装：

- 对 SaaS、支付型产品价值很高
- Stripe 官方已经把 LLM / MCP 工作流做得很完善

本地 stdio 方式：

```powershell
codex mcp add stripe --env STRIPE_SECRET_KEY=你的StripeKey -- npx -y @stripe/mcp@latest
```

如果你更倾向远程 hosted MCP，也可以参考 Stripe 官方文档中的 `https://mcp.stripe.com`。

推荐指数：`高`

---

## 五、按角色给出最推荐的 MCP 组合

## 5.1 前端开发者

优先装：

```text
openaiDeveloperDocs
context7
figma
shadcn
playwright
browserbase
github
linear
notion
```

## 5.2 全栈开发者

优先装：

```text
openaiDeveloperDocs
context7
github
linear
notion
playwright
stripe
render 或 cloudflare
sentry
```

## 5.3 平台 / 运维 / 云工程

优先装：

```text
github
cloudflare
render
sentry
azure
notion
```

## 5.4 AI 产品 / 独立开发者

优先装：

```text
openaiDeveloperDocs
context7
figma
shadcn
playwright
github
linear
notion
stripe
render 或 cloudflare
```

---

## 六、最值得安装的 Skills 总表

现在切到 `Skills`。

## 6.1 Codex 自带系统 Skills

这几类通常随 Codex 自带，不需要你单独下载：

- `openai-docs`
- `imagegen`
- `skill-installer`
- `skill-creator`
- `plugin-creator`

这里最重要的三个是：

- `openai-docs`：OpenAI 官方资料问答
- `imagegen`：为网页和产品补真实图像素材
- `skill-installer`：装更多 curated skills

---

## 6.2 最值得安装的前端 / 设计 Skills

### `figma`

适合：

- 读取 Figma 设计上下文
- 设计到代码

安装：

```text
$skill-installer figma
```

### `figma-implement-design`

适合：

- 把设计稿高保真落成前端代码

安装：

```text
$skill-installer figma-implement-design
```

### `figma-generate-design`

适合：

- 反向从代码 / 需求去搭设计稿

安装：

```text
$skill-installer figma-generate-design
```

### `playwright`

适合：

- 浏览器自动化测试
- UI 截图与验收

安装：

```text
$skill-installer playwright
```

### `playwright-interactive`

适合：

- 持续浏览器调试
- 更长链路的交互 QA

安装：

```text
$skill-installer playwright-interactive
```

---

## 6.3 最值得安装的协作与项目 Skills

### `gh-address-comments`

适合：

- 处理 GitHub PR review comments
- 把 review 意见真正转成改动

安装：

```text
$skill-installer gh-address-comments
```

### `linear`

适合：

- 从 Linear issue 到实现计划

安装：

```text
$skill-installer linear
```

### `notion-knowledge-capture`

适合：

- 把对话、决策、讨论沉淀到 Notion

安装：

```text
$skill-installer notion-knowledge-capture
```

### `notion-research-documentation`

适合：

- 从 Notion 资料中做研究总结和文档整理

安装：

```text
$skill-installer notion-research-documentation
```

### `notion-spec-to-implementation`

适合：

- 从规格文档推实施计划和任务拆分

安装：

```text
$skill-installer notion-spec-to-implementation
```

---

## 6.4 最值得安装的部署、安全与运维 Skills

### `security-best-practices`

适合：

- 做安全最佳实践审查

安装：

```text
$skill-installer security-best-practices
```

### `cloudflare-deploy`

适合：

- 部署到 Cloudflare

安装：

```text
$skill-installer cloudflare-deploy
```

### `render-deploy`

适合：

- 部署到 Render

安装：

```text
$skill-installer render-deploy
```

### `vercel-deploy`

适合：

- 部署到 Vercel

安装：

```text
$skill-installer vercel-deploy
```

### `netlify-deploy`

适合：

- 部署到 Netlify

安装：

```text
$skill-installer netlify-deploy
```

---

## 6.5 值得装但经常被低估的通用 Skills

### `spreadsheet`

适合：

- 处理 CSV、Excel、对账、报表

### `doc`

适合：

- 生成和修改 Word 文档

### `pdf`

适合：

- 处理 PDF 输出和校对

### `slides`

适合：

- 自动生成和修改 PPT

### `screenshot`

适合：

- 做系统级截图和视觉留档

---

## 七、如何一次性装一批 Skills

在 `Codex` 会话里，你可以逐条装：

```text
$skill-installer figma
$skill-installer figma-implement-design
$skill-installer playwright
$skill-installer gh-address-comments
$skill-installer linear
$skill-installer notion-research-documentation
$skill-installer security-best-practices
```

装完之后重启：

- `PowerShell` 里的 `codex`
- `Cursor` 里的 `Codex` 会话

如果你想看当前官方 curated skills 列表，最稳的做法是直接在 `Codex` 里调用 `skill-installer` 查看，而不是凭旧博客记忆。

---

## 八、我最建议你这样分批安装

## 第一批：所有人都应该先装的

### MCP

```text
openaiDeveloperDocs
context7
playwright
github
```

### Skills

```text
openai-docs
playwright
gh-address-comments
```

## 第二批：前端和产品流很值的

### MCP

```text
figma
shadcn
linear
notion
browserbase
```

### Skills

```text
figma
figma-implement-design
figma-generate-design
linear
notion-research-documentation
```

## 第三批：部署、支付、运维

### MCP

```text
stripe
cloudflare
render
sentry
azure
```

### Skills

```text
cloudflare-deploy
render-deploy
vercel-deploy
netlify-deploy
security-best-practices
```

---

## 九、常见误区

### 误区 1：把 awesome-mcp-servers 当成装机单

不对。

它首先是目录，其次才是候选池。

### 误区 2：MCP 越多越好

也不对。

MCP 太多会带来：

- 工具选择噪音
- 鉴权复杂度
- 安全面扩大

### 误区 3：只装 MCP，不装 Skills

这样会让 Agent “能做，但不够会做”。

最佳实践仍然是：

```text
MCP 负责外部能力
Skills 负责稳定工作流
```

### 误区 4：只追求“全能”，不按角色装

更好的做法是按你当前任务装。

前端就先把：

- `figma`
- `shadcn`
- `playwright`
- `context7`

这批打透。

---

## 十、我对这份总表的最终建议

如果你问我一句最实在的话，那就是：

**不要想着一次性把整个 MCP 生态吃完，先把你工作流里的“高频刚需链路”打通。**

对于绝大多数用 `Codex` 的开发者来说，真正值得优先打通的是这条链：

```text
最新文档 -> 代码仓库 -> 需求系统 -> 设计稿 -> 组件库 -> 浏览器验收
```

对应到工具就是：

```text
openaiDeveloperDocs / context7
github
linear / notion
figma
shadcn
playwright
```

这条链一旦顺了，`Codex` 就不再只是一个会聊天的代码模型，而是一个真的能接项目上下文、能改、能验、能交付的工程 Agent。

---

## 参考来源

- awesome-mcp-servers：<https://github.com/punkpeye/awesome-mcp-servers>
- OpenAI Codex MCP 文档：<https://developers.openai.com/codex/mcp>
- OpenAI Codex Skills 文档：<https://developers.openai.com/codex/skills>
- OpenAI Skills 官方仓库：<https://github.com/openai/skills>
- OpenAI Docs MCP：<https://developers.openai.com/mcp>
- Context7 官方仓库：<https://github.com/upstash/context7>
- Microsoft Playwright MCP：<https://github.com/microsoft/playwright-mcp>
- GitHub MCP Server 官方仓库：<https://github.com/github/github-mcp-server>
- GitHub MCP for Codex 安装说明：<https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-codex.md>
- Linear MCP 文档：<https://linear.app/docs/mcp>
- Figma MCP 远程安装文档：<https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/>
- Notion MCP 概览：<https://developers.notion.com/guides/mcp/overview>
- Notion MCP for Codex：<https://developers.notion.com/docs/get-started-with-mcp>
- shadcn/ui MCP 文档：<https://ui.shadcn.com/docs/mcp>
- shadcn/studio MCP：<https://shadcnstudio.com/mcp>
- Browserbase MCP 文档：<https://docs.browserbase.com/integrations/mcp/introduction>
- Browserbase MCP Setup：<https://docs.browserbase.com/integrations/mcp/setup>
- Stripe MCP 文档：<https://docs.stripe.com/mcp>
- Cloudflare MCP Server：<https://github.com/cloudflare/mcp-server-cloudflare>
- Cloudflare Code Mode MCP：<https://github.com/cloudflare/mcp>
- Render MCP 文档：<https://render.com/mcp>
- Sentry MCP 官方仓库：<https://github.com/getsentry/sentry-mcp>
- Slack MCP 说明：<https://slack.com/help/articles/48855576908307-Guide-to-the-Slack-MCP-server>
- Azure MCP Server：<https://github.com/mcp/com.microsoft/azure>
