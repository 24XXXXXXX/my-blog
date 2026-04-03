---
title: "Ubuntu 命令大全"
description: "全面收录 Ubuntu/Linux 系统命令，从常用到冷门一网打尽"
keywords: "Ubuntu,Linux,命令行,Shell,终端命令"

date: 2026-03-21T20:08:34+08:00
lastmod: 2026-03-21T20:08:34+08:00

math: false
mermaid: false

categories:
  - 计算机操作系统
tags:
  - Ubuntu
  - Linux
  - 命令行
---

本文全面收录 Ubuntu/Linux 系统命令，涵盖文件管理、系统管理、网络操作、进程管理等各个方面，从常用到冷门命令一应俱全。

<!--more-->

## 一、文件和目录操作

### 基础操作

```bash
# 目录导航
cd /path/to/dir          # 切换目录
cd ~                     # 回到家目录
cd -                     # 回到上一次的目录
pwd                      # 显示当前目录路径
pushd /path              # 保存当前目录并切换
popd                     # 返回 pushd 保存的目录
dirs                     # 显示目录栈

# 列出文件
ls                       # 列出文件
ls -l                    # 详细列表
ls -a                    # 显示隐藏文件
ls -lh                   # 人类可读的文件大小
ls -R                    # 递归列出子目录
ls -lt                   # 按修改时间排序
ls -lS                   # 按文件大小排序
ls -i                    # 显示 inode 号
tree                     # 树状显示目录结构
tree -L 2                # 限制显示层级
```

### 文件操作

```bash
# 创建
touch file.txt           # 创建空文件或更新时间戳
mkdir dir                # 创建目录
mkdir -p a/b/c           # 递归创建目录
mktemp                   # 创建临时文件
mktemp -d                # 创建临时目录

# 复制
cp file1 file2           # 复制文件
cp -r dir1 dir2          # 递归复制目录
cp -a dir1 dir2          # 保留所有属性复制
cp -u file1 file2        # 仅当源文件较新时复制
cp -i file1 file2        # 覆盖前询问
cp -v file1 file2        # 显示详细信息

# 移动/重命名
mv file1 file2           # 移动或重命名文件
mv -i file1 file2        # 覆盖前询问
mv -u file1 file2        # 仅当源文件较新时移动
mv -v file1 file2        # 显示详细信息

# 删除
rm file                  # 删除文件
rm -r dir                # 递归删除目录
rm -f file               # 强制删除不提示
rm -rf dir               # 强制递归删除（危险）
rm -i file               # 删除前确认
rmdir dir                # 删除空目录
shred -u file            # 安全删除文件（覆盖数据）

# 链接
ln file link             # 创建硬链接
ln -s target link        # 创建符号链接（软链接）
readlink link            # 显示符号链接目标
unlink link              # 删除链接
```

### 文件查看

```bash
# 查看文件内容
cat file                 # 显示文件内容
cat -n file              # 显示行号
tac file                 # 反向显示文件
more file                # 分页显示
less file                # 更强大的分页显示
head file                # 显示文件开头（默认 10 行）
head -n 20 file          # 显示前 20 行
tail file                # 显示文件末尾
tail -n 20 file          # 显示后 20 行
tail -f file             # 实时跟踪文件变化
tail -F file             # 跟踪文件（即使文件被重建）
nl file                  # 显示文件并添加行号
od file                  # 八进制显示文件
od -c file               # 字符方式显示
hexdump file             # 十六进制显示
xxd file                 # 十六进制转储
strings file             # 显示文件中的可打印字符
rev file                 # 反转每行字符

# 文件编辑
nano file                # 简单文本编辑器
vi file                  # Vi 编辑器
vim file                 # Vim 编辑器
emacs file               # Emacs 编辑器
gedit file               # 图形界面编辑器
sed 's/old/new/g' file   # 流编辑器替换
awk '{print $1}' file    # 文本处理工具
```

### 文件搜索

```bash
# 查找文件
find /path -name "*.txt"           # 按名称查找
find /path -type f                 # 查找文件
find /path -type d                 # 查找目录
find /path -size +100M             # 查找大于 100M 的文件
find /path -mtime -7               # 查找 7 天内修改的文件
find /path -user username          # 按用户查找
find /path -perm 644               # 按权限查找
find /path -empty                  # 查找空文件/目录
find /path -name "*.log" -delete   # 查找并删除
find /path -exec command {} \;     # 对查找结果执行命令

# 快速查找
locate filename          # 从数据库快速查找文件
updatedb                 # 更新 locate 数据库
which command            # 查找命令的路径
whereis command          # 查找命令、源码、手册
type command             # 显示命令类型
whatis command           # 显示命令简短描述

# 文件内容搜索
grep "pattern" file      # 搜索文本
grep -r "pattern" dir    # 递归搜索目录
grep -i "pattern" file   # 忽略大小写
grep -v "pattern" file   # 反向匹配
grep -n "pattern" file   # 显示行号
grep -c "pattern" file   # 统计匹配行数
grep -l "pattern" *      # 只显示文件名
grep -A 3 "pattern" file # 显示匹配行及后 3 行
grep -B 3 "pattern" file # 显示匹配行及前 3 行
grep -C 3 "pattern" file # 显示匹配行及前后 3 行
egrep "pat1|pat2" file   # 扩展正则表达式
fgrep "string" file      # 快速固定字符串搜索
zgrep "pattern" file.gz  # 搜索压缩文件

# 文件比较
diff file1 file2         # 比较文件差异
diff -u file1 file2      # 统一格式显示差异
diff -r dir1 dir2        # 递归比较目录
cmp file1 file2          # 字节级比较文件
comm file1 file2         # 比较已排序的文件
vimdiff file1 file2      # 使用 Vim 可视化比较
sdiff file1 file2        # 并排比较
patch file patch.diff    # 应用补丁
```

## 二、文件权限和属性

```bash
# 权限管理
chmod 755 file           # 设置权限（数字方式）
chmod u+x file           # 给所有者添加执行权限
chmod g-w file           # 移除组写权限
chmod o=r file           # 设置其他人只读
chmod -R 755 dir         # 递归设置目录权限
chmod a+x file           # 所有人添加执行权限

# 所有权管理
chown user file          # 改变文件所有者
chown user:group file    # 改变所有者和组
chown -R user dir        # 递归改变目录所有权
chgrp group file         # 改变文件所属组

# 特殊权限
chmod u+s file           # 设置 SUID
chmod g+s dir            # 设置 SGID
chmod +t dir             # 设置 Sticky Bit
chmod 4755 file          # SUID + 755
chmod 2755 dir           # SGID + 755
chmod 1777 dir           # Sticky + 777

# 访问控制列表（ACL）
getfacl file             # 查看 ACL
setfacl -m u:user:rw file    # 设置用户 ACL
setfacl -m g:group:r file    # 设置组 ACL
setfacl -x u:user file       # 删除用户 ACL
setfacl -b file              # 删除所有 ACL
setfacl -R -m u:user:rw dir  # 递归设置 ACL

# 文件属性
chattr +i file           # 设置不可修改属性
chattr -i file           # 移除不可修改属性
chattr +a file           # 只能追加内容
lsattr file              # 查看文件属性
stat file                # 显示文件详细信息
file file                # 识别文件类型

umask                    # 查看默认权限掩码
umask 022                # 设置默认权限掩码
```

## 三、压缩和归档

```bash
# tar 归档
tar -cvf archive.tar files       # 创建归档
tar -xvf archive.tar             # 解压归档
tar -tvf archive.tar             # 查看归档内容
tar -rvf archive.tar newfile     # 向归档添加文件
tar -uvf archive.tar file        # 更新归档中的文件
tar -czf archive.tar.gz files    # 创建 gzip 压缩归档
tar -xzf archive.tar.gz          # 解压 gzip 归档
tar -cjf archive.tar.bz2 files   # 创建 bzip2 压缩归档
tar -xjf archive.tar.bz2         # 解压 bzip2 归档
tar -cJf archive.tar.xz files    # 创建 xz 压缩归档
tar -xJf archive.tar.xz          # 解压 xz 归档

# gzip 压缩
gzip file                # 压缩文件（删除原文件）
gzip -k file             # 压缩文件（保留原文件）
gzip -d file.gz          # 解压文件
gunzip file.gz           # 解压文件
gzip -9 file             # 最大压缩率
gzip -1 file             # 最快压缩
gzcat file.gz            # 查看压缩文件内容
zcat file.gz             # 查看压缩文件内容
zless file.gz            # 分页查看压缩文件
zmore file.gz            # 分页查看压缩文件
zdiff file1.gz file2.gz  # 比较压缩文件

# bzip2 压缩
bzip2 file               # 压缩文件
bzip2 -d file.bz2        # 解压文件
bunzip2 file.bz2         # 解压文件
bzcat file.bz2           # 查看压缩文件内容
bzip2 -9 file            # 最大压缩率

# xz 压缩
xz file                  # 压缩文件
xz -d file.xz            # 解压文件
unxz file.xz             # 解压文件
xzcat file.xz            # 查看压缩文件内容
xz -9 file               # 最大压缩率

# zip 压缩
zip archive.zip files    # 创建 zip 归档
zip -r archive.zip dir   # 递归压缩目录
unzip archive.zip        # 解压 zip 文件
unzip -l archive.zip     # 查看 zip 内容
unzip -d /path archive.zip   # 解压到指定目录
zipinfo archive.zip      # 显示 zip 详细信息

# 其他压缩工具
7z a archive.7z files    # 创建 7z 归档
7z x archive.7z          # 解压 7z 归档
7z l archive.7z          # 查看 7z 内容
rar a archive.rar files  # 创建 rar 归档
unrar x archive.rar      # 解压 rar 归档
compress file            # 使用 compress 压缩
uncompress file.Z        # 解压 .Z 文件
zstd file                # 使用 zstd 压缩
unzstd file.zst          # 解压 zstd 文件
```

## 四、系统信息

```bash
# 系统基本信息
uname -a                 # 显示所有系统信息
uname -r                 # 显示内核版本
uname -m                 # 显示机器架构
hostname                 # 显示主机名
hostnamectl              # 显示主机详细信息
uptime                   # 显示系统运行时间
date                     # 显示日期时间
cal                      # 显示日历
timedatectl              # 显示时间设置
who                      # 显示登录用户
whoami                   # 显示当前用户
w                        # 显示登录用户及其活动
last                     # 显示最近登录记录
lastlog                  # 显示所有用户最后登录时间
id                       # 显示用户和组 ID
groups                   # 显示用户所属组
finger username          # 显示用户信息

# 发行版信息
lsb_release -a           # 显示发行版信息
cat /etc/os-release      # 查看系统版本
cat /etc/issue           # 查看发行版信息

# 硬件信息
lscpu                    # 显示 CPU 信息
lshw                     # 显示硬件信息
lshw -short              # 简短硬件信息
lspci                    # 显示 PCI 设备
lspci -v                 # 详细 PCI 信息
lsusb                    # 显示 USB 设备
lsusb -v                 # 详细 USB 信息
lsblk                    # 显示块设备
lsblk -f                 # 显示文件系统信息
dmidecode                # 显示 DMI/SMBIOS 信息
dmidecode -t memory      # 显示内存信息
dmidecode -t processor   # 显示处理器信息
dmidecode -t bios        # 显示 BIOS 信息
hdparm -I /dev/sda       # 显示硬盘信息
smartctl -a /dev/sda     # 显示硬盘 SMART 信息

# 内存和 CPU
free                     # 显示内存使用
free -h                  # 人类可读格式
free -m                  # 以 MB 显示
vmstat                   # 显示虚拟内存统计
vmstat 1                 # 每秒更新一次
mpstat                   # 显示 CPU 统计
iostat                   # 显示 I/O 统计
sar                      # 系统活动报告
top                      # 实时进程监控
htop                     # 增强版 top
atop                     # 高级系统监控
glances                  # 系统监控工具
nmon                     # 性能监控工具

# 磁盘信息
df                       # 显示磁盘使用
df -h                    # 人类可读格式
df -i                    # 显示 inode 使用
du                       # 显示目录大小
du -sh dir               # 显示目录总大小
du -h --max-depth=1      # 显示一级子目录大小
ncdu                     # 交互式磁盘使用分析
fdisk -l                 # 显示磁盘分区
parted -l                # 显示分区信息
blkid                    # 显示块设备 UUID
findmnt                  # 显示挂载点
mount                    # 显示已挂载文件系统
```

## 五、进程管理

```bash
# 查看进程
ps                       # 显示当前终端进程
ps aux                   # 显示所有进程
ps -ef                   # 显示所有进程（另一种格式）
ps -u username           # 显示指定用户进程
ps -C command            # 显示指定命令的进程
pstree                   # 树状显示进程
pstree -p                # 显示进程 PID
pgrep process_name       # 查找进程 PID
pidof process_name       # 查找进程 PID

# 进程控制
kill PID                 # 终止进程
kill -9 PID              # 强制终止进程
kill -15 PID             # 正常终止进程（默认）
killall process_name     # 按名称终止进程
pkill process_name       # 按名称终止进程
pkill -u username        # 终止指定用户的进程
xkill                    # 图形界面点击终止程序

# 进程优先级
nice -n 10 command       # 以指定优先级运行命令
renice -n 5 -p PID       # 改变进程优先级
ionice -c 3 -p PID       # 设置 I/O 优先级

# 后台任务
command &                # 后台运行命令
jobs                     # 显示后台任务
fg %1                    # 将任务调到前台
bg %1                    # 继续后台任务
disown %1                # 从任务列表移除
nohup command &          # 忽略挂断信号运行
screen                   # 终端复用器
tmux                     # 终端复用器
at now + 1 hour          # 定时执行任务
batch                    # 系统负载低时执行任务

# 进程监控
strace command           # 跟踪系统调用
strace -p PID            # 跟踪运行中的进程
ltrace command           # 跟踪库函数调用
lsof                     # 列出打开的文件
lsof -p PID              # 显示进程打开的文件
lsof -i :80              # 显示使用端口 80 的进程
lsof -u username         # 显示用户打开的文件
fuser -v /path           # 显示使用文件的进程
fuser -k /path           # 终止使用文件的进程
```

## 六、用户和组管理

```bash
# 用户管理
useradd username         # 创建用户
useradd -m username      # 创建用户并创建家目录
useradd -s /bin/bash username  # 指定 shell
userdel username         # 删除用户
userdel -r username      # 删除用户及家目录
usermod -l newname oldname     # 重命名用户
usermod -aG group username     # 添加用户到组
passwd username          # 设置用户密码
passwd -l username       # 锁定用户
passwd -u username       # 解锁用户
passwd -d username       # 删除用户密码
chage -l username        # 查看密码过期信息
chage -M 90 username     # 设置密码 90 天过期
chfn username            # 修改用户信息
chsh username            # 修改用户 shell

# 组管理
groupadd groupname       # 创建组
groupdel groupname       # 删除组
groupmod -n newname oldname    # 重命名组
gpasswd -a user group    # 添加用户到组
gpasswd -d user group    # 从组中删除用户
gpasswd -A user group    # 设置组管理员
newgrp groupname         # 切换当前组

# 用户切换
su username              # 切换用户
su -                     # 切换到 root
su - username            # 切换用户并加载环境
sudo command             # 以 root 权限执行命令
sudo -i                  # 切换到 root shell
sudo -u user command     # 以指定用户执行命令
sudo -l                  # 列出 sudo 权限
visudo                   # 编辑 sudoers 文件

# 查看用户信息
cat /etc/passwd          # 查看所有用户
cat /etc/group           # 查看所有组
cat /etc/shadow          # 查看密码信息（需 root）
getent passwd username   # 查看用户信息
getent group groupname   # 查看组信息
lid -g groupname         # 查看组成员
members groupname        # 查看组成员
```

## 七、网络管理

```bash
# 网络接口
ifconfig                 # 显示网络接口（旧）
ifconfig eth0            # 显示指定接口
ifconfig eth0 up         # 启用接口
ifconfig eth0 down       # 禁用接口
ip addr                  # 显示 IP 地址（新）
ip addr show             # 显示所有接口
ip addr add 192.168.1.100/24 dev eth0  # 添加 IP
ip addr del 192.168.1.100/24 dev eth0  # 删除 IP
ip link                  # 显示网络接口
ip link set eth0 up      # 启用接口
ip link set eth0 down    # 禁用接口
ip route                 # 显示路由表
ip route add default via 192.168.1.1   # 添加默认路由
ip route del default     # 删除默认路由
ip neigh                 # 显示 ARP 缓存

# 网络连接
ping host                # 测试连接
ping -c 4 host           # 发送 4 个包
ping6 host               # IPv6 ping
traceroute host          # 跟踪路由
tracepath host           # 跟踪路径
mtr host                 # 网络诊断工具
netstat -tuln            # 显示监听端口
netstat -an              # 显示所有连接
netstat -r               # 显示路由表
ss -tuln                 # 显示监听端口（新）
ss -s                    # 显示统计信息
ss -t                    # 显示 TCP 连接
ss -u                    # 显示 UDP 连接

# DNS 和主机名
nslookup domain          # DNS 查询
nslookup domain 8.8.8.8  # 指定 DNS 服务器查询
dig domain               # DNS 查询（详细）
dig @8.8.8.8 domain      # 指定 DNS 服务器
dig +short domain        # 简短输出
dig -x IP                # 反向 DNS 查询
host domain              # DNS 查询
host -t MX domain        # 查询 MX 记录
whois domain             # 查询域名信息
getent hosts domain      # 查询主机名

# 网络配置
dhclient                 # 获取 DHCP 地址
dhclient -r              # 释放 DHCP 地址
nmcli                    # NetworkManager 命令行
nmcli device             # 显示设备
nmcli connection         # 显示连接
nmcli connection up id   # 启用连接
nmcli connection down id # 禁用连接
nmtui                    # NetworkManager 文本界面
systemctl restart networking  # 重启网络服务
systemctl restart NetworkManager  # 重启 NetworkManager

# 防火墙
ufw status               # 查看防火墙状态
ufw enable               # 启用防火墙
ufw disable              # 禁用防火墙
ufw allow 22             # 允许端口 22
ufw deny 80              # 拒绝端口 80
ufw delete allow 22      # 删除规则
ufw allow from 192.168.1.0/24  # 允许网段
iptables -L              # 查看 iptables 规则
iptables -F              # 清空规则
iptables -A INPUT -p tcp --dport 22 -j ACCEPT  # 添加规则
iptables-save            # 保存规则
iptables-restore         # 恢复规则

# 网络工具
wget url                 # 下载文件
wget -c url              # 断点续传
wget -O file url         # 指定保存文件名
wget -r url              # 递归下载
curl url                 # 获取 URL 内容
curl -O url              # 下载文件
curl -I url              # 获取 HTTP 头
curl -X POST url         # POST 请求
curl -d "data" url       # 发送数据
aria2c url               # 多线程下载
rsync -av src dest       # 同步文件
rsync -avz src user@host:dest  # 远程同步
scp file user@host:/path # 远程复制文件
scp -r dir user@host:/path     # 远程复制目录
sftp user@host           # SFTP 连接

# 网络监控
tcpdump                  # 抓包工具
tcpdump -i eth0          # 指定接口抓包
tcpdump -w file.pcap     # 保存到文件
tcpdump -r file.pcap     # 读取抓包文件
tcpdump port 80          # 抓取指定端口
wireshark                # 图形界面抓包工具
tshark                   # Wireshark 命令行版
iftop                    # 实时流量监控
nethogs                  # 按进程显示流量
vnstat                   # 网络流量统计
iptraf                   # 交互式流量监控
bmon                     # 带宽监控
nload                    # 网络负载监控
speedtest-cli            # 测速工具
iperf                    # 网络性能测试
iperf3                   # 网络性能测试（新版）
nc -l 1234               # 监听端口（netcat）
nc host 1234             # 连接端口
telnet host port         # Telnet 连接
nmap host                # 端口扫描
nmap -sP 192.168.1.0/24  # 网络扫描
```

## 八、软件包管理

```bash
# APT 包管理（Debian/Ubuntu）
apt update               # 更新软件包列表
apt upgrade              # 升级所有软件包
apt full-upgrade         # 完全升级（处理依赖）
apt install package      # 安装软件包
apt install -y package   # 自动确认安装
apt remove package       # 删除软件包
apt purge package        # 删除软件包及配置
apt autoremove           # 删除不需要的依赖
apt search keyword       # 搜索软件包
apt show package         # 显示软件包信息
apt list --installed     # 列出已安装软件包
apt list --upgradable    # 列出可升级软件包
apt-cache search keyword # 搜索软件包
apt-cache show package   # 显示软件包详情
apt-cache policy package # 显示软件包版本策略
apt-cache depends package    # 显示依赖关系
apt-cache rdepends package   # 显示反向依赖

# APT 高级
apt-get update           # 更新软件包列表
apt-get upgrade          # 升级软件包
apt-get dist-upgrade     # 发行版升级
apt-get install package  # 安装软件包
apt-get remove package   # 删除软件包
apt-get clean            # 清理下载的包文件
apt-get autoclean        # 清理旧的包文件
apt-mark hold package    # 锁定软件包版本
apt-mark unhold package  # 解锁软件包

# DPKG 包管理
dpkg -i package.deb      # 安装 deb 包
dpkg -r package          # 删除软件包
dpkg -P package          # 删除软件包及配置
dpkg -l                  # 列出已安装软件包
dpkg -l | grep package   # 搜索已安装软件包
dpkg -L package          # 列出软件包文件
dpkg -S /path/to/file    # 查找文件属于哪个包
dpkg -s package          # 显示软件包状态
dpkg --configure -a      # 配置所有未配置的包
dpkg-reconfigure package # 重新配置软件包

# Snap 包管理
snap list                # 列出已安装 snap
snap find keyword        # 搜索 snap
snap install package     # 安装 snap
snap remove package      # 删除 snap
snap refresh             # 更新所有 snap
snap refresh package     # 更新指定 snap
snap info package        # 显示 snap 信息
snap revert package      # 回滚 snap

# Flatpak 包管理
flatpak list             # 列出已安装应用
flatpak search keyword   # 搜索应用
flatpak install app      # 安装应用
flatpak uninstall app    # 删除应用
flatpak update           # 更新所有应用
flatpak run app          # 运行应用

# PPA 管理
add-apt-repository ppa:user/ppa  # 添加 PPA
add-apt-repository --remove ppa:user/ppa  # 删除 PPA
ls /etc/apt/sources.list.d/      # 查看 PPA 列表
```

## 九、服务管理（Systemd）

```bash
# 服务控制
systemctl start service      # 启动服务
systemctl stop service       # 停止服务
systemctl restart service    # 重启服务
systemctl reload service     # 重新加载配置
systemctl status service     # 查看服务状态
systemctl enable service     # 开机启动
systemctl disable service    # 禁用开机启动
systemctl is-enabled service # 检查是否开机启动
systemctl is-active service  # 检查服务是否运行
systemctl mask service       # 屏蔽服务
systemctl unmask service     # 取消屏蔽

# 服务查询
systemctl list-units         # 列出所有单元
systemctl list-units --type=service  # 列出所有服务
systemctl list-unit-files    # 列出所有单元文件
systemctl list-dependencies service  # 显示依赖关系
systemctl show service       # 显示服务属性

# 系统控制
systemctl reboot             # 重启系统
systemctl poweroff           # 关机
systemctl suspend            # 挂起
systemctl hibernate          # 休眠
systemctl hybrid-sleep       # 混合休眠
systemctl daemon-reload      # 重新加载 systemd 配置

# 日志查看
journalctl                   # 查看所有日志
journalctl -u service        # 查看服务日志
journalctl -f                # 实时跟踪日志
journalctl -b                # 查看本次启动日志
journalctl -b -1             # 查看上次启动日志
journalctl --since "1 hour ago"  # 查看最近 1 小时日志
journalctl --since "2023-01-01"  # 查看指定日期后日志
journalctl -p err            # 查看错误日志
journalctl --disk-usage      # 查看日志占用空间
journalctl --vacuum-size=100M    # 清理日志到 100M
journalctl --vacuum-time=1w      # 清理 1 周前的日志

# 传统服务管理（SysVinit）
service service_name start   # 启动服务
service service_name stop    # 停止服务
service service_name restart # 重启服务
service service_name status  # 查看状态
service --status-all         # 查看所有服务状态
update-rc.d service enable   # 开机启动
update-rc.d service disable  # 禁用开机启动
```

## 十、磁盘和文件系统

```bash
# 磁盘分区
fdisk /dev/sda           # 磁盘分区工具
fdisk -l                 # 列出所有分区
cfdisk /dev/sda          # 交互式分区工具
parted /dev/sda          # 高级分区工具
gparted                  # 图形界面分区工具
gdisk /dev/sda           # GPT 分区工具

# 文件系统创建
mkfs.ext4 /dev/sda1      # 创建 ext4 文件系统
mkfs.ext3 /dev/sda1      # 创建 ext3 文件系统
mkfs.xfs /dev/sda1       # 创建 xfs 文件系统
mkfs.btrfs /dev/sda1     # 创建 btrfs 文件系统
mkfs.vfat /dev/sda1      # 创建 FAT32 文件系统
mkfs.ntfs /dev/sda1      # 创建 NTFS 文件系统
mkswap /dev/sda2         # 创建交换分区
swapon /dev/sda2         # 启用交换分区
swapoff /dev/sda2        # 禁用交换分区

# 挂载和卸载
mount /dev/sda1 /mnt     # 挂载分区
mount -t ext4 /dev/sda1 /mnt  # 指定文件系统类型
mount -o ro /dev/sda1 /mnt    # 只读挂载
mount -a                 # 挂载 /etc/fstab 中的所有文件系统
umount /mnt              # 卸载
umount -f /mnt           # 强制卸载
umount -l /mnt           # 懒卸载
eject /dev/cdrom         # 弹出光盘

# 文件系统检查和修复
fsck /dev/sda1           # 检查文件系统
fsck -y /dev/sda1        # 自动修复
e2fsck /dev/sda1         # 检查 ext 文件系统
e2fsck -f /dev/sda1      # 强制检查
tune2fs -l /dev/sda1     # 显示文件系统信息
tune2fs -c 30 /dev/sda1  # 设置检查间隔
tune2fs -i 30d /dev/sda1 # 设置检查时间间隔
dumpe2fs /dev/sda1       # 显示详细文件系统信息
debugfs /dev/sda1        # 调试文件系统

# LVM 逻辑卷管理
pvcreate /dev/sda1       # 创建物理卷
pvdisplay                # 显示物理卷
pvs                      # 简短显示物理卷
vgcreate vg_name /dev/sda1   # 创建卷组
vgdisplay                # 显示卷组
vgs                      # 简短显示卷组
vgextend vg_name /dev/sdb1   # 扩展卷组
lvcreate -L 10G -n lv_name vg_name  # 创建逻辑卷
lvdisplay                # 显示逻辑卷
lvs                      # 简短显示逻辑卷
lvextend -L +5G /dev/vg_name/lv_name  # 扩展逻辑卷
lvreduce -L -5G /dev/vg_name/lv_name  # 缩小逻辑卷
resize2fs /dev/vg_name/lv_name        # 调整文件系统大小

# RAID 管理
mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sda1 /dev/sdb1  # 创建 RAID
mdadm --detail /dev/md0  # 显示 RAID 详情
mdadm --stop /dev/md0    # 停止 RAID
mdadm --assemble /dev/md0 /dev/sda1 /dev/sdb1  # 组装 RAID
cat /proc/mdstat         # 查看 RAID 状态
```

## 十一、文本处理

```bash
# 基础文本处理
echo "text"              # 输出文本
printf "format" args     # 格式化输出
wc file                  # 统计行数、字数、字节数
wc -l file               # 统计行数
wc -w file               # 统计字数
wc -c file               # 统计字节数

sort file                # 排序
sort -r file             # 反向排序
sort -n file             # 数字排序
sort -u file             # 排序并去重
sort -k 2 file           # 按第 2 列排序
uniq file                # 去除重复行
uniq -c file             # 统计重复次数
uniq -d file             # 只显示重复行
cut -d: -f1 file         # 按分隔符切割
cut -c1-10 file          # 按字符位置切割
paste file1 file2        # 合并文件
join file1 file2         # 按字段连接文件
tr 'a-z' 'A-Z' < file    # 字符转换
tr -d 'abc' < file       # 删除字符
tr -s ' ' < file         # 压缩重复字符
expand file              # 将 tab 转为空格
unexpand file            # 将空格转为 tab
column -t file           # 列对齐显示
fmt file                 # 格式化文本
fold -w 80 file          # 按宽度折行
split -l 1000 file       # 按行数分割文件
split -b 100M file       # 按大小分割文件
csplit file /pattern/    # 按模式分割文件

# 高级文本处理
sed 's/old/new/' file    # 替换第一个匹配
sed 's/old/new/g' file   # 替换所有匹配
sed -i 's/old/new/g' file    # 直接修改文件
sed -n '10,20p' file     # 打印 10-20 行
sed '10d' file           # 删除第 10 行
sed '/pattern/d' file    # 删除匹配行
sed '/pattern/a\text' file   # 在匹配行后添加
sed '/pattern/i\text' file   # 在匹配行前插入
awk '{print $1}' file    # 打印第 1 列
awk -F: '{print $1}' file    # 指定分隔符
awk '$3 > 100' file      # 条件过滤
awk '{sum+=$1} END {print sum}' file  # 求和
awk 'NR==10,NR==20' file # 打印 10-20 行
perl -pe 's/old/new/g' file  # Perl 替换
perl -ne 'print if /pattern/' file  # Perl 过滤

# 编码转换
iconv -f GBK -t UTF-8 file   # 转换编码
iconv -l                 # 列出支持的编码
dos2unix file            # DOS 转 Unix 格式
unix2dos file            # Unix 转 DOS 格式
recode latin1..utf8 file # 编码转换
```

## 十二、Shell 脚本和编程

```bash
# Shell 变量
var=value                # 定义变量
echo $var                # 使用变量
export var=value         # 导出环境变量
unset var                # 删除变量
readonly var=value       # 只读变量

env                      # 显示所有环境变量
printenv                 # 显示环境变量
set                      # 显示所有变量
declare -p               # 显示所有变量及属性

# 特殊变量
$0                       # 脚本名称
$1, $2, ...              # 位置参数
$#                       # 参数个数
$@                       # 所有参数
$*                       # 所有参数（作为一个字符串）
$?                       # 上一命令退出状态
$$                       # 当前进程 PID
$!                       # 后台进程 PID

# 条件测试
test -f file             # 测试文件存在
[ -f file ]              # 测试文件存在
[[ -f file ]]            # 增强测试
test -d dir              # 测试目录存在
test -r file             # 测试可读
test -w file             # 测试可写
test -x file             # 测试可执行
test -s file             # 测试文件非空
test str1 = str2         # 字符串相等
test num1 -eq num2       # 数字相等
test num1 -gt num2       # 大于
test num1 -lt num2       # 小于

# 流程控制
if [ condition ]; then
    commands
fi

if [ condition ]; then
    commands
else
    commands
fi

for var in list; do
    commands
done

while [ condition ]; do
    commands
done

case $var in
    pattern1) commands ;;
    pattern2) commands ;;
    *) commands ;;
esac

# 函数
function_name() {
    commands
    return value
}

# 调试
bash -x script.sh        # 调试模式运行
bash -n script.sh        # 检查语法
set -x                   # 开启调试
set +x                   # 关闭调试
set -e                   # 遇错退出
set -u                   # 使用未定义变量时报错
```

## 十三、定时任务

```bash
# Cron 定时任务
crontab -e               # 编辑当前用户 crontab
crontab -l               # 列出当前用户 crontab
crontab -r               # 删除当前用户 crontab
crontab -u user -e       # 编辑指定用户 crontab

# Cron 时间格式
# 分 时 日 月 周 命令
# * * * * * command
# 0 2 * * * command      # 每天 2:00 执行
# */5 * * * * command    # 每 5 分钟执行
# 0 0 * * 0 command      # 每周日 0:00 执行
# 0 0 1 * * command      # 每月 1 号 0:00 执行

# Anacron（适合不持续运行的系统）
cat /etc/anacrontab      # 查看 anacron 配置
anacron -T               # 测试配置
anacron -n               # 立即运行所有任务

# At 一次性定时任务
at 10:00                 # 在 10:00 执行
at now + 1 hour          # 1 小时后执行
at 10:00 tomorrow        # 明天 10:00 执行
at 10:00 2023-12-31      # 指定日期执行
atq                      # 查看待执行任务
atrm job_number          # 删除任务
batch                    # 系统负载低时执行
```

## 十四、系统日志

```bash
# 日志文件位置
/var/log/syslog          # 系统日志
/var/log/auth.log        # 认证日志
/var/log/kern.log        # 内核日志
/var/log/dmesg           # 启动日志
/var/log/messages        # 通用消息日志
/var/log/apache2/        # Apache 日志
/var/log/nginx/          # Nginx 日志
/var/log/mysql/          # MySQL 日志

# 日志查看
dmesg                    # 查看内核日志
dmesg -T                 # 显示时间戳
dmesg -l err             # 只显示错误
dmesg -w                 # 实时监控
logger "message"         # 写入系统日志
logger -p user.info "message"  # 指定优先级
last                     # 查看登录历史
lastb                    # 查看失败登录
lastlog                  # 查看最后登录时间
w                        # 查看当前登录用户
who                      # 查看登录用户
ac                       # 统计用户连接时间
sa                       # 统计命令使用情况

# Rsyslog 配置
/etc/rsyslog.conf        # 主配置文件
/etc/rsyslog.d/          # 配置目录
systemctl restart rsyslog    # 重启 rsyslog
logger -t TAG "message"  # 带标签记录日志
```

## 十五、性能监控和调优

```bash
# 系统性能
uptime                   # 系统负载
top                      # 实时进程监控
htop                     # 增强版 top
atop                     # 高级监控

glances                  # 系统监控工具
nmon                     # 性能监控
dstat                    # 系统资源统计
vmstat 1                 # 虚拟内存统计
iostat 1                 # I/O 统计
mpstat 1                 # CPU 统计
pidstat 1                # 进程统计
sar -u 1 10              # CPU 使用率
sar -r 1 10              # 内存使用
sar -b 1 10              # I/O 统计
sar -n DEV 1 10          # 网络统计

# 内存分析
free -h                  # 内存使用
vmstat -s                # 内存统计
slabtop                  # 内核 slab 缓存
smem                     # 内存报告工具
ps aux --sort=-rss       # 按内存排序进程
pmap PID                 # 进程内存映射

# 磁盘性能
iotop                    # I/O 监控
iotop -o                 # 只显示有 I/O 的进程
iostat -x 1              # 扩展 I/O 统计
ioping /path             # 磁盘延迟测试
fio                      # 磁盘性能测试
hdparm -tT /dev/sda      # 磁盘读取测试
dd if=/dev/zero of=test bs=1M count=1024  # 写入测试
sync; echo 3 > /proc/sys/vm/drop_caches   # 清理缓存

# 网络性能
iftop                    # 网络流量监控
nethogs                  # 按进程显示网络使用
iptraf-ng                # 网络监控
bmon                     # 带宽监控
vnstat                   # 网络流量统计
ss -s                    # 网络连接统计
netstat -s               # 网络统计
ethtool eth0             # 网卡信息
ethtool -S eth0          # 网卡统计

# 进程分析
strace -c command        # 统计系统调用
strace -p PID            # 跟踪进程
ltrace command           # 跟踪库调用
perf top                 # 性能分析
perf record command      # 记录性能数据
perf report              # 分析性能数据
time command             # 测量命令执行时间
/usr/bin/time -v command # 详细时间统计
```

## 十六、安全和加密

```bash
# 用户安全
passwd                   # 修改密码
passwd -l user           # 锁定用户
passwd -u user           # 解锁用户
chage -l user            # 查看密码策略
chage -M 90 user         # 设置密码有效期
faillog                  # 查看登录失败记录
faillog -u user          # 查看指定用户失败记录

# SSH 安全
ssh-keygen               # 生成 SSH 密钥
ssh-keygen -t rsa -b 4096    # 生成 RSA 密钥
ssh-keygen -t ed25519    # 生成 Ed25519 密钥
ssh-copy-id user@host    # 复制公钥到服务器
ssh-add                  # 添加密钥到 agent
ssh-agent                # 启动 SSH agent
ssh -i keyfile user@host # 使用指定密钥连接

# 文件加密
gpg --gen-key            # 生成 GPG 密钥
gpg --list-keys          # 列出公钥
gpg --list-secret-keys   # 列出私钥
gpg -e -r user file      # 加密文件
gpg -d file.gpg          # 解密文件
gpg --sign file          # 签名文件
gpg --verify file.sig    # 验证签名
openssl enc -aes-256-cbc -in file -out file.enc  # OpenSSL 加密
openssl enc -d -aes-256-cbc -in file.enc -out file  # OpenSSL 解密
openssl genrsa -out key.pem 2048  # 生成 RSA 私钥
openssl rsa -in key.pem -pubout -out pub.pem  # 导出公钥

# 文件完整性
md5sum file              # 计算 MD5 校验和
md5sum -c file.md5       # 验证 MD5
sha1sum file             # 计算 SHA1 校验和
sha256sum file           # 计算 SHA256 校验和
sha512sum file           # 计算 SHA512 校验和
cksum file               # 计算 CRC 校验和
b2sum file               # 计算 BLAKE2 校验和

# 安全审计
lynis audit system       # 系统安全审计
rkhunter --check         # rootkit 检测
chkrootkit               # rootkit 检测
aide --check             # 文件完整性检查
tripwire --check         # 文件完整性检查
auditctl -l              # 查看审计规则
ausearch                 # 搜索审计日志
aureport                 # 审计报告

# SELinux
getenforce               # 查看 SELinux 状态
setenforce 0             # 临时禁用 SELinux
setenforce 1             # 临时启用 SELinux
sestatus                 # 显示 SELinux 状态
semanage                 # SELinux 策略管理
restorecon -R /path      # 恢复文件上下文
chcon -t type file       # 修改文件上下文
ls -Z                    # 显示 SELinux 上下文
ps -Z                    # 显示进程上下文

# AppArmor
aa-status                # 查看 AppArmor 状态
aa-enforce profile       # 强制模式
aa-complain profile      # 投诉模式
aa-disable profile       # 禁用配置文件
apparmor_parser -r profile   # 重新加载配置

```

## 十七、开发工具

```bash
# 编译工具
gcc file.c -o program    # 编译 C 程序
g++ file.cpp -o program  # 编译 C++ 程序
make                     # 使用 Makefile 编译
make clean               # 清理编译文件
make install             # 安装程序
cmake .                  # 生成 Makefile
./configure              # 配置编译选项
./configure --prefix=/usr/local  # 指定安装路径

# 版本控制（Git）
git init                 # 初始化仓库
git clone url            # 克隆仓库
git add file             # 添加文件到暂存区
git commit -m "message"  # 提交更改
git push                 # 推送到远程
git pull                 # 拉取远程更改
git status               # 查看状态
git log                  # 查看提交历史
git diff                 # 查看差异
git branch               # 查看分支
git checkout branch      # 切换分支
git merge branch         # 合并分支
git tag v1.0             # 创建标签
git stash                # 暂存更改
git stash pop            # 恢复暂存

# Python
python3 script.py        # 运行 Python 脚本
python3 -m venv venv     # 创建虚拟环境
source venv/bin/activate # 激活虚拟环境
pip install package      # 安装包
pip list                 # 列出已安装包
pip freeze > requirements.txt  # 导出依赖
pip install -r requirements.txt  # 安装依赖
python3 -m http.server   # 启动简单 HTTP 服务器

# Node.js
node script.js           # 运行 Node.js 脚本
npm init                 # 初始化项目
npm install package      # 安装包
npm install -g package   # 全局安装
npm list                 # 列出已安装包
npm update               # 更新包
npm run script           # 运行脚本
npx command              # 执行 npm 包命令
yarn install             # Yarn 安装依赖
yarn add package         # Yarn 添加包

# Java
javac Program.java       # 编译 Java 程序
java Program             # 运行 Java 程序
jar -cvf archive.jar files   # 创建 JAR 文件
jar -xvf archive.jar     # 解压 JAR 文件
mvn clean install        # Maven 构建
gradle build             # Gradle 构建

# Docker
docker ps                # 列出运行中的容器
docker ps -a             # 列出所有容器
docker images            # 列出镜像
docker pull image        # 拉取镜像
docker run image         # 运行容器
docker run -it image bash    # 交互式运行
docker exec -it container bash   # 进入容器
docker stop container    # 停止容器
docker rm container      # 删除容器
docker rmi image         # 删除镜像
docker build -t name .   # 构建镜像
docker logs container    # 查看容器日志
docker-compose up        # 启动服务
docker-compose down      # 停止服务

# 数据库
mysql -u user -p         # 连接 MySQL
mysqldump -u user -p db > backup.sql  # 备份数据库
mysql -u user -p db < backup.sql      # 恢复数据库
psql -U user -d database # 连接 PostgreSQL
pg_dump database > backup.sql  # 备份 PostgreSQL
redis-cli                # 连接 Redis
mongo                    # 连接 MongoDB
sqlite3 database.db      # 连接 SQLite
```

## 十八、多媒体处理

```bash
# 图片处理
convert input.jpg output.png     # 转换图片格式
convert -resize 50% input.jpg output.jpg  # 调整大小
convert -rotate 90 input.jpg output.jpg   # 旋转图片
convert -quality 80 input.jpg output.jpg  # 调整质量
identify image.jpg       # 查看图片信息
mogrify -resize 50% *.jpg    # 批量处理
ffmpeg -i video.mp4 -ss 00:00:10 -vframes 1 output.jpg  # 视频截图

# 音频处理
ffmpeg -i input.mp3 output.wav   # 转换音频格式
ffmpeg -i input.mp3 -b:a 192k output.mp3  # 调整比特率
ffmpeg -i input.mp3 -ss 00:00:30 -t 00:01:00 output.mp3  # 剪切音频
sox input.wav output.wav speed 1.5   # 调整播放速度
lame input.wav output.mp3    # 转换为 MP3

# 视频处理
ffmpeg -i input.mp4 output.avi   # 转换视频格式
ffmpeg -i input.mp4 -vcodec h264 output.mp4  # 转换编码
ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:30 output.mp4  # 剪切视频
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4  # 调整分辨率
ffmpeg -i video.mp4 -i audio.mp3 -c copy output.mp4  # 合并音视频
ffmpeg -i input.mp4 -an output.mp4   # 移除音频
ffprobe video.mp4        # 查看视频信息

# PDF 处理
pdftk input.pdf output output.pdf compress  # 压缩 PDF
pdftk 1.pdf 2.pdf cat output merged.pdf     # 合并 PDF
pdftk input.pdf burst                       # 拆分 PDF
pdftk input.pdf cat 1-3 output output.pdf   # 提取页面
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf  # 压缩 PDF
pdftotext file.pdf       # PDF 转文本
pdfimages file.pdf prefix    # 提取 PDF 图片
```

## 十九、系统备份和恢复

```bash
# 文件备份
cp -a source dest        # 完整复制
rsync -av source dest    # 同步备份
rsync -avz source user@host:dest  # 远程备份
rsync -av --delete source dest    # 镜像备份
tar -czf backup.tar.gz /path      # 打包备份
tar -xzf backup.tar.gz            # 恢复备份

# 系统备份
dd if=/dev/sda of=/backup/sda.img     # 磁盘镜像
dd if=/dev/sda of=/dev/sdb            # 克隆磁盘
dd if=/dev/sda | gzip > sda.img.gz    # 压缩备份
gunzip -c sda.img.gz | dd of=/dev/sda # 恢复压缩备份
partclone.ext4 -c -s /dev/sda1 -o sda1.img  # 分区备份
partclone.ext4 -r -s sda1.img -o /dev/sda1  # 分区恢复
clonezilla               # Clonezilla 备份工具

# 增量备份
rsnapshot                # 快照备份工具
duplicity                # 加密增量备份
borgbackup               # 去重备份
restic                   # 快速备份工具
timeshift                # 系统快照工具

# 数据库备份
mysqldump -u user -p --all-databases > all_db.sql  # 备份所有数据库
mysqldump -u user -p db > db.sql     # 备份单个数据库
pg_dumpall > all_db.sql  # 备份所有 PostgreSQL 数据库
mongodump                # 备份 MongoDB
```

## 二十、冷门但有用的命令

```bash
# 系统工具
yes                      # 持续输出 y
yes "text"               # 持续输出指定文本
seq 1 10                 # 生成数字序列
seq 1 2 10               # 生成步长为 2 的序列
factor 100               # 质因数分解
bc                       # 计算器
bc -l                    # 科学计算器
expr 1 + 2               # 表达式计算

cal -3                   # 显示三个月日历
cal 2023                 # 显示全年日历
ncal                     # 垂直显示日历
banner "TEXT"            # 大字符显示
figlet "TEXT"            # ASCII 艺术字
toilet "TEXT"            # 彩色 ASCII 艺术字
cowsay "message"         # 牛说话
fortune                  # 随机名言
sl                       # 蒸汽火车动画
cmatrix                  # 黑客帝国效果
hollywood                # 黑客屏幕效果
asciiquarium             # ASCII 水族馆
oneko                    # 桌面小猫

# 文件操作
shuf file                # 随机打乱行
shuf -n 5 file           # 随机选择 5 行
tee file                 # 同时输出到屏幕和文件
tee -a file              # 追加到文件
script session.log       # 记录终端会话
scriptreplay session.log # 回放终端会话
look prefix              # 查找以指定前缀开头的单词
aspell check file        # 拼写检查
ispell file              # 拼写检查
iconv -f utf8 -t gbk file    # 编码转换
convmv -f gbk -t utf8 file   # 文件名编码转换

# 网络工具
ab -n 1000 -c 10 url     # Apache 压力测试
siege -c 10 -t 1M url    # 网站压力测试
wrk -t 4 -c 100 -d 30s url   # HTTP 压力测试
hping3 host              # 网络测试工具
arping host              # ARP ping
fping host1 host2        # 批量 ping
httping url              # HTTP ping
socat                    # 多功能网络工具
proxychains command      # 通过代理运行命令

# 进程和系统
watch command            # 定期执行命令
watch -n 1 command       # 每秒执行一次
watch -d command         # 高亮显示变化
timeout 10s command      # 限制命令执行时间
pv file > output         # 显示进度条
pv -cN source < file | pv -cN dest > output  # 多进度条
parallel command ::: args    # 并行执行命令
xargs -P 4 command       # 并行执行（4 个进程）
taskset -c 0,1 command   # 绑定 CPU 核心
chrt -f 99 command       # 设置实时优先级
ionice -c 1 -n 0 command # 设置 I/O 优先级

# 文本和数据
jq                       # JSON 处理器
jq '.' file.json         # 格式化 JSON
jq '.key' file.json      # 提取字段
yq                       # YAML 处理器
xmllint --format file.xml    # 格式化 XML
xmlstarlet               # XML 命令行工具
csvtool                  # CSV 处理工具
datamash                 # 数据统计工具
miller                   # CSV/JSON 处理
pandoc file.md -o file.pdf   # 文档格式转换
enscript file.txt -o file.ps # 转换为 PostScript
ps2pdf file.ps           # PostScript 转 PDF

# 硬件和底层
lsmod                    # 列出内核模块
modprobe module          # 加载内核模块
modprobe -r module       # 卸载内核模块
insmod module.ko         # 插入内核模块
rmmod module             # 移除内核模块
depmod                   # 生成模块依赖
dmesg -w                 # 实时查看内核消息
sysctl -a                # 显示所有内核参数
sysctl -w param=value    # 设置内核参数
ulimit -a                # 显示资源限制
ulimit -n 4096           # 设置文件描述符限制
ldconfig                 # 更新动态链接库缓存
ldconfig -p              # 显示缓存的库
ldd /bin/ls              # 显示程序依赖的库
nm binary                # 显示符号表
objdump -d binary        # 反汇编
readelf -h binary        # 读取 ELF 文件信息
strings binary           # 提取可打印字符串

# 虚拟化
virsh list               # 列出虚拟机
virsh start vm           # 启动虚拟机
virsh shutdown vm        # 关闭虚拟机
virt-install             # 安装虚拟机
virt-manager             # 虚拟机管理器
virt-clone               # 克隆虚拟机
qemu-img create -f qcow2 disk.qcow2 10G  # 创建虚拟磁盘
qemu-img convert -f qcow2 -O raw disk.qcow2 disk.raw  # 转换磁盘格式
vagrant up               # 启动 Vagrant 虚拟机
vagrant ssh              # SSH 连接虚拟机
lxc-create               # 创建 LXC 容器
lxc-start                # 启动容器
lxc-attach               # 连接容器

# 其他实用工具
inotifywait -m /path     # 监控文件变化
inotifywatch /path       # 统计文件事件
entr command             # 文件变化时执行命令
fswatch /path            # 文件系统监控
rename 's/old/new/' files    # 批量重命名
mmv "*.txt" "#1.bak"     # 批量移动/重命名
detox file               # 清理文件名
convmv -f gbk -t utf8 -r --notest .  # 批量转换文件名编码
symlinks -r /path        # 检查符号链接
namei -l /path/to/file   # 显示路径的符号链接
realpath file            # 显示绝对路径
basename /path/to/file   # 提取文件名
dirname /path/to/file    # 提取目录名
pathchk /path            # 检查路径有效性

# 系统维护和修复
dpkg --configure -a      # 配置所有未配置的包
apt --fix-broken install # 修复损坏的依赖
apt-get check            # 检查依赖关系
debsums -c               # 验证已安装包的完整性
deborphan                # 查找孤立的库文件
localepurge              # 删除不需要的语言文件
bleachbit                # 系统清理工具
fstrim -av               # 手动 TRIM SSD
hdparm -tT /dev/sda      # 测试硬盘速度
badblocks -sv /dev/sda   # 检查坏块
e4defrag /dev/sda1       # 碎片整理 ext4
btrfs scrub start /path  # Btrfs 文件系统检查
xfs_repair /dev/sda1     # 修复 XFS 文件系统
grub-install /dev/sda    # 重新安装 GRUB
update-grub              # 更新 GRUB 配置
update-initramfs -u      # 更新 initramfs

# 电源管理
systemctl suspend        # 挂起系统
systemctl hibernate      # 休眠系统
systemctl hybrid-sleep   # 混合睡眠
pm-suspend               # 挂起（旧方法）
pm-hibernate             # 休眠（旧方法）
powertop                 # 电源使用分析
tlp-stat                 # TLP 电源管理状态
acpi -V                  # 显示电池和温度信息
sensors                  # 显示硬件传感器信息
sensors-detect           # 检测硬件传感器
cpufreq-info             # 显示 CPU 频率信息
cpufreq-set -g performance   # 设置 CPU 性能模式
cpufreq-set -g powersave     # 设置 CPU 省电模式
laptop-mode-tools        # 笔记本电源管理

# 时间和时区
timedatectl              # 显示时间设置
timedatectl list-timezones   # 列出所有时区
timedatectl set-timezone Asia/Shanghai  # 设置时区
timedatectl set-time "2023-12-31 23:59:59"  # 设置时间
timedatectl set-ntp true # 启用 NTP 同步
hwclock --show           # 显示硬件时钟
hwclock --systohc        # 将系统时间写入硬件时钟
hwclock --hctosys        # 从硬件时钟读取时间
ntpdate pool.ntp.org     # 手动同步时间
chronyc sources          # 显示 NTP 源
chronyc tracking         # 显示同步状态

# 字体和显示
fc-list                  # 列出所有字体
fc-cache -fv             # 刷新字体缓存
fc-match "font name"     # 查找字体
xrandr                   # 显示器配置
xrandr --output HDMI-1 --mode 1920x1080  # 设置分辨率
xrandr --output HDMI-1 --rotate left     # 旋转显示器
xdpyinfo                 # 显示 X 服务器信息
xwininfo                 # 显示窗口信息
xprop                    # 显示窗口属性
xev                      # 监控 X 事件
xset dpms force off      # 关闭显示器
xset s off               # 禁用屏保
xset r rate 250 30       # 设置键盘重复率
setxkbmap -layout us     # 设置键盘布局

# 声音管理
alsamixer                # ALSA 音量控制
amixer                   # 命令行音量控制
amixer set Master 50%    # 设置音量
amixer set Master mute   # 静音
amixer set Master unmute # 取消静音
pactl list sinks         # 列出音频输出设备
pactl set-sink-volume 0 50%  # 设置音量
pactl set-sink-mute 0 toggle # 切换静音
pavucontrol              # PulseAudio 图形控制
speaker-test -c 2        # 测试扬声器
aplay -l                 # 列出播放设备
arecord -l               # 列出录音设备

# 蓝牙管理
bluetoothctl             # 蓝牙控制工具
bluetoothctl power on    # 打开蓝牙
bluetoothctl scan on     # 扫描设备
bluetoothctl pair MAC    # 配对设备
bluetoothctl connect MAC # 连接设备
bluetoothctl disconnect MAC  # 断开连接
hciconfig                # 蓝牙适配器配置
hciconfig hci0 up        # 启用蓝牙适配器
hcitool scan             # 扫描蓝牙设备
rfkill list              # 列出无线设备
rfkill unblock bluetooth # 解除蓝牙阻止

# 打印机管理
lpstat -p                # 列出打印机
lpstat -a                # 显示打印机状态
lpr file.pdf             # 打印文件
lpr -P printer file.pdf  # 指定打印机打印
lpq                      # 查看打印队列
lprm job_id              # 取消打印任务
lpadmin -p printer -E    # 启用打印机
lpadmin -x printer       # 删除打印机
cups-config --version    # 显示 CUPS 版本
cupsctl                  # CUPS 配置工具

# 内存和交换
swapon --show            # 显示交换空间
swapon -a                # 启用所有交换空间
swapoff -a               # 禁用所有交换空间
mkswap /dev/sda2         # 创建交换分区
swapon /dev/sda2         # 启用交换分区
fallocate -l 2G /swapfile    # 创建交换文件
dd if=/dev/zero of=/swapfile bs=1M count=2048  # 创建交换文件（旧方法）
sync                     # 同步缓存到磁盘
echo 3 > /proc/sys/vm/drop_caches  # 清理缓存
sysctl vm.swappiness=10  # 设置交换倾向
sysctl vm.vfs_cache_pressure=50  # 设置缓存压力
vmstat -s                # 虚拟内存统计
vmstat -d                # 磁盘统计
vmstat -p /dev/sda1      # 分区统计

# 内核和模块
uname -r                 # 显示内核版本
uname -a                 # 显示所有系统信息
lsmod                    # 列出已加载模块
modinfo module_name      # 显示模块信息
modprobe module          # 加载模块
modprobe -r module       # 卸载模块
insmod module.ko         # 插入模块
rmmod module             # 移除模块
depmod -a                # 生成模块依赖
dkms status              # 显示 DKMS 模块状态
dkms install module/version  # 安装 DKMS 模块
update-alternatives --config editor  # 选择默认编辑器
update-alternatives --config java    # 选择默认 Java

# 引导和启动
systemd-analyze          # 分析启动时间
systemd-analyze blame    # 显示启动耗时服务
systemd-analyze critical-chain   # 显示启动关键链
systemd-analyze plot > boot.svg  # 生成启动图表
systemctl list-dependencies  # 显示依赖关系
systemctl get-default    # 显示默认启动目标
systemctl set-default multi-user.target  # 设置默认启动目标
systemctl isolate rescue.target  # 切换到救援模式
systemctl rescue         # 进入救援模式
systemctl emergency      # 进入紧急模式
journalctl -xb           # 查看启动日志（详细）
journalctl -k            # 查看内核日志
dmesg -T                 # 显示内核消息（带时间戳）
dmesg -H                 # 人类可读格式显示

# 网络诊断高级
ss -tulpn                # 显示监听端口和进程
ss -s                    # 网络统计摘要
ss -o state established  # 显示已建立的连接
ss -K dst 192.168.1.100  # 强制关闭连接
ip -s link               # 显示网络接口统计
ip -s -s link            # 显示详细统计
ip monitor               # 监控网络变化
ip route get 8.8.8.8     # 查看到达目标的路由
ip rule list             # 显示路由规则
ip netns list            # 列出网络命名空间
ip netns exec ns1 command    # 在命名空间中执行命令
ethtool eth0             # 显示网卡信息
ethtool -S eth0          # 显示网卡统计
ethtool -i eth0          # 显示驱动信息
ethtool -k eth0          # 显示网卡特性
mii-tool eth0            # 显示网卡连接状态
route -n                 # 显示路由表（数字格式）
arp -a                   # 显示 ARP 缓存
arp -d host              # 删除 ARP 条目
arping -I eth0 192.168.1.1   # ARP ping

# 防火墙高级
ufw status numbered      # 显示规则编号
ufw delete 1             # 删除指定编号的规则
ufw allow proto tcp from 192.168.1.0/24 to any port 22  # 复杂规则
ufw logging on           # 启用日志
ufw reset                # 重置防火墙
iptables -L -n -v        # 详细显示规则
iptables -t nat -L       # 显示 NAT 表
iptables -t mangle -L    # 显示 mangle 表
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT  # 状态跟踪
iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables: "  # 限速日志
iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT  # 连接跟踪
nft list ruleset         # 显示 nftables 规则
nft flush ruleset        # 清空 nftables 规则
firewall-cmd --list-all  # 显示 firewalld 配置
firewall-cmd --add-port=80/tcp --permanent  # 永久添加端口
firewall-cmd --reload    # 重新加载配置

# 文件系统高级
tune2fs -l /dev/sda1     # 显示 ext 文件系统参数
tune2fs -O ^has_journal /dev/sda1  # 禁用日志
tune2fs -O has_journal /dev/sda1   # 启用日志
tune2fs -m 1 /dev/sda1   # 设置保留块百分比
resize2fs /dev/sda1      # 调整 ext 文件系统大小
xfs_growfs /mount/point  # 扩展 XFS 文件系统
btrfs filesystem show    # 显示 Btrfs 文件系统
btrfs filesystem df /path    # 显示 Btrfs 空间使用
btrfs subvolume list /path   # 列出子卷
btrfs subvolume create /path/subvol  # 创建子卷
btrfs subvolume snapshot /path /snapshot  # 创建快照
btrfs balance start /path    # 平衡文件系统
btrfs scrub start /path      # 数据校验
zfs list                 # 列出 ZFS 文件系统
zfs create pool/dataset  # 创建数据集
zfs snapshot pool/dataset@snap   # 创建快照
zfs rollback pool/dataset@snap   # 回滚快照
zpool status             # 显示存储池状态
zpool scrub pool         # 校验存储池

# 进程和资源限制
ulimit -a                # 显示所有限制
ulimit -n 65535          # 设置文件描述符限制
ulimit -u 4096           # 设置最大进程数
ulimit -c unlimited      # 启用核心转储
prlimit --pid PID        # 显示进程资源限制
prlimit --pid PID --nofile=4096  # 设置进程文件限制
cgcreate -g cpu:/mygroup # 创建 cgroup
cgset -r cpu.shares=512 mygroup  # 设置 CPU 份额
cgexec -g cpu:mygroup command    # 在 cgroup 中运行
systemd-cgls             # 显示 cgroup 树
systemd-cgtop            # cgroup 资源监控
cgroups                  # 显示 cgroup 信息

# 用户会话管理
loginctl                 # 显示会话
loginctl list-sessions   # 列出所有会话
loginctl show-session ID # 显示会话详情
loginctl terminate-session ID    # 终止会话
loginctl lock-session    # 锁定会话
loginctl unlock-session  # 解锁会话
loginctl enable-linger user  # 启用用户持久会话
loginctl disable-linger user # 禁用用户持久会话
w                        # 显示登录用户和活动
who -a                   # 显示所有登录信息
users                    # 显示登录用户名
pinky                    # 显示用户信息
finger                   # 显示用户详细信息

# 系统调试和跟踪
strace -c command        # 统计系统调用
strace -e open command   # 只跟踪 open 调用
strace -p PID -e trace=network   # 跟踪网络调用
ltrace command           # 跟踪库函数调用
perf top                 # 实时性能分析
perf record -a -g        # 记录系统性能
perf report              # 分析性能数据
perf stat command        # 性能统计
ftrace                   # 内核函数跟踪
trace-cmd record -e sched    # 记录调度事件
trace-cmd report         # 查看跟踪报告
bpftrace -l              # 列出可用的跟踪点
bpftrace -e 'tracepoint:syscalls:sys_enter_open { printf("%s\n", comm); }'  # BPF 跟踪
systemtap                # 系统跟踪工具
gdb program              # 调试程序
gdb -p PID               # 附加到进程
valgrind command         # 内存调试
valgrind --leak-check=full command   # 内存泄漏检查

# 硬件信息详细
inxi -F                  # 显示完整系统信息
hwinfo                   # 硬件信息工具
hwinfo --short           # 简短硬件信息
lshw -html > hardware.html   # 生成 HTML 报告
lscpu -e                 # 扩展 CPU 信息
lstopo                   # 显示硬件拓扑
numactl --hardware       # 显示 NUMA 信息
dmidecode -t 0           # BIOS 信息
dmidecode -t 1           # 系统信息
dmidecode -t 2           # 主板信息
dmidecode -t 4           # 处理器信息
dmidecode -t 16          # 内存阵列信息
dmidecode -t 17          # 内存设备信息
biosdecode               # 解码 BIOS 信息
vpddecode                # VPD 数据解码
ownership                # 显示所有权信息
```

## 二十一、快捷键和技巧

```bash
# 命令行快捷键
Ctrl+A                   # 移到行首
Ctrl+E                   # 移到行尾
Ctrl+U                   # 删除光标前的内容
Ctrl+K                   # 删除光标后的内容
Ctrl+W                   # 删除光标前的单词
Ctrl+Y                   # 粘贴删除的内容
Ctrl+L                   # 清屏
Ctrl+R                   # 搜索历史命令
Ctrl+C                   # 终止当前命令
Ctrl+Z                   # 挂起当前命令
Ctrl+D                   # 退出当前 shell
Alt+B                    # 向后移动一个单词
Alt+F                    # 向前移动一个单词
Alt+.                    # 插入上一命令的最后参数

# 历史命令
history                  # 显示命令历史
!n                       # 执行第 n 条历史命令
!!                       # 执行上一条命令
!string                  # 执行最近以 string 开头的命令
!$                       # 上一命令的最后参数
!*                       # 上一命令的所有参数
^old^new                 # 替换上一命令中的字符串
history -c               # 清空历史
HISTSIZE=1000            # 设置历史记录数量
HISTFILESIZE=2000        # 设置历史文件大小

# 重定向和管道
command > file           # 重定向输出（覆盖）
command >> file          # 重定向输出（追加）
command < file           # 重定向输入
command 2> file          # 重定向错误输出
command &> file          # 重定向所有输出
command 2>&1             # 错误输出重定向到标准输出
command1 | command2      # 管道
command | tee file       # 同时输出到屏幕和文件

command < file1 > file2  # 同时重定向输入输出
command <<EOF            # Here Document
多行输入
EOF

# 命令组合
command1 && command2     # command1 成功后执行 command2
command1 || command2     # command1 失败后执行 command2
command1 ; command2      # 顺序执行
(command1; command2)     # 在子 shell 中执行
{ command1; command2; }  # 在当前 shell 中执行

# 通配符
*                        # 匹配任意字符
?                        # 匹配单个字符
[abc]                    # 匹配 a、b 或 c
[a-z]                    # 匹配 a 到 z
[!abc]                   # 不匹配 a、b、c
{a,b,c}                  # 扩展为 a b c
{1..10}                  # 扩展为 1 2 3 ... 10
~                        # 家目录
~user                    # 指定用户家目录

# 别名
alias ll='ls -la'        # 创建别名
alias                    # 显示所有别名
unalias ll               # 删除别名
\command                 # 忽略别名执行原命令

# 环境变量
export PATH=$PATH:/new/path  # 添加到 PATH
export VAR=value         # 设置环境变量
echo $PATH               # 显示 PATH
echo $HOME               # 显示家目录
echo $USER               # 显示用户名
echo $SHELL              # 显示当前 shell
echo $PWD                # 显示当前目录
echo $OLDPWD             # 显示上一个目录
```

## 二十二、配置文件

```bash
# 用户配置
~/.bashrc                # Bash 配置文件
~/.bash_profile          # Bash 登录配置
~/.bash_logout           # Bash 退出配置
~/.profile               # Shell 配置
~/.bash_history          # 命令历史
~/.vimrc                 # Vim 配置
~/.ssh/config            # SSH 配置
~/.ssh/authorized_keys   # SSH 公钥
~/.gitconfig             # Git 配置

# 系统配置
/etc/passwd              # 用户信息
/etc/shadow              # 密码信息
/etc/group               # 组信息
/etc/fstab               # 文件系统挂载表
/etc/hosts               # 主机名映射
/etc/hostname            # 主机名
/etc/resolv.conf         # DNS 配置
/etc/network/interfaces  # 网络接口配置
/etc/apt/sources.list    # APT 软件源
/etc/crontab             # 系统 cron 任务
/etc/sudoers             # sudo 配置
/etc/ssh/sshd_config     # SSH 服务器配置
/etc/sysctl.conf         # 内核参数配置
/etc/security/limits.conf    # 资源限制配置
```

## 总结

本文收录了 Ubuntu/Linux 系统中从基础到高级、从常用到冷门的各类命令，涵盖了：

- 文件和目录操作
- 权限和属性管理
- 压缩和归档
- 系统信息查询
- 进程管理
- 用户和组管理
- 网络管理
- 软件包管理
- 服务管理
- 磁盘和文件系统
- 文本处理
- Shell 脚本
- 定时任务
- 系统日志
- 性能监控
- 安全和加密
- 开发工具
- 多媒体处理
- 系统备份
- 冷门实用命令
- 快捷键技巧
- 配置文件

掌握这些命令可以大大提高在 Linux 系统中的工作效率。建议根据实际需求逐步学习和实践，从常用命令开始，逐渐深入到高级和专业领域的命令。
