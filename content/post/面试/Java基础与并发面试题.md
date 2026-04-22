---
title: "Java 基础与并发面试题"
description: "覆盖 Java 数据类型、面向对象、集合框架与并发编程的高频面试题与参考答案"
keywords: "面试,Java,集合,HashMap,线程池,并发"

date: 2026-04-20T10:10:00+08:00
lastmod: 2026-04-20T10:10:00+08:00

math: false
mermaid: false

categories:
  - 面试
tags:
  - Java
  - 并发
---
这篇文章聚焦 Java 后端面试中的基础语法、面向对象、集合框架与并发编程，适合一轮基础复习和高频题口述训练。
<!--more-->

## 一、变量与数据类型

### 1. Java 有哪些基本数据类型？各自占多少字节？

Java 有 8 种基本数据类型：

- `byte`：1 字节
- `short`：2 字节
- `int`：4 字节
- `long`：8 字节
- `float`：4 字节
- `double`：8 字节
- `char`：2 字节
- `boolean`：Java 规范未规定固定字节数，表示 `true/false`

面试注意：

- `boolean` 不要机械回答成固定 `1 bit`
- `char` 一般按 2 字节理解

### 2. `==` 和 `equals()` 的区别？

- `==`：
  - 基本类型比值
  - 引用类型比地址
- `equals()`：
  - 默认也是比地址
  - 若类重写了 `equals()`，则一般比内容

### 3. 自动装箱和拆箱是什么？有什么坑？

- 自动装箱：`int -> Integer`
- 自动拆箱：`Integer -> int`

常见坑：

- `Integer` 缓存池是 `-128 ~ 127`
- 包装类型为 `null` 时拆箱会抛 `NullPointerException`
- 包装类型用 `==` 比较时容易出现误判

### 4. `String`、`StringBuilder`、`StringBuffer` 的区别？

- `String`：不可变
- `StringBuilder`：可变，线程不安全，性能高
- `StringBuffer`：可变，线程安全，性能低于 `StringBuilder`

### 5. `int` 和 `Integer` 的区别？

- `int` 是基本类型
- `Integer` 是包装类型
- `Integer` 可为 `null`
- 泛型场景只能使用包装类型

## 二、面向对象

### 1. 重载和重写的区别？

重载：

- 同一个类中
- 方法名相同，参数列表不同

重写：

- 父子类之间
- 方法签名相同
- 子类重写父类实现

### 2. 接口和抽象类的区别？

接口：

- 强调规范
- 支持多实现
- JDK 8 后可有默认方法

抽象类：

- 强调公共实现复用
- 只能单继承
- 可有成员变量、构造器和普通方法

### 3. Java 的四大特性？

- 封装
- 继承
- 多态
- 抽象

### 4. 多态的实现条件？

- 有继承或实现关系
- 子类重写父类方法
- 父类引用指向子类对象

### 5. Java 是单继承还是多继承？为什么？

- 类单继承
- 接口多实现

原因：

- 避免类多继承带来的复杂性和菱形问题

## 三、集合框架

### 1. `ArrayList` 和 `LinkedList` 的区别？

`ArrayList`：

- 动态数组
- 随机访问快
- 中间插入删除可能需要移动元素

`LinkedList`：

- 双向链表
- 插入删除在已知节点位置更高效
- 随机访问慢

### 2. `HashMap` 的底层结构？

JDK 8 中是：

- 数组
- 链表
- 红黑树

冲突链表长度达到 8 且数组容量至少 64 时会树化。

### 3. `HashMap` 的扩容机制？

- 默认容量 16
- 默认负载因子 0.75
- 超过阈值后扩容为 2 倍

### 4. `HashMap` 线程安全吗？用什么替代？

- 不安全
- 并发场景用 `ConcurrentHashMap`

### 5. `ConcurrentHashMap` 为什么线程安全？JDK 7 和 JDK 8 的区别？

JDK 7：

- `Segment` 分段锁

JDK 8：

- `CAS + synchronized`
- 锁粒度更细

### 6. `HashSet` 的底层是什么？

基于 `HashMap` 实现，元素作为 key，value 是固定占位对象。

## 四、多线程与并发

### 1. 创建线程的几种方式？

- 继承 `Thread`
- 实现 `Runnable`
- 实现 `Callable` 配合 `FutureTask`
- 使用线程池

### 2. `synchronized` 和 `ReentrantLock` 的区别？

`synchronized`：

- JVM 关键字
- 自动释放锁

`ReentrantLock`：

- JDK API
- 需要手动释放锁
- 支持公平锁、可中断锁、尝试加锁

### 3. 线程池核心参数有哪些？

- `corePoolSize`
- `maximumPoolSize`
- `keepAliveTime`
- `unit`
- `workQueue`
- `threadFactory`
- `handler`

### 4. 线程池的工作流程？

1. 先使用核心线程
2. 核心线程满后进入队列
3. 队列满后再创建非核心线程
4. 达到最大线程数后执行拒绝策略

### 5. 四种拒绝策略？

- `AbortPolicy`
- `CallerRunsPolicy`
- `DiscardPolicy`
- `DiscardOldestPolicy`

### 6. `volatile` 的作用？

- 保证可见性
- 禁止指令重排
- 不保证原子性

### 7. `ThreadLocal` 是什么？有什么问题？

`ThreadLocal` 用于线程隔离变量副本。

问题：

- 在线程池场景下若不 `remove()`，可能造成内存泄漏

## 五、复习建议

Java 面试里最容易被追问的点通常是：

- `HashMap`
- `ConcurrentHashMap`
- 线程池
- `synchronized` 和 `ReentrantLock`
- `volatile`
- `ThreadLocal`

准备时建议把每个问题都练成 1 分钟内可完整回答的版本。
