---
title: "MySQL 忘记密码解决方案"
description: "详细介绍在 Windows 和 Linux 系统中重置 MySQL root 密码的方法，包括跳过权限验证、修改密码和安全加固"
keywords: "MySQL,忘记密码,重置密码,root密码,跳过权限验证,安全模式"

date: 2026-03-21T19:48:48+08:00
lastmod: 2026-03-27T17:00:00+08:00

math: false
mermaid: false

categories:
  - 数据库
tags:
  - MySQL
  - 密码重置
  - 故障排查
---

详细介绍在 Windows 和 Linux 系统中重置 MySQL root 密码的完整步骤，包括跳过权限验证、修改密码和安全加固。

<!--more-->

## 一、问题场景

### 1.1 常见情况

```bash
# 忘记 root 密码
mysql -u root -p
# Enter password: [输入错误密码]
# ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)

# 初次安装后不知道密码
# 某些安装方式会生成随机密码

# 密码过期
# ERROR 1862 (HY000): Your password has expired
```

### 1.2 影响

- 无法登录 MySQL
- 无法管理数据库
- 应用程序无法连接数据库
- 数据无法访问

---

## 二、Linux 系统重置密码

### 2.1 方法一：使用 --skip-grant-tables（推荐）

#### 步骤 1：停止 MySQL 服务

```bash
# Ubuntu/Debian
sudo systemctl stop mysql

# CentOS/RHEL
sudo systemctl stop mysqld

# 或使用 service 命令
sudo service mysql stop

# 验证服务已停止
sudo systemctl status mysql
# 应该显示：inactive (dead)
```

#### 步骤 2：以安全模式启动 MySQL

```bash
# 方法 A：使用 mysqld_safe（推荐）
sudo mysqld_safe --skip-grant-tables --skip-networking &
# --skip-grant-tables: 跳过权限验证
# --skip-networking: 禁用网络连接（安全措施）
# &: 后台运行

# 方法 B：直接使用 mysqld
sudo mysqld --skip-grant-tables --skip-networking &

# 等待几秒让服务启动
sleep 5

# 验证进程是否运行
ps aux | grep mysql
```

#### 步骤 3：无密码登录 MySQL

```bash
# 直接登录（不需要密码）
mysql -u root
# 或
mysql -u root mysql

# 应该能直接进入 MySQL 命令行
# mysql>
```

#### 步骤 4：重置密码

```sql
-- 刷新权限表
FLUSH PRIVILEGES;

-- MySQL 5.7 及以上版本
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

-- 或使用 SET PASSWORD
SET PASSWORD FOR 'root'@'localhost' = 'new_password';

-- MySQL 5.6 及更早版本
UPDATE mysql.user SET Password=PASSWORD('new_password') WHERE User='root';

-- 再次刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

#### 步骤 5：重启 MySQL 服务

```bash
# 停止安全模式的 MySQL
sudo pkill mysqld
# 或
sudo killall mysqld

# 等待进程完全停止
sleep 3

# 正常启动 MySQL
sudo systemctl start mysql

# 验证服务状态
sudo systemctl status mysql
```

#### 步骤 6：验证新密码

```bash
# 使用新密码登录
mysql -u root -p
# Enter password: [输入新密码]

# 应该能成功登录
# mysql>

# 测试权限
SHOW DATABASES;

# 退出
EXIT;
```

### 2.2 方法二：使用 init-file

#### 步骤 1：创建密码重置文件

```bash
# 创建临时文件
sudo vim /tmp/mysql-init.txt

# 添加以下内容（根据 MySQL 版本选择）
# MySQL 5.7+
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

# MySQL 5.6
UPDATE mysql.user SET Password=PASSWORD('new_password') WHERE User='root';
FLUSH PRIVILEGES;

# 保存并退出
```

#### 步骤 2：停止 MySQL 服务

```bash
sudo systemctl stop mysql
```

#### 步骤 3：使用 init-file 启动 MySQL

```bash
# 启动 MySQL 并执行初始化文件
sudo mysqld --init-file=/tmp/mysql-init.txt &

# 等待执行完成
sleep 10

# 停止 MySQL
sudo pkill mysqld
```

#### 步骤 4：正常启动并验证

```bash
# 正常启动
sudo systemctl start mysql

# 验证
mysql -u root -p
# 输入新密码

# 删除临时文件
sudo rm /tmp/mysql-init.txt
```

### 2.3 方法三：使用 systemd 配置（MySQL 5.7+）

#### 步骤 1：创建 systemd 配置目录

```bash
# 创建配置目录
sudo mkdir -p /etc/systemd/system/mysql.service.d/

# 创建配置文件
sudo vim /etc/systemd/system/mysql.service.d/override.conf
```

#### 步骤 2：添加跳过权限配置

```ini
[Service]
ExecStart=
ExecStart=/usr/sbin/mysqld --skip-grant-tables --skip-networking
```

#### 步骤 3：重新加载并启动

```bash
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 重启 MySQL
sudo systemctl restart mysql

# 无密码登录并重置密码
mysql -u root
```

```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

#### 步骤 4：恢复正常配置

```bash
# 删除配置文件
sudo rm /etc/systemd/system/mysql.service.d/override.conf

# 重新加载
sudo systemctl daemon-reload

# 重启 MySQL
sudo systemctl restart mysql

# 验证
mysql -u root -p
```

---

## 三、Windows 系统重置密码

### 3.1 方法一：使用命令行

#### 步骤 1：停止 MySQL 服务

```cmd
REM 以管理员身份打开 CMD

REM 停止 MySQL 服务
net stop MySQL
REM 或
net stop MySQL80

REM 查看服务名称
sc query | findstr MySQL
```

#### 步骤 2：以安全模式启动 MySQL

```cmd
REM 进入 MySQL 安装目录
cd C:\Program Files\MySQL\MySQL Server 8.0\bin

REM 以跳过权限模式启动
mysqld --console --skip-grant-tables --shared-memory
REM --console: 在控制台显示日志
REM --skip-grant-tables: 跳过权限验证
REM --shared-memory: 使用共享内存连接

REM 保持此窗口打开
```

#### 步骤 3：打开新的 CMD 窗口登录

```cmd
REM 打开新的 CMD 窗口（管理员）

REM 进入 MySQL bin 目录
cd C:\Program Files\MySQL\MySQL Server 8.0\bin

REM 无密码登录
mysql -u root
```

#### 步骤 4：重置密码

```sql
-- 刷新权限
FLUSH PRIVILEGES;

-- 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

#### 步骤 5：重启服务

```cmd
REM 在第一个 CMD 窗口按 Ctrl+C 停止 MySQL

REM 正常启动服务
net start MySQL

REM 验证
mysql -u root -p
REM 输入新密码
```

### 3.2 方法二：使用 init-file（Windows）

#### 步骤 1：创建密码重置文件

```cmd
REM 创建文本文件
notepad C:\mysql-init.txt

REM 添加以下内容
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

REM 保存并关闭
```

#### 步骤 2：停止服务并使用 init-file

```cmd
REM 停止服务
net stop MySQL

REM 使用 init-file 启动
cd C:\Program Files\MySQL\MySQL Server 8.0\bin
mysqld --init-file=C:\mysql-init.txt --console

REM 等待执行完成后按 Ctrl+C 停止

REM 正常启动服务
net start MySQL

REM 删除临时文件
del C:\mysql-init.txt

REM 验证
mysql -u root -p
```

### 3.3 方法三：使用 PowerShell

#### 步骤 1：停止 MySQL 服务

```powershell
# 以管理员身份打开 PowerShell

# 停止 MySQL 服务
Stop-Service -Name MySQL
# 或
Stop-Service -Name MySQL80

# 查看服务状态
Get-Service -Name MySQL*

# 应该显示：Status: Stopped
```

#### 步骤 2：以安全模式启动 MySQL

```powershell
# 进入 MySQL 安装目录
Set-Location "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# 以跳过权限模式启动
Start-Process mysqld -ArgumentList "--console", "--skip-grant-tables", "--shared-memory"
# --console: 在控制台显示日志
# --skip-grant-tables: 跳过权限验证
# --shared-memory: 使用共享内存连接

# 或使用后台启动
Start-Job -ScriptBlock {
    & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --skip-grant-tables --shared-memory
}

# 等待服务启动
Start-Sleep -Seconds 5

# 验证进程
Get-Process mysqld
```

#### 步骤 3：打开新的 PowerShell 窗口登录

```powershell
# 打开新的 PowerShell 窗口（管理员）

# 进入 MySQL bin 目录
Set-Location "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# 无密码登录
.\mysql.exe -u root

# 或使用完整路径
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root
```

#### 步骤 4：重置密码

```sql
-- 刷新权限
FLUSH PRIVILEGES;

-- 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

#### 步骤 5：重启服务

```powershell
# 停止安全模式的 MySQL
Stop-Process -Name mysqld -Force

# 或使用 Job ID（如果使用 Start-Job 启动）
Get-Job | Stop-Job
Get-Job | Remove-Job

# 等待进程完全停止
Start-Sleep -Seconds 3

# 验证进程已停止
Get-Process mysqld -ErrorAction SilentlyContinue
# 应该没有输出

# 正常启动服务
Start-Service -Name MySQL

# 验证服务状态
Get-Service -Name MySQL
# 应该显示：Status: Running

# 或使用详细信息
Get-Service -Name MySQL | Select-Object Name, Status, StartType
```

#### 步骤 6：验证新密码

```powershell
# 进入 MySQL bin 目录
Set-Location "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# 使用新密码登录
.\mysql.exe -u root -p
# 输入新密码

# 或使用一行命令（不推荐，密码会显示在历史记录中）
$password = "new_password"
.\mysql.exe -u root -p"$password"

# 推荐使用安全方式
$securePassword = Read-Host "Enter MySQL password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
.\mysql.exe -u root -p"$password"
```

#### PowerShell 脚本自动化

```powershell
# 创建密码重置脚本
# 保存为 Reset-MySQLPassword.ps1

<#
.SYNOPSIS
    重置 MySQL root 密码
.DESCRIPTION
    自动化 MySQL root 密码重置流程
.PARAMETER NewPassword
    新密码
.EXAMPLE
    .\Reset-MySQLPassword.ps1 -NewPassword "MyNewPassword123!"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$NewPassword
)

# 检查管理员权限
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Error "请以管理员身份运行此脚本"
    exit 1
}

# MySQL 安装路径
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$mysqldExe = Join-Path $mysqlPath "mysqld.exe"
$mysqlExe = Join-Path $mysqlPath "mysql.exe"

# 检查 MySQL 是否安装
if (-not (Test-Path $mysqldExe)) {
    Write-Error "未找到 MySQL 安装路径: $mysqldExe"
    exit 1
}

Write-Host "步骤 1: 停止 MySQL 服务..." -ForegroundColor Yellow
Stop-Service -Name MySQL -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host "步骤 2: 以安全模式启动 MySQL..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock {
    param($mysqldPath)
    & $mysqldPath --skip-grant-tables --shared-memory
} -ArgumentList $mysqldExe

Start-Sleep -Seconds 5

Write-Host "步骤 3: 重置密码..." -ForegroundColor Yellow
$sqlCommands = @"
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '$NewPassword';
FLUSH PRIVILEGES;
EXIT;
"@

$sqlCommands | & $mysqlExe -u root

Write-Host "步骤 4: 停止安全模式..." -ForegroundColor Yellow
Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue
Stop-Job -Job $job -ErrorAction SilentlyContinue
Remove-Job -Job $job -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host "步骤 5: 正常启动 MySQL 服务..." -ForegroundColor Yellow
Start-Service -Name MySQL

Write-Host "步骤 6: 验证新密码..." -ForegroundColor Yellow
$testResult = echo "SELECT 'Password reset successful!' AS Result;" | & $mysqlExe -u root -p"$NewPassword" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "密码重置成功！" -ForegroundColor Green
    Write-Host "新密码: $NewPassword" -ForegroundColor Green
} else {
    Write-Error "密码重置失败，请手动检查"
    Write-Host $testResult
}
```

#### 使用脚本

```powershell
# 运行脚本
.\Reset-MySQLPassword.ps1 -NewPassword "MyNewPassword123!"

# 或交互式输入密码
$newPass = Read-Host "请输入新密码" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPass)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
.\Reset-MySQLPassword.ps1 -NewPassword $plainPassword
```

### 3.4 方法四：使用 MySQL Workbench

```
1. 停止 MySQL 服务
   - 打开"服务"（services.msc）
   - 找到 MySQL 服务
   - 右键 -> 停止

2. 以安全模式启动
   - 打开 CMD（管理员）
   - 运行：mysqld --skip-grant-tables

3. 打开 MySQL Workbench
   - 连接到 localhost（不需要密码）
   - 执行 SQL：
     FLUSH PRIVILEGES;
     ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

4. 重启服务
   - 停止安全模式的 MySQL
   - 在"服务"中启动 MySQL
```

---

## 四、Docker 中的 MySQL 重置密码

### 4.1 方法一：使用环境变量

```bash
# 停止并删除容器
docker stop mysql-container
docker rm mysql-container

# 使用新密码重新创建容器
docker run -d \
  --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=new_password \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# 验证
docker exec -it mysql-container mysql -u root -p
```

### 4.2 方法二：进入容器修改

```bash
# 进入容器
docker exec -it mysql-container bash

# 停止 MySQL
mysqladmin -u root -p shutdown

# 以安全模式启动
mysqld --skip-grant-tables --skip-networking &

# 登录并修改密码
mysql -u root
```

```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 停止安全模式
pkill mysqld

# 退出容器
exit

# 重启容器
docker restart mysql-container

# 验证
docker exec -it mysql-container mysql -u root -p
```

### 4.3 方法三：使用 docker-compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-container
    environment:
      MYSQL_ROOT_PASSWORD: new_password
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql-data:
```

```bash
# 停止旧容器
docker-compose down

# 启动新容器
docker-compose up -d

# 验证
docker-compose exec mysql mysql -u root -p
```

---

## 五、常见问题和解决方案

### 5.1 无法停止 MySQL 服务

```bash
# Linux
# 查找 MySQL 进程
ps aux | grep mysql

# 强制杀死进程
sudo pkill -9 mysqld

# 或使用 PID
sudo kill -9 <PID>

# Windows
# 任务管理器 -> 详细信息 -> 找到 mysqld.exe -> 结束任务

# 或使用命令
taskkill /F /IM mysqld.exe
```

### 5.2 --skip-grant-tables 不生效

```bash
# 检查是否有多个 MySQL 实例
ps aux | grep mysql

# 确保使用正确的配置文件
sudo mysqld --skip-grant-tables --skip-networking --defaults-file=/etc/mysql/my.cnf &

# 检查端口是否被占用
sudo netstat -tlnp | grep 3306
```

### 5.3 修改密码后仍然无法登录

```sql
-- 检查用户主机
SELECT User, Host FROM mysql.user WHERE User='root';

-- 如果 Host 不是 localhost，需要指定
mysql -u root -h 127.0.0.1 -p

-- 或修改 Host
UPDATE mysql.user SET Host='localhost' WHERE User='root' AND Host='%';
FLUSH PRIVILEGES;
```

### 5.4 密码策略限制

```sql
-- 查看密码策略
SHOW VARIABLES LIKE 'validate_password%';

-- 临时降低密码策略（不推荐）
SET GLOBAL validate_password.policy=LOW;
SET GLOBAL validate_password.length=6;

-- 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'simple';

-- 恢复密码策略
SET GLOBAL validate_password.policy=MEDIUM;
SET GLOBAL validate_password.length=8;
```

### 5.5 权限表损坏

```bash
# 修复权限表
sudo mysql_upgrade -u root -p

# 或重建权限表
sudo mysql_install_db --user=mysql --datadir=/var/lib/mysql
```

---

## 六、安全加固

### 6.1 设置强密码

```sql
-- 使用强密码（至少 8 位，包含大小写字母、数字、特殊字符）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyStr0ng!Pass#2024';

-- 设置密码过期策略
ALTER USER 'root'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
```

### 6.2 限制 root 远程访问

```sql
-- 只允许本地访问
SELECT User, Host FROM mysql.user WHERE User='root';

-- 删除远程 root 账户
DELETE FROM mysql.user WHERE User='root' AND Host!='localhost';
FLUSH PRIVILEGES;

-- 创建专用的远程管理账户
CREATE USER 'admin'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 6.3 启用日志审计

```sql
-- 启用通用查询日志
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/log/mysql/general.log';

-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
SET GLOBAL long_query_time = 2;
```

### 6.4 定期备份

```bash
# 备份所有数据库
mysqldump -u root -p --all-databases > backup_$(date +%Y%m%d).sql

# 备份特定数据库
mysqldump -u root -p database_name > database_backup.sql

# 自动备份脚本
cat > /usr/local/bin/mysql-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mysqldump -u root -p'your_password' --all-databases | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/mysql-backup.sh

# 添加到 crontab（每天凌晨 2 点备份）
# 0 2 * * * /usr/local/bin/mysql-backup.sh
```

---

## 七、预防措施

### 7.1 记录密码

```bash
# 使用密码管理器
# - KeePass
# - 1Password
# - LastPass
# - Bitwarden

# 或加密存储
echo "root_password" | gpg -c > mysql_root_password.gpg

# 解密
gpg -d mysql_root_password.gpg
```

### 7.2 使用配置文件

```bash
# 创建 .my.cnf 文件
vim ~/.my.cnf

# 添加内容
[client]
user=root
password=your_password

# 设置权限（重要！）
chmod 600 ~/.my.cnf

# 现在可以无密码登录
mysql
```

### 7.3 使用环境变量

```bash
# 在 ~/.bashrc 中添加
export MYSQL_PWD='your_password'

# 重新加载
source ~/.bashrc

# 登录（不需要 -p）
mysql -u root
```

### 7.4 定期更换密码

```sql
-- 设置密码过期策略
ALTER USER 'root'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;

-- 立即过期（强制下次登录修改）
ALTER USER 'root'@'localhost' PASSWORD EXPIRE;
```

---

## 八、总结

### 8.1 重置密码流程

1. **停止 MySQL 服务**
2. **以安全模式启动**（--skip-grant-tables）
3. **无密码登录**
4. **执行 FLUSH PRIVILEGES**
5. **修改密码**（ALTER USER 或 SET PASSWORD）
6. **再次 FLUSH PRIVILEGES**
7. **重启 MySQL 服务**
8. **验证新密码**

### 8.2 常用命令速查

```bash
# Linux
sudo systemctl stop mysql
sudo mysqld_safe --skip-grant-tables --skip-networking &
mysql -u root
# SQL: FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
sudo systemctl start mysql

# Windows CMD
net stop MySQL
mysqld --skip-grant-tables --shared-memory
mysql -u root
# SQL: FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
net start MySQL

# Windows PowerShell
Stop-Service -Name MySQL
Start-Process mysqld -ArgumentList "--skip-grant-tables", "--shared-memory"
.\mysql.exe -u root
# SQL: FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
Start-Service -Name MySQL

# Docker
docker exec -it mysql-container bash
mysqld --skip-grant-tables &
mysql -u root
# SQL: FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
docker restart mysql-container
```

### 8.3 最佳实践

1. **使用强密码**：至少 8 位，包含大小写字母、数字、特殊字符
2. **限制 root 访问**：只允许本地访问
3. **定期备份**：自动化备份脚本
4. **记录密码**：使用密码管理器
5. **监控日志**：启用审计日志
6. **定期更换**：设置密码过期策略

### 相关文档

- [在 Docker 中部署 MySQL](../百科全书/在Docker中部署MySQL.md)
- [Linux 权限错误排查和解决](../百科全书/Linux权限错误排查和解决.md)
- [Linux 文件权限管理](../百科全书/Linux文件权限管理.md)

---

通过掌握 MySQL 密码重置的方法，你可以快速恢复数据库访问权限。建议定期备份数据库，使用强密码，并做好密码管理，避免再次遗忘密码。
