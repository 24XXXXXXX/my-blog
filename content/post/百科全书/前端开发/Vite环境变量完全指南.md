---
title: "Vite 环境变量完全指南：从配置到优先级详解"
description: "详解 Vite 环境变量机制，包括 .env 文件配置、命名规则、加载优先级、环境判断、命令行参数与配置文件冲突解决"
keywords: "Vite,环境变量,.env,import.meta.env,开发环境,生产环境,前端开发"

date: 2026-04-28T23:30:00+08:00
lastmod: 2026-04-28T23:30:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Vite
  - 环境变量
  - 前端开发
  - 配置管理
---

很多开发者在使用 Vite 时，对环境变量的配置和加载机制存在困惑：

- `.env`、`.env.development`、`.env.production` 有什么区别？
- 同时存在多个环境变量文件时，会读取哪个？
- Vite 如何判断当前是开发环境还是生产环境？
- 命令行参数和配置文件冲突了怎么办？

这篇文章系统梳理 Vite 环境变量机制，帮你彻底理解这些问题。

<!--more-->

## 一、环境变量文件

### 1.1 文件类型

Vite 支持以下环境变量文件：

```
项目根目录/
├── .env                    # 所有环境都加载
├── .env.local              # 本地覆盖（不提交到 git）
├── .env.development        # 开发环境
├── .env.development.local  # 开发环境本地覆盖
├── .env.production         # 生产环境
├── .env.production.local   # 生产环境本地覆盖
└── .env.staging            # 自定义环境（如测试环境）
```

### 1.2 文件作用

| 文件 | 作用 | 是否提交 git |
|------|------|--------------|
| `.env` | 所有环境共享的默认配置 | ✅ 提交 |
| `.env.local` | 本地个人配置，优先级最高 | ❌ 不提交 |
| `.env.development` | 开发环境配置 | ✅ 提交 |
| `.env.development.local` | 开发环境本地覆盖 | ❌ 不提交 |
| `.env.production` | 生产环境配置 | ✅ 提交 |
| `.env.production.local` | 生产环境本地覆盖 | ❌ 不提交 |

### 1.3 命名规则

**必须以 `VITE_` 开头才能暴露给前端代码**：

```bash
# .env.development

# ✅ 正确 - 以 VITE_ 开头，前端可以访问
VITE_API_BASE_URL=http://127.0.0.1:3001/api
VITE_APP_NAME=MyApp
VITE_DEBUG=true

# ❌ 错误 - 不以 VITE_ 开头，前端无法访问
API_BASE_URL=http://127.0.0.1:3001/api
SECRET_KEY=abc123
```

**安全说明**：
- 只有 `VITE_` 开头的变量才会被注入到前端代码
- 敏感信息（如密钥）不要用 `VITE_` 开头，避免暴露

---

## 二、加载优先级

### 2.1 优先级规则

Vite 会同时加载多个文件，并合并它们的内容：

```
优先级从高到低：
1. .env.[mode].local  (最高优先级)
2. .env.local
3. .env.[mode]
4. .env               (最低优先级)
```

### 2.2 合并规则

- **同名变量**：高优先级覆盖低优先级
- **不同变量**：合并所有文件

### 2.3 实际例子

假设你有这些文件：

```bash
# .env
VITE_API_BASE_URL=http://default.com/api
VITE_APP_NAME=MyApp

# .env.development
VITE_API_BASE_URL=http://dev.com/api
VITE_DEBUG=true

# .env.production
VITE_API_BASE_URL=http://prod.com/api
VITE_DEBUG=false
```

#### 开发环境

```bash
npm run dev
```

加载顺序：`.env` → `.env.development`

最终结果：
```javascript
{
  VITE_API_BASE_URL: "http://dev.com/api",  // .env.development 覆盖了 .env
  VITE_APP_NAME: "MyApp",                    // 来自 .env
  VITE_DEBUG: true                           // 来自 .env.development
}
```

#### 生产环境

```bash
npm run build
```

加载顺序：`.env` → `.env.production`

最终结果：
```javascript
{
  VITE_API_BASE_URL: "http://prod.com/api", // .env.production 覆盖了 .env
  VITE_APP_NAME: "MyApp",                    // 来自 .env
  VITE_DEBUG: false                          // 来自 .env.production
}
```

### 2.4 完整优先级表

| 文件 | 优先级 | 说明 |
|------|--------|------|
| `.env.[mode].local` | 最高 | 特定环境的本地配置，不提交 git |
| `.env.local` | 高 | 本地配置，不提交 git |
| `.env.[mode]` | 中 | 特定环境配置（如 .env.development） |
| `.env` | 最低 | 所有环境共享的默认配置 |

---

## 三、环境判断机制

### 3.1 Vite 如何判断环境

Vite 会根据你运行的命令自动设置 `mode`：

```json
// package.json
{
  "scripts": {
    "dev": "vite",           // mode = 'development'
    "build": "vite build",   // mode = 'production'
    "preview": "vite preview" // mode = 'production'
  }
}
```

| 命令 | 自动设置的 mode | 加载的环境变量文件 |
|------|-----------------|-------------------|
| `vite` | `development` | `.env.development` |
| `vite build` | `production` | `.env.production` |
| `vite preview` | `production` | `.env.production` |

### 3.2 手动指定 mode

你也可以在命令中手动指定：

```json
// package.json
{
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite build --mode production",
    "build:staging": "vite build --mode staging"
  }
}
```

```bash
# 手动指定 mode
vite --mode staging

# 会加载 .env.staging 文件
```

### 3.3 在代码中判断环境

```javascript
// 判断当前环境
if (import.meta.env.DEV) {
  console.log('开发环境');
}

if (import.meta.env.PROD) {
  console.log('生产环境');
}

// 获取当前 mode
console.log(import.meta.env.MODE);  // 'development' 或 'production'

// 获取自定义环境变量
console.log(import.meta.env.VITE_API_BASE_URL);
```

### 3.4 内置环境变量

Vite 提供了一些内置的环境变量：

```javascript
import.meta.env.MODE      // 当前 mode
import.meta.env.DEV       // 是否是开发环境
import.meta.env.PROD      // 是否是生产环境
import.meta.env.SSR       // 是否是服务端渲染
import.meta.env.BASE_URL  // 应用的基础 URL
```

---

## 四、完整流程图

### 4.1 开发环境流程

```
npm run dev
    ↓
执行: vite
    ↓
Vite 自动设置 mode = 'development'
    ↓
加载环境变量文件（按优先级）：
  1. .env.development.local
  2. .env.local
  3. .env.development  ← 你的配置在这里
  4. .env
    ↓
注入到 import.meta.env
    ↓
代码中使用
```

### 4.2 生产环境流程

```
npm run build
    ↓
执行: vite build
    ↓
Vite 自动设置 mode = 'production'
    ↓
加载环境变量文件（按优先级）：
  1. .env.production.local
  2. .env.local
  3. .env.production
  4. .env
    ↓
注入到 import.meta.env
    ↓
代码中使用
```

---

## 五、命令行参数与配置文件冲突

### 5.1 优先级规则

```
命令行参数 > vite.config.js 配置 > 默认值
```

### 5.2 冲突示例

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 5174,
    host: "0.0.0.0"  // 监听所有接口
  }
})
```

```json
// package.json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5174"
  }
}
```

**实际效果**：

```bash
npm run dev

# 实际运行: vite --host 127.0.0.1 --port 5174
# 最终配置：
# host: "127.0.0.1"  ← 命令行参数覆盖了配置文件的 "0.0.0.0"
# port: 5174         ← 两者相同，无冲突
```

**问题**：命令行的 `--host 127.0.0.1` 覆盖了配置文件的 `host: "0.0.0.0"`，导致：
- ❌ 无法通过局域网 IP 访问
- ❌ 内网穿透无法正常工作

### 5.3 解决方案

#### 方案 1：删除命令行参数（推荐）

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

让 `vite.config.js` 的配置生效。

#### 方案 2：命令行参数与配置文件一致

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5174",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0 --port 4174"
  }
}
```

#### 方案 3：只在配置文件中设置（最简洁）

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 5174,
    host: "0.0.0.0",
    allowedHosts: [".cpolar.top", "localhost", "127.0.0.1"]
  },
  preview: {
    host: "0.0.0.0",
    port: 4174
  },
  plugins: [vue()]
})
```

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 六、最佳实践

### 6.1 推荐的文件结构

```bash
# .env (所有环境共享的配置)
VITE_APP_NAME=我的应用
VITE_APP_VERSION=1.0.0

# .env.development (开发环境)
VITE_API_BASE_URL=http://127.0.0.1:3001/api
VITE_DEBUG=true

# .env.production (生产环境)
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_DEBUG=false

# .env.local (本地个人配置，不提交 git)
# 用于覆盖任何配置，比如测试不同的 API 地址
VITE_API_BASE_URL=http://192.168.1.100:3001/api
```

### 6.2 .gitignore 配置

```gitignore
# 不要提交本地配置文件
.env.local
.env.*.local
```

### 6.3 配置文件示例

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5174,
    allowedHosts: [
      ".cpolar.top",
      ".ngrok.io",
      "localhost",
      "127.0.0.1"
    ]
  },
  preview: {
    host: "0.0.0.0",
    port: 4174
  },
  plugins: [vue()]
})
```

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 6.4 代码中使用

```javascript
// src/api.js

// 读取环境变量
const BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3001/api"
)

// 判断环境
if (import.meta.env.DEV) {
  console.log('开发环境，API 地址:', BASE_URL)
}

// 导出配置
export { BASE_URL }
```

---

## 七、自定义环境

### 7.1 创建自定义环境

假设你需要一个测试环境：

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "preview:staging": "vite preview --mode staging"
  }
}
```

```bash
# .env.staging
VITE_API_BASE_URL=https://staging.your-domain.com/api
VITE_DEBUG=true
```

### 7.2 使用自定义环境

```bash
# 构建测试环境
npm run build:staging

# 会加载 .env.staging 文件
```

---

## 八、常见问题

### 8.1 修改环境变量后不生效

**原因**：环境变量在 Vite 启动时读取，修改后需要重启。

**解决**：
```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

### 8.2 前端无法访问环境变量

**原因**：变量名没有以 `VITE_` 开头。

**解决**：
```bash
# ❌ 错误
API_BASE_URL=http://127.0.0.1:3001/api

# ✅ 正确
VITE_API_BASE_URL=http://127.0.0.1:3001/api
```

### 8.3 如何查看当前加载的环境变量

```javascript
// 在代码中打印
console.log(import.meta.env)
```

### 8.4 .env.production.example 是什么

这是示例文件，需要复制为 `.env.production` 使用：

```bash
# 复制示例文件
cp .env.production.example .env.production

# 然后修改配置
```

---

## 九、总结

### 9.1 核心概念

```
环境变量文件 (.env.development)
    ↓
Vite 读取并注入
    ↓
import.meta.env.VITE_API_BASE_URL
    ↓
代码中使用
```

### 9.2 优先级记忆

```
越具体的文件优先级越高

.env.[mode].local  ← 最高（特定环境 + 本地）
       ↓
.env.local         ← 本地配置
       ↓
.env.[mode]        ← 特定环境
       ↓
.env               ← 最低（默认值）
```

### 9.3 配置原则

1. **命名规则**：必须以 `VITE_` 开头
2. **优先级**：命令行参数 > 配置文件 > 默认值
3. **安全性**：敏感信息不要用 `VITE_` 开头
4. **最佳实践**：统一在 `vite.config.js` 中配置，避免命令行参数覆盖

### 9.4 记住这个配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5174
  }
})

// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}

// .env.development
VITE_API_BASE_URL=http://127.0.0.1:3001/api
```

---

## 参考资源

- Vite 官方文档 - 环境变量：<https://vitejs.dev/guide/env-and-mode.html>
- Vite 官方文档 - 配置：<https://vitejs.dev/config/>
- Vite 官方文档 - 服务器选项：<https://vitejs.dev/config/server-options.html>
