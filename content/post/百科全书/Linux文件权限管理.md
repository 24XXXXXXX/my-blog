---
title: "Linux 文件权限管理完全指南"
description: "详细介绍 Linux 系统中查看文件详情、设置文件所有者、修改文件权限的方法和技巧"
keywords: "Linux,文件权限,chmod,chown,chgrp,文件所有者,权限管理"

date: 2026-03-26T12:00:00+08:00
lastmod: 2026-03-26T12:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Linux
  - 文件权限
  - 系统管理
---

本文详细介绍 Linux 系统中文件权限的概念、查看文件详情的方法、设置文件所有者和修改文件权限的完整操作指南。

<!--more-->

## 一、Linux 文件权限基础

### 1.1 权限的三种类型

Linux 文件权限分为三种：

- **读权限（r, Read）**：可以查看文件内容或列出目录内容
- **写权限（w, Write）**：可以修改文件内容或在目录中创建/删除文件
- **执行权限（x, Execute）**：可以执行文件或进入目录

### 1.2 权限的三类用户

每个文件或目录的权限针对三类用户：

- **所有者（Owner/User）**：文件的创建者或被指定的所有者
- **所属组（Group）**：文件所属的用户组
- **其他用户（Others）**：系统中的其他所有用户

### 1.3 权限表示方法

#### 符号表示法

```
-rwxr-xr--
```

- 第 1 位：文件类型（`-` 普通文件，`d` 目录，`l` 符号链接，`b` 块设备，`c` 字符设备，`s` 套接字，`p` 管道）
- 第 2-4 位：所有者权限（rwx）
- 第 5-7 位：所属组权限（r-x）
- 第 8-10 位：其他用户权限（r--）

#### 数字表示法

每种权限对应一个数字：
- 读（r）= 4
- 写（w）= 2
- 执行（x）= 1
- 无权限 = 0

组合权限：
- `rwx` = 4 + 2 + 1 = 7
- `rw-` = 4 + 2 + 0 = 6
- `r-x` = 4 + 0 + 1 = 5
- `r--` = 4 + 0 + 0 = 4
- `-wx` = 0 + 2 + 1 = 3
- `-w-` = 0 + 2 + 0 = 2
- `--x` = 0 + 0 + 1 = 1
- `---` = 0 + 0 + 0 = 0

例如：`755` 表示 `rwxr-xr-x`（所有者全部权限，组和其他用户读和执行权限）

---

## 二、查看文件详情

### 2.1 使用 ls 命令查看

#### 基本查看

```bash
# 查看当前目录文件
ls -l

# 查看所有文件（包括隐藏文件）
ls -la

# 查看指定文件
ls -l /path/to/file

# 人性化显示文件大小
ls -lh

# 按时间排序
ls -lt

# 按大小排序
ls -lS

# 递归查看目录
ls -lR

# 显示文件的 inode 号
ls -li

# 显示完整时间
ls -l --time-style=full-iso
```

#### 输出解读

```bash
$ ls -l myfile.txt
-rw-r--r-- 1 user group 1024 Mar 26 12:00 myfile.txt
```

各字段含义：
1. `-rw-r--r--`：文件类型和权限
2. `1`：硬链接数
3. `user`：文件所有者
4. `group`：文件所属组
5. `1024`：文件大小（字节）
6. `Mar 26 12:00`：最后修改时间
7. `myfile.txt`：文件名

### 2.2 使用 stat 命令查看详细信息

```bash
# 查看文件详细信息
stat myfile.txt

# 输出示例：
# File: myfile.txt
# Size: 1024        Blocks: 8          IO Block: 4096   regular file
# Device: 801h/2049d  Inode: 123456      Links: 1
# Access: (0644/-rw-r--r--)  Uid: ( 1000/   user)   Gid: ( 1000/  group)
# Access: 2026-03-26 12:00:00.000000000 +0800
# Modify: 2026-03-26 12:00:00.000000000 +0800
# Change: 2026-03-26 12:00:00.000000000 +0800
# Birth: -

# 简洁格式
stat -c "%n %a %U %G %s" myfile.txt

# 自定义格式
stat --format='%n: %A (%a) Owner: %U Group: %G Size: %s' myfile.txt
```

### 2.3 使用 file 命令查看文件类型

```bash
# 查看文件类型
file myfile.txt

# 查看多个文件
file file1 file2 file3

# 查看符号链接指向的文件
file -L symlink
```

### 2.4 使用 getfacl 查看 ACL 权限

```bash
# 查看文件的 ACL（访问控制列表）
getfacl myfile.txt

# 递归查看目录
getfacl -R /path/to/dir
```

---

## 三、修改文件权限（chmod）

### 3.1 使用符号模式

#### 基本语法

```bash
chmod [ugoa][+-=][rwx] 文件名
```

- `u`：所有者（user）
- `g`：所属组（group）
- `o`：其他用户（others）
- `a`：所有用户（all，等同于 ugo）
- `+`：添加权限
- `-`：移除权限
- `=`：设置权限（覆盖原有权限）

#### 常用示例

```bash
# 给所有者添加执行权限
chmod u+x script.sh

# 给所属组添加写权限
chmod g+w file.txt

# 给其他用户移除读权限
chmod o-r file.txt

# 给所有用户添加执行权限
chmod a+x script.sh
chmod +x script.sh  # 简写形式

# 给所有者设置读写权限（覆盖原有权限）
chmod u=rw file.txt

# 给所属组设置只读权限
chmod g=r file.txt

# 移除所有用户的写权限
chmod a-w file.txt

# 组合操作
chmod u+x,g+w,o-r file.txt

# 给所有者全部权限，组和其他用户只读
chmod u=rwx,go=r file.txt

# 递归修改目录及其内容
chmod -R u+x /path/to/dir

# 只修改目录权限，不修改文件
find /path/to/dir -type d -exec chmod 755 {} \;

# 只修改文件权限，不修改目录
find /path/to/dir -type f -exec chmod 644 {} \;
```

### 3.2 使用数字模式

#### 基本语法

```bash
chmod [数字] 文件名
```

#### 常用权限组合

```bash
# 755: rwxr-xr-x（常用于可执行文件和目录）
chmod 755 script.sh

# 644: rw-r--r--（常用于普通文件）
chmod 644 file.txt

# 600: rw-------（只有所有者可读写）
chmod 600 private.txt

# 700: rwx------（只有所有者全部权限）
chmod 700 private_script.sh

# 777: rwxrwxrwx（所有用户全部权限，不推荐）
chmod 777 file.txt

# 666: rw-rw-rw-（所有用户可读写）
chmod 666 shared.txt

# 444: r--r--r--（所有用户只读）
chmod 444 readonly.txt

# 000: ---------（无任何权限）
chmod 000 locked.txt

# 递归修改
chmod -R 755 /path/to/dir
```

#### 常见场景权限设置

```bash
# Web 服务器文件
chmod 644 *.html *.css *.js  # 静态文件
chmod 755 *.php *.py         # 脚本文件
chmod 755 /var/www/html      # 目录

# 配置文件
chmod 600 /etc/ssh/sshd_config
chmod 600 ~/.ssh/id_rsa      # 私钥
chmod 644 ~/.ssh/id_rsa.pub  # 公钥
chmod 700 ~/.ssh             # SSH 目录

# 日志文件
chmod 640 /var/log/app.log

# 临时文件目录
chmod 1777 /tmp              # 带粘滞位
```

### 3.3 特殊权限

#### SUID（Set User ID）- 4000

```bash
# 设置 SUID（文件执行时以所有者身份运行）
chmod u+s file
chmod 4755 file

# 示例：passwd 命令
ls -l /usr/bin/passwd
# -rwsr-xr-x 1 root root 59976 /usr/bin/passwd

# 移除 SUID
chmod u-s file
```

#### SGID（Set Group ID）- 2000

```bash
# 设置 SGID（文件执行时以所属组身份运行，目录中新建文件继承目录的组）
chmod g+s file
chmod 2755 file

# 目录设置 SGID（新建文件继承目录的组）
chmod g+s /shared/dir

# 移除 SGID
chmod g-s file
```

#### Sticky Bit（粘滞位）- 1000

```bash
# 设置粘滞位（目录中的文件只能被所有者删除）
chmod +t /shared/dir
chmod 1777 /shared/dir

# 示例：/tmp 目录
ls -ld /tmp
# drwxrwxrwt 10 root root 4096 /tmp

# 移除粘滞位
chmod -t /shared/dir
```

#### 组合特殊权限

```bash
# SUID + 正常权限
chmod 4755 file  # rwsr-xr-x

# SGID + 正常权限
chmod 2755 file  # rwxr-sr-x

# Sticky Bit + 正常权限
chmod 1777 dir   # rwxrwxrwt

# SUID + SGID
chmod 6755 file  # rwsr-sr-x

# 所有特殊权限
chmod 7755 file  # rwsr-sr-t
```

### 3.4 参考模式（--reference）

```bash
# 将 file2 的权限设置为与 file1 相同
chmod --reference=file1 file2

# 递归应用
chmod -R --reference=template_dir /path/to/dir
```

---

## 四、修改文件所有者（chown）

### 4.1 基本语法

```bash
chown [选项] 所有者[:所属组] 文件名
```

### 4.2 修改所有者

```bash
# 修改文件所有者
sudo chown user file.txt

# 修改目录所有者
sudo chown user /path/to/dir

# 递归修改目录及其内容
sudo chown -R user /path/to/dir

# 修改多个文件
sudo chown user file1 file2 file3

# 使用通配符
sudo chown user *.txt
```

### 4.3 同时修改所有者和所属组

```bash
# 修改所有者和所属组
sudo chown user:group file.txt

# 只修改所属组（所有者不变）
sudo chown :group file.txt

# 递归修改
sudo chown -R user:group /path/to/dir
```

### 4.4 参考模式

```bash
# 将 file2 的所有者设置为与 file1 相同
sudo chown --reference=file1 file2

# 递归应用
sudo chown -R --reference=template_file /path/to/dir
```

### 4.5 常用选项

```bash
# -R: 递归修改
sudo chown -R user:group /path/to/dir

# -v: 显示详细信息
sudo chown -v user file.txt

# -c: 只显示发生改变的文件
sudo chown -c user *.txt

# -h: 修改符号链接本身，而不是指向的文件
sudo chown -h user symlink

# --from: 只修改当前所有者匹配的文件
sudo chown --from=olduser newuser file.txt
sudo chown --from=olduser:oldgroup newuser:newgroup file.txt
```

### 4.6 实用示例

```bash
# Web 服务器文件所有权
sudo chown -R www-data:www-data /var/www/html

# 用户主目录
sudo chown -R username:username /home/username

# 日志文件
sudo chown syslog:adm /var/log/app.log

# 恢复文件所有权
sudo chown -R --from=root:root user:user /home/user

# 批量修改
find /path/to/dir -type f -exec sudo chown user:group {} \;
```

---

## 五、修改文件所属组（chgrp）

### 5.1 基本语法

```bash
chgrp [选项] 组名 文件名
```

### 5.2 基本用法

```bash
# 修改文件所属组
sudo chgrp group file.txt

# 修改目录所属组
sudo chgrp group /path/to/dir

# 递归修改
sudo chgrp -R group /path/to/dir

# 修改多个文件
sudo chgrp group file1 file2 file3
```

### 5.3 常用选项

```bash
# -R: 递归修改
sudo chgrp -R developers /project

# -v: 显示详细信息
sudo chgrp -v group file.txt

# -c: 只显示发生改变的文件
sudo chgrp -c group *.txt

# -h: 修改符号链接本身
sudo chgrp -h group symlink

# --reference: 参考其他文件
sudo chgrp --reference=file1 file2
```

### 5.4 实用示例

```bash
# 共享项目目录
sudo chgrp -R developers /opt/project

# 日志文件组
sudo chgrp adm /var/log/app.log

# 批量修改
find /path/to/dir -type f -exec sudo chgrp group {} \;
```

---

## 六、默认权限和 umask

### 6.1 umask 概念

umask（用户文件创建掩码）决定新建文件和目录的默认权限。

- 文件默认最大权限：666（rw-rw-rw-）
- 目录默认最大权限：777（rwxrwxrwx）
- 实际权限 = 最大权限 - umask

### 6.2 查看和设置 umask

```bash
# 查看当前 umask
umask

# 以符号形式查看
umask -S

# 设置 umask（临时）
umask 022  # 新建文件 644，目录 755
umask 002  # 新建文件 664，目录 775
umask 077  # 新建文件 600，目录 700

# 永久设置（添加到 ~/.bashrc 或 /etc/profile）
echo "umask 022" >> ~/.bashrc
source ~/.bashrc
```

### 6.3 常用 umask 值

```bash
# umask 022
# 文件: 666 - 022 = 644 (rw-r--r--)
# 目录: 777 - 022 = 755 (rwxr-xr-x)

# umask 002
# 文件: 666 - 002 = 664 (rw-rw-r--)
# 目录: 777 - 002 = 775 (rwxrwxr-x)

# umask 077
# 文件: 666 - 077 = 600 (rw-------)
# 目录: 777 - 077 = 700 (rwx------)

# umask 027
# 文件: 666 - 027 = 640 (rw-r-----)
# 目录: 777 - 027 = 750 (rwxr-x---)
```

---

## 七、访问控制列表（ACL）

### 7.1 ACL 简介

ACL（Access Control List）提供比传统 Unix 权限更细粒度的权限控制，可以为特定用户或组设置权限。

### 7.2 查看 ACL

```bash
# 查看文件 ACL
getfacl file.txt

# 递归查看
getfacl -R /path/to/dir

# 简洁输出
getfacl --omit-header file.txt
```

### 7.3 设置 ACL

```bash
# 给特定用户设置权限
setfacl -m u:username:rwx file.txt

# 给特定组设置权限
setfacl -m g:groupname:rx file.txt

# 设置多个 ACL
setfacl -m u:user1:rw,u:user2:r file.txt

# 递归设置
setfacl -R -m u:username:rwx /path/to/dir

# 设置默认 ACL（新建文件继承）
setfacl -d -m u:username:rwx /path/to/dir

# 移除特定用户的 ACL
setfacl -x u:username file.txt

# 移除特定组的 ACL
setfacl -x g:groupname file.txt

# 移除所有 ACL
setfacl -b file.txt

# 从文件读取 ACL 设置
getfacl file1 | setfacl --set-file=- file2
```

### 7.4 ACL 实用示例

```bash
# 允许特定用户访问私有目录
setfacl -m u:colleague:rx ~/private

# 共享项目目录
setfacl -R -m g:developers:rwx /opt/project
setfacl -R -d -m g:developers:rwx /opt/project

# 日志文件访问
setfacl -m u:monitor:r /var/log/app.log

# 备份 ACL
getfacl -R /path/to/dir > acl_backup.txt

# 恢复 ACL
setfacl --restore=acl_backup.txt
```

---

## 八、实用技巧和最佳实践

### 8.1 批量操作

```bash
# 批量修改文件权限
find /path/to/dir -type f -name "*.sh" -exec chmod +x {} \;

# 批量修改目录权限
find /path/to/dir -type d -exec chmod 755 {} \;

# 批量修改所有者
find /path/to/dir -user olduser -exec sudo chown newuser {} \;

# 批量修改所属组
find /path/to/dir -group oldgroup -exec sudo chgrp newgroup {} \;

# 组合操作
find /var/www -type f -exec chmod 644 {} \; -o -type d -exec chmod 755 {} \;
```

### 8.2 安全建议

```bash
# 1. 最小权限原则
chmod 600 ~/.ssh/id_rsa        # 私钥只有所有者可读写
chmod 644 ~/.ssh/id_rsa.pub    # 公钥可以被其他人读取
chmod 700 ~/.ssh               # SSH 目录只有所有者可访问

# 2. 敏感文件保护
chmod 600 /etc/shadow          # 密码文件
chmod 600 ~/.bash_history      # 命令历史
chmod 600 ~/.mysql_history     # MySQL 历史

# 3. 配置文件权限
chmod 644 /etc/nginx/nginx.conf
chmod 600 /etc/mysql/my.cnf

# 4. 日志文件权限
chmod 640 /var/log/*.log

# 5. Web 目录权限
chmod 755 /var/www/html        # 目录
chmod 644 /var/www/html/*.html # 文件
chmod 755 /var/www/html/*.php  # PHP 脚本

# 6. 避免使用 777
# 不要使用 chmod 777，这会给所有用户完全权限，存在安全风险
```


### 8.3 权限问题排查

```bash
# 1. 检查文件权限
ls -l file.txt

# 2. 检查目录权限（需要 x 权限才能进入）
ls -ld /path/to/dir

# 3. 检查完整路径权限
namei -l /path/to/file

# 4. 检查当前用户和组
id
groups

# 5. 检查文件所有者和组
stat file.txt

# 6. 检查 ACL
getfacl file.txt

# 7. 测试权限
sudo -u username test -r file.txt && echo "可读" || echo "不可读"
sudo -u username test -w file.txt && echo "可写" || echo "不可写"
sudo -u username test -x file.txt && echo "可执行" || echo "不可执行"
```

### 8.4 常见权限问题解决

#### 问题 1：无法访问目录

```bash
# 原因：目录缺少执行权限
# 解决：
chmod +x /path/to/dir
```

#### 问题 2：无法创建文件

```bash
# 原因：目录缺少写权限
# 解决：
chmod u+w /path/to/dir
```

#### 问题 3：脚本无法执行

```bash
# 原因：脚本缺少执行权限
# 解决：
chmod +x script.sh

# 或使用解释器直接运行
bash script.sh
python script.py
```

#### 问题 4：SSH 密钥权限错误

```bash
# 错误信息：Permissions 0644 for '/home/user/.ssh/id_rsa' are too open
# 解决：
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/known_hosts
```

#### 问题 5：Web 服务器权限问题

```bash
# Nginx/Apache 无法访问文件
# 解决：
sudo chown -R www-data:www-data /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;
```

#### 问题 6：sudo 无法使用

```bash
# 错误：sudo: /etc/sudoers is world writable
# 解决：
sudo chmod 440 /etc/sudoers
```

### 8.5 权限审计

```bash
# 查找所有 777 权限的文件（安全风险）
find / -type f -perm 0777 2>/dev/null

# 查找所有 SUID 文件
find / -type f -perm -4000 2>/dev/null

# 查找所有 SGID 文件
find / -type f -perm -2000 2>/dev/null

# 查找所有带粘滞位的目录
find / -type d -perm -1000 2>/dev/null

# 查找所有无主文件（所有者不存在）
find / -nouser 2>/dev/null

# 查找所有无组文件（所属组不存在）
find / -nogroup 2>/dev/null

# 查找最近修改的文件
find /path/to/dir -type f -mtime -7  # 最近 7 天

# 查找可写的配置文件
find /etc -type f -writable 2>/dev/null

# 查找所有者为 root 且其他用户可写的文件
find / -user root -perm -002 2>/dev/null
```

---

## 九、权限管理脚本示例

### 9.1 批量设置 Web 目录权限

```bash
#!/bin/bash
# set_web_permissions.sh

WEB_ROOT="/var/www/html"
WEB_USER="www-data"
WEB_GROUP="www-data"

echo "设置 Web 目录权限..."

# 设置所有者
sudo chown -R $WEB_USER:$WEB_GROUP $WEB_ROOT

# 设置目录权限
sudo find $WEB_ROOT -type d -exec chmod 755 {} \;

# 设置文件权限
sudo find $WEB_ROOT -type f -exec chmod 644 {} \;

# 设置脚本执行权限
sudo find $WEB_ROOT -type f \( -name "*.sh" -o -name "*.py" -o -name "*.php" \) -exec chmod 755 {} \;

echo "权限设置完成！"
```

### 9.2 权限备份和恢复

```bash
#!/bin/bash
# backup_permissions.sh

BACKUP_DIR="/backup/permissions"
TARGET_DIR="/path/to/dir"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份权限
echo "备份权限信息..."
getfacl -R $TARGET_DIR > $BACKUP_DIR/permissions_$DATE.acl

# 备份所有者信息
find $TARGET_DIR -printf "%p %u:%g %m\n" > $BACKUP_DIR/ownership_$DATE.txt

echo "备份完成：$BACKUP_DIR/permissions_$DATE.acl"
```

```bash
#!/bin/bash
# restore_permissions.sh

BACKUP_FILE="/backup/permissions/permissions_20260326_120000.acl"

if [ -f "$BACKUP_FILE" ]; then
    echo "恢复权限..."
    setfacl --restore=$BACKUP_FILE
    echo "权限恢复完成！"
else
    echo "备份文件不存在：$BACKUP_FILE"
    exit 1
fi
```

### 9.3 权限检查脚本

```bash
#!/bin/bash
# check_permissions.sh

echo "=== 权限安全检查 ==="

# 检查 777 权限文件
echo -e "\n1. 检查 777 权限文件（安全风险）："
find /home /var/www -type f -perm 0777 2>/dev/null | head -10

# 检查 SUID 文件
echo -e "\n2. 检查 SUID 文件："
find /usr /bin /sbin -type f -perm -4000 2>/dev/null

# 检查无主文件
echo -e "\n3. 检查无主文件："
find /home -nouser 2>/dev/null | head -10

# 检查可写的系统文件
echo -e "\n4. 检查其他用户可写的系统文件："
find /etc -type f -perm -002 2>/dev/null | head -10

# 检查 SSH 密钥权限
echo -e "\n5. 检查 SSH 密钥权限："
for user_home in /home/*; do
    if [ -d "$user_home/.ssh" ]; then
        echo "检查 $user_home/.ssh"
        ls -la $user_home/.ssh/id_* 2>/dev/null
    fi
done

echo -e "\n=== 检查完成 ==="
```

---

## 十、快速参考表

### 10.1 常用权限数字对照表

| 数字 | 权限 | 符号 | 说明 |
|------|------|------|------|
| 0 | 无权限 | --- | 无任何权限 |
| 1 | 执行 | --x | 只能执行 |
| 2 | 写 | -w- | 只能写入 |
| 3 | 写+执行 | -wx | 可写入和执行 |
| 4 | 读 | r-- | 只能读取 |
| 5 | 读+执行 | r-x | 可读取和执行 |
| 6 | 读+写 | rw- | 可读取和写入 |
| 7 | 读+写+执行 | rwx | 全部权限 |

### 10.2 常用权限组合

| 权限 | 数字 | 说明 | 适用场景 |
|------|------|------|----------|
| rwxr-xr-x | 755 | 所有者全部权限，其他人读和执行 | 目录、可执行文件 |
| rw-r--r-- | 644 | 所有者读写，其他人只读 | 普通文件 |
| rw------- | 600 | 只有所有者可读写 | 私密文件、密钥 |
| rwx------ | 700 | 只有所有者全部权限 | 私密目录 |
| rwxrwxrwx | 777 | 所有人全部权限 | 不推荐使用 |
| rw-rw-r-- | 664 | 所有者和组可读写，其他人只读 | 共享文件 |
| rwxrwxr-x | 775 | 所有者和组全部权限，其他人读和执行 | 共享目录 |
| r--r--r-- | 444 | 所有人只读 | 只读文件 |

### 10.3 特殊权限对照表

| 权限 | 数字 | 符号 | 说明 |
|------|------|------|------|
| SUID | 4000 | s (所有者位) | 以文件所有者身份执行 |
| SGID | 2000 | s (组位) | 以文件所属组身份执行 |
| Sticky Bit | 1000 | t (其他用户位) | 只有所有者可删除 |

### 10.4 命令速查表

| 命令 | 功能 | 示例 |
|------|------|------|
| `ls -l` | 查看文件权限 | `ls -l file.txt` |
| `stat` | 查看文件详细信息 | `stat file.txt` |
| `chmod` | 修改文件权限 | `chmod 755 file.txt` |
| `chown` | 修改文件所有者 | `chown user:group file.txt` |
| `chgrp` | 修改文件所属组 | `chgrp group file.txt` |
| `umask` | 查看/设置默认权限掩码 | `umask 022` |
| `getfacl` | 查看 ACL | `getfacl file.txt` |
| `setfacl` | 设置 ACL | `setfacl -m u:user:rwx file.txt` |

---

## 十一、常见场景权限设置

### 11.1 用户主目录

```bash
# 用户主目录
chmod 700 /home/username
chown username:username /home/username

# 用户配置文件
chmod 644 ~/.bashrc ~/.bash_profile
chmod 600 ~/.bash_history
```

### 11.2 SSH 相关

```bash
# SSH 目录和文件
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/known_hosts
chmod 644 ~/.ssh/config
```

### 11.3 Web 服务器

```bash
# Nginx/Apache
chown -R www-data:www-data /var/www/html
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# 上传目录（需要写权限）
chmod 775 /var/www/html/uploads
chown www-data:www-data /var/www/html/uploads
```

### 11.4 数据库

```bash
# MySQL 配置文件
chmod 644 /etc/mysql/my.cnf
chown root:root /etc/mysql/my.cnf

# MySQL 数据目录
chmod 750 /var/lib/mysql
chown mysql:mysql /var/lib/mysql

# PostgreSQL
chmod 700 /var/lib/postgresql/data
chown postgres:postgres /var/lib/postgresql/data
```

### 11.5 日志文件

```bash
# 系统日志
chmod 640 /var/log/syslog
chown syslog:adm /var/log/syslog

# 应用日志
chmod 644 /var/log/app.log
chown app:app /var/log/app.log

# 日志目录
chmod 755 /var/log
```

### 11.6 共享目录

```bash
# 团队共享目录
mkdir /shared/project
chown root:developers /shared/project
chmod 2775 /shared/project  # SGID，新文件继承组
setfacl -d -m g:developers:rwx /shared/project  # 默认 ACL
```

### 11.7 临时目录

```bash
# 临时目录（带粘滞位）
chmod 1777 /tmp
chmod 1777 /var/tmp
```

---

## 十二、总结

本文详细介绍了 Linux 文件权限管理的完整知识体系，包括：

1. **权限基础**：权限类型、用户类别、表示方法
2. **查看文件详情**：ls、stat、file、getfacl 命令
3. **修改权限**：chmod 命令的符号模式和数字模式
4. **特殊权限**：SUID、SGID、Sticky Bit
5. **修改所有者**：chown 和 chgrp 命令
6. **默认权限**：umask 的概念和设置
7. **ACL**：更细粒度的权限控制
8. **实用技巧**：批量操作、安全建议、问题排查
9. **脚本示例**：自动化权限管理
10. **快速参考**：常用权限对照表和命令速查

掌握这些知识，你就能够熟练管理 Linux 系统中的文件权限，确保系统安全和文件访问控制。

### 关键要点

- 遵循最小权限原则，只授予必要的权限
- 敏感文件（如密钥、密码文件）使用 600 或 400 权限
- 避免使用 777 权限，存在严重安全风险
- 定期审计文件权限，检查异常权限设置
- 使用 ACL 实现更灵活的权限控制
- 备份重要文件的权限信息

### 相关文档

- [Linux 编辑器使用指南](./编辑器.md)
- [SSH 连接保活配置](./SSH连接保活配置.md)
- [Ubuntu 命令大全](../计算机操作系统/Ubuntu命令大全.md)
