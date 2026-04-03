---
title: "在 Windows 和 Ubuntu 下使用 NVM 管理 Node.js 多版本"
description: "详细介绍如何在 Windows 和 Ubuntu 上安装并使用 NVM，实现 Node.js 多版本安装、切换、默认版本设置和镜像配置"
keywords: "NVM,Node.js,Windows,Ubuntu,nvm-windows,nvm-sh,Node版本管理,多版本切换"

date: 2026-03-28T10:20:00+08:00
lastmod: 2026-03-28T10:40:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Node.js
  - NVM
  - Windows
  - Ubuntu
  - 环境搭建
---

NVM（Node Version Manager）是 Node.js 的版本管理工具，可以让你在同一台机器上安装和切换多个 Node.js 版本。对于需要同时维护旧项目和新项目、测试不同 Node 版本兼容性的场景，NVM 基本是最省事的方案。

<!--more-->

## 一、先搞清楚：Windows 和 Ubuntu 用的不是同一个 NVM

这是最容易被混淆的地方。

根据 `nvmnode.com` 文档和上游项目说明：

- `Windows` 使用的是 `nvm-windows`
- `Linux / Ubuntu / macOS / WSL` 使用的是 `nvm-sh`

它们目标相同，但**不是同一个实现**，所以：

- 安装方式不同
- 部分命令不同
- 默认版本和 `.nvmrc` 的行为也不完全一样

如果你在 Windows 原生系统里安装，请按本文的 `Windows` 部分操作。  
如果你是在 `Ubuntu`、`WSL`、远程 Linux 服务器里安装，请按 `Ubuntu` 部分操作。

---

## 二、为什么推荐用 NVM

使用 NVM 的主要好处有：

- 不同项目可以使用不同的 Node.js 版本，避免版本冲突
- 升级和回退 Node.js 更方便
- 测试 LTS 和当前版本兼容性时更直接
- 每个 Node.js 版本自带各自的 npm 环境，隔离更清晰

例如：

- 旧项目要求 `Node 16`
- 新项目要求 `Node 20`
- 你不需要反复卸载重装 Node.js，只需要 `nvm use` 切换即可

---

## 三、Windows 安装 NVM

Windows 下安装的是 `nvm-windows`。

### 3.1 安装前准备

在安装前，建议先：

- 卸载系统里已经单独安装的 Node.js
- 关闭当前打开的 PowerShell、CMD、VS Code 终端窗口

这么做是为了避免：

- 旧的 `node.exe` 仍然占着 `PATH`
- `nvm use` 后看起来切换成功，实际仍然调用旧版本 Node

### 3.2 下载方式

可以从 `nvmnode.com` 的下载页进入 `nvm-windows` 的 GitHub Releases 页面下载。

常见文件有：

- `nvm-setup.zip`：推荐，大多数人使用这个
- `nvm-setup.exe`：如果发布页直接提供可执行安装器，也可以直接使用
- `nvm-noinstall.zip`：免安装版，适合手动部署

### 3.3 安装步骤

运行安装程序后，按向导完成安装即可。

`nvmnode.com` 文档给出的建议是：

- NVM 安装目录放在磁盘根目录，例如 `D:\nvm`
- Node.js 的链接目录放在类似 `D:\nvm\nodejs`
- 尽量不要安装到带中文、空格过多或层级过深的目录

这是比较稳妥的做法。

### 3.4 验证安装

安装完成后，重新打开 `PowerShell` 或 `CMD`，执行：

```powershell
nvm version
```

如果能正常显示 NVM 版本，说明安装成功。

如果 `nvm` 命令找不到，通常是以下问题：

- 终端还没重开
- PATH 还没刷新
- 旧 Node.js 路径仍然优先

必要时可以重启一次终端，或者直接重启系统。

### 3.5 Windows 下常用命令

查看可安装版本：

```powershell
nvm list available
```

安装最新 LTS：

```powershell
nvm install lts
```

安装指定版本：

```powershell
nvm install 18.16.0
```

切换到指定版本：

```powershell
nvm use 18.16.0
```

查看当前启用版本：

```powershell
nvm current
node -v
npm -v
```

查看本机已安装版本：

```powershell
nvm list
```

卸载某个版本：

```powershell
nvm uninstall 18.16.0
```

### 3.6 Windows 下的重要注意事项

#### 1. `nvm use` 往往需要管理员权限

`nvm-windows` 的切换原理依赖符号链接，因此官方 README 明确提示：

- 在 Windows 上执行 `nvm install` 或 `nvm use`
- 通常需要以管理员身份运行终端

如果你发现：

- `nvm install` 成功但 `node -v` 没变化
- `nvm use` 报权限或链接相关错误

优先用“以管理员身份运行”的 PowerShell 或 CMD 再试一次。

#### 2. Windows 版没有必要照搬 Linux 的 `nvm alias default`

很多教程把 Linux 命令直接抄到 Windows，这是不严谨的。

`nvm-windows` 官方说明里强调：

- 你执行一次 `nvm use x.x.x` 后
- 当前启用版本会在所有新开的控制台窗口中保持生效
- 重启系统后也会保留

所以在 Windows 原生环境下，一般不需要用 Linux 那套 `alias default` 思路。

#### 3. `.nvmrc` 在 Windows 原生环境下不是官方主流程

`nvm-sh` 可以直接对当前目录执行 `nvm use` 读取 `.nvmrc`。  
但 `nvm-windows` 官方 README 对“目录级 `.nvmrc` 自动切换”并没有作为标准功能提供，而是单独指向 issue 讨论。

所以在 Windows 原生环境里，更稳妥的用法仍然是：

```powershell
nvm use 18.16.0
```

---

## 四、Ubuntu 安装 NVM

Ubuntu 下安装的是 `nvm-sh`。

### 4.1 安装依赖

先更新软件包索引并安装常用依赖：

```bash
sudo apt update
sudo apt install -y curl wget git
```

其中：

- `curl` 或 `wget` 用来下载安装脚本
- `git` 是 `nvm-sh` 安装过程中常见依赖

### 4.2 使用安装脚本安装

`nvmnode.com` 的下载页给出了 `nvm-sh` 安装脚本方式。  
同时，上游 `nvm-sh/nvm` 仓库 README 会比聚合站点更新得更快。

如果按上游 README 当前示例安装，可以执行：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```

或者：

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```

执行后，安装脚本通常会：

- 把 NVM 克隆到 `~/.nvm`
- 自动把加载代码写入 `~/.bashrc`、`~/.profile`、`~/.bash_profile` 或 `~/.zshrc`

### 4.3 手动加载 NVM

如果安装脚本没有自动写入配置文件，可以手动把下面内容加入 `~/.bashrc`：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

然后重新加载：

```bash
source ~/.bashrc
```

### 4.4 验证安装

执行：

```bash
nvm --version
command -v nvm
```

如果能输出版本号，说明安装成功。

如果出现 `nvm: command not found`，通常是：

- 当前终端还没重新打开
- `~/.bashrc` 没有重新加载
- 安装脚本没有正确写入 shell 配置文件

最常见的处理方式就是：

```bash
source ~/.bashrc
```

如果仍然不行，就手动检查 `~/.bashrc` 里是否已经写入 NVM 初始化代码。

### 4.5 Ubuntu 下常用命令

查看远程可安装版本：

```bash
nvm ls-remote
```

安装最新版本：

```bash
nvm install node
```

安装最新 LTS：

```bash
nvm install --lts
```

安装指定版本：

```bash
nvm install 18.16.0
```

查看已安装版本：

```bash
nvm ls
```

切换版本：

```bash
nvm use 18.16.0
```

查看当前版本：

```bash
nvm current
node -v
npm -v
```

卸载版本：

```bash
nvm uninstall 18.16.0
```

### 4.6 Ubuntu 下设置默认版本

`nvm-sh` 支持别名机制，可以设置默认 Node.js 版本：

```bash
nvm alias default 18.16.0
```

之后新开的终端一般会默认使用这个版本。

如果你发现设置后新终端里没有生效，优先检查：

- 系统里是否还有其他 Node.js 路径抢在 `nvm.sh` 前面
- shell 配置文件加载顺序是否有问题

### 4.7 Ubuntu 下使用 `.nvmrc`

这是 `nvm-sh` 很实用的功能。

在项目根目录创建 `.nvmrc`：

```bash
echo "18.16.0" > .nvmrc
```

然后进入项目目录后执行：

```bash
nvm use
```

`nvm-sh` 会自动读取当前目录或父目录中的 `.nvmrc` 并切换版本。

如果当前版本没安装，还可以直接：

```bash
nvm install
```

它会读取 `.nvmrc` 后自动安装并切换。

### 4.8 Ubuntu 下执行指定版本命令

除了先 `nvm use` 再执行程序外，`nvm-sh` 还支持直接指定版本运行命令：

```bash
nvm exec 18.16.0 node app.js
```

或者：

```bash
nvm run 18.16.0 app.js
```

这一点也是 `nvm-sh` 相比 `nvm-windows` 更方便的地方之一。

---

## 五、Windows 和 Ubuntu 命令对照

| 需求 | Windows (`nvm-windows`) | Ubuntu (`nvm-sh`) |
|------|-------------------------|-------------------|
| 查看可安装版本 | `nvm list available` | `nvm ls-remote` |
| 安装最新 LTS | `nvm install lts` | `nvm install --lts` |
| 安装指定版本 | `nvm install 18.16.0` | `nvm install 18.16.0` |
| 查看已安装版本 | `nvm list` | `nvm ls` |
| 切换版本 | `nvm use 18.16.0` | `nvm use 18.16.0` |
| 查看当前版本 | `nvm current` | `nvm current` |
| 卸载版本 | `nvm uninstall 18.16.0` | `nvm uninstall 18.16.0` |
| 默认版本 | 切换后会持续保留 | `nvm alias default 18.16.0` |
| `.nvmrc` | 非官方标准主流程 | 官方支持 |

---

## 六、中国大陆网络环境下的镜像配置

如果下载 Node.js 很慢，建议优先参考国内站的镜像说明：

```text
https://nvm.uihtm.com/doc/npmmirror.html
```

这部分内容对 `nvm-windows` 更直接，因为国内站明确给出了 `settings.txt` 和命令配置两种方式。

### 6.1 Windows 设置镜像

#### 方法一：修改 `settings.txt`

根据国内站文档，可以直接修改 NVM 安装目录下的 `settings.txt`。

例如：

```text
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

或者使用清华镜像：

```text
node_mirror: https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
npm_mirror: https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/npm/
```

注意点：

- URL 结尾要保留 `/`
- 修改完 `settings.txt` 后，重新打开终端再执行 `nvm install`

#### 方法二：用 NVM 命令设置

```powershell
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

或者使用清华镜像：

```powershell
nvm node_mirror https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/
nvm npm_mirror https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/npm/
```

设置完成后，再执行：

```powershell
nvm install lts
```

#### npm 包下载加速

国内站还补充了 `npm registry` 的设置，这一点我上一个版本漏掉了。

如果你希望 npm 安装依赖也走国内镜像，可以执行：

```powershell
npm config set registry https://registry.npmmirror.com
```

查看当前 registry：

```powershell
npm config get registry
```

### 6.2 Ubuntu 设置镜像

国内站这页主要针对 `nvm-windows`。  
对于 `Ubuntu` 下的 `nvm-sh`，更稳妥的方式仍然是使用上游 `nvm-sh` 支持的环境变量来指定 Node 下载源。

临时使用一次：

```bash
NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node nvm install 18.16.0
```

长期使用，可以写入 `~/.bashrc`：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
export NVM_NPM_MIRROR=https://npmmirror.com/mirrors/npm
```

然后重新加载：

```bash
source ~/.bashrc
```

如果后面想恢复官方源，删除这两行配置即可。

如果你还希望 npm 安装项目依赖也走国内镜像，可以再执行：

```bash
npm config set registry https://registry.npmmirror.com
```

查看当前 registry：

```bash
npm config get registry
```

---

## 七、常见问题

### 1. 切换版本后，全局 npm 包“不见了”

这不是 bug，而是正常现象。

无论是 `nvm-windows` 还是 `nvm-sh`：

- 每个 Node.js 版本都有自己独立的 npm 环境
- 你在 `Node 18` 下全局安装的包
- 切到 `Node 20` 后不会自动共享

例如：

```bash
npm install -g pnpm
```

如果你切换了 Node.js 版本，通常要重新安装一次全局包。

### 2. Ubuntu 下能不能用 `sudo nvm install`？

不建议，官方文档明确提示不要这样做。

`nvm-sh` 设计上就是装在当前用户目录中，例如 `~/.nvm`，正常使用不需要管理员权限。  
如果用了 `sudo`，反而容易把目录所有权和权限搞乱。

### 3. Windows 下 `nvm use` 成功了，但 `node -v` 没变化

优先检查：

- 当前终端是否以管理员身份运行
- 系统里是否还有旧 Node.js 安装残留在 PATH 中
- 是否需要关闭并重新打开终端

必要时可以先卸载旧版 Node.js，再重新执行：

```powershell
nvm use 18.16.0
node -v
```

### 4. Ubuntu 下安装完提示 `nvm: command not found`

通常执行下面两步就够了：

```bash
source ~/.bashrc
nvm --version
```

如果仍然失败，就打开 `~/.bashrc` 检查是否已有以下初始化代码：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### 5. WSL 该按哪套步骤装？

如果你是在 `Windows Subsystem for Linux` 里安装，那么本质上它是 Linux shell 环境，应当使用：

- `nvm-sh`
- 也就是本文的 `Ubuntu` 安装方式

不要在 WSL 里安装 `nvm-windows`。

---

## 八、官网与上游地址

- NVM 中文网首页：
  `https://www.nvmnode.com/zh/`
- 下载页：
  `https://www.nvmnode.com/guide/download.html`
- 安装页：
  `https://www.nvmnode.com/guide/installation.html`
- 使用页：
  `https://www.nvmnode.com/guide/usage.html`
- 国内镜像说明：
  `https://nvm.uihtm.com/doc/npmmirror.html`
- Linux / Mac 命令说明：
  `https://nvm.uihtm.com/doc/nvm-help-linux.html`
- `nvm-windows` 上游仓库：
  `https://github.com/coreybutler/nvm-windows`
- `nvm-sh` 上游仓库：
  `https://github.com/nvm-sh/nvm`

---

## 九、总结

在不同系统下使用 NVM，关键不是死记命令，而是先分清自己到底在用哪一套实现：

1. `Windows 原生系统`：使用 `nvm-windows`
2. `Ubuntu / Linux / WSL`：使用 `nvm-sh`
3. 两边命令相似，但不能混着抄

如果你只想快速记住最核心的操作，可以记成下面这组命令。

### Windows 最短路径

```powershell
nvm list available
nvm install lts
nvm use 18.16.0
node -v
```

### Ubuntu 最短路径

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use 18.16.0
node -v
```

掌握这一套之后，你就可以比较稳定地在不同项目之间切换 Node.js 版本，而不必再反复卸载和重装 Node。

### 相关文档

- [终端网络请求和软件包下载](./终端网络请求和软件包下载.md)
- [Linux环境变量和echo命令](./Linux环境变量和echo命令.md)
- [使用SDKMAN管理Java版本](./使用SDKMAN管理Java版本.md)
