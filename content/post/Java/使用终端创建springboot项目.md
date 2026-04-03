---
title: "使用终端创建 Spring Boot 项目"
description: "通过 PowerShell 命令行快速创建并启动 Spring Boot 项目，无需 IDE 图形化界面。"
keywords: ["Spring Boot", "PowerShell", "Spring Initializr", "命令行创建项目"]
date: 2026-02-27T11:16:38+08:00
lastmod: 2026-02-27T11:16:38+08:00
categories:
  - Java
tags:
  - Spring Boot
  - PowerShell
  - 开发技巧
---

本文将介绍如何在 Windows 环境下使用 PowerShell 终端，通过 Spring Initializr API 快速生成一个 Spring Boot 项目并运行。
<!--more-->

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

- **JDK 版本**：建议使用 **JDK 21 (LTS)**
- **Spring Boot 版本**：推荐使用 **3.5.x**（当前的稳定版本）
- **网络连接**：需要访问 `https://start.spring.io`

## 快速生成项目

我们将使用 PowerShell 的 `Invoke-WebRequest` 命令从 Spring Initializr 下载预配置的项目压缩包。

### 1. 执行创建脚本

在目标目录下（例如 `D:\转立方`）打开 PowerShell，执行以下命令。

> **注意**：如果 `backEnd` 目录已存在，建议先手动删除或更名，以免文件冲突。

```powershell
# 定义 API 请求地址，包含项目坐标、版本、依赖等参数
$u = "https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=3.5.10&javaVersion=21&packaging=jar&baseDir=backEnd&groupId=com.example&artifactId=backEnd&name=backEnd&packageName=com.example.backend&dependencies=web,actuator,lombok,devtools"

# 1. 下载项目压缩包
Invoke-WebRequest -Uri $u -OutFile ".\backEnd.zip"

# 2. 解压项目
Expand-Archive ".\backEnd.zip" -DestinationPath "." -Force

# 3. 清理临时压缩包
Remove-Item ".\backEnd.zip"

# 4. 进入项目目录
cd ".\backEnd"

# 5. 使用 Maven Wrapper 启动项目
.\mvnw.cmd spring-boot:run
```

### 2. 关键参数说明

在上述 URL 中，你可以根据需求调整以下参数：

| 参数 | 说明 | 示例值 |
| :--- | :--- | :--- |
| `bootVersion` | Spring Boot 版本 | `3.5.10` |
| `javaVersion` | JDK 版本 | `21` |
| `dependencies` | 项目依赖（以逗号分隔） | `web,actuator,lombok,devtools` |
| `groupId` | Maven 组织 ID | `com.example` |
| `artifactId` | 项目标识符 | `backEnd` |

## 验证启动状态

项目成功启动后，可以通过以下方式验证：

1. **浏览器访问**：打开 [http://localhost:8080](http://localhost:8080)。
   - *提示：如果未编写 Controller 接口，看到 404 页面是正常的，说明 Web 容器已启动。*
2. **健康检查**：访问 [http://localhost:8080/actuator](http://localhost:8080/actuator)。
   - *前提：项目中集成了 `actuator` 依赖且未锁定端点。*
3. **控制台输出**：查看终端是否出现 `Started BackEndApplication in ... seconds` 的字样。

## 常见问题

- **执行策略限制**：如果无法运行 `.ps1` 脚本，可尝试执行 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`。
- **端口冲突**：如果 8080 端口被占用，请在 `src/main/resources/application.properties` 中修改 `server.port=8081`。
