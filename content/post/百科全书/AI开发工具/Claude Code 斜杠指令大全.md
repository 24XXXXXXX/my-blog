---
title: "Claude Code 斜杠指令大全：/ 命令完整速查"
date: 2026-05-15T21:25:00+08:00
draft: false
tags: ["Claude Code", "Claude", "Anthropic", "AI编程", "斜杠指令"]
categories: ["百科全书", "AI开发工具"]
description: "整理 Claude Code 内置 / 斜杠指令，涵盖模型切换、权限管理、MCP、子代理、上下文、远程会话、PR 审查、安全审查、调试等用法。"
---

## 快速说明

Claude Code 的 `/` 指令用于在交互式会话中控制当前编码任务。它可以切换模型、管理权限、压缩上下文、查看后台任务、启动计划模式、配置 MCP、管理 agents、审查 PR 等。

使用方式：

```text
/
```

在 Claude Code 输入框开头输入 `/`，会显示当前环境可用的命令。命令是否出现，会受版本、平台、套餐、登录状态、环境变量和是否启用云端能力影响。

> 本文按 2026-05-15 的 Claude Code 官方文档整理。  
> 官方参考：[Commands - Claude Code Docs](https://code.claude.com/docs/en/commands)

---

## 一、官方特别说明

Claude Code 的命令分两类：

- **内置命令**：CLI 本身实现的功能，例如 `/model`、`/permissions`、`/status`
- **Bundled skills**：以 skill 机制提供的命令，例如 `/batch`、`/simplify`、`/security-review`

还可能出现 MCP 服务器暴露的动态命令，格式通常是：

```text
/mcp__<server>__<prompt>
```

所以你本机看到的 `/` 列表，可能比官方表格更多或更少。

---

## 二、会话与上下文管理

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/clear [name]` | 开启空上下文新会话，并保留旧会话用于恢复 | 换任务、清空当前上下文 |
| `/compact [instructions]` | 总结当前对话以释放上下文 | 长任务中途压缩上下文 |
| `/context [all]` | 可视化当前上下文占用 | 查哪些内容占了大量窗口 |
| `/copy [N]` | 复制最近一次或第 N 次 assistant 回复 | 复制代码、总结或方案 |
| `/export [filename]` | 导出当前对话为文本 | 留档或分享排查记录 |
| `/resume [session]` | 恢复历史会话 | 继续旧任务 |
| `/branch [name]` | 从当前对话创建分支 | 尝试另一个方案 |
| `/fork` | `/branch` 的别名之一；特定环境下可能变成 fork subagent | 分支探索 |
| `/rename [name]` | 重命名当前会话 | 方便在历史会话中识别 |
| `/recap` | 生成当前会话的一行摘要 | 快速记录当前进度 |
| `/rewind` | 回退对话和/或代码到之前检查点 | 撤回错误方向 |
| `/checkpoint` | `/rewind` 的别名 | 回退检查点 |
| `/undo` | `/rewind` 的别名 | 撤销到较早状态 |
| `/exit` | 退出 CLI | 附着到后台会话时会脱离而不是停止 |
| `/quit` | `/exit` 的别名 | 退出 Claude Code |

常用：

```text
/compact 保留最终决策、已改文件、剩余 TODO
/context all
/resume
```

---

## 三、模型、推理强度与响应速度

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/model [model]` | 选择或切换模型 | 在 Sonnet、Opus 等模型间切换 |
| `/effort [level|auto]` | 设置推理强度 | 在低延迟和深度推理之间切换 |
| `/fast [on|off]` | 开关 fast mode | 需要更快响应时使用 |
| `/extra-usage` | 配置超出限制后的额外用量 | 触达限额后继续工作 |
| `/usage` | 查看费用、用量限制和活动统计 | 查当前会话用量 |
| `/cost` | `/usage` 的别名 | 查看费用/用量 |
| `/stats` | `/usage` 的别名 | 查看统计 |

推理强度常见值：

```text
low
medium
high
xhigh
max
auto
```

---

## 四、权限、安全与沙箱

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/permissions` | 管理 allow、ask、deny 权限规则 | 控制工具调用是否需要确认 |
| `/allowed-tools` | `/permissions` 的别名 | 老习惯命令 |
| `/sandbox` | 切换沙箱模式 | 在支持平台上限制执行环境 |
| `/privacy-settings` | 查看和更新隐私设置 | Pro/Max 订阅相关 |
| `/security-review` | 分析当前分支待提交改动的安全风险 | 查注入、鉴权、数据暴露等问题 |
| `/fewer-permission-prompts` | 扫描历史记录并优化只读命令 allowlist | 减少频繁权限弹窗 |

建议：

- 改权限前先确认当前仓库是否可信。
- 对不熟悉的项目，优先保守授权。

---

## 五、项目初始化、记忆与配置

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/init` | 生成项目 `CLAUDE.md` 指南 | 第一次在仓库使用 Claude Code |
| `/memory` | 编辑 `CLAUDE.md` 记忆文件，管理 auto-memory | 维护项目长期规则 |
| `/config` | 打开设置界面 | 调主题、模型、输出风格等 |
| `/settings` | `/config` 的别名 | 打开设置 |
| `/status` | 打开状态页，显示版本、模型、账号、连接状态 | 排查当前环境 |
| `/theme` | 切换终端主题 | 调整视觉显示 |
| `/keybindings` | 打开或创建快捷键配置 | 自定义按键 |
| `/terminal-setup` | 配置 Shift+Enter 等终端快捷键 | VS Code、Cursor、Windsurf 等终端 |
| `/tui [default|fullscreen]` | 设置终端 UI 渲染模式 | 切换普通/全屏渲染 |
| `/statusline` | 配置状态栏 | 显示模型、目录、Git 状态等 |
| `/scroll-speed` | 调整鼠标滚轮速度 | 全屏渲染下优化滚动体验 |
| `/color [color|default]` | 设置当前 session 提示栏颜色 | 区分多个会话 |
| `/focus` | 切换专注视图 | 只显示关键提示、工具摘要和最终回复 |

---

## 六、MCP、插件、IDE 与外部集成

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/mcp` | 管理 MCP server 连接和 OAuth 认证 | 添加、检查外部工具 |
| `/plugin` | 管理 Claude Code 插件 | 启用、查看插件 |
| `/reload-plugins` | 重新加载插件 | 修改插件后不重启生效 |
| `/skills` | 列出可用 skills | 查看哪些 skill 可被调用 |
| `/agents` | 管理 agent 配置 | 配置子代理 |
| `/ide` | 管理 IDE 集成并查看状态 | 连接 VS Code、JetBrains 等 |
| `/hooks` | 查看 hook 配置 | 检查工具事件钩子 |
| `/chrome` | 配置 Claude in Chrome | 浏览器集成相关 |
| `/desktop` | 在 Claude Code Desktop 中继续当前会话 | macOS/Windows 可用 |
| `/app` | `/desktop` 的别名 | 打开桌面端 |

---

## 七、后台任务、并行与远程会话

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/tasks` | 查看和管理后台任务 | 看后台 bash/agent 进展 |
| `/bashes` | `/tasks` 的别名 | 查看后台任务 |
| `/background [prompt]` | 把当前会话转为后台 agent | 释放终端继续跑任务 |
| `/bg` | `/background` 的别名 | 后台运行 |
| `/stop` | 停止当前后台会话 | 终止后台任务 |
| `/batch <instruction>` | 拆分大型改动并行执行 | 大规模迁移、重构 |
| `/loop [interval] [prompt]` | 定时重复执行 prompt | 轮询部署、定期检查 |
| `/proactive` | `/loop` 的别名 | 主动巡检 |
| `/goal [condition|clear]` | 设置持续目标 | 让 Claude 围绕目标持续工作 |
| `/remote-control` | 允许从 claude.ai 远程控制当前会话 | 多设备继续同一任务 |
| `/rc` | `/remote-control` 的别名 | 远程控制 |
| `/teleport` | 把 Claude Code web session 拉到本地终端 | 从云端会话切回本地 |
| `/tp` | `/teleport` 的别名 | 拉取远程会话 |
| `/remote-env` | 配置远程环境默认值 | web/remote session 相关 |

示例：

```text
/background 继续跑测试并修复失败项
/tasks
/loop 5m 检查部署是否完成
```

---

## 八、GitHub、PR 与代码质量

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/diff` | 打开交互式 diff 查看器 | 看未提交改动和每轮改动 |
| `/review [PR]` | 本地审查 PR | 让 Claude 看 PR 风险 |
| `/ultrareview [PR]` | 云端深度多代理代码审查 | 更深入的 PR 审查 |
| `/autofix-pr [prompt]` | 启动 web session 监听 PR，CI 或评论失败时自动修复 | 需要 `gh` 和 Claude Code web |
| `/pr-comments [PR]` | 查看 PR 评论 | v2.1.91 已移除；新版直接问 Claude |
| `/simplify [focus]` | 审查最近改动并修复复用、质量、效率问题 | 提交前优化代码 |
| `/install-github-app` | 安装 Claude GitHub Actions app | 配置仓库集成 |
| `/web-setup` | 用本地 `gh` 凭据连接 GitHub 到 Claude Code web | 云端能力前置配置 |

常见提交前流程：

```text
/diff
/simplify
/security-review
/review
```

---

## 九、Claude API、迁移与云端功能

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/claude-api [migrate|managed-agents-onboard]` | 加载 Claude API / Agent SDK 参考，支持迁移和 Managed Agents 引导 | 写 Anthropic SDK 项目 |
| `/ultraplan <prompt>` | 在云端 ultraplan session 起草计划 | 大任务先做深度计划 |
| `/schedule [description]` | 创建、更新、列出或运行 routines | 云端定时任务 |
| `/routines` | `/schedule` 的别名 | 管理 routines |
| `/setup-bedrock` | 配置 Amazon Bedrock | 使用 Bedrock 路由 |
| `/setup-vertex` | 配置 Google Vertex AI | 使用 Vertex 路由 |
| `/install-slack-app` | 安装 Claude Slack app | Slack 集成 |

---

## 十、账号、帮助与诊断

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/login` | 登录 Anthropic 账号 | 切换或登录 |
| `/logout` | 退出 Anthropic 账号 | 清理账号状态 |
| `/help` | 显示帮助和可用命令 | 忘记命令时使用 |
| `/doctor` | 诊断 Claude Code 安装和设置 | 检查环境问题 |
| `/debug [description]` | 开启调试日志并排查问题 | 分析运行异常 |
| `/heapdump` | 写出 JS heap snapshot 和内存分解 | 排查高内存 |
| `/feedback [report]` | 提交反馈或 bug | 反馈问题 |
| `/bug` | `/feedback` 的别名 | 报告 bug |
| `/release-notes` | 查看版本更新日志 | 了解新功能和变更 |
| `/powerup` | 通过交互课程发现功能 | 学习 Claude Code 功能 |
| `/insights` | 分析 Claude Code 使用历史并生成报告 | 复盘项目使用模式 |
| `/team-onboarding` | 根据最近使用历史生成团队 onboarding 指南 | 给团队成员快速上手 |

---

## 十一、移动端、语音与订阅相关

| 指令 | 作用 | 常见用途 |
|---|---|---|
| `/mobile` | 显示 Claude 移动 App 下载二维码 | 手机端继续使用 |
| `/ios` | `/mobile` 的别名 | iOS 下载 |
| `/android` | `/mobile` 的别名 | Android 下载 |
| `/voice [hold|tap|off]` | 开关语音输入 | 需要 Claude.ai 账号 |
| `/passes` | 分享 Claude Code 免费周 | 仅符合资格账号可见 |
| `/upgrade` | 打开升级页面 | 升级套餐 |
| `/radio` | 打开 Claude FM lo-fi radio | 部分环境不可用 |
| `/stickers` | 订购 Claude Code 贴纸 | 周边入口 |

---

## 十二、已移除或版本相关的命令

| 指令 | 当前状态 |
|---|---|
| `/pr-comments [PR]` | v2.1.91 已移除；新版建议直接让 Claude 查看 PR 评论 |
| `/vim` | v2.1.92 已移除；新版在 `/config` → Editor mode 中配置 |

如果你本机仍能看到这些命令，说明版本较旧。

---

## 十三、完整指令索引

```text
/add-dir <path>
/agents
/autofix-pr [prompt]
/background [prompt]
/bg
/batch <instruction>
/branch [name]
/fork
/btw <question>
/chrome
/claude-api [migrate|managed-agents-onboard]
/clear [name]
/reset
/new
/color [color|default]
/compact [instructions]
/config
/settings
/context [all]
/copy [N]
/cost
/debug [description]
/desktop
/app
/diff
/doctor
/effort [level|auto]
/exit
/quit
/export [filename]
/extra-usage
/fast [on|off]
/feedback [report]
/bug
/fewer-permission-prompts
/focus
/goal [condition|clear]
/heapdump
/help
/hooks
/ide
/init
/insights
/install-github-app
/install-slack-app
/keybindings
/login
/logout
/loop [interval] [prompt]
/proactive
/mcp
/memory
/mobile
/ios
/android
/model [model]
/passes
/permissions
/allowed-tools
/plan [description]
/plugin
/powerup
/pr-comments [PR]
/privacy-settings
/radio
/recap
/release-notes
/reload-plugins
/remote-control
/rc
/remote-env
/rename [name]
/resume [session]
/continue
/review [PR]
/rewind
/checkpoint
/undo
/sandbox
/schedule [description]
/routines
/scroll-speed
/security-review
/setup-bedrock
/setup-vertex
/simplify [focus]
/skills
/stats
/status
/statusline
/stickers
/stop
/tasks
/bashes
/team-onboarding
/teleport
/tp
/terminal-setup
/theme
/tui [default|fullscreen]
/ultraplan <prompt>
/ultrareview [PR]
/upgrade
/usage
/vim
/voice [hold|tap|off]
/web-setup
```

---

## 十四、最常用命令推荐

如果只记一小部分，建议先记这些：

```text
/init
/memory
/model
/effort
/permissions
/plan
/compact
/context
/diff
/review
/security-review
/mcp
/agents
/tasks
/status
/doctor
```

这些命令覆盖了日常 Claude Code 工作流中的项目初始化、模型切换、权限控制、上下文管理、代码审查、外部工具和环境诊断。

