---
title: "Vue3 前端基础面试题"
description: "覆盖 Vue3、Composition API、ref、reactive、Vite 与 Axios 拦截器的基础面试题整理"
keywords: "面试,Vue3,Vite,ref,reactive,Axios"

date: 2026-04-20T10:22:00+08:00
lastmod: 2026-04-20T10:22:00+08:00

math: false
mermaid: false

categories:
  - 面试
tags:
  - Vue3
  - 前端
---
这篇文章适合后端岗位补充前端基础认知，重点掌握 Vue3 的常见概念即可。
<!--more-->

## 1. Vue3 和 Vue2 的区别？

- Vue3 引入 Composition API
- 对 TypeScript 支持更好
- 响应式系统从 `Object.defineProperty` 升级到 `Proxy`
- 支持 Fragment 等能力

## 2. 组合式 API 和选项式 API 的区别？

- 组合式 API：按功能组织逻辑，复用性更强
- 选项式 API：按 `data`、`methods`、`computed` 等选项组织

## 3. `ref` 和 `reactive` 的区别？

- `ref` 常用于基本类型，也可包装对象
- `reactive` 主要用于对象和数组
- `ref` 在 JavaScript 中访问通常要 `.value`

## 4. Vite 和 Webpack 的区别？

- Vite 基于原生 ESM，开发阶段启动更快
- Webpack 生态成熟，适合传统大型项目

## 5. Axios 拦截器有什么用？

- 请求拦截：统一加 Token、公共参数
- 响应拦截：统一处理错误码、登录失效、异常提示

## 6. Vue3 生命周期钩子有哪些？

- `onMounted`
- `onUpdated`
- `onUnmounted`

## 7. 后端岗位要准备到什么程度？

通常做到以下程度就够：

- 能说明 Vue2 和 Vue3 的主要区别
- 知道 `ref` 和 `reactive`
- 知道 Axios 拦截器和前后端鉴权配合
- 能理解 Vite 是更现代的前端构建工具
