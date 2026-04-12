---
title: "CLIProxyAPI 接入 Gemini CLI 实战"
description: "基于 Windows 本机环境，讲解如何让 Gemini CLI 通过 CLIProxyAPI 走代理接口，包括环境变量、模型调用、非交互测试和常见问题排查"
keywords: "CLIProxyAPI,Gemini CLI,GOOGLE_GEMINI_BASE_URL,GEMINI_API_KEY,Google Gemini,API 代理,实战教程"

date: 2026-04-10T17:33:37+08:00
lastmod: 2026-04-10T17:33:37+08:00

math: false
mermaid: true

categories:
  - 百科全书
tags:
  - CLIProxyAPI
  - Gemini CLI
  - Google Gemini
  - API
  - 实战教程
---

如果你的目标是让 `Gemini CLI` 不直接连 Google 官方接口，而是先经过 `CLIProxyAPI`，那最关键的点不是“有没有 API key”，而是 Gemini CLI 到底支不支持改请求入口、你的代理是否暴露了兼容路径、以及模型名有没有对齐。

<!--more-->

这篇文章就按 Windows 本机环境来写，尽量用已经确认过的本机信息和包内事实来落地。

## 一、先说结论

截至 `2026-04-10`，我在这台机器上直接确认到：

- 全局已安装 `@google/gemini-cli@0.33.1`
- `gemini --help` 可正常输出
- 本机命令入口来自 `D:\nvm\nodejs\gemini.ps1`

同时，我在本机已安装包里确认到两类关键事实：

- README 明确使用 `GEMINI_API_KEY` 或 `GOOGLE_API_KEY` 做认证
- 源码中明确出现了 `GOOGLE_GEMINI_BASE_URL`

这意味着，从工程角度看，`Gemini CLI -> CLIProxyAPI -> 上游能力` 这条链路是可行的。

```mermaid
graph LR
    A[Gemini CLI] --> B[CLIProxyAPI]
    B --> C[上游能力]
```

---

## 二、开始前先确认本机状态

如果你不确定本机是否装了 Gemini CLI，可以先执行：

```powershell
Get-Command gemini | Format-List Path,Definition
npm list -g @google/gemini-cli --depth=0
gemini --help
```

我在这台机器上拿到的关键信息是：

- 命令路径是 `D:\nvm\nodejs\gemini.ps1`
- 全局包版本是 `@google/gemini-cli@0.33.1`
- `gemini --help` 显示支持：
  - `-p, --prompt`
  - `-m, --model`
  - `-o, --output-format`

这几个参数对联调已经够用了。

---

## 三、Gemini CLI 自己的默认认证方式

在本机已安装包的 README 里，Gemini CLI 给出的最基础认证方式是：

```bash
export GEMINI_API_KEY="YOUR_API_KEY"
gemini
```

另外也支持：

```bash
export GOOGLE_API_KEY="YOUR_API_KEY"
gemini
```

这说明 Gemini CLI 本身就是典型的“环境变量驱动”风格。

也就是说，如果你要让它走 `CLIProxyAPI`，最核心的两个问题就是：

1. 用哪个 key 环境变量
2. 怎么把 base URL 指到代理

---

## 四、Gemini CLI 怎么改请求入口

这一点如果不确认清楚，后面文章都没法写。

我在本机 `@google/gemini-cli` 安装包源码里直接查到了：

```text
GOOGLE_GEMINI_BASE_URL
```

而且对应代码里明确把它作为 Gemini API 的 base URL 环境变量处理。

所以从当前本机版本来看，一个更稳的接法就是：

- `GEMINI_API_KEY` 或 `GOOGLE_API_KEY`
- `GOOGLE_GEMINI_BASE_URL`

这不是纯猜测，是当前已安装包里能直接检索到的字段名。

---

## 五、先确认 CLIProxyAPI 自己能工作

在接 Gemini CLI 之前，先把代理层单独测通。

### 5.1 先看模型列表

```bash
curl http://127.0.0.1:你的端口/v1/models \
  -H "Authorization: Bearer 你的代理 key"
```

如果这里模型列表都拿不到，就不要继续往 Gemini CLI 上排了。

### 5.2 再测一次最小请求

```bash
curl http://127.0.0.1:你的端口/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的代理 key" \
  -d '{
    "model": "你的模型名",
    "messages": [
      {
        "role": "user",
        "content": "请回复：CLIProxyAPI 已可用于 Gemini CLI"
      }
    ],
    "stream": false
  }'
```

如果这一步通了，才有资格进入下一步。

---

## 六、最推荐的环境变量接法

对于 Gemini CLI 联调，我更建议你先用“当前终端临时生效”的方式，不要一上来就写系统环境变量。

### 6.1 PowerShell 临时设置

在当前 PowerShell 会话里：

```powershell
$env:GEMINI_API_KEY = "你的代理 key"
$env:GOOGLE_GEMINI_BASE_URL = "http://127.0.0.1:你的端口"
```

如果你的代理更偏向识别 Google 风格 key 变量，也可以改成：

```powershell
$env:GOOGLE_API_KEY = "你的代理 key"
$env:GOOGLE_GEMINI_BASE_URL = "http://127.0.0.1:你的端口"
```

### 6.2 为什么建议先临时设置

因为你现在做的是联调，不是长期固化配置。

临时设置的好处是：

- 不污染系统环境
- 改错了关掉终端就恢复
- 更容易做 A/B 测试

如果你确认链路稳定，再决定要不要写入系统环境变量或启动脚本。

---

## 七、第一次联调怎么测

不要一上来就开交互式长会话。  
Gemini CLI 当前版本已经支持非交互模式，先测这个最稳。

### 7.1 最小非交互测试

本机 `gemini --help` 已确认支持：

```text
-p, --prompt
```

所以可以先跑：

```powershell
gemini -p "请回复：Gemini CLI 已通过 CLIProxyAPI 连通"
```

如果你已经设置好了环境变量，这条命令就应该通过代理层发出请求。

### 7.2 指定模型测试

本机帮助还确认支持：

```text
-m, --model
```

所以你可以再显式测一次：

```powershell
gemini -m "你的模型名" -p "请回复：指定模型测试成功"
```

这里的模型名必须和代理层实际支持的一致。

### 7.3 输出 JSON 便于排错

Gemini CLI 还支持：

```text
-o, --output-format
```

所以可以这样测：

```powershell
gemini -p "请回复：JSON 输出测试成功" -o json
```

这样更适合看清楚：

- 是不是请求根本没出去
- 还是返回结构有兼容问题

---

## 八、一个推荐的完整联调顺序

如果你想少踩坑，我建议按这个顺序：

1. 启动 `CLIProxyAPI`
2. 用 `curl /v1/models` 验证代理层活着
3. 用 `curl /v1/chat/completions` 验证代理层可用
4. 在 PowerShell 临时设置 `GEMINI_API_KEY`
5. 再设置 `GOOGLE_GEMINI_BASE_URL`
6. 用 `gemini -p` 做最小联调
7. 再用 `gemini -m ... -p ...` 指定模型测试
8. 最后再进入交互式 `gemini`

这个顺序的最大好处是，任何一步失败时，你都知道问题大概落在哪一层。

---

## 九、一个更贴近实战的临时启动模板

你完全可以把联调阶段写成一组 PowerShell 命令：

```powershell
$env:GEMINI_API_KEY = "your_proxy_key"
$env:GOOGLE_GEMINI_BASE_URL = "http://127.0.0.1:8317"

gemini -m "gemini-2.5-flash" -p "请回复：Gemini CLI 代理测试成功" -o json
```

这里的思路很简单：

- key 用代理层要识别的 key
- base URL 指向代理入口
- 模型名用代理层对外暴露的模型名

一旦这组命令能稳定成功，你再考虑把它固化到自己的环境中。

---

## 十、常见问题排查

### 10.1 `gemini -p` 没反应或直接失败

优先排查：

- `CLIProxyAPI` 是否正在运行
- `GOOGLE_GEMINI_BASE_URL` 是否写对
- key 是否真的生效在当前终端里

### 10.2 代理层直连成功，但 Gemini CLI 不工作

优先排查：

- Gemini CLI 当前到底读的是 `GEMINI_API_KEY` 还是 `GOOGLE_API_KEY`
- 当前终端环境变量有没有被旧值覆盖
- 代理层是否支持 Gemini CLI 请求协议

### 10.3 模型找不到

优先排查：

- `/v1/models` 里真实暴露的模型名
- `gemini -m` 使用的模型名
- 代理里是否做了 alias，而你写成了原始名

### 10.4 交互式能用，`-p` 不能用

优先排查：

- 非交互模式是不是走了不同的默认行为
- 输出格式是否影响了错误显示
- 当前命令是否显式指定了不兼容模型

### 10.5 代理路径不兼容

这是一个需要特别注意的问题。

Gemini CLI 最终打到哪个具体路径，不要靠猜。  
更稳的做法是：

1. 先看 `CLIProxyAPI` 给 Gemini 路由暴露的实际接口
2. 再看 Gemini CLI 当前版本通过 `GOOGLE_GEMINI_BASE_URL` 是怎么拼路径的
3. 以实际返回和日志为准

如果 base URL 写对了但仍然 404，通常就是路径兼容问题。

---

## 十一、本机已确认事实和工程推断

为了避免把“当前机器正好能这么配”误当成“所有未来版本都完全一样”，这里把边界写清楚。

### 11.1 本机已确认事实

截至 `2026-04-10`，这台机器上已直接确认到：

- `@google/gemini-cli@0.33.1` 已安装
- `gemini --help` 支持 `-p`、`-m`、`-o`
- 已安装包 README 明确使用 `GEMINI_API_KEY` / `GOOGLE_API_KEY`
- 已安装包源码中明确出现 `GOOGLE_GEMINI_BASE_URL`

### 11.2 基于当前环境的工程推断

下面这些属于高可信的工程推断：

- Gemini CLI 可以通过 `GOOGLE_GEMINI_BASE_URL` 指向自定义代理入口
- 只要代理层正确处理 Gemini CLI 的请求协议和认证，Gemini CLI 可以通过 CLIProxyAPI 联调成功

如果你后面升级 Gemini CLI，环境变量名和路径兼容逻辑仍建议再用本机包内容或官方仓库复核一遍。

---

## 十二、总结

`CLIProxyAPI 接 Gemini CLI` 这件事，真正决定成败的不是“装没装 gemini 命令”，而是：

- `CLIProxyAPI` 自己先要可用
- `GEMINI_API_KEY` 或 `GOOGLE_API_KEY` 要对
- `GOOGLE_GEMINI_BASE_URL` 要对
- 模型名要和代理层对齐

所以最稳的路径始终是：

1. 先用 `curl` 测通代理层
2. 再临时设置 Gemini CLI 环境变量
3. 先用 `gemini -p` 做最小联调
4. 最后再进入交互式会话

---

## 相关文档

- [EasyCLI、CLIProxyAPI 和 new-api 的区别与使用指南](./EasyCLI、CLIProxyAPI%20和%20new-api%20的区别与使用指南.md)
- [CLIProxyAPI 与 new-api 接口联调实战](./CLIProxyAPI%20与%20new-api%20接口联调实战.md)
- [CLIProxyAPI 接入 Codex CLI 实战](./CLIProxyAPI%20接入%20Codex%20CLI%20实战.md)
- [CLIProxyAPI 接入 Claude Code 实战](./CLIProxyAPI%20接入%20Claude%20Code%20实战.md)

## 参考资料

- Gemini CLI repository: <https://github.com/google-gemini/gemini-cli>
- CLIProxyAPI: <https://github.com/router-for-me/CLIProxyAPI>
