# Claude Code 开发规范

本文档为 Claude Code 项目的开发人员提供编码规范和最佳实践指南。

## 项目概述

Claude Code 是一个基于 TypeScript/React 构建的 AI 编程助手，使用 Bun 作为运行时，Rolldown 作为打包工具。

### 技术栈

- **运行时**: Bun 1.1+
- **语言**: TypeScript 5.5+
- **UI框架**: React 18
- **打包工具**: Rolldown
- **代码规范**: Biome
- **Schema验证**: Zod

## 目录结构规范

```
src/
├── commands/          # CLI 命令实现 (103 个子目录)
├── components/        # React 组件 (146 个子目录)
├── hooks/             # React Hooks (87 个子目录)
├── services/          # 业务服务层
├── tools/             # Agent 工具实现
├── utils/             # 工具函数 (331 个文件)
├── state/             # 状态管理
├── types/             # TypeScript 类型定义
├── entrypoints/       # 程序入口点
├── migrations/        # 数据迁移脚本
├── skills/            # 技能系统
├── cli/               # CLI 相关模块
├── context/           # React Context
├── bridge/            # 桥接通信模块
├── constants/         # 常量定义
├── schemas/           # Zod Schema
├── migrations/        # 数据库迁移
├── plugins/           # 插件系统
└── *.ts/*.tsx         # 核心模块文件
```

## TypeScript 规范

### 导入规则

1. **ANT-ONLY 导入标记**: 使用 biome-ignore 注释标记内部导入，不能重排序

```typescript
// biome-ignore-all assist/source/organizeImports: ANT-ONLY import markers must not be reordered
import antOnlyFeature from './ant-only/feature.js'
```

2. **条件导入**: 用于实现 Dead Code Elimination (DCE)

```typescript
/* eslint-disable @typescript-eslint/no-require-imports */
const conditionalFeature = feature('FEATURE_FLAG')
  ? require('./features/conditional.js').default
  : null
/* eslint-enable @typescript-eslint/no-require-imports */
```

3. **动态导入**: 优先用于快速路径，减少启动时间

```typescript
if (args[0] === '--version') {
  console.log(MACRO.VERSION);
  return;
}
// 延迟加载完整模块
const { heavyModule } = await import('./heavy.js');
```

### 类型定义

1. **统一类型位置**: 核心类型集中在 `types/` 目录
2. **使用 Zod Schema**: 数据验证使用 Zod，在 `schemas/` 目录定义
3. **导出类型**: 关键类型需要在入口文件重新导出

```typescript
// Re-export for backwards compatibility
export type { ToolPermissionRulesBySource }
```

## 组件规范

### React 组件

1. **文件命名**: 使用 PascalCase (如 `MyComponent.tsx`)
2. **组件结构**: 组件文件应包含类型、组件逻辑、样式
3. **Hooks 约定**: 自定义 Hook 放在 `hooks/` 目录，使用 `use` 前缀

### Hooks 开发

1. 复杂 hooks 应有详细的参数类型定义
2. 使用 `useCallback` 和 `useMemo` 优化性能
3. 避免在 hooks 中直接调用外部 API

## 工具系统 (Tools)

### 工具架构

核心工具定义在 `src/tools/` 目录：

- **AgentTool**: 子 Agent 执行
- **BashTool**: Shell 命令执行
- **FileEditTool**: 文件编辑
- **FileReadTool**: 文件读取
- **WebSearchTool**: 网络搜索
- **GrepTool**: 代码搜索
- **TaskOutputTool**: 任务输出
- **McpTool**: MCP 服务器集成

### 工具注册

工具在 `src/tools.ts` 中注册，使用条件导入实现特性开关。

## 服务层 (Services)

### 服务分类

- **API 服务**: `services/api/` - 与后端通信
- **MCP 服务**: `services/mcp/` - Model Context Protocol
- **Analytics 服务**: `services/analytics/` - 分析追踪
- **Compact 服务**: `services/compact/` - 上下文压缩
- **Voice 服务**: `services/voice.ts` - 语音功能

### 服务依赖

服务层不应直接依赖 UI 层，保持职责分离。

## CLI 开发规范

### 入口点

CLI 入口点在 `src/entrypoints/cli.tsx`，使用 Commander.js 处理命令行参数。

### 快速路径优化

- `--version` 等简单命令应零模块加载
- 使用动态导入延迟加载重型模块
- 利用 `feature()` 函数进行 Dead Code Elimination

## 状态管理

### AppState

应用状态定义在 `src/state/AppState.tsx`，使用 React 状态管理。

### 选择器

状态选择器放在 `src/state/selectors.ts`。

## 迁移脚本

### 迁移命名

迁移文件使用 `migrate*.ts` 命名模式：

```typescript
// src/migrations/migrateAutoUpdatesToSettings.ts
```

### 执行时机

迁移在应用启动时自动执行。

## 代码质量

### Linting

使用 Biome 进行代码检查：

```bash
npm run lint        # 检查代码
npm run lint:fix     # 自动修复
```

### TypeScript

```bash
npm run typecheck    # 类型检查
```

### 测试

```bash
npm test            # 运行测试
```

## 构建规范

### 开发构建

```bash
npm run dev         # 监视模式
```

### 生产构建

```bash
npm run build:prod  # 生产构建
```

### 输出入口

- `dist/main.js` - 主程序入口
- `dist/cli.js` - CLI 入口
- `dist/mcp.js` - MCP 服务器入口

## 性能优化

### 启动优化

1. 使用 `profileCheckpoint` 标记启动阶段
2. 预加载 MDM 设置和 Keychain
3. 延迟加载非关键模块

### 运行时优化

1. 使用 `memoize` 缓存计算结果
2. 虚拟滚动处理长列表
3. Web Worker 处理重型计算

## 安全规范

### 权限系统

- 工具执行需要权限确认
- 支持绕过权限模式 (Bypass Permissions Mode)
- 敏感操作需要明确用户授权

### 密钥管理

- 使用 Keychain 存储敏感信息
- 避免在代码中硬编码密钥

## 调试指南

### 启动诊断

```bash
claude-code --doctor
```

### 日志输出

使用 `logError` 和 `logEvent` 进行日志记录。

### 调试工具

- `src/commands/debug-tool-call/` - 工具调用调试
- `src/utils/debug.js` - 调试辅助函数

## 贡献流程

1. 遵循代码规范
2. 运行 `npm run lint:fix`
3. 运行 `npm run typecheck`
4. 确保所有测试通过
5. 提交前检查是否有循环依赖

## 注意事项

- 不要修改 `src/main.tsx` 中的导入顺序
- ANT-ONLY 代码使用条件导入
- 重大变更需要更新迁移脚本
- 新工具需要在 `tools.ts` 中注册
