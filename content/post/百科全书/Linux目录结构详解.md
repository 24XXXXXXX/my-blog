---
title: "Linux 目录结构详解：根目录和家目录"
description: "详细介绍 Linux 系统中根目录（/）和家目录（~）的概念、区别、用途和最佳实践"
keywords: "Linux,根目录,家目录,目录结构,文件系统"

date: 2026-03-26T15:00:00+08:00
lastmod: 2026-03-26T15:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Linux
  - 文件系统
  - 系统管理
---

本文详细介绍 Linux 系统中根目录（/）和家目录（~）的概念、区别、用途和使用方法，帮助你更好地理解 Linux 文件系统结构。

<!--more-->

## 一、Linux 文件系统概述

### 1.1 文件系统层次结构

Linux 采用树形目录结构，所有文件和目录都从根目录（/）开始，形成一个倒置的树状结构。

```
/                           # 根目录（文件系统的起点）
├── bin/                    # 基本命令
├── boot/                   # 启动文件
├── dev/                    # 设备文件
├── etc/                    # 配置文件
├── home/                   # 用户家目录
│   ├── user1/             # 用户1的家目录
│   ├── user2/             # 用户2的家目录
│   └── admin/             # admin用户的家目录
├── lib/                    # 系统库文件
├── media/                  # 可移动媒体挂载点
├── mnt/                    # 临时挂载点
├── opt/                    # 可选应用程序
├── proc/                   # 进程信息
├── root/                   # root用户的家目录
├── run/                    # 运行时数据
├── sbin/                   # 系统管理命令
├── srv/                    # 服务数据
├── sys/                    # 系统信息
├── tmp/                    # 临时文件
├── usr/                    # 用户程序
└── var/                    # 可变数据
```

### 1.2 路径的概念

#### 绝对路径
从根目录（/）开始的完整路径

```bash
/home/admin/documents/file.txt
/etc/nginx/nginx.conf
/var/log/syslog
```

#### 相对路径
相对于当前目录的路径

```bash
documents/file.txt          # 当前目录下的 documents/file.txt
../config/app.conf          # 上级目录的 config/app.conf
./script.sh                 # 当前目录的 script.sh
```

---

## 二、根目录（/）详解

### 2.1 什么是根目录

根目录（Root Directory）是 Linux 文件系统的最顶层目录，用符号 `/` 表示。所有文件和目录都从这里开始。

```bash
# 查看根目录
ls /

# 查看根目录详细信息
ls -la /

# 切换到根目录
cd /
```

### 2.2 根目录的特点

1. **唯一性**：整个文件系统只有一个根目录
2. **起点**：所有路径的起始点
3. **不可删除**：根目录不能被删除或移动
4. **权限保护**：通常只有 root 用户有完全权限

### 2.3 根目录下的主要子目录

#### /bin - 基本命令二进制文件

存放所有用户都可以使用的基本命令。

```bash
ls /bin
# 常见命令：ls, cp, mv, rm, cat, bash, sh, grep, etc.

# 示例
/bin/ls
/bin/bash
/bin/cat
```

#### /boot - 启动文件

存放系统启动所需的文件，包括内核和引导加载程序。

```bash
ls /boot
# 包含：vmlinuz（内核）, initrd（初始化内存盘）, grub（引导加载程序）

# 示例
/boot/vmlinuz-5.15.0-generic
/boot/initrd.img-5.15.0-generic
/boot/grub/grub.cfg
```

**注意**：不要随意修改或删除此目录中的文件，可能导致系统无法启动。

#### /dev - 设备文件

存放设备文件，Linux 将硬件设备视为文件。

```bash
ls /dev

# 常见设备
/dev/sda        # 第一块硬盘
/dev/sda1       # 第一块硬盘的第一个分区
/dev/null       # 空设备（黑洞）
/dev/zero       # 零设备
/dev/random     # 随机数生成器
/dev/tty        # 终端设备
```

#### /etc - 配置文件

存放系统和应用程序的配置文件。

```bash
ls /etc

# 重要配置文件
/etc/passwd             # 用户账户信息
/etc/shadow             # 用户密码（加密）
/etc/group              # 组信息
/etc/hosts              # 主机名映射
/etc/hostname           # 主机名
/etc/fstab              # 文件系统挂载配置
/etc/ssh/sshd_config    # SSH 服务器配置
/etc/nginx/nginx.conf   # Nginx 配置
/etc/mysql/my.cnf       # MySQL 配置
```

#### /home - 用户家目录

存放普通用户的家目录（root 用户除外）。

```bash
ls /home

# 示例
/home/admin/            # admin 用户的家目录
/home/user1/            # user1 用户的家目录
/home/user2/            # user2 用户的家目录
```

#### /lib - 系统库文件

存放系统启动和运行所需的共享库文件。

```bash
ls /lib

# 示例
/lib/x86_64-linux-gnu/  # 64位系统库
/lib/modules/           # 内核模块
```

#### /media - 可移动媒体挂载点

自动挂载可移动设备（如 USB、光盘）的位置。

```bash
ls /media

# 示例
/media/usb/             # USB 设备
/media/cdrom/           # 光盘
```

#### /mnt - 临时挂载点

用于临时挂载文件系统。

```bash
# 挂载示例
sudo mount /dev/sdb1 /mnt
ls /mnt
sudo umount /mnt
```

#### /opt - 可选应用程序

存放第三方软件包。

```bash
ls /opt

# 示例
/opt/google/chrome/     # Chrome 浏览器
/opt/lampp/             # XAMPP
/opt/nodejs/            # Node.js
```

#### /proc - 进程信息

虚拟文件系统，包含进程和系统信息。

```bash
ls /proc

# 示例
/proc/cpuinfo           # CPU 信息
/proc/meminfo           # 内存信息
/proc/version           # 内核版本
/proc/1234/             # PID 为 1234 的进程信息

# 查看信息
cat /proc/cpuinfo
cat /proc/meminfo
```

#### /root - root 用户的家目录

root 用户（超级管理员）的家目录，不在 /home 下。

```bash
# 只有 root 用户可以访问
sudo ls /root

# root 用户登录后的默认目录
sudo su -
pwd  # 输出：/root
```

#### /run - 运行时数据

存放系统运行时的临时数据。

```bash
ls /run

# 示例
/run/lock/              # 锁文件
/run/user/              # 用户运行时数据
```

#### /sbin - 系统管理命令

存放系统管理员使用的命令。

```bash
ls /sbin

# 常见命令
/sbin/ifconfig          # 网络配置
/sbin/iptables          # 防火墙
/sbin/fdisk             # 磁盘分区
/sbin/shutdown          # 关机
```

#### /srv - 服务数据

存放服务相关的数据。

```bash
ls /srv

# 示例
/srv/www/               # Web 服务器数据
/srv/ftp/               # FTP 服务器数据
```

#### /sys - 系统信息

虚拟文件系统，包含系统硬件信息。

```bash
ls /sys

# 示例
/sys/class/             # 设备类
/sys/block/             # 块设备
/sys/devices/           # 设备信息
```

#### /tmp - 临时文件

存放临时文件，系统重启后通常会清空。

```bash
ls /tmp

# 创建临时文件
echo "test" > /tmp/test.txt

# 权限通常是 1777（所有人可读写，但只能删除自己的文件）
ls -ld /tmp
# drwxrwxrwt
```

#### /usr - 用户程序

存放用户级的程序和数据。

```bash
ls /usr

# 重要子目录
/usr/bin/               # 用户命令
/usr/sbin/              # 系统管理命令
/usr/lib/               # 库文件
/usr/local/             # 本地安装的软件
/usr/share/             # 共享数据
/usr/include/           # 头文件
/usr/src/               # 源代码
```

#### /var - 可变数据

存放经常变化的数据。

```bash
ls /var

# 重要子目录
/var/log/               # 日志文件
/var/cache/             # 缓存数据
/var/tmp/               # 临时文件（重启后保留）
/var/lib/               # 应用程序数据
/var/spool/             # 队列数据（打印、邮件等）
/var/www/               # Web 服务器文档根目录

# 常见日志文件
/var/log/syslog         # 系统日志
/var/log/auth.log       # 认证日志
/var/log/nginx/         # Nginx 日志
/var/log/mysql/         # MySQL 日志
```

---

## 三、家目录（~）详解

### 3.1 什么是家目录

家目录（Home Directory）是每个用户的个人目录，用于存放用户的个人文件、配置和数据。

```bash
# ~ 符号代表当前用户的家目录
cd ~
pwd

# 等同于
cd $HOME
pwd

# 查看家目录
echo $HOME
```

### 3.2 家目录的位置

#### 普通用户的家目录

```bash
# 通常在 /home/用户名
/home/admin/
/home/user1/
/home/user2/
```

#### root 用户的家目录

```bash
# root 用户的家目录在 /root
/root/
```

### 3.3 家目录的特点

1. **个人空间**：每个用户有自己独立的家目录
2. **默认位置**：用户登录后的默认目录
3. **权限保护**：通常只有所有者有完全权限（700 或 755）
4. **配置存储**：存放用户的个人配置文件

### 3.4 家目录的结构

```bash
~                           # 家目录
├── .bashrc                 # Bash 配置文件
├── .bash_profile           # Bash 登录配置
├── .bash_history           # 命令历史
├── .profile                # Shell 配置
├── .ssh/                   # SSH 配置和密钥
│   ├── id_rsa             # 私钥
│   ├── id_rsa.pub         # 公钥
│   ├── authorized_keys    # 授权密钥
│   ├── known_hosts        # 已知主机
│   └── config             # SSH 客户端配置
├── .config/                # 应用程序配置
├── .local/                 # 本地数据
├── Documents/              # 文档
├── Downloads/              # 下载
├── Pictures/               # 图片
├── Videos/                 # 视频
├── Music/                  # 音乐
└── Desktop/                # 桌面
```

### 3.5 隐藏文件和目录

家目录中以 `.` 开头的文件和目录是隐藏的。

```bash
# 查看所有文件（包括隐藏文件）
ls -la ~

# 只查看隐藏文件
ls -ld ~/.*

# 常见隐藏配置文件
~/.bashrc               # Bash 配置
~/.vimrc                # Vim 配置
~/.gitconfig            # Git 配置
~/.npmrc                # NPM 配置
~/.ssh/config           # SSH 配置
~/.mysql_history        # MySQL 历史
~/.bash_history         # 命令历史
```

### 3.6 家目录的用途

#### 存放个人文件

```bash
# 创建个人目录
mkdir ~/projects
mkdir ~/documents
mkdir ~/scripts

# 存放文件
cp file.txt ~/documents/
mv script.sh ~/scripts/
```

#### 存放配置文件

```bash
# 编辑 Bash 配置
vim ~/.bashrc

# 编辑 SSH 配置
vim ~/.ssh/config

# 编辑 Git 配置
vim ~/.gitconfig
```

#### 存放应用数据

```bash
# 应用程序配置
~/.config/

# 应用程序数据
~/.local/share/

# 应用程序缓存
~/.cache/
```

---

## 四、根目录和家目录的区别

### 4.1 对比表

| 特性 | 根目录（/） | 家目录（~） |
|------|------------|------------|
| 符号 | `/` | `~` 或 `$HOME` |
| 位置 | 文件系统顶层 | `/home/用户名` 或 `/root` |
| 数量 | 唯一，只有一个 | 每个用户一个 |
| 用途 | 系统文件和目录 | 用户个人文件和配置 |
| 权限 | root 用户管理 | 用户自己管理 |
| 访问 | 所有用户可访问（受权限限制） | 主要是所有者访问 |
| 内容 | 系统目录、配置、程序 | 个人文件、配置、数据 |

### 4.2 路径示例

```bash
# 根目录路径
/etc/nginx/nginx.conf
/var/log/syslog
/usr/bin/python3

# 家目录路径
~/documents/file.txt
~/.bashrc
~/projects/myapp/

# 展开后的家目录路径
/home/admin/documents/file.txt
/home/admin/.bashrc
/home/admin/projects/myapp/
```

### 4.3 使用场景

#### 根目录使用场景

```bash
# 系统配置
sudo vim /etc/nginx/nginx.conf

# 查看日志
tail -f /var/log/syslog

# 安装软件
sudo apt install package

# 系统管理
sudo systemctl restart nginx
```

#### 家目录使用场景

```bash
# 个人文件操作
cd ~/documents
vim ~/notes.txt

# 个人配置
vim ~/.bashrc
source ~/.bashrc

# 个人项目
cd ~/projects/myapp
git clone repo ~/projects/newapp
```

---

## 五、常用操作和技巧

### 5.1 路径导航

```bash
# 切换到根目录
cd /

# 切换到家目录
cd ~
cd
cd $HOME

# 切换到上一个目录
cd -

# 切换到父目录
cd ..

# 切换到指定用户的家目录
cd ~username
cd ~admin
```

### 5.2 路径展开

```bash
# ~ 会自动展开为家目录
echo ~
# 输出：/home/admin

echo ~/documents
# 输出：/home/admin/documents

# 使用变量
echo $HOME
# 输出：/home/admin

# 在命令中使用
cp file.txt ~/backup/
ls -la ~/projects/
```

### 5.3 相对路径和绝对路径转换

```bash
# 获取当前目录的绝对路径
pwd

# 获取文件的绝对路径
realpath file.txt
readlink -f file.txt

# 示例
cd ~/documents
pwd
# 输出：/home/admin/documents

realpath ../projects/file.txt
# 输出：/home/admin/projects/file.txt
```

### 5.4 快速访问常用目录

```bash
# 在 ~/.bashrc 中添加别名
alias docs='cd ~/documents'
alias proj='cd ~/projects'
alias logs='cd /var/log'
alias conf='cd /etc'

# 重新加载配置
source ~/.bashrc

# 使用别名
docs    # 跳转到 ~/documents
proj    # 跳转到 ~/projects
```

### 5.5 环境变量

```bash
# 查看家目录环境变量
echo $HOME

# 查看当前目录
echo $PWD

# 查看上一个目录
echo $OLDPWD

# 在脚本中使用
#!/bin/bash
BACKUP_DIR="$HOME/backup"
mkdir -p "$BACKUP_DIR"
cp important.txt "$BACKUP_DIR/"
```

---

## 六、权限和安全

### 6.1 根目录权限

```bash
# 查看根目录权限
ls -ld /
# drwxr-xr-x 20 root root 4096 ...

# 根目录下的重要目录权限
ls -l / | grep "^d"
```

**注意事项：**
- 不要随意修改根目录及其子目录的权限
- 系统目录通常由 root 用户拥有
- 修改系统目录需要 sudo 权限

### 6.2 家目录权限

```bash
# 查看家目录权限
ls -ld ~
# drwxr-xr-x 25 admin admin 4096 ...

# 推荐权限设置
chmod 755 ~              # 家目录
chmod 700 ~/.ssh         # SSH 目录
chmod 600 ~/.ssh/id_rsa  # 私钥
chmod 644 ~/.ssh/id_rsa.pub  # 公钥
chmod 644 ~/.bashrc      # 配置文件
```

### 6.3 安全建议

```bash
# 1. 保护 SSH 密钥
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/authorized_keys

# 2. 保护敏感配置
chmod 600 ~/.mysql_history
chmod 600 ~/.bash_history

# 3. 定期备份家目录
tar -czf ~/backup_$(date +%Y%m%d).tar.gz ~/documents ~/projects

# 4. 不要在家目录存放系统文件
# 5. 定期清理临时文件
rm -rf ~/.cache/*
rm -rf ~/tmp/*
```

---

## 七、常见问题和解决方案

### 7.1 找不到家目录

```bash
# 问题：cd ~ 失败
# 解决：检查 HOME 环境变量
echo $HOME

# 如果为空，设置它
export HOME=/home/admin

# 永久设置（添加到 ~/.bashrc）
echo 'export HOME=/home/admin' >> ~/.bashrc
source ~/.bashrc
```

### 7.2 权限被拒绝

```bash
# 问题：无法访问根目录下的文件
# 解决：使用 sudo
sudo cat /etc/shadow
sudo vim /etc/nginx/nginx.conf

# 问题：无法访问其他用户的家目录
# 解决：需要相应权限或使用 sudo
sudo ls /home/otheruser/
```

### 7.3 磁盘空间不足

```bash
# 检查根目录磁盘使用
df -h /

# 检查家目录磁盘使用
df -h ~
du -sh ~
du -sh ~/*

# 查找大文件
find ~ -type f -size +100M
find / -type f -size +1G 2>/dev/null

# 清理空间
# 清理缓存
rm -rf ~/.cache/*

# 清理临时文件
rm -rf /tmp/*

# 清理日志（需要 sudo）
sudo journalctl --vacuum-time=7d
```

### 7.4 配置文件丢失

```bash
# 恢复默认 .bashrc
cp /etc/skel/.bashrc ~/

# 恢复默认 .profile
cp /etc/skel/.profile ~/

# 重新加载配置
source ~/.bashrc
```

---

## 八、最佳实践

### 8.1 目录组织

```bash
# 推荐的家目录结构
~/
├── documents/          # 文档
├── projects/           # 项目代码
├── scripts/            # 脚本
├── backup/             # 备份
├── downloads/          # 下载
└── tmp/                # 临时文件

# 创建结构
mkdir -p ~/documents ~/projects ~/scripts ~/backup ~/downloads ~/tmp
```

### 8.2 配置管理

```bash
# 使用版本控制管理配置文件
cd ~
git init
git add .bashrc .vimrc .gitconfig
git commit -m "Initial config"

# 或使用专门的配置管理工具
# dotfiles 仓库
```

### 8.3 备份策略

```bash
# 定期备份家目录
#!/bin/bash
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d)
tar -czf "$BACKUP_DIR/home_$DATE.tar.gz" \
    --exclude="$HOME/.cache" \
    --exclude="$HOME/tmp" \
    "$HOME"

# 添加到 crontab
0 2 * * 0 /path/to/backup_script.sh
```

### 8.4 路径使用建议

```bash
# 1. 使用绝对路径处理系统文件
sudo vim /etc/nginx/nginx.conf

# 2. 使用 ~ 处理个人文件
vim ~/documents/notes.txt

# 3. 在脚本中使用变量
CONFIG_FILE="$HOME/.config/app/config.yml"

# 4. 避免硬编码路径
# 不好
cp file.txt /home/admin/backup/

# 好
cp file.txt ~/backup/
```

---

## 九、总结

### 9.1 关键要点

1. **根目录（/）**
   - 文件系统的顶层目录
   - 包含所有系统文件和目录
   - 需要 root 权限修改
   - 是所有路径的起点

2. **家目录（~）**
   - 每个用户的个人目录
   - 存放个人文件和配置
   - 用户有完全控制权
   - 使用 ~ 或 $HOME 表示

3. **路径类型**
   - 绝对路径：从 / 开始
   - 相对路径：相对当前目录
   - ~ 路径：相对家目录

4. **权限管理**
   - 根目录：系统管理
   - 家目录：用户管理
   - 遵循最小权限原则

### 9.2 快速参考

```bash
# 根目录操作
cd /                    # 切换到根目录
ls /                    # 列出根目录内容
sudo vim /etc/config    # 编辑系统配置

# 家目录操作
cd ~                    # 切换到家目录
cd                      # 同上
ls ~                    # 列出家目录内容
vim ~/.bashrc           # 编辑个人配置

# 路径转换
pwd                     # 显示当前目录
realpath file.txt       # 获取绝对路径
echo $HOME              # 显示家目录路径
```

### 相关文档

- [Linux 文件和目录操作](./Linux文件和目录操作.md)
- [Linux 文件权限管理](./Linux文件权限管理.md)
- [命令行参数详解](./命令行参数详解.md)
