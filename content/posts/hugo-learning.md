+++
date = '2025-10-19T21:57:03+08:00'
draft = false
title = 'Hugo学习笔记'
tags = ['Hugo', '静态网站', '博客']
categories = ['技术']
+++

# Hugo学习笔记

## 什么是Hugo？

Hugo是一个用Go语言编写的静态网站生成器，具有以下特点：

- **极快的构建速度** - 毫秒级别的网站生成
- **零依赖** - 单个二进制文件，无需安装其他依赖
- **灵活的内容管理** - 支持Markdown、HTML等多种格式
- **强大的主题系统** - 丰富的主题生态

## 基本工作流程

1. **创建内容** - 使用 `hugo new` 命令创建新文章
2. **本地预览** - 使用 `hugo server` 启动开发服务器
3. **构建网站** - 使用 `hugo` 命令生成静态文件
4. **部署上线** - 将 `public/` 目录部署到服务器

## 常用命令

```bash
# 创建新文章 
hugo new posts/my-post.md

# 启动开发服务器
hugo server -D

# 构建网站
hugo

# 查看帮助
hugo help
```

这就是我的Hugo学习笔记！
