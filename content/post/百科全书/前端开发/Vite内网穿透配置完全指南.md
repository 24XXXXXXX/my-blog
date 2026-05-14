---
title: "Vite 内网穿透配置完全指南：host 与 allowedHosts 详解"
description: "详解 Vite 开发服务器中使用内网穿透时的配置问题，包括 host: 0.0.0.0 的作用、allowedHosts 安全配置、常见错误及解决方案"
keywords: "Vite,内网穿透,allowedHosts,host配置,cpolar,ngrok,开发环境,前端开发"

date: 2026-04-28T23:00:00+08:00
lastmod: 2026-04-28T23:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Vite
  - 内网穿透
  - 前端开发
  - 开发环境
---

很多开发者在使用内网穿透工具（cpolar、ngrok 等）访问 Vite 开发服务器时，会遇到这样的错误：

```
Host "2acdf14.r28.cpolar.top" is not allowed
```

这篇文章详细解释 Vite 的 `host` 和 `allowedHosts` 配置，帮你彻底理解并解决这个问题。

<!--more-->

## 一、问题现象

### 1.1 典型错误

当你使用内网穿透工具后，访问映射的域名时出现：

```
Request failed with status code 403
Host "2acdf14.r28.cpolar.top" is not allowed
```

### 1.2 问题原因

Vite 默认只允许 `localhost` 访问，当使用内网穿透时，访问域名变成了 `2acdf14.r28.cpolar.top`，不在允许列表中，所以被拒绝。

---

## 二、host 配置详解

### 2.1 host 的作用

`host` 配置决定服务器监听哪个网络接口（Network Interface）。

### 2.2 网络接口概念

你的电脑有多个网络接口：

```
┌─────────────────────────────────────┐
│         网络接口                      │
├─────────────────────────────────────┤
│  127.0.0.1      (回环接口)           │
│  192.168.1.100  (局域网网卡)         │
│  10.0.0.5       (VPN 虚拟网卡)       │
│  172.16.0.1     (Docker 虚拟网卡)    │
└─────────────────────────────────────┘
```

### 2.3 不同 host 值的效果

#### host: "127.0.0.1" 或 "localhost"

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: "127.0.0.1"
  }
})
```

**效果**：
- ✅ 可以访问：`http://127.0.0.1:5173`
- ✅ 可以访问：`http://localhost:5173`
- ❌ 不能访问：`http://192.168.1.100:5173`（局域网 IP）
- ❌ 不能访问：`http://your-domain.com`（外网域名）

**适用场景**：不需要外部访问的开发

#### host: "192.168.1.100"

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: "192.168.1.100"  // 绑定特定 IP
  }
})
```

**效果**：
- ❌ 不能访问：`http://127.0.0.1:5173`
- ❌ 不能访问：`http://localhost:5173`
- ✅ 可以访问：`http://192.168.1.100:5173`
- ❌ 不能访问：其他网络接口

**适用场景**：绑定特定网卡

#### host: "0.0.0.0" ⭐

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: "0.0.0.0"  // 监听所有接口
  }
})
```

**效果**：
- ✅ 可以访问：`http://127.0.0.1:5173`
- ✅ 可以访问：`http://localhost:5173`
- ✅ 可以访问：`http://192.168.1.100:5173`（局域网 IP）
- ✅ 可以访问：`http://your-domain.com`（内网穿透域名）

**适用场景**：内网穿透、局域网访问

### 2.4 为什么 0.0.0.0 就够了

`0.0.0.0` 是一个特殊地址，表示"所有网络接口"：

```javascript
host: "0.0.0.0"

// 等同于同时监听：
// ✅ 127.0.0.1 (localhost)
// ✅ 192.168.1.100 (局域网)
// ✅ 10.0.0.5 (VPN)
// ✅ 任何其他网络接口
```

### 2.5 host 可以设置多个值吗？

**不可以**，`host` 只能设置一个值。

```javascript
// ❌ 错误 - 不能设置多个值
server: {
  host: ["127.0.0.1", "192.168.1.100"]  // 语法错误
}

// ✅ 正确 - 只能设置一个值
server: {
  host: "0.0.0.0"  // 监听所有接口
}
```

**原因**：`host` 配置的是服务器要绑定的网络接口，一个服务器进程只能绑定到一个地址上。

---

## 三、allowedHosts 配置详解

### 3.1 allowedHosts 的作用

`allowedHosts` 是应用层面的配置，基于 HTTP 请求头的 `Host` 字段进行过滤。

### 3.2 为什么需要 allowedHosts

这是安全机制，防止 Host Header 攻击。

### 3.3 配置方式

#### 方式 1：指定域名列表（推荐）

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      ".cpolar.top",      // 允许所有 cpolar 子域名（通配符）
      ".ngrok.io",        // 允许所有 ngrok 子域名
      ".localtunnel.me",  // 允许 localtunnel
      "localhost",        // 本地开发
      "127.0.0.1"         // 本地开发
    ]
  },
  plugins: [vue()]
})
```

**说明**：
- `.cpolar.top`：前面的点表示通配符，匹配所有子域名
- 如 `2acdf14.r28.cpolar.top`、`abc.cpolar.top` 都会被允许

#### 方式 2：指定特定域名

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "2acdf14.r28.cpolar.top"  // 只允许这个特定域名
    ]
  }
})
```

#### 方式 3：允许所有域名（不推荐）

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: "all"  // ⚠️ 有安全风险
  }
})
```

---

## 四、为什么 allowedHosts: "all" 有安全风险

### 4.1 常见误区

很多人认为："我把服务映射到一个域名，只有那个域名才能访问，设置 `all` 也没问题。"

**这是错误的！**

### 4.2 实际安全风险

#### 风险 1：直接 IP 访问

假设你的服务器公网 IP 是 `123.45.67.89`：

```
正常访问：
用户浏览器 → 输入 2acdf14.r28.cpolar.top
→ DNS 解析到 123.45.67.89
→ 发送 HTTP 请求：
   GET / HTTP/1.1
   Host: 2acdf14.r28.cpolar.top  ← Host 头
→ 服务器检查 allowedHosts
→ ✅ 允许访问

恶意访问：
攻击者 → 直接访问 http://123.45.67.89:5173
→ 发送 HTTP 请求：
   GET / HTTP/1.1
   Host: 123.45.67.89  ← Host 是 IP 地址
→ 如果 allowedHosts: "all"
→ ✅ 允许访问（这就是安全风险！）
```

#### 风险 2：恶意域名指向

```
攻击者 → 注册恶意域名 evil.com
→ 把 evil.com 的 DNS 指向你的 IP: 123.45.67.89
→ 用户访问 evil.com
→ 发送 HTTP 请求：
   GET / HTTP/1.1
   Host: evil.com  ← Host 是恶意域名
→ 如果 allowedHosts: "all"
→ ✅ 允许访问
→ 你的应用在恶意域名下运行！
```

### 4.3 实际攻击场景

#### 场景 1：缓存投毒

```javascript
// 你的应用代码
const currentHost = req.headers.host;  // evil.com
const apiUrl = `http://${currentHost}/api/data`;

// 如果这个 URL 被缓存，其他用户可能会访问到恶意域名
```

#### 场景 2：密码重置链接劫持

```javascript
// 发送密码重置邮件
const resetLink = `http://${req.headers.host}/reset-password?token=xxx`;

// 如果 Host 是 evil.com，用户点击链接会把 token 发送到恶意网站
```

#### 场景 3：CORS 绕过

```javascript
// 如果你的 CORS 配置基于 Host
if (req.headers.host === 'trusted-domain.com') {
  res.setHeader('Access-Control-Allow-Origin', '*');
}

// 攻击者可以伪造 Host 头绕过检查
```

---

## 五、完整配置示例

### 5.1 开发环境（使用内网穿透）

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: "0.0.0.0",  // 允许外部访问
    port: 5173,
    allowedHosts: [
      ".cpolar.top",     // cpolar 内网穿透
      ".ngrok.io",       // ngrok 内网穿透
      ".localtunnel.me", // localtunnel
      "localhost",       // 本地开发
      "127.0.0.1"        // 本地开发
    ]
  },
  plugins: [vue()]
})
```

### 5.2 生产环境

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "your-domain.com",      // 你的正式域名
      "www.your-domain.com"   // www 子域名
    ]
  },
  plugins: [vue()]
})
```

### 5.3 临时测试（允许所有）

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: "all"  // ⚠️ 仅用于开发测试，不要用于生产环境
  },
  plugins: [vue()]
})
```

---

## 六、常见内网穿透工具配置

### 6.1 cpolar

```javascript
allowedHosts: [
  ".cpolar.top"
]
```

### 6.2 ngrok

```javascript
allowedHosts: [
  ".ngrok.io",
  ".ngrok-free.app"  // ngrok 新域名
]
```

### 6.3 frp

```javascript
allowedHosts: [
  "your-frp-domain.com"  // 你配置的 frp 域名
]
```

### 6.4 localtunnel

```javascript
allowedHosts: [
  ".localtunnel.me"
]
```

### 6.5 自建内网穿透

```javascript
allowedHosts: [
  "tunnel.your-domain.com"  // 你的穿透域名
]
```

---

## 七、配置对比总结

| 配置 | 作用层面 | 控制什么 | 安全性 |
|------|----------|----------|--------|
| `host: "0.0.0.0"` | 网络层 | 服务器监听哪些网络接口 | 无安全风险 |
| `allowedHosts: [...]` | 应用层 | 允许哪些域名访问 | 需要正确配置 |
| `allowedHosts: "all"` | 应用层 | 允许所有域名访问 | ⚠️ 有安全风险 |

### 7.1 配置关系图

```
用户请求
    ↓
DNS 解析 → 你的服务器 IP
    ↓
网络层：host: "0.0.0.0" 
    → 接受来自任何网络接口的连接
    ↓
应用层：allowedHosts
    → 检查 HTTP Host 头
    → 决定是否允许访问
    ↓
✅ 允许 / ❌ 拒绝
```

---

## 八、常见问题

### 8.1 配置后还是访问不了

**检查清单**：

1. **确认 host 配置**：
   ```javascript
   host: "0.0.0.0"  // 必须是 0.0.0.0
   ```

2. **确认 allowedHosts 配置**：
   ```javascript
   allowedHosts: [".cpolar.top"]  // 注意前面的点
   ```

3. **重启 Vite 服务器**：
   ```bash
   # 停止服务器 (Ctrl+C)
   npm run dev
   ```

4. **检查防火墙**：
   ```bash
   # Windows
   netsh advfirewall firewall add rule name="Vite" dir=in action=allow tcp port=5173
   
   # macOS
   # 系统偏好设置 → 安全性 → 防火墙
   ```

### 8.2 如何查看当前配置是否生效

```bash
# 启动 Vite 后查看输出
npm run dev

# 输出应该显示：
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: http://192.168.1.100:5173/
```

如果只显示 `Local`，说明 `host` 不是 `0.0.0.0`。

### 8.3 多个内网穿透工具如何配置

```javascript
allowedHosts: [
  ".cpolar.top",      // cpolar
  ".ngrok.io",        // ngrok
  ".localtunnel.me",  // localtunnel
  "localhost"
]
```

---

## 九、最佳实践

### 9.1 开发环境配置模板

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: true,  // 自动打开浏览器
    allowedHosts: [
      // 内网穿透工具
      ".cpolar.top",
      ".ngrok.io",
      ".ngrok-free.app",
      ".localtunnel.me",
      
      // 本地开发
      "localhost",
      "127.0.0.1",
      ".local"  // 如 myapp.local
    ]
  },
  plugins: [vue()]
})
```

### 9.2 安全建议

1. **开发环境**：明确列出需要的域名
2. **生产环境**：只允许你自己的域名
3. **避免使用 `allowedHosts: "all"`**：除非完全理解风险且只是临时测试
4. **定期检查配置**：确保没有遗留不安全的配置

---

## 十、总结

### 10.1 核心概念

```
host: "0.0.0.0"
├─ 作用：网络层配置
├─ 决定：服务器监听哪些网络接口
└─ 效果：允许所有 IP 访问

allowedHosts: [...]
├─ 作用：应用层配置
├─ 决定：允许哪些域名访问
└─ 效果：过滤 HTTP Host 头
```

### 10.2 配置原则

1. **host 只能设置一个值**，`0.0.0.0` 已经包含所有网络接口
2. **allowedHosts 可以设置多个值**，建议明确列出需要的域名
3. **避免使用 `allowedHosts: "all"`**，有安全风险

### 10.3 记住这个配置

```javascript
// 开发环境标准配置
server: {
  host: "0.0.0.0",           // 允许外部访问
  allowedHosts: [
    ".cpolar.top",           // 内网穿透域名
    "localhost"              // 本地开发
  ]
}
```

---

## 参考资源

- Vite 官方文档 - Server Options：<https://vitejs.dev/config/server-options.html>
- Vite 官方文档 - server.host：<https://vitejs.dev/config/server-options.html#server-host>
- Vite 官方文档 - server.allowedHosts：<https://vitejs.dev/config/server-options.html#server-allowedhosts>
- cpolar 官网：<https://www.cpolar.com/>
- ngrok 官网：<https://ngrok.com/>
