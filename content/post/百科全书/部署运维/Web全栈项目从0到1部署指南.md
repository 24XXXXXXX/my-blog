---
title: "Web 全栈项目从 0 到 1 部署指南"
description: "基于 Vite + Vue3 + Spring Boot + Maven + MySQL + Redis，手把手讲解个人、团队和商业化三种部署流程"
keywords: "Vite,Vue3,SpringBoot,Maven,MySQL,Redis,Nginx,Web全栈部署"

date: 2026-03-28T14:20:00+08:00
lastmod: 2026-03-28T17:10:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Web
  - Vue3
  - SpringBoot
---

本文把 Web 全栈部署收窄到一条固定主线：

- 前端：`Vite + Vue 3`
- 后端：`Spring Boot + Maven`
- 数据库：`MySQL`
- 缓存：`Redis`
- 网关：`Nginx`

我不再重复你已经写过的工具安装文章。下面默认你已经按相关文章完成了前置准备，然后直接进入“如何把项目部署起来”。

<!--more-->

## 一、前置准备

如果你还没完成这些基础环境，请先看相关文章：

- [Docker 安装和命令大全](./docker安装和命令.md)
- [在 Docker 中部署 MySQL](./在Docker中部署MySQL.md)
- [在 Docker 中部署 Redis](./在Docker中部署Redis.md)
- [使用 SDKMAN 管理 Java 版本](./使用SDKMAN管理Java版本.md)
- [使用 Jabba 管理 Java 版本](./使用Jabba管理Java版本.md)
- [在 Windows 和 Ubuntu 下使用 NVM 管理 Node.js 多版本](./在Windows和Ubuntu下使用NVM管理Node.js多版本.md)

本文默认你的前置状态如下：

1. 服务器系统是 `Ubuntu 22.04`
2. 服务器已经装好 `Docker`
3. `MySQL` 和 `Redis` 已经用 Docker 跑起来
4. 服务器已经有 `JDK 21`
5. 你本地已经能正常执行 `npm run build` 和 `./mvnw clean package`

本文统一使用下面这些域名：

- 前端：`www.example.com`
- 后端：`api.example.com`

---

## 二、项目最终部署结构

个人部署和大多数小团队部署，推荐先上这一套：

```bash
/srv/web-vue-springboot/
  frontend/
    dist/
  backend/
    app.jar
  logs/
```

运行结构如下：

1. `Nginx` 负责前端静态资源和反向代理
2. `Spring Boot` Jar 包监听 `8080`
3. `MySQL` 容器监听 `3306`
4. `Redis` 容器监听 `6379`

---

## 三、个人部署：单台服务器完整流程

这部分你可以直接照着做。

## 3.1 前端项目发布前先改这 3 个地方

真正部署前，不要急着先打包。先检查前端这三个地方：

1. 生产环境接口地址
2. Axios 基础封装
3. 路由模式和 Nginx 刷新兼容

### `.env.production`

在前端项目根目录创建或确认：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=My Web App
```

### `src/utils/request.ts`

如果你项目里还没有统一的请求封装，建议至少补一个最小版本：

```ts
import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("request error:", error);
    return Promise.reject(error);
  }
);

export default request;
```

这样上线后如果你要切换域名，只需要改 `.env.production` 并重新打包。

### `src/router/index.ts`

如果你用的是 `Vue Router history` 模式，确保像下面这样配置：

```ts
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/HomeView.vue")
    }
  ]
});

export default router;
```

因为你后面会依赖 Nginx 的：

```nginx
try_files $uri $uri/ /index.html;
```

来解决刷新 404。

## 3.2 本地先打包前端

进入前端项目目录：

```bash
npm install
npm run build
```

打包成功后，默认会得到：

```bash
dist/
```

## 3.3 Spring Boot 项目发布前先改这 4 个地方

后端在打包前，建议先确认：

1. `application.yml` 没写死本地数据库地址
2. 跨域已经处理
3. 上传目录是服务器目录，不是本地磁盘路径
4. 日志输出到文件

### 推荐配置拆分

你的 Spring Boot 项目最好这样分：

- `application.yml`：放公共配置
- `application-dev.yml`：本地开发
- `application-prod.yml`：生产环境

### 一个更完整的 `application-prod.yml` 模板

后面服务器上你可以直接用这一份：

```yaml
server:
  port: 8080
  forward-headers-strategy: framework

spring:
  application:
    name: web-vue-springboot
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/myapp?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false
    username: myapp
    password: MyApp@2026#123
    driver-class-name: com.mysql.cj.jdbc.Driver
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 20MB
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      password: MyRedis@2026#123
      timeout: 5000
  jackson:
    time-zone: Asia/Shanghai
    date-format: yyyy-MM-dd HH:mm:ss

mybatis:
  mapper-locations: classpath:/mapper/**/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

logging:
  level:
    root: info
    org.springframework.web: info
  file:
    name: /srv/web-vue-springboot/logs/app.log

app:
  upload-dir: /srv/web-vue-springboot/uploads
  cors-origins:
    - https://www.example.com
    - https://admin.example.com
```

### 一个最小可用的跨域配置类

如果你的前端域名和后端域名不同，例如：

- 前端：`https://www.example.com`
- 后端：`https://api.example.com`

那你必须处理 CORS。

可以创建：

```java
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors-origins}")
    private List<String> corsOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(corsOrigins.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

如果你用了 `Spring Security`，还要确认安全配置里没有把跨域预检请求拦掉。

### 健康检查接口

如果你还没准备健康检查接口，建议至少加一个：

```java
package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "ok");
    }
}
```

这样后面 Nginx、`curl`、监控都能直接检查服务是否存活。

## 3.4 本地打包 Spring Boot

进入后端项目目录：

```bash
./mvnw clean package -DskipTests
```

打包完成后通常会得到：

```bash
target/xxx.jar
```

如果你的项目没有 `mvnw`，就用：

```bash
mvn clean package -DskipTests
```

## 3.5 服务器安装 Nginx 和 Certbot

登录服务器：

```bash
ssh root@你的服务器IP
```

安装：

```bash
apt update
apt install -y nginx certbot python3-certbot-nginx
```

放行端口：

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow OpenSSH
ufw enable
```

云厂商安全组也要放行：

- `22`
- `80`
- `443`

## 3.6 创建项目目录

```bash
mkdir -p /srv/web-vue-springboot/frontend/dist
mkdir -p /srv/web-vue-springboot/backend
mkdir -p /srv/web-vue-springboot/logs
mkdir -p /srv/web-vue-springboot/uploads
```

## 3.7 上传前端产物和后端 Jar

在本地执行：

```bash
scp -r ./dist/* root@你的服务器IP:/srv/web-vue-springboot/frontend/dist/
scp ./target/*.jar root@你的服务器IP:/srv/web-vue-springboot/backend/app.jar
```

如果你在 Windows 上，也可以用 `WinSCP`、`FinalShell` 或 `Xftp` 上传。

## 3.8 准备 Spring Boot 生产配置

在服务器创建配置文件：

```bash
nano /srv/web-vue-springboot/backend/application-prod.yml
```

如果你想先快速启动，可以直接写下面这份：

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/myapp?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: myapp
    password: MyApp@2026#123
    driver-class-name: com.mysql.cj.jdbc.Driver
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      password: MyRedis@2026#123
  jackson:
    time-zone: Asia/Shanghai

logging:
  file:
    name: /srv/web-vue-springboot/logs/app.log
```

这里的数据库账号和 Redis 密码，请改成你自己在 Docker 容器里实际使用的值。

## 3.9 用 systemd 托管 Spring Boot

创建服务文件：

```bash
nano /etc/systemd/system/web-vue-springboot.service
```

写入：

```ini
[Unit]
Description=web-vue-springboot
After=network.target

[Service]
User=root
WorkingDirectory=/srv/web-vue-springboot/backend
ExecStart=/usr/bin/java -jar /srv/web-vue-springboot/backend/app.jar --spring.profiles.active=prod --spring.config.additional-location=/srv/web-vue-springboot/backend/application-prod.yml
SuccessExitStatus=143
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
systemctl daemon-reload
systemctl enable web-vue-springboot
systemctl start web-vue-springboot
systemctl status web-vue-springboot
```

看日志：

```bash
journalctl -u web-vue-springboot -f
```

### 常用 `systemd` 运维命令

以后你上线、重启、排错最常用的就是这几条：

```bash
# 启动
systemctl start web-vue-springboot

# 停止
systemctl stop web-vue-springboot

# 重启
systemctl restart web-vue-springboot

# 查看状态
systemctl status web-vue-springboot

# 开机自启
systemctl enable web-vue-springboot

# 取消开机自启
systemctl disable web-vue-springboot

# 查看实时日志
journalctl -u web-vue-springboot -f

# 查看最近 200 行日志
journalctl -u web-vue-springboot -n 200 --no-pager
```

如果你后续改了 service 文件，记得执行：

```bash
systemctl daemon-reload
systemctl restart web-vue-springboot
```

## 3.10 配置 Nginx

创建站点配置：

```bash
nano /etc/nginx/sites-available/web-vue-springboot.conf
```

写入：

```nginx
server {
    listen 80;
    server_name www.example.com;

    root /srv/web-vue-springboot/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 30d;
        access_log off;
    }
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

启用配置：

```bash
ln -s /etc/nginx/sites-available/web-vue-springboot.conf /etc/nginx/sites-enabled/web-vue-springboot.conf
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### 如果前后端共域名反向代理

有些人不想用两个域名，而想走：

- `https://www.example.com`
- API 走 `https://www.example.com/api`

那前端 Nginx 可以改成：

```nginx
server {
    listen 80;
    server_name www.example.com;

    root /srv/web-vue-springboot/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

这种方式的好处是：

- 前端不用处理跨域
- Cookie 和鉴权更简单

缺点是：

- 网关规则会稍微复杂一点

## 3.11 配置域名解析和 HTTPS

先在域名控制台把下面两条解析到服务器公网 IP：

- `www.example.com`
- `api.example.com`

解析生效后执行：

```bash
certbot --nginx -d www.example.com -d api.example.com
certbot renew --dry-run
```

## 3.12 检查是否部署成功

### 检查 Java 服务

```bash
systemctl status web-vue-springboot
ss -lntp | grep 8080
```

### 检查 Nginx

```bash
nginx -t
systemctl status nginx
```

### 检查前台和接口

优先检查你自己项目里的健康检查地址，例如：

```bash
curl https://api.example.com/health
```

浏览器打开：

- `https://www.example.com`
- `https://api.example.com/health`

## 3.13 以后更新代码怎么发版

个人部署下，更新顺序建议固定成：

1. 本地重新打包前端
2. 本地重新打包 Jar
3. 上传新 `dist`
4. 上传新 `app.jar`
5. 重启 Spring Boot 服务

命令如下：

```bash
scp -r ./dist/* root@你的服务器IP:/srv/web-vue-springboot/frontend/dist/
scp ./target/*.jar root@你的服务器IP:/srv/web-vue-springboot/backend/app.jar
ssh root@你的服务器IP "systemctl restart web-vue-springboot"
```

如果你改了 `application-prod.yml`，上传后同样要重启服务。

---

## 四、多人/团队部署：Docker Compose

团队阶段不建议继续手工传 Jar 和 `dist`，更推荐直接把前后端都容器化，然后用 `docker compose` 发布。

这里我给你一份“专门对接你现有 MySQL/Redis 文章”的完整示例：

- `MySQL` 和 `Redis` 已经按你的文章先独立部署好了
- 当前 `docker compose` 只负责编排前端、后端、Nginx
- 后端通过宿主机地址连接已有的 MySQL/Redis 容器

## 4.1 目录结构

```bash
/srv/web-vue-springboot/
  frontend/
  backend/
  nginx/
  docker-compose.yml
```

## 4.2 前端 Dockerfile

在前端项目根目录创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

前端 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 4.3 后端 Dockerfile

在后端项目根目录创建 `Dockerfile`：

```dockerfile
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar","--spring.profiles.active=prod"]
```

## 4.4 网关 Nginx 配置

在 `/srv/web-vue-springboot/nginx/default.conf` 写入：

```nginx
server {
    listen 80;
    server_name www.example.com;

    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4.5 `docker-compose.yml`

```yaml
version: "3.9"

services:
  nginx:
    image: nginx:1.27-alpine
    container_name: web-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./frontend
    container_name: web-frontend
    restart: unless-stopped

  backend:
    build: ./backend
    container_name: web-backend
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://host.docker.internal:3306/myapp?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      SPRING_DATASOURCE_USERNAME: myapp
      SPRING_DATASOURCE_PASSWORD: MyApp@2026#123
      SPRING_DATA_REDIS_HOST: host.docker.internal
      SPRING_DATA_REDIS_PORT: 6379
      SPRING_DATA_REDIS_PASSWORD: MyRedis@2026#123
      SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE: 20MB
      SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE: 20MB
    extra_hosts:
      - "host.docker.internal:host-gateway"
    expose:
      - "8080"
```

这里默认你的 MySQL 和 Redis 还是按这两篇文章独立部署：

- [在 Docker 中部署 MySQL](./在Docker中部署MySQL.md)
- [在 Docker 中部署 Redis](./在Docker中部署Redis.md)

也就是说，这份 Compose 不重复拉起数据库，而是直接复用现有容器和端口。

## 4.6 启动

```bash
cd /srv/web-vue-springboot
docker compose up -d --build
docker compose ps
docker compose logs -f nginx
docker compose logs -f backend
```

### 团队模式下如何加 HTTPS

如果你继续使用宿主机 Nginx 处理 HTTPS，就不要让 Compose 内的 Nginx 占用 `80` 和 `443`，改成：

```yaml
  nginx:
    ports:
      - "8088:80"
```

然后宿主机 Nginx 再代理到 `127.0.0.1:8088`。

如果你想让 Compose 内的 Nginx 直接接公网流量，那就直接在宿主机上用 `certbot certonly` 申请证书，然后把证书文件挂进去。

## 4.7 团队发版方式

团队推荐的发版动作：

1. 开发提交代码到 `main`
2. CI 构建前后端镜像
3. 服务器执行 `docker compose pull`
4. 执行 `docker compose up -d`

如果你用 `GitHub Actions`，建议把部署动作拆成：

- 前端构建并推镜像
- 后端构建并推镜像
- SSH 到服务器重启容器

### 一个更实用的团队发版命令顺序

```bash
git pull
docker compose build --no-cache frontend backend
docker compose up -d
docker compose ps
docker compose logs --tail 100 backend
```

---

## 五、标准商业化部署：Kubernetes

商业化部署下，推荐：

- 前端：对象存储 + CDN
- 后端：Kubernetes
- 数据库：托管 MySQL
- 缓存：托管 Redis

## 5.1 后端 Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-backend
  template:
    metadata:
      labels:
        app: web-backend
    spec:
      containers:
        - name: web-backend
          image: registry.example.com/web-backend:1.0.0
          ports:
            - containerPort: 8080
```

## 5.2 Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-backend
spec:
  selector:
    app: web-backend
  ports:
    - port: 80
      targetPort: 8080
```

## 5.3 Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-backend-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-backend
                port:
                  number: 80
```

部署命令：

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

---

## 六、三种方式怎么选

| 场景 | 推荐方式 | 说明 |
| --- | --- | --- |
| 个人 | `Jar + Nginx + Docker MySQL/Redis` | 最容易排错 |
| 小团队 | `Docker Compose` | 一致性更好 |
| 商业化 | `K8s + 托管数据库` | 可扩展、可治理 |

---

## 七、最常见的问题

### 7.1 前端刷新 404

说明你的 Nginx 没写这句：

```nginx
try_files $uri $uri/ /index.html;
```

### 7.2 Spring Boot 启动不了

先查：

```bash
systemctl status web-vue-springboot
journalctl -u web-vue-springboot -f
```

### 7.3 接口能本地访问，域名访问不了

先查：

```bash
nginx -t
systemctl status nginx
ss -lntp | grep 8080
```

### 7.4 前端请求跨域

优先检查：

- `VITE_API_BASE_URL`
- Spring Boot CORS 配置
- Nginx 代理是否正确

### 7.5 上传文件报 413

如果你有上传接口，Nginx 默认可能会拦截大文件。

在对应 `server` 段里加：

```nginx
client_max_body_size 20m;
```

然后重启 Nginx：

```bash
nginx -t
systemctl restart nginx
```

### 7.6 Jar 更新后还是旧版本

先确认：

```bash
ls -lah /srv/web-vue-springboot/backend/
systemctl restart web-vue-springboot
journalctl -u web-vue-springboot -n 100 --no-pager
```

有时是你上传失败了，有时是服务根本没重启成功。

---

## 总结

这套 `Vite + Vue3 + Spring Boot + Maven + MySQL + Redis` 的上线顺序，最稳的是：

1. 先按相关文章准备好 Docker、MySQL、Redis、JDK、Node
2. 本地打包前端 `dist`
3. 本地打包后端 `jar`
4. 服务器安装 Nginx
5. 上传 `dist` 和 `jar`
6. 用 `systemd` 启动 Spring Boot
7. 用 Nginx 代理前后端
8. 最后再配 HTTPS

第一次部署，建议先用“个人部署”把整条链路跑通。等你能稳定上线和更新版本之后，再切团队化的 `Docker Compose`，最后再考虑 `Kubernetes`。
