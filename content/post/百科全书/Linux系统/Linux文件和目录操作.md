---
title: "Linux 文件和目录操作完全指南"
description: "详细介绍 Linux 系统中创建目录、查看文件内容、编辑文件的所有方法和技巧"
keywords: "Linux,mkdir,cat,less,more,vim,nano,文件操作,目录创建"

date: 2026-03-26T13:00:00+08:00
lastmod: 2026-03-26T13:00:00+08:00

math: false
mermaid: false

categories:
  - 百科全书
tags:
  - Linux
  - 文件操作
  - 系统管理
---

本文详细介绍 Linux 系统中创建目录、递归创建目录、查看文件内容、编辑文件内容的所有方法和实用技巧。

<!--more-->

## 一、创建目录

### 1.1 mkdir 命令基础

`mkdir`（make directory）是 Linux 中创建目录的基本命令。

#### 基本语法

```bash
mkdir [选项] 目录名
```

#### 创建单个目录

```bash
# 在当前目录创建目录
mkdir mydir

# 创建指定路径的目录
mkdir /home/user/mydir

# 创建相对路径目录
mkdir ../mydir
mkdir ./subdir
```

#### 创建多个目录

```bash
# 同时创建多个目录
mkdir dir1 dir2 dir3

# 创建多个不同路径的目录
mkdir /tmp/dir1 /home/user/dir2 /var/log/dir3
```

### 1.2 递归创建目录

使用 `-p` 或 `--parents` 选项可以递归创建多级目录。

```bash
# 递归创建多级目录
mkdir -p /path/to/deep/directory

# 如果父目录不存在，会自动创建
mkdir -p project/src/main/java/com/example

# 创建多个多级目录
mkdir -p dir1/subdir1 dir2/subdir2 dir3/subdir3

# 实用示例：创建项目结构
mkdir -p myproject/{src,bin,lib,docs,tests}
mkdir -p myproject/src/{main,test}/{java,resources}
```

### 1.3 设置目录权限

```bash
# 创建目录并设置权限
mkdir -m 755 mydir
mkdir -m 700 private_dir

# 等同于
mkdir mydir && chmod 755 mydir

# 递归创建并设置权限
mkdir -p -m 755 /path/to/dir
```

### 1.4 mkdir 常用选项

```bash
# -p, --parents: 递归创建目录，父目录不存在时自动创建
mkdir -p /a/b/c/d

# -m, --mode: 设置权限模式
mkdir -m 755 mydir

# -v, --verbose: 显示详细信息
mkdir -v mydir
mkdir -pv /path/to/deep/dir

# -Z: 设置 SELinux 安全上下文
mkdir -Z mydir

# 组合使用
mkdir -pv -m 755 /path/to/dir
```

### 1.5 实用示例

```bash
# 创建日期命名的目录
mkdir $(date +%Y%m%d)
mkdir backup_$(date +%Y%m%d_%H%M%S)

# 创建带空格的目录名（使用引号）
mkdir "My Documents"
mkdir 'Project Files'

# 批量创建编号目录
mkdir dir{1..10}
mkdir folder_{a..z}
mkdir test{01..20}

# 创建复杂的项目结构
mkdir -p project/{src/{main/{java,resources,webapp},test/{java,resources}},target,docs,scripts}

# 创建 Web 项目结构
mkdir -p website/{html,css,js,images,fonts,assets}

# 创建日志目录结构
mkdir -p logs/{nginx,mysql,app}/{$(date +%Y)/{01..12}}
```

---

## 二、查看文件内容

Linux 提供了多种查看文件内容的命令，适用于不同场景。

### 2.1 cat 命令

`cat`（concatenate）用于显示文件内容，适合查看小文件。

#### 基本用法

```bash
# 查看文件内容
cat file.txt

# 查看多个文件
cat file1.txt file2.txt

# 合并文件内容
cat file1.txt file2.txt > merged.txt

# 追加内容
cat file1.txt >> file2.txt
```

#### 常用选项

```bash
# -n: 显示行号
cat -n file.txt

# -b: 只给非空行编号
cat -b file.txt

# -s: 压缩连续空行为一行
cat -s file.txt

# -E: 在每行末尾显示 $
cat -E file.txt

# -T: 将 Tab 显示为 ^I
cat -T file.txt

# -A: 显示所有不可见字符（等同于 -vET）
cat -A file.txt

# 组合使用
cat -n -s file.txt
```

#### 实用示例

```bash
# 创建文件并输入内容（Ctrl+D 结束）
cat > newfile.txt
This is line 1
This is line 2
^D

# 追加内容到文件
cat >> file.txt
Additional content
^D

# 查看多个文件并显示行号
cat -n file1.txt file2.txt

# 反向显示文件内容
tac file.txt

# 查看文件并分页
cat file.txt | less
```

### 2.2 less 命令

`less` 是一个强大的文件查看器，适合查看大文件，支持向前和向后浏览。

#### 基本用法

```bash
# 查看文件
less file.txt

# 查看多个文件
less file1.txt file2.txt

# 从管道读取
command | less
ps aux | less
```

#### less 内部命令

```bash
# 导航命令（在 less 中使用）
空格键 或 f        # 向下翻页
b                 # 向上翻页
d                 # 向下翻半页
u                 # 向上翻半页
j 或 Enter        # 向下一行
k                 # 向上一行
g                 # 跳到文件开头
G                 # 跳到文件末尾
数字+G            # 跳到指定行（如 100G）
/pattern          # 向下搜索
?pattern          # 向上搜索
n                 # 重复上次搜索（向下）
N                 # 重复上次搜索（向上）
q                 # 退出
h                 # 显示帮助
:n                # 查看下一个文件
:p                # 查看上一个文件
v                 # 使用编辑器编辑当前文件
```

#### 常用选项

```bash
# -N: 显示行号
less -N file.txt

# -S: 不换行显示长行
less -S file.txt

# -i: 搜索时忽略大小写
less -i file.txt

# -I: 总是忽略大小写
less -I file.txt

# -X: 退出后不清屏
less -X file.txt

# +F: 实时查看文件更新（类似 tail -f）
less +F /var/log/syslog

# +/pattern: 打开文件并搜索
less +/error log.txt

# +行号: 打开文件并跳到指定行
less +100 file.txt

# 组合使用
less -N -i -S file.txt
```

### 2.3 more 命令

`more` 是较早的分页查看器，功能比 less 简单，只能向前浏览。

```bash
# 查看文件
more file.txt

# 常用操作
空格键            # 向下翻页
Enter            # 向下一行
q                # 退出
/pattern         # 搜索
n                # 重复搜索
=                # 显示当前行号
:f               # 显示文件名和当前行号

# 选项
more -d file.txt      # 显示友好的提示信息
more -c file.txt      # 清屏后显示
more +10 file.txt     # 从第 10 行开始显示
more +/pattern file.txt  # 从匹配行开始显示
```

### 2.4 head 命令

`head` 用于查看文件开头部分。

```bash
# 查看前 10 行（默认）
head file.txt

# 查看前 N 行
head -n 20 file.txt
head -20 file.txt

# 查看前 N 字节
head -c 100 file.txt

# 查看多个文件
head file1.txt file2.txt

# 查看除最后 N 行外的所有内容
head -n -10 file.txt

# 实用示例
head -n 1 file.txt           # 查看第一行
head -n 5 *.txt              # 查看所有 txt 文件的前 5 行
ls -lt | head -n 10          # 查看最新的 10 个文件
```

### 2.5 tail 命令

`tail` 用于查看文件末尾部分，常用于查看日志。

```bash
# 查看最后 10 行（默认）
tail file.txt

# 查看最后 N 行
tail -n 20 file.txt
tail -20 file.txt

# 查看最后 N 字节
tail -c 100 file.txt

# 从第 N 行开始显示
tail -n +10 file.txt

# 实时查看文件更新（最常用）
tail -f /var/log/syslog
tail -f app.log

# 实时查看并显示行号
tail -f -n 100 app.log | cat -n

# 查看多个文件
tail file1.txt file2.txt

# 实时查看多个文件
tail -f file1.log file2.log

# 实用示例
tail -n 1 file.txt                    # 查看最后一行
tail -f /var/log/nginx/access.log    # 实时查看 Nginx 访问日志
tail -f -n 0 app.log                  # 只显示新增内容
tail -f app.log | grep ERROR          # 实时过滤错误日志
```

### 2.6 grep 查看和搜索

`grep` 用于在文件中搜索文本模式。

```bash
# 基本搜索
grep "pattern" file.txt

# 忽略大小写
grep -i "pattern" file.txt

# 显示行号
grep -n "pattern" file.txt

# 显示匹配的行数
grep -c "pattern" file.txt

# 反向匹配（显示不匹配的行）
grep -v "pattern" file.txt

# 递归搜索目录
grep -r "pattern" /path/to/dir

# 只显示文件名
grep -l "pattern" *.txt

# 显示匹配行的上下文
grep -C 3 "pattern" file.txt    # 上下各 3 行
grep -A 3 "pattern" file.txt    # 后 3 行
grep -B 3 "pattern" file.txt    # 前 3 行

# 使用正则表达式
grep -E "pattern1|pattern2" file.txt

# 搜索多个文件
grep "pattern" file1.txt file2.txt

# 实用示例
grep -rn "TODO" .                    # 递归搜索 TODO 并显示行号
grep -i "error" /var/log/syslog     # 搜索错误日志
ps aux | grep nginx                  # 搜索进程
grep -v "^#" config.conf | grep -v "^$"  # 过滤注释和空行
```

### 2.7 其他查看命令

#### nl - 显示行号

```bash
# 显示行号
nl file.txt

# 只给非空行编号
nl -b a file.txt

# 自定义行号格式
nl -n rz -w 3 file.txt
```

#### od - 以八进制或其他格式显示

```bash
# 以八进制显示
od file.txt

# 以十六进制显示
od -x file.txt

# 以字符形式显示
od -c file.txt
```

#### hexdump - 十六进制查看

```bash
# 十六进制查看
hexdump file.txt

# 规范格式
hexdump -C file.txt
```

#### strings - 显示二进制文件中的可打印字符

```bash
# 查看二进制文件中的字符串
strings binary_file

# 指定最小字符串长度
strings -n 10 binary_file
```

---

## 三、编辑文件内容

Linux 提供了多种文本编辑器，从简单到复杂，适合不同需求。

### 3.1 vim/vi 编辑器

Vim 是功能最强大的文本编辑器之一。

#### 基本操作

```bash
# 打开文件
vim file.txt
vi file.txt

# 创建新文件
vim newfile.txt

# 以只读模式打开
vim -R file.txt
view file.txt

# 打开文件并跳到指定行
vim +10 file.txt
vim +/pattern file.txt

# 同时打开多个文件
vim file1.txt file2.txt
```

#### Vim 模式

Vim 有三种主要模式：

1. **命令模式（Normal Mode）**：默认模式，用于导航和执行命令
2. **插入模式（Insert Mode）**：用于输入文本
3. **命令行模式（Command Mode）**：用于执行复杂命令

#### 模式切换

```bash
# 进入插入模式
i          # 在光标前插入
a          # 在光标后插入
o          # 在下一行插入
O          # 在上一行插入
I          # 在行首插入
A          # 在行尾插入

# 返回命令模式
Esc        # 从任何模式返回命令模式

# 进入命令行模式
:          # 从命令模式进入
```

#### 基本编辑命令

```bash
# 保存和退出
:w         # 保存
:w filename  # 另存为
:q         # 退出
:wq        # 保存并退出
:x         # 保存并退出（同 :wq）
:q!        # 强制退出不保存
ZZ         # 保存并退出（命令模式）
ZQ         # 不保存退出（命令模式）

# 删除
x          # 删除光标处字符
dd         # 删除当前行
dw         # 删除一个单词
d$         # 删除到行尾
d^         # 删除到行首
5dd        # 删除 5 行

# 复制和粘贴
yy         # 复制当前行
yw         # 复制一个单词
y$         # 复制到行尾
5yy        # 复制 5 行
p          # 在光标后粘贴
P          # 在光标前粘贴

# 撤销和重做
u          # 撤销
Ctrl+r     # 重做

# 查找和替换
/pattern   # 向下查找
?pattern   # 向上查找
n          # 下一个匹配
N          # 上一个匹配
:s/old/new/       # 替换当前行第一个
:s/old/new/g      # 替换当前行所有
:%s/old/new/g     # 替换全文所有
:%s/old/new/gc    # 替换全文所有（确认）

# 导航
h, j, k, l  # 左、下、上、右
w          # 下一个单词开头
b          # 上一个单词开头
0          # 行首
^          # 行首（第一个非空字符）
$          # 行尾
gg         # 文件开头
G          # 文件末尾
10G        # 第 10 行
Ctrl+f     # 向下翻页
Ctrl+b     # 向上翻页
```

#### 高级功能

```bash
# 可视模式
v          # 字符可视模式
V          # 行可视模式
Ctrl+v     # 块可视模式

# 多文件编辑
:e file2.txt    # 打开另一个文件
:bn             # 下一个文件
:bp             # 上一个文件
:ls             # 列出所有打开的文件
:b2             # 切换到第 2 个文件

# 分屏
:split file2.txt   # 水平分屏
:vsplit file2.txt  # 垂直分屏
Ctrl+w w           # 切换窗口
Ctrl+w q           # 关闭当前窗口

# 执行外部命令
:!command          # 执行命令
:r !command        # 插入命令输出
```

详细的 Vim 使用请参考：[编辑器使用指南](./编辑器.md)

### 3.2 nano 编辑器

Nano 是一个简单易用的文本编辑器，适合初学者。

```bash
# 打开文件
nano file.txt

# 创建新文件
nano newfile.txt

# 以只读模式打开
nano -v file.txt
```

#### Nano 快捷键

```bash
# 基本操作
Ctrl+O     # 保存（Write Out）
Ctrl+X     # 退出
Ctrl+G     # 显示帮助

# 编辑
Ctrl+K     # 剪切当前行
Ctrl+U     # 粘贴
Ctrl+6     # 标记文本开始
Alt+6      # 复制标记的文本
Ctrl+K     # 剪切标记的文本

# 导航
Ctrl+A     # 行首
Ctrl+E     # 行尾
Ctrl+Y     # 上一页
Ctrl+V     # 下一页
Alt+\      # 文件开头
Alt+/      # 文件末尾

# 搜索和替换
Ctrl+W     # 搜索
Ctrl+\     # 替换
Alt+W      # 重复搜索

# 其他
Ctrl+C     # 显示光标位置
Ctrl+_     # 跳到指定行
Alt+U      # 撤销
Alt+E      # 重做
```

详细的 Nano 使用请参考：[编辑器使用指南](./编辑器.md)

### 3.3 emacs 编辑器

Emacs 是另一个功能强大的编辑器。

```bash
# 打开文件
emacs file.txt

# 无图形界面模式
emacs -nw file.txt
```

#### Emacs 基本快捷键

```bash
# 文件操作
Ctrl+x Ctrl+f  # 打开文件
Ctrl+x Ctrl+s  # 保存
Ctrl+x Ctrl+w  # 另存为
Ctrl+x Ctrl+c  # 退出

# 编辑
Ctrl+d         # 删除字符
Ctrl+k         # 删除到行尾
Ctrl+w         # 剪切
Alt+w          # 复制
Ctrl+y         # 粘贴
Ctrl+/         # 撤销

# 导航
Ctrl+a         # 行首
Ctrl+e         # 行尾
Ctrl+n         # 下一行
Ctrl+p         # 上一行
Ctrl+f         # 前进一个字符
Ctrl+b         # 后退一个字符
Alt+f          # 前进一个单词
Alt+b          # 后退一个单词

# 搜索
Ctrl+s         # 向前搜索
Ctrl+r         # 向后搜索
```

详细的 Emacs 使用请参考：[编辑器使用指南](./编辑器.md)


### 3.4 sed 流编辑器

`sed` 是一个强大的流编辑器，适合批量处理文本。

#### 基本用法

```bash
# 替换文本（不修改原文件）
sed 's/old/new/' file.txt

# 替换所有匹配（全局替换）
sed 's/old/new/g' file.txt

# 直接修改文件
sed -i 's/old/new/g' file.txt

# 备份后修改
sed -i.bak 's/old/new/g' file.txt

# 删除行
sed '3d' file.txt              # 删除第 3 行
sed '1,5d' file.txt            # 删除 1-5 行
sed '/pattern/d' file.txt      # 删除匹配的行

# 插入和追加
sed '3i\New line' file.txt     # 在第 3 行前插入
sed '3a\New line' file.txt     # 在第 3 行后追加

# 打印特定行
sed -n '5p' file.txt           # 打印第 5 行
sed -n '1,10p' file.txt        # 打印 1-10 行
sed -n '/pattern/p' file.txt   # 打印匹配的行
```

#### 实用示例

```bash
# 删除空行
sed '/^$/d' file.txt

# 删除注释行
sed '/^#/d' file.txt

# 删除空行和注释行
sed -e '/^$/d' -e '/^#/d' file.txt

# 在每行前添加行号
sed = file.txt | sed 'N;s/\n/\t/'

# 替换多个模式
sed -e 's/old1/new1/g' -e 's/old2/new2/g' file.txt

# 只替换第 N 次出现
sed 's/old/new/2' file.txt     # 替换每行第 2 次出现

# 大小写转换
sed 's/.*/\U&/' file.txt        # 转大写
sed 's/.*/\L&/' file.txt        # 转小写

# 在匹配行后插入内容
sed '/pattern/a\New content' file.txt

# 替换特定行
sed '5s/old/new/' file.txt     # 只替换第 5 行
```

### 3.5 awk 文本处理

`awk` 是强大的文本分析工具，适合处理结构化文本。

#### 基本用法

```bash
# 打印所有行
awk '{print}' file.txt

# 打印特定列
awk '{print $1}' file.txt      # 第 1 列
awk '{print $1, $3}' file.txt  # 第 1 和第 3 列
awk '{print $NF}' file.txt     # 最后一列

# 指定分隔符
awk -F: '{print $1}' /etc/passwd
awk -F',' '{print $1, $2}' data.csv

# 条件过滤
awk '$3 > 100' file.txt        # 第 3 列大于 100
awk '/pattern/' file.txt       # 包含 pattern 的行
awk '$1 == "value"' file.txt   # 第 1 列等于 value

# 计算
awk '{sum += $1} END {print sum}' file.txt  # 求和
awk '{print $1 * $2}' file.txt              # 乘法

# 格式化输出
awk '{printf "%-10s %5d\n", $1, $2}' file.txt
```

#### 实用示例

```bash
# 统计文件行数
awk 'END {print NR}' file.txt

# 打印行号和内容
awk '{print NR, $0}' file.txt

# 过滤并打印
awk '$3 > 100 {print $1, $3}' file.txt

# 统计字段出现次数
awk '{count[$1]++} END {for (i in count) print i, count[i]}' file.txt

# 计算平均值
awk '{sum += $1; count++} END {print sum/count}' file.txt

# 处理 CSV 文件
awk -F',' '{print $1, $2}' data.csv

# 多条件过滤
awk '$3 > 100 && $4 < 200' file.txt
```

### 3.6 echo 和重定向

使用 `echo` 和重定向可以快速创建或修改文件。

```bash
# 创建文件并写入内容
echo "Hello World" > file.txt

# 追加内容
echo "New line" >> file.txt

# 写入多行
echo -e "Line 1\nLine 2\nLine 3" > file.txt

# 使用 Here Document
cat > file.txt << EOF
Line 1
Line 2
Line 3
EOF

# 追加多行
cat >> file.txt << EOF
Additional line 1
Additional line 2
EOF

# 创建空文件
> file.txt
touch file.txt

# 清空文件内容
> file.txt
```

### 3.7 tee 命令

`tee` 可以同时输出到屏幕和文件。

```bash
# 输出到文件并显示
echo "Hello" | tee file.txt

# 追加到文件
echo "World" | tee -a file.txt

# 输出到多个文件
echo "Content" | tee file1.txt file2.txt

# 结合管道使用
ls -la | tee output.txt

# 追加并显示
command | tee -a log.txt
```

### 3.8 其他编辑工具

#### ed - 行编辑器

```bash
# 打开文件
ed file.txt

# 基本命令
a          # 追加文本
i          # 插入文本
d          # 删除行
p          # 打印行
w          # 保存
q          # 退出
```

#### ex - 扩展的 ed

```bash
# 使用 ex 编辑
ex file.txt

# 执行命令后退出
ex -c '%s/old/new/g' -c 'wq' file.txt
```

#### patch - 应用补丁

```bash
# 创建补丁
diff -u original.txt modified.txt > changes.patch

# 应用补丁
patch original.txt < changes.patch

# 反向应用补丁
patch -R original.txt < changes.patch
```

---

## 四、文件操作实用技巧

### 4.1 批量创建文件和目录

```bash
# 批量创建文件
touch file{1..10}.txt
touch {a..z}.txt

# 批量创建目录
mkdir dir{1..10}
mkdir {2020..2025}/{01..12}

# 创建复杂结构
mkdir -p project/{src,bin,lib}/{main,test}

# 使用循环创建
for i in {1..10}; do
    mkdir "dir_$i"
    touch "dir_$i/file.txt"
done
```

### 4.2 查找和过滤

```bash
# 查找大文件
find . -type f -size +100M

# 查找最近修改的文件
find . -type f -mtime -7

# 查找并查看内容
find . -name "*.log" -exec tail -n 10 {} \;

# 递归搜索文本
grep -r "pattern" /path/to/dir

# 查找并替换
find . -name "*.txt" -exec sed -i 's/old/new/g' {} \;
```

### 4.3 文件内容比较

```bash
# 比较两个文件
diff file1.txt file2.txt

# 并排比较
diff -y file1.txt file2.txt

# 统一格式比较
diff -u file1.txt file2.txt

# 忽略空白差异
diff -w file1.txt file2.txt

# 比较目录
diff -r dir1 dir2

# 使用 vimdiff
vimdiff file1.txt file2.txt
```

### 4.4 文件内容统计

```bash
# 统计行数、单词数、字节数
wc file.txt

# 只统计行数
wc -l file.txt

# 只统计单词数
wc -w file.txt

# 只统计字节数
wc -c file.txt

# 统计字符数
wc -m file.txt

# 统计多个文件
wc *.txt
```

### 4.5 文件排序和去重

```bash
# 排序
sort file.txt

# 数字排序
sort -n file.txt

# 反向排序
sort -r file.txt

# 按第 N 列排序
sort -k 2 file.txt

# 去重
sort file.txt | uniq

# 统计重复次数
sort file.txt | uniq -c

# 只显示重复的行
sort file.txt | uniq -d

# 只显示不重复的行
sort file.txt | uniq -u
```

### 4.6 文件分割和合并

```bash
# 按行数分割
split -l 1000 largefile.txt part_

# 按大小分割
split -b 10M largefile.txt part_

# 按数字后缀分割
split -d -l 1000 largefile.txt part_

# 合并文件
cat part_* > merged.txt

# 按顺序合并
cat part_aa part_ab part_ac > merged.txt
```

---

## 五、常见场景示例

### 5.1 日志文件处理

```bash
# 实时查看日志
tail -f /var/log/syslog

# 查看最近 100 行
tail -n 100 /var/log/app.log

# 搜索错误日志
grep -i "error" /var/log/app.log

# 统计错误数量
grep -c "ERROR" /var/log/app.log

# 查看特定时间段的日志
sed -n '/2026-03-26 10:00/,/2026-03-26 11:00/p' app.log

# 过滤并保存
grep "ERROR" app.log > errors.log

# 实时过滤日志
tail -f app.log | grep --line-buffered "ERROR"
```

### 5.2 配置文件编辑

```bash
# 查看配置（过滤注释和空行）
grep -v "^#" /etc/nginx/nginx.conf | grep -v "^$"

# 备份后编辑
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
vim /etc/nginx/nginx.conf

# 批量替换配置
sed -i 's/old_value/new_value/g' /etc/app/config.conf

# 在配置文件中添加行
echo "new_config=value" >> /etc/app/config.conf

# 检查配置语法
nginx -t
```

### 5.3 数据文件处理

```bash
# 提取 CSV 特定列
awk -F',' '{print $1, $3}' data.csv

# 过滤数据
awk -F',' '$3 > 100' data.csv

# 统计数据
awk -F',' '{sum += $2} END {print sum}' data.csv

# 转换格式
awk -F',' '{print $1 "\t" $2}' data.csv > data.tsv

# 合并多个 CSV
cat file1.csv file2.csv > merged.csv

# 去除重复行
sort data.csv | uniq > unique.csv
```

### 5.4 脚本文件编辑

```bash
# 创建脚本
cat > script.sh << 'EOF'
#!/bin/bash
echo "Hello World"
EOF

# 添加执行权限
chmod +x script.sh

# 编辑脚本
vim script.sh

# 检查脚本语法
bash -n script.sh

# 调试脚本
bash -x script.sh
```

### 5.5 批量文件操作

```bash
# 批量重命名
for file in *.txt; do
    mv "$file" "${file%.txt}.bak"
done

# 批量修改内容
for file in *.conf; do
    sed -i 's/old/new/g' "$file"
done

# 批量创建文件
for i in {1..100}; do
    echo "Content $i" > "file_$i.txt"
done

# 批量查看文件
for file in *.log; do
    echo "=== $file ==="
    tail -n 5 "$file"
done
```

---

## 六、快速参考

### 6.1 目录操作命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `mkdir` | 创建目录 | `mkdir mydir` |
| `mkdir -p` | 递归创建目录 | `mkdir -p a/b/c` |
| `mkdir -m` | 创建并设置权限 | `mkdir -m 755 mydir` |
| `rmdir` | 删除空目录 | `rmdir mydir` |
| `rm -r` | 递归删除目录 | `rm -r mydir` |
| `ls` | 列出目录内容 | `ls -la` |
| `cd` | 切换目录 | `cd /path/to/dir` |
| `pwd` | 显示当前目录 | `pwd` |

### 6.2 查看文件命令

| 命令 | 功能 | 适用场景 |
|------|------|----------|
| `cat` | 显示全部内容 | 小文件 |
| `less` | 分页查看 | 大文件，可前后翻页 |
| `more` | 分页查看 | 大文件，只能向前 |
| `head` | 查看开头 | 查看文件前几行 |
| `tail` | 查看末尾 | 查看文件后几行 |
| `tail -f` | 实时查看 | 日志文件 |
| `grep` | 搜索内容 | 查找特定文本 |
| `nl` | 显示行号 | 需要行号的场景 |

### 6.3 编辑文件命令

| 命令 | 类型 | 难度 | 适用场景 |
|------|------|------|----------|
| `vim/vi` | 全屏编辑器 | 中高 | 强大的编辑功能 |
| `nano` | 全屏编辑器 | 低 | 简单易用 |
| `emacs` | 全屏编辑器 | 高 | 功能丰富 |
| `sed` | 流编辑器 | 中 | 批量文本处理 |
| `awk` | 文本处理 | 中高 | 结构化文本分析 |
| `echo >` | 重定向 | 低 | 快速创建简单文件 |
| `cat >` | 重定向 | 低 | 创建多行文件 |

### 6.4 常用快捷键

#### Vim 快捷键

| 快捷键 | 功能 |
|--------|------|
| `i` | 进入插入模式 |
| `Esc` | 返回命令模式 |
| `:w` | 保存 |
| `:q` | 退出 |
| `:wq` | 保存并退出 |
| `dd` | 删除行 |
| `yy` | 复制行 |
| `p` | 粘贴 |
| `u` | 撤销 |
| `/pattern` | 搜索 |

#### Nano 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+O` | 保存 |
| `Ctrl+X` | 退出 |
| `Ctrl+K` | 剪切行 |
| `Ctrl+U` | 粘贴 |
| `Ctrl+W` | 搜索 |
| `Ctrl+\` | 替换 |
| `Ctrl+G` | 帮助 |

---

## 七、最佳实践

### 7.1 文件操作建议

1. **备份重要文件**
   ```bash
   cp important.conf important.conf.bak
   cp -a /etc/config /backup/config_$(date +%Y%m%d)
   ```

2. **使用版本控制**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **谨慎使用 rm 命令**
   ```bash
   # 使用 -i 选项确认删除
   rm -i file.txt
   
   # 或使用 trash-cli
   trash file.txt
   ```

4. **使用绝对路径**
   ```bash
   # 避免误操作
   mkdir /home/user/project/data
   ```

### 7.2 编辑文件建议

1. **编辑前备份**
   ```bash
   cp config.conf config.conf.bak
   vim config.conf
   ```

2. **使用版本控制**
   ```bash
   git diff config.conf
   git commit -am "Update config"
   ```

3. **测试配置文件**
   ```bash
   nginx -t
   apache2ctl configtest
   ```

4. **使用临时文件**
   ```bash
   vim temp.txt
   # 确认无误后
   mv temp.txt target.txt
   ```

### 7.3 安全建议

1. **检查文件权限**
   ```bash
   ls -l file.txt
   chmod 644 file.txt
   ```

2. **避免以 root 编辑**
   ```bash
   # 使用 sudo 仅在必要时
   sudo vim /etc/config
   ```

3. **验证文件完整性**
   ```bash
   md5sum file.txt
   sha256sum file.txt
   ```

4. **定期备份**
   ```bash
   # 自动备份脚本
   rsync -av /important/data /backup/
   ```

---

## 八、总结

本文详细介绍了 Linux 系统中文件和目录操作的完整知识，包括：

1. **创建目录**：mkdir 命令的基本用法、递归创建、权限设置
2. **查看文件内容**：cat、less、more、head、tail、grep 等多种方法
3. **编辑文件内容**：vim、nano、emacs、sed、awk 等编辑器和工具
4. **实用技巧**：批量操作、查找过滤、文件比较、内容统计
5. **常见场景**：日志处理、配置编辑、数据处理、脚本编辑
6. **快速参考**：命令对照表、快捷键汇总
7. **最佳实践**：安全建议、备份策略

### 关键要点

- 使用 `mkdir -p` 递归创建多级目录
- 根据文件大小选择合适的查看命令（cat/less/more）
- 使用 `tail -f` 实时查看日志文件
- 掌握至少一种文本编辑器（推荐 vim 或 nano）
- 使用 sed/awk 进行批量文本处理
- 编辑重要文件前务必备份
- 合理使用管道和重定向提高效率

### 相关文档

- [Linux 编辑器使用指南](./编辑器.md)
- [Linux 文件权限管理](./Linux文件权限管理.md)
- [Ubuntu 命令大全](../计算机操作系统/Ubuntu命令大全.md)
