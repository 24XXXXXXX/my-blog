---
title: "apt 与 apt-get：Ubuntu/Debian 包管理工具详解"
description: "深入理解 apt 和 apt-get 的区别、使用场景和最佳实践"
keywords: "apt,apt-get,Ubuntu,Debian,包管理,Linux"

date: 2026-03-24T11:11:14+08:00
lastmod: 2026-03-24T11:11:14+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Linux
  - Ubuntu
  - 包管理
---

`sudo apt` 和 `sudo apt-get` 都是 Ubuntu/Debian 系统的包管理工具，它们本质上使用同一个后端，但 apt 是 apt-get 的现代化改进版本。本文将详细介绍两者的区别和使用场景。

<!--more-->

## 核心区别

| 特性 | apt (Advanced Package Tool) | apt-get |
|------|----------------------------|---------|
| 发布时间 | 2014年（Ubuntu 14.04+） | 1998年（更早） |
| 设计目标 | 用户友好，交互式体验 | 脚本友好，稳定输出 |
| 进度条 | 有彩色进度条，更直观 | 无进度条，纯文本输出 |
| 搜索功能 | `apt search` 显示更多信息 | `apt-cache search` 信息较少 |
| 推荐操作 | 安装后提示可自动删除的包 | 无提示 |
| 命令简洁性 | 更简洁（如 `apt install`） | 稍冗长（`apt-get install`） |
| 向后兼容 | 兼容大部分 apt-get 功能 | 完全稳定 |

## 常用命令对比

| 操作 | apt 命令 | apt-get 命令 |
|------|----------|--------------|
| 更新软件源 | `sudo apt update` | `sudo apt-get update` |
| 安装软件 | `sudo apt install docker` | `sudo apt-get install docker` |
| 删除软件 | `sudo apt remove docker` | `sudo apt-get remove docker` |
| 升级所有软件 | `sudo apt upgrade` | `sudo apt-get upgrade` |
| 完全升级 | `sudo apt full-upgrade` | `sudo apt-get dist-upgrade` |
| 搜索软件 | `apt search nginx` | `apt-cache search nginx` |
| 查看软件信息 | `apt show docker` | `apt-cache show docker` |
| 列出已安装 | `apt list --installed` | `dpkg -l` |
| 清理无用包 | `sudo apt autoremove` | `sudo apt-get autoremove` |
| 清理缓存 | `sudo apt clean` | `sudo apt-get clean` |

## 详细功能对比

### 1. 用户体验

**apt 的优势：**

```bash
# apt 有彩色进度条和百分比显示
sudo apt update
# 输出示例：
# Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
# Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
# Fetched 119 kB in 2s (59.5 kB/s)
# Reading package lists... Done
# Building dependency tree... Done
# 3 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

**apt-get 的输出：**

```bash
# apt-get 输出更简洁，适合脚本解析
sudo apt-get update
# 输出纯文本，无颜色和进度条
```

### 2. 搜索功能

**apt search（推荐）：**

```bash
apt search nginx
# 显示包名、版本、简短描述
# nginx/jammy-updates 1.18.0-6ubuntu14.4 amd64
#   small, powerful, scalable web/proxy server
```

**apt-cache search：**

```bash
apt-cache search nginx
# 只显示包名和简短描述
# nginx - small, powerful, scalable web/proxy server
```

### 3. 软件信息查看

**apt show（更详细）：**

```bash
apt show docker.io
# 显示：
# - 包名、版本
# - 依赖关系
# - 安装大小
# - 下载大小
# - 详细描述
# - 官方网站
```

**apt-cache show：**

```bash
apt-cache show docker.io
# 信息类似，但格式略有不同
```

## 生产环境建议

### 交互式操作（推荐 apt）

更直观，有进度条和颜色提示：

```bash
# 日常手动操作
sudo apt update
sudo apt install docker-ce
sudo apt upgrade

# 查看可升级的包
apt list --upgradable

# 搜索软件包
apt search python3
```

### 脚本/自动化（推荐 apt-get）

输出稳定，适合脚本处理：

```bash
#!/bin/bash
# 自动化部署脚本

# -y 自动确认，-q 安静模式
sudo apt-get update -q
sudo apt-get install -y docker-ce > /dev/null 2>&1

# 检查安装结果
if [ $? -eq 0 ]; then
    echo "Docker 安装成功"
else
    echo "Docker 安装失败"
    exit 1
fi

# 清理
sudo apt-get autoremove -y
sudo apt-get clean
```

## 特殊功能

### 1. 清理无用包

```bash
# apt 方式（推荐）
sudo apt autoremove

# apt-get 方式
sudo apt-get autoremove

# 同时清理配置文件
sudo apt autoremove --purge
```

### 2. 下载不安装

只能用 apt-get：

```bash
# 仅下载 deb 包到当前目录
sudo apt-get download nginx

# 下载包及其依赖
sudo apt-get install --download-only nginx
```

### 3. 模拟安装

```bash
# apt 方式
sudo apt install --dry-run nginx

# apt-get 方式
sudo apt-get install -s nginx
```

### 4. 重新安装

```bash
# apt 方式
sudo apt reinstall nginx

# apt-get 方式
sudo apt-get install --reinstall nginx
```

### 5. 锁定软件包版本

```bash
# 锁定包，防止升级
sudo apt-mark hold nginx

# 查看已锁定的包
apt-mark showhold

# 解锁包
sudo apt-mark unhold nginx
```

## 高级用法

### 1. 指定版本安装

```bash
# 查看可用版本
apt list -a nginx

# 安装特定版本
sudo apt install nginx=1.18.0-6ubuntu14.4
```

### 2. 从特定源安装

```bash
# 添加 PPA
sudo add-apt-repository ppa:nginx/stable
sudo apt update

# 从指定源安装
sudo apt install -t jammy-backports nginx
```

### 3. 修复损坏的依赖

```bash
# 修复依赖关系
sudo apt --fix-broken install

# 或使用 apt-get
sudo apt-get -f install
```

### 4. 清理缓存

```bash
# 清理所有缓存
sudo apt clean

# 只清理过期缓存
sudo apt autoclean

# 查看缓存大小
du -sh /var/cache/apt/archives
```

## 常见问题

### 1. 软件包被锁定

```bash
# 错误：Could not get lock /var/lib/dpkg/lock-frontend

# 解决方法：
sudo killall apt apt-get
sudo rm /var/lib/apt/lists/lock
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock*
sudo dpkg --configure -a
sudo apt update
```

### 2. 依赖关系问题

```bash
# 尝试修复
sudo apt --fix-broken install
sudo apt autoremove
sudo apt update
sudo apt upgrade
```

### 3. 软件源问题

```bash
# 备份并编辑软件源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo nano /etc/apt/sources.list

# 更新软件源
sudo apt update
```

## apt vs apt-get vs aptitude

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| apt | 现代化、用户友好 | 日常交互式操作 |
| apt-get | 稳定、脚本友好 | 自动化脚本 |
| aptitude | 交互式界面、智能依赖处理 | 复杂依赖问题 |

## 最佳实践

### 日常使用

```bash
# 1. 定期更新系统
sudo apt update && sudo apt upgrade -y

# 2. 清理无用包
sudo apt autoremove

# 3. 清理缓存
sudo apt clean
```

### 脚本编写

```bash
#!/bin/bash
# 使用 apt-get 确保稳定性

set -e  # 遇到错误立即退出

# 更新软件源
sudo apt-get update -qq

# 安装软件（静默模式）
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io

# 清理
sudo apt-get autoremove -y
sudo apt-get clean
```

### 安全更新

```bash
# 只安装安全更新
sudo apt-get install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# 手动安装安全更新
sudo apt-get upgrade -y --only-upgrade
```

## 总结

- **日常使用选 apt**：界面友好，有进度提示，命令更短
- **写脚本选 apt-get**：输出稳定，行为可预测
- **两者混用没问题**：系统底层是同一个包管理器，不会冲突
- **你的场景**：
  - 在服务器上手动操作，用 `apt` 体验更好
  - 如果写自动化部署脚本，用 `apt-get` 更可靠

记住：`apt` = 更好的用户体验，`apt-get` = 更好的脚本稳定性。
