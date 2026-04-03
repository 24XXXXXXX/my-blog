---
title: "在 Docker 中部署 Redis"
description: "详细介绍如何在 Docker 中部署 Redis 数据库，包括目录准备、配置文件设置、容器创建和使用方法"
keywords: "Docker,Redis,数据库,容器化,Redis配置"

date: 2026-03-26T11:20:00+08:00
lastmod: 2026-03-26T11:20:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Docker
  - Redis
  - 数据库
---

本文详细介绍如何在 Docker 中部署 Redis 数据库，包括数据持久化准备、配置文件设置、容器创建和使用方法。

<!--more-->

## 一、数据持久化准备工作

在创建容器之前，建议（但不是必须）提前创建好本地映射目录和配置文件。Docker 会自动创建不存在的目录，但提前准备可以避免权限问题。

### 两种方式对比

1. **不提前创建**：Docker 会自动创建目录，但可能以 root 权限创建，导致权限问题
2. **提前创建**（推荐）：可以设置正确的权限，避免后续问题

### 权限说明

- **所有者（Owner）**：设置为容器内运行数据库的用户 UID（Redis 使用 999）
- **目录权限**：通常设置为 755（rwxr-xr-x），允许所有者读写执行，其他用户只读和执行
- **文件权限**：配置文件通常设置为 644（rw-r--r--），允许所有者读写，其他用户只读

---

## 二、准备目录和配置文件

### 2.1 Linux 系统准备

```bash
# 创建目录结构
sudo mkdir -p /data/redis/{conf,data,logs}

# 设置所有者（Redis 容器使用 UID 999）
sudo chown -R 999:999 /data/redis

# 设置目录权限
sudo chmod -R 755 /data/redis

# 下载官方配置文件模板（可选）
wget https://raw.githubusercontent.com/redis/redis/7.2/redis.conf -O /tmp/redis.conf
sudo cp /tmp/redis.conf /data/redis/conf/redis.conf

# 或创建自定义配置文件
sudo tee /data/redis/conf/redis.conf <<EOF
# Redis 配置文件

# ========== 网络设置 ==========
# 绑定地址（0.0.0.0 允许所有连接）
bind 0.0.0.0

# 保护模式（关闭以允许远程连接）
protected-mode no

# 端口
port 6379

# TCP 连接队列长度
tcp-backlog 511

# 客户端超时时间（秒，0 表示禁用）
timeout 0

# TCP keepalive（秒）
tcp-keepalive 300

# ========== 通用设置 ==========
# 后台运行（Docker 中必须设置为 no）
daemonize no

# 进程管理
supervised no

# PID 文件
pidfile /var/run/redis_6379.pid

# 日志级别（debug/verbose/notice/warning）
loglevel notice

# 日志文件
logfile /var/log/redis/redis.log

# 数据库数量
databases 16

# 启动时显示 logo
always-show-logo no

# ========== 持久化设置 ==========
# RDB 快照设置
save 900 1      # 900 秒内至少 1 个键变化
save 300 10     # 300 秒内至少 10 个键变化
save 60 10000   # 60 秒内至少 10000 个键变化

# RDB 文件名
dbfilename dump.rdb

# 数据目录
dir /data

# RDB 压缩
rdbcompression yes

# RDB 校验
rdbchecksum yes

# AOF 持久化
appendonly yes
appendfilename "appendonly.aof"

# AOF 同步策略（always/everysec/no）
appendfsync everysec

# AOF 重写
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# ========== 安全设置 ==========
# 密码认证
# 设置访问密码，强烈建议在生产环境中启用
# 密码要求：建议使用复杂密码，包含大小写字母、数字和特殊字符
requirepass my-redis-password

# 注意：
# 1. 修改密码后需要重启 Redis 才能生效
# 2. 客户端连接时需要使用 AUTH 命令或 -a 参数提供密码
# 3. 如果不设置密码，注释掉此行即可（不推荐）

# 禁用危险命令
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""

# ========== 内存管理 ==========
# 最大内存限制
maxmemory 512mb

# 内存淘汰策略
# noeviction: 不淘汰，写入返回错误
# allkeys-lru: 所有键 LRU 淘汰
# volatile-lru: 设置过期时间的键 LRU 淘汰
# allkeys-random: 所有键随机淘汰
# volatile-random: 设置过期时间的键随机淘汰
# volatile-ttl: 淘汰最近过期的键
maxmemory-policy allkeys-lru

# 淘汰样本数
maxmemory-samples 5

# ========== 性能优化 ==========
# 慢查询日志
slowlog-log-slower-than 10000
slowlog-max-len 128

# 客户端输出缓冲区限制
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60

# ========== 高级设置 ==========
# 哈希表优化
hash-max-ziplist-entries 512
hash-max-ziplist-value 64

# 列表优化
list-max-ziplist-size -2
list-compress-depth 0

# 集合优化
set-max-intset-entries 512

# 有序集合优化
zset-max-ziplist-entries 128
zset-max-ziplist-value 64

# HyperLogLog 优化
hll-sparse-max-bytes 3000

# 流优化
stream-node-max-bytes 4096
stream-node-max-entries 100

# 活跃碎片整理
activedefrag yes
active-defrag-ignore-bytes 100mb
active-defrag-threshold-lower 10
active-defrag-threshold-upper 100
active-defrag-cycle-min 1
active-defrag-cycle-max 25
EOF
```

### 2.2 Windows 系统准备

```powershell
# 创建目录结构
New-Item -ItemType Directory -Force -Path D:\docker-data\redis\conf
New-Item -ItemType Directory -Force -Path D:\docker-data\redis\data
New-Item -ItemType Directory -Force -Path D:\docker-data\redis\logs

# 创建配置文件
@"
bind 0.0.0.0
protected-mode no
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300

daemonize no
supervised no
pidfile /var/run/redis_6379.pid
loglevel notice
logfile /var/log/redis/redis.log
databases 16

save 900 1
save 300 10
save 60 10000
dbfilename dump.rdb
dir /data
rdbcompression yes
rdbchecksum yes

appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

requirepass my-redis-password

maxmemory 512mb
maxmemory-policy allkeys-lru
maxmemory-samples 5

slowlog-log-slower-than 10000
slowlog-max-len 128
"@ | Out-File -FilePath D:\docker-data\redis\conf\redis.conf -Encoding utf8
```

---

## 三、创建并运行容器

### 3.1 使用配置文件运行（推荐）

#### Linux 路径示例

```bash
docker run --name my-redis \
  --memory 1g --memory-swap 1.5g \
  --restart unless-stopped \
  -v /data/redis/conf:/etc/redis \
  -v /data/redis/data:/data \
  -v /data/redis/logs:/var/log/redis \
  -p 6379:6379 \
  -d redis:7.2.5 redis-server /etc/redis/redis.conf
```

#### Windows 路径示例

```powershell
docker run --name my-redis `
  --memory 1g --memory-swap 1.5g `
  --restart unless-stopped `
  -v D:\docker-data\redis\conf:/etc/redis `
  -v D:\docker-data\redis\data:/data `
  -v D:\docker-data\redis\logs:/var/log/redis `
  -p 6379:6379 `
  -d redis:7.2.5 redis-server /etc/redis/redis.conf
```

### 3.2 不使用配置文件运行（简单方式）

```bash
docker run --name my-redis \
  --restart unless-stopped \
  -v /data/redis/data:/data \
  -p 6379:6379 \
  -d redis:7.2.5 \
  --requirepass my-redis-password \
  --appendonly yes
```

### 3.3 参数说明

- `--name my-redis`：容器名称
- `--memory 1g`：限制内存使用为 1GB
- `--memory-swap 1.5g`：内存+交换空间总限制
- `--restart unless-stopped`：自动重启策略
- `-v`：挂载数据卷，实现数据持久化
- `-p 6379:6379`：端口映射
- `-d`：后台运行
- `redis-server /etc/redis/redis.conf`：使用配置文件启动
- `--requirepass`：设置密码（命令行方式）
- `--appendonly yes`：启用 AOF 持久化（命令行方式）
- `redis:7.2.5`：镜像名称和版本

---

## 四、验证和使用

### 4.1 查看容器日志

```bash
# 查看容器日志
docker logs my-redis

# 实时跟踪日志
docker logs -f my-redis
```

### 4.2 进入容器

```bash
# 进入容器
docker exec -it my-redis bash
```

### 4.3 使用 redis-cli 连接

```bash
# 使用 redis-cli 连接（需要密码）
docker exec -it my-redis redis-cli -a my-redis-password

# 或先连接再认证
docker exec -it my-redis redis-cli
AUTH my-redis-password
```

### 4.4 基本操作

在 redis-cli 中执行：

```bash
# 测试连接
PING

# 设置键值
SET mykey "Hello Redis"
GET mykey

# 设置带过期时间的键
SETEX tempkey 60 "This will expire in 60 seconds"
TTL tempkey

# 列表操作
LPUSH mylist "item1"
LPUSH mylist "item2"
LRANGE mylist 0 -1

# 哈希操作
HSET user:1 name "John"
HSET user:1 age 30
HGETALL user:1

# 集合操作
SADD myset "member1"
SADD myset "member2"
SMEMBERS myset

# 有序集合操作
ZADD myzset 1 "one"
ZADD myzset 2 "two"
ZRANGE myzset 0 -1 WITHSCORES

# 查看所有键
KEYS *

# 查看数据库信息
INFO
INFO stats
INFO memory

# 查看慢查询日志
SLOWLOG GET 10

# 查看客户端连接
CLIENT LIST
```

### 4.5 从主机连接

需要安装 redis-cli：

```bash
# Ubuntu
sudo apt install redis-tools

# CentOS
sudo yum install redis

# macOS
brew install redis

# 连接
redis-cli -h 127.0.0.1 -p 6379 -a my-redis-password
```

---

## 五、Redis 配置文件详解

### 5.1 网络配置

```conf
# 绑定地址
# 0.0.0.0 允许所有 IP 连接
# 127.0.0.1 仅本地连接
# 多个地址用空格分隔
bind 0.0.0.0

# 保护模式
# yes: 仅允许本地连接（除非设置了密码或 bind）
# no: 允许远程连接
protected-mode no

# 监听端口
port 6379

# TCP 连接队列长度
tcp-backlog 511

# 客户端空闲超时时间（秒，0 表示禁用）
timeout 0

# TCP keepalive 时间（秒）
tcp-keepalive 300

# 最大客户端连接数（0 表示无限制）
maxclients 10000
```

### 5.2 持久化配置

#### RDB 快照

```conf
# RDB 快照触发条件
# save <seconds> <changes>
save 900 1      # 900 秒内至少 1 个键变化
save 300 10     # 300 秒内至少 10 个键变化
save 60 10000   # 60 秒内至少 10000 个键变化

# 禁用 RDB（注释掉所有 save 行或使用）
# save ""

# RDB 文件名
dbfilename dump.rdb

# 数据目录
dir /data

# RDB 压缩（建议开启）
rdbcompression yes

# RDB 校验（建议开启）
rdbchecksum yes

# 后台保存失败时停止写入
stop-writes-on-bgsave-error yes
```

#### AOF 持久化

```conf
# 启用 AOF
appendonly yes

# AOF 文件名
appendfilename "appendonly.aof"

# AOF 同步策略
# always: 每次写入都同步（最安全但最慢）
# everysec: 每秒同步一次（推荐）
# no: 由操作系统决定（最快但可能丢失数据）
appendfsync everysec

# AOF 重写时不进行 fsync
no-appendfsync-on-rewrite no

# AOF 自动重写触发条件
auto-aof-rewrite-percentage 100  # AOF 文件增长 100% 时重写
auto-aof-rewrite-min-size 64mb   # AOF 文件最小 64MB 时才重写

# AOF 加载时容错
aof-load-truncated yes

# 使用 RDB-AOF 混合持久化（Redis 4.0+）
aof-use-rdb-preamble yes
```

### 5.3 内存管理

```conf
# 最大内存限制
maxmemory 512mb

# 内存淘汰策略
# noeviction: 不淘汰，内存满时写入返回错误
# allkeys-lru: 对所有键使用 LRU 算法淘汰
# volatile-lru: 对设置了过期时间的键使用 LRU 淘汰
# allkeys-random: 随机淘汰所有键
# volatile-random: 随机淘汰设置了过期时间的键
# volatile-ttl: 淘汰最近要过期的键
# allkeys-lfu: 对所有键使用 LFU 算法淘汰（Redis 4.0+）
# volatile-lfu: 对设置了过期时间的键使用 LFU 淘汰（Redis 4.0+）
maxmemory-policy allkeys-lru

# LRU/LFU 算法样本数（越大越精确但越慢）
maxmemory-samples 5

# 惰性删除（Redis 4.0+）
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
```

### 5.4 安全配置

#### 密码认证

```conf
# 设置访问密码
requirepass my-redis-password

# 密码设置说明：
# 1. 生产环境必须设置强密码
# 2. 密码建议包含：大小写字母、数字、特殊字符
# 3. 密码长度建议至少 16 位
# 4. 定期更换密码

# 示例：强密码
# requirepass "MyRedis@2024!Secure#Password"
```

**密码使用方法：**

```bash
# 方法 1：连接时提供密码
redis-cli -h localhost -p 6379 -a my-redis-password

# 方法 2：连接后认证
redis-cli -h localhost -p 6379
AUTH my-redis-password

# 方法 3：Docker 容器内连接
docker exec -it my-redis redis-cli -a my-redis-password

# 方法 4：在应用程序中使用
# Python: redis.Redis(password='my-redis-password')
# Java: jedis.auth("my-redis-password")
# Node.js: createClient({password: 'my-redis-password'})
```

**修改密码：**

```bash
# 方法 1：通过命令行修改（临时，重启后失效）
docker exec my-redis redis-cli -a old-password CONFIG SET requirepass new-password

# 方法 2：修改配置文件（永久）
# 1. 编辑配置文件
sudo vim /data/redis/conf/redis.conf
# 2. 修改 requirepass 行
requirepass new-password
# 3. 重启容器
docker restart my-redis

# 方法 3：使用环境变量（Docker 启动时）
docker run -e REDIS_PASSWORD=my-password redis
```

**禁用密码（不推荐）：**

```conf
# 注释掉 requirepass 行
# requirepass my-redis-password

# 或者设置为空
# requirepass ""
```

#### 命令重命名和禁用

```conf
# 禁用危险命令（设置为空字符串）
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
rename-command KEYS ""
rename-command SHUTDOWN ""

# 重命名命令（提高安全性）
rename-command CONFIG "CONFIG_REDIS_2024"
rename-command SHUTDOWN "SHUTDOWN_REDIS_2024"
rename-command FLUSHDB "FLUSHDB_REDIS_2024"

# 使用重命名后的命令
# redis-cli -a password CONFIG_REDIS_2024 GET requirepass
```

#### ACL 访问控制列表（Redis 6.0+）

```conf
# 启用 ACL 配置文件
aclfile /etc/redis/users.acl
```

创建 ACL 配置文件 `/data/redis/conf/users.acl`：

```conf
# 默认用户（禁用）
user default off

# 管理员用户（所有权限）
user admin on >admin-password ~* &* +@all

# 只读用户
user readonly on >readonly-password ~* &* +@read -@write -@dangerous

# 应用用户（限制命令和键）
user app on >app-password ~app:* &* +@all -@dangerous -@admin

# 监控用户（只能查看信息）
user monitor on >monitor-password ~* &* +@read +info +ping +client +cluster +slowlog
```

**ACL 命令使用：**

```bash
# 查看所有用户
ACL LIST

# 查看当前用户
ACL WHOAMI

# 创建用户
ACL SETUSER newuser on >password ~* +@all

# 删除用户
ACL DELUSER username

# 查看用户权限
ACL GETUSER username

# 保存 ACL 到文件
ACL SAVE

# 从文件加载 ACL
ACL LOAD
```

### 5.5 日志配置

```conf
# 日志级别
# debug: 大量信息，适合开发/测试
# verbose: 较多信息
# notice: 适度信息，适合生产环境
# warning: 仅重要/关键信息
loglevel notice

# 日志文件路径（空字符串表示标准输出）
logfile /var/log/redis/redis.log

# 慢查询日志
# 执行时间超过此值（微秒）的命令会被记录
slowlog-log-slower-than 10000

# 慢查询日志最大长度
slowlog-max-len 128
```

### 5.6 性能优化

```conf
# 数据结构优化
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64

# 活跃碎片整理（Redis 4.0+）
activedefrag yes
active-defrag-ignore-bytes 100mb
active-defrag-threshold-lower 10
active-defrag-threshold-upper 100
active-defrag-cycle-min 1
active-defrag-cycle-max 25

# 客户端输出缓冲区限制
# client-output-buffer-limit <class> <hard limit> <soft limit> <soft seconds>
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60

# 后台任务频率（1-500，值越大 CPU 占用越高但延迟越低）
hz 10
```

---

## 六、数据备份和恢复

### 6.1 RDB 备份

```bash
# 手动触发 RDB 快照
docker exec my-redis redis-cli -a my-redis-password BGSAVE

# 查看最后一次保存时间
docker exec my-redis redis-cli -a my-redis-password LASTSAVE

# 复制 RDB 文件到主机
docker cp my-redis:/data/dump.rdb ./redis-backup-$(date +%Y%m%d).rdb

# 备份整个数据目录
tar -czf redis-data-backup-$(date +%Y%m%d).tar.gz /data/redis/data
```

### 6.2 AOF 备份

```bash
# 触发 AOF 重写
docker exec my-redis redis-cli -a my-redis-password BGREWRITEAOF

# 复制 AOF 文件到主机
docker cp my-redis:/data/appendonly.aof ./redis-aof-backup-$(date +%Y%m%d).aof
```

### 6.3 恢复数据

```bash
# 停止容器
docker stop my-redis

# 恢复 RDB 文件
docker cp ./redis-backup.rdb my-redis:/data/dump.rdb

# 或恢复 AOF 文件
docker cp ./redis-aof-backup.aof my-redis:/data/appendonly.aof

# 设置正确的权限
docker exec my-redis chown redis:redis /data/dump.rdb
docker exec my-redis chown redis:redis /data/appendonly.aof

# 启动容器
docker start my-redis
```

### 6.4 自动备份脚本

```bash
#!/bin/bash
# redis-backup.sh

BACKUP_DIR="/backup/redis"
CONTAINER_NAME="my-redis"
REDIS_PASSWORD="my-redis-password"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 触发 RDB 快照
docker exec $CONTAINER_NAME redis-cli -a $REDIS_PASSWORD BGSAVE

# 等待快照完成
sleep 5

# 复制 RDB 文件
docker cp $CONTAINER_NAME:/data/dump.rdb $BACKUP_DIR/dump_$DATE.rdb

# 复制 AOF 文件
docker cp $CONTAINER_NAME:/data/appendonly.aof $BACKUP_DIR/appendonly_$DATE.aof

# 压缩备份
tar -czf $BACKUP_DIR/redis_backup_$DATE.tar.gz -C $BACKUP_DIR dump_$DATE.rdb appendonly_$DATE.aof

# 删除临时文件
rm $BACKUP_DIR/dump_$DATE.rdb $BACKUP_DIR/appendonly_$DATE.aof

# 删除 7 天前的备份
find $BACKUP_DIR -name "redis_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: redis_backup_$DATE.tar.gz"
```

添加到 crontab：

```bash
# 每天凌晨 2 点备份
0 2 * * * /path/to/redis-backup.sh >> /var/log/redis-backup.log 2>&1
```

---

## 七、监控和性能分析

### 7.1 查看服务器信息

```bash
# 查看所有信息
docker exec my-redis redis-cli -a my-redis-password INFO

# 查看特定部分
docker exec my-redis redis-cli -a my-redis-password INFO server
docker exec my-redis redis-cli -a my-redis-password INFO clients
docker exec my-redis redis-cli -a my-redis-password INFO memory
docker exec my-redis redis-cli -a my-redis-password INFO persistence
docker exec my-redis redis-cli -a my-redis-password INFO stats
docker exec my-redis redis-cli -a my-redis-password INFO replication
docker exec my-redis redis-cli -a my-redis-password INFO cpu
docker exec my-redis redis-cli -a my-redis-password INFO keyspace
```

### 7.2 监控命令

```bash
# 实时监控所有命令
docker exec -it my-redis redis-cli -a my-redis-password MONITOR

# 查看慢查询日志
docker exec my-redis redis-cli -a my-redis-password SLOWLOG GET 10
docker exec my-redis redis-cli -a my-redis-password SLOWLOG LEN
docker exec my-redis redis-cli -a my-redis-password SLOWLOG RESET

# 查看客户端连接
docker exec my-redis redis-cli -a my-redis-password CLIENT LIST

# 查看统计信息
docker exec my-redis redis-cli -a my-redis-password --stat

# 查看内存使用
docker exec my-redis redis-cli -a my-redis-password MEMORY STATS
docker exec my-redis redis-cli -a my-redis-password MEMORY DOCTOR

# 查看键空间信息
docker exec my-redis redis-cli -a my-redis-password --bigkeys
docker exec my-redis redis-cli -a my-redis-password --memkeys

# 查看延迟
docker exec my-redis redis-cli -a my-redis-password --latency
docker exec my-redis redis-cli -a my-redis-password --latency-history
```

### 7.3 性能测试

```bash
# 基准测试
docker exec my-redis redis-benchmark -h localhost -p 6379 -a my-redis-password -c 50 -n 10000

# 测试特定命令
docker exec my-redis redis-benchmark -h localhost -p 6379 -a my-redis-password -t set,get -n 100000 -q

# 测试管道性能
docker exec my-redis redis-benchmark -h localhost -p 6379 -a my-redis-password -n 1000000 -t set,get -P 16 -q
```

---

## 八、常见问题

### 8.1 容器无法启动

```bash
# 查看日志
docker logs my-redis

# 常见原因：
# 1. 端口被占用
# 2. 配置文件语法错误
# 3. 数据目录权限问题
# 4. 内存不足

# 检查端口占用
netstat -tuln | grep 6379
# 或
lsof -i :6379
```

#### 权限问题排查和解决

```bash
# 检查目录权限
ls -la /data/redis

# 检查目录所有者
stat /data/redis/data

# 如果权限不正确，重新设置
sudo chown -R 999:999 /data/redis
sudo chmod -R 755 /data/redis

# 确保数据目录可写
sudo chmod 755 /data/redis/data

# 检查配置文件权限
ls -l /data/redis/conf/redis.conf
sudo chmod 644 /data/redis/conf/redis.conf

# 重启容器
docker restart my-redis
```

### 8.2 无法连接 Redis

```bash
# 检查容器是否运行
docker ps | grep my-redis

# 检查端口映射
docker port my-redis

# 测试连接
docker exec my-redis redis-cli -a my-redis-password PING

# 检查防火墙
sudo ufw status
sudo firewall-cmd --list-ports
```

### 8.3 认证失败

```bash
# 检查密码配置
docker exec my-redis redis-cli CONFIG GET requirepass

# 重新设置密码
docker exec my-redis redis-cli CONFIG SET requirepass new-password

# 或修改配置文件后重启容器
docker restart my-redis
```

### 8.4 内存占用过高

```bash
# 查看内存使用
docker exec my-redis redis-cli -a my-redis-password INFO memory

# 查看大键
docker exec my-redis redis-cli -a my-redis-password --bigkeys

# 手动清理过期键
docker exec my-redis redis-cli -a my-redis-password --scan --pattern "*" | xargs docker exec my-redis redis-cli -a my-redis-password DEL

# 清空数据库（谨慎使用）
docker exec my-redis redis-cli -a my-redis-password FLUSHDB
docker exec my-redis redis-cli -a my-redis-password FLUSHALL
```

### 8.5 持久化问题

```bash
# 检查 RDB 状态
docker exec my-redis redis-cli -a my-redis-password INFO persistence

# 检查 AOF 状态
docker exec my-redis redis-cli -a my-redis-password CONFIG GET appendonly

# 修复 AOF 文件
docker exec my-redis redis-check-aof --fix /data/appendonly.aof

# 检查 RDB 文件
docker exec my-redis redis-check-rdb /data/dump.rdb
```

### 8.6 性能优化建议

```bash
# 1. 使用管道批量操作
# 2. 避免使用 KEYS 命令，使用 SCAN 代替
# 3. 合理设置过期时间
# 4. 使用连接池
# 5. 启用持久化时选择合适的策略
# 6. 监控慢查询日志
# 7. 合理设置 maxmemory 和淘汰策略
# 8. 使用 Redis Cluster 进行水平扩展
```

---

## 九、Docker Compose 部署

### 9.1 单机部署

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  redis:
    image: redis:7.2.5
    container_name: my-redis
    restart: unless-stopped
    command: redis-server /etc/redis/redis.conf
    ports:
      - "6379:6379"
    volumes:
      - ./redis/conf:/etc/redis
      - ./redis/data:/data
      - ./redis/logs:/var/log/redis
    deploy:
      resources:
        limits:
          memory: 1g
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "my-redis-password", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
```

启动：

```bash
docker compose up -d
```

### 9.2 主从复制部署

```yaml
version: '3.8'

services:
  redis-master:
    image: redis:7.2.5
    container_name: redis-master
    restart: unless-stopped
    command: redis-server --requirepass master-password --masterauth master-password
    ports:
      - "6379:6379"
    volumes:
      - redis-master-data:/data

  redis-slave1:
    image: redis:7.2.5
    container_name: redis-slave1
    restart: unless-stopped
    command: redis-server --slaveof redis-master 6379 --requirepass slave-password --masterauth master-password
    ports:
      - "6380:6379"
    volumes:
      - redis-slave1-data:/data
    depends_on:
      - redis-master

  redis-slave2:
    image: redis:7.2.5
    container_name: redis-slave2
    restart: unless-stopped
    command: redis-server --slaveof redis-master 6379 --requirepass slave-password --masterauth master-password
    ports:
      - "6381:6379"
    volumes:
      - redis-slave2-data:/data
    depends_on:
      - redis-master

volumes:
  redis-master-data:
  redis-slave1-data:
  redis-slave2-data:
```

### 9.3 Redis Sentinel 高可用部署

```yaml
version: '3.8'

services:
  redis-master:
    image: redis:7.2.5
    container_name: redis-master
    command: redis-server --requirepass redis-password --masterauth redis-password
    ports:
      - "6379:6379"
    volumes:
      - redis-master-data:/data

  redis-slave1:
    image: redis:7.2.5
    container_name: redis-slave1
    command: redis-server --slaveof redis-master 6379 --requirepass redis-password --masterauth redis-password
    ports:
      - "6380:6379"
    volumes:
      - redis-slave1-data:/data
    depends_on:
      - redis-master

  redis-slave2:
    image: redis:7.2.5
    container_name: redis-slave2
    command: redis-server --slaveof redis-master 6379 --requirepass redis-password --masterauth redis-password
    ports:
      - "6381:6379"
    volumes:
      - redis-slave2-data:/data
    depends_on:
      - redis-master

  sentinel1:
    image: redis:7.2.5
    container_name: sentinel1
    command: redis-sentinel /etc/redis/sentinel.conf
    ports:
      - "26379:26379"
    volumes:
      - ./sentinel1.conf:/etc/redis/sentinel.conf
    depends_on:
      - redis-master

  sentinel2:
    image: redis:7.2.5
    container_name: sentinel2
    command: redis-sentinel /etc/redis/sentinel.conf
    ports:
      - "26380:26379"
    volumes:
      - ./sentinel2.conf:/etc/redis/sentinel.conf
    depends_on:
      - redis-master

  sentinel3:
    image: redis:7.2.5
    container_name: sentinel3
    command: redis-sentinel /etc/redis/sentinel.conf
    ports:
      - "26381:26379"
    volumes:
      - ./sentinel3.conf:/etc/redis/sentinel.conf
    depends_on:
      - redis-master

volumes:
  redis-master-data:
  redis-slave1-data:
  redis-slave2-data:
```

Sentinel 配置文件 `sentinel.conf`：

```conf
port 26379
dir /tmp
sentinel monitor mymaster redis-master 6379 2
sentinel auth-pass mymaster redis-password
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 10000
```

---

## 十、Redis Cluster 集群部署

### 10.1 创建集群配置

```yaml
version: '3.8'

services:
  redis-node1:
    image: redis:7.2.5
    container_name: redis-node1
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --port 6379
    ports:
      - "6379:6379"
      - "16379:16379"
    volumes:
      - redis-node1-data:/data

  redis-node2:
    image: redis:7.2.5
    container_name: redis-node2
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --port 6379
    ports:
      - "6380:6379"
      - "16380:16379"
    volumes:
      - redis-node2-data:/data

  redis-node3:
    image: redis:7.2.5
    container_name: redis-node3
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --port 6379
    ports:
      - "6381:6379"
      - "16381:16379"
    volumes:
      - redis-node3-data:/data

  redis-node4:
    image: redis:7.2.5
    container_name: redis-node4
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --port 6379
    ports:
      - "6382:6379"
      - "16382:16379"
    volumes:
      - redis-node4-data:/data

  redis-node5:
    image: redis:7.2.5
    container_name: redis-node5
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --port 6379
    ports:
      - "6383:6379"
      - "16383:16379"
    volumes:
      - redis-node5-data:/data

  redis-node6:
    image: redis:7.2.5
    container_name: redis-node6
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --port 6379
    ports:
      - "6384:6379"
      - "16384:16379"
    volumes:
      - redis-node6-data:/data

volumes:
  redis-node1-data:
  redis-node2-data:
  redis-node3-data:
  redis-node4-data:
  redis-node5-data:
  redis-node6-data:
```

### 10.2 初始化集群

```bash
# 启动所有节点
docker compose up -d

# 创建集群（3 主 3 从）
docker exec -it redis-node1 redis-cli --cluster create \
  172.18.0.2:6379 \
  172.18.0.3:6379 \
  172.18.0.4:6379 \
  172.18.0.5:6379 \
  172.18.0.6:6379 \
  172.18.0.7:6379 \
  --cluster-replicas 1

# 查看集群信息
docker exec -it redis-node1 redis-cli cluster info
docker exec -it redis-node1 redis-cli cluster nodes
```

---

## 十一、应用程序连接示例

### 11.1 Python 连接

```python
import redis

# 单机连接
r = redis.Redis(
    host='localhost',
    port=6379,
    password='my-redis-password',
    db=0,
    decode_responses=True
)

# 测试连接
r.set('key', 'value')
print(r.get('key'))

# 使用连接池
pool = redis.ConnectionPool(
    host='localhost',
    port=6379,
    password='my-redis-password',
    db=0,
    max_connections=10
)
r = redis.Redis(connection_pool=pool)
```

### 11.2 Java 连接（Jedis）

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class RedisExample {
    public static void main(String[] args) {
        // 单机连接
        Jedis jedis = new Jedis("localhost", 6379);
        jedis.auth("my-redis-password");
        jedis.set("key", "value");
        System.out.println(jedis.get("key"));
        jedis.close();

        // 使用连接池
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(10);
        poolConfig.setMaxIdle(5);
        poolConfig.setMinIdle(1);

        JedisPool pool = new JedisPool(poolConfig, "localhost", 6379, 2000, "my-redis-password");
        
        try (Jedis j = pool.getResource()) {
            j.set("key", "value");
            System.out.println(j.get("key"));
        }
        
        pool.close();
    }
}
```

### 11.3 Node.js 连接

```javascript
const redis = require('redis');

// 单机连接
const client = redis.createClient({
    host: 'localhost',
    port: 6379,
    password: 'my-redis-password'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

await client.set('key', 'value');
const value = await client.get('key');
console.log(value);

await client.disconnect();
```

### 11.4 Go 连接

```go
package main

import (
    "context"
    "fmt"
    "github.com/go-redis/redis/v8"
)

func main() {
    ctx := context.Background()

    // 单机连接
    rdb := redis.NewClient(&redis.Options{
        Addr:     "localhost:6379",
        Password: "my-redis-password",
        DB:       0,
    })

    err := rdb.Set(ctx, "key", "value", 0).Err()
    if err != nil {
        panic(err)
    }

    val, err := rdb.Get(ctx, "key").Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("key", val)
}
```

### 11.5 PHP 连接

```php
<?php
$redis = new Redis();
$redis->connect('localhost', 6379);
$redis->auth('my-redis-password');

$redis->set('key', 'value');
echo $redis->get('key');

$redis->close();
?>
```

---

## 十二、安全加固建议

### 12.1 网络安全

```conf
# 1. 限制绑定地址
bind 127.0.0.1 192.168.1.100

# 2. 启用保护模式
protected-mode yes

# 3. 使用防火墙限制访问
# Ubuntu/Debian
sudo ufw allow from 192.168.1.0/24 to any port 6379

# CentOS/RHEL
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" port protocol="tcp" port="6379" accept'
sudo firewall-cmd --reload
```

### 12.2 认证和授权

#### 密码策略

```conf
# 1. 设置强密码
requirepass "Complex@Password123!@#"

# 强密码要求：
# - 长度至少 16 位
# - 包含大写字母（A-Z）
# - 包含小写字母（a-z）
# - 包含数字（0-9）
# - 包含特殊字符（!@#$%^&*）
# - 避免使用常见密码或字典词汇
# - 定期更换（建议每 3-6 个月）

# 密码示例：
# requirepass "MyRedis@2024!Secure#Pass"
# requirepass "Prod_Redis_2024$Strong!"
# requirepass "Cache@Server#2024!Pwd"
```

#### 密码管理最佳实践

```bash
# 1. 使用环境变量存储密码
export REDIS_PASSWORD="your-secure-password"
redis-cli -a "$REDIS_PASSWORD"

# 2. 使用密码文件
echo "your-secure-password" > ~/.redis_password
chmod 600 ~/.redis_password
redis-cli -a $(cat ~/.redis_password)

# 3. 在 Docker 中使用 secrets
docker secret create redis_password password.txt
docker service create --secret redis_password redis

# 4. 使用配置管理工具
# - Ansible Vault
# - HashiCorp Vault
# - AWS Secrets Manager
# - Azure Key Vault
```

#### ACL 访问控制（Redis 6.0+）

```conf
# 2. 使用 ACL（Redis 6.0+）
# 创建 ACL 配置文件
# /data/redis/conf/users.acl

# 禁用默认用户（提高安全性）
user default off

# 管理员用户（完全权限）
user admin on >Admin@2024!Strong ~* &* +@all

# 只读用户（只能读取数据）
user readonly on >ReadOnly@2024!Pass ~* &* +@read -@write -@dangerous

# 应用用户（限制键空间和命令）
user app on >App@2024!Secure ~app:* &* +@all -@dangerous -@admin

# 监控用户（只能查看状态）
user monitor on >Monitor@2024!View ~* &* +info +ping +client +slowlog

# 在 redis.conf 中启用
aclfile /etc/redis/users.acl
```

#### 连接示例

```bash
# 使用密码连接
redis-cli -h localhost -p 6379 -a "your-password"

# 使用 ACL 用户连接
redis-cli -h localhost -p 6379 --user admin --pass "Admin@2024!Strong"

# 在应用程序中使用
# Python
import redis
r = redis.Redis(
    host='localhost',
    port=6379,
    password='your-password',
    username='app'  # Redis 6.0+ ACL
)

# Java
Jedis jedis = new Jedis("localhost", 6379);
jedis.auth("app", "App@2024!Secure");  // Redis 6.0+ ACL

# Node.js
const client = redis.createClient({
    host: 'localhost',
    port: 6379,
    password: 'your-password',
    username: 'app'  // Redis 6.0+ ACL
});
```

### 12.3 命令限制

```conf
# 禁用危险命令
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
rename-command KEYS ""
rename-command SHUTDOWN ""
rename-command DEBUG ""
rename-command BGSAVE ""
rename-command BGREWRITEAOF ""
rename-command SAVE ""

# 或重命名命令
rename-command CONFIG "CONFIG_REDIS_ADMIN_2024"
```

### 12.4 TLS/SSL 加密

```conf
# 启用 TLS
port 0
tls-port 6379
tls-cert-file /etc/redis/redis.crt
tls-key-file /etc/redis/redis.key
tls-ca-cert-file /etc/redis/ca.crt
tls-auth-clients no
```

### 12.5 其他安全建议

1. 定期更新 Redis 版本
2. 使用非默认端口
3. 启用持久化和定期备份
4. 监控异常访问和慢查询
5. 限制最大连接数
6. 使用 Docker 网络隔离
7. 定期审计日志

---

## 十三、相关文档

- [Docker 安装和命令](../环境搭建和项目部署/docker安装和命令.md)
- [在 Docker 中部署 MySQL](./在Docker中部署MySQL.md)
- [在 Docker 中部署 MongoDB](./在Docker中部署MongoDB.md)

---

## 总结

本文详细介绍了在 Docker 中部署 Redis 的完整流程，包括：

1. 数据持久化准备工作
2. 目录和配置文件创建
3. 容器创建和运行
4. 验证和使用方法
5. 配置文件详解（网络、持久化、内存、安全、日志、性能）
6. 数据备份和恢复
7. 监控和性能分析
8. 常见问题解决
9. Docker Compose 部署（单机、主从、Sentinel）
10. Redis Cluster 集群部署
11. 应用程序连接示例（Python、Java、Node.js、Go、PHP）
12. 安全加固建议

通过本文，你可以快速在 Docker 中部署一个生产可用的 Redis 数据库，并根据实际需求选择合适的部署架构（单机、主从复制、Sentinel 高可用、Cluster 集群）。
