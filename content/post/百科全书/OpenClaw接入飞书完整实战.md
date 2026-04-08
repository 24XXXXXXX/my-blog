---
title: "OpenClaw 接入飞书完整实战"
description: "详细讲解 OpenClaw 如何在 Windows 或 WSL2 环境下接入飞书，包括应用创建、权限配置、事件订阅、pairing 审批、群聊策略与常见问题排查"
keywords: "OpenClaw,飞书,Lark,Feishu,OpenClaw接入飞书,机器人,AI代理"

date: 2026-04-08T11:10:00+08:00
lastmod: 2026-04-08T11:10:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - OpenClaw
  - 飞书
  - Lark
  - AI
  - 实战教程
---

如果你已经在 Windows 或 WSL2 中装好了 OpenClaw，下一步最适合国内办公场景的渠道，通常就是飞书。相比很多“能不能曲线接微信”的想法，飞书是官方有文档、有渠道插件、有明确接入流程的方案，稳定性和可维护性都更好。

<!--more-->

## 一、先说结论

截至 `2026-04-08`，根据 OpenClaw 官方文档：

- `飞书 / Lark` 已有官方渠道支持
- 飞书插件随 OpenClaw 发行版打包提供
- 官方推荐优先使用 `WebSocket` 事件订阅
- 私聊默认走 `pairing` 审批模式
- 群聊建议配合 `allowlist + requireMention`

如果你只想先少踩坑，最稳的路线是：

1. 先让 `OpenClaw Dashboard` 跑通
2. 再创建飞书应用
3. 用 `openclaw channels add` 接入飞书
4. 配置权限和事件订阅
5. 发布应用
6. 用私聊完成第一次 `pairing`
7. 再测试群聊

---

## 二、开始前需要准备什么

开始前建议你已经具备下面这些条件：

- 已安装 `OpenClaw`
- 本机能正常执行 `openclaw`
- `Gateway` 可以正常启动
- 已有一个可用的模型提供商配置
- 你拥有飞书开放平台的操作权限

先在本机验证：

```powershell
openclaw --version
openclaw gateway status
openclaw dashboard
```

如果这三步都还没打通，先不要急着接飞书。

---

## 三、飞书接入的整体架构

在 OpenClaw 里接入飞书，本质上是这条链路：

1. 飞书用户发消息
2. 飞书事件推送给 OpenClaw 的 Feishu channel
3. Gateway 接收事件并路由给 agent
4. 模型完成生成
5. OpenClaw 再把消息回发到飞书

这件事里最关键的三块分别是：

- 飞书开放平台应用配置
- OpenClaw 渠道配置
- Gateway 在线状态

其中任何一块没对上，机器人都可能表现为：

- 能收到但不回复
- 完全收不到
- 私聊能用，群聊不能用

---

## 四、在飞书开放平台创建应用

### 4.1 创建企业自建应用

进入飞书开放平台后：

1. 创建应用
2. 选择企业自建应用
3. 填写应用名称、描述、图标

创建完成后，先进入：

- `凭证与基础信息`

记下这两个核心值：

- `App ID`
- `App Secret`

这两个值后面要填到 OpenClaw 的飞书配置里。

### 4.2 记录事件安全相关参数

在飞书开放平台中继续找到：

- `开发配置`
- `事件与回调`
- `加密策略`

这里通常还会看到：

- `Verification Token`
- `Encrypt Key`

后续如果你需要排查事件订阅相关问题，这两个值经常会用到，建议一开始就先记下来。

---

## 五、给飞书应用开权限

这是最容易导致“机器人不工作”的地方。

根据 OpenClaw 官方飞书文档，推荐直接在飞书开放平台使用 `Batch import` 批量导入权限。

### 5.1 打开权限配置页面

进入：

- `Permissions`

然后点击：

- `Batch import`

### 5.2 导入官方推荐权限

把下面这段 JSON 粘贴进去：

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

如果你只是做最基础的聊天，有些权限未来可能用不上；但实战里更稳妥的做法是先按官方推荐导入，后面就不用来回补权限。

---

## 六、开启 Bot 能力

在飞书开放平台中找到：

- `App Capability`
- `Bot`

把 Bot 功能开启，并补充：

- 机器人名称
- 机器人简介
- 机器人头像

这一步完成后，飞书侧才真正具备“机器人”形态。

---

## 七、先在 OpenClaw 中添加飞书渠道

这里的顺序很重要。  
不要先把飞书事件订阅折腾半天，再来配 OpenClaw。更稳妥的顺序是先把 OpenClaw 侧渠道建好。

### 7.1 使用命令行添加飞书

在 Windows PowerShell 或 WSL2 终端中执行：

```powershell
openclaw channels add
```

然后在交互式提示中选择：

- `Feishu`

接着输入：

- `App ID`
- `App Secret`

### 7.2 检查渠道是否已加入

```powershell
openclaw channels list
openclaw channels status
```

如果能看到飞书渠道，说明 OpenClaw 侧基本已经接好了。

### 7.3 启动 Gateway

```powershell
openclaw gateway
```

或者先检查状态：

```powershell
openclaw gateway status
```

后面去飞书开放平台配置事件订阅时，最好保持 Gateway 已经在线。

---

## 八、配置事件订阅

根据 OpenClaw 官方飞书文档，推荐的方式是：

- `Use long connection to receive events (WebSocket)`

这意味着：

- 不需要额外暴露公网 webhook
- 对本机和内网环境更友好
- 对 Windows / WSL2 用户更省事

### 8.1 开启事件订阅

进入飞书开放平台：

- `Event Subscription`

选择：

- `Use long connection to receive events (WebSocket)`

### 8.2 添加消息事件

至少添加：

- `im.message.receive_v1`

如果你未来还打算接飞书文档评论等高级场景，可以再加：

- `drive.notice.comment_add_v1`

### 8.3 一个常见坑

如果你发现事件订阅保存失败，优先排查：

- 飞书 channel 是否已经加到 OpenClaw
- Gateway 是否正在运行
- 你是否选择的是 `WebSocket` 而不是其他模式

---

## 九、发布应用并安装到组织

这一步很多人会漏掉，但没发布就别指望机器人真正开始工作。

### 9.1 创建版本

进入：

- `Version Management & Release`

创建一个新版本。

### 9.2 提交审核和发布

按飞书开放平台要求提交审核并发布。

### 9.3 安装到组织

发布后，确保：

- 应用已经安装到你的飞书组织

如果没有安装，用户可能根本找不到机器人，或者找到了也无法正常交互。

---

## 十、第一次私聊为什么会返回配对码

这是 OpenClaw 官方飞书插件的默认安全设计，不是出错。

默认私聊策略是：

```text
dmPolicy: "pairing"
```

这意味着：

- 陌生用户第一次私聊机器人
- 机器人不会直接开始聊天
- 而是先回一个 `pairing code`

你需要在本机审批。

### 10.1 查看待审批配对

```powershell
openclaw pairing list feishu
```

### 10.2 审批配对码

```powershell
openclaw pairing approve feishu <CODE>
```

审批后，这个用户才能和机器人正常继续对话。

### 10.3 为什么官方要这么设计

因为这能避免：

- 任何人一加机器人就直接调用模型
- 群体环境里被滥用
- 还没准备好权限策略时被随意访问

所以对团队内部场景，这个机制其实很合理。

---

## 十一、群聊里怎么设置才稳

飞书群聊如果不做约束，机器人很容易变成“谁说话都插嘴”，这在办公场景里基本不可接受。

OpenClaw 官方飞书配置里，最值得关注的是这些项：

- `groupPolicy`
- `groupAllowFrom`
- `requireMention`
- `dmPolicy`

### 11.1 推荐策略

对大多数团队，我更建议这样配：

- 群聊只允许指定群
- 群聊必须 `@机器人`
- 私聊继续走 `pairing`

最小思路如下：

```json
{
  "channels": {
    "feishu": {
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "requireMention": true,
      "groupAllowFrom": ["oc_xxx_group_id"]
    }
  }
}
```

### 11.2 为什么这么配

这样做的好处很直接：

- 避免机器人在所有群自动发言
- 不会被普通聊天误触发
- 更适合真实办公群

### 11.3 一个默认值提醒

官方默认行为和配置组合是有关联的，不建议靠“猜默认”来运行。  
更稳妥的办法是把关键策略显式写出来，尤其是：

- `groupPolicy`
- `requireMention`

---

## 十二、飞书配置文件示例

如果你想直接看一个最小可用的 Feishu channel 配置，可以参考下面这种写法。

### 12.1 国内飞书示例

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

### 12.2 国际版 Lark 示例

如果你用的是国际版 `Lark`，要显式指定：

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

如果你不写 `domain: "lark"`，国际版环境很容易直接接不上。

---

## 十三、完整测试流程

接完以后，不要一股脑就拉群里上生产。  
先按这条路径逐步测试。

### 13.1 第一步：确认本机 Gateway 正常

```powershell
openclaw gateway status
```

### 13.2 第二步：确认飞书渠道存在

```powershell
openclaw channels list
openclaw channels status
```

### 13.3 第三步：私聊机器人

在飞书里找到机器人，给它发一条消息。

可能出现两种结果：

- 直接回复
- 返回一个配对码

如果返回配对码，就执行：

```powershell
openclaw pairing approve feishu <CODE>
```

然后再发第二条消息。

### 13.4 第四步：拉进测试群

把机器人拉进一个测试群，不要一开始就拉进正式工作群。

然后：

- `@机器人`
- 发送一句简单问题

如果群里没反应，优先检查：

- 群是否在 `groupAllowFrom` 中
- 是否要求 `requireMention`

### 13.5 第五步：再决定是否扩大范围

只有在下面都稳定后，再考虑推广到更多群：

- 私聊稳定
- pairing 流程明确
- 群聊触发策略明确
- 不会乱回复

---

## 十四、常见问题排查

### 14.1 能收消息但不回

优先排查：

- `App ID` 或 `App Secret` 是否填错
- 应用是否已经发布
- Gateway 是否正在运行
- 是否还没完成 `pairing approve`
- 模型配置是否本身就不可用

### 14.2 私聊返回配对码，看起来像坏了

这不是坏了，这是默认安全策略。

执行：

```powershell
openclaw pairing list feishu
openclaw pairing approve feishu <CODE>
```

### 14.3 群聊里机器人不说话

优先排查：

- 是否必须 `@mention`
- 群是否在 `groupAllowFrom`
- `groupPolicy` 是否过于严格

### 14.4 国际版 Lark 接不上

优先排查：

- 是否配置了 `domain: "lark"`
- 当前凭据是否属于国际版租户

### 14.5 事件订阅保存失败

优先排查：

- 事件订阅是否使用 `WebSocket`
- Gateway 是否在线
- Feishu channel 是否已经先加进 OpenClaw

---

## 十五、推荐的一套上线方式

如果你是团队内部使用，我建议按这个节奏上线：

1. 开发机先用 `Dashboard` 跑通
2. 飞书应用先只给你自己测试
3. 私聊通过 `pairing` 放行少量用户
4. 先开一个测试群
5. 群聊必须 `@机器人`
6. 只给 allowlist 中的群开放
7. 观察几天后再扩到正式群

这套方法虽然慢一点，但非常稳。

---

## 十六、常用命令速查

```powershell
# 查看版本
openclaw --version

# 查看 Gateway 状态
openclaw gateway status

# 启动 Gateway
openclaw gateway

# 打开 Dashboard
openclaw dashboard

# 添加渠道
openclaw channels add

# 查看渠道
openclaw channels list
openclaw channels status

# 查看待审批配对
openclaw pairing list feishu

# 审批配对码
openclaw pairing approve feishu <CODE>
```

---

## 十七、总结

OpenClaw 接飞书这件事，真正的关键不是命令本身，而是顺序要对：

- 先把 OpenClaw 本机能力跑通
- 再创建飞书应用
- 再导入权限
- 再接渠道
- 再开事件订阅
- 再发布
- 最后用 `pairing` 和群策略做安全收口

只要这个顺序不乱，飞书会是目前国内办公场景里最适合 OpenClaw 落地的官方渠道之一。
