---
title: "Cloudflare 证书链路说明：边缘证书、源站证书与 Nginx 证书配置关系"
description: "专门讲清楚 Cloudflare 边缘证书、Origin CA 源站证书和 Nginx 证书加载分别负责哪一段链路，以及它们为什么不能混为一谈"
keywords: "Cloudflare,边缘证书,源站证书,Origin CA,Nginx,HTTPS,SSL证书,TLS,Full strict"

date: 2026-04-13T16:35:00+08:00
lastmod: 2026-04-13T16:35:00+08:00
weight: 

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Cloudflare
  - HTTPS
  - Nginx
  - SSL
  - 部署
---

很多人在 `Cloudflare` 上看到“边缘证书”“源证书”“创建证书”这些词时，会产生一个典型误解：

- 证书不是都一样吗
- 不是只要生成一张证书就够了吗
- 既然已经在 `Cloudflare` 里有证书，为什么服务器里还要配证书

这篇短文只回答一个问题：

> `Cloudflare` 边缘证书、`Origin CA` 源站证书、以及 `Nginx` 中加载的证书配置，到底分别是什么关系？

<!--more-->

## 一、先看完整链路

当网站接入 `Cloudflare` 且开启代理后，访问路径通常是：

```text
浏览器 <-> Cloudflare <-> Nginx <-> 后端应用
```

这里至少有两段连接：

1. 浏览器到 `Cloudflare`
2. `Cloudflare` 到你的 `Nginx` 源站

如果后端应用本身不是直接处理 TLS，而是由 `Nginx` 反向代理，那真正负责证书装配的一般是 `Nginx`。

---

## 二、什么是 Cloudflare 边缘证书

边缘证书是 `Cloudflare` 在它自己的边缘节点上出示给浏览器看的证书。

也就是说，当用户访问：

```text
https://example.com
```

浏览器首先看到的通常不是你服务器里的证书，而是 `Cloudflare` 返回的边缘证书。

它负责的是：

- 浏览器是否信任当前站点
- 浏览器地址栏能否正常显示 HTTPS 锁标记
- 浏览器访问的域名是否被 `Cloudflare` 侧证书覆盖

所以边缘证书解决的是：

```text
浏览器 <-> Cloudflare
```

这一段。

---

## 三、什么是 Origin CA 源站证书

`Origin CA` 是 `Cloudflare` 给你的源站签发的证书。

它主要用于：

```text
Cloudflare <-> 你的 Nginx 源站
```

这一段加密通信。

它的特点是：

- 给 `Cloudflare` 回源校验使用
- 常用于 `Full (strict)`
- 普通浏览器通常不直接信任它
- 需要安装到你的源站服务器上

所以它不是“给用户浏览器看的证书”，而是“给 Cloudflare 回源时检查的证书”。

---

## 四、什么是 Nginx 里的证书配置

很多人会说“给 Nginx 配证书”，这句话本身没错，但它描述的是“证书加载位置”，不是“证书签发方”。

例如：

```nginx
ssl_certificate /etc/nginx/ssl/site.pem;
ssl_certificate_key /etc/nginx/ssl/site.key;
```

这表示：

- `Nginx` 会在处理 TLS 握手时读取这两个文件
- 至于这张证书是 `Let's Encrypt` 签的、商业 CA 签的、还是 `Cloudflare Origin CA` 签的，要看你放进去的具体是什么证书

也就是说：

- `Cloudflare 边缘证书` 是证书使用位置在 `Cloudflare`
- `Origin CA` 是证书签发类型之一
- `Nginx 配证书` 是证书装载位置在你的服务器软件里

这三个概念不是同一维度。

---

## 五、三者的关系可以这样理解

### 5.1 第一层：浏览器访问站点

浏览器访问站点时，看的是：

- `Cloudflare` 边缘证书

### 5.2 第二层：Cloudflare 回源

`Cloudflare` 回你的服务器时，看的是：

- 你源站 `Nginx` 返回的证书

如果你使用的是 `Origin CA`，那么：

- 这张 `Origin CA` 证书会被安装在 `Nginx` 上
- 然后由 `Nginx` 出示给 `Cloudflare`

### 5.3 第三层：Nginx 本身只是装配点

`Nginx` 不是证书类别，而是一个：

- TLS 终止点
- 反向代理
- Web 服务器

它负责按域名加载正确证书，并处理 `443` 上的 HTTPS 请求。

---

## 六、为什么 Cloudflare 上已经有证书，服务器里还要再配证书

因为两段链路不是一回事。

如果你只配置了边缘证书，那通常只能说明：

- 浏览器到 `Cloudflare` 这一段是 HTTPS

但 `Cloudflare` 回源到你服务器时，仍然可能出现下面几种情况：

- 回源走 HTTP
- 回源走 HTTPS 但证书不匹配
- 回源走 HTTPS 但源站没开 `443`
- 回源握手失败

所以服务器里仍然要配好证书，才能保证：

- `Cloudflare -> Nginx` 这一段也安全
- `Full (strict)` 能成立

---

## 七、为什么 Origin CA 证书不能直接拿给浏览器用

因为它的设计目标不是公网浏览器信任链，而是 `Cloudflare` 自己的源站回源体系。

所以正确理解是：

- 边缘证书给浏览器看
- `Origin CA` 给 `Cloudflare` 看
- `Nginx` 负责把源站证书真正加载出来

---

## 八、一个最容易混淆的点

很多人会把下面两句话混为一谈：

1. 我在 `Cloudflare` 上已经有证书了
2. 我的 `Nginx` 已经配置证书了

它们可能同时成立，也可能只成立一半。

例如：

- `Cloudflare` 已经给浏览器侧配好了边缘证书
- 但你的服务器 `443` 没开
- 或者 `Nginx` 里没有 `ssl_certificate`

这时浏览器访问表面上已经是走 `Cloudflare`，但回源仍然会失败，典型现象就是：

- `521`
- `525`
- `526`
- 握手失败

---

## 九、工程上最稳的理解方式

当你以后再看证书问题时，直接按这三问来分：

1. 这张证书是给谁看的，浏览器还是 Cloudflare 还是内部服务
2. 这张证书安装在哪里，Cloudflare 边缘、负载均衡、还是 Nginx
3. 它覆盖的主机名和实际访问域名是否一致

只要这三问答清楚，大多数关于 `Cloudflare + Nginx + HTTPS` 的概念混乱都会消失。

---

## 十、结论

一句话概括三者关系：

- `Cloudflare 边缘证书` 负责浏览器到 `Cloudflare`
- `Origin CA` 负责 `Cloudflare` 到源站的证书信任
- `Nginx` 负责在源站真正加载并出示那张证书

所以真正完整的 HTTPS，不是“只有 Cloudflare 有证书”，而是：

- 浏览器侧证书覆盖正确
- 源站侧证书覆盖正确
- `Nginx` 正确监听 `443` 并装载证书
- `Cloudflare` 使用 `Full (strict)`

这四件事同时成立，整条链路才算打通。

## 相关阅读

- [HTTPS 与证书专题导航：Cloudflare、SSL、Nginx 与排障全链路](./HTTPS与证书专题导航-Cloudflare、SSL、Nginx与排障全链路.md)
- [HTTPS 排障：Cloudflare、Nginx 与 521/525/526 故障排查清单](./HTTPS故障排查清单-521、525、526、证书不匹配与443未监听.md)
- [HTTPS 实战：使用 Cloudflare 解析域名并为 Nginx 站点配置 HTTPS](./使用Cloudflare解析域名并为Nginx站点配置HTTPS.md)
- [SSL/TLS 与证书完全指南：域名、服务器与 HTTPS 的真实关系](./SSL与证书完全指南-域名、服务器与HTTPS的真实关系.md)
