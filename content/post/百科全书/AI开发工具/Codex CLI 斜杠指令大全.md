---
title: "Codex CLI 斜杠指令大全：/ 命令完整速查"
date: 2026-05-15T21:20:00+08:00
draft: false
tags: ["Codex", "Codex CLI", "OpenAI", "AI编程", "斜杠指令"]
categories: ["百科全书", "AI开发工具"]
description: "整理 Codex CLI 中常用和内置的 / 斜杠指令，涵盖模型切换、权限管理、上下文压缩、插件、MCP、审查、状态查看等用法。"
---

## 快速说明

Codex CLI 的 `/` 指令用于在交互式会话中快速控制当前任务，例如切换模型、调整权限、查看 diff、压缩上下文、管理插件和 MCP 工具。

使用方式：

```text
/
```

在输入框里输入 `/` 会弹出可用指令列表；继续输入关键字可以筛选。不同版本、不同配置下，实际显示的指令可能略有差异。

> 本文按 2026-05-15 的 OpenAI 官方文档整理。  
> 官方参考：[Slash commands in Codex CLI](https://developers.openai.com/codex/cli/slash-commands)

---

## 一、会话与上下文

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/clear` | 清空终端并开始新聊天 | 想从一个干净上下文重新开始 |
| `/compact` | 总结当前对话，释放上下文空间 | 长任务跑久后保留要点，减少 token 占用 |
| `/copy` | 复制 Codex 最新完成的回复 | 快速复制方案、命令或总结 |
| `/side` | 开启临时侧边对话 | 问一个旁支问题，不污染主任务上下文 |
| `/fork` | 从当前会话 fork 一个新线程 | 试另一种方案，同时保留当前进度 |
| `/resume` | 恢复历史会话 | 继续之前的任务 |
| `/new` | 在同一个 CLI 中开始新对话 | 不退出 CLI，直接开新任务 |
| `/exit` | 退出 CLI | 等同 `/quit` |
| `/quit` | 退出 CLI | 等同 `/exit` |

补充：

- `/copy` 也可以通过快捷键 `Ctrl+O` 触发。
- `/compact` 适合在上下文很长、但任务还没结束时使用。

---

## 二、模型与响应风格

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/model` | 切换模型和 reasoning effort | 在速度、成本、推理深度之间切换 |
| `/fast` | 开关 Fast mode | 需要更快响应时使用 |
| `/personality` | 切换回复风格 | 让 Codex 更简洁、解释更多或更协作 |

常见用法：

```text
/model
/fast on
/fast off
/personality
```

---

## 三、权限、安全与沙箱

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/permissions` | 设置 Codex 不询问即可执行的权限范围 | 在只读、自动执行、手动确认之间切换 |
| `/sandbox-add-read-dir` | Windows 下给沙箱额外增加可读目录 | 让 Codex 读取当前工作区外的目录 |
| `/approvals` | `/permissions` 的兼容别名 | 老版本习惯用法，官方已不再显示在弹窗列表 |

建议：

- 不确定命令风险时，优先使用更严格的权限。
- 给沙箱增加目录时，只加确实需要的路径。

---

## 四、代码查看与审查

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/diff` | 查看当前 Git diff，包括未跟踪文件 | 检查 Codex 改了哪些内容 |
| `/review` | 让 Codex review 当前工作区改动 | 发现 bug、风险、遗漏测试 |
| `/mention` | 把文件或目录附加到当前对话 | 明确让 Codex 看某个文件 |

常见流程：

```text
/diff
/review
```

适合在提交前快速检查改动质量。

---

## 五、项目初始化与规则

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/init` | 在当前目录生成 `AGENTS.md` 指令文件 | 给项目写长期规则和协作说明 |
| `/status` | 查看当前会话配置、模型、权限、token 等 | 排查当前会话到底在什么状态 |
| `/debug-config` | 打印配置层级和诊断信息 | 排查配置优先级、策略要求和实验设置 |

`AGENTS.md` 常用于记录：

- 项目启动方式
- 测试命令
- 代码风格
- 不允许改动的区域
- 部署或构建注意事项

---

## 六、插件、MCP 与连接器

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/plugins` | 浏览、安装、管理插件 | 管理 Codex 扩展能力 |
| `/apps` | 浏览 apps/connectors，并插入到 prompt | 引用外部 app 或连接器 |
| `/mcp` | 查看已配置的 MCP 工具 | 确认外部工具是否已连接 |
| `/hooks` | 查看生命周期 hooks | 检查、信任或禁用 hook |

使用建议：

- 插件和 MCP 会扩展 Codex 能力，也可能增加权限面。
- 新增 hook 后，建议先检查它的执行内容再信任。

---

## 七、后台任务与长任务

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/ps` | 查看实验性后台终端和最近输出 | 观察长期运行的服务或测试 |
| `/stop` | 停止当前会话启动的后台终端 | 停掉 dev server、watcher 等后台进程 |
| `/goal` | 设置或查看实验性长任务目标 | 让 Codex 围绕一个目标持续推进 |
| `/plan` | 进入计划模式，可附带 prompt | 大改动前先让 Codex 出计划 |

示例：

```text
/plan 修复登录页表单校验问题
/goal 完成构建并通过测试
/ps
/stop
```

注意：`/goal` 需要启用 `features.goals`。

---

## 八、界面与快捷键配置

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/experimental` | 开关实验功能 | 测试新能力 |
| `/statusline` | 配置 TUI 底部状态栏字段 | 显示模型、上下文、Git、token 等 |
| `/title` | 配置终端窗口或标签标题字段 | 让终端标题显示项目、模型、任务状态 |
| `/keymap` | 重映射 TUI 快捷键 | 自定义终端交互方式 |

---

## 九、账号与反馈

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/logout` | 退出 Codex 登录 | 切换账号或清理共享机器登录状态 |
| `/feedback` | 向 Codex 维护者发送日志或反馈 | 反馈 bug、异常或建议 |

---

## 十、常用组合

### 1. 开始一个新项目

```text
/init
/status
/permissions
```

### 2. 大改动前先规划

```text
/plan 重构用户设置页面
/mention src/pages/settings
```

### 3. 长任务中途压缩上下文

```text
/compact 保留已做决策、剩余 TODO、测试结果
```

### 4. 提交前检查

```text
/diff
/review
```

### 5. 排查配置问题

```text
/status
/debug-config
/mcp
/plugins
```

---

## 十一、完整指令索引

```text
/permissions
/sandbox-add-read-dir
/agent
/apps
/plugins
/hooks
/clear
/compact
/copy
/diff
/exit
/experimental
/feedback
/init
/logout
/mcp
/mention
/model
/fast
/plan
/goal
/personality
/ps
/stop
/fork
/side
/resume
/new
/quit
/review
/status
/debug-config
/statusline
/title
/keymap
/approvals
```

---

## 最后建议

如果只记几个最常用的，建议先记：

```text
/model
/permissions
/plan
/compact
/diff
/review
/status
/init
```

这些基本覆盖了日常使用中的模型切换、权限控制、任务规划、上下文管理和提交前检查。

