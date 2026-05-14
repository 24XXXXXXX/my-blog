---
title: "zip 和 unzip 工具使用指南"
description: "详细介绍如何在 Linux 系统中安装和使用 zip、unzip 压缩解压工具，包括常用命令和实用技巧"
keywords: "zip,unzip,压缩,解压,Linux,文件压缩,归档"

date: 2026-03-27T11:00:00+08:00
lastmod: 2026-03-27T11:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Linux
  - 压缩工具
  - 命令行
  - 文件管理
---

本文详细介绍如何在 Linux 系统中安装和使用 zip、unzip 压缩解压工具，包括常用命令、参数说明和实用技巧。

<!--more-->

> **为什么需要 zip 和 unzip？**
>
> 1. **跨平台兼容**：zip 格式在 Windows、Linux、macOS 上都能使用
> 2. **广泛应用**：许多软件和工具（如 SDKMAN、Java SDK）依赖 zip/unzip
> 3. **文件传输**：压缩文件可以减小体积，加快传输速度
> 4. **归档管理**：方便打包和管理多个文件
> 5. **必备工具**：是 Linux 系统中的基础工具之一

## 一、zip 和 unzip 简介

### 1.1 什么是 zip

zip 是一个压缩和文件打包工具，用于创建 .zip 格式的压缩文件。它可以：

- 压缩单个或多个文件
- 压缩整个目录
- 设置压缩级别
- 加密压缩文件
- 分卷压缩

### 1.2 什么是 unzip

unzip 是一个解压工具，用于解压 .zip 格式的压缩文件。它可以：

- 解压 zip 文件
- 查看压缩文件内容
- 解压到指定目录
- 解压特定文件
- 测试压缩文件完整性

### 1.3 zip 格式的优势

- **跨平台**：Windows、Linux、macOS 都原生支持
- **压缩率好**：文件体积可以显著减小
- **速度快**：压缩和解压速度都很快
- **支持加密**：可以设置密码保护
- **广泛支持**：几乎所有压缩软件都支持 zip 格式

---

## 二、安装 zip 和 unzip

### 2.1 检查是否已安装

```bash
# 检查 zip 是否已安装
which zip
zip --version

# 检查 unzip 是否已安装
which unzip
unzip -v

# 如果已安装，会显示版本信息
# 如果未安装，会提示 "command not found"
```

### 2.2 在不同 Linux 发行版上安装

#### Ubuntu / Debian 系统

```bash
# 更新软件包列表
sudo apt update

# 安装 zip 和 unzip
sudo apt install zip unzip -y

# 验证安装
zip --version
unzip -v
```

#### CentOS / RHEL / Fedora 系统

```bash
# CentOS 7 / RHEL 7
sudo yum install zip unzip -y

# CentOS 8+ / RHEL 8+ / Fedora
sudo dnf install zip unzip -y

# 验证安装
zip --version
unzip -v
```

#### Arch Linux / Manjaro 系统

```bash
# 安装 zip 和 unzip
sudo pacman -S zip unzip

# 验证安装
zip --version
unzip -v
```

#### openSUSE 系统

```bash
# 安装 zip 和 unzip
sudo zypper install zip unzip

# 验证安装
zip --version
unzip -v
```

#### Alpine Linux 系统

```bash
# 安装 zip 和 unzip
apk add zip unzip

# 验证安装
zip --version
unzip -v
```

### 2.3 验证安装成功

```bash
# 查看 zip 版本
zip --version
# 输出示例：
# Copyright (c) 1990-2008 Info-ZIP - Type 'zip "-L"' for software license.
# This is Zip 3.0 (July 5th 2008), by Info-ZIP.

# 查看 unzip 版本
unzip -v
# 输出示例：
# UnZip 6.00 of 20 April 2009, by Info-ZIP.

# 查看安装路径
which zip
# 输出：/usr/bin/zip

which unzip
# 输出：/usr/bin/unzip
```

---

## 三、zip 压缩命令详解

### 3.1 基本压缩操作

```bash
# 压缩单个文件
zip archive.zip file.txt

# 压缩多个文件
zip archive.zip file1.txt file2.txt file3.txt

# 压缩整个目录（递归）
zip -r archive.zip directory/

# 压缩多个目录
zip -r archive.zip dir1/ dir2/ dir3/

# 压缩当前目录下的所有文件
zip archive.zip *

# 压缩当前目录下的所有文件和子目录
zip -r archive.zip .
```

### 3.2 压缩级别设置

```bash
# 不压缩，仅打包（最快）
zip -0 archive.zip file.txt

# 最快压缩（压缩率低）
zip -1 archive.zip file.txt

# 默认压缩（平衡速度和压缩率）
zip -6 archive.zip file.txt

# 最佳压缩（最慢，压缩率高）
zip -9 archive.zip file.txt

# 压缩级别说明：
# -0: 仅存储，不压缩
# -1: 最快压缩
# -6: 默认压缩（如果不指定，默认使用此级别）
# -9: 最佳压缩
```

### 3.3 常用参数

```bash
# -r: 递归压缩目录
zip -r archive.zip directory/

# -q: 安静模式，不显示压缩过程
zip -q -r archive.zip directory/

# -v: 显示详细信息
zip -v -r archive.zip directory/

# -u: 更新压缩文件（只添加新文件或修改过的文件）
zip -u archive.zip newfile.txt

# -d: 从压缩文件中删除文件
zip -d archive.zip file.txt

# -m: 压缩后删除源文件（移动到压缩文件）
zip -m archive.zip file.txt

# -j: 不保留目录结构，只压缩文件
zip -j archive.zip dir1/file1.txt dir2/file2.txt

# -x: 排除特定文件
zip -r archive.zip directory/ -x "*.log" "*.tmp"

# -i: 只包含特定文件
zip -r archive.zip directory/ -i "*.txt" "*.md"
```

### 3.4 加密压缩

```bash
# 使用密码加密（交互式输入密码）
zip -e archive.zip file.txt
# 会提示输入密码

# 使用密码加密（命令行指定密码，不安全）
zip -P mypassword archive.zip file.txt

# 加密整个目录
zip -e -r archive.zip directory/

# 注意：-P 参数会在命令历史中留下密码，不推荐使用
# 推荐使用 -e 参数，交互式输入密码
```

### 3.5 分卷压缩

```bash
# 分卷压缩（每个分卷 100MB）
zip -r -s 100m archive.zip large_directory/

# 分卷压缩（每个分卷 1GB）
zip -r -s 1g archive.zip large_directory/

# 会生成：
# archive.z01
# archive.z02
# archive.zip

# 合并分卷
zip -s 0 archive.zip --out single.zip
```

### 3.6 实用示例

```bash
# 压缩项目代码（排除 node_modules 和 .git）
zip -r project.zip myproject/ -x "*/node_modules/*" "*/.git/*"

# 压缩日志文件（只包含 .log 文件）
zip -r logs.zip /var/log/ -i "*.log"

# 压缩并显示进度
zip -r -v archive.zip directory/

# 压缩时保持符号链接
zip -r -y archive.zip directory/

# 压缩并添加注释
zip -z archive.zip file.txt
# 会提示输入注释

# 更新压缩文件中的特定文件
zip -u archive.zip updated_file.txt

# 从压缩文件中删除特定文件
zip -d archive.zip unwanted_file.txt
```

---

## 四、unzip 解压命令详解

### 4.1 基本解压操作

```bash
# 解压到当前目录
unzip archive.zip

# 解压到指定目录
unzip archive.zip -d /path/to/destination/

# 解压到指定目录（目录不存在会自动创建）
unzip archive.zip -d ~/extracted/

# 查看压缩文件内容（不解压）
unzip -l archive.zip

# 测试压缩文件完整性
unzip -t archive.zip
```

### 4.2 常用参数

```bash
# -l: 列出压缩文件内容
unzip -l archive.zip

# -v: 显示详细信息
unzip -v archive.zip

# -t: 测试压缩文件
unzip -t archive.zip

# -d: 指定解压目录
unzip archive.zip -d /path/to/dir/

# -o: 覆盖已存在的文件（不提示）
unzip -o archive.zip

# -n: 不覆盖已存在的文件
unzip -n archive.zip

# -q: 安静模式，不显示解压过程
unzip -q archive.zip

# -j: 不创建目录，所有文件解压到同一目录
unzip -j archive.zip

# -x: 排除特定文件
unzip archive.zip -x "*.log"

# -P: 使用密码解压
unzip -P mypassword archive.zip
```

### 4.3 解压特定文件

```bash
# 只解压特定文件
unzip archive.zip file.txt

# 只解压特定目录
unzip archive.zip "dir/*"

# 只解压特定类型的文件
unzip archive.zip "*.txt"

# 解压多个特定文件
unzip archive.zip file1.txt file2.txt

# 排除特定文件
unzip archive.zip -x "*.log" "*.tmp"
```

### 4.4 查看压缩文件信息

```bash
# 简单列表
unzip -l archive.zip

# 详细信息
unzip -v archive.zip

# 只显示文件名
unzip -Z -1 archive.zip

# 显示压缩率
unzip -Z archive.zip

# 查看压缩文件注释
unzip -z archive.zip
```

### 4.5 解压加密文件

```bash
# 交互式输入密码
unzip archive.zip
# 会提示输入密码

# 命令行指定密码（不安全）
unzip -P mypassword archive.zip

# 推荐使用交互式输入密码
```

### 4.6 实用示例

```bash
# 解压并覆盖所有文件
unzip -o archive.zip

# 解压到指定目录并创建目录
mkdir -p ~/extracted
unzip archive.zip -d ~/extracted/

# 只解压 .txt 文件
unzip archive.zip "*.txt"

# 解压时排除 .log 文件
unzip archive.zip -x "*.log"

# 测试压缩文件是否损坏
unzip -t archive.zip

# 查看压缩文件大小和压缩率
unzip -v archive.zip | tail -1

# 解压分卷压缩文件
unzip archive.zip
# unzip 会自动处理分卷文件（archive.z01, archive.z02, archive.zip）
```

---

## 五、实用场景和技巧

### 5.1 备份文件和目录

```bash
# 备份配置文件
zip -r config_backup_$(date +%Y%m%d).zip /etc/nginx/

# 备份项目代码
zip -r project_backup_$(date +%Y%m%d_%H%M%S).zip ~/projects/myproject/

# 备份并排除不需要的文件
zip -r backup.zip ~/myproject/ -x "*/node_modules/*" "*/.git/*" "*.log"

# 备份数据库导出文件
zip database_backup_$(date +%Y%m%d).zip dump.sql
```

### 5.2 压缩日志文件

```bash
# 压缩旧日志文件
zip -r logs_$(date +%Y%m).zip /var/log/*.log

# 压缩并删除源文件
zip -m old_logs.zip /var/log/*.log.1

# 压缩特定日期的日志
zip -r logs_2024.zip /var/log/ -i "*2024*.log"
```

### 5.3 打包项目代码

```bash
# 打包 Web 项目（排除依赖和构建文件）
zip -r webapp.zip mywebapp/ \
  -x "*/node_modules/*" \
  -x "*/dist/*" \
  -x "*/build/*" \
  -x "*/.git/*" \
  -x "*.log"

# 打包 Java 项目
zip -r javaproject.zip myproject/ \
  -x "*/target/*" \
  -x "*/.idea/*" \
  -x "*.class" \
  -x "*.jar"

# 打包 Python 项目
zip -r pythonproject.zip myproject/ \
  -x "*/__pycache__/*" \
  -x "*/venv/*" \
  -x "*.pyc"
```

### 5.4 批量压缩文件

```bash
# 批量压缩当前目录下的所有子目录
for dir in */; do
  zip -r "${dir%/}.zip" "$dir"
done

# 批量压缩特定类型的文件
for file in *.txt; do
  zip "${file%.txt}.zip" "$file"
done

# 按日期批量压缩日志
for log in *.log; do
  zip "$(date +%Y%m%d)_${log%.log}.zip" "$log"
  rm "$log"
done
```

### 5.5 批量解压文件

```bash
# 批量解压当前目录下的所有 zip 文件
for file in *.zip; do
  unzip "$file"
done

# 批量解压到各自的目录
for file in *.zip; do
  dirname="${file%.zip}"
  mkdir -p "$dirname"
  unzip "$file" -d "$dirname"
done

# 批量解压并删除 zip 文件
for file in *.zip; do
  unzip "$file" && rm "$file"
done
```

### 5.6 远程传输压缩文件

```bash
# 压缩并通过 SSH 传输
zip -r - directory/ | ssh user@remote "cat > archive.zip"

# 从远程服务器下载并解压
ssh user@remote "cat archive.zip" | unzip -

# 压缩、传输并在远程解压
zip -r - directory/ | ssh user@remote "unzip -"

# 使用 scp 传输压缩文件
zip -r archive.zip directory/
scp archive.zip user@remote:/path/to/destination/
```

### 5.7 与其他命令结合

```bash
# 查找并压缩特定文件
find . -name "*.log" -print | zip logs.zip -@

# 压缩最近修改的文件
find . -mtime -7 -type f -print | zip recent.zip -@

# 压缩大于 1MB 的文件
find . -size +1M -type f -print | zip large_files.zip -@

# 压缩并计算 MD5
zip -r archive.zip directory/
md5sum archive.zip > archive.zip.md5

# 解压并验证 MD5
md5sum -c archive.zip.md5
unzip archive.zip
```

---

## 六、常见问题和解决方案

### 6.1 zip 命令未找到

**问题**：执行 zip 命令时提示 `command not found`

**解决方案**：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install zip -y

# CentOS/RHEL
sudo yum install zip -y

# 验证安装
which zip
zip --version
```

### 6.2 unzip 命令未找到

**问题**：执行 unzip 命令时提示 `command not found`

**解决方案**：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install unzip -y

# CentOS/RHEL
sudo yum install unzip -y

# 验证安装
which unzip
unzip -v
```

### 6.3 解压时文件名乱码

**问题**：解压 Windows 创建的 zip 文件时，中文文件名显示乱码

**解决方案**：

```bash
# 方法 1：使用 unzip 的 -O 参数指定编码
unzip -O CP936 archive.zip
unzip -O GBK archive.zip

# 方法 2：使用 7z 解压
sudo apt install p7zip-full
7z x archive.zip

# 方法 3：使用 unar（推荐）
sudo apt install unar
unar archive.zip

# 方法 4：转换文件名编码
convmv -f gbk -t utf8 -r --notest *
```

### 6.4 权限不足

**问题**：压缩或解压时提示权限不足

**解决方案**：

```bash
# 检查文件权限
ls -la file.txt

# 修改文件权限
chmod 644 file.txt

# 使用 sudo 压缩（不推荐）
sudo zip archive.zip file.txt

# 修改目标目录权限
sudo chown -R $USER:$USER /path/to/directory/
```

### 6.5 磁盘空间不足

**问题**：压缩或解压时提示磁盘空间不足

**解决方案**：

```bash
# 查看磁盘空间
df -h

# 清理不需要的文件
rm -rf /tmp/*

# 使用其他分区
unzip archive.zip -d /mnt/other_partition/

# 分卷压缩大文件
zip -r -s 1g archive.zip large_directory/
```

### 6.6 压缩文件损坏

**问题**：解压时提示文件损坏

**解决方案**：

```bash
# 测试压缩文件完整性
unzip -t archive.zip

# 尝试修复（有限的修复能力）
zip -F archive.zip --out repaired.zip
zip -FF archive.zip --out repaired.zip

# 如果无法修复，重新下载或重新压缩
```

### 6.7 解压覆盖提示

**问题**：解压时每个文件都提示是否覆盖

**解决方案**：

```bash
# 自动覆盖所有文件
unzip -o archive.zip

# 不覆盖任何文件
unzip -n archive.zip

# 只覆盖较新的文件
unzip -u archive.zip

# 使用 yes 命令自动回答
yes | unzip archive.zip
```

### 6.8 压缩文件过大

**问题**：单个压缩文件过大，难以传输

**解决方案**：

```bash
# 使用分卷压缩
zip -r -s 100m archive.zip large_directory/

# 提高压缩级别
zip -9 -r archive.zip directory/

# 排除不必要的文件
zip -r archive.zip directory/ -x "*.log" "*.tmp"

# 使用其他压缩格式（如 tar.gz）
tar -czf archive.tar.gz directory/
```

---

## 七、zip vs 其他压缩格式

### 7.1 zip vs tar.gz

```bash
# zip 压缩
zip -r archive.zip directory/

# tar.gz 压缩
tar -czf archive.tar.gz directory/

# 对比：
# zip:
#   - 跨平台兼容性好
#   - 可以单独解压文件
#   - 压缩率稍低
#   - Windows 原生支持

# tar.gz:
#   - Linux 标准格式
#   - 压缩率更高
#   - 保留文件权限和属性
#   - 需要完整解压
```

### 7.2 zip vs 7z

```bash
# zip 压缩
zip -9 -r archive.zip directory/

# 7z 压缩
7z a -mx=9 archive.7z directory/

# 对比：
# zip:
#   - 兼容性最好
#   - 速度较快
#   - 压缩率中等

# 7z:
#   - 压缩率最高
#   - 速度较慢
#   - 需要安装 7z 工具
```

### 7.3 选择建议

- **跨平台传输**：使用 zip
- **Linux 系统内部**：使用 tar.gz
- **最高压缩率**：使用 7z 或 tar.xz
- **快速压缩**：使用 zip -1 或 gzip
- **大文件**：使用分卷压缩或 tar.gz

---

## 八、高级技巧

### 8.1 创建自解压文件

```bash
# Linux 下创建自解压脚本
cat > extract.sh << 'EOF'
#!/bin/bash
ARCHIVE=$(awk '/^__ARCHIVE_BELOW__/ {print NR + 1; exit 0; }' $0)
tail -n+$ARCHIVE $0 | base64 -d | tar xzv
exit 0
__ARCHIVE_BELOW__
EOF

tar czf - directory/ | base64 >> extract.sh
chmod +x extract.sh

# 使用
./extract.sh
```

### 8.2 压缩时显示进度

```bash
# 使用 pv 显示进度
zip -r - directory/ | pv > archive.zip

# 或使用 zip 的 -v 参数
zip -r -v archive.zip directory/

# 解压时显示进度
pv archive.zip | unzip -
```

### 8.3 加密强度设置

```bash
# 标准加密（不太安全）
zip -e archive.zip file.txt

# 使用 AES-256 加密（需要 7z）
7z a -p -mhe=on -tzip archive.zip file.txt

# 推荐使用 GPG 加密
zip -r archive.zip directory/
gpg -c archive.zip
```

### 8.4 压缩性能优化

```bash
# 使用多线程压缩（需要 pigz）
tar -c directory/ | pigz > archive.tar.gz

# 使用 zip 的快速模式
zip -1 -r archive.zip directory/

# 不压缩，仅打包
zip -0 -r archive.zip directory/

# 使用内存缓冲
zip -r archive.zip directory/ -mm
```

### 8.5 自动化脚本

```bash
# 创建自动备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash

# 配置
BACKUP_DIR="/backup"
SOURCE_DIR="/data"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.zip"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 压缩
zip -r "$BACKUP_DIR/$BACKUP_FILE" "$SOURCE_DIR" \
  -x "*/tmp/*" "*.log" "*.tmp"

# 删除 7 天前的备份
find "$BACKUP_DIR" -name "backup_*.zip" -mtime +7 -delete

echo "备份完成: $BACKUP_FILE"
EOF

chmod +x backup.sh

# 添加到 crontab（每天凌晨 2 点执行）
# 0 2 * * * /path/to/backup.sh
```

---

## 九、最佳实践

### 9.1 压缩建议

1. **选择合适的压缩级别**：平衡速度和压缩率
2. **排除不必要的文件**：减小压缩文件体积
3. **使用有意义的文件名**：包含日期和版本信息
4. **大文件使用分卷**：方便传输和存储
5. **敏感数据加密**：使用密码保护

### 9.2 解压建议

1. **先测试完整性**：使用 `unzip -t` 测试
2. **查看内容再解压**：使用 `unzip -l` 查看
3. **指定解压目录**：避免污染当前目录
4. **注意覆盖问题**：使用 `-n` 或 `-o` 参数
5. **处理文件名乱码**：使用正确的编码

### 9.3 安全建议

1. **不要在命令行中明文指定密码**：使用 `-e` 交互式输入
2. **验证压缩文件来源**：避免解压恶意文件
3. **检查解压路径**：防止路径遍历攻击
4. **定期更新工具**：修复安全漏洞
5. **使用强密码**：如果需要加密

---

## 十、总结

### 10.1 关键要点

1. **必备工具**：zip 和 unzip 是 Linux 系统的基础工具
2. **跨平台**：zip 格式在所有操作系统上都能使用
3. **简单易用**：命令简洁，参数丰富
4. **功能强大**：支持压缩、加密、分卷等功能
5. **广泛应用**：许多软件和工具依赖 zip/unzip

### 10.2 常用命令速查

```bash
# 安装
sudo apt install zip unzip -y    # Ubuntu/Debian
sudo yum install zip unzip -y    # CentOS/RHEL

# 压缩
zip archive.zip file.txt         # 压缩单个文件
zip -r archive.zip directory/    # 压缩目录
zip -9 -r archive.zip dir/       # 最佳压缩
zip -e archive.zip file.txt      # 加密压缩

# 解压
unzip archive.zip                # 解压到当前目录
unzip archive.zip -d /path/      # 解压到指定目录
unzip -l archive.zip             # 查看内容
unzip -t archive.zip             # 测试完整性

# 高级操作
zip -r archive.zip dir/ -x "*.log"  # 排除文件
unzip archive.zip "*.txt"           # 只解压特定文件
zip -u archive.zip newfile.txt      # 更新压缩文件
zip -d archive.zip oldfile.txt      # 删除文件
```

### 10.3 学习资源

- zip 手册：`man zip`
- unzip 手册：`man unzip`
- Info-ZIP 官网：http://www.info-zip.org/
- Linux 文档项目：https://tldp.org/

### 相关文档

- [使用 SDKMAN 管理 Java 版本](./使用SDKMAN管理Java版本.md)
- [命令行参数详解](./命令行参数详解.md)
- [Linux 文件和目录操作](./Linux文件和目录操作.md)
- [Linux 文件权限管理](./Linux文件权限管理.md)

---

通过掌握 zip 和 unzip 工具，你可以高效地压缩和解压文件，这对于文件传输、备份和归档管理都非常有用。建议在日常工作中多加练习，熟悉各种参数和使用场景。
