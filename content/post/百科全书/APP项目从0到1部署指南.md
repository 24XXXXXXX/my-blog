---
title: "APP 项目从 0 到 1 部署指南"
description: "基于 Flutter + Spring Boot + MySQL + Redis，讲清楚 APP 后端部署、Android 打包、iOS 提测和正式发布流程"
keywords: "Flutter,SpringBoot,MySQL,Redis,Android打包,iOS提审,APP部署"

date: 2026-03-28T14:40:00+08:00
lastmod: 2026-03-28T17:30:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - APP
  - Flutter
  - SpringBoot
---

本文把 APP 部署收窄到一条主流组合：

- 客户端：`Flutter`
- 后端：`Spring Boot + Maven`
- 数据库：`MySQL`
- 缓存：`Redis`
- 网关：`Nginx`

APP 和 Web 的区别在于：Web 只要把前后端放上线就行，APP 还要打安装包、签名、测试分发、提审和正式发布。所以本文会分成两条主线：

1. 后端部署
2. Flutter 客户端构建与发布

<!--more-->

## 一、前置准备

这些基础环境如果你还没准备好，请先看相关文章：

- [Docker 安装和命令大全](./docker安装和命令.md)
- [在 Docker 中部署 MySQL](./在Docker中部署MySQL.md)
- [在 Docker 中部署 Redis](./在Docker中部署Redis.md)
- [使用 SDKMAN 管理 Java 版本](./使用SDKMAN管理Java版本.md)
- [使用 Jabba 管理 Java 版本](./使用Jabba管理Java版本.md)

本文默认：

1. 服务器系统是 `Ubuntu 22.04`
2. `MySQL` 和 `Redis` 已经用 Docker 跑起来
3. 服务器已经有 `JDK 21`
4. 本地 Flutter 环境已经可用，执行 `flutter doctor` 没有关键阻塞项

统一域名：

- API：`api.example.com`
- 安卓下载：`download.example.com`

---

## 二、先部署后端

APP 部署一定是后端先行。因为无论是 Android 还是 iOS，最终都要访问线上 API。

## 2.1 本地打包 Spring Boot

进入后端项目目录：

```bash
./mvnw clean package -DskipTests
```

输出一般在：

```bash
target/*.jar
```

## 2.2 服务器安装 Nginx 和 Certbot

```bash
ssh root@你的服务器IP
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

## 2.3 创建目录并上传 Jar

```bash
mkdir -p /srv/flutter-app/backend
mkdir -p /srv/flutter-app/downloads
mkdir -p /srv/flutter-app/logs
```

本地上传：

```bash
scp ./target/*.jar root@你的服务器IP:/srv/flutter-app/backend/app.jar
```

## 2.4 创建生产配置

```bash
nano /srv/flutter-app/backend/application-prod.yml
```

写入：

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/flutter_app?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: flutter_app
    password: FlutterApp@2026#123
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      password: FlutterRedis@2026#123

app:
  latest-version: 1.0.0
  min-version: 1.0.0
  android-download-url: https://download.example.com/app-release.apk

logging:
  file:
    name: /srv/flutter-app/logs/app.log
```

## 2.5 用 systemd 启动 Spring Boot

```bash
nano /etc/systemd/system/flutter-app.service
```

写入：

```ini
[Unit]
Description=flutter-app
After=network.target

[Service]
User=root
WorkingDirectory=/srv/flutter-app/backend
ExecStart=/usr/bin/java -jar /srv/flutter-app/backend/app.jar --spring.profiles.active=prod --spring.config.additional-location=/srv/flutter-app/backend/application-prod.yml
SuccessExitStatus=143
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启动：

```bash
systemctl daemon-reload
systemctl enable flutter-app
systemctl start flutter-app
systemctl status flutter-app
```

## 2.6 配置 Nginx

```bash
nano /etc/nginx/sites-available/flutter-app.conf
```

写入：

```nginx
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
    }
}

server {
    listen 80;
    server_name download.example.com;

    root /srv/flutter-app/downloads;
    index index.html;

    location / {
        autoindex on;
    }
}
```

启用：

```bash
ln -s /etc/nginx/sites-available/flutter-app.conf /etc/nginx/sites-enabled/flutter-app.conf
nginx -t
systemctl restart nginx
systemctl enable nginx
```

## 2.7 配置 HTTPS

把：

- `api.example.com`
- `download.example.com`

解析到服务器公网 IP，然后执行：

```bash
certbot --nginx -d api.example.com -d download.example.com
certbot renew --dry-run
```

## 2.8 验证后端

```bash
curl https://api.example.com/actuator/health
systemctl status flutter-app
```

---

## 三、Android 发布

这部分在本地电脑操作。

## 3.1 切换 Flutter 到生产环境

确保你的生产环境接口指向：

```text
https://api.example.com
```

如果你有环境文件，可以在 `--dart-define` 中传入：

```bash
flutter build apk --release --dart-define=API_BASE_URL=https://api.example.com
```

## 3.2 生成签名文件

在本地执行：

```bash
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

把 `upload-keystore.jks` 放到：

```bash
android/app/
```

创建：

```bash
android/key.properties
```

写入：

```properties
storePassword=你的keystore密码
keyPassword=你的key密码
keyAlias=upload
storeFile=upload-keystore.jks
```

## 3.3 打 Android 测试包

```bash
flutter clean
flutter pub get
flutter build apk --release --dart-define=API_BASE_URL=https://api.example.com
```

产物一般在：

```bash
build/app/outputs/flutter-apk/app-release.apk
```

## 3.4 把 APK 上传到服务器

```bash
scp build/app/outputs/flutter-apk/app-release.apk root@你的服务器IP:/srv/flutter-app/downloads/
```

浏览器测试下载：

```text
https://download.example.com/app-release.apk
```

## 3.5 打 Google Play 用的 AAB

```bash
flutter build appbundle --release --dart-define=API_BASE_URL=https://api.example.com
```

产物一般在：

```bash
build/app/outputs/bundle/release/app-release.aab
```

如果你要上架 Google Play，提交的是这个 `aab`。

---

## 四、iOS 发布

iOS 打包必须在 `macOS + Xcode` 环境完成。

## 4.1 生产环境构建

```bash
flutter clean
flutter pub get
flutter build ipa --release --dart-define=API_BASE_URL=https://api.example.com
```

## 4.2 上传到 App Store Connect

推荐两种方式：

### 方式一：Xcode Archive

1. 打开 `ios/Runner.xcworkspace`
2. 选择 `Any iOS Device`
3. 点击 `Product -> Archive`
4. 在 Organizer 中上传

### 方式二：Transporter

把 `ipa` 上传到 App Store Connect。

## 4.3 TestFlight 测试

上传完成后：

1. 进入 App Store Connect
2. 找到 TestFlight
3. 邀请内部测试人员
4. 测登录、支付、弱网、升级

## 4.4 正式提审

准备好：

- 截图
- 隐私政策
- 测试账号
- 审核说明

然后提交审核。

---

## 五、多人/团队部署

团队阶段推荐仍然保持这条技术栈：

- Flutter
- Spring Boot
- MySQL
- Redis

但后端要改成容器化，客户端要改成自动打包。

## 5.1 后端 Dockerfile

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

## 5.2 `docker-compose.yml`

```yaml
version: "3.9"

services:
  api:
    build: ./backend
    container_name: flutter-app-api
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://host.docker.internal:3306/flutter_app?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      SPRING_DATASOURCE_USERNAME: flutter_app
      SPRING_DATASOURCE_PASSWORD: FlutterApp@2026#123
      SPRING_DATA_REDIS_HOST: host.docker.internal
      SPRING_DATA_REDIS_PORT: 6379
      SPRING_DATA_REDIS_PASSWORD: FlutterRedis@2026#123
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - "8080:8080"
```

启动：

```bash
docker compose up -d --build
docker compose logs -f api
```

## 5.3 Flutter Android 自动打包示例

```yaml
name: build-android

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: "3.24.0"
      - run: flutter pub get
      - run: flutter build apk --release --dart-define=API_BASE_URL=https://api.example.com
```

---

## 六、标准商业化部署

商业化阶段推荐：

- 后端：`Kubernetes`
- 数据：托管 MySQL、托管 Redis
- 文件：对象存储 + CDN
- 客户端：灰度发布 + 强制更新

你至少要有一个版本检查接口，例如：

```json
{
  "latestVersion": "1.0.3",
  "minVersion": "1.0.0",
  "forceUpdate": false,
  "androidDownloadUrl": "https://download.example.com/app-release.apk"
}
```

客户端启动时请求这个接口，就能控制是否提示升级或强制升级。

---

## 七、最容易踩的坑

1. Flutter 包还连着测试环境 API
2. Android 签名文件丢失
3. iOS Bundle ID 配错
4. Spring Boot 后端已经升级，但旧版本 APP 不兼容
5. 下载地址配置的是 HTTP 不是 HTTPS

---

## 八、官方文档入口

正式提测和提审前，建议以官方文档为准：

- Apple App Store Connect：`https://developer.apple.com/app-store-connect/`
- Apple 帮助中心：`https://developer.apple.com/help/app-store-connect/`
- Google Play Console 帮助中心：`https://support.google.com/googleplay/android-developer/`

---

## 总结

这套 `Flutter + Spring Boot + MySQL + Redis` 的 APP 部署，最稳顺序是：

1. 先按相关文章准备好 Docker、MySQL、Redis、JDK
2. 先把 Spring Boot 后端部署到服务器
3. 配好 `api.example.com` 和 `download.example.com`
4. Android 先出测试包
5. iOS 先走 TestFlight
6. 确认线上 API 稳定后再正式提审

先把后端和 Android 测试包跑通，是新手最容易成功的路线。等你把这条链路走顺之后，再补 iOS、自动化打包和商业化灰度。
