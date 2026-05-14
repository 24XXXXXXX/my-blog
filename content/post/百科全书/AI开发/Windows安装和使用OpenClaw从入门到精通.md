---
title: "Windows 安装和使用 OpenClaw 从入门到精通"
description: "系统讲解在 Windows 上安装、配置和使用 OpenClaw，包括原生 Windows、WSL2、onboarding、dashboard、gateway、channel 接入与常见问题排查"
keywords: "OpenClaw,Windows,WSL2,Gateway,Dashboard,OpenClaw安装,OpenClaw使用,AI代理"

date: 2026-04-08T10:30:00+08:00
lastmod: 2026-04-08T10:30:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - OpenClaw
  - Windows
  - WSL2
  - AI
  - 环境搭建
---

OpenClaw 是一个面向聊天渠道的 AI Gateway，可以把 Discord、Telegram、Slack、WhatsApp、Web 控制台等渠道接到同一个 AI 代理系统上。你可以把它理解成“一个统一的 AI 中枢”，负责接消息、调模型、路由代理、管理会话，再把结果发回不同渠道。

<!--more-->

## 一、先说结论：Windows 下怎么装最稳

根据 OpenClaw 官方文档，截至 `2026-04-08`：

- `原生 Windows` 可以安装和使用
- 但官方明确推荐 `WSL2`
- 如果你只想快速体验 CLI 和 Dashboard，原生 Windows 也能跑起来
- 如果你想长期稳定运行 Gateway、做多渠道接入、自动启动、少踩坑，优先选 `WSL2`

所以可以直接这样决策：

- 想最快体验：先走 `原生 Windows`
- 想长期稳定使用：直接走 `WSL2 + Ubuntu`

---

## 二、OpenClaw 是什么

OpenClaw 的核心组件可以理解为三层：

- `CLI`：命令行工具，负责安装、配置、诊断、启动
- `Gateway`：核心服务，负责消息接入、认证、会话、路由和执行
- `Dashboard / Control UI`：浏览器里的控制台界面，用来聊天、查看配置、管理会话

一个最典型的使用流程是：

1. 安装 `openclaw`
2. 执行 `openclaw onboard`
3. 启动或安装 `Gateway`
4. 打开 `openclaw dashboard`
5. 在浏览器里先聊天测试
6. 再接 Telegram、Slack、Discord 等外部渠道

---

## 三、安装前你需要准备什么

官方入口建议先收藏：

- 官网：`https://openclaw.ai/`
- Windows 安装文档：`https://docs.openclaw.ai/platforms/windows`
- Dashboard 文档：`https://docs.openclaw.ai/dashboard`
- Getting Started：`https://docs.openclaw.ai/`

根据官方 Getting Started 和 Install 文档，OpenClaw 的前置条件主要是：

- `Node.js 24` 推荐
- `Node.js 22.14+` 也支持
- 一个可用的模型提供商 API Key

常见可用模型提供商包括：

- OpenAI
- Anthropic
- Google

如果你不确定本机 Node 版本，先检查：

```powershell
node --version
```

如果没有安装 Node，也不用太紧张。官方安装脚本会尝试自动处理 Node。

---

## 四、Windows 安装 OpenClaw 的两条路线

### 4.1 路线 A：原生 Windows 安装

适合：

- 想快速体验
- 先跑通 CLI
- 先用本机浏览器 Dashboard 聊天

优点：

- 上手快
- 不需要额外安装 Linux 子系统

缺点：

- 官方明确说明原生 Windows 仍在持续改进中
- 某些服务安装和后台运行场景不如 WSL2 稳
- 完整体验不如 WSL2 成熟

### 4.2 路线 B：WSL2 安装

适合：

- 计划长期使用 OpenClaw
- 想接更多渠道
- 想让 Gateway 更稳定地作为后台服务运行

优点：

- 官方推荐
- Linux 兼容性更完整
- 服务管理、systemd、自动启动等能力更成熟

缺点：

- 初次配置比原生 Windows 稍微复杂一点

---

## 五、原生 Windows 安装 OpenClaw

如果你想先尽快上手，可以先走这一节。

### 5.1 推荐安装命令

官方安装页给出的 Windows PowerShell 安装方式是：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

如果你只想安装，不想立刻跑 onboarding，可以使用：

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

这两条命令的含义分别是：

- 第一条：安装并进入 onboarding
- 第二条：只安装，暂时不进入 onboarding

### 5.2 安装完成后先验证

安装完成后，先执行这几个命令：

```powershell
openclaw --version
openclaw doctor
openclaw plugins list --json
```

如果这些命令能运行，说明本地 CLI 基本正常。

### 5.3 原生 Windows 当前适合做什么

根据官方 Windows 页面，原生 Windows 当前比较适合：

- 本地 CLI 使用
- 基本诊断
- 本地 Gateway 测试
- Dashboard 控制台聊天

例如官方给出的本地 smoke test：

```powershell
openclaw agent --local --agent main --thinking low -m "Reply with exactly WINDOWS-HATCH-OK."
```

如果这条命令能成功返回指定文本，说明本地基础链路已经通了。

### 5.4 原生 Windows 的注意事项

官方文档提到，原生 Windows 目前要注意这些点：

- 某些非交互式 onboarding 仍然依赖可访问的本地 Gateway
- 安装后台服务时会优先尝试 `Windows Scheduled Tasks`
- 如果任务计划创建失败，会回退到当前用户的启动项

所以如果你在原生 Windows 上只是想先体验，建议优先用下面这套最小流程：

```powershell
openclaw onboard --skip-health
openclaw gateway run
openclaw dashboard
```

这样更适合本机单人测试。

---

## 六、WSL2 安装 OpenClaw（官方推荐）

如果你准备长期使用，建议直接走这一节。

### 6.1 安装 WSL2 和 Ubuntu

以管理员身份打开 PowerShell：

```powershell
wsl --install
```

如果你想明确指定发行版，可以先查看：

```powershell
wsl --list --online
```

然后安装指定版本，例如：

```powershell
wsl --install -d Ubuntu-24.04
```

如果系统提示重启，就先重启一次。

### 6.2 启用 systemd

官方 Windows 文档明确写了，Gateway 服务安装依赖 `systemd`。  
进入你的 Ubuntu 终端后执行：

```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
```

然后回到 PowerShell 执行：

```powershell
wsl --shutdown
```

重新打开 Ubuntu 后验证：

```bash
systemctl --user status
```

如果没有明显报错，说明 systemd 基本已经可用。

### 6.3 在 WSL2 里安装 OpenClaw

进入 Ubuntu 后，你有两种常见方式。

#### 方式 1：官方推荐的安装脚本

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

如果你只想安装，不立即 onboarding：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

#### 方式 2：你已经自己管理 Node

如果你已经有合适的 Node 环境，也可以直接：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 6.4 安装后验证

```bash
openclaw --version
openclaw doctor
openclaw gateway status
```

---

## 七、第一次运行：onboarding 是什么

`openclaw onboard` 可以理解成安装后的引导配置向导。

它主要会帮你做这些事：

- 配置认证
- 配置 Gateway
- 选择是否安装后台服务
- 配置模型提供商密钥
- 初始化基本运行环境

最常用的命令是：

```powershell
openclaw onboard --install-daemon
```

这个命令的核心价值在于：

- 安装完成后顺手把 Gateway 后台服务也装好
- 省去很多手动配置步骤

如果你只是临时试用，也可以先不装后台服务，按需运行前台进程。

---

## 八、Gateway、Dashboard 和日常使用流程

### 8.1 检查 Gateway 状态

```powershell
openclaw gateway status
```

如果你是在 WSL2 中，也是在 WSL2 终端里执行。

### 8.2 前台运行 Gateway

适合测试和排错：

```powershell
openclaw gateway run
```

或者：

```powershell
openclaw gateway --port 18789
```

### 8.3 打开 Dashboard

```powershell
openclaw dashboard
```

根据官方 Dashboard 文档，本地默认地址通常是：

```text
http://127.0.0.1:18789/
```

或者：

```text
http://localhost:18789/
```

如果页面打不开，先检查 Gateway 是否已经启动。

### 8.4 Dashboard 是干什么的

Dashboard 也叫 `Control UI`，主要用于：

- 浏览器里直接聊天
- 查看和管理会话
- 调试配置
- 处理认证和连接
- 做本机控制台测试

对新手来说，最简单的起步方式不是先接 Telegram 或 Slack，而是：

- 先让 Dashboard 跑通

因为这能先证明：

- CLI 正常
- Gateway 正常
- 模型认证正常
- 浏览器控制台正常

---

## 九、从入门到熟练：推荐学习路径

### 9.1 第一步：只做本地聊天

先做到这四件事：

```powershell
openclaw --version
openclaw onboard --install-daemon
openclaw gateway status
openclaw dashboard
```

你能在浏览器里成功发一条消息并得到回复，就已经完成了最重要的第一步。

### 9.2 第二步：学会诊断问题

最常用的诊断命令：

```powershell
openclaw doctor
openclaw gateway status
openclaw status
```

其中：

- `openclaw doctor` 适合查安装和配置问题
- `openclaw gateway status` 适合查服务状态
- `openclaw status` 适合看整体运行情况

### 9.3 第三步：学会服务化运行

如果你不想每次都手动启动，重点掌握：

```powershell
openclaw onboard --install-daemon
```

或者：

```powershell
openclaw gateway install
```

在不同平台下，它会采用不同的方式安装后台服务：

- macOS：LaunchAgent
- Linux / WSL2：systemd user service
- Native Windows：Scheduled Task 优先，失败时回退到启动项

### 9.4 第四步：学会接入聊天渠道

OpenClaw 的价值不只是本地聊天，更重要的是接入真实聊天渠道。

官网支持的方向包括：

- Discord
- Telegram
- Slack
- WhatsApp
- Matrix
- Google Chat
- WebChat

如果你只想先选一个最容易感知效果的渠道，通常可以优先选：

- `Telegram`
- 或 `Slack`

因为这两类渠道的测试路径通常比较清晰。

---

## 十、如何理解 channel、agent、session

这三个概念不搞明白，后面就容易越用越乱。

### 10.1 channel

就是消息从哪里来、往哪里去。

例如：

- Slack
- Telegram
- Discord
- Dashboard

### 10.2 agent

就是具体负责响应的 AI 代理。

你可以把它理解成：

- 不同角色
- 不同工作流
- 不同权限或不同提示词配置

### 10.3 session

就是会话上下文。

它决定的是：

- 这次聊天跟哪段上下文关联
- 多个用户、多个群、多个线程怎么隔离

从实战角度，你可以先这样理解：

- `channel` 负责接入口
- `agent` 负责干活
- `session` 负责记忆和隔离

---

## 十一、接入外部渠道时怎么做

这一部分不展开写每个渠道的全部配置细节，但给你一个统一思路。

### 11.1 通用步骤

不管你接 Slack、Telegram 还是 Discord，基本都绕不开这几步：

1. 在对应平台创建机器人 / 应用
2. 拿到所需 Token、Webhook 或 App 凭据
3. 按官方 channel 文档写入 OpenClaw 配置
4. 重启或重新加载 Gateway
5. 用真实消息测试收发

### 11.2 以 Slack 为例的理解方式

官方 Slack 文档里，最核心的配置就是：

- `appToken`
- `botToken`
- 启用对应 channel

也就是说，实际接入时你最需要关注的是：

- 目标平台侧的应用权限
- OpenClaw 侧的 channel 配置是否正确
- Gateway 是否正常在线

### 11.3 先用一个渠道跑通，再扩展

不要一上来同时接多个渠道。  
更稳妥的方式是：

- 先把 Dashboard 跑通
- 再接一个渠道
- 这个渠道稳定后，再继续扩展第二个

---

## 十二、国内应用实战：接入飞书

如果你在国内办公环境里使用 OpenClaw，`飞书` 是目前最值得优先接入的渠道之一。

根据 OpenClaw 官方飞书文档，截至 `2026-04-08`：

- OpenClaw 已提供 `Feishu / Lark` 官方渠道文档
- 当前版本中飞书插件随发行版打包提供
- 接入方式优先使用 `WebSocket event subscription`
- 这样可以减少对公网 webhook 的依赖

### 12.1 先决条件

开始前你需要准备：

- 一个可登录的飞书租户
- 飞书开放平台权限
- 已安装并可正常运行的 OpenClaw Gateway

先确保本地 Gateway 已经正常：

```powershell
openclaw gateway status
openclaw dashboard
```

如果 Dashboard 都还没跑通，先不要急着接飞书。

### 12.2 在飞书开放平台创建应用

按官方文档，流程如下：

1. 打开飞书开放平台
2. 创建企业自建应用
3. 填写应用名称、描述和图标
4. 进入“凭证与基础信息”复制 `App ID` 和 `App Secret`
5. 进入“开发配置 -> 事件与回调 -> 加密策略”
6. 记录 `Verification Token` 和 `Encrypt Key`

这里最关键的四个值是：

- `App ID`
- `App Secret`
- `Verification Token`
- `Encrypt Key`

### 12.3 飞书开放平台里要开的能力和权限

这是最容易卡住的一步。  
根据 OpenClaw 官方飞书文档，推荐这样配置。

#### 1. 开启 Bot 能力

在飞书开放平台的：

- `App Capability > Bot`

里开启 Bot，并设置：

- 机器人名称
- 机器人描述
- 机器人头像

#### 2. 批量导入权限

在：

- `Permissions`

里点击：

- `Batch import`

然后粘贴官方文档给出的权限 JSON：

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "cardkit:card:read",
      "cardkit:card:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "event:ip_list",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:resource"
    ],
    "user": [
      "aily:file:read",
      "aily:file:write",
      "im:chat.access_event.bot_p2p_chat:read"
    ]
  }
}
```

如果你后面还要做飞书文档评论工作流，最好先按官方权限一次性配好，避免后面反复补权限。

#### 3. 配置事件订阅

在：

- `Event Subscription`

中选择：

- `Use long connection to receive events (WebSocket)`

然后添加事件：

- `im.message.receive_v1`

如果你还要支持飞书文档评论触发 AI，再额外添加：

- `drive.notice.comment_add_v1`

这里有一个很关键的前提，官方文档写得比较明确：

- 在配置事件订阅前，最好已经先把 Feishu channel 加到 OpenClaw
- 并确保 Gateway 正在运行

否则长连接订阅可能保存失败。

### 12.4 用 onboarding 接入飞书

官方推荐优先使用 onboarding：

```powershell
openclaw onboard
```

在向导里选择：

- 添加 channel
- 选择 `Feishu`

然后按提示填写：

- `App ID`
- `App Secret`

配置完成后检查：

```powershell
openclaw gateway status
```

### 12.5 已完成安装后，用 CLI 追加飞书渠道

如果你已经完成过初始安装，也可以后补：

```powershell
openclaw channels add
```

然后在交互式提示里选择：

- `Feishu`

再输入：

- `App ID`
- `App Secret`

完成后重启 Gateway：

```powershell
openclaw gateway restart
```

更稳妥的顺序是：

1. `openclaw channels add`
2. 选择 `Feishu`
3. 输入 `App ID` 和 `App Secret`
4. `openclaw gateway`
5. 再回飞书开放平台配置事件订阅
6. 发布应用

### 12.6 发布应用并安装到飞书

这一步很多教程会漏掉，但实际很关键。

在飞书开放平台中继续完成：

1. `Version Management & Release`
2. 创建一个版本
3. 提交审核并发布
4. 等待管理员审批
5. 把应用安装到你的飞书组织中

如果你没有发布成功，机器人通常不会真正开始收发消息。

### 12.7 飞书国际版 Lark 要注意什么

如果你用的是国际版 `Lark`，官方文档明确要求设置：

```json
{
  "channels": {
    "feishu": {
      "domain": "lark",
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx"
        }
      }
    }
  }
}
```

也就是说：

- 国内飞书默认用 `feishu`
- 国际版 Lark 要显式设成 `lark`

### 12.8 第一次测试时会遇到“配对码”

OpenClaw 官方飞书插件默认的私聊策略是：

```text
dmPolicy: "pairing"
```

也就是说，陌生用户第一次私聊机器人时，机器人不会立刻直接聊天，而是先返回一个配对码。

你需要在本机审批：

```powershell
openclaw pairing list feishu
openclaw pairing approve feishu <配对码>
```

审批完成后，这个用户才可以正常与机器人对话。

这个设计的好处是：

- 避免任何人一加到机器人就直接开始调用模型
- 更适合团队内部逐步放开

### 12.9 飞书群聊里怎么避免机器人乱回

这是实战里最容易踩的坑。

官方配置里提供了几类控制项：

- `groupPolicy`
- `groupAllowFrom`
- `requireMention`
- `dmPolicy`

对于大多数团队，一个比较稳妥的思路是：

- 私聊允许
- 群聊默认要求 `@机器人`
- 只放开指定群

配置思路可以写成：

```json
{
  "channels": {
    "feishu": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["oc_xxx_group_id"],
      "requireMention": true,
      "dmPolicy": "pairing"
    }
  }
}
```

这样做的好处是：

- 不会在所有群里自动插话
- 不容易因为误触发导致刷屏
- 更适合办公环境

这里需要补一个官方默认值差异：

- `groupPolicy` 的默认值是 `allowlist`
- `requireMention` 的默认行为是条件式的

更直接地说：

- 如果你显式设 `groupPolicy: "open"`，默认可以不要求 `@`
- 如果你走更保守的非 open 策略，通常默认会要求 `@mention`

如果你不想靠默认行为猜，最稳妥的做法是把它显式写出来：

```json
{
  "channels": {
    "feishu": {
      "groupPolicy": "allowlist",
      "requireMention": true,
      "groupAllowFrom": ["oc_xxx"]
    }
  }
}
```

### 12.10 飞书实战测试流程

配置完成后，可以按下面顺序测试：

1. `openclaw gateway status`
2. `openclaw channels list`
3. `openclaw channels status`
4. 在飞书里私聊机器人发一句话
5. 如果收到配对码，在本机执行 `openclaw pairing approve feishu <CODE>`
6. 再发第二条消息确认是否正常回复
7. 把机器人拉进测试群
8. 在测试群里 `@机器人` 发一句话
9. 如果群聊没反应，检查该群是否在 `groupAllowFrom` 中

如果私聊可用、群里 `@` 可用，说明飞书接入基本成功。

### 12.11 飞书配置文件示例

如果你不想只依赖向导，也可以直接在 `~/.openclaw/openclaw.json` 里写一个最小可用配置：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "connectionMode": "websocket",
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "requireMention": true,
      "groupAllowFrom": ["oc_xxx_group_id"],
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx",
          "name": "My AI assistant"
        }
      }
    }
  }
}
```

如果你使用的是国际版 Lark，可以在账号级别补：

```json
{
  "channels": {
    "feishu": {
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx",
          "domain": "lark"
        }
      }
    }
  }
}
```

### 12.12 飞书常见问题

#### 1. 能收消息但不回消息

优先排查：

- `App ID / App Secret` 是否填错
- Gateway 是否已重启
- 应用是否已经发布
- 当前群是否在 allowlist 中
- 是否要求 `@mention`
- 是否完成了 pairing 审批

#### 2. 国际版租户收不到

优先排查：

- 是否把 `domain` 设成了 `lark`
- 是否使用了对应国际版租户的凭据

#### 3. 事件订阅保存失败

优先排查：

- Feishu channel 是否已添加
- Gateway 是否正在运行
- 你是否选择的是 `WebSocket` 长连接模式

#### 4. 频繁触发 API 限额

官方文档给了两个优化开关：

- `typingIndicator`
- `resolveSenderNames`

如果你的机器人消息量较大，可以考虑关闭其中一项或两项：

```json
{
  "channels": {
    "feishu": {
      "typingIndicator": false,
      "resolveSenderNames": false
    }
  }
}
```

---

## 十三、飞书实战的一条推荐路线

如果你只想少踩坑，直接按下面顺序做：

1. 在 Windows 或 WSL2 中装好 OpenClaw
2. 先跑通 `openclaw dashboard`
3. 执行 `openclaw channels add`
4. 在飞书开放平台创建应用并拿到 `App ID / App Secret`
5. 批量导入权限
6. 开启 Bot 能力
7. 启用 `WebSocket` 事件订阅并添加 `im.message.receive_v1`
8. 发布应用
9. 执行 `openclaw gateway`
10. 在飞书里私聊机器人
11. 如果拿到配对码，用 `openclaw pairing approve feishu <CODE>` 审批
12. 再测试群聊

这条路径的优点是：

- 最符合官方文档设计
- 不需要额外公网 webhook
- 对 Windows 用户最友好

---

## 十四、国内应用实战：微信怎么接

这一节要先把结论说清楚。

截至 `2026-04-08`，我核对了 OpenClaw 官方渠道列表和官方文档入口：

- 有 `飞书` 官方文档
- 有 `WhatsApp`、`Telegram`、`Slack`、`Discord` 等官方渠道文档
- 没有找到 `微信` 或 `企业微信` 的官方渠道文档

这意味着：

- 目前**不能把“微信接入 OpenClaw”写成官方支持方案**
- 也不适合在教程里引导读者去使用未经官方文档支持的野路子方案

### 13.1 为什么这里不能乱写

因为微信生态和飞书、Slack 这类开放 Bot 平台不一样：

- 接入方式更敏感
- 第三方桥接方案稳定性差异很大
- 合规、封号、消息可靠性都可能有问题

如果教程在这里写得过于肯定，读者很容易踩大坑。

### 13.2 现阶段更稳妥的替代方案

如果你的目标是“在国内常用应用里用 OpenClaw”，当前更稳妥的选择是：

- `飞书`：官方支持，优先推荐
- `Dashboard / WebChat`：本地浏览器随时可用
- `Telegram`：如果你的网络环境允许，接入体验通常很好

### 13.3 如果你一定要在微信场景里使用

更务实的建议是：

1. 不要把微信作为你的第一接入渠道
2. 先把 `Dashboard` 和 `飞书` 跑通
3. 再单独评估是否要接入非官方桥接层
4. 非官方桥接一定要和正式生产环境隔离

也就是说，正确顺序应该是：

- 先建立一个稳定的 OpenClaw 核心网关
- 再考虑微信桥接

而不是一上来就把全部稳定性压在微信接入上。

### 13.4 一个现实判断

如果你是：

- 个人开发者
- 小团队内部使用
- 想低风险上线

那当前最现实的国内方案通常是：

- `飞书 + Dashboard`

而不是：

- 直接追求 `微信官方化接入`

---

## 十五、Windows 下最容易踩的坑

### 12.1 把“支持 Windows”误解成“原生 Windows 一定最优”

这恰恰是最容易踩的坑之一。

官方文档写得很明确：

- 原生 Windows 可用
- 但 `WSL2` 是更稳定、也更推荐的路径

所以如果你后面要长期运行、自动启动、接多渠道，不要硬扛原生 Windows。

### 12.2 Node 版本不对

先检查：

```powershell
node --version
```

如果版本太老，很多安装和运行问题都会跟着来。

### 12.3 `openclaw` 命令找不到

先检查：

```powershell
openclaw --version
node -v
```

如果安装完成但命令找不到，优先检查：

- 全局 npm 安装路径
- PATH 是否生效
- 当前终端是否重开

### 12.4 Dashboard 打不开

按这个顺序排查：

1. `openclaw gateway status`
2. `openclaw gateway run`
3. `openclaw dashboard`
4. 手动打开 `http://127.0.0.1:18789/`

### 12.5 浏览器里看到 unauthorized

根据官方 Dashboard 文档，如果本地页面提示 `unauthorized`，更稳妥的做法是：

```powershell
openclaw dashboard
```

让 CLI 帮你生成或打开带认证信息的链接，而不是自己盲猜 token。

### 12.6 一上来就暴露公网

官方明确提醒 Dashboard 是一个管理面板，能聊天、改配置、处理执行审批。  
所以不要图省事直接裸露到公网。

更安全的思路通常是：

- 本机 localhost
- Tailscale
- SSH 隧道

---

## 十六、从熟练到进阶：你应该掌握什么

如果你不只是想“能用”，而是想真正把 OpenClaw 用顺手，建议逐步掌握下面这些内容。

### 13.1 掌握服务运行方式

你要搞清楚：

- 现在 Gateway 是前台跑，还是后台服务跑
- 重启系统后会不会自动起来
- 当前平台的服务托管机制是什么

### 13.2 掌握配置与认证

你要搞清楚：

- Gateway 用的是什么认证方式
- token 放在哪里
- Dashboard 怎么取 token
- 哪些配置只适合本机，哪些可以用于远程访问

### 13.3 掌握渠道隔离

你要搞清楚：

- 不同渠道的会话是不是隔离的
- 群聊、私聊、线程会不会互相串上下文
- agent 与 session 的映射逻辑是什么

### 13.4 掌握运维思维

包括：

- 如何查状态
- 如何重启
- 如何看是否是配置问题、服务问题还是 token 问题
- 如何在升级前先备份关键配置

---

## 十七、一个适合大多数人的实践方案

如果你是个人开发者，想在 Windows 上稳定用 OpenClaw，可以直接按这套路线走。

### 方案一：只想快速体验

1. 原生 Windows PowerShell 安装
2. 执行 `openclaw onboard`
3. 打开 `openclaw dashboard`
4. 在浏览器里先聊天验证

### 方案二：准备长期使用

1. 安装 `WSL2 + Ubuntu`
2. 启用 `systemd`
3. 在 WSL2 中安装 OpenClaw
4. 执行 `openclaw onboard --install-daemon`
5. 先跑通 Dashboard
6. 再按需接 Telegram、Slack、Discord

如果只能给一个建议，那就是：

- `长期使用直接选 WSL2`
- 国内办公场景优先接 `飞书`
- `微信` 先不要当第一接入渠道

---

## 十八、常用命令速查

### 安装

```powershell
# 原生 Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

```bash
# WSL2 / Linux
curl -fsSL https://openclaw.ai/install.sh | bash
```

### onboarding

```powershell
openclaw onboard
openclaw onboard --install-daemon
```

### 诊断

```powershell
openclaw --version
openclaw doctor
openclaw status
openclaw gateway status
```

### 启动

```powershell
openclaw gateway run
openclaw dashboard
```

### 渠道管理

```powershell
openclaw channels list
openclaw channels status
openclaw channels add
openclaw gateway restart
openclaw pairing list feishu
openclaw pairing approve feishu <CODE>
```

### 原生 Windows 本地测试

```powershell
openclaw agent --local --agent main --thinking low -m "Reply with exactly WINDOWS-HATCH-OK."
```

---

## 十九、总结

在 Windows 上使用 OpenClaw，真正重要的不是“命令有没有记住”，而是先选对路径：

- 想快：原生 Windows
- 想稳：WSL2

然后按正确顺序推进：

- 先安装
- 再 onboarding
- 再跑通 Gateway
- 再打开 Dashboard
- 最后再接外部渠道

这样你基本不会在一开始就把问题复杂化。对于大多数人来说，先把本地 Dashboard 跑通，就是进入 OpenClaw 世界最稳的一步。

如果你的目标是接入国内应用，那么截至 `2026-04-08`，更稳妥的判断是：

- `飞书`：官方支持，可以实战接入
- `微信`：官方文档未见支持，不建议把它写成标准能力

所以真正实用的路线通常是：

- `Windows / WSL2 安装 OpenClaw`
- `跑通 Dashboard`
- `优先接飞书`
- `微信相关需求单独隔离评估`
