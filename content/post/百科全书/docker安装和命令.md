---
title: "Docker 安装和命令大全"
description: "详细介绍在 Ubuntu、CentOS 等主流 Linux 系统上安装 Docker，以及 Docker 命令的完整使用方法"
keywords: "Docker,Docker安装,Ubuntu,CentOS,Docker命令,容器化"

date: 2026-03-24T08:51:04+08:00
lastmod: 2026-03-26T11:00:00+08:00

math: false
mermaid: false

categories:
  - 环境部署
tags:
  - Docker
  - 容器化
  - 环境搭建
  - Linux
---

Docker 是目前最流行的容器化平台，本文详细介绍如何在主流 Linux 系统（Ubuntu、CentOS）上安装 Docker，以及 Docker 命令的完整使用方法。

<!--more-->

## 一、Docker 简介

### 1.1 什么是 Docker

Docker 是一个开源的容器化平台，可以将应用程序及其依赖打包到一个轻量级、可移植的容器中，实现"一次构建，到处运行"。

### 1.2 Docker 核心概念

- **镜像（Image）**：只读的模板，包含运行应用所需的所有内容
- **容器（Container）**：镜像的运行实例，是应用的实际运行环境
- **仓库（Repository）**：存储和分发镜像的地方，如 Docker Hub
- **Dockerfile**：用于构建镜像的脚本文件
- **数据卷（Volume）**：持久化存储数据的机制
- **网络（Network）**：容器之间的通信机制

### 1.3 Docker 优势

- 轻量级：相比虚拟机，容器启动快、资源占用少
- 可移植性：在任何支持 Docker 的平台上运行
- 版本控制：镜像可以像代码一样进行版本管理
- 隔离性：每个容器相互隔离，互不影响
- 快速部署：秒级启动，快速扩展

---

## 二、在 Ubuntu 上安装 Docker

### 2.1 系统要求

- Ubuntu 20.04 LTS 或更高版本
- 64 位系统
- 内核版本 3.10 或更高

### 2.2 卸载旧版本（如果存在）

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

### 2.3 使用官方脚本安装（推荐）

这是最简单快速的安装方法：

```bash
# 下载并执行官方安装脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker --version
sudo docker run hello-world
```

### 2.4 使用 APT 仓库安装（标准方法）

#### 步骤 1：更新软件包索引并安装依赖

```bash
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

#### 步骤 2：添加 Docker 官方 GPG 密钥

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

#### 步骤 3：设置 Docker 仓库

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### 步骤 4：安装 Docker Engine

```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### 步骤 5：启动并设置开机自启

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

#### 步骤 6：验证安装

```bash
sudo docker --version
sudo docker run hello-world
```

### 2.5 配置非 root 用户使用 Docker

默认情况下，Docker 需要 root 权限。为了让普通用户也能使用 Docker：

```bash
# 创建 docker 组（通常已存在）
sudo groupadd docker

# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录或执行以下命令使组权限生效
newgrp docker

# 验证（无需 sudo）
docker run hello-world
```

---

## 三、在 CentOS 上安装 Docker

### 3.1 系统要求

- CentOS 7 或更高版本
- 64 位系统
- 内核版本 3.10 或更高

### 3.2 卸载旧版本（如果存在）

```bash
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```

### 3.3 使用官方脚本安装（推荐）

```bash
# 下载并执行官方安装脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker --version
sudo docker run hello-world
```

### 3.4 使用 YUM 仓库安装（标准方法）

#### 步骤 1：安装依赖

```bash
sudo yum install -y yum-utils
```

#### 步骤 2：设置 Docker 仓库

```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

#### 步骤 3：安装 Docker Engine

```bash
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### 步骤 4：启动并设置开机自启

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

#### 步骤 5：验证安装

```bash
sudo docker --version
sudo docker run hello-world
```

### 3.5 配置非 root 用户使用 Docker

```bash
# 创建 docker 组
sudo groupadd docker

# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录或执行
newgrp docker

# 验证
docker run hello-world
```

---

## 四、Docker 配置优化

### 4.1 配置镜像加速器（国内用户推荐）

由于 Docker Hub 在国内访问较慢，建议配置镜像加速器。

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# 重启 Docker 服务
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证配置
docker info | grep -A 5 "Registry Mirrors"
```

### 4.2 配置 Docker 数据目录

```bash
# 停止 Docker 服务
sudo systemctl stop docker

# 编辑配置文件，添加 "data-root": "/new/path/to/docker"
sudo nano /etc/docker/daemon.json

# 迁移数据（可选）
sudo rsync -aP /var/lib/docker/ /new/path/to/docker

# 重启 Docker
sudo systemctl start docker

# 验证
docker info | grep "Docker Root Dir"
```

---

## 五、Docker 镜像命令

### 5.1 搜索镜像

```bash
docker search nginx                          # 搜索镜像
docker search --limit 5 nginx                # 限制结果数量
docker search --filter is-official=true nginx  # 搜索官方镜像
docker search --filter stars=100 nginx       # 搜索星标数大于 100 的镜像
```

### 5.2 拉取镜像

```bash
docker pull nginx                            # 拉取最新版本
docker pull nginx:1.25.3                     # 拉取指定版本
docker pull --platform linux/amd64 nginx     # 拉取指定平台镜像
```

### 5.3 查看镜像

```bash
docker images                                # 列出所有镜像
docker image ls                              # 同上
docker image inspect nginx                   # 查看镜像详细信息
docker history nginx                         # 查看镜像历史
docker images -q                             # 只显示镜像 ID
docker images -f dangling=true               # 显示悬空镜像
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"  # 格式化输出
```

### 5.4 删除镜像

```bash
docker rmi nginx:latest                      # 删除指定镜像
docker rmi -f nginx:latest                   # 强制删除
docker rmi nginx:1.25 nginx:1.24             # 删除多个镜像
docker rmi $(docker images -q)               # 删除所有镜像
docker image prune                           # 删除悬空镜像
docker image prune -a                        # 删除所有未使用的镜像
docker image prune -a --filter "until=24h"   # 删除 24 小时前的镜像
```

### 5.5 导出和导入镜像

```bash
docker save -o nginx.tar nginx:latest        # 导出镜像
docker save -o images.tar nginx:latest mysql:8.0  # 导出多个镜像
docker load -i nginx.tar                     # 导入镜像
docker load < nginx.tar                      # 从标准输入导入
```

### 5.6 镜像标签管理

```bash
docker tag nginx:latest myregistry.com/nginx:v1.0  # 打标签
docker push myregistry.com/nginx:v1.0       # 推送镜像
docker login                                 # 登录镜像仓库
docker login myregistry.com                  # 登录指定仓库
docker logout                                # 登出
```

---

## 六、Docker 容器命令

### 6.1 创建和运行容器

```bash
# 基本运行
docker run nginx                             # 运行容器
docker run -d nginx                          # 后台运行
docker run -d --name my-nginx nginx          # 指定容器名称
docker run -it ubuntu /bin/bash              # 交互式运行
docker run --rm nginx                        # 运行后自动删除
docker run -d --name web -p 80:80 nginx      # 端口映射

# 常用参数
-d                          # 后台运行
-it                         # 交互式终端
--name 容器名               # 指定容器名称
-p 主机端口:容器端口        # 端口映射
-P                          # 随机映射所有暴露的端口
-v 主机路径:容器路径        # 挂载数据卷
-v 卷名:容器路径            # 使用命名卷
--mount                     # 更详细的挂载方式
-e 变量名=值                # 设置环境变量
--env-file 文件路径         # 从文件读取环境变量
--rm                        # 容器退出后自动删除
--restart                   # 重启策略（no/on-failure/always/unless-stopped）
--memory 内存限制           # 限制内存使用（如 1g, 512m）
--memory-swap               # 内存+交换空间总限制
--cpus 数量                 # 限制 CPU 使用（如 1.5）
--cpu-shares 权重           # CPU 权重（默认 1024）
--network 网络名            # 指定网络
--hostname 主机名           # 设置容器主机名
--dns DNS服务器             # 设置 DNS 服务器
-w 工作目录                 # 设置工作目录
-u 用户名或UID              # 指定运行用户
--privileged                # 特权模式
```

### 6.2 查看容器

```bash
docker ps                                    # 查看运行中的容器
docker ps -a                                 # 查看所有容器
docker ps -q                                 # 只显示容器 ID
docker ps -l                                 # 查看最近创建的容器
docker ps -n 5                               # 查看最近创建的 5 个容器
docker ps -s                                 # 显示容器大小
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"  # 格式化输出
docker ps --filter "name=my-nginx"           # 过滤容器
docker ps --filter "status=running"          # 过滤运行中的容器
docker inspect 容器名/ID                     # 查看容器详细信息
docker port 容器名/ID                        # 查看端口映射
docker top 容器名/ID                         # 查看容器进程
docker stats 容器名/ID                       # 查看资源使用统计
docker stats                                 # 实时监控所有容器
docker diff 容器名/ID                        # 查看文件系统变化
```

### 6.3 启动、停止和重启容器

```bash
docker start 容器名/ID                       # 启动容器
docker start 容器1 容器2 容器3               # 启动多个容器
docker stop 容器名/ID                        # 停止容器
docker kill 容器名/ID                        # 强制停止容器
docker restart 容器名/ID                     # 重启容器
docker pause 容器名/ID                       # 暂停容器
docker unpause 容器名/ID                     # 恢复容器
docker wait 容器名/ID                        # 等待容器停止
```

### 6.4 删除容器

```bash
docker rm 容器名/ID                          # 删除已停止的容器
docker rm -f 容器名/ID                       # 强制删除运行中的容器
docker rm 容器1 容器2 容器3                  # 删除多个容器
docker rm $(docker ps -aq -f status=exited)  # 删除所有已停止的容器
docker rm -f $(docker ps -aq)                # 删除所有容器（危险）
docker container prune                       # 清理已停止的容器
docker container prune -f                    # 不提示确认
docker container prune --filter "until=24h"  # 删除 24 小时前停止的容器
```

### 6.5 进入容器

```bash
docker exec -it 容器名/ID /bin/bash          # 进入容器（推荐）
docker exec -it 容器名/ID /bin/sh            # 使用 sh
docker exec -it -u root 容器名/ID /bin/bash  # 以 root 用户进入
docker exec 容器名/ID ls -la /app            # 执行单个命令
docker attach 容器名/ID                      # 附加到容器（不推荐）
```

### 6.6 查看容器日志

```bash
docker logs 容器名/ID                        # 查看日志
docker logs -f 容器名/ID                     # 实时跟踪日志
docker logs --tail 100 容器名/ID             # 查看最后 100 行
docker logs --since 2023-01-01 容器名/ID     # 查看指定时间后的日志
docker logs --since 30m 容器名/ID            # 查看最近 30 分钟的日志
docker logs --until 2023-12-31 容器名/ID     # 查看指定时间前的日志
docker logs -t 容器名/ID                     # 显示时间戳
docker logs -f --tail 50 -t 容器名/ID        # 组合使用
```

### 6.7 容器与主机之间复制文件

```bash
docker cp /path/on/host 容器名/ID:/path/in/container  # 主机 → 容器
docker cp 容器名/ID:/path/in/container /path/on/host  # 容器 → 主机
docker cp /local/dir 容器名/ID:/container/dir         # 复制目录
```

### 6.8 容器重启策略

```bash
# 重启策略：
# no              - 不自动重启（默认）
# on-failure      - 容器非正常退出时重启
# on-failure:3    - 最多重启 3 次
# always          - 总是重启
# unless-stopped  - 总是重启，除非手动停止

docker run -d --restart unless-stopped nginx  # 创建时指定
docker update --restart unless-stopped 容器名/ID  # 修改重启策略
docker update --restart always 容器1 容器2    # 修改多个容器
```

### 6.9 容器资源限制

```bash
docker run -d --memory 512m nginx            # 限制内存
docker run -d --memory 1g --memory-swap 2g nginx  # 限制内存和交换空间
docker run -d --cpus 1.5 nginx               # 限制 CPU
docker run -d --cpu-shares 512 nginx         # CPU 权重
docker run -d --cpuset-cpus 0,1 nginx        # 指定 CPU 核心
docker run -d --pids-limit 100 nginx         # 限制进程数
docker update --memory 1g --cpus 2 容器名/ID  # 更新资源限制
```

---

## 七、Docker 网络命令

### 7.1 网络管理

```bash
docker network ls                            # 列出所有网络
docker network inspect bridge                # 查看网络详细信息
docker network create my-network             # 创建网络
docker network create --subnet=172.18.0.0/16 my-network  # 指定子网
docker network create --driver bridge my-network  # 指定驱动
docker network rm my-network                 # 删除网络
docker network prune                         # 清理未使用的网络
docker network prune -f                      # 不提示确认
```

### 7.2 连接容器到网络

```bash
docker run -d --name web --network my-network nginx  # 创建时指定网络
docker network connect my-network 容器名/ID  # 连接容器到网络
docker network connect --ip 172.18.0.10 my-network 容器名/ID  # 指定 IP
docker network disconnect my-network 容器名/ID  # 断开网络连接
docker network disconnect -f my-network 容器名/ID  # 强制断开
```

---

## 八、Docker 数据卷命令

### 8.1 数据卷管理

```bash
docker volume create my-volume               # 创建数据卷
docker volume ls                             # 列出所有数据卷
docker volume inspect my-volume              # 查看数据卷详情
docker volume rm my-volume                   # 删除数据卷
docker volume prune                          # 清理未使用的数据卷
docker volume prune -f                       # 不提示确认
```

### 8.2 使用数据卷

```bash
docker run -d -v my-volume:/app/data nginx   # 使用命名卷
docker run -d -v /app/data nginx             # 使用匿名卷
docker run -d -v /host/path:/container/path nginx  # 绑定挂载
docker run -d -v my-volume:/app/data:ro nginx  # 只读挂载
docker run -d --mount type=volume,source=my-volume,target=/app/data nginx  # 使用 --mount
```

---

## 九、Docker Compose 命令

### 9.1 基本命令

```bash
docker compose version                       # 查看版本
docker compose up                            # 启动服务（前台）
docker compose up -d                         # 后台启动服务
docker compose up -d --build                 # 构建并启动
docker compose up -d --force-recreate        # 强制重新创建容器
docker compose down                          # 停止并删除容器、网络
docker compose down -v                       # 同时删除数据卷
docker compose down --rmi all                # 同时删除镜像
docker compose start                         # 启动服务
docker compose stop                          # 停止服务
docker compose restart                       # 重启服务
docker compose pause                         # 暂停服务
docker compose unpause                       # 恢复服务
```

### 9.2 查看和管理

```bash
docker compose ps                            # 查看服务状态
docker compose ps -a                         # 查看所有容器
docker compose logs                          # 查看日志
docker compose logs -f                       # 实时跟踪日志
docker compose logs -f web                   # 查看指定服务日志
docker compose logs --tail 100               # 查看最后 100 行
docker compose exec web /bin/bash            # 进入服务容器
docker compose run web npm install           # 运行一次性命令
docker compose run --rm web npm test         # 运行后删除容器
docker compose config                        # 查看配置
docker compose config --quiet                # 验证配置
docker compose images                        # 列出镜像
docker compose pull                          # 拉取服务镜像
docker compose build                         # 构建服务镜像
docker compose build --no-cache              # 不使用缓存构建
docker compose top                           # 查看服务进程
docker compose stats                         # 查看资源使用
docker compose port web 3000                 # 查看服务端口
docker compose up -d --scale web=3           # 扩展服务实例
docker compose rm                            # 删除停止的容器
docker compose rm -f                         # 强制删除
```

---

## 十、Docker 系统命令

### 10.1 系统信息

```bash
docker info                                  # 显示系统信息
docker version                               # 显示版本信息
docker system df                             # 显示磁盘使用
docker system df -v                          # 详细显示磁盘使用
docker events                                # 查看系统事件
docker events --filter 'type=container'      # 过滤事件
```

### 10.2 清理资源

```bash
docker system prune                          # 清理未使用的资源
docker system prune -f                       # 不提示确认
docker system prune -a --volumes             # 包括数据卷
docker system prune --filter "until=24h"     # 清理 24 小时前的资源
docker container prune                       # 只清理容器
docker image prune                           # 只清理镜像
docker image prune -a                        # 清理所有未使用的镜像
docker network prune                         # 只清理网络
docker volume prune                          # 只清理数据卷
docker builder prune                         # 清理构建缓存
```

### 10.3 导出和导入

```bash
docker export 容器名/ID > container.tar      # 导出容器
docker export -o container.tar 容器名/ID     # 导出容器
docker import container.tar myimage:tag      # 导入容器为镜像
docker save -o images.tar image1 image2      # 导出镜像
docker load -i images.tar                    # 导入镜像
docker commit 容器名/ID new-image:tag        # 提交容器为镜像
docker commit -m "message" -a "author" 容器名/ID new-image:tag  # 带信息提交
```

---

## 十一、Docker 命令速查表

### 11.1 容器生命周期

```bash
docker run          # 创建并运行容器
docker start        # 启动容器
docker stop         # 停止容器
docker restart      # 重启容器
docker kill         # 强制停止容器
docker rm           # 删除容器
docker pause        # 暂停容器
docker unpause      # 恢复容器
docker create       # 创建容器但不启动
docker exec         # 在运行的容器中执行命令
docker attach       # 附加到运行的容器
```

### 11.2 容器操作

```bash
docker ps           # 列出容器
docker inspect      # 查看详情
docker top          # 查看进程
docker logs         # 查看日志
docker port         # 查看端口映射
docker stats        # 查看资源使用
docker diff         # 查看文件系统变化
docker cp           # 复制文件
docker export       # 导出容器
docker commit       # 提交容器为镜像
docker wait         # 等待容器停止
docker update       # 更新容器配置
docker rename       # 重命名容器
```

### 11.3 镜像管理

```bash
docker images       # 列出镜像
docker pull         # 拉取镜像
docker push         # 推送镜像
docker rmi          # 删除镜像
docker tag          # 标记镜像
docker build        # 构建镜像
docker history      # 查看镜像历史
docker save         # 导出镜像
docker load         # 导入镜像
docker import       # 导入容器快照为镜像
docker search       # 搜索镜像
docker image prune  # 清理未使用镜像
```

### 11.4 网络管理

```bash
docker network ls           # 列出网络
docker network create       # 创建网络
docker network rm           # 删除网络
docker network inspect      # 查看网络详情
docker network connect      # 连接容器到网络
docker network disconnect   # 断开容器网络连接
docker network prune        # 清理未使用网络
```

### 11.5 数据卷管理

```bash
docker volume ls        # 列出数据卷
docker volume create    # 创建数据卷
docker volume rm        # 删除数据卷
docker volume inspect   # 查看数据卷详情
docker volume prune     # 清理未使用数据卷
```

### 11.6 系统管理

```bash
docker info             # 显示系统信息
docker version          # 显示版本信息
docker system df        # 显示磁盘使用
docker system prune     # 清理未使用资源
docker system events    # 查看系统事件
docker login            # 登录镜像仓库
docker logout           # 登出镜像仓库
```

---

## 十二、相关文档

如果你需要在 Docker 中部署特定的数据库或服务，请参考以下文档：

- [在 Docker 中部署 MySQL](../百科全书/在Docker中部署MySQL.md)
- [在 Docker 中部署 MongoDB](../百科全书/在Docker中部署MongoDB.md)
- [在 Docker 中部署 Redis](../百科全书/在Docker中部署Redis.md)
- [在 Docker 中部署 Redis](../百科全书/在Docker中部署Redis.md)

---

## 总结

本文详细介绍了 Docker 的安装方法和常用命令，涵盖了：

1. **安装配置**：Ubuntu 和 CentOS 系统的安装方法、镜像加速配置
2. **镜像管理**：搜索、拉取、查看、删除、导入导出镜像
3. **容器管理**：创建、启动、停止、删除容器，资源限制
4. **网络管理**：网络创建、容器互联
5. **数据卷管理**：数据持久化
6. **Docker Compose**：多容器应用编排
7. **系统管理**：系统信息、资源清理

掌握这些命令，你就可以熟练使用 Docker 进行应用容器化部署了。
