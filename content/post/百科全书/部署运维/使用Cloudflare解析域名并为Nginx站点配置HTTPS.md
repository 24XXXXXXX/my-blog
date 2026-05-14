---
title: "HTTPS 实战：使用 Cloudflare 解析域名并为 Nginx 站点配置 HTTPS"
description: "从已有域名出发，完整讲解 Cloudflare DNS 解析、边缘证书、Origin CA 源站证书、Full strict 与 Nginx HTTPS 配置的落地流程"
keywords: "Cloudflare,DNS,HTTPS,Nginx,Origin CA,SSL证书,TLS,域名解析,Full strict,反向代理"

date: 2026-04-13T16:10:00+08:00
lastmod: 2026-04-13T16:10:00+08:00
weight: 

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Cloudflare
  - DNS
  - HTTPS
  - Nginx
  - SSL
  - 部署
---

很多人第一次接触 `Cloudflare` 时，容易把三件事混在一起：

- 域名解析
- 浏览器到 Cloudflare 的 HTTPS
- Cloudflare 到源站服务器的 HTTPS

这篇文章把这三件事拆开讲，并按一条可直接落地的主线写清楚：

1. 你已经有自己的域名
2. 你要把域名解析到自己的服务器
3. 你要让网站通过 `https://你的域名` 正常访问
4. 你的服务器使用 `Nginx`

本文会重点覆盖 `Cloudflare DNS + 边缘证书 + Origin CA 源站证书 + Nginx` 这一套组合。

<!--more-->

## 一、先建立正确认知

当你把域名接入 `Cloudflare` 后，访问链路通常是这样的：

```text
浏览器 <-> Cloudflare <-> 你的服务器
```

这里其实有两段 TLS/HTTPS：

1. 浏览器和 `Cloudflare` 之间
2. `Cloudflare` 和你的源站服务器之间

对应两类证书：

- `Cloudflare 边缘证书`：给浏览器看的
- `Cloudflare Origin CA 源站证书`：给你的服务器看的，只用于 Cloudflare 到源站这一段

要特别注意：

- `Origin CA` 证书不是给普通浏览器直接信任的
- 它不能替代浏览器侧的公网证书
- 它的作用是让 `Cloudflare -> 服务器` 这段也能安全加密，并支持 `Full (strict)`

---

## 二、整体流程总览

如果你要把 `computer-store.jtgkw.cn` 这种项目域名接到自己的服务器，标准流程是：

1. 把域名托管到 `Cloudflare`
2. 在 `Cloudflare DNS` 中新增解析记录，指向你的服务器公网 IP
3. 确认该记录开启橙云代理
4. 配置 `Cloudflare` 的边缘证书覆盖你的站点域名
5. 生成 `Origin CA` 源站证书，证书主机名必须覆盖你的项目域名
6. 把源站证书和私钥放到服务器
7. 在 `Nginx` 中配置 `443 ssl`
8. 把 `80` 跳转到 `443`
9. 在 `Cloudflare` 中把 `SSL/TLS` 模式设为 `Full (strict)`
10. 重载 `Nginx` 并验证 `http` 和 `https`

---

## 三、第一步：把域名交给 Cloudflare 管理

如果你的域名还没接入 `Cloudflare`，要先完成：

1. 在 `Cloudflare` 添加站点
2. 按提示把域名注册商处的 `NS` 记录改成 `Cloudflare` 提供的名称服务器
3. 等待 `Cloudflare` 接管成功

接管成功后，`DNS` 配置才由 `Cloudflare` 控制。

---

## 四、第二步：在 Cloudflare 中做 DNS 解析

假设你的服务器公网 IP 是 `1.2.3.4`，你要对外使用的域名是 `computer-store.jtgkw.cn`。

在 `Cloudflare -> DNS` 中添加：

- 类型：`A`
- 名称：`computer-store`
- IPv4 地址：`1.2.3.4`
- 代理状态：`已代理`，也就是橙云开启

如果你的服务器有 IPv6，也可以再加一条 `AAAA`。

### 4.1 为什么这里推荐直接用 `computer-store.jtgkw.cn`

因为通配符证书通常是单层匹配。

例如：

- `*.jtgkw.cn` 可以匹配 `computer-store.jtgkw.cn`
- `*.jtgkw.cn` 不能匹配 `www.computer-store.jtgkw.cn`

所以如果你原本想用 `www.computer-store.jtgkw.cn`，但现有边缘证书和源站证书只有 `*.jtgkw.cn`，那把域名简化成 `computer-store.jtgkw.cn` 会更稳，也更省事。

---

## 五、第三步：确认 Cloudflare 边缘证书是否覆盖你的域名

用户在浏览器里访问 `https://computer-store.jtgkw.cn` 时，浏览器先连到的是 `Cloudflare`，因此浏览器看到的是 `Cloudflare` 的边缘证书。

所以必须确认：

- 边缘证书覆盖你的站点域名

例如：

- `jtgkw.cn`
- `*.jtgkw.cn`

这种边缘证书可以覆盖：

- `jtgkw.cn`
- `computer-store.jtgkw.cn`
- `api.jtgkw.cn`

但不能覆盖：

- `www.computer-store.jtgkw.cn`

如果你的目标域名不在边缘证书覆盖范围内，浏览器访问就会先在最外层失败。

---

## 六、第四步：在 Cloudflare 生成 Origin CA 源站证书

进入 `Cloudflare` 控制台后，找到：

```text
SSL/TLS -> 源服务器 -> 创建证书
```

常见设置如下：

- 密钥格式：`PEM`
- 私钥类型：`RSA` 或 `ECC`
- 主机名：填写你的项目域名

例如你的项目域名是：

```text
computer-store.jtgkw.cn
```

那么你可以填写：

```text
computer-store.jtgkw.cn
```

如果你还想让同级别别名复用，也可以额外填写：

```text
*.jtgkw.cn
jtgkw.cn
computer-store.jtgkw.cn
```

生成后，`Cloudflare` 会给你两段内容：

- 证书内容：`BEGIN CERTIFICATE`
- 私钥内容：`BEGIN PRIVATE KEY`

### 6.1 非常重要的安全要求

私钥不能泄露。

一旦你把私钥：

- 发给别人
- 提交到 Git 仓库
- 粘贴到公开聊天记录
- 放在任何可公开访问的位置

这把私钥就应该视为已泄露，正确做法是：

1. 停止继续使用
2. 到 `Cloudflare` 重新生成新证书和新私钥
3. 用新文件替换服务器上的旧证书

---

## 七、第五步：把证书放到服务器

假设你把证书放在：

```text
/home/admin/certs/cloudflare/
```

可以保存成：

```text
/home/admin/certs/cloudflare/computer-store.jtgkw.cn-origin.pem
/home/admin/certs/cloudflare/computer-store.jtgkw.cn-origin.key
```

建议权限：

```bash
chmod 644 /home/admin/certs/cloudflare/computer-store.jtgkw.cn-origin.pem
chmod 600 /home/admin/certs/cloudflare/computer-store.jtgkw.cn-origin.key
```

说明：

- 证书文件可以相对宽松读取
- 私钥文件应尽量收紧权限

---

## 八、第六步：在 Nginx 中配置 HTTPS

一个标准的 `Nginx` 配置可以写成这样：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name computer-store.jtgkw.cn;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name computer-store.jtgkw.cn;

    ssl_certificate /home/admin/certs/cloudflare/computer-store.jtgkw.cn-origin.pem;
    ssl_certificate_key /home/admin/certs/cloudflare/computer-store.jtgkw.cn-origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_prefer_server_ciphers off;

    root /var/www/computer_store/dist;
    index index.html;

    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    location /uploads/ {
        alias /var/www/computer_store/uploads/;
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 8.1 这个配置的作用是什么

第一段 `server`：

- 监听 `80`
- 把所有 HTTP 请求重定向到 HTTPS

第二段 `server`：

- 监听 `443`
- 为 `computer-store.jtgkw.cn` 启用 TLS
- 静态资源从 `dist` 提供
- `/api/` 反向代理到本机 `8080`

---

## 九、第七步：启用站点并检查 Nginx 配置

如果你采用 `sites-available` 和 `sites-enabled` 结构，常见操作是：

```bash
sudo ln -s /etc/nginx/sites-available/computer-store.jtgkw.cn.conf /etc/nginx/sites-enabled/computer-store.jtgkw.cn.conf
sudo nginx -t
sudo systemctl reload nginx
```

如果之前挂的是旧域名站点文件，要把旧链接移除掉，避免冲突。

### 9.1 重点检查什么

你至少要确认：

- `80` 在监听
- `443` 在监听
- `nginx -t` 通过
- `ssl_certificate` 路径正确
- `ssl_certificate_key` 路径正确

例如：

```bash
ss -ltnp | grep -E ':80|:443'
```

如果只有 `80` 没有 `443`，说明你还没有真正把 HTTPS 配置跑起来。

---

## 十、第八步：在 Cloudflare 中把 SSL/TLS 模式设为 Full (strict)

这一步非常关键。

进入：

```text
Cloudflare -> SSL/TLS -> Overview
```

把模式设为：

```text
Full (strict)
```

### 10.1 各模式的区别

- `Flexible`：浏览器到 Cloudflare 是 HTTPS，但 Cloudflare 到源站可能还是 HTTP
- `Full`：Cloudflare 到源站用 HTTPS，但不严格校验证书是否可信
- `Full (strict)`：Cloudflare 到源站用 HTTPS，并且要求源站证书有效且主机名匹配

如果你已经配置了 `Origin CA`，就应该使用 `Full (strict)`。

---

## 十一、常见故障排查

### 11.1 浏览器能打开 HTTP，但 HTTPS 返回 521

通常表示：

- 源站 `443` 没监听
- `Nginx` 没有正确加载 HTTPS 配置
- 服务器防火墙没放行 `443`

### 11.2 `curl https://域名` 握手失败

常见原因：

- 证书和私钥不匹配
- `ssl_certificate_key` 指向错误文件
- `Nginx` 没有成功 reload

可以验证证书和私钥是否匹配：

```bash
openssl x509 -noout -modulus -in server.pem | openssl md5
openssl rsa  -noout -modulus -in server.key | openssl md5
```

两边哈希一致才说明匹配。

### 11.3 域名能访问，但支付回调或第三方回调失败

这是部署里非常容易漏掉的一类问题。

当你把项目域名从旧地址切到新地址时，要一并检查：

- 支付回调 URL
- 登录回调 URL
- Webhook URL
- 物流回调 URL
- 前端环境变量中的站点基地址

否则首页可能已经正常，业务链路却还在走旧域名。

---

## 十二、一个可执行的上线清单

正式切换前，可以按下面的顺序执行：

1. 在 `Cloudflare DNS` 新增 `A` 记录指向服务器 IP
2. 确认橙云代理已开启
3. 确认边缘证书覆盖该域名
4. 生成覆盖该域名的 `Origin CA` 证书
5. 把证书和私钥保存到服务器
6. 写好 `Nginx` 的 `80 -> 443` 跳转和 `443 ssl` 配置
7. 执行 `nginx -t`
8. 执行 `systemctl reload nginx`
9. 确认 `443` 已监听
10. 在 `Cloudflare` 中把模式设为 `Full (strict)`
11. 测试 `http://域名` 是否跳到 `https://域名`
12. 测试前端页面、接口、支付回调、上传和静态资源访问

---

## 十三、结论

把网站挂到 `Cloudflare` 并开启 HTTPS，不是“只生成一张证书”这么简单，而是四件事必须同时成立：

1. `DNS` 要把域名正确解析到你的服务器
2. `Cloudflare 边缘证书` 要覆盖浏览器访问的域名
3. `Origin CA` 源站证书要覆盖源站配置里的 `server_name`
4. `Nginx` 必须真正监听 `443` 并加载证书文件

只要这四个环节有任何一个没对齐，就会出现：

- 域名能解析但 HTTPS 不通
- `Cloudflare` 代理已开但返回 `521`
- 浏览器证书报错
- HTTP 可访问但 HTTPS 失败

因此最稳的部署思路永远是：

- 先确定最终对外域名
- 再核对边缘证书覆盖范围
- 再生成匹配的源站证书
- 最后配置 `Nginx` 和 `Full (strict)`

这条链路对齐后，HTTPS 才是真正完整可用的。

## 相关阅读

- [HTTPS 与证书专题导航：Cloudflare、SSL、Nginx 与排障全链路](./HTTPS与证书专题导航-Cloudflare、SSL、Nginx与排障全链路.md)
- [HTTPS 排障：Cloudflare、Nginx 与 521/525/526 故障排查清单](./HTTPS故障排查清单-521、525、526、证书不匹配与443未监听.md)
- [Cloudflare 证书链路说明：边缘证书、源站证书与 Nginx 证书配置关系](./Cloudflare边缘证书、源站证书与Nginx证书配置关系说明.md)
- [SSL/TLS 与证书完全指南：域名、服务器与 HTTPS 的真实关系](./SSL与证书完全指南-域名、服务器与HTTPS的真实关系.md)
