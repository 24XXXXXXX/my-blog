---
title: "Spring Boot 与 MyBatis 面试题"
description: "覆盖 Spring Boot 自动配置、IOC、AOP、Bean 生命周期与 MyBatis 核心机制的高频面试题"
keywords: "面试,Spring Boot,MyBatis,IOC,AOP,自动配置"

date: 2026-04-22T10:12:00+08:00
lastmod: 2026-04-22T10:12:00+08:00

math: false
mermaid: false

categories:
  - 面试
tags:
  - Spring Boot
  - MyBatis
---
这篇文章聚焦 Java 后端岗位中的框架类高频问题，适合准备 Spring Boot 和 MyBatis 相关面试。
<!--more-->

## 一、Spring Boot 基础

### 1. Spring Boot 的核心特性？

- 自动配置
- 起步依赖
- 内嵌服务器
- Actuator 监控能力

### 2. Spring Boot 自动配置的原理？

核心思路：

`@SpringBootApplication` -> `@EnableAutoConfiguration` -> 自动配置类装载 -> 条件注解决定是否生效

面试展开可答：

- 启动时加载自动配置元数据
- 找到候选自动配置类
- 结合 `@ConditionalOnClass`、`@ConditionalOnMissingBean`、`@ConditionalOnProperty` 等条件注解决定是否注册 Bean

### 3. `@SpringBootApplication` 由哪些注解组成？

- `@SpringBootConfiguration`
- `@EnableAutoConfiguration`
- `@ComponentScan`

### 4. `application.yml` 和 `application.properties` 的区别？

- `yml` 层级清晰，适合复杂配置
- `properties` 扁平简单

## 二、Spring 核心机制

### 1. IOC 和 AOP 是什么？

IOC：

- 把对象创建和依赖管理交给 Spring 容器

AOP：

- 在不改业务代码的前提下织入公共逻辑

常见场景：

- 日志
- 事务
- 权限
- 性能统计

### 2. AOP 的实现方式？

- JDK 动态代理
- CGLIB 动态代理

### 3. Spring Bean 的生命周期？

1. 实例化
2. 属性填充
3. Aware 回调
4. `BeanPostProcessor` 前置处理
5. 初始化
6. `BeanPostProcessor` 后置处理
7. 使用
8. 销毁

### 4. Bean 的作用域有哪些？

- `singleton`
- `prototype`
- `request`
- `session`
- `application`

### 5. `@Autowired` 和 `@Resource` 的区别？

- `@Autowired` 默认按类型注入
- `@Resource` 默认按名称注入

### 6. Spring Boot 常用注解？

- `@RestController`
- `@RequestMapping`
- `@Service`
- `@Component`
- `@Repository`
- `@Configuration`
- `@Bean`

## 三、Spring Boot 进阶应用

### 1. 如何统一异常处理？

使用：

- `@ControllerAdvice`
- `@ExceptionHandler`

### 2. 如何配置拦截器？

1. 实现 `HandlerInterceptor`
2. 通过 `WebMvcConfigurer` 注册

### 3. 如何配置跨域？

- `@CrossOrigin`
- `WebMvcConfigurer#addCorsMappings`

### 4. 配置文件加载优先级怎么理解？

通常可概括为：

- 命令行参数优先级最高
- 外部配置高于内部配置

### 5. 如何理解 Starter 机制？

Starter = 依赖聚合 + 自动配置。

开发者只需要引入 starter，就能获得一组默认可用的配置能力。

## 四、MyBatis 基础

### 1. `#{}` 和 `${}` 的区别？

- `#{}`：预编译，占位符方式，防 SQL 注入
- `${}`：字符串拼接，存在 SQL 注入风险

### 2. `resultMap` 和 `resultType` 的区别？

- `resultType`：适合简单自动映射
- `resultMap`：适合复杂映射和关联映射

### 3. MyBatis 接口绑定方式有哪些？

- XML 映射文件
- 注解方式，如 `@Select`

### 4. MyBatis 如何分页？

- 使用 `PageHelper`
- 手写 `limit`

## 五、MyBatis 进阶

### 1. 一级缓存和二级缓存？

一级缓存：

- `SqlSession` 级别
- 默认开启

二级缓存：

- `Mapper namespace` 级别
- 需要手动开启

### 2. 如何处理关联查询？

- `association`：一对一
- `collection`：一对多

### 3. 动态 SQL 标签有哪些？

- `if`
- `choose`
- `when`
- `otherwise`
- `where`
- `set`
- `foreach`
- `trim`
- `sql`

### 4. MyBatis 插件原理？

基于 JDK 动态代理，拦截四大对象：

- `Executor`
- `StatementHandler`
- `ParameterHandler`
- `ResultSetHandler`

## 六、重点准备建议

Spring Boot 和 MyBatis 面试里最常被深挖的点通常是：

- 自动配置原理
- IOC 和 AOP
- Bean 生命周期
- `@Autowired` 与 `@Resource`
- `#{}` 和 `${}`
- 一级缓存与二级缓存

准备时建议同时配一个项目实例来回答，例如权限拦截、统一异常处理、分页查询、动态 SQL。
