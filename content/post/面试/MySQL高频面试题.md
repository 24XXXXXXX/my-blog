---
title: "MySQL 高频面试题"
description: "覆盖 MySQL 基础 SQL、索引、事务、锁、MVCC 与 EXPLAIN 的高频面试题整理"
keywords: "面试,MySQL,索引,事务,锁,MVCC,EXPLAIN"

date: 2026-04-20T10:14:00+08:00
lastmod: 2026-04-20T10:14:00+08:00

math: false
mermaid: false

categories:
  - 面试
tags:
  - MySQL
  - 数据库
---
MySQL 是后端岗位最容易被深挖的模块之一，尤其是索引、事务、锁和执行计划。这篇文章按面试高频顺序做系统整理。
<!--more-->

## 一、基础 SQL

### 1. SQL 的基本 CRUD 语句？

```sql
SELECT * FROM table_name WHERE condition;
INSERT INTO table_name(col1, col2) VALUES (v1, v2);
UPDATE table_name SET col1 = v1 WHERE condition;
DELETE FROM table_name WHERE condition;
```

### 2. `WHERE` 和 `HAVING` 的区别？

- `WHERE`：分组前过滤
- `HAVING`：分组后过滤

### 3. `GROUP BY` 和 `ORDER BY` 的区别？

- `GROUP BY`：分组聚合
- `ORDER BY`：排序

### 4. `INNER JOIN`、`LEFT JOIN`、`RIGHT JOIN` 的区别？

- `INNER JOIN`：取交集
- `LEFT JOIN`：保留左表全部数据
- `RIGHT JOIN`：保留右表全部数据

## 二、索引

### 1. 索引的作用？

- 提高查询效率
- 降低磁盘 I/O
- 提升排序、分组、关联效率

代价：

- 占空间
- 影响写入性能

### 2. 索引的底层结构？为什么是 B+ 树？

InnoDB 常用 B+ 树。

原因：

- 非叶子节点只存 key，扇出更大
- 树高更低，I/O 更少
- 叶子节点链表化，范围查询性能好

### 3. 聚簇索引和非聚簇索引的区别？

聚簇索引：

- 数据按主键组织存储

非聚簇索引：

- 索引和数据访问路径分离
- InnoDB 二级索引叶子节点存的是主键值

### 4. 什么是回表？如何避免？

回表：

- 通过二级索引查到主键
- 再回主键索引查完整行数据

避免方式：

- 使用覆盖索引

### 5. 什么是最左前缀原则？

联合索引如 `(a, b, c)`，查询条件要尽量从左到右连续使用索引列。

### 6. 联合索引 `(a, b, c)`，`WHERE a = 1 AND c = 3` 能走索引吗？

- `a` 可以部分利用索引
- `c` 一般不能充分利用联合索引

### 7. 索引失效的场景？

- 对索引列做函数运算
- 隐式类型转换
- `LIKE '%xx'`
- 不满足最左前缀
- `OR` 使用不当

### 8. `EXPLAIN` 重点看哪些字段？

- `type`
- `key`
- `rows`
- `Extra`

常见关注点：

- `Using index`
- `Using filesort`
- `Using temporary`

## 三、事务

### 1. ACID 是什么？

- 原子性
- 一致性
- 隔离性
- 持久性

### 2. 事务隔离级别有哪些？

- 读未提交
- 读已提交
- 可重复读
- 串行化

MySQL InnoDB 默认是可重复读。

### 3. 什么是脏读、不可重复读、幻读？

脏读：

- 读到未提交数据

不可重复读：

- 同一行数据前后读取结果不同

幻读：

- 同一条件前后查询出的记录条数不同

## 四、锁

### 1. MySQL 如何解决幻读？

常见回答：

- 快照读依赖 MVCC
- 当前读依赖 Next-Key Lock

### 2. 乐观锁和悲观锁的区别？

乐观锁：

- 假设冲突少
- 版本号或 CAS

悲观锁：

- 假设冲突多
- 如 `select ... for update`

### 3. InnoDB 行锁有哪几种？

- `Record Lock`
- `Gap Lock`
- `Next-Key Lock`

## 五、MVCC

### 1. MVCC 的实现原理？

核心组成：

- 隐藏字段，如 `trx_id`、`roll_pointer`
- `Undo Log`
- `ReadView`

理解方式：

- 数据更新会形成版本链
- 一致性读通过可见性规则读取合适版本

## 六、面试优先级建议

MySQL 面试最该优先准备的是：

1. 索引底层结构
2. 最左前缀和回表
3. `EXPLAIN`
4. 事务隔离级别
5. 幻读、MVCC、Next-Key Lock

如果时间有限，至少把这五类问题练熟。
