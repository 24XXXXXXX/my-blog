---
title: "Windows 使用 WSL2 和 Ubuntu 搭建 OpenClaw 双微信 Bot 自动审批系统完全指南"
date: 2026-05-19T11:20:00+08:00
draft: false
tags: ["WSL2", "Ubuntu", "OpenClaw", "微信Bot", "SDKMAN", "NVM", "Node.js", "systemd", "AI开发"]
categories: ["百科全书", "AI开发工具"]
description: "从 Windows 安装 WSL2 和 Ubuntu 开始，细讲 Ubuntu 环境初始化、NVM/SDKMAN、Python、OpenClaw、双微信 Bot、自动配对审批、sender 隔离路由、本地插件 fork 与 systemd 服务化。"
---

## 这篇文章解决什么问题

本文把一整套真实落地过程整理成一篇完整教程：

1. 在 Windows 上安装 `WSL2 + Ubuntu`
2. 初始化 Ubuntu 开发环境
3. 用 `NVM` 管理 `Node.js`
4. 用 `SDKMAN` 管理 `JDK` 和 `Maven`
5. 安装稳定版 `Python 3`
6. 安装并配置 `OpenClaw`
7. 接入第三方 OpenAI 兼容 API
8. 打通两个微信 Bot
9. 做出一套更安全的结构：
   - 你的自用高权限 Bot
   - 访客共用低权限 Bot
   - 配对码自动通知
   - 你的微信回复“批准 <code>”即可审批
   - 按微信发送者隔离上下文和工作区
10. 为后续定制能力准备本地插件 fork

这不是一篇“跑通 hello world”的文章，而是一篇把系统真正搭起来的实战记录。

---

## 最终结构先看懂

在开始具体命令之前，先明确最后做成的样子：

### 1. 宿主环境

- Windows 作为宿主系统
- `WSL2` 作为 Linux 运行层
- `Ubuntu 24.04` 作为主要工作环境
- `Docker Desktop` 继续使用 Windows 侧，不在 Ubuntu 里单独装 Docker Engine

### 2. OpenClaw 运行层

- `OpenClaw` 安装在 Ubuntu 中
- `gateway` 运行在本机 `127.0.0.1:18789`
- `systemd` 管理常驻服务

### 3. 两个微信 Bot 的职责分离

- **Owner Bot**：只给你自己用，高权限
- **Guest Bot**：给别人聊 AI，用低权限，不能碰你的电脑高危能力

### 4. 关键安全设计

- 你的微信 sender id 单独识别
- 外部用户走 guest bot
- guest bot 的每个 sender 独立会话作用域
- guest 侧新配对请求会自动通知 owner bot
- 你在微信里回复 `批准 <code>` 就能审批，不用回终端敲命令

这套结构的核心目的不是“功能更多”，而是**把高权限自动化和多人接入拆开**。只要你以后真的让别人接进来，这一步就非常值。

---

## 一、为什么不用纯 Windows，改用 WSL2 + Ubuntu

OpenClaw 这类工具虽然可以在 Windows 上运行，但如果你准备长期折腾：

- Node.js 版本管理
- Java 多版本切换
- Python 环境
- 本地插件开发
- systemd 常驻服务
- CLI 工具链

那么 Linux 用户态通常比原生 Windows 更稳定，也更接近主流开源项目的默认运行环境。

### WSL2 的优势

`WSL2` 是 Windows Subsystem for Linux 2，简单说就是 Windows 里的轻量 Linux 虚拟化环境。

相比直接在 Windows 上装一堆工具，它有几个明显好处：

1. 包管理统一  
   Ubuntu 里用 `apt`，很多依赖一条命令就能补齐。

2. 路径和权限语义更接近 Linux 服务器  
   这对 Node、shell 脚本、插件开发、systemd 都更友好。

3. 可以保留 Windows 生态  
   比如继续用：
   - Windows Terminal
   - Docker Desktop
   - 浏览器
   - GitHub Desktop 或 Windows Git

4. 出问题更容易按 Linux 思路排查  
   很多文档默认就假设你在 Linux/macOS 上。

所以这套架构本质上是：

**Windows 负责桌面和宿主；Ubuntu 负责 AI agent 和开发运行时。**

---

## 二、在 Windows 安装 WSL2 和 Ubuntu

### 1. 查看可安装的发行版

先在 PowerShell 里执行：

```powershell
wsl --list --online
```

这个命令的参数含义：

- `wsl`：调用 Windows Subsystem for Linux
- `--list`：列出项目
- `--online`：列出微软源中可下载安装的发行版，而不是本机已安装的

如果你只记得短写，也可以写成：

```powershell
wsl -l -o
```

其中：

- `-l` 等价于 `--list`
- `-o` 等价于 `--online`

### 2. 直接安装 Ubuntu 24.04

```powershell
wsl --install -d Ubuntu-24.04
```

参数解释：

- `--install`：执行安装流程
- `-d`：指定 distro，也就是 Linux 发行版
- `Ubuntu-24.04`：安装 Ubuntu 24.04

如果你机器上已经装过 WSL，那么这条命令通常会直接装指定发行版；如果没装过，它还会顺带启用 WSL 所需组件。

### 3. 安装完成后查看当前状态

```powershell
wsl -l -v
```

参数解释：

- `-l`：列出已安装发行版
- `-v`：显示版本信息，包括是不是 `WSL2`

你当时看到的是类似下面的结果：

```text
  NAME              STATE           VERSION
* Ubuntu-24.04      Running         2
  docker-desktop    Running         2
```

这说明：

- `Ubuntu-24.04` 已经装好
- 当前正在运行
- 使用的是 `WSL2`
- `docker-desktop` 也通过 WSL 集成在运行

### 4. 首次进入 Ubuntu

安装完成第一次启动时，系统会让你创建 Linux 用户。你这里创建的是：

- 用户名：`jjx`

后续所有日常开发、OpenClaw 安装、插件修改，都应该优先用这个普通用户，而不是长期用 `root`。

这是一个非常重要的习惯：

- 普通用户更安全
- 配置文件会落在 `/home/jjx`
- OpenClaw 的用户态配置、systemd user service、NVM、SDKMAN 都更适合装在普通用户下

也正因为如此，后面凡是需要系统权限的地方，我们都用 `sudo` 临时提权，而不是整套环境都在 `root` 用户下面装。

---

## 三、先把 WSL 的基础行为调顺

这一节很关键。很多人 OpenClaw 没跑稳，不是 OpenClaw 本身有问题，而是 WSL 网络、代理、systemd 没处理好。

### 1. 配置 `C:\Users\JJX\.wslconfig`

Windows 侧的 `.wslconfig` 控制的是 **WSL 虚拟机级别行为**。

建议内容如下：

```ini
[wsl2]
networkingMode=mirrored
autoProxy=true
dnsTunneling=true
firewall=true
```

参数解释：

- `networkingMode=mirrored`  
  使用镜像网络模式，让 WSL 的网络更接近宿主机，很多本地回环、代理、发现行为都更自然。

- `autoProxy=true`  
  自动同步 Windows 主机代理到 WSL。  
  如果你平时会开关代理，这个很有用。

- `dnsTunneling=true`  
  让 DNS 查询更稳定，减少某些环境里“能开网页但命令行解析不了域名”的问题。

- `firewall=true`  
  让 WSL 网络流量仍然受 Windows 防火墙管理，通常更稳妥。

### 2. 配置 Ubuntu 里的 `/etc/wsl.conf`

Linux 侧要开启 `systemd`，否则后面很多服务化能力会打折扣。

编辑 `/etc/wsl.conf`：

```ini
[boot]
systemd=true
```

参数解释：

- `[boot]`：启动相关配置段
- `systemd=true`：让 WSL 启动后以 `systemd` 作为 init 系统

为什么要开 `systemd`？

因为后面你会希望这些东西稳定常驻：

- OpenClaw gateway
- guest pairing notifier
- 未来你自己的其他 agent 辅助服务

如果没有 `systemd`，你就会越来越依赖手动开终端、手动挂后台，维护成本明显更高。

### 3. 改完配置后重启 WSL

```powershell
wsl --shutdown
```

参数解释：

- `--shutdown`：关闭所有 WSL 发行版和底层轻量虚拟机

这个命令的作用不是“删东西”，只是让配置重新生效。

如果你只想重启某一个发行版，也可以用：

```powershell
wsl --terminate Ubuntu-24.04
```

参数解释：

- `--terminate`：只停止指定发行版
- `Ubuntu-24.04`：目标发行版名称

### 4. 代理切换后，WSL 提示“在主机检测到代理更改，请重启 WSL 应用更改”，怎么办

你后面问过一个很实际的问题：

> 每次关闭代理，WSL 提示在主机检测到代理更改，要不要先 `exit` 再重新进 Ubuntu？有没有不用 `exit` 的方法？

结论先说：

**本质上还是要让 WSL 里的这一轮 shell 会话重建。**

最稳的办法是：

1. 在 Windows 侧执行：

```powershell
wsl --shutdown
```

2. 然后重新打开一个 Ubuntu 终端

原因是：

- `autoProxy=true` 会把宿主机代理信息注入 WSL
- 代理状态变化后，已经跑着的 Linux shell 不会自动热重载全部环境
- 你可以不一定手动先敲 `exit`
- 但最终仍然需要**重新进入一个新的 WSL 会话**

也就是说：

- **不一定非要先在当前终端里 `exit`**
- 但**一定要让旧会话结束并重建**

如果你只是想快一点，通常直接在 Windows 侧 `wsl --shutdown`，然后新开一个 Ubuntu tab 就行。

---

## 四、初始化 Ubuntu 基础环境

Ubuntu 刚装好时几乎是“毛坯房”。先把基础工具补齐。

### 1. 更新软件索引

```bash
sudo apt update
```

参数解释：

- `sudo`：以管理员权限执行
- `apt`：Ubuntu/Debian 包管理器
- `update`：更新本地软件索引，不是升级软件本体

### 2. 升级已有软件包

```bash
sudo apt upgrade -y
```

参数解释：

- `upgrade`：升级已安装软件包
- `-y`：自动回答 yes，避免每次手动确认

### 3. 安装基础开发工具

```bash
sudo apt install -y curl ca-certificates build-essential unzip zip ripgrep jq python3 python3-pip python3-venv pipx git
```

参数解释：

- `install`：安装软件包
- `-y`：自动确认

每个包的作用：

- `curl`：下载脚本和文件，后面装 NVM、SDKMAN 会用到
- `ca-certificates`：HTTPS 证书信任链，没有它很多 TLS 请求会报错
- `build-essential`：C/C++ 编译基础套件，很多 npm 包和 Python 扩展编译时会用
- `unzip` / `zip`：压缩解压工具
- `ripgrep`：高性能文本搜索工具，命令是 `rg`
- `jq`：处理 JSON 非常方便
- `python3`：系统 Python
- `python3-pip`：Python 包安装工具
- `python3-venv`：Python 虚拟环境支持
- `pipx`：把 Python CLI 工具隔离安装到独立环境
- `git`：虽然你一开始不想在 Ubuntu 里装 git，但后面为了 WSL 内原生路径、插件 fork、脚本仓库和 agent 工作区管理，装 Linux 版 git 更稳

### 为什么 Docker 这里不装

这里**没有**安装 Docker Engine。

原因是你已经在 Windows 上有 `Docker Desktop`，而且它本来就能通过 WSL 集成工作。重复在 Ubuntu 里再装一套 Docker，容易出现：

- daemon 冲突
- socket 指向混乱
- 你自己都不确定到底在调哪一套 Docker

所以这里的原则是：

- Docker：继续用 Windows Docker Desktop
- Git：WSL 内建议还是装一个 Linux 版 `git`

这两个工具不对称，是正常的。

---

## 五、用 NVM 管理 Node.js 多版本

OpenClaw 是 Node 生态工具，Node 版本管理必须做对。

### 1. 安装 NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

这条命令拆开看：

- `curl`：下载远程内容
- `-o-`：把输出写到标准输出，而不是文件
- `https://.../install.sh`：NVM 安装脚本地址
- `| bash`：把前面的输出直接交给 `bash` 执行

为什么用 NVM？

因为 Node 工具链变化快，而 OpenClaw、插件开发、其他 CLI 工具未必永远都适合同一个 Node 版本。用 NVM 可以：

- 装多个 Node 版本
- 按项目切换
- 默认版本可控
- 升级回退都方便

### 2. 让当前 shell 重新加载配置

```bash
source ~/.bashrc
```

参数解释：

- `source`：在当前 shell 中重新加载脚本
- `~/.bashrc`：当前用户 bash 启动配置

### 3. 安装稳定版 Node.js

本文这套环境用的是 Node 24：

```bash
nvm install 24
```

参数解释：

- `install`：安装指定版本
- `24`：主版本号，NVM 会解析到对应的最新 `24.x`

安装后切换到它：

```bash
nvm use 24
```

让它成为默认版本：

```bash
nvm alias default 24
```

参数解释：

- `alias default 24`：把默认别名 `default` 指向 `24`

验证：

```bash
node -v
npm -v
```

你当前这套环境里的结果是：

- `node v24.15.0`
- `npm 11.12.1`

---

## 六、用 SDKMAN 管理 JDK 和 Maven 多版本

虽然 OpenClaw 本身主要依赖 Node.js，但你一开始就明确要求：

- `JDK` 要用 `SDKMAN`
- `Maven` 也要用 `SDKMAN`

这是对的，因为 Java 生态尤其容易遇到“这个项目要 17，那个项目要 21”的情况。

### 1. 安装 SDKMAN

```bash
curl -s "https://get.sdkman.io" | bash
```

参数解释：

- `-s`：silent，减少下载过程输出
- `"https://get.sdkman.io"`：SDKMAN 安装脚本
- `| bash`：直接执行安装脚本

安装完成后加载环境：

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

参数解释：

- `$HOME`：当前用户家目录
- `.sdkman/bin/sdkman-init.sh`：SDKMAN 初始化脚本

### 2. 查看可安装的 Java 版本

```bash
sdk list java
```

参数解释：

- `sdk`：SDKMAN 主命令
- `list`：列出候选版本
- `java`：候选项名称

### 3. 安装一个稳定的 LTS JDK

例如安装 Temurin 21：

```bash
sdk install java 21.0.7-tem
```

参数解释：

- `install`：安装候选项
- `java`：候选项名称
- `21.0.7-tem`：具体发行版和版本号  
  其中：
  - `21.0.7` 是版本号
  - `tem` 是 Eclipse Temurin 供应商缩写

设置为默认：

```bash
sdk default java 21.0.7-tem
```

如果你只是临时切换当前 shell，也可以用：

```bash
sdk use java 21.0.7-tem
```

区别是：

- `default`：修改默认版本，后续 shell 也生效
- `use`：只影响当前 shell

### 4. 安装 Maven

先看可选版本：

```bash
sdk list maven
```

再安装：

```bash
sdk install maven 3.9.9
```

设置默认：

```bash
sdk default maven 3.9.9
```

验证：

```bash
java -version
mvn -v
```

为什么 Maven 也用 SDKMAN，而不是 `apt install maven`？

因为：

- `apt` 仓库里的 Maven 版本常常偏旧
- Java/Maven 的“多版本切换”需求很常见
- `SDKMAN` 管理 Java 类工具链比系统包管理器更灵活

---

## 七、Python 选择稳定版的处理方式

你要求“Python3 选择稳定版”。在 Ubuntu 24.04 下，系统自带的 `Python 3.12` 就是稳定选择。

这里不建议一开始就上 pyenv 折腾多个 Python 版本，原因很简单：

- OpenClaw 主体不是 Python 项目
- 你当前重点是把 agent 系统搭稳
- 系统 Python 先保持简洁更好维护

安装命令在前面已经包含：

```bash
sudo apt install -y python3 python3-pip python3-venv pipx
```

验证：

```bash
python3 --version
pip3 --version
```

如果你后面要装 Python CLI 工具，优先考虑：

```bash
pipx ensurepath
```

参数解释：

- `ensurepath`：把 `pipx` 的可执行目录加入 PATH

这样很多工具可以做到：

- 不污染系统 Python
- 又不必自己手动创建虚拟环境

---

## 八、Git 与远程仓库怎么理解

你后面问到一个很关键的问题：

> remote 是连到我的 Windows 目录上吗，还是我的 GitHub？

答案是：

**Git remote 指向的是远程仓库地址，比如 GitHub，不是你本机某个目录。**

例如：

- `https://github.com/24XXXXXXX/openclaw-owner.git`
- `https://github.com/24XXXXXXX/openclaw-guest-scratch.git`

这是 remote。

而本机目录，例如：

- `C:\Users\JJX\source\repos\...`
- `/home/jjx/.openclaw/workspace/...`

这是 working tree，也就是本地工作区。

### 1. 配置 Git 全局身份

```bash
git config --global user.name "JJX"
git config --global user.email "193495749@qq.com"
```

参数解释：

- `config`：修改 Git 配置
- `--global`：写入当前用户全局配置
- `user.name`：提交作者名
- `user.email`：提交作者邮箱

如果没有这一步，很多初始化动作在需要 commit 时会被卡住。

### 2. 为什么 owner 和 guest 最好拆仓库

你后面已经创建了两个 GitHub 仓库：

- `openclaw-owner.git`
- `openclaw-guest-scratch.git`

这么拆的理由很充分：

1. owner 仓库里可能有：
   - 个人配置
   - 插件 fork
   - 自动化脚本
   - 你的高权限工作流

2. guest 仓库更多是：
   - 访客安全工作区
   - 可清理的实验内容
   - 按 sender 隔离的数据

3. 以后多人接入时，guest 侧内容增长会比较快  
   单独拆开更清爽，不会把 owner 环境搞乱。

### 3. 多人都连 guest bot，会不会 git 提交混乱

会，如果你让所有人共用一个工作区、共用一个分支。

所以正确思路不是“所有人都往一个目录里写”，而是做隔离。常见有两种：

1. **每个 sender 一个独立 workspace**  
   这是我们当前主方案，最直接。

2. **每个 sender 一个独立分支**  
   适合你后面真要把 guest 工作产物长期纳入 Git 流程时再做。

当前这套系统里，核心已经先落实成：

- sender 隔离
- 上下文隔离
- 工作区隔离

这样就算以后多人接进来，也不会先在最基本层面互相污染。

---

## 九、安装 OpenClaw

### 1. 全局安装 OpenClaw

```bash
npm install -g openclaw
```

参数解释：

- `npm install`：安装 npm 包
- `-g`：全局安装，命令会进入全局 PATH
- `openclaw`：包名

验证版本：

```bash
openclaw --version
```

你当前这套环境的版本是：

```text
2026.5.12
```

### 2. 安装 gateway

```bash
openclaw gateway install --port 18789 --runtime node
```

参数解释：

- `gateway`：操作 OpenClaw 网关子命令
- `install`：安装并注册 gateway
- `--port 18789`：指定本机监听端口
- `--runtime node`：指定以 Node 运行时方式安装

为什么要 gateway？

因为很多 channel、工具调用、消息桥接，不是单纯打开一个 `tui` 就够的。gateway 是整套消息和工具体系的底层入口。

### 3. 查看 gateway 状态

```bash
openclaw gateway status
```

如果需要重启：

```bash
openclaw gateway restart
```

你当前环境里，gateway 运行在：

```text
127.0.0.1:18789
```

---

## 十、第一次配置 OpenClaw：QuickStart 每一步怎么选

首次执行 `openclaw` 或 `openclaw configure` 时，会进入引导流程。

### 1. Setup mode 选什么

你看到的是：

```text
QuickStart (recommended)
Manual setup
```

这里选：

```text
QuickStart
```

原因：

- 先把标准路径跑通
- 后面再手改配置更稳
- `Manual` 更适合你已经完全知道每一项配置放哪里

### 2. Config handling 选什么

常见选项：

- `Keep current values`
- `Review and update`
- `Reset before setup`

如果你之前已经开始配过一次，而且只是继续补配置，选：

```text
Keep current values
```

它的意思是：

- 保留现有配置
- 继续在这个基础上增量设置

### 3. 使用第三方 API 中转时，模型提供方怎么选

你当时问得很对：

> 我要是走第三方 API 中转呢，怎么选？

这时不要直接死选 `OpenAI`，而是应该：

1. 先选：

```text
More...
```

2. 然后选择：

```text
OpenAI-compatible
```

原因是：

- 你的上游虽然可能是“兼容 OpenAI 格式”
- 但它未必真的是 OpenAI 官方端点
- 走 `OpenAI-compatible` 更符合实际结构

接着填写：

- `Endpoint compatibility`: `OpenAI-compatible`
- `Model ID`: 例如 `gpt-5.5`
- `API key`: 你的中转 key

### 4. API key 提供方式怎么选

你看到的是：

```text
Paste API key now
Use external secret provider
```

如果是个人机快速落地，选：

```text
Paste API key now
```

这会把 key 直接存入 OpenClaw 配置。

如果以后你做更严格的运维，再考虑外部 secret provider。

### 5. Model alias 要不要填

可填可不填。

它只是给模型起一个更好记的别名，比如：

- `main`
- `owner-llm`
- `relay-gpt55`

不填也不影响运行。

### 6. Search provider 这一步到底是什么

你后来又问：

> 这一步是选什么的？

这一步不是选主模型，而是在选 **Web Search 工具的搜索提供方**。

也就是说，OpenClaw 在调用“联网搜索”能力时，搜索结果从哪里来，由这里决定。

常见选择：

- `DuckDuckGo Search`：免费、免 key，但实验性
- `Brave Search`：结果通常更稳，但可能需要 key
- `Tavily` / `Exa` / `Perplexity`：更专业，但通常要 key
- `Skip for now`：先跳过

如果你只是先把系统打通，选：

- `DuckDuckGo Search`
  或
- `Skip for now`

都可以。

### 7. Configure skills now 要不要选 Yes

建议选：

```text
Yes
```

因为 skills 是 OpenClaw 的重要扩展能力入口。

不过这里的“选 Yes”，意思是进入可配置流程，不代表你必须一口气把所有 skills 都配满。

### 8. hooks 那一步为什么会卡“至少选一个”

你当时看到的是多选框：

```text
Skip for now
boot-md
bootstrap-extra-files
command-logger
compaction-notifier
session-memory
```

然后提示：

```text
Please select at least one option.
Press space to select, enter to submit
```

这里的坑在于：

- 这是一个**多选界面**
- `Skip for now` 不是自动生效的文案
- 它本身也是一个要按空格选中的选项

也就是说，如果你此时不想启用 hooks，正确操作是：

1. 把光标移到 `Skip for now`
2. 按一次空格
3. 再按 Enter

### 9. Hatch in Terminal 还是 Browser

你看到的是：

```text
Hatch in Terminal
Hatch in Browser
Hatch later
```

这里先选：

```text
Hatch in Terminal
```

这表示先在终端里启动 TUI 会话。

但要特别强调一件事：

**OpenClaw 的 Bot 运行，和你是否一直开着 `openclaw tui`，不是一回事。**

`tui` 更像是：

- 本地交互控制台
- 调试入口
- 手工下命令的地方

而真正的消息通道、gateway、微信连接，后面更多依赖服务和 channel 自己运行。

所以：

- `tui` 可以开
- 但不是必须 24 小时挂着

---

## 十一、如果第一次进 TUI 报 provider schema 错误

你当时见过一类错误：

```text
LLM request failed: provider rejected the request schema or tool payload
```

这个错误通常意味着：

- 你填的第三方 API 虽然“号称兼容 OpenAI”
- 但它对工具调用 schema、函数调用字段、消息格式的兼容并不完整

怎么理解这个问题：

OpenClaw 不是只发一个纯文本 prompt，它还可能带上：

- tool schema
- function/tool call payload
- structured message metadata

如果上游兼容层只兼容了最简单的聊天接口，就会在这里炸。

排查思路：

1. 确认上游模型真的支持 tool calling
2. 确认 endpoint 真的是 OpenAI 兼容实现，而不是只兼容最基本文本对话
3. 必要时换一个兼容性更完整的中转服务

你后面能继续进入会话，说明这一步最终已经能工作。

---

## 十二、接入微信：先有一个 owner bot

### 1. 选择 Weixin 渠道

在 QuickStart 的 channel 选择里，先选：

```text
Weixin（微信）
```

安装成功时，你看到过类似：

```text
Installed Weixin plugin
```

这说明微信插件已经装入 OpenClaw。

### 2. 登录微信 Bot

命令是：

```bash
openclaw channels login --channel openclaw-weixin
```

参数解释：

- `channels`：channel 管理子命令
- `login`：登录某个 channel
- `--channel`：指定 channel 类型
- `openclaw-weixin`：微信插件 channel 名称

这一步通常会出现二维码或登录提示，需要你在真实终端里完成交互。

### 3. 查看 channel 状态

```bash
openclaw channels status
```

如果看到类似：

```text
Gateway reachable.
- openclaw-weixin <account-id>: enabled, configured, running
```

就说明：

- gateway 能连上
- 这个微信账号已经配置完成
- 当前在线

---

## 十三、为什么后来又做了第二个微信 Bot

一开始只有一个微信 Bot，也能用，但很快会遇到一个结构问题：

如果以后你想：

- 让自己能高权限控制本机
- 让朋友也能接进来体验聊天

那么把这两类人都混到一个 Bot 上，不稳。

### 两种思路的区别

当时我们讨论过两条路：

1. **同一个 Bot 内做高低权限 sender 路由**
2. **直接再准备一个 guest bot，和 owner bot 分开**

最后选的是第二条：

**第二个微信 bot 账号 + guest agent**

原因：

1. 安全边界最清晰  
   owner 和 guest 天然分开，不需要把所有风险都押在一套复杂规则上。

2. 运维更直观  
   你一看微信联系人就知道哪个是自用、哪个是访客入口。

3. 后面扩展多人时更省心  
   guest bot 专门承担“对外聊天入口”角色。

所以最终结构变成：

- **Bot 1：owner bot**
  - 只给你自己
  - 可以接高权限能力

- **Bot 2：guest bot**
  - 给其他人接入
  - 限制工具能力
  - 隔离 sender 上下文和工作区

---

## 十四、先识别你自己的微信 sender id

你在 owner bot 里执行过：

```text
/whoami
```

返回大概像这样：

```text
Identity
Channel: openclaw-weixin
AllowFrom: <YOUR_WECHAT_SENDER_ID>@im.wechat
```

这一步的意义非常大：

- 这串 sender id 代表“你自己的微信身份”
- 以后 owner 高权限判断、白名单、审批通知，都要依赖它

你可以把它理解为：

**微信通道里的用户主键。**

后面所有“只允许我本人执行”的规则，都是围绕这串 id 建的。

---

## 十五、让上下文按 sender 隔离，而不是所有私聊混成一锅

这一步很重要，也是多人接入的基础。

执行：

```bash
openclaw config set session.dmScope per-account-channel-peer
```

参数解释：

- `config set`：设置 OpenClaw 配置项
- `session.dmScope`：控制私聊会话隔离粒度
- `per-account-channel-peer`：按“账号 + channel + 对端”隔离

这个值为什么重要？

因为如果不做这一步，多用户 DM 可能共享过多上下文。

设置成 `per-account-channel-peer` 后，效果是：

- 不同微信账号彼此隔离
- 同一 channel 下不同聊天对象彼此隔离
- 多 bot 并存时更安全

这就是我们后来说的“别人需要限制权限同时隔离聊天上下文区”的底层开关之一。

### 上下文窗口能不能继续加大

你后来问过上下文窗口是否还能继续加大。

这套环境最后的取舍是：

- **不专门追求扩窗**
- 优先做**隔离**
- 超长会话靠 OpenClaw 的压缩/重置机制处理

原因：

1. 128k 级别上下文对一般微信对话已经不小
2. 多人接入时，隔离比一味扩窗更重要
3. 上下文越大，成本、延迟、累积噪声都可能上升

如果会话确实太长，可以：

- `/new`
- `/reset`
- 依赖 compaction / summary 机制

---

## 十六、自动配对审批：为什么要做

OpenClaw 的 DM 安全默认不是“谁都能直接聊天”，而是先配对。

这很合理，因为否则任何找到入口的人都能直接对你的 agent 发起对话。

但如果每次都要你回终端手工执行：

```bash
openclaw pairing approve <channel> <code>
```

体验就太差了。

所以我们把审批链路做成了这样：

1. 外部用户给 guest bot 发起第一次消息
2. guest bot 给他一个 pairing code
3. 系统自动把这个 code 转发给 owner bot
4. 你在自己的微信里回复：

```text
批准 <code>
```

5. 系统自动完成审批

这一步的价值是：

- 你不用盯终端
- 你不用记 CLI 细节
- 审批入口回到微信本身

---

## 十七、用于配对审批通知的两个关键命令

### 1. 列出待审批配对请求

```bash
openclaw pairing list --channel openclaw-weixin --account <GUEST_ACCOUNT_ID> --json
```

参数解释：

- `pairing`：配对子命令
- `list`：列出当前配对请求
- `--channel openclaw-weixin`：只看微信通道
- `--account <GUEST_ACCOUNT_ID>`：只看 guest bot 对应的账号
- `--json`：用 JSON 输出，方便脚本处理

为什么这里要带 `--account`？

因为你已经不是单微信账号场景了。你有 owner bot 和 guest bot 两个账号，如果不指定账号，脚本不容易准确知道该监听谁。

### 2. 主动给 owner bot 发通知

```bash
openclaw message send --channel openclaw-weixin --account <OWNER_ACCOUNT_ID> --target <OWNER_TARGET_WECHAT_ID> --message "新的 guest 配对申请：<code>"
```

参数解释：

- `message send`：主动发送一条消息
- `--channel openclaw-weixin`：通过微信插件发
- `--account <OWNER_ACCOUNT_ID>`：指定由哪个登录中的微信 bot 发出
- `--target <OWNER_TARGET_WECHAT_ID>`：发给谁，这里就是你自己的微信 sender id
- `--message "..."`：消息正文

这条命令是整套“自动审批通知”体验的关键，因为它让系统可以主动把 code 推到你的 owner bot。

---

## 十八、把配对通知做成 systemd 用户服务

光有命令还不够，你不可能手动一直轮询。

所以我们把轮询脚本做成了一个 `systemd --user` 服务。

当前脚本放在：

```text
/mnt/c/Users/JJX/source/repos/openclaw-pairing-helper/guest_pairing_notifier.mjs
```

注意这个路径虽然看起来在 `/mnt/c/...`，本质上对应的是 Windows 目录。WSL 可以直接访问它。

### 一个典型的 service 文件

`~/.config/systemd/user/openclaw-guest-pairing-notify.service`

可以是：

```ini
[Unit]
Description=OpenClaw guest pairing notify
After=default.target

[Service]
Type=simple
ExecStart=/usr/bin/env node /mnt/c/Users/JJX/source/repos/openclaw-pairing-helper/guest_pairing_notifier.mjs
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

每一项解释如下：

- `[Unit]`：服务元信息
- `Description`：服务说明
- `After=default.target`：在默认用户目标之后启动

- `[Service]`：服务运行方式
- `Type=simple`：前台长期运行型服务
- `ExecStart=...`：真正启动的命令
- `Restart=always`：异常退出后自动拉起
- `RestartSec=5`：重启前等待 5 秒

- `[Install]`：安装到哪个 target
- `WantedBy=default.target`：让这个服务可以随用户默认会话启动

### 载入并启用服务

```bash
systemctl --user daemon-reload
systemctl --user enable --now openclaw-guest-pairing-notify.service
systemctl --user status openclaw-guest-pairing-notify.service
```

参数解释：

- `daemon-reload`：重载 systemd 配置文件
- `enable`：设为开机/会话启动时启用
- `--now`：启用的同时立刻启动
- `status`：查看状态

---

## 十九、让 owner bot 里回复“批准 <code>”就自动审批

这一步是体验上的关键升级。

你后面明确要的是：

> 只盯第二个 bot 的 pairing 审批。最好我的 ClawBot 直接发消息给我，我在微信里批准。

最终做法不是让你每次手敲 CLI，而是让 owner 侧 agent 识别“批准 <code>”。

### 背后的逻辑

1. guest pairing notifier 把 code 推给 owner bot
2. 你在 owner bot 里回复：

```text
批准 123456
```

3. owner bot 的 agent 识别到这是审批意图
4. 后端执行：

```bash
openclaw pairing approve openclaw-weixin 123456
```

参数解释：

- `pairing approve`：批准配对
- `openclaw-weixin`：目标 channel
- `123456`：配对码

### 为什么这一步只盯第二个 bot

因为你后来明确要求：

- 只处理 guest bot 的 pairing 审批
- owner bot 自己不用再多做别的自动审批判断

这种做法是对的，因为“自动化范围越小，越容易可控”。

---

## 二十、为什么配对码一定要能发到你的微信里

你还追问过一个非常实际的问题：

> 配对码也会发给我的对吧？不然我看不到配对码不能审批

答案当然是：

**必须发给你。**

否则整条审批链路就断了。

所以 guest pairing notifier 的职责不是“默默知道有个待审批请求”，而是：

1. 发现新的 pending pairing
2. 提取配对码
3. 主动推送到 owner bot
4. 等你回复“批准 <code>”

也正因为这样，这个 notifier 脚本必须知道三件事：

- guest bot account id
- owner bot account id
- 你的微信 sender id

---

## 二十一、为什么还要做 sender 自定义路由

只做“双 Bot”还不够。

如果 guest bot 后面接很多人，而这些人全都进同一个 agent、同一个 workspace，问题还是会出现：

- 上下文串话
- 文件互相污染
- 一个用户的历史影响另一个用户

所以后面又继续做了：

**openclaw-weixin 自定义 sender 路由**

它的目标是：

- 同一个 guest bot 下
- 不同 sender
- 自动映射到不同会话和工作区

### 当前策略

当前配置的方向是：

- owner 走 owner agent
- guest 开启 sender 自动分流
- guest sender 的 workspace 根目录放在：

```text
/home/jjx/.openclaw/workspace-guest-senders
```

并且启用了：

- `autoProvisionSenderRoutes = true`

它的意思可以理解为：

- 新 sender 第一次出现时
- 系统自动给它分配路由和工作区

这正是“后续可能不止 1 个人连上”的基础准备。

---

## 二十二、本地插件 fork：为什么不是只靠配置

做到这里时，我们已经不是简单改 JSON 能完全覆盖的场景了。

原因是你要的东西开始涉及插件级逻辑：

- 特定微信账号高低权限拆分
- sender 自动路由
- 审批消息的特殊处理
- 未来可能还有头像、昵称、额外命令能力

这时最稳的方式就是：

**把 `openclaw-weixin` 做一个本地 fork。**

### 1. 从已安装插件复制源码

源插件位置大致在：

```text
~/.openclaw/npm/node_modules/@tencent-weixin/openclaw-weixin
```

复制到你自己的工作区，例如：

```text
~/.openclaw/workspace/plugins/openclaw-weixin-fork
```

这样做的好处：

- 不直接改上游安装目录
- 你可以放心做定制
- 后续更容易纳入 Git 管理

### 2. 安装 fork 所需依赖

```bash
npm install --omit=dev --ignore-scripts
```

参数解释：

- `--omit=dev`：不安装开发依赖，只装运行所需依赖
- `--ignore-scripts`：不执行 package scripts，降低意外副作用

为什么这里这么做：

- 我们现在的目标是让 fork 先能作为本地插件跑起来
- 不是马上开发整套构建流水线

### 3. 以 link 方式装回 OpenClaw

```bash
openclaw plugins install --link ~/.openclaw/workspace/plugins/openclaw-weixin-fork
```

参数解释：

- `plugins install`：安装插件
- `--link`：不是复制发布包，而是建立本地链接
- `~/.openclaw/workspace/plugins/openclaw-weixin-fork`：你的本地 fork 路径

`--link` 的价值非常大：

- 你改 fork 代码，OpenClaw 直接用这份本地版本
- 不用每次重新打包发布

### 4. 检查插件装载结果

```bash
openclaw plugins inspect openclaw-weixin
```

它可以帮助确认：

- 当前实际启用的是哪个插件来源
- 是否已经指向你的 fork

### 5. 一个坑：`--force` 不能和 `--link` 混用

如果你想覆盖安装，别上来就把 `--force` 和 `--link` 一起拼。

这里实际踩过的坑是：

- `--force` 不能和 `--link` 直接组合使用

所以正确思路通常是：

1. 先清理已有冲突状态
2. 再重新执行 `--link`

### 6. 另一个坑：缺少 `zod`

本地 link 插件时，如果依赖没有完整装好，可能出现缺少 `zod` 之类的报错。

本质原因通常是：

- 你复制出来的是运行目录
- 但 link 后运行时依赖解析不完整

这也是为什么上面要先跑：

```bash
npm install --omit=dev --ignore-scripts
```

先把运行依赖补全。

---

## 二十三、关于微信昵称和头像

你还问过：

> 现在微信显示 openclaw 的昵称是“微信ClawBot”，头像是默认头像，我怎么给他换名字和头像？

这里要分清两层：

### 1. 微信账号本身的昵称和头像

如果插件走的是登录某个真实微信账号，那么：

- 昵称
- 头像

首先受这个微信账号本身控制。

很多情况下，最直接的方法是：

- 在对应微信客户端里改账号资料

### 2. OpenClaw 侧显示名称

插件或 channel 层也可能有自己的展示名配置，但它通常只是“系统里的显示名”，不一定能覆盖微信端真实资料。

所以如果你想让联系人实际看到新名字/头像，优先从微信账号本体入手。

如果后面要做更细的展示逻辑，再去你的本地插件 fork 里加。

---

## 二十四、OpenClaw 和 `openclaw tui` 的关系到底是什么

你问过：

> OpenClaw 的运行和我有没有执行 `openclaw tui` 没关系对吗？那 OpenClaw 是一直运行的吗？有关闭和启动命令吗？

这个问题必须讲清楚。

### 1. `openclaw tui` 是交互前端，不是全部

`tui` 更像：

- 控制台
- 本地操作面板
- 调试入口

不是说你不开 `tui`，Bot 就一定死。

### 2. 真正长期运行的通常是这些东西

- gateway
- channel 连接
- 你的 systemd 用户服务
- 你定制的 notifier 脚本

### 3. 它是不是“一直运行”

在你当前这套结构里，可以理解成：

- 只要 Windows 开着
- WSL 这套 Ubuntu 没被关掉
- gateway 和对应服务还活着
- 你的第三方 API 可用

那它就可以一直在线。

但如果你执行了：

```powershell
wsl --shutdown
```

那整套 Ubuntu 里的用户态服务都会停掉。

### 4. 常用启动/检查/重启命令

检查 gateway：

```bash
openclaw gateway status
```

重启 gateway：

```bash
openclaw gateway restart
```

看所有 channel：

```bash
openclaw channels status
```

看 user service：

```bash
systemctl --user status openclaw-gateway.service
systemctl --user status openclaw-guest-pairing-notify.service
```

重启 service：

```bash
systemctl --user restart openclaw-gateway.service
systemctl --user restart openclaw-guest-pairing-notify.service
```

---

## 二十五、现在微信和 OpenClaw 打通后，能做到什么

结合你现在的结构，可以把能力分成 owner 和 guest 两层来看。

### 1. Owner bot 能做什么

你的自用 owner bot 可以逐步接入更高权限能力，例如：

- 聊天
- 总结资料
- 查询信息
- 帮你起草文字
- 执行一些本机操作
- 批准 guest pairing

### 2. Guest bot 能做什么

你后来明确要求 guest bot 的方向是：

- 只做 agent 聊天
- 上网查资料
- 一些安全的 `/` 指令
- **不能**通过微信直接操作你的电脑

这是非常正确的边界划分。

因此 guest 侧不应该直接暴露：

- 高危 shell
- 宿主机文件系统高权限操作
- 任意命令执行
- owner 级配置能力

### 3. `/reset` 这类指令会不会执行

如果 channel/agent 当前支持把消息解释为 slash command，那么像：

```text
/reset
```

是可能被识别的。

但重点不是“能不能执行”，而是：

- **让谁能执行**
- **在哪个 bot 上执行**
- **执行后影响谁的上下文**

所以 owner bot 和 guest bot 的权限边界，必须比“命令本身支不支持”更优先考虑。

---

## 二十六、为什么 owner 和 guest 不应该混到一个高权限主 agent 上

这是整篇文章里最重要的安全结论之一。

当时讨论过两种说法：

1. 给别人单独走一个低权限 agent
2. 最稳的是单独 bot 账号或单独 agent 绑定，不要把外人接到你这个高权限主 agent 上

这两句话看起来接近，但实施层级不一样：

### 方案 A：同一个 bot，多个 agent，按 sender 分流

优点：

- 节省一个微信账号
- 逻辑集中

缺点：

- 安全策略更复杂
- 配置和插件逻辑更容易出错
- 一旦路由规则漏了，风险直接落在高权限主环境

### 方案 B：单独 guest bot + 低权限 agent

优点：

- 安全边界清晰
- 出问题时爆炸半径小
- 便于今后多人接入

缺点：

- 需要第二个微信账号
- 运维对象多一个

最终我们选的是 B，再在 B 里面继续做 sender 隔离。

这个组合在实战里通常是更值得的：

- 第一层：bot 账号隔离
- 第二层：agent 权限隔离
- 第三层：sender 会话/工作区隔离

---

## 二十七、当前配置思路的一个示意片段

下面这个片段不是让你盲贴，而是帮助理解当前思路：

```json
{
  "session": {
    "dmScope": "per-account-channel-peer"
  },
  "channels": {
    "openclaw-weixin": {
      "pairingApproval": {
        "enabled": true,
        "ownerAgentIds": ["owner"]
      },
      "guestAccountId": "<GUEST_ACCOUNT_ID>",
      "autoProvisionSenderRoutes": true,
      "workspaceRoot": "/home/jjx/.openclaw/workspace-guest-senders"
    }
  }
}
```

字段含义：

- `session.dmScope`：私聊上下文隔离粒度
- `pairingApproval.enabled`：开启配对审批机制
- `ownerAgentIds`：哪些 agent 视为 owner 侧代理
- `guestAccountId`：哪一个微信账号属于 guest bot
- `autoProvisionSenderRoutes`：新 sender 是否自动建路由
- `workspaceRoot`：guest sender 独立工作区根目录

这里刻意用了占位符，不直接暴露你的真实账号 id。

---

## 二十八、一个很实用的运行状态判断

你后来执行过：

```bash
openclaw channels status
```

看到过类似：

```text
Gateway reachable.
Gateway event loop degraded: reasons=event_loop_delay ...
- openclaw-weixin <owner-account>: stopped, health:not-running, error:channel stop timed out after 5000ms
- openclaw-weixin <guest-account>: running
```

这类输出可以这样读：

### 1. `Gateway reachable`

表示 gateway 本身能连通。

### 2. `event loop degraded`

表示事件循环曾经有点卡顿，但不等于整个系统不可用。常见原因包括：

- 临时 CPU 抖动
- I/O 阻塞
- 第三方接口慢

### 3. 某个 account `stopped`

表示那个微信账号对应的 channel 当前没跑起来。

而另一个 account `running`，则说明另一个 bot 还在线。

这正好说明多账号结构有一个额外好处：

**一个 bot 掉了，不一定把所有入口一起拖死。**

---

## 二十九、关于“只要电脑开着就能一直聊吗”

这个问题的答案是：

**基本可以，但要满足条件。**

条件包括：

1. Windows 开机
2. 网络可用
3. 第三方 API 中转可用
4. WSL 的 Ubuntu 正在运行
5. gateway 和微信 channel 服务都还活着

如果这些条件都满足，那么微信侧就可以持续和 OpenClaw 交流。

但要注意一点：

**不是“只要电脑开着”就绝对万无一失。**

因为还可能遇到：

- 代理切换导致网络环境变化
- WSL 被你手动关掉
- 某个 channel 异常退出
- 第三方 API 限流或故障

所以日常运维上，最实用的是养成两个检查命令习惯：

```bash
openclaw gateway status
openclaw channels status
```

---

## 三十、现在这套系统是否“越来越聪明”

你后面问过：

> 在不停的聊天中怎么让 OpenClaw 越来越聪明？
> OpenClaw 需要装哪些东西来壮大它，比如 MCP 和 skills？

这要拆开理解。

### 1. 单纯长聊天，不等于真的越来越聪明

长聊天只会让当前上下文更丰富，不会自动让模型本体升级。

真正会让系统能力增长的是：

- 更好的工具
- 更好的技能
- 更好的权限结构
- 更好的知识接入

### 2. skills 的作用

skills 更像是：

- 专项工作说明书
- 可复用流程模板
- 领域化能力封装

比如：

- 文档处理 skill
- 项目脚手架 skill
- 插件开发 skill

### 3. MCP 的作用

MCP 更像是：

- 把外部系统接成工具接口
- 让 agent 安全、结构化地调用外部能力

比如：

- 数据库
- 文档库
- 浏览器能力
- 企业内部系统

### 4. 你当前这套系统下一步更值得补什么

不是盲目“装很多”，而是按优先级补：

1. 先把 owner / guest 结构固化
2. 把 sender 隔离和审批流程跑稳
3. 再补 guest 可用的安全工具
4. 最后再考虑 MCP 和更丰富的 skills

顺序反过来，系统会很快变复杂。

---

## 三十一、和 Windows 上的 Docker Desktop、Git 的关系

你还问过：

> OpenClaw 调动的是 Windows 上的 Docker Desktop 和 git 对吧？

这个问题要分成两半回答。

### 1. Docker

是的，当前建议继续使用 Windows 上的 Docker Desktop。

通过 WSL 集成后，Ubuntu 里很多 Docker 命令可以直接打到 Docker Desktop 的引擎。

所以你不需要在 Ubuntu 再装一套 Docker Engine。

### 2. Git

Git 不建议完全依赖 Windows `git.exe` 透传。

原因是：

- Linux 路径和 Windows 路径语义不同
- 脚本里混用 `git.exe` 和 Linux 路径容易怪问题
- 插件 fork、本地工作区、systemd 脚本都在 Ubuntu 里

所以更稳妥的做法是：

- Docker 继续借用 Windows Docker Desktop
- Git 在 Ubuntu 里装一个原生 Linux 版本，并配好 GitHub remote

这就是为什么前面基础依赖里虽然没装 Docker，但还是建议装了 `git`。

---

## 三十二、当前已经完成了什么

把整段过程收束一下，到目前为止，这套系统已经完成的关键点包括：

1. Windows 上装好了 `WSL2`
2. 安装并运行了 `Ubuntu 24.04`
3. 调整了 `.wslconfig`，处理网络和代理
4. 开启了 `systemd`
5. 补齐了 Ubuntu 基础开发工具
6. 用 `NVM` 管理并安装了稳定版 `Node 24`
7. 用 `SDKMAN` 管理 `JDK` 和 `Maven`
8. 保持 `Python 3` 走 Ubuntu 稳定版
9. 安装了 `OpenClaw`
10. 安装并运行了 gateway
11. 接入了第三方 OpenAI 兼容 API
12. 打通了微信通道
13. 做成了 owner bot + guest bot 双账号结构
14. 配置了 `dmScope` 做上下文隔离
15. 实现了 guest pairing 自动通知 owner
16. 实现了在 owner 微信里回复“批准 <code>”的审批链路
17. 给 `openclaw-weixin` 做了本地插件 fork 基础
18. 规划并准备了 owner / guest 的 GitHub 仓库分离

这已经不是“装好了一个 CLI”，而是一套**可以持续演进的本地 AI agent 基础设施**。

---

## 三十三、建议的日常维护命令清单

最后给一组最常用的命令，后面你大概率会反复用到。

### WSL 侧

查看发行版状态：

```powershell
wsl -l -v
```

重启全部 WSL：

```powershell
wsl --shutdown
```

只终止 Ubuntu：

```powershell
wsl --terminate Ubuntu-24.04
```

### Ubuntu 侧

检查 Node：

```bash
node -v
npm -v
```

切换 Node 版本：

```bash
nvm use 24
```

查看 Java：

```bash
java -version
```

查看 Maven：

```bash
mvn -v
```

检查 gateway：

```bash
openclaw gateway status
```

重启 gateway：

```bash
openclaw gateway restart
```

检查 channel：

```bash
openclaw channels status
```

查看待审批 pairing：

```bash
openclaw pairing list --channel openclaw-weixin --account <GUEST_ACCOUNT_ID> --json
```

手动审批 pairing：

```bash
openclaw pairing approve openclaw-weixin <CODE>
```

检查 user service：

```bash
systemctl --user status openclaw-gateway.service
systemctl --user status openclaw-guest-pairing-notify.service
```

---

## 结语

如果你只是想“把一个 AI 聊天工具接进微信”，那么做到单微信 Bot 就能收工。

但如果你真正想把它变成长期可用的本地 agent 系统，就必须继续考虑：

- 环境是否可维护
- 权限是否分层
- 多人接入是否隔离
- 审批是否方便
- 插件是否可定制

这也是为什么这次的最终形态，不是停在“装上 OpenClaw”，而是继续走到了：

- 双微信 Bot
- owner / guest 分层
- sender 隔离
- 微信内审批
- 本地插件 fork

如果把这一步打牢，后面再接 skills、MCP、企业工具、自动化工作流，结构才不会一开始就塌。
