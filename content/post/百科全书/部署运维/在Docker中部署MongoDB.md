---
title: "在 Docker 中部署 MongoDB"
description: "详细介绍如何在 Docker 中部署 MongoDB 数据库，包括目录准备、配置文件设置、容器创建和使用方法"
keywords: "Docker,MongoDB,数据库,容器化,MongoDB配置"

date: 2026-03-26T11:15:00+08:00
lastmod: 2026-03-26T11:15:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Docker
  - MongoDB
  - 数据库
---

本文详细介绍如何在 Docker 中部署 MongoDB 数据库，包括数据持久化准备、配置文件设置、容器创建和使用方法。

<!--more-->

## 一、数据持久化准备工作

在创建容器之前，建议（但不是必须）提前创建好本地映射目录和配置文件。Docker 会自动创建不存在的目录，但提前准备可以避免权限问题。

### 两种方式对比

1. **不提前创建**：Docker 会自动创建目录，但可能以 root 权限创建，导致权限问题
2. **提前创建**（推荐）：可以设置正确的权限，避免后续问题

### 权限说明

- **所有者（Owner）**：设置为容器内运行数据库的用户 UID（MongoDB 使用 999）
- **目录权限**：通常设置为 755（rwxr-xr-x），允许所有者读写执行，其他用户只读和执行
- **文件权限**：配置文件通常设置为 644（rw-r--r--），允许所有者读写，其他用户只读

---

## 二、准备目录和配置文件

### 2.1 Linux 系统准备

```bash
# 创建目录结构
sudo mkdir -p /data/mongo/{conf,data,logs}

# 设置所有者（MongoDB 容器使用 UID 999）
sudo chown -R 999:999 /data/mongo

# 设置目录权限
sudo chmod -R 755 /data/mongo

# 创建配置文件
sudo tee /data/mongo/conf/mongod.conf <<EOF
# MongoDB 配置文件

# 网络设置
net:
  port: 27017
  bindIp: 0.0.0.0  # 允许所有 IP 连接（生产环境建议限制）

# 存储设置
storage:
  dbPath: /data/db
  journal:
    enabled: true
  # 存储引擎
  engine: wiredTiger
  wiredTiger:
    engineConfig:
      # 缓存大小（建议设置为物理内存的 50%）
      cacheSizeGB: 0.5

# 日志设置
systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true
  logRotate: reopen

# 进程管理
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

# 安全设置
security:
  authorization: enabled

# 操作分析
operationProfiling:
  mode: slowOp
  slowOpThresholdMs: 100
EOF
```

### 2.2 Windows 系统准备

```powershell
# 创建目录结构
New-Item -ItemType Directory -Force -Path D:\docker-data\mongo\conf
New-Item -ItemType Directory -Force -Path D:\docker-data\mongo\data
New-Item -ItemType Directory -Force -Path D:\docker-data\mongo\logs

# 创建配置文件
@"
net:
  port: 27017
  bindIp: 0.0.0.0

storage:
  dbPath: /data/db
  journal:
    enabled: true
  engine: wiredTiger
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5

systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true
  logRotate: reopen

processManagement:
  timeZoneInfo: /usr/share/zoneinfo

security:
  authorization: enabled
"@ | Out-File -FilePath D:\docker-data\mongo\conf\mongod.conf -Encoding utf8
```

---

## 三、创建并运行容器

### 3.1 使用配置文件运行（推荐）

#### Linux 路径示例

```bash
docker run --name my-mongo \
  --memory 1g --memory-swap 1.5g \
  --restart unless-stopped \
  -v /data/mongo/conf:/etc/mongo \
  -v /data/mongo/data:/data/db \
  -v /data/mongo/logs:/var/log/mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=my-password \
  -p 27017:27017 \
  -d mongo:7.0.14 --config /etc/mongo/mongod.conf
```

#### Windows 路径示例

```powershell
docker run --name my-mongo `
  --memory 1g --memory-swap 1.5g `
  --restart unless-stopped `
  -v D:\docker-data\mongo\conf:/etc/mongo `
  -v D:\docker-data\mongo\data:/data/db `
  -v D:\docker-data\mongo\logs:/var/log/mongodb `
  -e MONGO_INITDB_ROOT_USERNAME=admin `
  -e MONGO_INITDB_ROOT_PASSWORD=my-password `
  -p 27017:27017 `
  -d mongo:7.0.14 --config /etc/mongo/mongod.conf
```

### 3.2 不使用配置文件运行（简单方式）

```bash
docker run --name my-mongo \
  --restart unless-stopped \
  -v /data/mongo/data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=my-password \
  -p 27017:27017 \
  -d mongo:7.0.14
```

### 3.3 参数说明

- `--name my-mongo`：容器名称
- `--memory 1g`：限制内存使用为 1GB
- `--memory-swap 1.5g`：内存+交换空间总限制
- `--restart unless-stopped`：自动重启策略
- `-v`：挂载数据卷，实现数据持久化
- `-e MONGO_INITDB_ROOT_USERNAME`：设置管理员用户名
- `-e MONGO_INITDB_ROOT_PASSWORD`：设置管理员密码
- `-p 27017:27017`：端口映射
- `-d`：后台运行
- `--config /etc/mongo/mongod.conf`：指定配置文件
- `mongo:7.0.14`：镜像名称和版本

---

## 四、验证和使用

### 4.1 查看容器日志

```bash
# 查看容器日志
docker logs my-mongo

# 实时跟踪日志
docker logs -f my-mongo
```

### 4.2 进入容器

```bash
# 进入容器
docker exec -it my-mongo bash
```

### 4.3 使用 mongosh 连接（MongoDB 6.0+）

```bash
# 使用 mongosh 连接
docker exec -it my-mongo mongosh -u admin -p my-password --authenticationDatabase admin

# 或使用旧版 mongo shell（MongoDB 5.x 及以下）
docker exec -it my-mongo mongo -u admin -p my-password --authenticationDatabase admin
```

### 4.4 基本操作

在 MongoDB shell 中执行：

```javascript
// 查看数据库
show dbs

// 创建新数据库和用户
use mydb
db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: [
    { role: "readWrite", db: "mydb" }
  ]
})

// 测试插入数据
db.test.insertOne({ name: "test", value: 123 })
db.test.find()

// 查看集合
show collections

// 查看用户
db.getUsers()

// 查看当前数据库状态
db.stats()
```

### 4.5 从主机连接

需要安装 mongosh：

```bash
# 安装 mongosh（Ubuntu）
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-mongosh

# 连接
mongosh "mongodb://admin:my-password@localhost:27017/admin"
```

---

## 五、MongoDB 配置文件详解

### 5.1 完整配置文件示例

```yaml
# /data/mongo/conf/mongod.conf

# ========== 网络设置 ==========
net:
  # 监听端口
  port: 27017
  
  # 绑定 IP（0.0.0.0 允许所有连接，生产环境建议指定 IP）
  bindIp: 0.0.0.0
  
  # 最大连接数
  maxIncomingConnections: 65536
  
  # 启用 IPv6
  # ipv6: true
  
  # 启用 TLS/SSL
  # tls:
  #   mode: requireTLS
  #   certificateKeyFile: /etc/ssl/mongodb.pem
  #   CAFile: /etc/ssl/ca.pem

# ========== 存储设置 ==========
storage:
  # 数据目录
  dbPath: /data/db
  
  # 启用日志
  journal:
    enabled: true
    commitIntervalMs: 100
  
  # 存储引擎（wiredTiger 或 inMemory）
  engine: wiredTiger
  
  # WiredTiger 引擎配置
  wiredTiger:
    engineConfig:
      # 缓存大小（GB），建议设置为物理内存的 50%
      cacheSizeGB: 0.5
      
      # 日志压缩
      journalCompressor: snappy
      
      # 目录前缀
      # directoryForIndexes: true
    
    collectionConfig:
      # 块压缩算法（snappy/zlib/zstd/none）
      blockCompressor: snappy
    
    indexConfig:
      # 索引前缀压缩
      prefixCompression: true

# ========== 日志设置 ==========
systemLog:
  # 日志输出方式（file 或 syslog）
  destination: file
  
  # 日志文件路径
  path: /var/log/mongodb/mongod.log
  
  # 追加模式
  logAppend: true
  
  # 日志轮转方式（rename 或 reopen）
  logRotate: reopen
  
  # 日志级别（0-5，0 最少，5 最详细）
  verbosity: 0
  
  # 组件日志级别
  # component:
  #   accessControl:
  #     verbosity: 2
  #   command:
  #     verbosity: 1

# ========== 进程管理 ==========
processManagement:
  # 时区信息目录
  timeZoneInfo: /usr/share/zoneinfo
  
  # 后台运行（Docker 中不需要）
  # fork: true
  
  # PID 文件
  # pidFilePath: /var/run/mongodb/mongod.pid

# ========== 安全设置 ==========
security:
  # 启用认证
  authorization: enabled
  
  # 密钥文件（用于副本集认证）
  # keyFile: /etc/mongo/keyfile
  
  # 启用加密（企业版功能）
  # enableEncryption: true
  # encryptionKeyFile: /etc/mongo/encryption.key
  # encryptionCipherMode: AES256-CBC

# ========== 操作分析 ==========
operationProfiling:
  # 分析模式（off/slowOp/all）
  mode: slowOp
  
  # 慢操作阈值（毫秒）
  slowOpThresholdMs: 100
  
  # 慢操作采样率（0.0-1.0）
  slowOpSampleRate: 1.0

# ========== 复制集设置 ==========
# replication:
#   # 复制集名称
#   replSetName: "rs0"
#   
#   # oplog 大小（MB）
#   oplogSizeMB: 1024
#   
#   # 启用多数写关注
#   enableMajorityReadConcern: true

# ========== 分片设置 ==========
# sharding:
#   # 集群角色（configsvr/shardsvr）
#   clusterRole: shardsvr

# ========== 其他设置 ==========
# setParameter:
#   # 启用免费监控
#   enableFreeMonitoring: true
#   
#   # 诊断数据收集
#   diagnosticDataCollectionEnabled: true
```

### 5.2 关键参数说明

#### 网络设置
- `bindIp: 0.0.0.0`：允许所有 IP 连接（生产环境建议限制）
- `port: 27017`：默认端口
- `maxIncomingConnections`：最大连接数

#### 存储设置
- `dbPath`：数据存储路径
- `engine: wiredTiger`：存储引擎
- `cacheSizeGB`：缓存大小，建议设置为物理内存的 50%
- `blockCompressor: snappy`：压缩算法

#### 安全设置
- `authorization: enabled`：启用认证
- `keyFile`：副本集认证密钥文件

#### 性能优化
- `operationProfiling.mode: slowOp`：记录慢操作
- `slowOpThresholdMs: 100`：慢操作阈值（毫秒）

---

## 六、用户和权限管理

### 6.1 创建用户

```javascript
// 切换到 admin 数据库
use admin

// 创建管理员用户
db.createUser({
  user: "admin",
  pwd: "admin-password",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" }
  ]
})

// 创建普通数据库用户
use mydb
db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: [
    { role: "readWrite", db: "mydb" }
  ]
})

// 创建只读用户
db.createUser({
  user: "readonly",
  pwd: "readonly-password",
  roles: [
    { role: "read", db: "mydb" }
  ]
})
```

### 6.2 常用角色

- `read`：只读权限
- `readWrite`：读写权限
- `dbAdmin`：数据库管理权限
- `userAdmin`：用户管理权限
- `clusterAdmin`：集群管理权限
- `readAnyDatabase`：所有数据库只读
- `readWriteAnyDatabase`：所有数据库读写
- `userAdminAnyDatabase`：所有数据库用户管理
- `dbAdminAnyDatabase`：所有数据库管理

### 6.3 修改用户

```javascript
// 修改密码
db.changeUserPassword("myuser", "new-password")

// 更新用户角色
db.updateUser("myuser", {
  roles: [
    { role: "readWrite", db: "mydb" },
    { role: "read", db: "otherdb" }
  ]
})

// 删除用户
db.dropUser("myuser")

// 查看用户
db.getUsers()
show users
```

---

## 七、数据备份和恢复

### 7.1 使用 mongodump 备份

```bash
# 备份所有数据库
docker exec my-mongo mongodump -u admin -p my-password --authenticationDatabase admin --out /data/backup

# 备份指定数据库
docker exec my-mongo mongodump -u admin -p my-password --authenticationDatabase admin --db mydb --out /data/backup

# 备份指定集合
docker exec my-mongo mongodump -u admin -p my-password --authenticationDatabase admin --db mydb --collection mycollection --out /data/backup

# 复制备份到主机
docker cp my-mongo:/data/backup ./mongo-backup-$(date +%Y%m%d)
```

### 7.2 使用 mongorestore 恢复

```bash
# 恢复所有数据库
docker exec my-mongo mongorestore -u admin -p my-password --authenticationDatabase admin /data/backup

# 恢复指定数据库
docker exec my-mongo mongorestore -u admin -p my-password --authenticationDatabase admin --db mydb /data/backup/mydb

# 从主机复制备份到容器
docker cp ./mongo-backup my-mongo:/data/backup

# 恢复
docker exec my-mongo mongorestore -u admin -p my-password --authenticationDatabase admin /data/backup
```

### 7.3 备份数据文件

```bash
# 停止容器
docker stop my-mongo

# 备份数据目录
tar -czf mongo-data-backup-$(date +%Y%m%d).tar.gz /data/mongo/data

# 启动容器
docker start my-mongo
```

---

## 八、常见问题

### 8.1 容器无法启动

```bash
# 查看日志
docker logs my-mongo

# 常见原因：
# 1. 端口被占用
# 2. 数据目录权限问题
# 3. 配置文件语法错误
# 4. 内存不足
```

#### 权限问题排查和解决

```bash
# 检查目录权限
ls -la /data/mongo

# 检查目录所有者
stat /data/mongo/data

# 如果权限不正确，重新设置
sudo chown -R 999:999 /data/mongo
sudo chmod -R 755 /data/mongo

# 确保数据目录可写
sudo chmod 755 /data/mongo/data

# 检查配置文件权限
ls -l /data/mongo/conf/mongod.conf
sudo chmod 644 /data/mongo/conf/mongod.conf

# 重启容器
docker restart my-mongo
```

### 8.2 无法连接数据库

```bash
# 检查容器是否运行
docker ps | grep my-mongo

# 检查端口映射
docker port my-mongo

# 检查网络连接
docker exec my-mongo mongosh --eval "db.adminCommand('ping')"
```

### 8.3 认证失败

```javascript
// 检查用户是否存在
use admin
db.getUsers()

// 重新创建用户
db.createUser({
  user: "admin",
  pwd: "my-password",
  roles: ["root"]
})
```

### 8.4 性能优化

```javascript
// 查看慢查询
db.system.profile.find().sort({ts: -1}).limit(10)

// 查看当前操作
db.currentOp()

// 查看数据库统计
db.stats()

// 查看集合统计
db.mycollection.stats()

// 创建索引
db.mycollection.createIndex({ field: 1 })

// 查看索引
db.mycollection.getIndexes()
```

---

## 九、Docker Compose 部署

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0.14
    container_name: my-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: my-password
    ports:
      - "27017:27017"
    volumes:
      - ./mongo/conf:/etc/mongo
      - ./mongo/data:/data/db
      - ./mongo/logs:/var/log/mongodb
    command: --config /etc/mongo/mongod.conf
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

## 十、副本集部署（高可用）

### 10.1 创建副本集配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongo1:
    image: mongo:7.0.14
    container_name: mongo1
    command: --replSet rs0 --bind_ip_all
    ports:
      - "27017:27017"
    volumes:
      - mongo1-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: my-password

  mongo2:
    image: mongo:7.0.14
    container_name: mongo2
    command: --replSet rs0 --bind_ip_all
    ports:
      - "27018:27017"
    volumes:
      - mongo2-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: my-password

  mongo3:
    image: mongo:7.0.14
    container_name: mongo3
    command: --replSet rs0 --bind_ip_all
    ports:
      - "27019:27017"
    volumes:
      - mongo3-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: my-password

volumes:
  mongo1-data:
  mongo2-data:
  mongo3-data:
```

### 10.2 初始化副本集

```javascript
// 连接到 mongo1
mongosh "mongodb://admin:my-password@localhost:27017/admin"

// 初始化副本集
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})

// 查看副本集状态
rs.status()
```

---

## 总结

本文详细介绍了在 Docker 中部署 MongoDB 的完整流程，包括：

1. 数据持久化准备工作
2. 目录和配置文件创建
3. 容器创建和运行
4. 验证和使用方法
5. 配置文件详解
6. 用户和权限管理
7. 数据备份和恢复
8. 常见问题解决
9. Docker Compose 部署
10. 副本集部署（高可用）

通过本文，你可以快速在 Docker 中部署一个生产可用的 MongoDB 数据库。
