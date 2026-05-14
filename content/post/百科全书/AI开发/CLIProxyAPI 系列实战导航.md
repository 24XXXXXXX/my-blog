---
title: "CLIProxyAPI 系列实战导航"
description: "汇总 EasyCLI、CLIProxyAPI、new-api 以及 Codex CLI、Claude Code、Gemini CLI 接入实战文章，给出阅读顺序与场景导航"
keywords: "CLIProxyAPI,EasyCLI,new-api,Codex CLI,Claude Code,Gemini CLI,实战导航,系列目录"

date: 2026-04-10T17:55:46+08:00
lastmod: 2026-04-10T17:55:46+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - CLIProxyAPI
  - EasyCLI
  - new-api
  - Codex CLI
  - Claude Code
  - Gemini CLI
  - 导航
---

如果你是从零开始接触 `EasyCLI`、`CLIProxyAPI`、`new-api`，或者准备把 `Codex CLI`、`Claude Code`、`Gemini CLI` 接到同一个代理层，这个页面可以当成整个系列的总入口。

<!--more-->

这组文章不是按“发布时间”组织的，而是按“从概念到联调、再到具体客户端接入”的顺序写的。  
所以最省时间的读法，不是随便挑一篇，而是按下面的路径往下走。

## 一、推荐阅读顺序

如果你还没搞清楚这几个项目分别是干什么的，先读：

1. [EasyCLI、CLIProxyAPI 和 new-api 的区别与使用指南](./EasyCLI、CLIProxyAPI%20和%20new-api%20的区别与使用指南.md)

如果你已经大概理解角色分工，下一步该读：

2. [CLIProxyAPI 与 new-api 接口联调实战](./CLIProxyAPI%20与%20new-api%20接口联调实战.md)

如果你已经准备接具体的终端工具，再按你的客户端继续读：

3. [CLIProxyAPI 接入 Codex CLI 实战](./CLIProxyAPI%20接入%20Codex%20CLI%20实战.md)
4. [CLIProxyAPI 接入 Claude Code 实战](./CLIProxyAPI%20接入%20Claude%20Code%20实战.md)
5. [CLIProxyAPI 接入 Gemini CLI 实战](./CLIProxyAPI%20接入%20Gemini%20CLI%20实战.md)

这一套顺序的核心逻辑是：

- 先搞清楚谁负责什么
- 再搞清楚整条链路怎么联调
- 最后再看具体客户端怎么接

---

## 二、按场景怎么选文章

### 2.1 只想先理解三者关系

直接看：

- [EasyCLI、CLIProxyAPI 和 new-api 的区别与使用指南](./EasyCLI、CLIProxyAPI%20和%20new-api%20的区别与使用指南.md)

这篇主要解决：

- `EasyCLI` 是什么
- `CLIProxyAPI` 是什么
- `new-api` 是什么
- 三者怎么组合

### 2.2 已经准备开始联调 API

直接看：

- [CLIProxyAPI 与 new-api 接口联调实战](./CLIProxyAPI%20与%20new-api%20接口联调实战.md)

这篇主要解决：

- 先测哪一层
- 用 `curl` 或 PowerShell 怎么测
- 直连代理和经过网关怎么比较
- 常见报错怎么缩小范围

### 2.3 想接 Codex CLI

直接看：

- [CLIProxyAPI 接入 Codex CLI 实战](./CLIProxyAPI%20接入%20Codex%20CLI%20实战.md)

这篇主要解决：

- `~/.codex/config.toml` 怎么配
- `custom` provider 怎么接代理
- `codex login --with-api-key` 怎么配合用

### 2.4 想接 Claude Code

直接看：

- [CLIProxyAPI 接入 Claude Code 实战](./CLIProxyAPI%20接入%20Claude%20Code%20实战.md)

这篇主要解决：

- `~/.claude/settings.json` 怎么写
- `ANTHROPIC_AUTH_TOKEN`
- `ANTHROPIC_BASE_URL`
- Beta 头和流式兼容问题

### 2.5 想接 Gemini CLI

直接看：

- [CLIProxyAPI 接入 Gemini CLI 实战](./CLIProxyAPI%20接入%20Gemini%20CLI%20实战.md)

这篇主要解决：

- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `GOOGLE_GEMINI_BASE_URL`
- `gemini -p` 非交互联调

---

## 三、这组文章的结构怎么理解

你可以把这个系列理解成三层：

### 3.1 第一层：概念和职责

- [EasyCLI、CLIProxyAPI 和 new-api 的区别与使用指南](./EasyCLI、CLIProxyAPI%20和%20new-api%20的区别与使用指南.md)

### 3.2 第二层：通用联调方法

- [CLIProxyAPI 与 new-api 接口联调实战](./CLIProxyAPI%20与%20new-api%20接口联调实战.md)

### 3.3 第三层：具体客户端接入

- [CLIProxyAPI 接入 Codex CLI 实战](./CLIProxyAPI%20接入%20Codex%20CLI%20实战.md)
- [CLIProxyAPI 接入 Claude Code 实战](./CLIProxyAPI%20接入%20Claude%20Code%20实战.md)
- [CLIProxyAPI 接入 Gemini CLI 实战](./CLIProxyAPI%20接入%20Gemini%20CLI%20实战.md)

这也是为什么这个系列里，后面的文章不会重复讲太多 `EasyCLI` 或 `new-api` 的基础概念。  
因为那些已经在前面的文章里拆开讲过了。

---

## 四、如果你只想看最短路径

不同目标下，最短阅读路径可以直接这样选：

- 想知道三者有啥区别：
  [EasyCLI、CLIProxyAPI 和 new-api 的区别与使用指南](./EasyCLI、CLIProxyAPI%20和%20new-api%20的区别与使用指南.md)

- 想先把代理链路跑通：
  [CLIProxyAPI 与 new-api 接口联调实战](./CLIProxyAPI%20与%20new-api%20接口联调实战.md)

- 想接 Codex CLI：
  [CLIProxyAPI 接入 Codex CLI 实战](./CLIProxyAPI%20接入%20Codex%20CLI%20实战.md)

- 想接 Claude Code：
  [CLIProxyAPI 接入 Claude Code 实战](./CLIProxyAPI%20接入%20Claude%20Code%20实战.md)

- 想接 Gemini CLI：
  [CLIProxyAPI 接入 Gemini CLI 实战](./CLIProxyAPI%20接入%20Gemini%20CLI%20实战.md)

---

## 五、后续可以继续扩什么

如果后面还要继续扩这个系列，比较自然的方向通常有：

- `CLIProxyAPI + Qwen Code` 实战
- `CLIProxyAPI + Amp CLI` 实战
- `CLIProxyAPI + 多账号轮询` 实战
- `CLIProxyAPI + Docker 部署` 实战
- `CLIProxyAPI + new-api + Nginx` 对外部署实战

也就是说，当前这几篇更像是第一阶段：

- 把结构讲清楚
- 把接口联调讲清楚
- 把主流 AI CLI 接入讲清楚

---

## 六、系列文章索引

- [EasyCLI、CLIProxyAPI 和 new-api 的区别与使用指南](./EasyCLI、CLIProxyAPI%20和%20new-api%20的区别与使用指南.md)
- [CLIProxyAPI 与 new-api 接口联调实战](./CLIProxyAPI%20与%20new-api%20接口联调实战.md)
- [CLIProxyAPI 接入 Codex CLI 实战](./CLIProxyAPI%20接入%20Codex%20CLI%20实战.md)
- [CLIProxyAPI 接入 Claude Code 实战](./CLIProxyAPI%20接入%20Claude%20Code%20实战.md)
- [CLIProxyAPI 接入 Gemini CLI 实战](./CLIProxyAPI%20接入%20Gemini%20CLI%20实战.md)

如果你后面继续补这个系列，这个页面也可以作为统一导航入口继续扩下去。
