---
title: "在 Docker 中部署 MySQL"
description: "详细介绍如何在 Docker 中部署 MySQL 数据库，包括目录准备、配置文件设置、容器创建和使用方法"
keywords: "Docker,MySQL,数据库,容器化,MySQL配置"

date: 2026-03-26T11:10:00+08:00
lastmod: 2026-03-26T11:10:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Docker
  - MySQL
  - 数据库
---

本文详细介绍如何在 Docker 中部署 MySQL 数据库，包括数据持久化准备、配置文件设置、容器创建和使用方法。

<!--more-->

## 一、数据持久化准备工作

在创建容器之前，建议（但不是必须）提前创建好本地映射目录和配置文件。Docker 会自动创建不存在的目录，但提前准备可以避免权限问题。

### 两种方式对比

1. **不提前创建**：Docker 会自动创建目录，但可能以 root 权限创建，导致权限问题
2. **提前创建**（推荐）：可以设置正确的权限，避免后续问题

### 权限说明

- **所有者（Owner）**：设置为容器内运行数据库的用户 UID（MySQL 使用 999）
- **目录权限**：通常设置为 755（rwxr-xr-x），允许所有者读写执行，其他用户只读和执行
- **文件权限**：配置文件通常设置为 644（rw-r--r--），允许所有者读写，其他用户只读

---

## 二、准备目录和配置文件

### 2.1 Linux 系统准备

```bash
# 创建目录结构
sudo mkdir -p /data/mysql/{conf.d,data,logs,mysql-files}

# 设置所有者（MySQL 容器使用 UID 999）
sudo chown -R 999:999 /data/mysql

# 设置目录权限
sudo chmod -R 755 /data/mysql

# 创建自定义配置文件（可选）
sudo tee /data/mysql/conf.d/my.cnf <<EOF
[mysqld]
# 字符集设置
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 连接设置
max_connections=200
max_connect_errors=100

# 缓存设置
innodb_buffer_pool_size=256M
innodb_log_file_size=64M

# 日志设置
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2

# 时区设置
default-time-zone='+08:00'

# 二进制日志（可选，用于主从复制）
# server-id=1
# log-bin=mysql-bin
# binlog_format=ROW

[client]
default-character-set=utf8mb4
EOF
```

### 2.2 Windows 系统准备

```powershell
# 创建目录结构
New-Item -ItemType Directory -Force -Path D:\docker-data\mysql\conf.d
New-Item -ItemType Directory -Force -Path D:\docker-data\mysql\data
New-Item -ItemType Directory -Force -Path D:\docker-data\mysql\logs
New-Item -ItemType Directory -Force -Path D:\docker-data\mysql\mysql-files

# 创建配置文件
@"
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
max_connections=200
innodb_buffer_pool_size=256M
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2
default-time-zone='+08:00'

[client]
default-character-set=utf8mb4
"@ | Out-File -FilePath D:\docker-data\mysql\conf.d\my.cnf -Encoding utf8
```

---

## 三、创建并运行容器

### 3.1 Linux 路径示例

```bash
docker run --name my-mysql \
  --memory 1g --memory-swap 1.5g \
  --restart unless-stopped \
  -v /data/mysql/conf.d:/etc/mysql/conf.d \
  -v /data/mysql/data:/var/lib/mysql \
  -v /data/mysql/logs:/var/log/mysql \
  -v /data/mysql/mysql-files:/var/lib/mysql-files \
  -e MYSQL_ROOT_PASSWORD=my-password \
  -e MYSQL_DATABASE=mydb \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -d mysql:8.0.37
```

### 3.2 Windows 路径示例

```powershell
docker run --name my-mysql `
  --memory 1g --memory-swap 1.5g `
  --restart unless-stopped `
  -v D:\docker-data\mysql\conf.d:/etc/mysql/conf.d `
  -v D:\docker-data\mysql\data:/var/lib/mysql `
  -v D:\docker-data\mysql\logs:/var/log/mysql `
  -v D:\docker-data\mysql\mysql-files:/var/lib/mysql-files `
  -e MYSQL_ROOT_PASSWORD=my-password `
  -e MYSQL_DATABASE=mydb `
  -e MYSQL_USER=myuser `
  -e MYSQL_PASSWORD=mypassword `
  -p 3307:3306 `
  -d mysql:8.0.37
```

### 3.3 参数说明

- `--name my-mysql`：容器名称
- `--memory 1g`：限制内存使用为 1GB
- `--memory-swap 1.5g`：内存+交换空间总限制
- `--restart unless-stopped`：自动重启策略
- `-v`：挂载数据卷，实现数据持久化
- `-e MYSQL_ROOT_PASSWORD`：设置 root 密码（必需）
- `-e MYSQL_DATABASE`：创建初始数据库（可选）
- `-e MYSQL_USER`：创建初始用户（可选）
- `-e MYSQL_PASSWORD`：初始用户密码（可选）
- `-p 3306:3306`：端口映射
- `-d`：后台运行
- `mysql:8.0.37`：镜像名称和版本

---

## 四、验证和使用

### 4.1 查看容器日志

```bash
# 查看容器日志
docker logs my-mysql

# 实时跟踪日志
docker logs -f my-mysql
```

### 4.2 进入容器

```bash
# 进入容器
docker exec -it my-mysql bash

# 连接 MySQL
docker exec -it my-mysql mysql -uroot -p
```

### 4.3 验证配置

在 MySQL 中执行以下命令验证配置：

```sql
-- 查看字符集设置
SHOW VARIABLES LIKE 'character%';
SHOW VARIABLES LIKE 'collation%';

-- 查看用户
SELECT user, host FROM mysql.user;

-- 查看数据库
SHOW DATABASES;
```

### 4.4 从主机连接

需要安装 MySQL 客户端：

```bash
# Linux
sudo apt install mysql-client

# 连接
mysql -h 127.0.0.1 -P 3306 -u root -p
```

### 4.5 创建额外的数据库和用户

```bash
docker exec -it my-mysql mysql -uroot -p -e "
CREATE DATABASE IF NOT EXISTS mydb2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'user2'@'%' IDENTIFIED BY 'password2';
GRANT ALL PRIVILEGES ON mydb2.* TO 'user2'@'%';
FLUSH PRIVILEGES;
"
```

---

## 五、MySQL 配置文件详解

### 5.1 完整配置文件示例

```ini
# /data/mysql/conf.d/my.cnf

[mysqld]
# ========== 基本设置 ==========
# 数据目录（容器内路径，不需要修改）
datadir=/var/lib/mysql

# 套接字文件
socket=/var/run/mysqld/mysqld.sock

# 进程 ID 文件
pid-file=/var/run/mysqld/mysqld.pid

# ========== 字符集设置 ==========
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'

# ========== 网络设置 ==========
# 监听地址（0.0.0.0 允许外部连接）
bind-address=0.0.0.0

# 端口
port=3306

# 最大连接数
max_connections=200

# 最大错误连接数
max_connect_errors=100

# 连接超时时间（秒）
wait_timeout=28800
interactive_timeout=28800

# ========== 性能优化 ==========
# InnoDB 缓冲池大小（建议设置为物理内存的 50-80%）
innodb_buffer_pool_size=256M

# InnoDB 日志文件大小
innodb_log_file_size=64M

# InnoDB 日志缓冲区大小
innodb_log_buffer_size=8M

# InnoDB 刷新日志策略（1=最安全但慢，2=较快但可能丢失数据）
innodb_flush_log_at_trx_commit=1

# 表缓存
table_open_cache=2000

# 临时表大小
tmp_table_size=64M
max_heap_table_size=64M

# 排序缓冲区
sort_buffer_size=2M

# 连接缓冲区
join_buffer_size=2M

# ========== 日志设置 ==========
# 错误日志
log-error=/var/log/mysql/error.log

# 慢查询日志
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2

# 记录没有使用索引的查询
log_queries_not_using_indexes=0

# 通用查询日志（生产环境不建议开启）
# general_log=1
# general_log_file=/var/log/mysql/general.log

# ========== 二进制日志（主从复制）==========
# 服务器 ID（主从复制必须）
# server-id=1

# 二进制日志
# log-bin=mysql-bin
# binlog_format=ROW
# expire_logs_days=7
# max_binlog_size=100M

# ========== 安全设置 ==========
# 禁用本地文件加载
local_infile=0

# SQL 模式
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# ========== 时区设置 ==========
default-time-zone='+08:00'

[client]
# 客户端默认字符集
default-character-set=utf8mb4

# 套接字
socket=/var/run/mysqld/mysqld.sock

[mysql]
# MySQL 命令行工具字符集
default-character-set=utf8mb4
```

### 5.2 关键参数说明

#### 字符集设置
- `character-set-server=utf8mb4`：服务器默认字符集
- `collation-server=utf8mb4_unicode_ci`：默认排序规则

#### 性能参数
- `innodb_buffer_pool_size`：InnoDB 缓冲池大小，建议设置为物理内存的 50-80%
- `max_connections`：最大连接数，根据实际需求调整
- `innodb_flush_log_at_trx_commit`：
  - `1`：最安全，每次事务提交都写入磁盘
  - `2`：较快，每秒写入一次磁盘
  - `0`：最快，但可能丢失数据

#### 日志设置
- `slow_query_log`：启用慢查询日志
- `long_query_time`：慢查询阈值（秒）
- `log-error`：错误日志路径

---

## 六、数据备份和恢复

### 6.1 备份数据库

```bash
# 备份单个数据库
docker exec my-mysql mysqldump -uroot -p mydb > mydb_backup.sql

# 备份所有数据库
docker exec my-mysql mysqldump -uroot -p --all-databases > all_databases_backup.sql

# 备份数据库结构（不包含数据）
docker exec my-mysql mysqldump -uroot -p --no-data mydb > mydb_structure.sql

# 备份数据（不包含结构）
docker exec my-mysql mysqldump -uroot -p --no-create-info mydb > mydb_data.sql
```

### 6.2 恢复数据库

```bash
# 恢复数据库
docker exec -i my-mysql mysql -uroot -p mydb < mydb_backup.sql

# 恢复所有数据库
docker exec -i my-mysql mysql -uroot -p < all_databases_backup.sql
```

### 6.3 备份数据文件

```bash
# 停止容器
docker stop my-mysql

# 备份数据目录
tar -czf mysql-data-backup-$(date +%Y%m%d).tar.gz /data/mysql/data

# 启动容器
docker start my-mysql
```

---

## 七、常见问题

### 7.1 容器无法启动

```bash
# 查看日志
docker logs my-mysql

# 常见原因：
# 1. 端口被占用
# 2. 数据目录权限问题
# 3. 配置文件语法错误
```

#### 权限问题排查和解决

```bash
# 检查目录权限
ls -la /data/mysql

# 检查目录所有者
stat /data/mysql/data

# 如果权限不正确，重新设置
sudo chown -R 999:999 /data/mysql
sudo chmod -R 755 /data/mysql

# 确保数据目录可写
sudo chmod 755 /data/mysql/data

# 检查配置文件权限
ls -l /data/mysql/conf.d/my.cnf
sudo chmod 644 /data/mysql/conf.d/my.cnf

# 重启容器
docker restart my-mysql
```

### 7.2 无法远程连接

```sql
-- 检查用户权限
SELECT user, host FROM mysql.user;

-- 创建允许远程连接的用户
CREATE USER 'myuser'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'%';
FLUSH PRIVILEGES;
```

### 7.3 字符集问题

```sql
-- 查看字符集
SHOW VARIABLES LIKE 'character%';

-- 修改数据库字符集
ALTER DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改表字符集
ALTER TABLE mytable CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 7.4 性能优化

```sql
-- 查看慢查询
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- 查看连接数
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';

-- 查看缓冲池使用情况
SHOW STATUS LIKE 'Innodb_buffer_pool%';
```

---

## 八、Docker Compose 部署

如果需要使用 Docker Compose 部署，可以创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0.37
    container_name: my-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: my-password
      MYSQL_DATABASE: mydb
      MYSQL_USER: myuser
      MYSQL_PASSWORD: mypassword
    ports:
      - "3306:3306"
    volumes:
      - ./mysql/conf.d:/etc/mysql/conf.d
      - ./mysql/data:/var/lib/mysql
      - ./mysql/logs:/var/log/mysql
      - ./mysql/mysql-files:/var/lib/mysql-files
    deploy:
      resources:
        limits:
          memory: 1g
```

启动：

```bash
docker compose up -d
```

---

## 总结

本文详细介绍了在 Docker 中部署 MySQL 的完整流程，包括：

1. 数据持久化准备工作
2. 目录和配置文件创建
3. 容器创建和运行
4. 验证和使用方法
5. 配置文件详解
6. 数据备份和恢复
7. 常见问题解决
8. Docker Compose 部署

通过本文，你可以快速在 Docker 中部署一个生产可用的 MySQL 数据库。
