---
title: "使用 SDKMAN 管理 Java 版本"
description: "详细介绍如何在 Linux、macOS 和 Windows 系统中使用 SDKMAN 管理多个 Java 版本，实现快速切换和环境配置"
keywords: "SDKMAN,Java,JDK,版本管理,多版本切换,SDK管理"

date: 2026-03-27T10:00:00+08:00
lastmod: 2026-03-27T10:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Java
  - JDK
  - 版本管理
  - 开发工具
  - SDKMAN
---

本文详细介绍如何使用 SDKMAN（Software Development Kit Manager）管理多个 Java 版本及其他 SDK，实现快速切换和环境配置。

<!--more-->

> **为什么选择 SDKMAN？**
>
> 1. **活跃维护**：SDKMAN 是目前最活跃的 Java 版本管理工具，持续更新
> 2. **最新版本**：支持最新的 JDK 版本（包括 Java 21、25、26 等）
> 3. **多 SDK 支持**：不仅管理 Java，还支持 Gradle、Maven、Kotlin、Scala 等 70+ 种 SDK
> 4. **跨平台**：支持 Linux、macOS、Windows（通过 WSL 或 Git Bash）
> 5. **简单易用**：命令简洁，安装和切换都很方便
> 6. **社区活跃**：拥有庞大的用户社区和完善的文档

## 一、SDKMAN 简介

### 1.1 什么是 SDKMAN

SDKMAN（Software Development Kit Manager）是一个用于管理多个软件开发工具包（SDK）并行版本的工具。它提供了便捷的命令行界面（CLI），用于安装、切换、删除和列出候选版本。

### 1.2 SDKMAN 的优势

- **版本丰富**：支持最新的 JDK 版本和多种发行版
- **自动更新**：定期更新可用版本列表
- **智能切换**：支持全局默认版本和项目特定版本
- **零配置**：自动配置环境变量
- **离线模式**：支持离线使用已安装的版本
- **多 SDK 管理**：一个工具管理所有开发工具

### 1.3 支持的 JDK 发行版

SDKMAN 支持多种 JDK 发行版，包括：

- **Eclipse Temurin**（推荐，原 AdoptOpenJDK）
- **Oracle OpenJDK**
- **Oracle GraalVM**
- **Amazon Corretto**
- **Azul Zulu**
- **Microsoft OpenJDK**
- **SAP Machine**
- **Liberica**
- **Mandrel**
- **Dragonwell**
- 以及更多...

### 1.4 支持的其他 SDK

除了 Java，SDKMAN 还支持：

- **构建工具**：Gradle、Maven、Ant、SBT
- **编程语言**：Kotlin、Scala、Groovy、Ceylon
- **框架**：Spring Boot CLI、Micronaut、Quarkus
- **工具**：JBang、VisualVM、JMeter
- 总计 70+ 种 SDK

---

## 二、在 Linux 和 macOS 中使用 SDKMAN

### 2.1 安装 SDKMAN

#### 系统要求

```bash
# 需要以下工具（通常已预装）
# - bash 或 zsh
# - curl 或 wget
# - zip 或 unzip

# 检查是否已安装
which bash
which curl
which zip
```

#### 安装步骤

```bash
# 使用官方安装脚本
curl -s "https://get.sdkman.io" | bash

# 或使用 wget
wget -qO- "https://get.sdkman.io" | bash
```

#### 初始化 SDKMAN

```bash
# 加载 SDKMAN 到当前 shell
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 或者关闭并重新打开终端

# 验证安装
sdk version
# 输出示例：SDKMAN 5.18.2
```

#### 自动初始化配置

安装脚本会自动将以下内容添加到你的 shell 配置文件：

```bash
# 对于 Bash 用户（~/.bashrc 或 ~/.bash_profile）
# 对于 Zsh 用户（~/.zshrc）

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"
```

### 2.2 查看可用的 Java 版本

```bash
# 查看所有可用的 Java 版本
sdk list java

# 输出示例（部分）：
# ================================================================================
# Available Java Versions for Linux 64bit
# ================================================================================
#  Vendor        | Use | Version      | Dist    | Status     | Identifier
# --------------------------------------------------------------------------------
#  Corretto      |     | 26           | amzn    |            | 26-amzn
#                |     | 25.0.1       | amzn    |            | 25.0.1-amzn
#                |     | 21.0.6       | amzn    |            | 21.0.6-amzn
#  Temurin       |     | 26           | tem     |            | 26-tem
#                |     | 25.0.1       | tem     |            | 25.0.1-tem
#                |     | 21.0.6       | tem     |            | 21.0.6-tem
#                |     | 17.0.13      | tem     |            | 17.0.13-tem
#                |     | 11.0.25      | tem     |            | 11.0.25-tem
#                |     | 8.0.432      | tem     |            | 8.0.432-tem
```

```bash
# 查看特定发行版的版本
sdk list java | grep tem        # Eclipse Temurin
sdk list java | grep amzn       # Amazon Corretto
sdk list java | grep zulu       # Azul Zulu
sdk list java | grep oracle     # Oracle OpenJDK
sdk list java | grep graalvm    # GraalVM
sdk list java | grep ms         # Microsoft OpenJDK

# 查看已安装的版本
sdk list java | grep installed

# 查看当前使用的版本
sdk current java
```

### 2.3 安装 Java 版本

#### 安装最新版本

```bash
# 安装最新的 Eclipse Temurin（推荐）
sdk install java 26-tem         # Java 26
sdk install java 25.0.1-tem     # Java 25
sdk install java 21.0.6-tem     # Java 21 LTS
sdk install java 17.0.13-tem    # Java 17 LTS
sdk install java 11.0.25-tem    # Java 11 LTS
sdk install java 8.0.432-tem    # Java 8 LTS

# 安装 Amazon Corretto
sdk install java 21.0.6-amzn
sdk install java 17.0.13-amzn
sdk install java 11.0.25-amzn
sdk install java 8.0.432-amzn

# 安装 Azul Zulu
sdk install java 21.0.6-zulu
sdk install java 17.0.13-zulu
sdk install java 11.0.25-zulu

# 安装 GraalVM
sdk install java 21.0.6-graalce
sdk install java 17.0.13-graalce

# 安装 Oracle OpenJDK
sdk install java 21.0.6-oracle
sdk install java 17.0.13-oracle
```

#### 安装并立即使用

```bash
# 安装后自动设置为当前版本
sdk install java 21.0.6-tem

# 安装但不设置为当前版本
sdk install java 21.0.6-tem --no-use

# 验证安装
java -version
```

#### 安装特定版本

```bash
# 从列表中选择精确版本
sdk list java

# 安装特定版本
sdk install java 21.0.6-tem
sdk install java 17.0.13-tem
sdk install java 11.0.25-tem
sdk install java 8.0.432-tem
```

### 2.4 切换 Java 版本

#### 临时切换（当前终端会话）

```bash
# 切换到 Java 21
sdk use java 21.0.6-tem

# 验证
java -version
echo $JAVA_HOME

# 切换到 Java 17
sdk use java 17.0.13-tem
java -version

# 切换到 Java 11
sdk use java 11.0.25-tem
java -version

# 切换到 Java 8
sdk use java 8.0.432-tem
java -version
```

#### 永久切换（设置默认版本）

```bash
# 设置默认版本为 Java 21
sdk default java 21.0.6-tem

# 或设置为 Java 17
sdk default java 17.0.13-tem

# 或设置为 Java 11
sdk default java 11.0.25-tem

# 验证默认版本
sdk current java

# 新开终端会自动使用默认版本
```

#### 查看当前版本

```bash
# 查看当前使用的 Java 版本
sdk current java

# 查看所有 SDK 的当前版本
sdk current

# 输出示例：
# Using:
# java: 21.0.6-tem
# gradle: 8.5
# maven: 3.9.6
```

### 2.5 项目特定版本配置

#### 使用 .sdkmanrc 文件

```bash
# 在项目根目录创建 .sdkmanrc 文件
cd ~/projects/my-project
sdk env init

# 这会创建 .sdkmanrc 文件，内容示例：
# java=21.0.6-tem
# gradle=8.5
# maven=3.9.6
```

#### 手动创建 .sdkmanrc

```bash
# 创建 .sdkmanrc 文件
cat > .sdkmanrc << EOF
# Java version
java=21.0.6-tem

# Build tools
gradle=8.5
maven=3.9.6
EOF

# 使用项目配置
sdk env

# 或者自动切换（需要配置 shell hook）
sdk env install
```

#### 自动切换配置

```bash
# 编辑 ~/.sdkman/etc/config
vim ~/.sdkman/etc/config

# 启用自动切换
sdkman_auto_env=true

# 保存后，进入包含 .sdkmanrc 的目录会自动切换版本
cd ~/projects/my-project
# SDKMAN 会自动读取 .sdkmanrc 并切换版本
```

### 2.6 卸载 Java 版本

```bash
# 查看已安装的版本
sdk list java | grep installed

# 卸载特定版本
sdk uninstall java 21.0.6-tem
sdk uninstall java 17.0.13-tem
sdk uninstall java 11.0.25-tem

# 卸载多个版本
sdk uninstall java 8.0.432-tem
sdk uninstall java 21.0.6-amzn
```

### 2.7 更新 SDKMAN

```bash
# 更新 SDKMAN 本身
sdk selfupdate

# 强制更新
sdk selfupdate force

# 更新可用版本列表
sdk update

# 查看 SDKMAN 版本
sdk version
```

### 2.8 配置 SDKMAN

#### 配置文件位置

```bash
# SDKMAN 配置文件
~/.sdkman/etc/config

# 查看配置
cat ~/.sdkman/etc/config
```

#### 常用配置选项

```bash
# 编辑配置文件
vim ~/.sdkman/etc/config

# 自动回答 yes
sdkman_auto_answer=true

# 自动切换版本（进入目录时读取 .sdkmanrc）
sdkman_auto_env=true

# 自动完成
sdkman_auto_complete=true

# 彩色输出
sdkman_colour_enable=true

# 离线模式
sdkman_auto_selfupdate=false

# 调试模式
sdkman_debug_mode=false

# 保存配置后重新加载
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

---

## 三、在 Windows 中使用 SDKMAN

### 3.1 Windows 安装方式

SDKMAN 原生支持 Unix-like 系统，在 Windows 上有以下几种使用方式：

#### 方式 1：使用 WSL（推荐）

```bash
# 1. 安装 WSL（Windows Subsystem for Linux）
# 在 PowerShell（管理员）中运行：
wsl --install

# 2. 重启计算机

# 3. 打开 WSL（Ubuntu）终端

# 4. 安装 SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 5. 验证安装
sdk version
```

#### 方式 2：使用 Git Bash

```bash
# 1. 安装 Git for Windows（包含 Git Bash）
# 下载：https://git-scm.com/download/win

# 2. 打开 Git Bash

# 3. 安装 SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 4. 验证安装
sdk version
```

#### 方式 3：使用 Cygwin

```bash
# 1. 安装 Cygwin
# 下载：https://www.cygwin.com/

# 2. 确保安装了 bash、curl、zip、unzip

# 3. 打开 Cygwin 终端

# 4. 安装 SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

### 3.2 Windows 使用示例（WSL）

```bash
# 在 WSL 中使用 SDKMAN 与 Linux 完全相同

# 查看可用版本
sdk list java

# 安装 Java
sdk install java 21.0.6-tem

# 切换版本
sdk use java 21.0.6-tem

# 设置默认版本
sdk default java 21.0.6-tem

# 验证
java -version
```

### 3.3 Windows 环境变量配置

```bash
# WSL 中的 JAVA_HOME 会自动设置
echo $JAVA_HOME
# 输出：/home/username/.sdkman/candidates/java/current

# 如果需要在 Windows 中访问 WSL 的 Java
# 可以在 Windows 环境变量中添加：
# JAVA_HOME=\\wsl$\Ubuntu\home\username\.sdkman\candidates\java\current
# PATH=%JAVA_HOME%\bin;%PATH%
```

---

## 四、SDKMAN 常用命令参考

### 4.1 版本管理命令

```bash
# 列出所有可用的 SDK
sdk list

# 列出特定 SDK 的版本
sdk list java
sdk list gradle
sdk list maven

# 安装 SDK
sdk install <candidate> <version>
sdk install java 21.0.6-tem

# 卸载 SDK
sdk uninstall <candidate> <version>
sdk uninstall java 21.0.6-tem

# 使用特定版本（临时）
sdk use <candidate> <version>
sdk use java 21.0.6-tem

# 设置默认版本（永久）
sdk default <candidate> <version>
sdk default java 21.0.6-tem

# 查看当前版本
sdk current <candidate>
sdk current java

# 查看所有当前版本
sdk current
```

### 4.2 环境管理命令

```bash
# 初始化 .sdkmanrc 文件
sdk env init

# 使用 .sdkmanrc 配置
sdk env

# 安装 .sdkmanrc 中的所有 SDK
sdk env install

# 清除 .sdkmanrc 配置
sdk env clear
```

### 4.3 更新和维护命令

```bash
# 更新 SDKMAN 本身
sdk selfupdate

# 更新可用版本列表
sdk update

# 查看 SDKMAN 版本
sdk version

# 刷新本地缓存
sdk flush

# 刷新特定类型的缓存
sdk flush archives    # 清除下载的归档文件
sdk flush temp        # 清除临时文件
sdk flush broadcast   # 清除广播消息
sdk flush version     # 清除版本缓存
```

### 4.4 信息查询命令

```bash
# 查看帮助
sdk help

# 查看特定命令的帮助
sdk help install
sdk help use
sdk help list

# 查看 SDK 主页
sdk home java 21.0.6-tem

# 离线模式
sdk offline enable
sdk offline disable
```

---

## 五、管理其他 SDK

### 5.1 安装构建工具

```bash
# 安装 Gradle
sdk list gradle
sdk install gradle 8.5
sdk default gradle 8.5

# 安装 Maven
sdk list maven
sdk install maven 3.9.6
sdk default maven 3.9.6

# 安装 Ant
sdk install ant 1.10.14

# 验证
gradle --version
mvn --version
ant -version
```

### 5.2 安装其他语言和框架

```bash
# 安装 Kotlin
sdk install kotlin 1.9.22

# 安装 Scala
sdk install scala 3.3.1

# 安装 Groovy
sdk install groovy 4.0.18

# 安装 Spring Boot CLI
sdk install springboot 3.2.2

# 安装 Micronaut
sdk install micronaut 4.2.3

# 验证
kotlin -version
scala -version
groovy --version
spring --version
mn --version
```

### 5.3 查看所有已安装的 SDK

```bash
# 查看所有已安装的 SDK
sdk current

# 输出示例：
# Using:
# java: 21.0.6-tem
# gradle: 8.5
# maven: 3.9.6
# kotlin: 1.9.22
# springboot: 3.2.2
```

---

## 六、实用场景和技巧

### 6.1 多项目版本管理

#### 场景：不同项目使用不同 Java 版本

```bash
# 项目 A：使用 Java 8
cd ~/projects/legacy-project
sdk env init
# 编辑 .sdkmanrc
echo "java=8.0.432-tem" > .sdkmanrc
echo "gradle=7.6" >> .sdkmanrc
sdk env install

# 项目 B：使用 Java 11
cd ~/projects/spring-project
sdk env init
echo "java=11.0.25-tem" > .sdkmanrc
echo "maven=3.9.6" >> .sdkmanrc
sdk env install

# 项目 C：使用 Java 17
cd ~/projects/modern-project
sdk env init
echo "java=17.0.13-tem" > .sdkmanrc
echo "gradle=8.5" >> .sdkmanrc
sdk env install

# 项目 D：使用 Java 21
cd ~/projects/latest-project
sdk env init
echo "java=21.0.6-tem" > .sdkmanrc
echo "maven=3.9.6" >> .sdkmanrc
sdk env install
```

#### 自动切换配置

```bash
# 启用自动环境切换
vim ~/.sdkman/etc/config

# 设置
sdkman_auto_env=true

# 现在进入项目目录会自动切换版本
cd ~/projects/legacy-project
# 自动切换到 Java 8

cd ~/projects/latest-project
# 自动切换到 Java 21
```

### 6.2 快速切换脚本

```bash
# 创建快速切换别名
vim ~/.bashrc

# 添加别名
alias java8='sdk use java 8.0.432-tem'
alias java11='sdk use java 11.0.25-tem'
alias java17='sdk use java 17.0.13-tem'
alias java21='sdk use java 21.0.6-tem'

# 保存并生效
source ~/.bashrc

# 使用
java8
java -version

java21
java -version
```

### 6.3 批量安装常用工具

```bash
# 创建安装脚本
cat > ~/install-dev-tools.sh << 'EOF'
#!/bin/bash

# 安装 Java 版本
sdk install java 21.0.6-tem
sdk install java 17.0.13-tem
sdk install java 11.0.25-tem
sdk install java 8.0.432-tem

# 设置默认 Java 版本
sdk default java 21.0.6-tem

# 安装构建工具
sdk install gradle 8.5
sdk install maven 3.9.6

# 安装其他工具
sdk install kotlin 1.9.22
sdk install springboot 3.2.2

echo "所有工具安装完成！"
EOF

# 添加执行权限
chmod +x ~/install-dev-tools.sh

# 运行脚本
~/install-dev-tools.sh
```

### 6.4 Maven/Gradle 项目集成

```bash
# Maven 项目（Java 17）
cd my-maven-project
cat > .sdkmanrc << EOF
java=17.0.13-tem
maven=3.9.6
EOF
sdk env install
mvn clean install

# Gradle 项目（Java 21）
cd my-gradle-project
cat > .sdkmanrc << EOF
java=21.0.6-tem
gradle=8.5
EOF
sdk env install
gradle build

# Spring Boot 项目（Java 17）
cd my-springboot-project
cat > .sdkmanrc << EOF
java=17.0.13-tem
maven=3.9.6
springboot=3.2.2
EOF
sdk env install
./mvnw spring-boot:run
```

### 6.5 CI/CD 集成

#### GitHub Actions 示例

```yaml
name: Build with SDKMAN

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install SDKMAN
        run: |
          curl -s "https://get.sdkman.io" | bash
          source "$HOME/.sdkman/bin/sdkman-init.sh"
      
      - name: Install Java
        run: |
          source "$HOME/.sdkman/bin/sdkman-init.sh"
          sdk install java 21.0.6-tem
          sdk use java 21.0.6-tem
      
      - name: Install Maven
        run: |
          source "$HOME/.sdkman/bin/sdkman-init.sh"
          sdk install maven 3.9.6
      
      - name: Build
        run: |
          source "$HOME/.sdkman/bin/sdkman-init.sh"
          sdk use java 21.0.6-tem
          mvn clean install
```

#### GitLab CI 示例

```yaml
image: ubuntu:latest

before_script:
  - apt-get update && apt-get install -y curl zip unzip
  - curl -s "https://get.sdkman.io" | bash
  - source "$HOME/.sdkman/bin/sdkman-init.sh"
  - sdk install java 21.0.6-tem
  - sdk install maven 3.9.6

build:
  script:
    - source "$HOME/.sdkman/bin/sdkman-init.sh"
    - sdk use java 21.0.6-tem
    - mvn clean package
```

### 6.6 Docker 集成

```dockerfile
# Dockerfile 示例
FROM ubuntu:22.04

# 安装依赖
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# 安装 SDKMAN
RUN curl -s "https://get.sdkman.io" | bash

# 安装 Java 和 Maven
RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && \
    sdk install java 21.0.6-tem && \
    sdk install maven 3.9.6 && \
    sdk flush archives"

# 设置环境变量
ENV SDKMAN_DIR="/root/.sdkman"
ENV JAVA_HOME="/root/.sdkman/candidates/java/current"
ENV PATH="$JAVA_HOME/bin:$PATH"

# 验证
RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && java -version"

WORKDIR /app
```

---

## 七、常见问题和解决方案

### 7.1 SDKMAN 命令未找到

**问题**：安装后提示 `sdk: command not found`

**解决方案**：

```bash
# 方法 1：重新加载配置
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 方法 2：重新打开终端

# 方法 3：检查配置文件
cat ~/.bashrc | grep sdkman
cat ~/.zshrc | grep sdkman

# 方法 4：手动添加到配置文件
echo 'export SDKMAN_DIR="$HOME/.sdkman"' >> ~/.bashrc
echo '[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"' >> ~/.bashrc
source ~/.bashrc
```

### 7.2 版本切换不生效

**问题**：执行 `sdk use` 后版本未切换

**解决方案**：

```bash
# 1. 检查当前版本
sdk current java
java -version

# 2. 检查 JAVA_HOME
echo $JAVA_HOME

# 3. 重新初始化
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk use java 21.0.6-tem

# 4. 检查是否有其他 Java 在 PATH 中
which java
# 应该输出：/home/username/.sdkman/candidates/java/current/bin/java

# 5. 如果有冲突，检查 PATH
echo $PATH
```

### 7.3 下载速度慢

**问题**：下载 JDK 速度很慢

**解决方案**：

```bash
# 方法 1：使用代理
export http_proxy=http://proxy:port
export https_proxy=http://proxy:port

# 方法 2：配置 SDKMAN 使用镜像（如果有）
# 编辑 ~/.sdkman/etc/config
vim ~/.sdkman/etc/config

# 方法 3：离线安装
# 1. 手动下载 JDK
# 2. 放到 ~/.sdkman/archives/
# 3. 运行安装命令
sdk install java 21.0.6-tem
```

### 7.4 磁盘空间不足

**问题**：安装多个版本后磁盘空间不足

**解决方案**：

```bash
# 1. 查看已安装的版本
sdk list java | grep installed

# 2. 卸载不用的版本
sdk uninstall java 8.0.432-tem
sdk uninstall java 11.0.25-tem

# 3. 清理缓存
sdk flush archives
sdk flush temp

# 4. 查看 SDKMAN 占用空间
du -sh ~/.sdkman/
du -sh ~/.sdkman/candidates/java/*
```

### 7.5 权限问题

**问题**：安装或使用时提示权限不足

**解决方案**：

```bash
# 1. 检查目录权限
ls -la ~/.sdkman/

# 2. 修复权限
chmod -R 755 ~/.sdkman/

# 3. 确保所有者正确
chown -R $USER:$USER ~/.sdkman/

# 4. 不要使用 sudo 安装 SDKMAN
# SDKMAN 应该安装在用户目录下
```

### 7.6 .sdkmanrc 不生效

**问题**：进入目录后 .sdkmanrc 配置未自动应用

**解决方案**：

```bash
# 1. 检查配置
cat ~/.sdkman/etc/config | grep auto_env

# 2. 启用自动环境切换
vim ~/.sdkman/etc/config
# 设置：sdkman_auto_env=true

# 3. 重新加载配置
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 4. 手动应用配置
cd /path/to/project
sdk env

# 5. 检查 .sdkmanrc 格式
cat .sdkmanrc
# 格式应该是：java=21.0.6-tem
```

### 7.7 WSL 中的问题

**问题**：在 WSL 中使用 SDKMAN 遇到问题

**解决方案**：

```bash
# 1. 确保 WSL 版本正确
wsl --version

# 2. 更新 WSL
wsl --update

# 3. 检查必要工具
which bash curl zip unzip

# 4. 如果缺少工具，安装它们
sudo apt-get update
sudo apt-get install -y curl zip unzip

# 5. 重新安装 SDKMAN
rm -rf ~/.sdkman
curl -s "https://get.sdkman.io" | bash
```

---

## 八、SDKMAN vs 其他工具对比

### 8.1 SDKMAN vs Jabba

| 特性 | SDKMAN | Jabba |
|------|--------|-------|
| 维护状态 | 活跃维护 | 已停止维护（2021） |
| 最新版本 | 支持 Java 26、25、21 等 | 最高到 Java 17 |
| 跨平台 | Linux、macOS、Windows（WSL） | Linux、macOS、Windows |
| 多 SDK 支持 | 70+ 种 SDK | 仅 Java |
| 自动更新 | 是 | 否 |
| 社区活跃度 | 非常活跃 | 不活跃 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### 8.2 SDKMAN vs jEnv

| 特性 | SDKMAN | jEnv |
|------|--------|------|
| 安装 JDK | 自动下载安装 | 需要手动安装 |
| 版本管理 | 完整管理 | 仅切换已安装版本 |
| 多 SDK 支持 | 是 | 否 |
| 配置复杂度 | 简单 | 中等 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 8.3 SDKMAN vs asdf

| 特性 | SDKMAN | asdf |
|------|--------|------|
| 专注领域 | JVM 生态系统 | 通用语言管理 |
| Java 支持 | 原生支持，版本丰富 | 通过插件支持 |
| 易用性 | 非常简单 | 需要配置插件 |
| 社区 | JVM 社区 | 通用开发社区 |
| 推荐度（Java） | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 8.4 选择建议

- **首选 SDKMAN**：如果你主要使用 Java 和 JVM 生态系统
- **选择 asdf**：如果你需要管理多种编程语言（Node.js、Python、Ruby 等）
- **避免 Jabba**：已停止维护，不支持最新版本
- **考虑 jEnv**：如果你只需要切换已安装的 Java 版本

---

## 九、最佳实践

### 9.1 版本选择建议

```bash
# 生产环境：使用 LTS 版本
sdk install java 21.0.6-tem    # Java 21 LTS（推荐）
sdk install java 17.0.13-tem   # Java 17 LTS
sdk install java 11.0.25-tem   # Java 11 LTS
sdk install java 8.0.432-tem   # Java 8 LTS

# 开发环境：可以尝试最新版本
sdk install java 26-tem        # Java 26（最新）
sdk install java 25.0.1-tem    # Java 25
```

### 9.2 发行版选择建议

```bash
# 推荐：Eclipse Temurin（原 AdoptOpenJDK）
sdk install java 21.0.6-tem

# 云环境：Amazon Corretto
sdk install java 21.0.6-amzn

# 高性能：GraalVM
sdk install java 21.0.6-graalce

# 企业支持：Azul Zulu
sdk install java 21.0.6-zulu
```

### 9.3 项目配置建议

```bash
# 1. 每个项目都创建 .sdkmanrc
cd my-project
sdk env init

# 2. 提交 .sdkmanrc 到版本控制
git add .sdkmanrc
git commit -m "Add SDKMAN configuration"

# 3. 在 README.md 中说明
cat >> README.md << EOF

## 开发环境

本项目使用 SDKMAN 管理 Java 版本。

### 安装 SDKMAN

\`\`\`bash
curl -s "https://get.sdkman.io" | bash
source "\$HOME/.sdkman/bin/sdkman-init.sh"
\`\`\`

### 安装项目依赖

\`\`\`bash
sdk env install
\`\`\`

### 使用项目配置

\`\`\`bash
sdk env
\`\`\`
EOF
```

### 9.4 团队协作建议

```bash
# 1. 统一使用 SDKMAN
# 2. 提交 .sdkmanrc 到版本控制
# 3. 启用自动环境切换
# 4. 在文档中说明配置步骤

# 团队配置示例
cat > .sdkmanrc << EOF
# Java version (LTS)
java=21.0.6-tem

# Build tools
gradle=8.5
maven=3.9.6

# Additional tools
kotlin=1.9.22
springboot=3.2.2
EOF
```

### 9.5 性能优化建议

```bash
# 1. 只安装需要的版本
sdk list java | grep installed

# 2. 定期清理不用的版本
sdk uninstall java <old-version>

# 3. 清理缓存
sdk flush archives
sdk flush temp

# 4. 使用离线模式（如果不需要更新）
sdk offline enable

# 5. 禁用自动更新（如果网络慢）
vim ~/.sdkman/etc/config
# 设置：sdkman_auto_selfupdate=false
```

### 9.6 安全建议

```bash
# 1. 定期更新 SDKMAN
sdk selfupdate

# 2. 使用官方源
# 不要修改 ~/.sdkman/etc/config 中的下载源

# 3. 验证安装
java -version
which java

# 4. 使用 LTS 版本
# LTS 版本有更长的安全更新支持

# 5. 及时更新 JDK
sdk list java
sdk install java <latest-lts-version>
```

---

## 十、高级技巧

### 10.1 自定义安装路径

```bash
# SDKMAN 默认安装在 ~/.sdkman
# 如果需要自定义路径，在安装前设置环境变量

export SDKMAN_DIR="/opt/sdkman"
curl -s "https://get.sdkman.io" | bash
```

### 10.2 离线使用

```bash
# 启用离线模式
sdk offline enable

# 查看离线状态
sdk offline

# 禁用离线模式
sdk offline disable

# 离线模式下只能使用已安装的版本
sdk list java | grep installed
```

### 10.3 脚本自动化

```bash
# 创建自动化脚本
cat > ~/setup-java-env.sh << 'EOF'
#!/bin/bash

# 检查 SDKMAN 是否安装
if [ ! -d "$HOME/.sdkman" ]; then
    echo "安装 SDKMAN..."
    curl -s "https://get.sdkman.io" | bash
fi

# 加载 SDKMAN
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 安装 Java 版本
echo "安装 Java 版本..."
sdk install java 21.0.6-tem
sdk install java 17.0.13-tem
sdk install java 11.0.25-tem

# 设置默认版本
sdk default java 21.0.6-tem

# 安装构建工具
echo "安装构建工具..."
sdk install gradle 8.5
sdk install maven 3.9.6

echo "环境配置完成！"
java -version
EOF

chmod +x ~/setup-java-env.sh
```

### 10.4 多用户共享安装

```bash
# 在共享服务器上，可以为每个用户独立安装 SDKMAN
# 每个用户都有自己的 ~/.sdkman 目录

# 或者创建共享安装（需要管理员权限）
export SDKMAN_DIR="/opt/sdkman"
curl -s "https://get.sdkman.io" | bash

# 然后每个用户在自己的配置文件中添加
echo 'export SDKMAN_DIR="/opt/sdkman"' >> ~/.bashrc
echo '[[ -s "/opt/sdkman/bin/sdkman-init.sh" ]] && source "/opt/sdkman/bin/sdkman-init.sh"' >> ~/.bashrc
```

### 10.5 与 IDE 集成

#### IntelliJ IDEA

```bash
# 1. 安装 Java 版本
sdk install java 21.0.6-tem

# 2. 在 IntelliJ IDEA 中配置
# File -> Project Structure -> SDKs -> Add JDK
# 选择：~/.sdkman/candidates/java/21.0.6-tem

# 3. 设置项目 JDK
# File -> Project Structure -> Project -> Project SDK
```

#### VS Code

```json
// settings.json
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-21",
      "path": "/home/username/.sdkman/candidates/java/21.0.6-tem"
    },
    {
      "name": "JavaSE-17",
      "path": "/home/username/.sdkman/candidates/java/17.0.13-tem"
    },
    {
      "name": "JavaSE-11",
      "path": "/home/username/.sdkman/candidates/java/11.0.25-tem"
    }
  ],
  "java.home": "/home/username/.sdkman/candidates/java/21.0.6-tem"
}
```

#### Eclipse

```bash
# 1. 安装 Java 版本
sdk install java 21.0.6-tem

# 2. 在 Eclipse 中配置
# Window -> Preferences -> Java -> Installed JREs -> Add
# 选择：~/.sdkman/candidates/java/21.0.6-tem
```

---

## 十一、总结

### 11.1 关键要点

1. **活跃维护**：SDKMAN 是目前最活跃的 Java 版本管理工具
2. **版本丰富**：支持最新的 Java 版本（26、25、21 等）
3. **简单易用**：安装和使用都非常简单
4. **多 SDK 支持**：不仅管理 Java，还支持 70+ 种 SDK
5. **自动配置**：自动设置环境变量，无需手动配置
6. **项目隔离**：通过 .sdkmanrc 实现项目特定版本

### 11.2 常用命令速查

```bash
# 安装 SDKMAN
curl -s "https://get.sdkman.io" | bash

# 查看版本
sdk list java              # 查看可用版本
sdk list java | grep installed  # 查看已安装版本

# 安装和卸载
sdk install java 21.0.6-tem    # 安装
sdk uninstall java 21.0.6-tem  # 卸载

# 切换版本
sdk use java 21.0.6-tem        # 临时切换
sdk default java 21.0.6-tem    # 永久切换

# 项目配置
sdk env init               # 初始化 .sdkmanrc
sdk env                    # 使用 .sdkmanrc
sdk env install            # 安装 .sdkmanrc 中的所有 SDK

# 维护
sdk selfupdate             # 更新 SDKMAN
sdk update                 # 更新版本列表
sdk flush archives         # 清理缓存

# 查看信息
sdk current java           # 当前版本
sdk current                # 所有 SDK 当前版本
sdk version                # SDKMAN 版本
```

### 11.3 推荐配置

```bash
# ~/.sdkman/etc/config 推荐配置
sdkman_auto_answer=true        # 自动回答 yes
sdkman_auto_env=true           # 自动切换版本
sdkman_auto_complete=true      # 自动完成
sdkman_colour_enable=true      # 彩色输出
```

### 11.4 学习资源

- 官方网站：https://sdkman.io/
- 官方文档：https://sdkman.io/usage
- GitHub：https://github.com/sdkman/sdkman-cli
- Twitter：@sdkman_

### 相关文档

- [使用 Jabba 管理 Java 版本](./使用Jabba管理Java版本.md)
- [Linux 目录结构详解](./Linux目录结构详解.md)
- [命令行参数详解](./命令行参数详解.md)
- [Linux 文件和目录操作](./Linux文件和目录操作.md)

---

通过 SDKMAN，你可以轻松管理多个 Java 版本和其他 SDK，提高开发效率。建议在所有项目中使用 .sdkmanrc 文件来统一团队的开发环境配置。
