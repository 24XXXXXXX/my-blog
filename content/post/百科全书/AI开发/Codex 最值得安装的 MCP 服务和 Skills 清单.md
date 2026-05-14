---
title: "Codex 最值得安装的 MCP 服务和 Skills 清单"
description: "基于 2026-04-26 的官方文档与官方仓库，筛选最值得在 Codex 中安装的 MCP 服务与 Skills，并给出适配 Windows、PowerShell、Cursor Codex 插件的实操配置方法"
keywords: "Codex,MCP,Skills,Cursor,PowerShell,OpenAI,Playwright,Context7,Figma,Linear,GitHub"

date: 2026-04-26T14:30:00+08:00
lastmod: 2026-04-26T14:30:00+08:00

math: false
mermaid: true

categories:
  - 百科全书
tags:
  - Codex
  - MCP
  - Skills
  - Cursor
  - PowerShell
  - OpenAI
  - 实战教程
---

如果你已经在 `PowerShell` 里用 `codex` 命令，也在 `Cursor` 里用 `Codex - OpenAI's coding agent` 插件，那么真正拉开体验差距的不是再换一个模型名，而是把 **MCP 服务** 和 **Skills** 装对。

这篇文章不讲泛泛而谈，只回答四个问题：

- 到 `2026-04-26` 为止，哪些 MCP 最值得优先安装
- 哪些 Skills 最值得优先安装
- 它们为什么值得装
- 在你这台 Windows 机器上怎么装

<!--more-->

## 一、先说结论

如果你主要把 `Codex` 用在编程、查文档、看设计稿、改 PR、跑浏览器自动化这几类场景，我认为最值得优先安装的是下面这批。

### 1.1 最值得优先安装的 MCP

第一梯队，优先级最高：

1. `openaiDeveloperDocs`
2. `context7`
3. `playwright`
4. `github`
5. `linear`
6. `figma`

### 1.2 最值得优先安装的 Skills

先分两类看：

- **Codex 自带就有的系统 Skills**
  - `openai-docs`
  - `imagegen`
  - `skill-installer`
  - `skill-creator`
  - `plugin-creator`
- **建议你主动再安装的 curated Skills**
  - `playwright`
  - `figma`
  - `linear`
  - `frontend-skill`
  - `gh-address-comments`
  - `security-best-practices`
  - `spreadsheet`

如果你只想先装一个最小高价值组合，我建议直接上这套：

```text
MCP: openaiDeveloperDocs + context7 + playwright + github
Skills: playwright + gh-address-comments + openai-docs
```

---

## 二、先把一个关键前提说清楚

OpenAI 官方文档已经明确写了，`Codex CLI` 和 `Codex IDE extension` 共用同一份 `config.toml` 配置。

对你这台机器来说，这意味着：

- 你在 `PowerShell` 里通过 `codex mcp add ...` 加进去的 MCP
- `Cursor` 里的 `Codex - OpenAI's coding agent` 插件也会读取到

你本机当前实际配置文件已经存在于：

```text
C:\Users\JJX\.codex\config.toml
```

而且我本机实测 `2026-04-26` 这版 `codex` 已经支持这些命令：

```powershell
codex mcp list
codex mcp get <name>
codex mcp add <name> --url <url>
codex mcp add <name> -- <command>
codex mcp login <name>
codex mcp logout <name>
```

所以，最稳的操作方式就是：

1. 优先在 `PowerShell` 里完成一次 MCP 配置
2. 然后重启 `Codex CLI` 或 `Cursor`
3. 让两边共用同一份配置

---

## 三、我这次筛选“值得安装”的标准

不是生态里出现过的 MCP 或 Skill 都值得你装。

我这次只保留下面几类：

- 有官方文档或官方仓库
- 维护活跃，至少不是纯演示性质
- 和编程工作流高度相关
- 能直接提升 `Codex` 在真实项目里的产出速度
- 对你现在这套 `Windows + PowerShell + Cursor + Codex` 组合可落地

反过来说，一些“看起来很酷”的 MCP 我没有排到前面，常见原因有三个：

- 只是参考实现，不适合长期生产使用
- 你本机其实已经有相近能力，装了收益不大
- 配置和鉴权成本过高，不适合作为第一批

---

## 四、最值得装的 MCP 服务

## 4.1 `openaiDeveloperDocs`

### 为什么值得装

这是 OpenAI 官方文档的 MCP。对 `Codex` 来说，它的价值非常直接：

- 查 OpenAI 官方能力、参数、升级路径更准
- 写 `OpenAI API`、`Responses API`、`Agents SDK`、`Codex` 相关代码时少走弯路
- 比让模型凭记忆回答更可靠

如果你经常写：

- `OpenAI API` 集成
- `Codex` 配置
- `ChatGPT Apps`
- `Sora`、语音、图像、工具调用

这个 MCP 基本应该常驻。

### 安装命令

```powershell
codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp
```

### 使用建议

配好以后，在 `Codex` 里直接让它：

```text
用 OpenAI 官方文档确认 Responses API 的最新文件上传写法
```

这类问题会明显比纯记忆式回答更稳。

---

## 4.2 `context7`

### 为什么值得装

`Context7` 的核心价值是：**给模型补最新库文档上下文**。

它非常适合下面这些高频场景：

- React、Next.js、Vue、FastAPI、Spring、LangChain、Supabase 等库的最新用法
- 明明知道模型会写代码，但不确定它记的是不是旧版本 API
- 想让生成代码更贴近当前官方文档

如果你平时经常问“这个框架最新版怎么写”，那它的实际收益通常比很多花哨 MCP 更大。

### 安装命令

官方仓库给了 `Codex` 的直接接法：

```powershell
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

### 使用建议

适合这种问法：

```text
先用 Context7 查一下 Next.js 现在推荐的 Route Handler 写法，再改我这个接口文件
```

---

## 4.3 `playwright`

### 为什么值得装

这是我认为对编码型 Agent 最有实际战斗力的 MCP 之一。

它能让 `Codex` 真正去开浏览器、点页面、填表单、看截图、跑交互流程。最适合：

- 前端页面验收
- 管理后台冒烟测试
- 登录流、支付流、表单流排查
- 让 Agent 不只是“写代码”，还能“自己验证”

如果你做 Web 项目，这个几乎是必装。

### 安装命令

```powershell
codex mcp add playwright -- npx @playwright/mcp@latest
```

首次使用如果本机缺浏览器依赖，再按提示安装 Playwright 浏览器。

### 使用建议

典型问法：

```text
启动本地站点后，用 Playwright MCP 走一遍登录和下单流程，截图并告诉我哪里报错
```

---

## 4.4 `github`

### 为什么值得装

如果你大量代码托管在 GitHub，这个 MCP 的投入产出比非常高。

它特别适合：

- 读取 issue、PR、review comment
- 基于仓库上下文做改动
- 让 `Codex` 把“改代码”和“看 PR 讨论”连起来

对多人协作项目，这比只靠本地仓库更完整。

### 安装方式

GitHub 官方仓库已经给出了 `Codex` 安装指南。常见做法是把 GitHub MCP 作为远程 HTTP MCP 配到 `Codex` 里。

一个常见配置方式是：

```powershell
codex mcp add github --url https://api.githubcopilot.com/mcp/ --bearer-token-env-var GITHUB_PAT
```

然后在当前终端先放好令牌：

```powershell
$env:GITHUB_PAT = "你的 GitHub Token"
```

### 使用建议

特别适合配合 Skill 一起用，比如：

```text
读一下这个仓库当前 PR 的 review comments，然后帮我逐条处理
```

---

## 4.5 `linear`

### 为什么值得装

如果团队已经用 `Linear` 管需求、缺陷、排期，那这个 MCP 的价值不是“能不能用”，而是“能不能把项目上下文直接带进编码过程”。

它适合：

- 读取 ticket 背景
- 按 issue 直接改代码
- 改完以后反写进度、补评论

如果你们团队不用 `Linear`，它就不是第一批必装项；如果你们已经在用，它就非常值得装。

### 安装命令

`Linear` 官方文档给了 `Codex` 配置示例：

```powershell
codex mcp add linear --url https://mcp.linear.app/mcp
codex mcp login linear
```

浏览器完成授权后即可使用。

---

## 4.6 `figma`

### 为什么值得装

如果你有设计稿到代码的工作流，`Figma MCP` 的价值非常高。

它适合：

- 读取 Figma 节点、变量、组件信息
- 把设计稿和代码实现关联起来
- 让 `Codex` 更准确地根据设计稿落代码

尤其是你后面如果还要配 `figma` 相关 Skill，MCP + Skill 的组合会比单独使用任何一边都更强。

### 安装命令

Figma 官方文档给了远程 MCP 地址：

```powershell
codex mcp add figma --url https://mcp.figma.com/mcp
codex mcp login figma
```

完成浏览器授权后即可。

---

## 五、哪些 MCP 不建议作为第一批优先装

### 5.1 `filesystem`

`filesystem` 是 MCP 生态里很经典的参考服务，但对 `Codex` 来说，它通常不是第一批最值得装的。

原因很简单：

- `Codex` 本身已经有本地工作区和 shell 能力
- 你现在的主要瓶颈通常不是“能不能读文件”，而是“能不能查最新文档、看浏览器、接项目系统”

另外，MCP 官方 `servers` 仓库也明确提醒，这些参考 server 主要用于示例和学习，不都适合作为生产级首选。

### 5.2 纯演示型或过度细分的 MCP

如果一个 MCP：

- 只解决特别窄的问题
- 没有稳定官方维护
- 需要很重的本地依赖和鉴权

那它更适合第二批甚至第三批再装。

第一批优先把文档、浏览器、代码托管、项目管理、设计稿这几个基础面补齐，收益更稳。

---

## 六、最值得装的 Skills

先说一个你这台机器上的实情。

我本机检查到，当前：

```text
C:\Users\JJX\.codex\skills
```

下面只有 `.system`，也就是 **系统技能已在，但 curated skills 还没开始主动安装**。

这意味着你现在是有基础能力的，但还没有把常用工作流真正“扩容”起来。

## 6.1 先认识两种 Skill

### 系统 Skills

这类通常随 Codex 自带，不需要你手动装。你当前机器上已经有：

- `openai-docs`
- `imagegen`
- `skill-installer`
- `skill-creator`
- `plugin-creator`

其中最实用的两个是：

- `openai-docs`：查 OpenAI 官方资料
- `skill-installer`：安装更多 Skills

### curated Skills

这类需要你主动安装。它们更像“现成工作流包”。

---

## 6.2 我最推荐安装的 curated Skills

### `playwright`

适合你让 `Codex` 做浏览器自动化、UI 验证、截图排错。

### `figma`

适合你在设计稿到代码的工作流里，把 Figma 上下文拉进来。

### `linear`

适合把 issue/workflow 管理直接带进编码过程。

### `frontend-skill`

适合做页面、控制台、产品 UI、前端原型时，让输出更像成熟产品，而不是一堆松散组件。

### `gh-address-comments`

如果你常走 GitHub PR 协作，这个 Skill 的收益非常高。它能引导 `Codex` 围绕 review comments 去处理修改，而不是只盯着本地 diff。

### `security-best-practices`

当你需要对 `Python`、`JavaScript/TypeScript`、`Go` 做安全性检查时，它比普通“代码解释”更有方向性。

### `spreadsheet`

如果你经常处理表格、导出数据、对账、批量清洗，这个 Skill 很实用，而且这类工作恰好适合被 Agent 稳定接管。

---

## 七、怎么在 Codex 安装这些 Skills

## 7.1 安装机制先说清楚

OpenAI 官方 skills 仓库说明了两件重要的事：

1. `.system` 目录里的技能通常随 Codex 预装
2. curated 和 experimental skills 可以通过 `skill-installer` 来安装

你这台机器上，`skill-installer` 已经存在，所以直接用它即可。

## 7.2 安装方式

安装 Skill 不是在 PowerShell 里敲 `npm install`，而是直接在 `Codex` 会话里调用 `skill-installer`。

例如，在 `codex` 交互里输入：

```text
$skill-installer playwright
```

或者：

```text
$skill-installer gh-address-comments
```

你也可以一次装多个，按需要分批装。

### 推荐安装顺序

第一批：

```text
$skill-installer playwright
$skill-installer gh-address-comments
$skill-installer frontend-skill
```

第二批：

```text
$skill-installer figma
$skill-installer linear
$skill-installer security-best-practices
$skill-installer spreadsheet
```

安装完成后，按官方说明：

```text
Restart Codex to pick up new skills.
```

也就是重启 `Codex CLI`，同时把 `Cursor` 里的 `Codex` 会话也重新开一下。

---

## 八、Skill 到底装到哪里

这里有一个很容易混淆的地方。

### 8.1 你当前这台机器的安装落点

我本机检查到，Codex 自带 skill-installer 的说明里写得很明确：

- 它默认把安装的 Skills 放到 `$CODEX_HOME/skills`
- 默认也就是 `~/.codex/skills`

对你这台机器来说，就是：

```text
C:\Users\JJX\.codex\skills
```

### 8.2 自定义 Skill 的官方用户目录

但 OpenAI 官方 `Codex skills` 文档里，又给了用户自定义 Skills 的标准位置：

```text
~/.agents/skills
```

换成你这台 Windows 机器，就是：

```text
C:\Users\JJX\.agents\skills
```

所以最稳的理解方式是：

- **安装官方 curated skills**：优先让 `skill-installer` 管，落在 `C:\Users\JJX\.codex\skills`
- **自己手写长期复用的 custom skills**：优先放在 `C:\Users\JJX\.agents\skills`

这样最不容易和系统目录混在一起。

---

## 九、给你一套可以直接照抄的安装方案

如果你现在就要开始配置，我建议按这个顺序做。

## 9.1 先在 PowerShell 里装 MCP

```powershell
codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp
codex mcp add context7 -- npx -y @upstash/context7-mcp
codex mcp add playwright -- npx @playwright/mcp@latest
codex mcp add linear --url https://mcp.linear.app/mcp
codex mcp add figma --url https://mcp.figma.com/mcp
```

如果你要接 GitHub，再补：

```powershell
$env:GITHUB_PAT = "你的 GitHub Token"
codex mcp add github --url https://api.githubcopilot.com/mcp/ --bearer-token-env-var GITHUB_PAT
```

然后做一次授权：

```powershell
codex mcp login linear
codex mcp login figma
```

最后检查：

```powershell
codex mcp list
```

## 9.2 再在 Codex 会话里装 Skills

```text
$skill-installer playwright
$skill-installer gh-address-comments
$skill-installer frontend-skill
$skill-installer figma
$skill-installer linear
$skill-installer security-best-practices
$skill-installer spreadsheet
```

装完后重启：

- `PowerShell` 里的 `codex`
- `Cursor` 里的 `Codex` 会话

---

## 十、怎么判断自己装成功了

### MCP 是否成功

先看：

```powershell
codex mcp list
```

再在 `Codex` 里发一个明确调用场景的任务，例如：

```text
用 OpenAI 官方文档确认 Codex 的 MCP 配置方式
```

或者：

```text
用 Playwright MCP 打开本地页面并截图
```

### Skill 是否成功

最直接的方式，是在新会话里显式触发它，例如：

```text
$playwright
```

或者直接发出强触发语义的任务，例如：

```text
处理一下这个 GitHub PR 的 review comments
```

如果 Skill 已经被正确安装和识别，`Codex` 会更稳定地走对应工作流。

---

## 十一、我对这套组合的最终建议

如果你的目标是把 `Codex` 变成一个真正能打的编码助手，而不是一个只会聊天的命令行模型，那么优先级应该是：

1. 先补官方文档能力：`openaiDeveloperDocs`、`context7`
2. 再补真实操作能力：`playwright`
3. 再补团队上下文能力：`github`、`linear`
4. 最后补设计与流程复用：`figma` + 对应 Skills

一句话概括：

```text
MCP 先补“外部能力”，Skills 再补“稳定工作流”。
```

这也是目前 `Codex` 最容易从“能回答”进化到“能交付”的路径。

---

## 十二、从 `awesome-mcp-servers` 里再补一批真值得看的 MCP

你提到的这个项目：

```text
https://github.com/punkpeye/awesome-mcp-servers
```

确实很适合当“雷达图”，但它是收录型项目，不是官方质量背书。真正有价值的做法不是全装，而是从里面挑出和你工作流高度匹配的条目。

如果你的重心是：

- `Codex` 写前端
- 想提升页面审美
- 想让 AI 更会搭界面、找组件、选动画、抄高质量模式

那我建议你重点再看下面这几类。

### 12.1 `shadcn/ui MCP`

这个非常值得装，甚至对很多前端项目来说，优先级可以接近第一梯队。

它的价值在于：

- 让 AI 直接浏览和安装 `shadcn` registry 里的组件
- 不只是“生成一段按钮代码”，而是直接对接成熟组件生态
- 对 `landing page`、后台、表单、设置页、定价页这类页面很实用

`shadcn/ui` 官方文档已经给了 `Codex` 的配置方式：

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

如果你想直接在终端加，也可以按 `Codex` 的标准命令写：

```powershell
codex mcp add shadcn -- npx shadcn@latest mcp
```

这类 MCP 的核心收益不是“审美自动变好”，而是 **让 AI 不再从零瞎搭，而是优先调用成熟 UI 组件和模板结构**。

### 12.2 `21st.dev Magic MCP`

这是我认为对“AI 前端审美增强”非常值得关注的一类工具。

`21st.dev` 官方介绍里说得很直白，它的 `Magic MCP` 提供三类很有价值的能力：

- `Inspiration Search`：在大量组件里做语义搜索
- `SVG Icon Search`：直接搜图标和品牌 logo
- `Magic Generate`：生成多个 UI 变体供你挑选

它的意义非常大，因为很多时候 AI 做前端不是真的不会写，而是 **不会做风格搜索、不会先横向出多个版本供人选**。`Magic MCP` 恰好在补这个短板。

我对它的判断是：

- 如果你在做营销站、产品官网、AI SaaS 首页、作品集页，价值很高
- 如果你在做强业务后台，价值中高
- 如果你只做 CRUD 表单，它不是第一优先

这里我补一句判断：`21st.dev` 官方页面强调它兼容支持 MCP 的 IDE，但我暂时没有在官方页面里看到像 `shadcn` 那样明确写给 `Codex` 的单独安装段落。**我推断** 它可以通过标准 MCP 命令接入 `Codex`，但具体命令最好以它当前安装页实时给出的配置为准。

### 12.3 `Browserbase MCP`

如果你后面要做更稳定的云端浏览器自动化、跨环境复现，`Browserbase MCP` 值得看。

它和 `playwright` 的区别，不是谁替代谁，而是：

- `playwright MCP` 更适合本机开发联调
- `Browserbase MCP` 更适合托管式、远程化、可复现浏览器流程

如果你准备把 AI 前端验收、表单回归、页面检查做成长期流程，这个值得列入第二批。

### 12.4 设计稿和组件生态相关 MCP

从你的目标出发，后面值得继续跟的 MCP 方向是：

- `Figma MCP`：读设计稿、变量、组件
- `shadcn MCP`：接成熟组件库和 registry
- `Magic MCP`：找灵感、找 UI 变体、找图标
- `Playwright MCP`：让 AI 自己检查页面实现结果

这四个组合起来，几乎就是一条完整链路：

```text
灵感与模式搜索 -> 设计稿上下文 -> 组件装配 -> 浏览器验收
```

这比单独装一堆“能调用但很少调用”的 MCP 更有价值。

---

## 十三、如何让 AI 做前端时更有审美和高级感

这个问题的核心不是“再换一个模型”，而是给 AI 补三种东西：

1. **高质量参考样本**
2. **可调用的优秀组件和动画资产**
3. **一套更像设计总监的提示词约束**

你提到 `Stitch`，这个方向是对的。因为很多 AI 工具真正拉开差距的地方，不在代码生成，而在于它们能不能先给你多个更像样的视觉候选。

下面我按用途给你分一套。

### 13.1 用来“从提示词快速出页面方向”的工具

#### `Stitch`

Google 在 `2026-03-18` 发布的官方介绍里，把 `Stitch` 定义成 AI-native 的软件设计画布。它支持从自然语言生成高保真 UI，还提到可以通过 MCP server 和 Skills 接入团队工作流。

它适合：

- 用一句话先出页面方向
- 快速看不同布局和视觉方案
- 先让 AI 帮你做方向探索，再回到代码实现

如果你现在缺的是“第一版视觉方向”，它很值得用。

#### `Relume`

`Relume` 的优势不是终稿级美术，而是：

- 从提示词先出 `Sitemap`
- 再出 `Wireframe`
- 再出 `Style Guide`

它特别适合营销站、品牌站、企业官网、SaaS 官网。对 AI 来说，它能把“先想结构，再想风格”这件事规范化。

#### `Webflow AI Site Builder`

`Webflow` 现在的 AI site builder 已经不是只给一个首页草稿，而是能生成多页站点和基础设计系统。

它适合你拿来做两件事：

- 看高级营销站是怎么组织版式和节奏的
- 让 AI 学“结构化输出”而不是只堆模块

#### `Framer AI / Wireframer`

`Framer` 的 `Wireframer` 很适合做结构初稿，官方文档也明确说它更偏 **structure, not style**。这点反而有价值，因为它能帮你先把信息层次搭对，再去上视觉。

我的建议是：

- `Framer` 适合先做结构和交互感觉
- `Stitch` 更适合拉视觉方案和变体
- `Relume` 更适合做营销站的站点规划和页面结构

### 13.2 用来“找高级案例和审美参考”的网站

很多人让 AI 直接做前端，失败的根因不是模型弱，而是没有先给它“看够好东西”。

我建议你平时固定看下面这些站。

#### `Mobbin`

强项是：

- 大量真实产品界面
- 适合看移动端、SaaS、产品流
- 不只是看漂亮，而是看真实商业产品怎么排信息

#### `Refero`

适合看：

- 登录、定价、Onboarding、Dashboard、Bento grid 等典型页面模式
- 更偏产品和 SaaS 工作流

#### `Land-book`

适合看高质量营销站、品牌站、官网首页。

#### `Lapa Ninja`

和 `Land-book` 类似，但覆盖面很广，适合快速搜 landing page 风格。

#### `Godly`

适合看更有风格、更有创意的网页案例。它不一定最实用，但非常适合补“高级感”和“氛围感”的眼界。

#### `Awwwards`

适合看顶级创意站点和强视觉项目，但要注意：很多作品适合“借气质”，不适合整站照搬到业务项目里。

### 13.3 用来“给 AI 提供高质量组件和页面块”的资源

#### `shadcn/ui`

这是当前最值得让 AI 先学会调用的组件生态之一。

它适合：

- 后台
- SaaS
- 设置页
- 表单
- 对话框
- 命令面板

最关键的是，它不是静态组件图，而是代码级资产。

#### `Magic UI`

如果你想给页面加一点“显得更高级”的微炫技效果，`Magic UI` 很值得看。它在 `21st.dev` 上有大量视觉组件，比如：

- `Shiny Button`
- `Border Beam`
- `Text Reveal`
- `Hero Video Dialog`
- `Sparkles Text`

这类组件非常适合：

- 首页 hero
- CTA
- 功能区视觉强化
- AI 产品官网

但要克制用。一个页面点一两个位置就够，别全站发光。

#### `Aceternity UI`、`Motion Primitives`、`React Bits`

这类资源的共同价值是：

- 给 AI 一个比普通组件库更有表现力的 UI 参考
- 补足高级交互、质感动效、视觉模块

如果你的目标是“比默认组件库更好看”，它们很值得做素材库。

### 13.4 用来“找图标和品牌标识”的资源

#### `Lucide`

这是我最建议默认选用的图标库之一。它的优势是：

- 风格克制
- 线条统一
- 很适合产品型界面

#### `Iconify`

如果你想把“找图标”这件事交给 AI，`Iconify` 非常强。官方文档显示它聚合了超大量开源图标集，并且统一清洗和更新。

它适合：

- 快速搜索不同风格图标
- 找品牌 logo
- 做多来源统一调用

#### `21st.dev` 的 `SVG Icon Search`

如果你准备上 `Magic MCP`，这会成为非常顺手的补充，因为它能直接从 AI 工作流里查图标和 logo。

### 13.5 用来“把页面做得更灵动”的动画和交互工具

#### `Motion`

现在 React 场景里，如果你想让 AI 做出真正顺手、现代、可控的动效，`Motion` 是非常强的基础库。官方文档里明确提到它擅长：

- hover / tap / drag 手势
- layout 动画
- scroll 动画
- enter / exit 动画

如果你做 React 前端，我建议把它视为首选基础动效库。

#### `GSAP`

如果你要做：

- 更复杂的时间轴动画
- 强视觉 landing page
- 滚动驱动叙事
- SVG 或复杂序列

那 `GSAP` 仍然非常强。

简单说：

- 常规产品交互优先 `Motion`
- 重视觉叙事和复杂动画优先 `GSAP`

#### `Rive`

如果你想做的是“真正高级的交互资产”，比如：

- 状态驱动插画
- 交互式空状态
- 复杂 loading
- 更像产品品牌系统的一体化动画

那 `Rive` 的上限比普通 CSS/JS 动效高很多。

#### `LottieFiles`

如果你更想快速拿现成轻量动画资产，`LottieFiles` 的价值很高，尤其适合：

- 空状态
- 成功/失败反馈
- onboarding 辅助动效
- 小型营销动画

### 13.6 适合 Codex 的“审美增强型” Skills 组合

如果你就是想让 `Codex` 做前端时更有审美，我建议优先启用和安装这几类 Skill：

- `frontend-skill`
- `figma`
- `figma-implement-design`
- `figma-generate-design`
- `imagegen`
- `playwright`

它们的组合逻辑是：

- `frontend-skill`：约束整体页面气质、排版、组件使用方式
- `figma` 系列：把设计稿和设计系统拉进来
- `imagegen`：补真实视觉素材，而不是让页面只剩色块和纯文字
- `playwright`：实现后自动验收，防止设计一落地就走形

### 13.7 我最建议你建立的工作流

如果你想让 AI 前端输出真的更高级，我建议按下面顺序做：

1. 去 `Mobbin`、`Refero`、`Land-book`、`Godly` 先找 3 到 5 个参考
2. 用 `Stitch`、`Relume` 或 `Framer Wireframer` 先出结构或视觉方向
3. 在 `Figma` 或直接在代码里明确设计系统约束
4. 用 `shadcn MCP`、`Magic MCP`、`figma MCP` 给 `Codex` 补上下文
5. 让 `Codex` 结合 `frontend-skill` 和 `Motion` / `GSAP` 实现
6. 用 `Playwright MCP` 自动截图和验收

这套流程的核心不是让 AI “自由发挥”，而是让 AI 在 **高质量参考 + 高质量组件 + 高质量约束** 下发挥。

---

## 参考来源

- OpenAI Codex MCP 文档：<https://developers.openai.com/codex/mcp>
- OpenAI Codex Skills 文档：<https://developers.openai.com/codex/skills>
- OpenAI Skills 官方仓库：<https://github.com/openai/skills>
- GitHub MCP Server 官方仓库：<https://github.com/github/github-mcp-server>
- GitHub MCP for Codex 安装说明：<https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-codex.md>
- Playwright MCP 官方仓库：<https://github.com/microsoft/playwright-mcp>
- Context7 官方仓库：<https://github.com/upstash/context7>
- Linear MCP 官方文档：<https://linear.app/docs/mcp>
- Figma MCP 官方文档：<https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/>
- awesome-mcp-servers 收录项目：<https://github.com/punkpeye/awesome-mcp-servers>
- shadcn/ui MCP 文档：<https://ui.shadcn.com/docs/mcp>
- shadcn/ui Skills 文档：<https://ui.shadcn.com/docs/skills>
- 21st.dev 官方站点：<https://21st.dev/>
- 21st.dev Magic MCP：<https://21st.dev/mcp>
- Browserbase MCP 官方仓库：<https://github.com/browserbase/mcp-server-browserbase>
- Google Stitch 官方介绍：<https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/>
- Relume 官方站点：<https://www.relume.io/>
- Webflow AI Site Builder：<https://webflow.com/ai-site-builder>
- Framer AI：<https://www.framer.com/ai/>
- Framer Wireframer：<https://www.framer.com/wireframer/>
- Mobbin：<https://mobbin.com/>
- Refero：<https://refero.design/>
- Land-book：<https://land-book.com/>
- Lapa Ninja：<https://www.lapa.ninja/>
- Godly：<https://godly.website/>
- Awwwards：<https://www.awwwards.com/>
- Lucide：<https://lucide.dev/>
- Iconify：<https://iconify.design/>
- Motion：<https://motion.dev/>
- GSAP 文档：<https://gsap.com/docs/v3/>
- Rive：<https://rive.app/>
- LottieFiles：<https://lottiefiles.com/>
