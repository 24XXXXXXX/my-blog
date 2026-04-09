---
title: "Windows 下安装和使用 conda"
description: "详细介绍如何在 Windows 系统中安装 conda，并掌握环境创建、激活、包管理、channel 配置与常见问题排查"
keywords: "conda,Windows,Miniconda,Anaconda,Miniforge,Python,环境管理,包管理"

date: 2026-04-08T10:00:00+08:00
lastmod: 2026-04-09T10:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Conda
  - Windows
  - Python
  - 环境搭建
  - 包管理
---

conda 是 Python 生态里最常见的环境和包管理工具之一。对于需要隔离不同项目依赖、切换不同 Python 版本、安装科学计算包或机器学习库的场景，conda 往往比“全局直接装一堆包”稳得多。

<!--more-->

## 一、conda 是什么

conda 可以同时做两件事：

- 管理环境
- 管理软件包

你可以把它理解成：

- 一个项目一个独立环境
- 每个环境里有自己的 Python、pip 和依赖包
- 环境之间互不干扰

这可以解决很多常见问题，比如：

- 项目 A 需要 `Python 3.10`
- 项目 B 需要 `Python 3.12`
- 项目 C 依赖老版本 `numpy`

如果不用环境隔离，这些依赖很容易互相冲突。使用 conda 后，就可以把它们拆开管理。

---

## 二、Windows 下应该装哪个 conda 发行版

根据 conda 官方文档，Windows 下常见安装器主要有三种：

- `Miniconda`
- `Anaconda Distribution`
- `Miniforge`

它们都能使用 `conda`，区别主要在于预装内容和默认软件源。

### 2.1 Miniconda

特点：

- 官方轻量安装器
- 只带最基础的 conda、Python 和少量必要组件
- 更适合开发者自己按需安装包

适合人群：

- 只想装最小可用环境
- 平时主要在命令行里使用 conda
- 不想一上来安装很多数据科学包

### 2.2 Anaconda Distribution

特点：

- 官方完整发行版
- 预装大量常见科学计算和数据分析包
- 自带图形界面工具，如 Navigator

适合人群：

- 刚接触 Python 数据分析
- 希望开箱即用
- 更依赖图形界面而不是命令行

### 2.3 Miniforge

特点：

- 社区维护
- 默认使用 `conda-forge` channel
- 很多新包和跨平台包获取更方便

适合人群：

- 常用 `conda-forge`
- 更偏向开源社区生态
- 对 channel 行为有一定了解

### 2.4 我的建议

如果你只是想在 Windows 上稳定使用 conda，通常推荐：

- `Miniconda`：最通用、最省心

如果你明确知道自己更依赖 `conda-forge`，可以选：

- `Miniforge`

如果你想少配环境、直接开始数据科学工作，也可以选：

- `Anaconda Distribution`

本文后续命令对这三者基本通用。

---

## 三、Windows 安装 conda

### 3.1 安装前建议

开始前建议先确认几件事：

- 你的系统是 64 位 Windows
- 关闭当前已打开的 `PowerShell`、`CMD`、VS Code 终端
- 如果之前单独安装过 Python，最好先搞清楚是否要继续保留

这里最重要的一点是：

- 不要把 conda 和一堆全局 Python 路径混在一起使用

否则后面很容易出现：

- `python` 不是 conda 环境里的 Python
- `pip install` 装到了别的地方
- `conda activate` 后版本没变化

### 3.2 下载安装器

可以从 conda 官方文档提供的 Windows 安装页面进入下载：

- `Miniconda installer for Windows`
- `Anaconda Distribution installer for Windows`
- `Miniforge installer for Windows`

下载时优先选择：

- `Windows x86_64`
- `.exe` 安装程序

如果你使用的是 `Anaconda Distribution`，官方 Windows CLI 安装页也提供了直接下载命令。

截至 `2026-04-08`，Anaconda 官网页面示例使用的安装包是：

```text
Anaconda3-2025.12-2-Windows-x86_64.exe
```

PowerShell 下载命令：

```powershell
Invoke-WebRequest -Uri "https://repo.anaconda.com/archive/Anaconda3-2025.12-2-Windows-x86_64.exe" -OutFile ".\Anaconda3-2025.12-2-Windows-x86_64.exe"
```

如果你使用 `Command Prompt`，官网示例命令是：

```powershell
curl https://repo.anaconda.com/archive/Anaconda3-2025.12-2-Windows-x86_64.exe --output .\Anaconda3-2025.12-2-Windows-x86_64.exe
```

下载完成后，可以直接双击该 `.exe` 文件启动安装。

### 3.3 可选：校验安装包完整性

Anaconda 官网建议下载安装包后做一次 `SHA-256` 校验。

在 `PowerShell` 或 `CMD` 中执行：

```powershell
certutil -hashfile .\Anaconda3-2025.12-2-Windows-x86_64.exe SHA256
```

然后把输出的哈希值与官方归档页中的对应值进行比对。如果一致，说明安装包没有被篡改或损坏。

### 3.4 安装过程怎么选

双击安装程序后，按向导安装即可。常见选项建议如下：

#### Installation Type

一般选：

- `Just Me`

除非你非常明确要给整台机器所有用户共用，否则个人电脑没有必要默认选 `All Users`。

#### Install Location

建议安装到：

- 不带中文
- 不带空格
- 路径不要太深

例如：

```text
C:\miniconda3
```

或者：

```text
D:\miniconda3
```

#### Add to PATH

Windows 下通常**不建议**勾选“把 conda 加入 PATH”这类选项。

原因是：

- 官方长期不推荐这样做
- 容易和系统里其他 Python、pip 冲突
- 多个终端环境混用时更难排查问题

更稳妥的方式是：

- 安装完成后使用 `Anaconda Prompt`
- 或者手动执行 `conda init` 初始化 PowerShell / CMD

#### Register as default Python

如果你知道自己在做什么，可以按需决定。  
如果你不确定，通常可以保持默认，不强行把它注册成系统默认 Python。

不过如果你当前主要就是准备用 `Anaconda` 这一套 Python 做开发，而不是已经长期维护另一套独立 Python 环境，那么更推荐：

- 勾选 `Register Anaconda3 as my default Python`

这样做的好处是：

- 一些编辑器和工具更容易识别到 Anaconda 里的 Python
- 对新手来说更省事
- 后面配置解释器时更不容易混乱

如果你本机已经有一套明确在用的 Python，例如：

- 单独安装的 Python
- 通过 `pyenv-win`、`uv`、`nvm` 这类工具管理的开发环境

那就可以不勾，避免互相干扰。

#### Clear the package cache upon completion

这个选项通常**不建议勾选**。

原因是：

- 安装后保留缓存，后续创建环境和安装常见包会更快
- 重新安装部分依赖时更方便
- 对离线或网络不稳定场景更友好

它的代价只是：

- 多占用一些磁盘空间

如果你非常在意磁盘空间，后面也可以手动清理，不必在安装时急着清掉。

#### 一个适合大多数人的勾选方案

如果你看到安装器高级选项里有四项，通常可以这样选：

- `Create shortcuts`：勾选
- `Add Anaconda3 to my PATH environment variable`：不要勾选
- `Register Anaconda3 as my default Python`：建议勾选
- `Clear the package cache upon completion`：不要勾选

这套选择比较稳妥，适合大多数 Windows 用户，尤其适合刚开始用 conda 的读者。

### 3.5 安装完成后的首次验证

安装完成后，从开始菜单打开：

- `Anaconda Prompt`
- 或对应的 `Miniforge Prompt`

然后执行：

```powershell
conda --version
conda info
conda list
```

如果这些命令能正常执行，说明 conda 基本已经安装成功。

---

## 四、让 PowerShell 或 CMD 能直接使用 conda

很多人安装完成后会遇到一个问题：

- 在 `Anaconda Prompt` 里能用 conda
- 但在自己常用的 `PowerShell` 里不能用

这时就要执行初始化。

### 4.1 初始化 PowerShell

在已经可用 conda 的终端中执行：

```powershell
conda init powershell
```

执行后关闭当前 PowerShell，再重新打开。

然后测试：

```powershell
conda --version
```

### 4.2 初始化 CMD

如果你也常用 CMD，可以执行：

```powershell
conda init cmd.exe
```

### 4.3 初始化所有已支持的 shell

也可以直接执行：

```powershell
conda init --all
```

不过更建议按需初始化，避免一次性改太多 shell 配置。

### 4.4 撤销初始化

如果你后面不想让 conda 修改 shell 配置，可以执行：

```powershell
conda init --reverse powershell
```

---

## 五、conda 最常用的环境命令

下面这部分是日常最常用的内容。

### 5.1 查看当前 conda 信息

```powershell
conda info
conda env list
```

或者：

```powershell
conda info --envs
```

### 5.2 创建环境

创建一个名为 `py310`、Python 版本为 `3.10` 的环境：

```powershell
conda create -n py310 python=3.10
```

创建时如果希望顺便装一些基础包，也可以：

```powershell
conda create -n dataenv python=3.11 numpy pandas matplotlib
```

### 5.3 激活环境

```powershell
conda activate py310
```

激活后，命令行前面一般会出现环境名，例如：

```text
(py310) PS C:\Users\xxx>
```

### 5.4 退出当前环境

```powershell
conda deactivate
```

### 5.5 删除环境

```powershell
conda remove -n py310 --all
```

这个命令会删除整个环境，不只是删除其中某个包。

---

## 六、使用 conda 安装和管理包

### 6.1 在当前环境中安装包

先激活环境：

```powershell
conda activate py310
```

然后安装包：

```powershell
conda install numpy
conda install pandas matplotlib
```

### 6.2 安装指定版本

```powershell
conda install python=3.10
conda install numpy=1.26
```

### 6.3 更新包

```powershell
conda update numpy
```

更新 conda 自己：

```powershell
conda update conda
```

### 6.4 删除包

```powershell
conda remove numpy
```

### 6.5 搜索包

```powershell
conda search numpy
```

### 6.6 查询 Python 版本和依赖包版本

查看当前激活环境里的 Python 版本：

```powershell
python -V
```

或者：

```powershell
conda list python
```

查看某个依赖包当前安装的版本：

```powershell
conda list numpy
conda list pandas
```

如果想查看当前环境中所有已安装包及其版本，可以执行：

```powershell
conda list
```

如果你还没激活环境，也可以直接查询指定环境里的包版本：

```powershell
conda list -n py310 python
conda list -n py310 numpy
```

### 6.7 在指定环境中安装 Python 或依赖包

如果环境还没创建，最常见的方式是在创建时直接指定 Python 版本：

```powershell
conda create -n py311 python=3.11
```

如果环境已经存在，也可以进入环境后升级或切换 Python 版本：

```powershell
conda activate py310
conda install python=3.11
```

也可以不先激活，直接对指定环境安装包：

```powershell
conda install -n py310 scipy
conda install -n py310 python=3.11
```

这种写法适合脚本化操作，或者你同时维护多个环境时使用。

### 6.8 一次安装多个依赖包

```powershell
conda install numpy pandas scipy matplotlib
```

如果你希望尽量减少交互提示，可以加上：

```powershell
conda install numpy pandas scipy -y
```

### 6.9 从文件批量安装依赖

如果团队里已经整理好了 `environment.yml`，推荐优先这样安装：

```powershell
conda env create -f environment.yml
```

如果只是拿到一个 `requirements.txt`，通常说明对方更偏向 `pip` 工作流，这时一般做法是：

```powershell
conda create -n demo python=3.11
conda activate demo
pip install -r requirements.txt
```

---

## 七、conda 和 pip 应该怎么配合

这是实际开发里非常关键的一点。

### 7.1 推荐顺序

通常建议：

1. 先用 conda 创建环境
2. 优先用 conda 安装 conda 仓库里已有的包
3. conda 没有的包，再用 pip 安装

例如：

```powershell
conda create -n webenv python=3.11
conda activate webenv
conda install requests
pip install fastapi uvicorn
```

### 7.2 为什么不要乱混装

因为：

- conda 管理的是二进制包和依赖关系
- pip 管理的是 Python 包
- 两者混用太随意时，环境解析会变复杂

所以更稳妥的经验是：

- 先 conda，后 pip
- 尽量在同一个环境里操作
- 不要在没激活环境时直接装包

### 7.3 如何确认自己装到哪里了

激活环境后执行：

```powershell
where python
where pip
python -V
pip -V
```

如果路径指向当前 conda 环境目录，说明你装的位置基本是对的。

### 7.4 conda 安装依赖和 pip 安装依赖有什么区别

可以先记住一个最实用的结论：

- `conda` 不只是装 Python 包，它还会处理很多底层二进制依赖
- `pip` 主要安装 Python 包，默认来自 `PyPI`

更具体一点：

- `conda install` 安装的是 conda 仓库里的包，很多科学计算库已经提前编译好
- `pip install` 安装的是 Python 社区发布到 `PyPI` 的包，生态更大、更新更快
- `conda` 更擅长处理 `numpy`、`pytorch`、`opencv` 这类可能依赖底层库的包
- `pip` 更适合安装很多 Web、工具链、插件型库，例如一些最新框架或小众包

### 7.5 什么时候优先用 conda，什么时候优先用 pip

更推荐优先用 `conda` 的场景：

- 你需要安装 Python 本体
- 你需要切换 Python 版本
- 你安装的是科学计算、数据分析、机器学习相关包
- 你希望环境求解尽量稳定

更适合用 `pip` 的场景：

- conda 仓库里没有这个包
- 你需要安装最新版本的 Python 社区包
- 项目官方文档明确只提供 `pip install` 用法

### 7.6 一个简单对比

```text
conda install numpy
```

通常表示：

- 从 conda channel 获取包
- 同时考虑 Python 版本、ABI、底层依赖兼容性
- 更适合环境级依赖管理

```powershell
pip install numpy
```

通常表示：

- 从 PyPI 获取包
- 主要按 Python 包依赖关系安装
- 某些平台或版本下可能需要额外处理编译问题

### 7.7 混用时的注意事项

- 不要先 `pip install` 一堆核心包，再让 `conda` 回头大规模重算环境
- 对同一个核心包，尽量不要反复在 `conda` 和 `pip` 之间来回覆盖安装
- 如果环境已经被混装到很乱，通常新建一个环境比硬修更省时间

一句话概括就是：

- `conda` 更像“环境级包管理”
- `pip` 更像“Python 生态包安装”

---

## 八、channel 是什么，什么时候要用 conda-forge

channel 可以理解成 conda 的软件仓库来源。

常见来源有：

- 默认仓库 `defaults`
- 社区仓库 `conda-forge`

### 8.1 临时从某个 channel 安装

```powershell
conda install -c conda-forge black
```

### 8.2 查看当前 channel 配置

```powershell
conda config --show channels
```

### 8.3 添加 conda-forge

```powershell
conda config --add channels conda-forge
```

### 8.4 一条经验

如果你已经决定主要使用 `conda-forge`，最好尽量保持一致，不要长期在同一个环境里频繁混用多个来源的同类核心包，否则依赖求解和兼容性会更麻烦。

---

## 九、导出和复用环境

这对团队协作和项目迁移非常有用。

### 9.1 导出环境

```powershell
conda env export > environment.yml
```

这样会在当前目录生成一个 `environment.yml` 文件。

### 9.2 从环境文件创建环境

```powershell
conda env create -f environment.yml
```

### 9.3 更新已有环境

```powershell
conda env update -f environment.yml --prune
```

其中 `--prune` 表示把环境里不再需要的包也清理掉。

---

## 十、Windows 下常见问题

### 10.1 `conda` 不是内部或外部命令

通常原因有：

- 你打开的是普通终端，但还没执行 `conda init`
- 安装后没有重新打开终端
- PATH 或 shell 初始化还没生效

处理方式：

```powershell
conda init powershell
```

然后关闭终端重新打开。

### 10.2 `conda activate` 不生效

常见原因：

- shell 没初始化
- 你当前终端会话没有加载 conda 的 hook

优先执行：

```powershell
conda init powershell
```

### 10.3 `python` 版本不对

先检查：

```powershell
conda activate py310
where python
python -V
```

如果 `where python` 指向的不是当前 conda 环境，说明你的系统里可能还有其他 Python 抢在前面。

### 10.4 安装包很慢

可能原因包括：

- 网络问题
- channel 选择不合适
- 当前环境依赖过于复杂

常见优化思路：

- 尽量新建环境，而不是在一个很老的大环境里不断叠加包
- 尽量减少混用多个 channel
- 优先安装核心依赖，再装边缘依赖

### 10.5 base 环境要不要长期乱装包

一般不推荐。

更稳妥的做法是：

- `base` 环境尽量保持干净
- 每个项目单独创建环境

例如：

```powershell
conda create -n myproject python=3.11
conda activate myproject
```

---

## 十一、推荐的一套日常使用流程

如果你是第一次在 Windows 上认真使用 conda，可以直接按这套流程来：

### 11.1 安装

- 安装 `Miniconda`
- 不强行加入系统 PATH
- 安装后先在 `Anaconda Prompt` 里验证

### 11.2 初始化 PowerShell

```powershell
conda init powershell
```

### 11.3 每个项目新建环境

```powershell
conda create -n demo python=3.11
conda activate demo
```

### 11.4 先 conda 后 pip

```powershell
conda install numpy pandas
pip install django
```

### 11.5 项目完成后导出环境

```powershell
conda env export > environment.yml
```

---

## 十二、常用命令速查

```powershell
# 查看 conda 版本
conda --version

# 查看当前 Python 版本
python -V

# 查看当前环境中 python 包版本
conda list python

# 查看环境列表
conda env list

# 创建环境
conda create -n py311 python=3.11

# 激活环境
conda activate py311

# 退出环境
conda deactivate

# 安装包
conda install numpy

# 在指定环境安装包
conda install -n py311 pandas

# 安装指定版本
conda install numpy=1.26

# 安装或切换 Python 版本
conda install python=3.11

# 查看某个包版本
conda list numpy

# 查看指定环境里的某个包版本
conda list -n py311 numpy

# 搜索包
conda search pytorch

# 删除包
conda remove numpy

# 更新 conda
conda update conda

# 删除整个环境
conda remove -n py311 --all

# 导出环境
conda env export > environment.yml

# 根据环境文件创建环境
conda env create -f environment.yml
```

---

## 十三、总结

Windows 下使用 conda，最关键的不是“把命令背下来”，而是先建立正确习惯：

- 优先选合适的发行版
- 安装后先做好 shell 初始化
- 一个项目一个环境
- 先 conda，后 pip
- 尽量别把所有东西都塞进 `base`

只要这几个原则不乱，conda 在 Windows 上其实是很好用的。对于 Python 开发、数据分析、机器学习和自动化脚本场景，它都能明显降低环境冲突的概率。
